/**
 * minidauth field sealing for Twenty workspace records.
 *
 * Seals selected personal fields of selected objects (e.g. a Person's name, emails and phone) with
 * minidauth before they reach Postgres, and opens them again on the way out. The crypto runs in the
 * minidauth-seal sidecar, which talks to minidauth and the Tide ORK cohort: this server, and
 * Postgres, only ever hold ciphertext. The vendor key lives as threshold shares across the ORK
 * network and is never assembled here, so a stolen database or a leaked backup is unreadable, and a
 * quorum - not this app - decides whether records can be read at all. Decryption is delegated per
 * user: the read path forwards the authenticated reader's verified identity to the sidecar, which
 * decrypts as that user only if minidauth's quorum grant says they hold the reading role. The sidecar
 * holds no reader identity of its own, so an unauthenticated caller who reaches it gets nothing.
 *
 * Off by default. Set MINIDAUTH_SEAL_URL to point at the sidecar to turn it on; unset, every path
 * below is a no-op and Twenty behaves exactly like upstream.
 *
 * This is a proof of concept. The read path batches: every sealed field across a whole page of
 * records opens in a single cohort fan-out (the sidecar's /open takes an array and gets back one key
 * per ciphertext), so a list view is one round trip, not one per field. The remaining limit is
 * queryability - sealed columns hold ciphertext, so the database cannot sort, filter, or search on
 * them. A production integration would also protect one per-record data key with the cohort and AES
 * the payload under it locally (envelope encryption), keeping sealed values addressable by a local
 * key while the cohort still governs who may unwrap it.
 */
import { createHmac, createPrivateKey, sign as edSign, type KeyObject } from 'crypto';
import { readFileSync } from 'fs';

// Read lazily, not at import time: @nestjs/config loads .env into process.env during bootstrap,
// after this module is first imported, so capturing it at module top-level would see undefined.
const sealUrl = (): string | undefined => process.env.MINIDAUTH_SEAL_URL;
export const isMinidauthSealEnabled = (): boolean => Boolean(sealUrl());

// When true, the server does NOT open sealed fields on read: it returns ms1: ciphertext to the client,
// which decrypts in the browser with its own session-bound doken. This is the strong mode: the server
// (and a compromised server) only ever holds ciphertext. Sealing on write is unchanged.
export const isMinidauthClientSideOpen = (): boolean =>
  process.env.MINIDAUTH_CLIENT_SIDE_OPEN === 'true' || process.env.MINIDAUTH_CLIENT_SIDE_OPEN === '1';

// How the per-read delegation token is signed. Prefer an Ed25519 private key that only this server
// holds (MINIDAUTH_SEAL_SIGNING_KEY_FILE): minidauth verifies it with the public half, so there is no
// shared secret to publish or leak. The HS256 secret is a fallback for a quick start only; a leak of
// it forges the identity of any granted user.
const readerTokenSecret = (): string | undefined => process.env.MINIDAUTH_SEAL_TOKEN_SECRET;

let cachedSigningKey: KeyObject | null | undefined;
const readerSigningKey = (): KeyObject | null => {
  if (cachedSigningKey === undefined) {
    const file = process.env.MINIDAUTH_SEAL_SIGNING_KEY_FILE;
    const pem = file ? readFileSync(file, 'utf8') : process.env.MINIDAUTH_SEAL_SIGNING_KEY;
    cachedSigningKey = pem ? createPrivateKey(pem) : null;
  }

  return cachedSigningKey;
};

const b64url = (b: Buffer | string): string =>
  Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// Mint a short-lived assertion that this already-authenticated user is the reader. Twenty has already
