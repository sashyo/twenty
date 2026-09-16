/**
 * Client-side reveal for minidauth-sealed fields.
 *
 * The server returns ms1: ciphertext (it holds no key that can read it). This module decrypts those
 * values in the browser: it holds a session key the server never sees, gets a session-bound doken
 * from minidauth, and runs the tide-js decrypt flow here. Every voucher carries a fresh proof of
 * possession only this tab can make; the server (sidecar) only relays vouchers and never sees
 * plaintext. No-op unless the server reports minidauth is enabled.
 */
// The tide-js bundle is pre-built (esbuild) and shipped as a plain module; it has no type surface.
// @ts-expect-error - no types for the vendored bundle
import * as Tide from './tidejs.browser.js';

const MARKER = 'ms1:';
export const isSealed = (v: unknown): v is string =>
  typeof v === 'string' && v.startsWith(MARKER);

type Session = {
  enabled: boolean;
  sidecar: string;
  uid: string;
  sign: (bytes: Uint8Array) => Promise<ArrayBuffer>;
  userDoken: string;
  cfg: any;
  decPolicy: Uint8Array;
  keyInfo: any;
};

const b64ToBytes = (b64: string): Uint8Array =>
  Uint8Array.from(atob(b64.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const bufToB64 = (buf: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(buf)));
const bufToB64url = (buf: ArrayBuffer): string =>
  bufToB64(buf).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

let sessionPromise: Promise<Session | null> | null = null;

const postText = async (base: string, path: string, body: unknown): Promise<string> => {
  const r = await fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`${path} -> ${r.status} ${t}`);
  return t;
};
const postJson = async (base: string, path: string, body: unknown): Promise<any> =>
  JSON.parse(await postText(base, path, body));

// Bootstrap once: session key -> a user token BOUND to it -> session-bound doken -> tide-js config.
const initSession = async (): Promise<Session | null> => {
  // A session keypair that never leaves this browser. Generated first, so the user token can be bound
  // to it: a token captured in transit is then useless without this key.
  const kp = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
  const sessionPubB64 = bufToB64(await crypto.subtle.exportKey('spki', (kp as CryptoKeyPair).publicKey));
  const sign = (bytes: Uint8Array) =>
    crypto.subtle.sign({ name: 'Ed25519' }, (kp as CryptoKeyPair).privateKey, bytes);

  const boot = await fetch('/minidauth/user-token?sessionKey=' + encodeURIComponent(sessionPubB64), {
    credentials: 'include',
  });
  if (!boot.ok) return null;
  const { enabled, sidecar, userToken } = await boot.json();
  if (!enabled || !sidecar || !userToken) return null;

  const { userDoken } = await postJson(sidecar, '/proxy/user-token', {
    userToken,
    sessionKey: sessionPubB64,
  });

  const cfg = await postJson(sidecar, '/proxy/config', {});
  const decPolicy = b64ToBytes((await postJson(sidecar, '/proxy/decrypt-policy', {})).policy);
  const keyInfo = await new Tide.NetworkClient(cfg.homeOrkUrl).GetKeyInfo(cfg.vvkId);

  // Derive the uid from the token (its sub) so proof of possession binds to the right identity.
  const uid = JSON.parse(atob(userToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).sub;
  return { enabled: true, sidecar, uid, sign, userDoken, cfg, decPolicy, keyInfo };
};

const session = (): Promise<Session | null> => {
  if (!sessionPromise) sessionPromise = initSession().catch(() => null);
  return sessionPromise;
};

/** Drop the cached session key and doken. Call this on sign-out / account change, so decryption does
 *  not continue for a user who has logged out and a different user does not inherit their session. */
export const resetMinidauthSession = (): void => {
  sessionPromise = null;
};

/** Open many ms1: ciphertexts in one cohort fan-out; returns plaintext aligned to the input order. */
export const decryptMany = async (cipherB64s: string[]): Promise<string[]> => {
  if (cipherB64s.length === 0) return [];
  const s = await session();
  if (!s) return cipherB64s; // not enabled / bootstrap failed: leave values as-is

  try {
    return await runDecrypt(s, cipherB64s);
  } catch (e) {
    // The doken may have expired (short TTL) or the account changed; drop the cached session so the
    // next read re-mints a fresh one (or gets nothing, if the user has logged out).
    resetMinidauthSession();
    throw e;
  }
};

const runDecrypt = async (s: Session, cipherB64s: string[]): Promise<string[]> => {
  const ciphers = cipherB64s.map((c) => b64ToBytes(c.startsWith(MARKER) ? c.slice(MARKER.length) : c));
  const gk = Tide.TideKey.NewKey(Tide.Ed25519Scheme);
  const gtok = { payload: { sessionKey: gk.get_public_component() }, serialize: () => '' };
  const pae = new Tide.PolicyAuthorizedEncryptionFlow({
    vendorId: s.cfg.vvkId, token: gtok, sessionKey: gk, voucherURL: '', keyInfo: s.keyInfo,
  });
  const { request } = pae.createDecryptionRequest(ciphers.map((c: Uint8Array) => ({ encrypted: c, tags: ['formbricks'] })));
  request.addPolicy(s.decPolicy);
  const df = new Tide.dVVKDecryptionFlow(s.cfg.vvkId, s.keyInfo.UserPublic, s.keyInfo.OrkInfo.slice(), gk, gtok, '');
  df.setVoucherRetrievalFunction(async (voucherRequest: string) => {
    const ts = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomUUID();
    // Bind the proof to this request, so a captured proof cannot be redirected to another decryption.
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(voucherRequest));
    const hashHex = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
    const popSig = bufToB64url(await s.sign(new TextEncoder().encode(`${s.uid}.${ts}.${nonce}.${hashHex}`)));
    return postText(s.sidecar, '/proxy/voucher', { voucherRequest, doken: s.userDoken, popTs: ts, popNonce: nonce, popSig });
  });
  const keys = await df.start(request);

  return Promise.all(ciphers.map(async (c: Uint8Array, i: number) => {
    const b = Tide.PPSF.deserialize(c);
    const out = b.encKey && b.encKey.length
      ? await Tide.AES.decryptDataRawOutput(b.encFieldChk, await Tide.AES.decryptDataRawOutput(b.encKey.slice(32), keys[i]))
      : await Tide.AES.decryptDataRawOutput(b.encFieldChk.slice(32), keys[i]);
    return new TextDecoder().decode(out);
  }));
};

/** Walk a GraphQL result, decrypt every ms1: string in place (batched into one fan-out). */
export const decryptInPlace = async (data: any): Promise<void> => {
  const leaves: { obj: any; key: string | number }[] = [];
  const walk = (node: any) => {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((v, i) => {
        if (isSealed(v)) leaves.push({ obj: node, key: i });
        else walk(v);
      });
      return;
    }
    for (const key of Object.keys(node)) {
      const v = node[key];
      if (isSealed(v)) leaves.push({ obj: node, key });
      else walk(v);
    }
  };
  walk(data);
  if (leaves.length === 0) return;
  try {
    const plains = await decryptMany(leaves.map((l) => l.obj[l.key]));
    leaves.forEach((l, i) => (l.obj[l.key] = plains[i]));
  } catch {
    // leave ciphertext in place on any failure (unauthorised reader, sidecar down): safe failure
  }
};
