/**
 * minidauth field sealing for Twenty workspace records.
 *
 * Seals selected personal fields of selected objects (e.g. a Person's name, emails and phone) with
 * minidauth before they reach Postgres, and opens them again on the way out. The crypto runs in the
 * minidauth-seal sidecar, which talks to minidauth and the Tide ORK cohort: this server, and
 * Postgres, only ever hold ciphertext. The vendor key lives as threshold shares across the ORK
 * network and is never assembled here, so a stolen database or a leaked backup is unreadable, and a
 * quorum - not this app - decides whether records can be read at all (the sidecar's reader must hold
 * a quorum-granted role, or `open` returns nothing and the field stays sealed).
 *
 * Off by default. Set MINIDAUTH_SEAL_URL to point at the sidecar to turn it on; unset, every path
 * below is a no-op and Twenty behaves exactly like upstream.
 *
 * This is a proof of concept: each sealed field is one round trip to the cohort, so it suits a demo,
 * not a high-throughput deployment. A production integration would protect one per-record data key
 * with the cohort and AES the payload under it locally (envelope encryption) - one cohort op per
 * record rather than per field.
 */
const SEAL_URL = process.env.MINIDAUTH_SEAL_URL;
export const MINIDAUTH_SEAL_ENABLED = Boolean(SEAL_URL);

// object nameSingular -> the record subpaths whose string values are sealed. Composite fields
// (emails, phones, name) are nested objects on the record at this layer, so we address their leaves
// by dotted path; an "[]" leaf seals every string in a string array.
const SEALED_FIELDS: Record<string, string[]> = {
  person: [
    'name.firstName',
    'name.lastName',
    'emails.primaryEmail',
    'emails.additionalEmails[]',
    'phones.primaryPhoneNumber',
    'jobTitle',
    'city',
  ],
};

const MARKER = 'ms1:'; // a sealed string column is "ms1:<ciphertextB64>"
const isSealed = (v: unknown): v is string => typeof v === 'string' && v.startsWith(MARKER);

async function sidecar(path: string, body: unknown): Promise<any> {
  const r = await fetch(SEAL_URL + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`minidauth-seal ${path} -> ${r.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

// Resolve a dotted path (with a trailing "[]" for arrays) to concrete { container, key } leaves on a
// record, so the same code can read and write the value in place.
type Leaf = { get: () => unknown; set: (v: unknown) => void };
function leavesForPath(record: any, path: string): Leaf[] {
  const isArray = path.endsWith('[]');
  const parts = (isArray ? path.slice(0, -2) : path).split('.');
  let container = record;
  for (let i = 0; i < parts.length - 1; i++) {
    if (container == null || typeof container !== 'object') return [];
    container = container[parts[i]];
  }
  if (container == null || typeof container !== 'object') return [];
  const key = parts[parts.length - 1];
  if (!isArray) return [{ get: () => container[key], set: (v) => (container[key] = v) }];
  const arr = container[key];
  if (!Array.isArray(arr)) return [];
  return arr.map((_, idx) => ({ get: () => arr[idx], set: (v) => (arr[idx] = v) }));
}

function collectLeaves(objectName: string, record: any): Leaf[] {
  const paths = SEALED_FIELDS[objectName];
  if (!paths || record == null || typeof record !== 'object') return [];
  return paths.flatMap((p) => leavesForPath(record, p));
}

/** Seal the configured personal fields of these records in place (write path). */
export async function sealWorkspaceRecords(objectName: string, records: any[]): Promise<void> {
  if (!MINIDAUTH_SEAL_ENABLED || !SEALED_FIELDS[objectName]) return;
  for (const record of records) {
    const leaves = collectLeaves(objectName, record).filter((l) => {
      const v = l.get();
      return typeof v === 'string' && v.length > 0 && !isSealed(v);
    });
    if (leaves.length === 0) continue;
    const fields: Record<string, string> = {};
    leaves.forEach((l, i) => (fields[String(i)] = l.get() as string));
    const { sealed } = await sidecar('/seal', { fields });
    leaves.forEach((l, i) => l.set(MARKER + sealed[String(i)]));
  }
}

let openWarned = false;
/** Open sealed fields of these records in place (read path). Best-effort: if the reader is not
 *  allowed (role not granted, sidecar down), the field is left sealed rather than crashing the read -
 *  ciphertext is the safe failure. */
export async function openWorkspaceRecords(objectName: string, records: any[]): Promise<void> {
  if (!MINIDAUTH_SEAL_ENABLED || !SEALED_FIELDS[objectName]) return;
  for (const record of records) {
    const leaves = collectLeaves(objectName, record).filter((l) => isSealed(l.get()));
    if (leaves.length === 0) continue;
    try {
      const fields: Record<string, string> = {};
      leaves.forEach((l, i) => (fields[String(i)] = (l.get() as string).slice(MARKER.length)));
      const { fields: opened } = await sidecar('/open', { fields });
      leaves.forEach((l, i) => l.set(opened[String(i)]));
    } catch (e) {
      if (!openWarned) {
        openWarned = true;
        // eslint-disable-next-line no-console
        console.warn('[minidauth-seal] leaving records sealed:', (e as Error).message);
      }
    }
  }
}