// verified the user (the uid comes from the request's workspace auth context, never from the client);
// this token just carries that verified identity to the sidecar, which re-verifies the signature and
// then decrypts as this uid. minidauth's quorum grant decides whether the uid may actually read. The
// sidecar holds no reader identity of its own, so nothing decrypts without one of these.
export function mintReaderToken(uid: string, cnf?: string): string {
  const now = Math.floor(Date.now() / 1000);
  // cnf binds the token to the caller's session key, so a captured token cannot be used to mint a
  // doken for a different key. Omitted only if the client did not present a session key.
  const claims: Record<string, unknown> = { sub: uid, iat: now, exp: now + 30 };
  if (cnf) claims.cnf = cnf;
  const payloadJson = JSON.stringify(claims);
  const key = readerSigningKey();
  if (key) {
    const header = b64url(JSON.stringify({ alg: 'EdDSA', typ: 'JWT' }));
    const payload = b64url(payloadJson);
    const sig = b64url(edSign(null, Buffer.from(`${header}.${payload}`), key));
    return `${header}.${payload}.${sig}`;
  }
  const secret = readerTokenSecret();
  if (!secret) {
    throw new Error('Set MINIDAUTH_SEAL_SIGNING_KEY_FILE (preferred) or MINIDAUTH_SEAL_TOKEN_SECRET');
  }
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(payloadJson);
  const sig = b64url(createHmac('sha256', secret).update(`${header}.${payload}`).digest());
  return `${header}.${payload}.${sig}`;
}

// object nameSingular -> the record subpaths whose string values are sealed. Composite fields
// (emails, phones, name) are nested objects on the record at this layer, so we address their leaves
// by dotted path; an "[]" leaf seals every string in a string array.
// Seal the personal fields you do NOT need the database to sort/filter/search on. Paths that a given
// object does not have are harmless no-ops (they resolve to zero leaves). Composite fields (emails,
// phones, name, links) are nested objects here, addressed by dotted path.
const SEALED_FIELDS: Record<string, string[]> = {
  person: [
    'name.firstName',
    'name.lastName',
    'emails.primaryEmail',
    'emails.additionalEmails[]',
    'phones.primaryPhoneNumber',
    'phones.additionalPhones[].number',
    'whatsapp.primaryPhoneNumber',
    'whatsapp.additionalPhones[].number',
    'linkedinLink.primaryLinkUrl',
    'xLink.primaryLinkUrl',
    'jobTitle',
    'city',
    'intro',
  ],
  // A second object, to show cross-object coverage. Note bodies/titles are free text, not list keys.
  note: ['title'],
};

const MARKER = 'ms1:'; // a sealed string column is "ms1:<ciphertextB64>"
const isSealed = (v: unknown): v is string => typeof v === 'string' && v.startsWith(MARKER);

async function sidecar(path: string, body: unknown, bearer?: string): Promise<any> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (bearer) headers['Authorization'] = `Bearer ${bearer}`; // the reader's delegation assertion, on /open
  const r = await fetch(sealUrl() + path, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`minidauth-seal ${path} -> ${r.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

// Resolve a dotted path to concrete { get, set } leaves on a record, so the same code can read and
// write the value in place. A segment ending in "[]" is an array: "a.b[]" is a string array (each
// element a leaf), and "a.b[].c" is an array of objects (each element's .c is a leaf). "[]" may appear
// anywhere in the path, so nested list fields (e.g. phones.additionalPhones[].number) are covered.
type Leaf = { get: () => unknown; set: (v: unknown) => void };
function leavesForPath(node: any, path: string): Leaf[] {
  return walkPath(node, path.split('.'));
}
function walkPath(node: any, segs: string[]): Leaf[] {
  if (node == null || typeof node !== 'object' || segs.length === 0) return [];
  const seg = segs[0];
  const rest = segs.slice(1);
  const isArray = seg.endsWith('[]');
  const key = isArray ? seg.slice(0, -2) : seg;
  if (isArray) {
    // Composite list fields (additionalPhones, additionalEmails) arrive at this layer as a JSON
    // STRING, not a parsed array. Parse it, seal inside, and write the re-serialized array back to the
    // same field after each set so the stored column holds sealed values.
    let arr = node[key];
    let jsonBacked = false;
    if (typeof arr === 'string') {
      try {
        const parsed = JSON.parse(arr);
        if (Array.isArray(parsed)) {
          arr = parsed;
          jsonBacked = true;
        }
      } catch {
        return [];
      }
    }
    if (!Array.isArray(arr)) return [];
    const writeBack = jsonBacked ? () => (node[key] = JSON.stringify(arr)) : () => undefined;
    if (rest.length === 0) {
      // string array: each element is a leaf
      return arr.map((_, i) => ({ get: () => arr[i], set: (v) => (void ((arr[i] = v), writeBack())) }));
    }
    // array of objects: seal the leaf named by the rest of the path in each element
    return arr.flatMap((el) =>
      walkPath(el, rest).map((leaf) => ({
        get: leaf.get,
        set: (v) => (void (leaf.set(v), writeBack())),
      })),
    );
  }
  if (rest.length === 0) {
    return [{ get: () => node[key], set: (v) => (node[key] = v) }];
  }
  return walkPath(node[key], rest);
}

function collectLeaves(objectName: string, record: any): Leaf[] {
  const paths = SEALED_FIELDS[objectName];
  if (!paths || record == null || typeof record !== 'object') return [];
  return paths.flatMap((p) => leavesForPath(record, p));
}

/** Seal the configured personal fields of these records in place (write path). */
export async function sealWorkspaceRecords(objectName: string, records: any[]): Promise<void> {
  if (!isMinidauthSealEnabled() || !SEALED_FIELDS[objectName]) return;
  for (const record of records) {
    // Seal every configured non-empty string. We do NOT skip values that already look sealed: a
    // client can forge the "ms1:" prefix, so the sidecar decides what is genuine ciphertext (it
    // returns those unchanged) and seals everything else. Trusting the prefix here would let a client
    // store un-sealed plaintext in a sealed column.
    const leaves = collectLeaves(objectName, record).filter((l) => {
      const v = l.get();
      return typeof v === 'string' && v.length > 0;
    });
    if (leaves.length === 0) continue;
    const fields: Record<string, string> = {};
    leaves.forEach((l, i) => (fields[String(i)] = l.get() as string));
    const { sealed } = await sidecar('/seal', { fields }); // returns marker-included values
    leaves.forEach((l, i) => l.set(sealed[String(i)]));
  }
}

let openWarned = false;
/** Open sealed fields of these records in place (read path), on behalf of the authenticated reader.
 *  `readerUid` is the verified user from the request's auth context; the sidecar decrypts as that
 *  user, gated by minidauth's quorum grant. Best-effort and fail-closed: no reader identity, an
 *  ungranted reader, or a sidecar that is down all leave the field sealed rather than crash the read -
 *  ciphertext is the safe failure. */
export async function openWorkspaceRecords(
  objectName: string,
  records: any[],
  readerUid?: string,
): Promise<void> {
  if (!isMinidauthSealEnabled() || !SEALED_FIELDS[objectName]) return;
  // Strong mode: leave everything sealed and let the browser decrypt with its own session-bound doken.
  if (isMinidauthClientSideOpen()) return;
  // Gather every sealed leaf across ALL records in this read, so the whole page decrypts in a single
  // sidecar call (one cohort fan-out), not one per record and not one per field.
  const leaves: Leaf[] = [];
  for (const record of records) {
    for (const l of collectLeaves(objectName, record)) {
      if (isSealed(l.get())) leaves.push(l);
    }
  }
  if (leaves.length === 0) return;
  // No authenticated reader in context (system job, unauthenticated path): fail closed, stay sealed.
  if (!readerUid) {
    if (!openWarned) {
      openWarned = true;
      // eslint-disable-next-line no-console
      console.warn('[minidauth-seal] no reader identity in context; leaving records sealed');
    }
    return;
  }
  try {
    const token = mintReaderToken(readerUid);
    const fields: Record<string, string> = {};
    leaves.forEach((l, i) => (fields[String(i)] = (l.get() as string).slice(MARKER.length)));
    const { fields: opened } = await sidecar('/open', { fields }, token); // one round trip, as this reader
    leaves.forEach((l, i) => l.set(opened[String(i)]));
  } catch (e) {
    if (!openWarned) {
      openWarned = true;
      // eslint-disable-next-line no-console
      console.warn('[minidauth-seal] leaving records sealed:', (e as Error).message);
    }
  }
}
