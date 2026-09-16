var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@tideorg/js/dist/Cryptide/Serialization.js
var Serialization_exports = {};
__export(Serialization_exports, {
  AuthorizerPack: () => AuthorizerPack,
  BigIntFromByteArray: () => BigIntFromByteArray,
  BigIntToByteArray: () => BigIntToByteArray,
  Byte: () => Byte,
  Bytes2Hex: () => Bytes2Hex,
  ConcatUint8Arrays: () => ConcatUint8Arrays,
  CreateTideMemory: () => CreateTideMemory,
  CreateTideMemoryFromArray: () => CreateTideMemoryFromArray,
  DeserializeNetworkKey: () => DeserializeNetworkKey,
  DeserializeTIDE_KEY: () => DeserializeTIDE_KEY,
  EdPointToJWK: () => EdPointToJWK,
  GVRK_Pack: () => GVRK_Pack,
  GetUID: () => GetUID,
  GetValue: () => GetValue,
  Hex2Bytes: () => Hex2Bytes,
  PadRight: () => PadRight,
  StringFromUint8Array: () => StringFromUint8Array,
  StringToUint8Array: () => StringToUint8Array,
  TryGetValue: () => TryGetValue,
  Uint8ArrayToNumber: () => Uint8ArrayToNumber,
  WriteValue: () => WriteValue,
  XOR: () => XOR,
  base64ToBase64Url: () => base64ToBase64Url,
  base64ToBytes: () => base64ToBytes,
  base64UrlToBase64: () => base64UrlToBase64,
  bitArrayAND: () => bitArrayAND,
  bitArrayToUint8Array: () => bitArrayToUint8Array,
  bytesToBase64: () => bytesToBase64,
  deserializeBitArray: () => deserializeBitArray,
  getBytesFromInt16: () => getBytesFromInt16,
  numberToUint8Array: () => numberToUint8Array,
  readInt64LittleEndian: () => readInt64LittleEndian,
  serializeBitArray: () => serializeBitArray,
  uint8ArrayToBitArray: () => uint8ArrayToBitArray,
  writeInt64LittleEndian: () => writeInt64LittleEndian
});

// node_modules/@tideorg/js/dist/Errors/TideError.js
var TideError = class _TideError extends Error {
  /** Canonical error code (see {@link TideErrorInit.code}). */
  code;
  /** UI-safe message (see {@link TideErrorInit.displayMessage}). */
  displayMessage;
  messageKey;
  messageParams;
  traceId;
  source;
  httpStatus;
  problemType;
  /** Full request URL when knowable (client-emitted network errors only). */
  url;
  /** Endpoint path portion of {@link url}. */
  endpoint;
  /** HTTP method of the failed request. */
  method;
  /** Per-attempt underlying failures, populated on aggregate errors only. */
  details;
  constructor(init) {
    super(init.displayMessage, init.cause !== void 0 ? { cause: init.cause } : void 0);
    Object.setPrototypeOf(this, _TideError.prototype);
    this.name = "TideError";
    this.code = init.code;
    this.displayMessage = init.displayMessage;
    this.messageKey = init.messageKey ?? null;
    this.messageParams = init.messageParams ?? null;
    this.traceId = init.traceId;
    this.source = init.source;
    this.httpStatus = init.httpStatus;
    this.problemType = init.problemType;
    this.url = init.url;
    this.endpoint = init.endpoint;
    this.method = init.method;
    this.details = init.details;
    if (init.cause !== void 0 && this.cause === void 0) {
      try {
        Object.defineProperty(this, "cause", {
          value: init.cause,
          writable: true,
          configurable: true
        });
      } catch {
      }
    }
  }
  /**
   * Developer-facing string form. Surfaces the most-useful debugging fields
   * (`method`, `url`, `source`, `httpStatus`, `cause`, and a summary of
   * `details` for aggregate errors) at the top of the printed error so a
   * dev opening the browser console sees them immediately instead of
   * having to expand `cause` or scroll through stack frames.
   *
   * Format example:
   *   TideError[TIDE-TIDEJS-NET-FETCH_FAILED]: Network request failed
   *     method:   POST
   *     url:      http://hostgateway:1002/Authentication/Auth/Convert?uid=...
   *     source:   Clients/ClientBase.ts:_post
   *     cause:    TypeError: Failed to fetch
   */
  toString() {
    const lines = [`TideError[${this.code}]: ${this.displayMessage}`];
    const pad = (label) => (label + ":").padEnd(10, " ");
    if (this.method)
      lines.push(`  ${pad("method")}${this.method}`);
    if (this.url)
      lines.push(`  ${pad("url")}${this.url}`);
    else if (this.endpoint)
      lines.push(`  ${pad("endpoint")}${this.endpoint}`);
    if (this.httpStatus !== void 0)
      lines.push(`  ${pad("status")}${this.httpStatus}`);
    if (this.source)
      lines.push(`  ${pad("source")}${this.source}`);
    if (this.traceId)
      lines.push(`  ${pad("traceId")}${this.traceId}`);
    if (this.details && this.details.length > 0) {
      lines.push(`  ${pad("details")}${this.details.length} underlying failure(s):`);
      for (const d of this.details) {
        const tag = d.url ?? d.endpoint ?? "<unknown>";
        const codePart = d.code ? ` [${d.code}]` : "";
        const msgPart = d.displayMessage ? ` ${d.displayMessage}` : "";
        lines.push(`    - ${tag}${codePart}${msgPart}`);
      }
    }
    const causeVal = this.cause;
    if (causeVal !== void 0 && causeVal !== null) {
      const causeStr = causeVal instanceof Error ? `${causeVal.name}: ${causeVal.message}` : String(causeVal);
      lines.push(`  ${pad("cause")}${causeStr}`);
    }
    return lines.join("\n");
  }
  /**
   * Structural type guard. Used by external consumers (keycloak-IGA) that
   * cannot rely on `instanceof` across module/bundling boundaries.
   */
  static isTideError(e) {
    if (e instanceof _TideError)
      return true;
    if (e === null || typeof e !== "object")
      return false;
    const candidate = e;
    return candidate.name === "TideError" && typeof candidate.code === "string" && typeof candidate.displayMessage === "string";
  }
};

// node_modules/@tideorg/js/dist/Errors/codes.js
var TideJsErrorCodes = Object.freeze({
  // --- Network ---------------------------------------------------------
  /** Underlying `fetch` rejected (DNS, connection refused, TLS, CORS, ...). */
  NET_FETCH_FAILED: "TIDE-TIDEJS-NET-FETCH_FAILED",
  /** The request was aborted by our internal `setTimeout(...controller.abort)`. */
  NET_TIMEOUT: "TIDE-TIDEJS-NET-TIMEOUT",
  /** The request was aborted by a caller-supplied `AbortSignal`. */
  NET_ABORTED: "TIDE-TIDEJS-NET-ABORTED",
  /** `response.ok === false` and the body did not carry a recognisable error envelope. */
  NET_NON_OK_STATUS: "TIDE-TIDEJS-NET-NON_OK_STATUS",
  /**
   * Fan-out to multiple ORKs completed but fewer succeeded than the
   * threshold required (e.g. 3 of 5 ORKs unreachable during a sign flow).
   * Carries `details[]` with each per-ORK underlying failure.
   */
  NET_THRESHOLD_FAILURE: "TIDE-TIDEJS-NET-THRESHOLD_FAILURE",
  // --- Parsing ---------------------------------------------------------
  /** Server sent `application/problem+json` but the body did not parse / lacked required fields. */
  PARSE_PROBLEM_JSON_INVALID: "TIDE-TIDEJS-PARSE-PROBLEM_JSON_INVALID",
  /** Body shape is not understood (e.g. legacy `--FAILED--:` envelope, or unknown format). */
  PARSE_UNKNOWN_FORMAT: "TIDE-TIDEJS-PARSE-UNKNOWN_FORMAT",
  /** A NodeClient response did not contain the expected `index` field (used by `WaitForNumberofORKs` cleanup). */
  PARSE_NODECLIENT_RESPONSE_SHAPE: "TIDE-TIDEJS-PARSE-NODECLIENT_RESPONSE_SHAPE",
  /** TideMemory buffer is too small to read the requested segment (truncated / malformed input). */
  PARSE_INSUFFICIENT_DATA: "TIDE-TIDEJS-PARSE-INSUFFICIENT_DATA",
  /** TideMemory segment index requested is past the end of the buffer's encoded segments. */
  PARSE_INDEX_OUT_OF_RANGE: "TIDE-TIDEJS-PARSE-INDEX_OUT_OF_RANGE",
  /** TideMemory allocation/write would exceed the destination buffer's capacity. */
  PARSE_BUFFER_OVERFLOW: "TIDE-TIDEJS-PARSE-BUFFER_OVERFLOW",
  // --- Validation ------------------------------------------------------
  /** A client method required a session key but `AddBearerAuthorization` was never called. */
  VAL_MISSING_SESSION_KEY: "TIDE-TIDEJS-VAL-MISSING_SESSION_KEY",
  /** A flow input failed a shape/type validation (wrong type, wrong array length, missing required field). */
  VAL_INPUT_SHAPE: "TIDE-TIDEJS-VAL-INPUT_SHAPE",
  /** The supplied username (uid) is not allowed (empty reserver list returned by the network). */
  VAL_UID_FORBIDDEN: "TIDE-TIDEJS-VAL-UID_FORBIDDEN",
  /** The supplied account could not be located on the network (e.g. simulator invalid-account sentinel). */
  VAL_INVALID_ACCOUNT: "TIDE-TIDEJS-VAL-INVALID_ACCOUNT",
  // --- Crypto ----------------------------------------------------------
  /** The session key the caller supplied does not match the session key bound into the Doken. */
  CRYPTO_SESSION_KEY_MISMATCH: "TIDE-TIDEJS-CRYPTO-SESSION_KEY_MISMATCH",
  /** GRj and Sj arrays produced by a signing flow had differing lengths (should be impossible). */
  CRYPTO_GRJ_SJ_LENGTH_MISMATCH: "TIDE-TIDEJS-CRYPTO-GRJ_SJ_LENGTH_MISMATCH",
  /** Per-ORK response arrays had differing lengths during PreSign/Sign aggregation. */
  CRYPTO_ORK_ARRAY_LENGTH_MISMATCH: "TIDE-TIDEJS-CRYPTO-ORK_ARRAY_LENGTH_MISMATCH",
  // --- Signature -------------------------------------------------------
  /** Local blind-signature verification failed against the expected challenge. */
  SIG_BLIND_VERIFY_FAILED: "TIDE-TIDEJS-SIG-BLIND_VERIFY_FAILED",
  // --- Proxy / pass-through -------------------------------------------
  /**
   * tide-js is wrapping an upstream failure in a way that *adds* semantics
   * (e.g. "all ORKs failed", retry exhaustion). For straight pass-through
   * of an upstream Problem Details body, DO NOT use this — preserve the
   * upstream `code` verbatim instead.
   */
  PROXY_UPSTREAM_ERROR: "TIDE-TIDEJS-PROXY-UPSTREAM_ERROR",
  // --- Network (additional) -------------------------------------------
  /** A non-TideError value was thrown from the fetch pipeline — caught and tagged for the recent-requests buffer. */
  NET_UNKNOWN: "TIDE-TIDEJS-NET-UNKNOWN",
  // --- Cryptide / low-level crypto ------------------------------------
  /** A `BaseComponent` abstract method (e.g. `Add`/`Multiply`/`Scheme`) was invoked but not implemented on the concrete subclass. */
  CRYPTO_NOT_IMPLEMENTED: "TIDE-TIDEJS-CRYPTO-NOT_IMPLEMENTED",
  /** Two components were combined whose schemes / component-types do not match. */
  CRYPTO_COMPONENT_MISMATCH: "TIDE-TIDEJS-CRYPTO-COMPONENT_MISMATCH",
  /** Scheme / component-type registry lookup failed (unknown scheme or component type). */
  CRYPTO_UNKNOWN_COMPONENT_TYPE: "TIDE-TIDEJS-CRYPTO-UNKNOWN_COMPONENT_TYPE",
  /** A serialized component could not be parsed into bytes (neither hex nor base64). */
  CRYPTO_DESERIALIZE_FAILED: "TIDE-TIDEJS-CRYPTO-DESERIALIZE_FAILED",
  /** AES encrypt/decrypt called with a key of an unsupported JS type. */
  CRYPTO_AES_UNSUPPORTED_KEY_TYPE: "TIDE-TIDEJS-CRYPTO-AES_UNSUPPORTED_KEY_TYPE",
  /** DH `computeSharedKey` called with a private value of an unsupported JS type. */
  CRYPTO_DH_UNSUPPORTED_PRIV_TYPE: "TIDE-TIDEJS-CRYPTO-DH_UNSUPPORTED_PRIV_TYPE",
  /** An Ed25519 Point failed an on-curve / equality / non-ZERO sanity check. */
  CRYPTO_ED25519_BAD_POINT: "TIDE-TIDEJS-CRYPTO-ED25519_BAD_POINT",
  /** Modular inverse does not exist (gcd != 1, or invert of 0 / non-positive modulus). */
  CRYPTO_INVERSE_NOT_EXIST: "TIDE-TIDEJS-CRYPTO-INVERSE_NOT_EXIST",
  /** A low-level crypto primitive received a value of an unexpected JS type (e.g. `invert` expected a bigint). */
  CRYPTO_INVALID_BIGINT_INPUT: "TIDE-TIDEJS-CRYPTO-INVALID_BIGINT_INPUT",
  /** Hash-to-Point (RFC 9380 expand_message_xmd / i2osp) received an out-of-range input. */
  CRYPTO_HASH_TO_POINT_INVALID_INPUT: "TIDE-TIDEJS-CRYPTO-HASH_TO_POINT_INVALID_INPUT",
  // --- Signature -------------------------------------------------------
  /** Non-blind signature verification failed (e.g. Ed25519Scheme `verifyingFunc`). */
  SIG_VERIFY_FAILED: "TIDE-TIDEJS-SIG-VERIFY_FAILED",
  // --- Serialization helpers -----------------------------------------
  /** A numeric value cannot be represented in the requested width (e.g. > Int64 / > 255 byte). */
  SERIAL_LENGTH_OUT_OF_RANGE: "TIDE-TIDEJS-SERIAL-LENGTH_OUT_OF_RANGE",
  /** The supplied argument was not of the expected JS type (e.g. expected Uint8Array, got something else). */
  SERIAL_INVALID_TYPE: "TIDE-TIDEJS-SERIAL-INVALID_TYPE",
  /** A serialization helper found data already present where an empty slot was expected. */
  SERIAL_INDEX_OOB: "TIDE-TIDEJS-SERIAL-INDEX_OOB",
  /** A serialization write would have exceeded the destination buffer's capacity. */
  SERIAL_BUFFER_OVERFLOW: "TIDE-TIDEJS-SERIAL-BUFFER_OVERFLOW",
  /** A length-tagged input did not match the expected length (e.g. TIDE_KEY blob != 32 bytes). */
  SERIAL_INVALID_LENGTH: "TIDE-TIDEJS-SERIAL-INVALID_LENGTH",
  /** A header / magic value did not match the expected token (e.g. "tidexxxkey" prefix mismatch). */
  SERIAL_UNEXPECTED_HEADER: "TIDE-TIDEJS-SERIAL-UNEXPECTED_HEADER",
  /** A hex string failed regex validation. */
  SERIAL_INVALID_HEX: "TIDE-TIDEJS-SERIAL-INVALID_HEX",
  /** A base64 string failed validation or decoding. */
  SERIAL_INVALID_BASE64: "TIDE-TIDEJS-SERIAL-INVALID_BASE64",
  /** Two operand arrays had unequal lengths where equal lengths were required (e.g. XOR). */
  SERIAL_LENGTH_MISMATCH: "TIDE-TIDEJS-SERIAL-LENGTH_MISMATCH",
  // --- Model validation ----------------------------------------------
  /** A model field (Doken/AuthRequest/TideKey) failed a shape/type guard during construction or parsing. */
  MODEL_INVALID_FIELD: "TIDE-TIDEJS-MODEL-INVALID_FIELD",
  /** A model header value (e.g. Doken `alg`/`typ`) did not match the expected value. */
  MODEL_UNEXPECTED_HEADER: "TIDE-TIDEJS-MODEL-UNEXPECTED_HEADER",
  /** A model expected a specific shape (e.g. Doken = 3 parts) and the input did not conform. */
  MODEL_INVALID_SHAPE: "TIDE-TIDEJS-MODEL-INVALID_SHAPE",
  /** A TideKey was constructed/derived from a component that does not satisfy the required interface. */
  MODEL_INVALID_KEY: "TIDE-TIDEJS-MODEL-INVALID_KEY",
  /** A model field's value was not in the allowed range (e.g. VRK expiry too close to now). */
  MODEL_VALUE_OUT_OF_RANGE: "TIDE-TIDEJS-MODEL-VALUE_OUT_OF_RANGE",
  /** ModelRegistry could not resolve a sign-request name:version to a builder (unknown model id). */
  MODEL_UNKNOWN_MODEL: "TIDE-TIDEJS-MODEL-UNKNOWN_MODEL",
  /** A PolicyParameters entry carries an unrecognised type tag (e.g. not str/num/bnum/bln/byt). */
  MODEL_UNKNOWN_PARAM_TYPE: "TIDE-TIDEJS-MODEL-UNKNOWN_PARAM_TYPE",
  /** `Policy.getParameter` was asked for a parameter key that does not exist on the policy. */
  MODEL_PARAM_NOT_FOUND: "TIDE-TIDEJS-MODEL-PARAM_NOT_FOUND",
  /** A developer-only invariant was violated inside a Policy version handler (should be unreachable in production). */
  MODEL_DEV_ERROR: "TIDE-TIDEJS-MODEL-DEV_ERROR",
  /** A request (e.g. BaseTideRequest) was used before a required field (authorizer / authorization / cert) had been added. */
  MODEL_REQUEST_NOT_INITIALIZED: "TIDE-TIDEJS-MODEL-REQUEST_NOT_INITIALIZED",
  /** A serialized model header carried an unsupported version tag (Policy / SerializedField). */
  MODEL_VERSION_MISMATCH: "TIDE-TIDEJS-MODEL-VERSION_MISMATCH",
  // --- TideMemory guards ---------------------------------------------
  /** Caller supplied a negative index to a TideMemory helper. */
  MEM_NEGATIVE_INDEX: "TIDE-TIDEJS-MEM-NEGATIVE_INDEX",
  /** Caller attempted to overwrite the zero-index slot via WriteValue (must use Create). */
  MEM_INDEX_ZERO_RESERVED: "TIDE-TIDEJS-MEM-INDEX_ZERO_RESERVED",
  /** TideMemory write would exceed the destination buffer's capacity. */
  MEM_BUFFER_OVERFLOW: "TIDE-TIDEJS-MEM-BUFFER_OVERFLOW",
  /** TideMemory read sought past the encoded segments of the buffer. */
  MEM_INDEX_OUT_OF_RANGE: "TIDE-TIDEJS-MEM-INDEX_OUT_OF_RANGE",
  /** TideMemory buffer is too small to hold even the version header. */
  MEM_INSUFFICIENT_DATA: "TIDE-TIDEJS-MEM-INSUFFICIENT_DATA",
  /** TideMemory write attempted at an index already populated with data. */
  MEM_INDEX_ALREADY_WRITTEN: "TIDE-TIDEJS-MEM-INDEX_ALREADY_WRITTEN"
});

// node_modules/@tideorg/js/dist/Cryptide/Math.js
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
function mod(a, b = CURVE.n) {
  var res = a % b;
  return res >= BigInt(0) ? res : b + res;
}
function RandomBigInt() {
  const buf = new Uint8Array(32);
  window.crypto.getRandomValues(buf);
  return mod(BigIntFromByteArray(buf), CURVE.n);
}
function mod_inv(number, modulo = CURVE.n) {
  if (number === _0n || modulo <= _0n) {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_INVERSE_NOT_EXIST, displayMessage: `mod_inv: expected positive integers (number is ${number === _0n ? "zero" : "non-zero"}, modulo is ${modulo <= _0n ? "non-positive" : "positive"})`, source: "tide-js/Cryptide/Math.ts:77" });
  }
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n, y = _1n, u = _1n, v = _0n;
  while (a !== _0n) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n)
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_INVERSE_NOT_EXIST, displayMessage: "mod_inv: modular inverse does not exist (gcd != 1)", source: "tide-js/Cryptide/Math.ts:92" });
  return mod(x, modulo);
}

// node_modules/@tideorg/js/dist/Cryptide/Components/ComponentRegistry.js
var Ed25519PublicComponentFactory = class {
  static Create(b) {
    return new Ed25519PublicComponent(b);
  }
};
var Ed25519PrivateComponentFactory = class {
  static Create(b) {
    return new Ed25519PrivateComponent(b);
  }
};
var Ed25519SeedComponentFactory = class {
  static Create(b) {
    return new Ed25519SeedComponent(b);
  }
};
var Registery = {
  Ed25519Scheme: {
    Public: Ed25519PublicComponentFactory,
    Private: Ed25519PrivateComponentFactory,
    Seed: Ed25519SeedComponentFactory
  }
};

// node_modules/@tideorg/js/dist/Cryptide/Components/Schemes/BaseScheme.js
var BaseScheme = class {
  static get Name() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Name not implemented", source: "tide-js/Cryptide/Components/Schemes/BaseScheme.ts:22" });
  }
  static GetVerifyingFunction = () => {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Verifying function not implemented", source: "tide-js/Cryptide/Components/Schemes/BaseScheme.ts:23" });
  };
  static GetSigningFunction = () => {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Signing function not implemented", source: "tide-js/Cryptide/Components/Schemes/BaseScheme.ts:24" });
  };
  static GetEncryptingFunction = () => {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Encrypting function not implemented", source: "tide-js/Cryptide/Components/Schemes/BaseScheme.ts:25" });
  };
};

// node_modules/@tideorg/js/dist/Cryptide/Components/Schemes/AES/AESScheme.js
var AESScheme = class extends BaseScheme {
  static get Name() {
    return "AESScheme";
  }
};

// node_modules/@tideorg/js/dist/Cryptide/Encryption/AES.js
var AES_exports = {};
__export(AES_exports, {
  createAESKey: () => createAESKey,
  decryptData: () => decryptData,
  decryptDataRawOutput: () => decryptDataRawOutput,
  encryptData: () => encryptData,
  encryptDataRawOutput: () => encryptDataRawOutput
});
var enc = new TextEncoder();
var dec = new TextDecoder();
function createAESKey(rawKey, keyUsage) {
  return window.crypto.subtle.importKey("raw", rawKey, "AES-GCM", true, keyUsage);
}
async function encryptData(secretData, key) {
  var aesKey;
  if (key instanceof Uint8Array) {
    aesKey = key;
  } else if (typeof key === "string") {
    aesKey = enc.encode(key);
  } else if (typeof key === "bigint") {
    aesKey = BigIntToByteArray(key);
  } else {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_AES_UNSUPPORTED_KEY_TYPE, displayMessage: `Unsupported key type (expected Uint8Array | string | bigint, got ${typeof key})`, source: "tide-js/Cryptide/Encryption/AES.ts:42" });
  }
  const encoded = typeof secretData === "string" ? enc.encode(secretData) : secretData;
  const encrypted = await encryptDataRawOutput(encoded, aesKey);
  return bytesToBase64(encrypted);
}
async function encryptDataRawOutput(encodedData, aesKey) {
  const cryptoKey = await createAESKey(aesKey, ["encrypt"]);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, encodedData);
  const buff = ConcatUint8Arrays([iv, new Uint8Array(encryptedBuffer)]);
  return buff;
}
async function decryptData(encryptedData, key) {
  var aesKey;
  if (key instanceof Uint8Array) {
    aesKey = key;
  } else if (typeof key === "string") {
    aesKey = enc.encode(key);
  } else if (typeof key === "bigint") {
    aesKey = BigIntToByteArray(key);
  } else {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_AES_UNSUPPORTED_KEY_TYPE, displayMessage: `Unsupported key type (expected Uint8Array | string | bigint, got ${typeof key})`, source: "tide-js/Cryptide/Encryption/AES.ts:72" });
  }
  const encryptedDataBuff = base64ToBytes(encryptedData);
  const decryptedContent = await decryptDataRawOutput(encryptedDataBuff, aesKey);
  return dec.decode(decryptedContent);
}
async function decryptDataRawOutput(encryptedData, key) {
  const aesKey = await createAESKey(key, ["decrypt"]);
  const iv = encryptedData.slice(0, 12);
  const data = encryptedData.slice(12);
  const decryptedContent = await window.crypto.subtle.decrypt({
    name: "AES-GCM",
    iv
  }, aesKey, data);
  return new Uint8Array(decryptedContent);
}

// node_modules/@tideorg/js/dist/Cryptide/Hashing/Hash.js
async function SHA256_Digest(message) {
  const data = typeof message === "string" ? new TextEncoder().encode(message) : message;
  const hash = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hash);
}
async function SHA512_Digest(message) {
  const data = typeof message === "string" ? new TextEncoder().encode(message) : message;
  const hash = await crypto.subtle.digest("SHA-512", data);
  return new Uint8Array(hash);
}

// node_modules/@tideorg/js/dist/Cryptide/Encryption/DH.js
var DH_exports = {};
__export(DH_exports, {
  computeSharedKey: () => computeSharedKey,
  generateECDHi: () => generateECDHi
});
async function computeSharedKey(pub, priv) {
  let privNum;
  if (typeof priv == "string") {
    privNum = BigIntFromByteArray(base64ToBytes(priv));
  } else if (priv instanceof Uint8Array) {
    privNum = BigIntFromByteArray(priv);
  } else if (typeof priv == "bigint") {
    privNum = priv;
  } else
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_DH_UNSUPPORTED_PRIV_TYPE, displayMessage: `Unknown Type (expected bigint | string | Uint8Array, got ${typeof priv})`, source: "tide-js/Cryptide/Encryption/DH.ts:30" });
  return await SHA256_Digest(pub.mul(privNum).toRawBytes());
}
async function generateECDHi(pubs, priv) {
  const pre_ecdhi = pubs.map(async (pub) => computeSharedKey(pub, priv));
  const ecdhi = await Promise.all(pre_ecdhi);
  return ecdhi;
}

// node_modules/@tideorg/js/dist/Cryptide/TideKey.js
var TideKey = class _TideKey {
  static NewKey(scheme) {
    const seedFactory = Registery[scheme.Name][Seed];
    return new _TideKey(seedFactory.Create(void 0));
  }
  static FromSerializedComponent(c) {
    return new _TideKey(BaseComponent.DeserializeComponent(c));
  }
  component = void 0;
  privateComponent;
  publicComponent;
  constructor(c) {
    if (c instanceof BaseComponent)
      this.component = c;
    else
      throw new TideError({ code: TideJsErrorCodes.MODEL_INVALID_KEY, displayMessage: "Expecting object derived from BaseComponent", source: "tide-js/Cryptide/TideKey.ts:45" });
  }
  get_private_component() {
    if (!hasOwnInstanceMethod(this.component, "GetPrivate") && !(this.component instanceof BasePrivateComponent))
      throw new TideError({ code: TideJsErrorCodes.MODEL_INVALID_KEY, displayMessage: "Cannot generate or find private component", source: "tide-js/Cryptide/TideKey.ts:48" });
    this.privateComponent = this.component instanceof BasePrivateComponent ? this.component : this.component.GetPrivate();
    return this.privateComponent;
  }
  get_public_component() {
    if (!hasOwnInstanceMethod(this.component, "GetPublic") && !(this.component instanceof BasePublicComponent))
      throw new TideError({ code: TideJsErrorCodes.MODEL_INVALID_KEY, displayMessage: "Cannot generate or find public component", source: "tide-js/Cryptide/TideKey.ts:53" });
    this.publicComponent = this.component instanceof BasePublicComponent ? this.component : this.component.GetPublic();
    return this.publicComponent;
  }
  async sign(message) {
    const f = this.component.Scheme.GetSigningFunction();
    return await f(message, this.get_private_component());
  }
  async verify(message, signature) {
    const f = this.component.Scheme.GetVerifyingFunction();
    return await f(message, signature, this.get_public_component());
  }
  async asymmetricDecrypt(cipher) {
    const d = this.component.Scheme.GetDecryptingFunction();
    return await d(cipher, this.get_private_component());
  }
  async asymmetricEncrypt(message) {
    const e = this.component.Scheme.GetEncryptingFunction();
    return await e(message, this.get_public_component());
  }
  async prepVouchersReq(gORKn) {
    if (this.component.Scheme !== Ed25519Scheme)
      throw new TideError({ code: TideJsErrorCodes.MODEL_INVALID_KEY, displayMessage: "Cannot execute prepVouchersReq on a non Ed25519 key", source: "tide-js/Cryptide/TideKey.ts:78" });
    let blurKeyPub = [];
    for (let i = 0; i < gORKn.length; i++) {
      const z = mod(BigIntFromByteArray(await computeSharedKey(gORKn[i], this.get_private_component().priv)));
      blurKeyPub[i] = gORKn[i].mul(z);
    }
    return blurKeyPub;
  }
};
function hasOwnInstanceMethod(obj, methodName) {
  const proto = Object.getPrototypeOf(obj);
  return Object.prototype.hasOwnProperty.call(proto, methodName) && typeof proto[methodName] === "function";
}

// node_modules/@tideorg/js/dist/Cryptide/Encryption/ElGamal.js
var ElGamal = class {
  static async encryptData(secretData, publicKey) {
    return bytesToBase64(await this.encryptDataRaw(secretData, publicKey));
  }
  static async encryptDataRaw(secretData, publicKey) {
    const r = RandomBigInt();
    const c1 = Point.BASE.mul(r).toRawBytes();
    const c2 = await encryptDataRawOutput(secretData, await SHA256_Digest(publicKey.mul(r).toRawBytes()));
    return ConcatUint8Arrays([c1, c2]);
  }
  static async encryptDataRaw_withAuthentication(secretData, publicKey, authMsg) {
    const r = RandomBigInt();
    const c1 = Point.BASE.mul(r).toRawBytes();
    const c2 = await encryptDataRawOutput(secretData, await SHA256_Digest(publicKey.mul(r).toRawBytes()));
    const authSig = await new TideKey(new Ed25519PrivateComponent(r)).sign(authMsg);
    return {
      cipher: ConcatUint8Arrays([c1, c2]),
      auth: authSig
    };
  }
  static async decryptData(base64_c1_c2, k) {
    const priv = typeof k == "bigint" ? k : BigIntFromByteArray(k);
    const b = base64ToBytes(base64_c1_c2);
    const c1 = b.slice(0, 32);
    const c2 = b.slice(32);
    const c1Point = Point.fromBytes(c1);
    const decrypted = await decryptDataRawOutput(c2, await SHA256_Digest(c1Point.mul(priv).toRawBytes()));
    return decrypted;
  }
  static async decryptDataRaw(base64_c1_c2, k) {
    const priv = typeof k == "bigint" ? k : BigIntFromByteArray(k);
    const c1 = base64_c1_c2.slice(0, 32);
    const c2 = base64_c1_c2.slice(32);
    const c1Point = Point.fromBytes(c1);
    const decrypted = await decryptDataRawOutput(c2, await SHA256_Digest(c1Point.mul(priv).toRawBytes()));
    return decrypted;
  }
};

// node_modules/@tideorg/js/dist/Cryptide/Components/Schemes/Ed25519/Ed25519Scheme.js
var Ed25519Scheme = class extends BaseScheme {
  static get Name() {
    return "Ed25519Scheme";
  }
  /**
   * WITHOUT DETERMINISM. Prefix is generated via randomisation.
   * @returns
   */
  static GetSigningFunction = () => {
    const signingFunc = (msg, component) => {
      if (msg instanceof Uint8Array && component instanceof Ed25519PrivateComponent) {
        return signNonDeterministicAsync(msg, component.priv);
      }
      throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_TYPE, displayMessage: "Ed25519Scheme.sign: mismatch of expected types (Uint8Array, Ed25519PrivateComponent)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Scheme.ts:36" });
    };
    return signingFunc;
  };
  static GetVerifyingFunction = () => {
    const verifyingFunc = async (msg, signature, component) => {
      if (msg instanceof Uint8Array && signature instanceof Uint8Array && component instanceof Ed25519PublicComponent) {
        const valid = await verifyAsync(signature, msg, component.rawBytes);
        if (!valid)
          throw new TideError({ code: TideJsErrorCodes.SIG_VERIFY_FAILED, displayMessage: "Ed25519 signature validation failed", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Scheme.ts:44" });
      } else
        throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_TYPE, displayMessage: "Ed25519Scheme.verify: mismatch of expected types (Uint8Array, Uint8Array, Ed25519PublicComponent)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Scheme.ts:46" });
    };
    return verifyingFunc;
  };
  static GetEncryptingFunction = () => {
    const encryptingFunc = async (msg, component) => {
      if (msg instanceof Uint8Array && component instanceof Ed25519PublicComponent) {
        return await ElGamal.encryptDataRaw(msg, component.public);
      } else
        throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_TYPE, displayMessage: "Ed25519Scheme.encrypt: mismatch between expected types (Uint8Array, Ed25519PublicComponent)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Scheme.ts:55" });
    };
    return encryptingFunc;
  };
  static GetDecryptingFunction = () => {
    const decryptingFunc = async (cipher, component) => {
      if (cipher instanceof Uint8Array && component instanceof Ed25519PrivateComponent) {
        return await ElGamal.decryptDataRaw(cipher, component.priv);
      } else
        throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_TYPE, displayMessage: "Ed25519Scheme.decrypt: mismatch between expected types (Uint8Array, Ed25519PrivateComponent)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Scheme.ts:64" });
    };
    return decryptingFunc;
  };
};

// node_modules/@tideorg/js/dist/Cryptide/Components/Schemes/SchemeRegistry.js
var SchemeType = [
  Ed25519Scheme,
  // 0
  AESScheme
  // 1
];

// node_modules/@tideorg/js/dist/Cryptide/Components/BaseComponent.js
var BaseComponent = class _BaseComponent {
  constructor() {
  }
  static Name = () => {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Name not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:25" });
  };
  static Version = () => {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Version not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:26" });
  };
  Add(component) {
    if (component.Scheme == this.Scheme) {
      let res = this.AddComponent(component);
      if (res instanceof _BaseComponent && res.Scheme == this.Scheme)
        return res;
    }
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_COMPONENT_MISMATCH, displayMessage: "Mismatch between components", source: "tide-js/Cryptide/Components/BaseComponent.ts:33" });
  }
  Multiply(component) {
    if (component.Scheme == this.Scheme) {
      let res = this.MultiplyComponent(component);
      if (res instanceof _BaseComponent && res.Scheme == this.Scheme)
        return res;
    }
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_COMPONENT_MISMATCH, displayMessage: "Mismatch between components", source: "tide-js/Cryptide/Components/BaseComponent.ts:40" });
  }
  Minus(component) {
    if (component.Scheme == this.Scheme) {
      let res = this.MinusComponent(component);
      if (res instanceof _BaseComponent && res.Scheme == this.Scheme)
        return res;
    }
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_COMPONENT_MISMATCH, displayMessage: "Mismatch between components", source: "tide-js/Cryptide/Components/BaseComponent.ts:47" });
  }
  Equals(component) {
    if (component.Scheme == this.Scheme) {
      let res = this.EqualsComponent(component);
      if (typeof res == "boolean")
        return res;
    }
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_COMPONENT_MISMATCH, displayMessage: "Mismatch between components", source: "tide-js/Cryptide/Components/BaseComponent.ts:54" });
  }
  Mod() {
    let res = this.ModComponent();
    if (res instanceof _BaseComponent && res.Scheme == this.Scheme)
      return res;
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_COMPONENT_MISMATCH, displayMessage: "Mismatch between components", source: "tide-js/Cryptide/Components/BaseComponent.ts:59" });
  }
  ModInv() {
    let res = this.ModInvComponent();
    if (res instanceof _BaseComponent && res.Scheme == this.Scheme)
      return res;
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_COMPONENT_MISMATCH, displayMessage: "Mismatch between components", source: "tide-js/Cryptide/Components/BaseComponent.ts:64" });
  }
  AddComponent(component) {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Add not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:67" });
  }
  MultiplyComponent(component) {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Multiply not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:68" });
  }
  MinusComponent(component) {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Minus not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:69" });
  }
  EqualsComponent(component) {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Equals not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:70" });
  }
  ModComponent() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Mod not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:71" });
  }
  ModInvComponent() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Mod inv not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:72" });
  }
  SerializeComponent() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Serialize not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:73" });
  }
  /**@returns {BaseScheme} */
  get Scheme() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:75" });
  }
  /**@returns {string} */
  get ComponentType() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:77" });
  }
  Serialize() {
    let raw = this.SerializeComponent();
    let schemeInt = SchemeType.indexOf(this.Scheme);
    let componentTypeInt = ComponentKeyType.indexOf(this.ComponentType);
    if (schemeInt == -1 || componentTypeInt == -1)
      throw new TideError({ code: TideJsErrorCodes.CRYPTO_UNKNOWN_COMPONENT_TYPE, displayMessage: "Could not find scheme or component type in registries", source: "tide-js/Cryptide/Components/BaseComponent.ts:83" });
    let schemeBytes = getBytesFromInt16(schemeInt);
    let header = ConcatUint8Arrays([new Uint8Array([componentTypeInt << 4]), schemeBytes]);
    return new SerializedComponent(ConcatUint8Arrays([header, raw]), this.ComponentType);
  }
  static DeserializeComponent(serialized) {
    let b = [];
    if (!(serialized instanceof Uint8Array)) {
      try {
        try {
          b = Hex2Bytes(serialized);
        } catch {
          b = base64ToBytes(serialized);
        }
      } catch {
        throw new TideError({ code: TideJsErrorCodes.CRYPTO_DESERIALIZE_FAILED, displayMessage: "Unable to deserialize component", source: "tide-js/Cryptide/Components/BaseComponent.ts:101" });
      }
    } else
      b = serialized;
    let scheme = SchemeType[toInt16(b.slice(1, 3), 0)];
    let k = b[0] >> 4 & 15;
    let keyType = ComponentKeyType[k];
    let component = Registery[scheme.Name][keyType];
    return component.Create(b.slice(3));
  }
};
var BaseSeedComponent = class extends BaseComponent {
  get ComponentType() {
    return Seed;
  }
  static New() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:115" });
  }
  GetPublic() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:116" });
  }
  GetPrivate() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:117" });
  }
  get rawBytes() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:118" });
  }
};
var BasePrivateComponent = class extends BaseComponent {
  get ComponentType() {
    return Private;
  }
  static New() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:123" });
  }
  GetPublic() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:124" });
  }
  get priv() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:125" });
  }
  get rawBytes() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:126" });
  }
};
var BasePublicComponent = class extends BaseComponent {
  get ComponentType() {
    return Public;
  }
  get public() {
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented", source: "tide-js/Cryptide/Components/BaseComponent.ts:131" });
  }
};
var SerializedComponent = class {
  Bytes;
  ComponentType;
  constructor(bytes, compentType) {
    this.Bytes = bytes;
    this.ComponentType = compentType;
  }
  ToBytes() {
    return this.Bytes;
  }
  ToString() {
    switch (this.ComponentType) {
      case Seed:
        return bytesToBase64(this.Bytes);
      case Private:
        return bytesToBase64(this.Bytes);
      case Public:
        return Bytes2Hex(this.Bytes);
      case Symmetric:
        return bytesToBase64(this.Bytes);
      case QuantumPrivate:
        throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented yet", source: "tide-js/Cryptide/Components/BaseComponent.ts:157" });
      case QuantumPublic:
        throw new TideError({ code: TideJsErrorCodes.CRYPTO_NOT_IMPLEMENTED, displayMessage: "Not implemented yet", source: "tide-js/Cryptide/Components/BaseComponent.ts:159" });
      default:
        throw new TideError({ code: TideJsErrorCodes.CRYPTO_UNKNOWN_COMPONENT_TYPE, displayMessage: "Unknown component type", source: "tide-js/Cryptide/Components/BaseComponent.ts:161" });
    }
  }
};
function toInt16(bytes, offset = 0) {
  const buffer = bytes.buffer;
  const view = new DataView(buffer);
  return view.getInt16(offset, true);
}
var Seed = "Seed";
var Private = "Private";
var Public = "Public";
var Symmetric = "Symmetric";
var QuantumPrivate = "QuantumPrivate";
var QuantumPublic = "QuantumPublic";
var ComponentKeyType = [
  Seed,
  // 0
  Private,
  // 1
  Public,
  // 2
  Symmetric,
  // 3
  QuantumPrivate,
  // 4
  QuantumPublic
  // 5
];

// node_modules/@tideorg/js/dist/Cryptide/Components/Schemes/Ed25519/Ed25519Components.js
var Ed25519PublicComponent = class _Ed25519PublicComponent extends BasePublicComponent {
  static Name = "Ed25519PublicComponent";
  static Version = "1";
  get Scheme() {
    return Ed25519Scheme;
  }
  get ComponentType() {
    return Public;
  }
  /**@type {Uint8Array} */
  pb = void 0;
  /**@type {Point} */
  p = void 0;
  constructor(rawData) {
    super();
    if (rawData instanceof Point) {
      this.p = rawData;
    } else if (rawData instanceof Uint8Array) {
      this.pb = rawData;
    } else {
      throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_TYPE, displayMessage: "Ed25519PublicComponent: unexpected type (expected Point or Uint8Array)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Components.ts:42" });
    }
  }
  get public() {
    if (!this.p && this.pb)
      this.p = Point.fromBytes(this.pb);
    else if (!this.p && !this.pb)
      throw new TideError({ code: TideJsErrorCodes.MODEL_INVALID_FIELD, displayMessage: "Ed25519PublicComponent.public: empty object (neither point nor bytes set)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Components.ts:46" });
    return this.p;
  }
  get rawBytes() {
    if (!this.pb && this.p)
      this.pb = this.p.toRawBytes();
    else if (!this.pb && !this.p)
      throw new TideError({ code: TideJsErrorCodes.MODEL_INVALID_FIELD, displayMessage: "Ed25519PublicComponent.rawBytes: empty object (neither point nor bytes set)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Components.ts:52" });
    return this.pb;
  }
  AddComponent(component) {
    if (component instanceof _Ed25519PublicComponent) {
      return new _Ed25519PublicComponent(this.public.add(component.public));
    }
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_COMPONENT_MISMATCH, displayMessage: "Ed25519PublicComponent.Add: mismatch with components (expected Ed25519PublicComponent)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Components.ts:60" });
  }
  MultiplyComponent(component) {
    if (component instanceof Ed25519PrivateComponent) {
      return new _Ed25519PublicComponent(this.public.mul(component.priv));
    }
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_COMPONENT_MISMATCH, displayMessage: "Ed25519PublicComponent.Multiply: mismatch with components (expected Ed25519PrivateComponent)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Components.ts:66" });
  }
  MinusComponent(component) {
    if (component instanceof _Ed25519PublicComponent) {
      return new _Ed25519PublicComponent(this.public.add(component.public.negate()));
    }
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_COMPONENT_MISMATCH, displayMessage: "Ed25519PublicComponent.Minus: mismatch with components (expected Ed25519PublicComponent)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Components.ts:72" });
  }
  EqualsComponent(component) {
    if (component instanceof _Ed25519PublicComponent) {
      return this.public.equals(component.public);
    }
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_COMPONENT_MISMATCH, displayMessage: "Ed25519PublicComponent.Equals: mismatch with components (expected Ed25519PublicComponent)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Components.ts:78" });
  }
  SerializeComponent() {
    return this.rawBytes.slice();
  }
};
var Ed25519PrivateComponent = class extends BasePrivateComponent {
  static Name = "Ed25519PrivateComponent";
  static Version = "1";
  get Scheme() {
    return Ed25519Scheme;
  }
  get ComponentType() {
    return Private;
  }
  /**@type {bigint} */
  p = void 0;
  /**@type {Uint8Array} */
  rB = void 0;
  get priv() {
    if (!this.p && this.rB)
      this.p = BigIntFromByteArray(this.rB);
    else if (!this.p && !this.rB)
      throw new TideError({ code: TideJsErrorCodes.MODEL_INVALID_FIELD, displayMessage: "Ed25519PrivateComponent.priv: empty object (neither bigint nor bytes set)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Components.ts:98" });
    return this.p;
  }
  get rawBytes() {
    if (!this.rB && this.p)
      this.rB = BigIntToByteArray(this.p);
    else if (!this.rB && !this.p)
      throw new TideError({ code: TideJsErrorCodes.MODEL_INVALID_FIELD, displayMessage: "Ed25519PrivateComponent.rawBytes: empty object (neither bigint nor bytes set)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Components.ts:104" });
    return this.rB;
  }
  constructor(rawData) {
    super();
    if (typeof rawData == "bigint") {
      this.p = rawData;
    } else if (rawData instanceof Uint8Array) {
      this.rB = rawData;
    } else {
      throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_TYPE, displayMessage: "Ed25519PrivateComponent: unexpected type (expected bigint or Uint8Array)", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Components.ts:114" });
    }
  }
  SerializeComponent() {
    return this.rawBytes.slice();
  }
  GetPublic() {
    return new Ed25519PublicComponent(Point.BASE.mul(this.priv));
  }
  static New() {
    return Ed25519SeedComponent.New().GetPrivate();
  }
};
var Ed25519SeedComponent = class _Ed25519SeedComponent extends BaseSeedComponent {
  static Name = "Ed25519SeedComponent";
  static Version = "1";
  get Scheme() {
    return Ed25519Scheme;
  }
  get ComponentType() {
    return Seed;
  }
  /**@type {Uint8Array} */
  rB = void 0;
  get rawBytes() {
    return this.rB;
  }
  constructor(rawData) {
    super();
    if (rawData instanceof Uint8Array)
      this.rB = rawData.slice();
    else if (!rawData)
      this.rB = _Ed25519SeedComponent.GenerateSeed();
    else
      throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_TYPE, displayMessage: "Ed25519SeedComponent: expected Uint8Array or no argument", source: "tide-js/Cryptide/Components/Schemes/Ed25519/Ed25519Components.ts:144" });
  }
  SerializeComponent() {
    return this.rB.slice();
  }
  static GenerateSeed() {
    const head = etc.randomBytes(32);
    head[0] &= 248;
    head[31] &= 127;
    head[31] |= 64;
    return head;
  }
  GetPrivate() {
    return new Ed25519PrivateComponent(mod(BigIntFromByteArray(this.rawBytes)));
  }
  GetPublic() {
    return this.GetPrivate().GetPublic();
  }
  static New() {
    return new _Ed25519SeedComponent(this.GenerateSeed());
  }
};

// node_modules/@tideorg/js/dist/Clients/RecentRequestsBuffer.js
var RecentRequestsBuffer = class _RecentRequestsBuffer {
  static _capacity = 20;
  static _entries = [];
  /** Append an entry; oldest entries are evicted FIFO when capacity is exceeded. */
  static push(entry) {
    _RecentRequestsBuffer._entries.push({ ...entry });
    const overflow = _RecentRequestsBuffer._entries.length - _RecentRequestsBuffer._capacity;
    if (overflow > 0) {
      _RecentRequestsBuffer._entries.splice(0, overflow);
    }
  }
  /** Returns the up-to-last-N entries in insertion order (oldest first). */
  static snapshot() {
    return _RecentRequestsBuffer._entries.map((e) => ({ ...e }));
  }
  /** Empty the buffer. */
  static clear() {
    _RecentRequestsBuffer._entries = [];
  }
  /**
   * Override the bounded capacity. If `n` is less than the current size,
   * the oldest entries are evicted FIFO to fit.
   */
  static setCapacity(n) {
    if (!Number.isFinite(n) || n < 0)
      return;
    _RecentRequestsBuffer._capacity = Math.floor(n);
    const overflow = _RecentRequestsBuffer._entries.length - _RecentRequestsBuffer._capacity;
    if (overflow > 0) {
      _RecentRequestsBuffer._entries.splice(0, overflow);
    }
  }
};

// node_modules/@tideorg/js/dist/Clients/ClientBase.js
function _endpointFromUrl(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}
function _pushRecent(url, method, perfStart, success, response, err2) {
  const durationMs = performance.now() - perfStart;
  let httpStatus = null;
  let code = null;
  if (success && response) {
    httpStatus = response.status;
    code = null;
  } else if (TideError.isTideError(err2)) {
    httpStatus = err2.httpStatus ?? null;
    code = err2.code;
  } else {
    httpStatus = null;
    code = TideJsErrorCodes.NET_UNKNOWN;
  }
  const entry = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    url,
    endpoint: _endpointFromUrl(url),
    method,
    httpStatus,
    durationMs,
    code
  };
  try {
    RecentRequestsBuffer.push(entry);
  } catch {
  }
}
function _pdField(problem, lower, pascal) {
  const v = problem[lower] !== void 0 ? problem[lower] : problem[pascal];
  return v;
}
function _normalizeProblemDetails(problem) {
  return {
    type: _pdField(problem, "type", "Type"),
    title: _pdField(problem, "title", "Title"),
    status: _pdField(problem, "status", "Status"),
    detail: _pdField(problem, "detail", "Detail"),
    instance: _pdField(problem, "instance", "Instance"),
    code: _pdField(problem, "code", "Code"),
    traceId: _pdField(problem, "traceId", "TraceId"),
    source: _pdField(problem, "source", "Source"),
    messageKey: _pdField(problem, "messageKey", "MessageKey"),
    messageParams: _pdField(problem, "messageParams", "MessageParams")
  };
}
var PD_CODE_LIKE = /^[A-Za-z0-9._:-]{1,256}$/;
var PD_PARAM_KEY = /^[A-Za-z0-9_]{1,64}$/;
var PD_TEXT_MAX = 2048;
var PD_SHORT_MAX = 256;
var PD_PARAMS_MAX_KEYS = 16;
var PD_PARAM_VALUE_MAX = 256;
function _pdTruncated(v, max) {
  if (typeof v !== "string")
    return void 0;
  return v.length > max ? v.slice(0, max) : v;
}
function _pdCodeLike(v) {
  if (typeof v !== "string")
    return void 0;
  return PD_CODE_LIKE.test(v) ? v : void 0;
}
function _pdSanitizeParams(v) {
  if (v === null || v === void 0)
    return null;
  if (typeof v !== "object" || Array.isArray(v))
    return null;
  const proto = Object.getPrototypeOf(v);
  if (proto !== Object.prototype && proto !== null)
    return null;
  const out = {};
  let kept = 0;
  for (const key of Object.keys(v)) {
    if (kept >= PD_PARAMS_MAX_KEYS)
      break;
    if (key === "__proto__" || key === "constructor" || key === "prototype")
      continue;
    if (!PD_PARAM_KEY.test(key))
      continue;
    let s;
    try {
      s = String(v[key]);
    } catch {
      continue;
    }
    out[key] = s.length > PD_PARAM_VALUE_MAX ? s.slice(0, PD_PARAM_VALUE_MAX) : s;
    kept++;
  }
  return out;
}
function _sanitizeProblemDetails(problem) {
  const status = typeof problem.status === "number" && Number.isFinite(problem.status) ? problem.status : void 0;
  return {
    type: _pdTruncated(problem.type, PD_SHORT_MAX),
    title: _pdTruncated(problem.title, PD_TEXT_MAX),
    status,
    detail: _pdTruncated(problem.detail, PD_TEXT_MAX),
    instance: _pdTruncated(problem.instance, PD_SHORT_MAX),
    code: _pdCodeLike(problem.code),
    traceId: _pdTruncated(problem.traceId, PD_SHORT_MAX),
    source: _pdTruncated(problem.source, PD_SHORT_MAX),
    messageKey: _pdCodeLike(problem.messageKey),
    messageParams: _pdSanitizeParams(problem.messageParams)
  };
}
var ClientBase = class {
  url;
  token;
  sessionKeyPrivateRaw;
  sessionKeyPublicEncoded;
  constructor(url) {
    this.url = url;
  }
  _createFormData(form) {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          formData.append(key + "[" + i + "]", value[i]);
        }
      } else
        formData.append(key, value);
    });
    return formData;
  }
  /**
   * Distinguish AbortError causes:
   *  - if the caller supplied their own signal AND it is now aborted, classify as NET_ABORTED
   *  - otherwise we hit our internal `setTimeout` -> NET_TIMEOUT
   *  - everything else (TypeError from fetch, DNS, CORS, ...) -> NET_FETCH_FAILED
   *
   * `endpoint` + `method` are threaded through so the resulting TideError
   * carries the full URL of the failed call — this is what makes the error
   * debuggable in the browser console (you immediately see *which* ORK was
   * unreachable, not just "Network request failed").
   */
  _classifyFetchError(e, callerSignal, source, endpoint, method) {
    const url = this.url + endpoint;
    const isAbort = typeof DOMException !== "undefined" && e instanceof DOMException && e.name === "AbortError" || e instanceof Error && e.name === "AbortError";
    if (isAbort) {
      if (callerSignal && callerSignal.aborted) {
        return new TideError({
          code: TideJsErrorCodes.NET_ABORTED,
          displayMessage: "Network request was aborted by the caller",
          source,
          url,
          endpoint,
          method,
          cause: e
        });
      }
      return new TideError({
        code: TideJsErrorCodes.NET_TIMEOUT,
        displayMessage: "Network request timed out",
        source,
        url,
        endpoint,
        method,
        cause: e
      });
    }
    return new TideError({
      code: TideJsErrorCodes.NET_FETCH_FAILED,
      displayMessage: "Network request failed",
      source,
      url,
      endpoint,
      method,
      cause: e
    });
  }
  async _get(endpoint, timeout = 2e4, signal = null) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const fullUrl = this.url + endpoint;
    const perfStart = performance.now();
    let response;
    try {
      response = await fetch(fullUrl, {
        method: "GET",
        signal: signal ?? controller.signal
      });
      clearTimeout(id);
    } catch (e) {
      clearTimeout(id);
      const tideErr = this._classifyFetchError(e, signal, "Clients/ClientBase.ts:_get", endpoint, "GET");
      _pushRecent(fullUrl, "GET", perfStart, false, null, tideErr);
      throw tideErr;
    }
    if (!response.ok) {
      const problemError = await this._problemDetailsToError(response, "Clients/ClientBase.ts:_get", fullUrl, endpoint, "GET");
      if (problemError) {
        _pushRecent(fullUrl, "GET", perfStart, false, response, problemError);
        throw problemError;
      }
      const tideErr = new TideError({
        code: TideJsErrorCodes.NET_NON_OK_STATUS,
        displayMessage: `Request to ${endpoint} returned HTTP ${response.status}`,
        httpStatus: response.status,
        source: "Clients/ClientBase.ts:_get",
        url: fullUrl,
        endpoint,
        method: "GET"
      });
      _pushRecent(fullUrl, "GET", perfStart, false, response, tideErr);
      throw tideErr;
    }
    _pushRecent(fullUrl, "GET", perfStart, true, response, null);
    return response;
  }
  /**
  * Silent get, makes a returns a response without handling response errors.
  */
  async _getSilent(endpoint, timeout = 2e4, signal = null) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    let response;
    try {
      response = await fetch(this.url + endpoint, {
        method: "GET",
        signal: signal ?? controller.signal
      });
      clearTimeout(id);
    } catch (e) {
      clearTimeout(id);
      throw this._classifyFetchError(e, signal, "Clients/ClientBase.ts:_getSilent", endpoint, "GET");
    }
    if (!response.ok) {
      const problemError = await this._problemDetailsToError(response, "Clients/ClientBase.ts:_getSilent", this.url + endpoint, endpoint, "GET");
      if (problemError)
        throw problemError;
      throw new TideError({
        code: TideJsErrorCodes.NET_NON_OK_STATUS,
        displayMessage: `Request to ${endpoint} returned HTTP ${response.status}`,
        httpStatus: response.status,
        source: "Clients/ClientBase.ts:_getSilent",
        url: this.url + endpoint,
        endpoint,
        method: "GET"
      });
    }
    return response;
  }
  async _post(endpoint, data, timeout = 2e4) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const fullUrl = this.url + endpoint;
    const perfStart = performance.now();
    if (this.token)
      data.append("token", this.token);
    let response;
    try {
      response = await fetch(fullUrl, {
        method: "POST",
        body: data,
        signal: controller.signal
      });
      clearTimeout(id);
    } catch (e) {
      clearTimeout(id);
      const tideErr = this._classifyFetchError(e, null, "Clients/ClientBase.ts:_post", endpoint, "POST");
      _pushRecent(fullUrl, "POST", perfStart, false, null, tideErr);
      throw tideErr;
    }
    _pushRecent(fullUrl, "POST", perfStart, true, response, null);
    return response;
  }
  async _put(endpoint, data) {
    const fullUrl = this.url + endpoint;
    const perfStart = performance.now();
    let response;
    try {
      response = await fetch(fullUrl, {
        method: "PUT",
        body: data
      });
    } catch (e) {
      const tideErr = TideError.isTideError(e) ? e : new TideError({
        code: TideJsErrorCodes.NET_FETCH_FAILED,
        displayMessage: "Network request failed",
        source: "Clients/ClientBase.ts:_put",
        url: fullUrl,
        endpoint,
        method: "PUT",
        cause: e
      });
      _pushRecent(fullUrl, "PUT", perfStart, false, null, tideErr);
      throw tideErr;
    }
    _pushRecent(fullUrl, "PUT", perfStart, true, response, null);
    return response;
  }
  async _postJSON(endpoint, data) {
    const fullUrl = this.url + endpoint;
    const perfStart = performance.now();
    let response;
    try {
      response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
    } catch (e) {
      const tideErr = TideError.isTideError(e) ? e : new TideError({
        code: TideJsErrorCodes.NET_FETCH_FAILED,
        displayMessage: "Network request failed",
        source: "Clients/ClientBase.ts:_postJSON",
        url: fullUrl,
        endpoint,
        method: "POST",
        cause: e
      });
      _pushRecent(fullUrl, "POST", perfStart, false, null, tideErr);
      throw tideErr;
    }
    _pushRecent(fullUrl, "POST", perfStart, true, response, null);
    return response;
  }
  /**
   * Post silent returns the response without handling response errors.
   */
  async _postSilent(endpoint, data, timeout = 2e4) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    let response;
    try {
      response = await fetch(this.url + endpoint, {
        method: "POST",
        body: data,
        signal: controller.signal
      });
      clearTimeout(id);
    } catch (e) {
      clearTimeout(id);
      throw this._classifyFetchError(e, null, "Clients/ClientBase.ts:_postSilent", endpoint, "POST");
    }
    return response;
  }
  /**
   * If `response` carries an `application/problem+json` body, read + parse
   * it (case-tolerantly — see {@link _normalizeProblemDetails}) and return
   * the structured pass-through {@link TideError} to throw. Returns `null`
   * when the content-type is not problem+json (body is NOT consumed in
   * that case, so callers may still read it).
   *
   * A malformed body / missing `code` yields a `PARSE_PROBLEM_JSON_INVALID`
   * TideError rather than `null`, mirroring the historical `_handleError`
   * behaviour.
   */
  async _problemDetailsToError(response, source, url, endpoint, method) {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/problem+json"))
      return null;
    const raw = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      return new TideError({
        code: TideJsErrorCodes.PARSE_PROBLEM_JSON_INVALID,
        displayMessage: "Server returned application/problem+json but the body did not parse",
        httpStatus: response.status,
        source,
        url,
        endpoint,
        method,
        cause: parseErr
      });
    }
    const problem = parsed && typeof parsed === "object" ? _sanitizeProblemDetails(_normalizeProblemDetails(parsed)) : null;
    if (!problem || typeof problem.code !== "string") {
      return new TideError({
        code: TideJsErrorCodes.PARSE_PROBLEM_JSON_INVALID,
        displayMessage: "Server returned application/problem+json without a `code` field",
        httpStatus: response.status,
        source,
        url,
        endpoint,
        method,
        problemType: problem?.type,
        cause: raw
      });
    }
    return new TideError({
      code: problem.code,
      displayMessage: problem.detail ?? problem.title ?? "Upstream error",
      messageKey: problem.messageKey ?? null,
      messageParams: problem.messageParams ?? null,
      traceId: problem.traceId,
      source: problem.source,
      httpStatus: problem.status ?? response.status,
      problemType: problem.type,
      url,
      endpoint,
      method
    });
  }
  /**
   * Convert a server response into either:
   *  - a success body (`text/plain`, voucher path, 2xx)
   *  - a thrown {@link TideError} (any error path)
   *
   * Branches in order of preference:
   *   1. `application/problem+json` (4xx/5xx) -> parse Problem Details, pass-through `code`/`traceId`/`type`/`detail`.
   *   2. Legacy `--FAILED--:` envelope on 200 -> wrap as `PARSE_UNKNOWN_FORMAT`, console.warn the upgrade hint.
   *   3. `!response.ok` with neither match -> `NET_NON_OK_STATUS`.
   *   4. Otherwise return the raw body text.
   *
   * The historical `throwError` parameter is preserved for API compatibility
   * but is now a no-op: we ALWAYS throw on error (and return body on success).
   * The previous mixed throw/reject behaviour was bug-prone — see locked spec.
   *
   * @param response The fetch Response.
   * @param functionName Name of the calling client method (for error source).
   * @param _throwError Deprecated, retained for ABI compatibility. Errors are always thrown.
   */
  async _handleError(response, functionName = "", _throwError = false) {
    const source = `Clients/ClientBase.ts:_handleError(${functionName})`;
    const url = response.url || void 0;
    let endpoint;
    if (url) {
      try {
        endpoint = new URL(url).pathname;
      } catch {
      }
    }
    const problemError = await this._problemDetailsToError(response, source, url, endpoint);
    if (problemError)
      throw problemError;
    const responseData = await response.text();
    if (responseData.split(":")[0] === "--FAILED--") {
      const legacyDetail = responseData.split(":").slice(1).join(":");
      console.error(responseData);
      console.warn(`legacy --FAILED-- envelope from ${response.url || this.url} \u2014 server should be upgraded to application/problem+json`);
      throw new TideError({
        code: TideJsErrorCodes.PARSE_UNKNOWN_FORMAT,
        displayMessage: legacyDetail || "Legacy --FAILED-- envelope received",
        httpStatus: response.status,
        source,
        url,
        endpoint,
        cause: responseData
      });
    }
    if (!response.ok) {
      throw new TideError({
        code: TideJsErrorCodes.NET_NON_OK_STATUS,
        displayMessage: `Request returned HTTP ${response.status}`,
        httpStatus: response.status,
        source,
        url,
        endpoint,
        cause: responseData
      });
    }
    return responseData;
  }
  async _handleErrorSimulator(response) {
    const responseData = await response.text();
    if (!response.ok) {
      throw new TideError({
        code: TideJsErrorCodes.NET_NON_OK_STATUS,
        displayMessage: responseData || `Request returned HTTP ${response.status}`,
        httpStatus: response.status,
        source: "Clients/ClientBase.ts:_handleErrorSimulator",
        cause: responseData
      });
    }
    return responseData;
  }
  AddBearerAuthorization(sessionKeyPrivate, sessionKeyPublicEncoded, token) {
    this.sessionKeyPrivateRaw = sessionKeyPrivate;
    this.sessionKeyPublicEncoded = sessionKeyPublicEncoded;
    this.token = token;
    return this;
  }
};

// node_modules/@tideorg/js/dist/Cryptide/Encryption/index.js
var Encryption_exports = {};
__export(Encryption_exports, {
  AES: () => AES_exports,
  DH: () => DH_exports,
  ElGamal: () => ElGamal
});

// node_modules/@tideorg/js/dist/Cryptide/Signing/TideSignature.js
var TideSignatureFormat = class {
  Name;
  Version;
  Message;
  Header = () => "=====TIDE_" + this.Name + ":" + this.Version + "_START=====\n";
  Footer = () => "\n=====TIDE_" + this.Name + ":" + this.Version + "_END=====";
  constructor(message) {
    if (typeof message == "string") {
      this.Message = StringToUint8Array(message);
    } else if (message instanceof Uint8Array) {
      this.Message = message.slice();
    } else
      throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_TYPE, displayMessage: `TideSignatureFormat: expected string or Uint8Array (got ${typeof message})`, source: "tide-js/Cryptide/Signing/TideSignature.ts:35" });
  }
  format() {
    return ConcatUint8Arrays([StringToUint8Array(this.Header()), this.Message, StringToUint8Array(this.Footer())]);
  }
};
var PolicyAuthorizedTideRequestSignatureFormat = class extends TideSignatureFormat {
  Name = "PolicyAuthorizedTideRequest";
  Version = "1";
  constructor(issueTimeBytes, exp, modelId, draftHash) {
    const expiry = new Uint8Array(8);
    const expiry_view = new DataView(expiry.buffer);
    expiry_view.setBigInt64(0, typeof exp === "number" ? BigInt(exp) : exp, true);
    const message = Serialization_exports.ConcatUint8Arrays([issueTimeBytes, expiry, StringToUint8Array(modelId), draftHash]);
    super(message);
  }
};

// node_modules/@tideorg/js/dist/Cryptide/Hashing/H2P.js
var curveP = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949");
var _0n2 = BigInt(0);
var _1n2 = BigInt(1);
var _2n2 = BigInt(2);
function multiply_nums(num1, num2, modulus = curveP) {
  return mod(BigInt(num1 * num2), modulus);
}
function to_the_power_of(number, power, modulus = curveP) {
  if (power < _0n2)
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_HASH_TO_POINT_INVALID_INPUT, displayMessage: "to_the_power_of: expected power > 0", source: "tide-js/Cryptide/Hashing/H2P.ts:82" });
  if (power === _0n2)
    return _1n2;
  if (power === _1n2)
    return number;
  let p = _1n2;
  let d = number;
  while (power > _0n2) {
    if (power & _1n2)
      p = multiply_nums(p, d, modulus);
    d = multiply_nums(d, d, modulus);
    power >>= _1n2;
  }
  ;
  return p;
}
var ELL2_C1_EDWARDS = BigInt("6853475219497561581579357271197624642482790079785650197046958215289687604742");
var ELL2_C1 = (curveP + BigInt(3)) / BigInt(8);
var ELL2_C2 = to_the_power_of(_2n2, ELL2_C1);
var ELL2_C3 = BigInt("38214883241950591754978413199355411911188925816896391856984770930832735035197");
var ELL2_C4 = (curveP - BigInt(5)) / BigInt(8);
var ELL2_J = BigInt(486662);

// node_modules/@tideorg/js/dist/Cryptide/Interpolation.js
function GetLi(xi, xs, m = CURVE.n) {
  var li = xs.filter((xj) => xj != xi).map((xj) => mod(mod_inv(xj - xi, m) * xj), m).reduce((li2, num) => mod(li2 * num, m));
  return li;
}
function GetLis(ids) {
  return ids.map((id) => GetLi(id, ids, CURVE.n));
}
function AggregatePoints(points) {
  if (points.every((p) => p == null))
    return null;
  else
    return points.reduce((sum, next) => next == null ? sum : sum.add(next), Point.ZERO);
}
function AggregatePointArrays(pointArrays) {
  const arrayDepth = pointArrays[0].length;
  if (!pointArrays.every((array) => array.length == arrayDepth))
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_ORK_ARRAY_LENGTH_MISMATCH, displayMessage: `Inconsistent amount of array depths (expected ${arrayDepth} across ${pointArrays.length} arrays)`, source: "tide-js/Cryptide/Interpolation.ts:55" });
  return pointArrays[0].map((_, i) => AggregatePoints(pointArrays.map((array) => array[i])));
}

// node_modules/@tideorg/js/dist/Clients/NodeClient.js
var NodeClient = class extends ClientBase {
  enabledTideDH;
  DHKey;
  orkCacheId;
  constructor(url) {
    super(url);
    this.enabledTideDH = false;
  }
  async isActive() {
    const response = await this._get("/active", 3e3);
    const responseData = await this._handleError(response, "Is Active");
    return responseData;
  }
  async EnableTideDH(orkPublic, gSessKey, sessKey) {
    if (!this.sessionKeyPrivateRaw)
      throw new TideError({
        code: TideJsErrorCodes.VAL_MISSING_SESSION_KEY,
        displayMessage: "Add a session key to the client first",
        source: "Clients/NodeClient.ts:EnableTideDH"
      });
    this.enabledTideDH = true;
    this.DHKey = await Encryption_exports.DH.computeSharedKey(orkPublic, this.sessionKeyPrivateRaw);
    return this;
  }
  async PreSign(index, vuid, request, voucher) {
    if (!this.enabledTideDH)
      throw new TideError({
        code: TideJsErrorCodes.VAL_MISSING_SESSION_KEY,
        displayMessage: "TideDH must be enabled",
        source: "Clients/NodeClient.ts:PreSign"
      });
    const encrypted = await Encryption_exports.AES.encryptData(CreateTideMemoryFromArray([request.encode()]), this.DHKey);
    const data = this._createFormData({
      "encrypted": encrypted,
      "voucher": voucher
    });
    if (!this.token)
      data.append("gSessKey", this.sessionKeyPublicEncoded);
    const response = await this._post(`/Authentication/Key/v1/PreSign?vuid=${vuid}`, data);
    const responseData = await this._handleError(response, "PreSign");
    const decrypted = await Encryption_exports.AES.decryptDataRawOutput(base64ToBytes(responseData), this.DHKey);
    const GRSection = GetValue(decrypted, 0);
    if (GRSection.length % 32 != 0)
      throw new TideError({
        code: TideJsErrorCodes.PARSE_UNKNOWN_FORMAT,
        displayMessage: "Unexpected response length. Must be divisible by 32",
        source: "Clients/NodeClient.ts:PreSign"
      });
    let GRis = [];
    for (let i = 0; i < GRSection.length; i += 32) {
      GRis.push(Point.fromBytes(GRSection.slice(i, i + 32)));
    }
    this.orkCacheId = GetValue(decrypted, 2);
    return {
      index,
      data: {
        GRis,
        AdditionalData: GetValue(decrypted, 1)
      }
    };
  }
  async Sign(vuid, request, GRs, bitwise, sessId) {
    if (!this.enabledTideDH)
      throw new TideError({
        code: TideJsErrorCodes.VAL_MISSING_SESSION_KEY,
        displayMessage: "TideDH must be enabled",
        source: "Clients/NodeClient.ts:Sign"
      });
    if (!this.orkCacheId)
      throw new TideError({
        code: TideJsErrorCodes.VAL_MISSING_SESSION_KEY,
        displayMessage: "Call PreSign first",
        source: "Clients/NodeClient.ts:Sign"
      });
    const payload = CreateTideMemoryFromArray([
      request.encode(),
      ConcatUint8Arrays([new Uint8Array([GRs.length]), ...GRs.map((r) => r.toRawBytes())]),
      this.orkCacheId
    ]);
    const encrypted = await Encryption_exports.AES.encryptData(payload, this.DHKey);
    const data = this._createFormData({
      "encrypted": encrypted,
      "bitwise": bytesToBase64(bitwise)
    });
    if (!this.token)
      data.append("gSessKey", this.sessionKeyPublicEncoded);
    const response = await this._post(`/Authentication/Key/v1/Sign?vuid=${vuid}`, data);
    const responseData = await this._handleError(response, "Sign");
    const decrypted = await Encryption_exports.AES.decryptDataRawOutput(base64ToBytes(responseData), this.DHKey);
    const signatureSection = GetValue(decrypted, 0);
    let Sij = [];
    for (let i = 0; i < signatureSection.length; i += 32) {
      Sij.push(BigIntFromByteArray(signatureSection.slice(i, i + 32)));
    }
    delete this.orkCacheId;
    return {
      Sij,
      AdditionalData: GetValue(decrypted, 1)
    };
  }
  async Decrypt(index, vuid, request, voucher) {
    if (!this.enabledTideDH)
      throw new TideError({
        code: TideJsErrorCodes.VAL_MISSING_SESSION_KEY,
        displayMessage: "TideDH must be enabled",
        source: "Clients/NodeClient.ts:Decrypt"
      });
    const encrypted = await Encryption_exports.AES.encryptData(CreateTideMemoryFromArray([request.encode()]), this.DHKey);
    const data = this._createFormData({
      "encrypted": encrypted,
      "voucher": voucher
    });
    if (!this.token)
      data.append("gSessKey", this.sessionKeyPublicEncoded);
    const response = await this._post(`/Authentication/Key/v1/Decrypt?vuid=${vuid}`, data);
    const responseData = await this._handleError(response, "Decrypt");
    const decrypted = await Encryption_exports.AES.decryptDataRawOutput(base64ToBytes(responseData), this.DHKey);
    if (decrypted.length % 32 != 0)
      throw new TideError({
        code: TideJsErrorCodes.PARSE_UNKNOWN_FORMAT,
        displayMessage: "Unexpected response length. Must be divisible by 32",
        source: "Clients/NodeClient.ts:Decrypt"
      });
    let appliedC1s = [];
    for (let i = 0; i < decrypted.length; i += 32) {
      appliedC1s.push(Point.fromBytes(decrypted.slice(i, i + 32)));
    }
    return {
      index,
      appliedC1s
    };
  }
  async CreateCheckoutSession(vendorData, redirectUrl, licensingTier) {
    const licenseRequest = {
      VendorData: vendorData,
      RedirectUri: redirectUrl,
      LicensingTier: licensingTier
    };
    return await this._postJSON(`/Payer/License/CreateCheckoutSession`, licenseRequest);
  }
  async IsLicenseActive(vendorId) {
    const response = await this._getSilent(`/Payer/License/IsLicenseActive?obfGVVK=${vendorId}`);
    const text = await response.text();
    const isActive = text.trim().toLowerCase() === "true";
    return isActive;
  }
  async GetLicenseDetails(vendorId, timestamp, timestampSig) {
    const data = this._createFormData({
      "timestamp": timestamp,
      "timestampSig": timestampSig
    });
    const endpoint = `/Payer/License/getLicenseDetails?obfGVVK=${vendorId}`;
    const response = await this._postSilent(endpoint, data);
    const responseData = await response.text();
    if (responseData.startsWith("--FAILED--")) {
      throw new TideError({
        code: TideJsErrorCodes.PROXY_UPSTREAM_ERROR,
        displayMessage: `Upstream returned an error for license-details lookup`,
        endpoint,
        url: this.url + endpoint,
        source: "Clients/NodeClient.ts:192",
        cause: new Error(typeof responseData === "string" ? responseData.slice(0, 256) : JSON.stringify(responseData ?? "").slice(0, 256))
      });
    }
    return responseData;
  }
  async GetSubscriptionStatus(vendorId, initialSessionId, timestamp, timestampSig) {
    const data = this._createFormData({
      "initialSessionId": initialSessionId,
      "timestamp": timestamp,
      "timestampSig": timestampSig
    });
    const endpoint = `/Payer/License/GetSubscriptionStatus?obfGVVK=${vendorId}`;
    const response = await this._postSilent(endpoint, data);
    const responseData = await response.text();
    if (responseData.startsWith("--FAILED--")) {
      throw new TideError({
        code: TideJsErrorCodes.PROXY_UPSTREAM_ERROR,
        displayMessage: `Upstream returned an error for license-details lookup`,
        endpoint,
        url: this.url + endpoint,
        source: "Clients/NodeClient.ts:207",
        cause: new Error(typeof responseData === "string" ? responseData.slice(0, 256) : JSON.stringify(responseData ?? "").slice(0, 256))
      });
    }
    const status = responseData.toLowerCase() === "active" ? "upcoming renewal" : responseData.toLowerCase();
    return status;
  }
  async CreateCustomerPortalSession(vendorId, redirectUrl, timestamp, timestampSig) {
    const data = this._createFormData({
      "vendorId": vendorId,
      "timestamp": timestamp,
      "timestampSig": timestampSig,
      "redirectUrl": redirectUrl
    });
    return await this._postSilent(`/Payer/License/CreateCustomerPortalSession?obfGVVK=${vendorId}`, data);
  }
  async UpdateSubscription(updateRequest, licenseId, timestamp, timestampSig) {
    const data = this._createFormData({
      "updateRequest": JSON.stringify(updateRequest),
      "licenseId": licenseId,
      "timestamp": timestamp,
      "timestampSig": timestampSig
    });
    return await this._postSilent(`/Payer/License/updateSubscription`, data);
  }
  async CancelSubscription(licenseId, initialSessionId, timestamp, timestampSig) {
    const data = this._createFormData({
      "licenseId": licenseId,
      "initialSessionId": initialSessionId,
      "timestamp": timestamp,
      "timestampSig": timestampSig
    });
    return await this._postSilent(`/Payer/License/CancelSubscription`, data);
  }
};

// node_modules/@tideorg/js/dist/Models/Responses/Vendor/VoucherResponse.js
var VoucherResponse = class _VoucherResponse {
  voucherPacks;
  qPub;
  payerPub;
  Yhat;
  blurerK;
  UDeObf;
  constructor(voucherPacks, qPub, payerPub, Yhat, blurerK, UDeObf) {
    this.voucherPacks = voucherPacks;
    this.qPub = qPub;
    this.payerPub = payerPub;
    this.Yhat = Yhat;
    this.blurerK = blurerK;
    this.UDeObf = UDeObf;
  }
  static from(data, blurerK) {
    const json = JSON.parse(data);
    return new _VoucherResponse(json.voucherPacks, json.QPub, json.PayerPub, json.YHat, blurerK, json.UDeObf);
  }
  toORK(index) {
    return JSON.stringify({
      VoucherPack: this.voucherPacks[index],
      YHat: this.Yhat,
      QPub: this.qPub,
      BlurerK: this.blurerK,
      PayerPublic: this.payerPub
    });
  }
};

// node_modules/@tideorg/js/dist/Clients/VoucherClient.js
var VoucherClient = class extends ClientBase {
  constructor(url) {
    super(url);
  }
  async GetVouchers(blurPORKi, actionRequest, blurerK) {
    const request = JSON.stringify({
      BlurPORKi: blurPORKi.map((blur) => blur.toBase64()),
      ActionRequest: actionRequest,
      BlurerK: blurerK.toBase64()
    });
    const data = this._createFormData({
      "voucherRequest": request
    });
    const response = await this._post(``, data);
    const respondeData = await this._handleError(response, "Get Vouchers", true);
    return VoucherResponse.from(respondeData, blurerK.toBase64());
  }
};

// node_modules/@tideorg/js/dist/Tools/TideMemory.js
var TideMemory = class _TideMemory extends Uint8Array {
  static CreateFromArray(datas) {
    if (datas.length == 0)
      return new _TideMemory();
    const length = datas.reduce((sum, next) => sum + 4 + next.length, 0);
    const mem = this.Create(datas[0], length);
    for (let i = 1; i < datas.length; i++) {
      mem.WriteValue(i, datas[i]);
    }
    return mem;
  }
  static Create(initialValue, totalLength, version = 1) {
    if (totalLength < initialValue.length + 4) {
      throw new TideError({ code: TideJsErrorCodes.MEM_BUFFER_OVERFLOW, displayMessage: `Not enough space to allocate requested data. Make sure to request more space in totalLength than length of InitialValue plus 4 bytes for length. (totalLength=${totalLength}, initialValue.length=${initialValue.length}, required>=${initialValue.length + 4})`, source: "tide-js/Tools/TideMemory.ts:14" });
    }
    const bufferLength = 4 + totalLength;
    const buffer = new _TideMemory(bufferLength);
    const dataView = new DataView(buffer.buffer);
    dataView.setInt32(0, version, true);
    let dataLocationIndex = 4;
    dataView.setInt32(dataLocationIndex, initialValue.length, true);
    dataLocationIndex += 4;
    buffer.set(initialValue, dataLocationIndex);
    return buffer;
  }
  WriteValue(index, value) {
    if (index < 0)
      throw new TideError({ code: TideJsErrorCodes.MEM_NEGATIVE_INDEX, displayMessage: "Index cannot be less than 0", source: "tide-js/Tools/TideMemory.ts:38" });
    if (index === 0)
      throw new TideError({ code: TideJsErrorCodes.MEM_INDEX_ZERO_RESERVED, displayMessage: "Use CreateTideMemory to set value at index 0", source: "tide-js/Tools/TideMemory.ts:39" });
    if (this.length < 4 + value.length)
      throw new TideError({ code: TideJsErrorCodes.MEM_BUFFER_OVERFLOW, displayMessage: `Could not write to memory. Memory too small for this value (this.length=${this.length}, required>=${4 + value.length})`, source: "tide-js/Tools/TideMemory.ts:40" });
    const dataView = new DataView(this.buffer);
    let dataLocationIndex = 4;
    for (let i = 0; i < index; i++) {
      if (dataLocationIndex + 4 > this.length) {
        throw new TideError({ code: TideJsErrorCodes.MEM_INDEX_OUT_OF_RANGE, displayMessage: `Index out of range. (while seeking to segment ${index}, sub-index ${i}, offset ${dataLocationIndex}+4 exceeds length ${this.length})`, source: "tide-js/Tools/TideMemory.ts:48" });
      }
      const nextDataLength = dataView.getInt32(dataLocationIndex, true);
      dataLocationIndex += 4;
      dataLocationIndex += nextDataLength;
    }
    if (dataLocationIndex + 4 + value.length > this.length) {
      throw new TideError({ code: TideJsErrorCodes.MEM_BUFFER_OVERFLOW, displayMessage: `Not enough space to write value (offset ${dataLocationIndex}+4+${value.length} exceeds length ${this.length})`, source: "tide-js/Tools/TideMemory.ts:60" });
    }
    const existingLength = dataView.getInt32(dataLocationIndex, true);
    if (existingLength !== 0) {
      throw new TideError({ code: TideJsErrorCodes.MEM_INDEX_ALREADY_WRITTEN, displayMessage: `Data has already been written to this index (index=${index}, offset=${dataLocationIndex}, existingLength=${existingLength})`, source: "tide-js/Tools/TideMemory.ts:66" });
    }
    dataView.setInt32(dataLocationIndex, value.length, true);
    dataLocationIndex += 4;
    this.set(value, dataLocationIndex);
  }
  GetValue(index) {
    if (this.length < 4) {
      throw new TideError({ code: TideJsErrorCodes.MEM_INSUFFICIENT_DATA, displayMessage: `Insufficient data to read. (buffer length is ${this.length}, need at least 4 bytes for header)`, source: "tide-js/Tools/TideMemory.ts:80" });
    }
    const dataView = new DataView(this.buffer, this.byteOffset, this.byteLength);
    let dataLocationIndex = 4;
    for (let i = 0; i < index; i++) {
      if (dataLocationIndex + 4 > this.length) {
        throw new TideError({ code: TideJsErrorCodes.MEM_INDEX_OUT_OF_RANGE, displayMessage: `Index out of range. (requested segment ${index}, ran out at sub-index ${i}, offset ${dataLocationIndex}+4 exceeds length ${this.length})`, source: "tide-js/Tools/TideMemory.ts:94" });
      }
      const nextDataLength = dataView.getInt32(dataLocationIndex, true);
      dataLocationIndex += 4 + nextDataLength;
    }
    if (dataLocationIndex + 4 > this.length) {
      throw new TideError({ code: TideJsErrorCodes.MEM_INDEX_OUT_OF_RANGE, displayMessage: `Index out of range. (requested segment ${index}, offset ${dataLocationIndex}+4 (length header) exceeds length ${this.length})`, source: "tide-js/Tools/TideMemory.ts:103" });
    }
    const finalDataLength = dataView.getInt32(dataLocationIndex, true);
    dataLocationIndex += 4;
    if (dataLocationIndex + finalDataLength > this.length) {
      throw new TideError({ code: TideJsErrorCodes.MEM_INDEX_OUT_OF_RANGE, displayMessage: `Index out of range. (requested segment ${index}, payload offset ${dataLocationIndex}+${finalDataLength} exceeds length ${this.length})`, source: "tide-js/Tools/TideMemory.ts:111" });
    }
    return this.subarray(dataLocationIndex, dataLocationIndex + finalDataLength);
  }
  TryGetValue(index, returnObj) {
    try {
      returnObj.result = this.GetValue(index);
      return true;
    } catch {
      returnObj.result = void 0;
      return false;
    }
  }
};

// node_modules/@tideorg/js/dist/Models/Policy.js
var ApprovalType;
(function(ApprovalType2) {
  ApprovalType2[ApprovalType2["EXPLICIT"] = 0] = "EXPLICIT";
  ApprovalType2[ApprovalType2["IMPLICIT"] = 1] = "IMPLICIT";
})(ApprovalType || (ApprovalType = {}));
var ExecutionType;
(function(ExecutionType2) {
  ExecutionType2[ExecutionType2["PRIVATE"] = 0] = "PRIVATE";
  ExecutionType2[ExecutionType2["PUBLIC"] = 1] = "PUBLIC";
})(ExecutionType || (ExecutionType = {}));
var Policy = class _Policy {
  static latestVersion = "3";
  version;
  contractId;
  modelIds;
  keyId;
  approvalType;
  executionType;
  params;
  dataToVerify;
  signature;
  constructor(data) {
    if (typeof data["version"] !== "string")
      throw "Version is not a string";
    if (new.target === _Policy) {
      if (data["version"] !== _Policy.latestVersion) {
        throw "Breaking changes made to Policies. Update how you create a policy in your application";
      }
    }
    this.version = data["version"];
    if (typeof data["contractId"] !== "string")
      throw "ContractId is not a string";
    this.contractId = data["contractId"];
    if (!Array.isArray(data["modelId"]) && typeof data["modelId"] !== "string")
      throw "ModelId is not a string";
    this.modelIds = typeof data["modelId"] === "string" ? [data["modelId"]] : data["modelId"];
    if (typeof data["keyId"] !== "string")
      throw "KeyId is not a string";
    this.keyId = data["keyId"];
    this.approvalType = data.approvalType;
    this.executionType = data.executionType;
    if (!data["params"])
      throw "Params is null";
    this.params = data["params"] instanceof PolicyParameters ? data["params"] : new PolicyParameters(data["params"]);
    this.dataToVerify = TideMemory.CreateFromArray([
      StringToUint8Array(this.version),
      StringToUint8Array(this.contractId),
      TideMemory.CreateFromArray(this.modelIds.map((i) => StringToUint8Array(i))),
      StringToUint8Array(this.keyId),
      StringToUint8Array(ApprovalType[this.approvalType]),
      StringToUint8Array(ExecutionType[this.executionType]),
      this.params.toBytes()
    ]);
  }
  static from(data) {
    const d = new TideMemory(data.length);
    d.set(data);
    const dataToVerify = d.GetValue(0);
    const version = StringFromUint8Array(dataToVerify.GetValue(0));
    if (version != _Policy.latestVersion) {
      switch (version) {
        case PolicyV1.thisVersion:
          return PolicyV1.from(d);
        case PolicyV2.thisVersion:
          return PolicyV2.from(d);
        default:
          throw new TideError({ code: TideJsErrorCodes.MODEL_VERSION_MISMATCH, displayMessage: `Unknown policy version: ${version}`, source: "tide-js/Models/Policy.ts:75" });
      }
    }
    const contractId = StringFromUint8Array(dataToVerify.GetValue(1));
    const modelIdSection = dataToVerify.GetValue(2);
    const modelIds = [];
    let returnObj = { result: void 0 };
    for (let i = 0; modelIdSection.TryGetValue(i, returnObj); i++) {
      modelIds.push(StringFromUint8Array(returnObj.result));
    }
    const keyId = StringFromUint8Array(dataToVerify.GetValue(3));
    const approvalType = ApprovalType[StringFromUint8Array(dataToVerify.GetValue(4))];
    const executionType = ExecutionType[StringFromUint8Array(dataToVerify.GetValue(5))];
    const params = new PolicyParameters(dataToVerify.GetValue(6));
    const p = new _Policy({
      version,
      contractId,
      modelId: modelIds,
      keyId,
      approvalType,
      executionType,
      params
    });
    const sigRes = { result: void 0 };
    if (d.TryGetValue(1, sigRes)) {
      p.signature = sigRes.result;
    }
    return p;
  }
  toBytes() {
    let d = [
      TideMemory.CreateFromArray([
        StringToUint8Array(this.version),
        StringToUint8Array(this.contractId),
        TideMemory.CreateFromArray(this.modelIds.map((i) => StringToUint8Array(i))),
        StringToUint8Array(this.keyId),
        StringToUint8Array(ApprovalType[this.approvalType]),
        StringToUint8Array(ExecutionType[this.executionType]),
        this.params.toBytes()
      ])
    ];
    if (this.signature)
      d.push(this.signature);
    return TideMemory.CreateFromArray(d);
  }
};
var PolicyParameters = class _PolicyParameters {
  entries;
  constructor(data) {
    if (data instanceof Uint8Array) {
      this.entries = _PolicyParameters.fromBytes(data);
    } else {
      this.entries = new Map(data);
    }
  }
  static fromBytes(data) {
    let params = /* @__PURE__ */ new Map();
    let i = 0;
    const value = { result: void 0 };
    const tideData = new TideMemory(data.length);
    tideData.set(data);
    while (tideData.TryGetValue(i, value)) {
      const nameBytes = value.result.GetValue(0);
      const name = StringFromUint8Array(nameBytes);
      const typeBytes = value.result.GetValue(1);
      const type = StringFromUint8Array(typeBytes);
      const dataBytes = value.result.GetValue(2);
      let datum;
      switch (type) {
        case "str":
          datum = StringFromUint8Array(dataBytes);
          break;
        case "num":
          const numView = new DataView(dataBytes.buffer, dataBytes.byteOffset, dataBytes.byteLength);
          datum = numView.getInt32(0, true);
          break;
        case "bnum":
          datum = BigIntFromByteArray(dataBytes);
          break;
        case "bln":
          datum = dataBytes[0] === 1;
          break;
        case "byt":
          datum = new Uint8Array(dataBytes);
          break;
        default:
          throw new TideError({ code: TideJsErrorCodes.MODEL_UNKNOWN_PARAM_TYPE, displayMessage: `PolicyParameters.fromBytes: could not find type of ${type}`, source: "tide-js/Models/Policy.ts:176" });
      }
      params.set(name, datum);
      i++;
    }
    return params;
  }
  tryGetParameter(key) {
    try {
      return [true, this.getParameter(key)];
    } catch {
      return [false, null];
    }
  }
  getParameter(key) {
    if (!this.entries.has(key)) {
      throw new TideError({ code: TideJsErrorCodes.MODEL_PARAM_NOT_FOUND, displayMessage: `PolicyParameters.getParameter: parameter '${key}' not found`, source: "tide-js/Models/Policy.ts:195" });
    }
    const value = this.entries.get(key);
    const actualType = value instanceof Uint8Array ? "Uint8Array" : typeof value;
    let expectedType;
    if (value instanceof Uint8Array) {
      expectedType = "Uint8Array";
    } else {
      expectedType = typeof value;
    }
    const isCorrectType = typeof value === "string" && value.constructor === String || typeof value === "number" && value.constructor === Number || typeof value === "bigint" && value.constructor === BigInt || typeof value === "boolean" && value.constructor === Boolean || value instanceof Uint8Array;
    if (!isCorrectType) {
      throw new TideError({ code: TideJsErrorCodes.MODEL_INVALID_FIELD, displayMessage: `PolicyParameters.getParameter: parameter '${key}' exists but has unexpected type '${actualType}'`, source: "tide-js/Models/Policy.ts:219" });
    }
    return value;
  }
  toBytes() {
    let params = [];
    for (const [key, value] of this.entries) {
      const nameBytes = StringToUint8Array(key);
      let dataBytes, typeStr;
      if (typeof value === "string") {
        dataBytes = StringToUint8Array(value);
        typeStr = "str";
      } else if (typeof value === "number" && Number.isInteger(value)) {
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setInt32(0, value, true);
        dataBytes = new Uint8Array(buffer);
        typeStr = "num";
      } else if (typeof value === "bigint") {
        dataBytes = BigIntToByteArray(value);
        typeStr = "bnum";
      } else if (typeof value === "boolean") {
        dataBytes = new Uint8Array([value ? 1 : 0]);
        typeStr = "bln";
      } else if (value instanceof Uint8Array) {
        dataBytes = value;
        typeStr = "byt";
      } else {
        throw new TideError({ code: TideJsErrorCodes.MODEL_UNKNOWN_PARAM_TYPE, displayMessage: `PolicyParameters.toBytes: could not serialize key '${key}' of type '${typeof value}'`, source: "tide-js/Models/Policy.ts:253" });
      }
      const typeBytes = StringToUint8Array(typeStr);
      const paramMemory = TideMemory.CreateFromArray([nameBytes, typeBytes, dataBytes]);
      params.push(paramMemory);
    }
    return TideMemory.CreateFromArray(params);
  }
};
var PolicyV2 = class _PolicyV2 extends Policy {
  static thisVersion = "2";
  static from(data) {
    const dataToVerify = data.GetValue(0);
    const v = StringFromUint8Array(dataToVerify.GetValue(0));
    if (v != _PolicyV2.thisVersion) {
      throw new TideError({ code: TideJsErrorCodes.MODEL_DEV_ERROR, displayMessage: `PolicyV2.from: version mismatch (expected ${_PolicyV2.thisVersion}, got ${v})`, source: "tide-js/Models/Policy.ts:273" });
    }
    const contractId = StringFromUint8Array(dataToVerify.GetValue(1));
    const modelId = StringFromUint8Array(dataToVerify.GetValue(2));
    const keyId = StringFromUint8Array(dataToVerify.GetValue(3));
    const approvalType = ApprovalType[StringFromUint8Array(dataToVerify.GetValue(4))];
    const executionType = ExecutionType[StringFromUint8Array(dataToVerify.GetValue(5))];
    const params = new PolicyParameters(dataToVerify.GetValue(6));
    const p = new _PolicyV2({
      version: v,
      contractId,
      modelId,
      keyId,
      approvalType,
      executionType,
      params
    });
    const sigRes = { result: void 0 };
    if (data.TryGetValue(1, sigRes)) {
      p.signature = sigRes.result;
    }
    return p;
  }
  toBytes() {
    let d = [
      TideMemory.CreateFromArray([
        StringToUint8Array(this.version),
        StringToUint8Array(this.contractId),
        StringToUint8Array(this.modelIds[0]),
        StringToUint8Array(this.keyId),
        StringToUint8Array(ApprovalType[this.approvalType]),
        StringToUint8Array(ExecutionType[this.executionType]),
        this.params.toBytes()
      ])
    ];
    if (this.signature)
      d.push(this.signature);
    return TideMemory.CreateFromArray(d);
  }
};
var PolicyV1 = class _PolicyV1 extends Policy {
  static thisVersion = "1";
  static from(data) {
    const dataToVerify = data.GetValue(0);
    const v = StringFromUint8Array(dataToVerify.GetValue(0));
    if (v != _PolicyV1.thisVersion) {
      throw new TideError({ code: TideJsErrorCodes.MODEL_DEV_ERROR, displayMessage: `PolicyV1.from: version mismatch (expected ${_PolicyV1.thisVersion}, got ${v})`, source: "tide-js/Models/Policy.ts:325" });
    }
    const contractId = StringFromUint8Array(dataToVerify.GetValue(1));
    const modelId = StringFromUint8Array(dataToVerify.GetValue(2));
    const keyId = StringFromUint8Array(dataToVerify.GetValue(3));
    const params = new PolicyParameters(dataToVerify.GetValue(4));
    const p = new _PolicyV1({
      version: v,
      contractId,
      modelId,
      keyId,
      approvalType: ApprovalType.EXPLICIT,
      // didn't exist on v1 so this is default
      executionType: ExecutionType.PUBLIC,
      // didn't exist on v1 so this is default
      params
    });
    const sigRes = { result: void 0 };
    if (data.TryGetValue(1, sigRes)) {
      p.signature = sigRes.result;
    }
    return p;
  }
  toBytes() {
    let d = [
      TideMemory.CreateFromArray([
        StringToUint8Array(_PolicyV1.thisVersion),
        StringToUint8Array(this.contractId),
        StringToUint8Array(this.modelIds[0]),
        StringToUint8Array(this.keyId),
        this.params.toBytes()
      ])
    ];
    if (this.signature)
      d.push(this.signature);
    return TideMemory.CreateFromArray(d);
  }
};

// node_modules/@tideorg/js/dist/Models/BaseTideRequest.js
var BaseTideRequest = class _BaseTideRequest {
  static _name;
  static _version;
  name;
  version;
  authFlow;
  draft;
  dyanmicData;
  authorization;
  authorizerCert;
  authorizer;
  expiry;
  policy;
  constructor(name, version, authFlow, draft = new Uint8Array(), dyanmicData = new Uint8Array()) {
    this.name = name;
    this.version = version;
    this.authFlow = authFlow;
    this.draft = new TideMemory(draft.length);
    this.draft.set(draft);
    this.dyanmicData = new TideMemory(dyanmicData.length);
    this.dyanmicData.set(dyanmicData);
    this.authorization = new TideMemory();
    this.authorizerCert = new TideMemory();
    ;
    this.authorizer = new TideMemory();
    this.expiry = Math.floor(Date.now() / 1e3) + 30;
    this.policy = new TideMemory();
  }
  id() {
    return this.name + ":" + this.version;
  }
  /**
   * This isn't copying. Just created another BaseTideRequest object that allows you to point each individual field to OTHER sections of memory.
   * If you modify an existing 'replicated' field, you'll also modify the other object you originally replicated.
   */
  replicate() {
    const r = new _BaseTideRequest(this.name, this.version, this.authFlow, this.draft, this.dyanmicData);
    r.authorization = this.authorization;
    r.authorizerCert = this.authorizerCert;
    r.authorizer = this.authorizer;
    r.expiry = this.expiry;
    r.policy = this.policy;
    return r;
  }
  setNewDynamicData(d) {
    this.dyanmicData = new TideMemory(d.length);
    this.dyanmicData.set(d);
    return this;
  }
  setCustomExpiry(timeFromNowInSeconds) {
    this.expiry = Math.floor(Date.now() / 1e3) + timeFromNowInSeconds;
    return this;
  }
  addAuthorizer(authorizer) {
    this.authorizer = new TideMemory(authorizer.length);
    this.authorizer.set(authorizer);
  }
  addAuthorizerCertificate(authorizerCertificate) {
    this.authorizerCert = new TideMemory(authorizerCertificate.length);
    this.authorizerCert.set(authorizerCertificate);
  }
  addAuthorization(authorization) {
    this.authorization = new TideMemory(authorization.length);
    this.authorization.set(authorization);
    return this;
  }
  addPolicy(policy) {
    this.policy = new TideMemory(policy.length);
    this.policy.set(policy);
    return this;
  }
  hasPolicy() {
    return this.policy.length != 0;
  }
  // Additional method from tide-js version
  async dataToAuthorize() {
    return StringToUint8Array("<datatoauthorize-" + this.name + ":" + this.version + bytesToBase64(await SHA512_Digest(this.draft)) + this.expiry.toString() + "-datatoauthorize>");
  }
  // Additional method from tide-js version
  async dataToApprove() {
    const creationTime = this.authorization.GetValue(0).GetValue(0);
    const creationSig = this.authorization.GetValue(0).GetValue(1);
    const creationMessage = new PolicyAuthorizedTideRequestSignatureFormat(creationTime, this.expiry, this.id(), await SHA512_Digest(this.draft));
    return Serialization_exports.ConcatUint8Arrays([creationMessage.format(), creationSig]);
  }
  async getRequestInitDetails() {
    const te = new TextEncoder();
    return {
      "creationTime": _BaseTideRequest.uint32ToUint8ArrayLE(Math.floor(Date.now() / 1e3)),
      // now
      "expireTime": _BaseTideRequest.uint32ToUint8ArrayLE(this.expiry),
      "modelId": te.encode(this.id()),
      "draftHash": new TideMemory(await crypto.subtle.digest("SHA-512", this.draft))
    };
  }
  addCreationSignature(creationTime, sig) {
    this.authorization = TideMemory.CreateFromArray([
      TideMemory.CreateFromArray([
        creationTime,
        sig
      ]),
      new TideMemory()
      // empty as no approvals have been added yet
    ]);
    return this;
  }
  isInitialized() {
    try {
      if (this.authorization.GetValue(0).GetValue(0).length > 0 && this.authorization.GetValue(0).GetValue(1).length == 64)
        return true;
      else
        return false;
    } catch {
      return false;
    }
  }
  getUniqueId() {
    if (!this.isInitialized())
      throw "Must initialize request to generate unique id";
    const bytes = this.authorization.GetValue(0).GetValue(1);
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  getInitializedTime() {
    if (!this.isInitialized())
      throw "Must initialize request to get creation time";
    const time_bytes = this.authorization.GetValue(0).GetValue(0);
    return _BaseTideRequest.uint8ArrayToUint32LE(time_bytes);
  }
  getCurrentApprovalCount() {
    if (!this.isInitialized())
      throw "Must initialize request to get approval count";
    let i = 0;
    let res = { result: void 0 };
    while (this.authorizer.TryGetValue(i, res)) {
      i++;
    }
    return i;
  }
  getPolicy() {
    return Policy.from(this.policy);
  }
  /**
   * Add an approval for this request. To be used for policy auth flow
   */
  addApproval(doken, sig) {
    let res = {};
    if (!Serialization_exports.TryGetValue(this.authorization, 0, res))
      throw new TideError({ code: TideJsErrorCodes.MODEL_REQUEST_NOT_INITIALIZED, displayMessage: "BaseTideRequest.addApproval: creation authorization hasn't been added yet", source: "tide-js/Models/BaseTideRequest.ts:174" });
    let existingSessKeySigs = [];
    let currentSig = { result: void 0 };
    for (let i = 0; Serialization_exports.TryGetValue(Serialization_exports.GetValue(this.authorization, 1), i, currentSig); i++) {
      if (currentSig.result.length == 0)
        continue;
      existingSessKeySigs.push(currentSig.result);
    }
    let existingDokens = [];
    let currentDoken = { result: void 0 };
    for (let i = 0; Serialization_exports.TryGetValue(this.authorizer, i, currentDoken); i++) {
      if (currentDoken.result.length == 0)
        continue;
      existingDokens.push(currentDoken.result);
    }
    existingDokens.push(StringToUint8Array(doken.serialize()));
    existingSessKeySigs.push(sig);
    this.authorization = TideMemory.CreateFromArray([
      Serialization_exports.GetValue(this.authorization, 0),
      Serialization_exports.CreateTideMemoryFromArray(existingSessKeySigs)
    ]);
    this.authorizer = TideMemory.CreateFromArray(existingDokens);
  }
  removeApproval(approvalVuid) {
    if (!this.isInitialized())
      return false;
    if (this.getCurrentApprovalCount() == 0)
      return false;
    try {
      let i = 0;
      let res = { result: new TideMemory() };
      let dokenWithVuidFound = {};
      let keepTheseDokensList = [];
      let keepTheseApprovalSigs = [];
      while (this.authorizer.TryGetValue(i, res)) {
        const d = new Doken(res.result);
        if (d.hasVuid(approvalVuid)) {
          dokenWithVuidFound = {
            index: i,
            value: d
          };
        } else {
          keepTheseDokensList.push(res.result);
          keepTheseApprovalSigs.push(this.authorization.GetValue(1).GetValue(i));
        }
        i++;
      }
      if (dokenWithVuidFound) {
        const creationAuth = this.authorization.GetValue(0);
        this.authorization = TideMemory.CreateFromArray([
          creationAuth,
          TideMemory.CreateFromArray(keepTheseApprovalSigs)
        ]);
        this.authorizer = TideMemory.CreateFromArray(keepTheseDokensList);
        return true;
      } else
        return false;
    } catch (ex) {
      console.error(ex);
      return false;
    }
  }
  encode() {
    if (this.authorizer == null)
      throw new TideError({ code: TideJsErrorCodes.MODEL_REQUEST_NOT_INITIALIZED, displayMessage: "BaseTideRequest.encode: Authorizer not added to request", source: "tide-js/Models/BaseTideRequest.ts:246" });
    if (this.authorizerCert == null)
      throw new TideError({ code: TideJsErrorCodes.MODEL_REQUEST_NOT_INITIALIZED, displayMessage: "BaseTideRequest.encode: Authorizer cert not provided", source: "tide-js/Models/BaseTideRequest.ts:247" });
    if (this.authorization == null)
      throw new TideError({ code: TideJsErrorCodes.MODEL_REQUEST_NOT_INITIALIZED, displayMessage: "BaseTideRequest.encode: Authorize this request first with an authorizer", source: "tide-js/Models/BaseTideRequest.ts:248" });
    const te = new TextEncoder();
    const name_b = te.encode(this.name);
    const version_b = te.encode(this.version);
    const authFlow_b = te.encode(this.authFlow);
    const expiry = _BaseTideRequest.uint32ToUint8ArrayLE(this.expiry);
    const req = TideMemory.CreateFromArray([
      name_b,
      version_b,
      expiry,
      this.draft,
      authFlow_b,
      this.dyanmicData,
      this.authorizer,
      this.authorization,
      this.authorizerCert,
      this.policy
    ]);
    return req;
  }
  static decode(data) {
    const d = new TideMemory(data.length);
    d.set(data);
    const name = new TextDecoder().decode(d.GetValue(0));
    const version = new TextDecoder().decode(d.GetValue(1));
    if (this._name != void 0 && this._version != void 0) {
      if (name != this._name || version != this._version)
        throw new TideError({ code: TideJsErrorCodes.MODEL_INVALID_FIELD, displayMessage: "BaseTideRequest.decode: name/version in decoded data don't match this object's set name and version", source: "tide-js/Models/BaseTideRequest.ts:287" });
    }
    const expiry = _BaseTideRequest.uint8ArrayToUint32LE(d.GetValue(2));
    const draft = d.GetValue(3);
    const authFlow = new TextDecoder().decode(d.GetValue(4));
    const dynamicData = d.GetValue(5);
    const authorizer = d.GetValue(6);
    const authorization = d.GetValue(7);
    const authorizerCert = d.GetValue(8);
    const policy = d.GetValue(9);
    const request = new this(name, version, authFlow, draft, dynamicData);
    request.expiry = expiry;
    request.authorizer = authorizer;
    request.authorization = authorization;
    request.authorizerCert = authorizerCert;
    request.policy = policy;
    return request;
  }
  static uint32ToUint8ArrayLE(num) {
    const arr = new Uint8Array(8);
    arr[0] = num & 255;
    arr[1] = num >>> 8 & 255;
    arr[2] = num >>> 16 & 255;
    arr[3] = num >>> 24 & 255;
    return arr;
  }
  static uint8ArrayToUint32LE(bytes) {
    if (bytes.length !== 8) {
      throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_LENGTH, displayMessage: `BaseTideRequest.uint8ArrayToUint32LE: expected 8 bytes for a 64-bit value (got ${bytes.length})`, source: "tide-js/Models/BaseTideRequest.ts:332" });
    }
    return bytes[0] + (bytes[1] << 8) + (bytes[2] << 16) + bytes[3] * 16777216;
  }
};

// node_modules/@tideorg/js/dist/Contracts/BaseContract.js
var Doken = class {
  payload;
  constructor(d) {
    if (!d || d.length === 0) {
      throw new Error("Doken constructor: received empty or null Uint8Array");
    }
    const tokenString = typeof d === "string" ? d : StringFromUint8Array(d);
    const s = tokenString.split(".");
    if (s.length !== 3) {
      throw new Error(`Doken constructor: invalid token format. Expected 3 parts (header.payload.signature) but got ${s.length} parts in: "${tokenString.substring(0, 50)}..."`);
    }
    try {
      const decodedPayload = base64UrlDecode(s[1]);
      this.payload = JSON.parse(decodedPayload);
    } catch (error) {
      throw new Error(`Doken constructor: failed to parse token payload. ${error instanceof Error ? error.message : String(error)}. Raw payload part: "${s[1].substring(0, 50)}..."`);
    }
    if (!this.payload || typeof this.payload !== "object") {
      throw new Error(`Doken constructor: parsed payload is not a valid object. Got type: ${typeof this.payload}`);
    }
  }
  hasResourceAccessRole(role, client) {
    if (!role)
      throw new Error("hasResourceAccessRole: role parameter is empty or undefined");
    if (!client)
      throw new Error("hasResourceAccessRole: client parameter is empty or undefined");
    if (!this.payload.resource_access) {
      return false;
    }
    if (!this.payload.resource_access[client]) {
      return false;
    }
    if (!Array.isArray(this.payload.resource_access[client].roles)) {
      return false;
    }
    return this.payload.resource_access[client].roles.includes(role);
  }
  hasRealmAccessRole(role) {
    if (!role)
      throw new Error("hasRealmAccessRole: role parameter is empty or undefined");
    if (!this.payload.realm_access) {
      return false;
    }
    if (!Array.isArray(this.payload.realm_access.roles)) {
      return false;
    }
    return this.payload.realm_access.roles.includes(role);
  }
  hasVuid(vuid) {
    if (!vuid)
      throw new Error("hasVuid: vuid cannot be null");
    if (!this.payload.vuid)
      throw new Error("hasVuid: cannot find vuid in paylod");
    return this.payload.vuid === vuid;
  }
};
function base64UrlDecode(input) {
  let output = input.replaceAll("-", "+").replaceAll("_", "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("Input is not of the correct length.");
  }
  try {
    return b64DecodeUnicode(output);
  } catch (error) {
    return atob(output);
  }
}
function b64DecodeUnicode(input) {
  return decodeURIComponent(atob(input).replace(/(.)/g, (m, p) => {
    let code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = "0" + code;
    }
    return "%" + code;
  }));
}

// node_modules/@tideorg/js/dist/Tools/Utils.js
var Threshold = 14;
var Max = 20;
function _toDetail(err2) {
  if (TideError.isTideError(err2)) {
    return {
      url: err2.url,
      endpoint: err2.endpoint,
      method: err2.method,
      code: err2.code,
      displayMessage: err2.displayMessage,
      cause: err2
    };
  }
  if (err2 instanceof Error) {
    return { displayMessage: err2.message, cause: err2 };
  }
  return { displayMessage: String(err2), cause: err2 };
}
function CurrentTime() {
  const timeSkew = window.localStorage?.getItem("timeSkew");
  const now = Math.floor(Date.now() / 1e3);
  return timeSkew ? now + Number(timeSkew) : now;
}
function _medianFailureByParam(failures, param) {
  const candidates = [];
  for (const f of failures) {
    const raw = f.messageParams?.[param];
    if (raw === void 0 || raw === null)
      continue;
    const v = Number(raw);
    if (!Number.isFinite(v))
      continue;
    candidates.push({ f, v });
  }
  if (candidates.length === 0)
    return null;
  candidates.sort((a, b) => a.v - b.v);
  return candidates[Math.floor((candidates.length - 1) / 2)].f;
}
async function PromiseRace(promises, keyType, amountRequired, customTimeout = null, customPromiseChecker = null, promoteUnanimousCodes = false) {
  let results = [];
  let failed = [];
  let timeoutReached = false;
  let initLength = promises.length;
  const timeout = (ms, id) => new Promise((resolve) => setTimeout(resolve, ms, id));
  const oneSecondCheck = timeout(1e3, "1s");
  const timeoutLength = customTimeout == null ? 8e3 : customTimeout;
  const timeoutCheck = timeout(timeoutLength, "ts");
  promises.push(oneSecondCheck);
  promises.push(timeoutCheck);
  let oneSecCheckPassed = false;
  let fullyCompletedPromises = 0;
  while (promises.length > 0 && fullyCompletedPromises < initLength) {
    const racePromises = promises.map((p, index) => p.then((result) => ({ result, index })).catch((error) => ({ error, index })));
    const fastestPromise = await Promise.race(racePromises);
    if (fastestPromise.result === "1s") {
      oneSecCheckPassed = true;
    } else if (fastestPromise.result === "ts") {
      if (fullyCompletedPromises >= amountRequired) {
        break;
      } else if (failed.length > 0) {
        console.log("Errors in flow:");
        failed.forEach((f) => console.error(f));
        break;
      } else {
        timeoutReached = true;
        break;
      }
    } else {
      if (!fastestPromise.error) {
        if (customPromiseChecker != null) {
          if (customPromiseChecker(fastestPromise.result)) {
            fullyCompletedPromises++;
          }
          results.push(fastestPromise.result);
        } else {
          fullyCompletedPromises++;
          results.push(fastestPromise.result);
        }
      } else {
        failed.push(fastestPromise.error);
      }
    }
    if (fullyCompletedPromises >= amountRequired)
      break;
    promises.splice(fastestPromise.index, 1);
  }
  if (fullyCompletedPromises >= amountRequired) {
    return results;
  } else {
    if (failed.length > 0) {
      console.log("Errors in flow:");
      failed.forEach((f) => console.error(f));
    }
    if (failed.some((ex) => ex === "Too many attempts")) {
      throw new TideError({
        code: TideJsErrorCodes.NET_THRESHOLD_FAILURE,
        displayMessage: "enclave.throttled",
        source: "Tools/Utils.ts:PromiseRace",
        details: failed.map(_toDetail),
        cause: failed[0]
      });
    }
    const details = failed.map(_toDetail);
    const got = fullyCompletedPromises;
    const required = amountRequired;
    const totalAttempted = initLength;
    if (promoteUnanimousCodes && failed.length > 0 && failed.length === initLength && results.length === 0 && failed.every((f) => TideError.isTideError(f))) {
      const tideFailed = failed;
      const unanimousCode = tideFailed[0].code;
      const unanimous = tideFailed.every((f) => f.code === unanimousCode);
      if (unanimous && !unanimousCode.startsWith("TIDE-TIDEJS-")) {
        const representative = _medianFailureByParam(tideFailed, "minutes") ?? _medianFailureByParam(tideFailed, "expirySeconds") ?? tideFailed[0];
        const repKey = representative.messageKey;
        const promotedMessageKey = typeof repKey === "string" && (repKey.startsWith("error.tide.") || repKey.startsWith("errors.tide.")) ? repKey : null;
        throw new TideError({
          code: representative.code,
          displayMessage: representative.displayMessage,
          messageKey: promotedMessageKey,
          messageParams: representative.messageParams,
          httpStatus: representative.httpStatus,
          problemType: representative.problemType,
          traceId: representative.traceId,
          source: `Tools/Utils.ts:PromiseRace (promoted: ${tideFailed.length} identical per-ORK failures)`,
          details,
          cause: representative
        });
      }
    }
    if (failed.length > 0) {
      throw new TideError({
        code: TideJsErrorCodes.NET_THRESHOLD_FAILURE,
        displayMessage: `Could not reach enough ${keyType} ORKs (got ${got} of ${required} required, ${failed.length} of ${totalAttempted} failed)`,
        source: "Tools/Utils.ts:PromiseRace",
        details,
        cause: failed[0]
      });
    } else if (timeoutReached) {
      throw new TideError({
        code: TideJsErrorCodes.NET_THRESHOLD_FAILURE,
        displayMessage: `enclave.thresholdTimeoutFailure (got ${got} of ${required} required ${keyType} ORKs before timeout)`,
        source: "Tools/Utils.ts:PromiseRace",
        details
      });
    } else {
      throw new TideError({
        code: TideJsErrorCodes.NET_THRESHOLD_FAILURE,
        displayMessage: `${keyType} ORKs for this account are down (got ${got} of ${required} required)`,
        source: "Tools/Utils.ts:PromiseRace",
        details
      });
    }
  }
}
async function WaitForNumberofORKs(orkList_Ref, pre_responses, keyType, amountRequired = Threshold, bitwise_p = null, optionalArray = null, customTimeout = null, customPromiseChecker = null, opts) {
  const unsortedResponses = await PromiseRace(pre_responses, keyType, amountRequired, customTimeout, customPromiseChecker, opts?.promoteUnanimousCodes === true);
  const sortedResponses = unsortedResponses.sort((a, b) => a.index - b.index);
  let bitwise = [];
  if (bitwise_p != null) {
    let previousActiveOrkIndexes = [];
    bitwise_p.forEach((b, i2) => {
      if (b == 1)
        previousActiveOrkIndexes.push(i2);
    });
    let currentUnresponsiveOrkIndexs = [];
    let i = 0, j = 0;
    console.log("total: " + orkList_Ref.length);
    console.log("responded: " + sortedResponses.length);
    while (i < orkList_Ref.length && j < sortedResponses.length) {
      if (i === sortedResponses[j].index) {
        i++;
        j++;
      } else {
        currentUnresponsiveOrkIndexs.push(i);
        console.log(orkList_Ref[i].orkID + ":" + orkList_Ref[i].orkURL + " is slow");
        i++;
      }
    }
    while (i < orkList_Ref.length) {
      currentUnresponsiveOrkIndexs.push(i);
      console.log(orkList_Ref[i].orkID + ":" + orkList_Ref[i].orkURL + " is slow");
      i++;
    }
    console.log("didn't respond: " + currentUnresponsiveOrkIndexs.length);
    bitwise = bitwise_p.slice();
    let occurrenceCount = 0;
    let indexCount = 0;
    for (let i2 = 0; i2 < bitwise.length; i2++) {
      if (bitwise[i2] === 1) {
        occurrenceCount++;
        if (occurrenceCount === currentUnresponsiveOrkIndexs[indexCount] + 1) {
          bitwise[i2] = 0;
          indexCount++;
        }
      }
    }
  } else {
    bitwise = Array(Max).fill(0).map((_, i) => sortedResponses.every((resp) => resp.index != i) ? 0 : 1);
  }
  const newOrkList = orkList_Ref.filter((_, i) => !sortedResponses.every((resp) => resp.index != i));
  orkList_Ref.splice(0, orkList_Ref.length);
  newOrkList.forEach((el) => orkList_Ref.push(el));
  if (optionalArray != null) {
    const newOptArray = optionalArray.filter((_, i) => !sortedResponses.every((resp) => resp.index != i));
    optionalArray.splice(0, optionalArray.length);
    newOptArray.forEach((el) => optionalArray.push(el));
  }
  const cleanedResponses = sortedResponses.map((resp, idx) => {
    for (let key in resp) {
      if (resp.hasOwnProperty(key) && key !== "index" && key !== "tag")
        return resp[key];
    }
    throw new TideError({
      code: TideJsErrorCodes.PARSE_NODECLIENT_RESPONSE_SHAPE,
      displayMessage: `WaitForThresholdNumberofORKs got unexpected response shape: keyType=${keyType}, index=${idx}, responseKeys=[${Object.keys(resp).join(",")}]`,
      source: "Tools/Utils.ts:250"
    });
  });
  return { fulfilledResponses: cleanedResponses, bitwise };
}
function removeRandomElements(array, targetArraySize) {
  let newArray = array.slice();
  if (newArray.length < targetArraySize) {
    throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_LENGTH, displayMessage: `Array size must be greater than n (got length=${newArray.length}, target=${targetArraySize}).`, source: "tide-js/Tools/Utils.ts:262" });
  } else if (newArray.length == targetArraySize)
    return newArray;
  while (newArray.length > targetArraySize) {
    let randomIndex = Math.floor(Math.random() * newArray.length);
    newArray.splice(randomIndex, 1);
  }
  return newArray;
}
function randBetween(x, y) {
  x = BigInt(x);
  y = BigInt(y);
  if (x > y) {
    const temp = x;
    x = y;
    y = temp;
  }
  const range = BigInt(y) - BigInt(x) + BigInt(1);
  const randNum = Math.floor(Math.random() * Number(range));
  const rand = BigInt(randNum);
  return rand + BigInt(x);
}
function sortORKs(orks) {
  const orkRef = orks.slice();
  return orkRef.sort((a, b) => {
    if (BigInt(a.orkID) < BigInt(b.orkID))
      return -1;
    if (BigInt(a.orkID) > BigInt(b.orkID))
      return 1;
    return 0;
  });
}
function randomiseEmails(arr) {
  if (arr == null) {
    return Array(Max).fill(null);
  }
  let output = [];
  const repetitions = Math.floor(Max / arr.length);
  let remainingSpaces = Max % arr.length;
  arr.forEach((item) => {
    for (let i = 0; i < repetitions; i++) {
      output.push(item);
    }
    if (remainingSpaces > 0) {
      output.push(item);
      remainingSpaces--;
    }
  });
  for (let i = output.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}

// node_modules/@tideorg/js/dist/Flow/VoucherFlows/VoucherFlow.js
var VoucherFlow = class {
  orkPaymentPublics;
  voucherURL;
  action;
  constructor(orkPaymentPublics, voucherURL, action) {
    this.orkPaymentPublics = orkPaymentPublics;
    this.voucherURL = voucherURL;
    this.action = action;
  }
  /**
   * I'm making this so I can use keycloak's client that has all of the keycloak's authorization built in.
   */
  async GetVouchers(clientFunction = null) {
    let vouchers = void 0;
    const k = TideKey.NewKey(Ed25519Scheme);
    const blurKeyPub = await k.prepVouchersReq(this.orkPaymentPublics);
    if (clientFunction == null) {
      const vendorClient = new VoucherClient(this.voucherURL);
      vouchers = await vendorClient.GetVouchers(blurKeyPub, this.action, k.get_public_component().public);
    } else {
      const request = JSON.stringify({
        BlurPORKi: blurKeyPub.map((blur) => blur.toBase64()),
        ActionRequest: this.action,
        BlurerK: k.get_public_component().public.toBase64()
      });
      const response = await clientFunction(request);
      vouchers = VoucherResponse.from(response, k.get_public_component().public.toBase64());
    }
    return { vouchers, k };
  }
};

// node_modules/@tideorg/js/dist/Math/KeyDecryption.js
async function GetKeys(appliedC1s, ids) {
  const lis = GetLis(ids);
  const appliedC1sWithLi = appliedC1s.map((c1, i) => c1.map((c) => c.mul(lis[i])));
  return Promise.all(AggregatePointArrays(appliedC1sWithLi).map(async (p) => SHA256_Digest(p.toRawBytes())));
}

// node_modules/@tideorg/js/dist/Flow/DecryptionFlows/dVVKDecryptionFlow.js
var dVVKDecryptionFlow = class {
  vvkid;
  vvkPublic;
  orks;
  sessKey;
  doken;
  getVouchersFunction;
  voucherURL;
  constructor(vvkid, vvkPublic, orks, sessKey, doken, voucherURL) {
    this.vvkid = vvkid;
    this.vvkPublic = vvkPublic;
    this.orks = orks;
    this.orks = sortORKs(this.orks);
    if (!doken.payload.sessionKey.Equals(sessKey.get_public_component())) {
      const dokenFp = String(doken.payload.sessionKey.Serialize().ToString()).slice(0, 8);
      const suppliedFp = String(sessKey.get_public_component().Serialize().ToString()).slice(0, 8);
      throw new TideError({
        code: TideJsErrorCodes.CRYPTO_SESSION_KEY_MISMATCH,
        displayMessage: `Doken session key (${dokenFp}) does not match supplied session key (${suppliedFp})`,
        source: "Flow/DecryptionFlows/dVVKDecryptionFlow.ts:41"
      });
    }
    this.sessKey = sessKey;
    this.doken = doken;
    this.getVouchersFunction = null;
    this.voucherURL = voucherURL;
  }
  setVoucherRetrievalFunction(getVouchersFunction) {
    this.getVouchersFunction = getVouchersFunction;
    return this;
  }
  async start(request, waitForAll = false) {
    const pre_clients = this.orks.map((info) => new NodeClient(info.orkURL).AddBearerAuthorization(this.sessKey.get_private_component().rawBytes, this.sessKey.get_public_component().Serialize().ToString(), this.doken.serialize()).EnableTideDH(info.orkPublic));
    const voucherFlow = new VoucherFlow(this.orks.map((o) => o.orkPaymentPublic), this.voucherURL, "vendordecrypt");
    const { vouchers } = await voucherFlow.GetVouchers(this.getVouchersFunction);
    const clients = await Promise.all(pre_clients);
    const pre_PreDecryptResponses = clients.map((client, i) => client.Decrypt(i, this.vvkid, request, vouchers.toORK(i)));
    const { fulfilledResponses, bitwise } = await WaitForNumberofORKs(this.orks, pre_PreDecryptResponses, "VVK", waitForAll ? Max : Threshold, null, clients);
    return GetKeys(fulfilledResponses, this.orks.map((o) => BigInt(o.orkID)));
  }
};

// node_modules/@tideorg/js/dist/Math/KeySigning.js
function PreSign(GRij) {
  if (!GRij.every((Gri) => Gri.length == GRij[0].length)) {
    const arrayOfLengths = GRij.map((arr) => arr.length);
    throw new TideError({
      code: TideJsErrorCodes.CRYPTO_ORK_ARRAY_LENGTH_MISMATCH,
      displayMessage: `ORK array length mismatch (GRs): lengths=[${arrayOfLengths.join(", ")}] (expected uniform)`,
      source: "Math/KeySigning.ts:22"
    });
  }
  return GRij[0].map((_, i) => GRij.reduce((sum, next) => sum.add(next[i]), Point.ZERO));
}
function Sign(Sis) {
  if (!Sis.every((Si) => Si.length == Sis[0].length)) {
    const arrayOfLengths = Sis.map((arr) => arr.length);
    throw new TideError({
      code: TideJsErrorCodes.CRYPTO_ORK_ARRAY_LENGTH_MISMATCH,
      displayMessage: `ORK array length mismatch (Si): lengths=[${arrayOfLengths.join(", ")}] (expected uniform)`,
      source: "Math/KeySigning.ts:27"
    });
  }
  return Sis[0].map((_, i) => mod(Sis.reduce((sum, next) => sum + next[i], BigInt(0))));
}

// node_modules/@tideorg/js/dist/Flow/SigningFlows/dVVKSigningFlow.js
var dVVKSigningFlow = class {
  vvkid;
  vvkPublic;
  orks;
  sessKey;
  doken;
  getVouchersFunction;
  voucherURL;
  constructor(vvkid, vvkPublic, orks, sessKey, doken, voucherURL) {
    this.vvkid = vvkid;
    this.vvkPublic = vvkPublic;
    this.orks = orks;
    this.orks = sortORKs(this.orks);
    if (doken) {
      if (!doken.payload.sessionKey.Equals(sessKey.get_public_component())) {
        const dokenFp = String(doken.payload.sessionKey.Serialize().ToString()).slice(0, 8);
        const suppliedFp = String(sessKey.get_public_component().Serialize().ToString()).slice(0, 8);
        throw new TideError({
          code: TideJsErrorCodes.CRYPTO_SESSION_KEY_MISMATCH,
          displayMessage: `Doken session key (${dokenFp}) does not match supplied session key (${suppliedFp})`,
          source: "Flow/SigningFlows/dVVKSigningFlow.ts:44"
        });
      }
      this.doken = doken.serialize();
    }
    this.sessKey = sessKey;
    this.getVouchersFunction = null;
    this.voucherURL = voucherURL;
  }
  setVoucherRetrievalFunction(getVouchersFunction) {
    this.getVouchersFunction = getVouchersFunction;
    return this;
  }
  async start(request, waitForAll = false) {
    const voucherFlow = new VoucherFlow(this.orks.map((o) => o.orkPaymentPublic), this.voucherURL, "vendorsign");
    const pre_vouchers = voucherFlow.GetVouchers(this.getVouchersFunction);
    const pre_clients = this.orks.map((info) => new NodeClient(info.orkURL).AddBearerAuthorization(this.sessKey.get_private_component().rawBytes, this.sessKey.get_public_component().Serialize().ToString(), this.doken).EnableTideDH(info.orkPublic));
    const clients = await Promise.all(pre_clients);
    const { vouchers } = await pre_vouchers;
    const pre_PreSignResponses = clients.map((client, i) => client.PreSign(i, this.vvkid, request, vouchers.toORK(i)));
    const { fulfilledResponses, bitwise } = await WaitForNumberofORKs(this.orks, pre_PreSignResponses, "VVK", waitForAll ? Max : Threshold, null, clients);
    const GRj = PreSign(fulfilledResponses.map((f) => f.GRis));
    const pre_SignResponses = clients.map((client, i) => client.Sign(this.vvkid, request, GRj, serializeBitArray(bitwise)));
    const SignResponses = await Promise.all(pre_SignResponses);
    const Sj = Sign(SignResponses.map((s) => s.Sij));
    if (GRj.length != Sj.length)
      throw new TideError({
        code: TideJsErrorCodes.CRYPTO_GRJ_SJ_LENGTH_MISMATCH,
        displayMessage: `GRj/Sj length mismatch: GRjs=${GRj.length}, Sjs=${Sj.length}, vvkid=${String(this.vvkid).slice(0, 12)}`,
        source: "Flow/SigningFlows/dVVKSigningFlow.ts:76"
      });
    let sigs = [];
    for (let i = 0; i < GRj.length; i++) {
      sigs.push(ConcatUint8Arrays([GRj[i].toRawBytes(), BigIntToByteArray(Sj[i])]));
    }
    return sigs;
  }
};

// node_modules/@tideorg/js/dist/Models/PolicyProtectedSerializedField.js
var PolicyProtectedSerializedField = class {
  static version = 2;
  static create(encData, timestamp, encKey = null, signature = null) {
    const versionByte = numberToUint8Array(this.version, 1);
    const timestampBits = typeof timestamp === "number" ? numberToUint8Array(timestamp, 8) : timestamp;
    return TideMemory.CreateFromArray([
      versionByte,
      encData,
      timestampBits,
      encKey == null ? new Uint8Array() : encKey,
      signature == null ? new Uint8Array() : signature
    ]);
  }
  static deserialize(serializedField) {
    const version = Uint8ArrayToNumber(Serialization_exports.GetValue(serializedField, 0));
    if (version != this.version)
      throw new TideError({ code: TideJsErrorCodes.MODEL_VERSION_MISMATCH, displayMessage: `PolicyProtectedSerializedField.deserialize: expected version ${this.version} (got ${version})`, source: "tide-js/Models/PolicyProtectedSerializedField.ts:41" });
    const encFieldChk = Serialization_exports.GetValue(serializedField, 1);
    const timestamp = Serialization_exports.GetValue(serializedField, 2);
    const encKey = Serialization_exports.GetValue(serializedField, 3);
    const signature = Serialization_exports.GetValue(serializedField, 4);
    return {
      encFieldChk,
      timestamp,
      encKey: encKey.length == 0 ? null : encKey,
      signature: signature.length == 0 ? null : signature
    };
  }
};

// node_modules/@tideorg/js/dist/Tools/index.js
var Tools_exports = {};
__export(Tools_exports, {
  CurrentTime: () => CurrentTime,
  Max: () => Max,
  Threshold: () => Threshold,
  TideMemory: () => TideMemory,
  WaitForNumberofORKs: () => WaitForNumberofORKs,
  randBetween: () => randBetween,
  randomiseEmails: () => randomiseEmails,
  removeRandomElements: () => removeRandomElements,
  sortORKs: () => sortORKs
});

// node_modules/@tideorg/js/dist/Flow/EncryptionFlows/PolicyAuthorizedEncryptionFlow.js
var PolicyAuthorizedEncryptionFlow = class {
  vvkId;
  token;
  sessKey;
  voucherURL;
  policy;
  vvkInfo;
  constructor(config) {
    if (!config.token.payload.sessionKey.Equals(config.sessionKey.get_public_component())) {
      const dokenFp = String(config.token.payload.sessionKey.Serialize().ToString()).slice(0, 8);
      const suppliedFp = String(config.sessionKey.get_public_component().Serialize().ToString()).slice(0, 8);
      throw new TideError({
        code: TideJsErrorCodes.CRYPTO_SESSION_KEY_MISMATCH,
        displayMessage: `Doken session key (${dokenFp}) does not match supplied session key (${suppliedFp})`,
        source: "Flow/EncryptionFlows/PolicyAuthorizedEncryptionFlow.ts:62"
      });
    }
    this.vvkId = config.vendorId;
    this.token = config.token;
    this.sessKey = config.sessionKey;
    this.voucherURL = config.voucherURL;
    this.vvkInfo = config.keyInfo;
  }
  async createEncryptionRequest(datasToEncrypt, addHeavyDataToReq = false) {
    const encReqs = await Promise.all(datasToEncrypt.map(async (d) => {
      const d_b = d.data;
      if (d_b.length < 32) {
        const tags_b = d.tags.map((t) => StringToUint8Array(t));
        const encryptedData = await Encryption_exports.ElGamal.encryptDataRaw_withAuthentication(d_b, this.vvkInfo.UserPublic, Serialization_exports.ConcatUint8Arrays(tags_b));
        return {
          encryptionToSign: encryptedData.cipher,
          encryptionAuthData: encryptedData.auth,
          encryptedData: encryptedData.cipher,
          tags: tags_b,
          sizeLessThan32: true
        };
      } else {
        const tags_b = d.tags.map((t) => StringToUint8Array(t));
        const largeDataKey = window.crypto.getRandomValues(new Uint8Array(32));
        const encryptedData = await encryptDataRawOutput(d_b, largeDataKey);
        const encryptedKey = await Encryption_exports.ElGamal.encryptDataRaw_withAuthentication(largeDataKey, this.vvkInfo.UserPublic, Serialization_exports.ConcatUint8Arrays(tags_b));
        return {
          encryptionToSign: encryptedKey.cipher,
          encryptionAuthData: encryptedKey.auth,
          encryptedData,
          tags: tags_b,
          sizeLessThan32: false
        };
      }
    }));
    const timestamp = CurrentTime();
    const timestamp_b = numberToUint8Array(timestamp, 8);
    let arr = [timestamp_b];
    encReqs.forEach((enc2) => {
      const entry = CreateTideMemoryFromArray([
        enc2.encryptionToSign.slice(0, 32),
        // only get C1 point for draft
        enc2.encryptionAuthData,
        ...enc2.tags
      ]);
      arr.push(entry);
    });
    const draft = CreateTideMemoryFromArray(arr);
    const request = new BaseTideRequest("PolicyEnabledEncryption", "1", "Policy:1", draft);
    if (addHeavyDataToReq) {
      request.setCustomExpiry(604800);
      const dataToStoreLater = Serialization_exports.CreateTideMemoryFromArray(encReqs.map((e) => PolicyProtectedSerializedField.create(e.encryptedData, timestamp, e.sizeLessThan32 ? null : e.encryptionToSign, null)));
      request.addAuthorizerCertificate(dataToStoreLater);
    }
    return { request, encReqs, timestamp };
  }
  async encrypt(datasToEncrypt, policy) {
    const { request: encryptionRequest, encReqs, timestamp } = await this.createEncryptionRequest(datasToEncrypt);
    encryptionRequest.addPolicy(policy);
    const encryptingSigningFlow = new dVVKSigningFlow(this.vvkId, this.vvkInfo.UserPublic, this.vvkInfo.OrkInfo, this.sessKey, this.token, this.voucherURL);
    const signatures = await encryptingSigningFlow.start(encryptionRequest);
    return signatures.map((sig, i) => PolicyProtectedSerializedField.create(encReqs[i].encryptedData, timestamp, encReqs[i].sizeLessThan32 ? null : encReqs[i].encryptionToSign, sig));
  }
  async commitEncrypt(request, policy) {
    const readyEncRequest = BaseTideRequest.decode(request);
    const encryptedData = readyEncRequest.authorizerCert;
    readyEncRequest.authorizerCert = new Tools_exports.TideMemory();
    let encryptedDatas = [];
    let resultObj = { result: void 0 };
    for (let i = 0; Serialization_exports.TryGetValue(encryptedData, i, resultObj); i++) {
      encryptedDatas.push(resultObj.result);
    }
    const deserializedDatas = encryptedDatas.map((e) => {
      const b = PolicyProtectedSerializedField.deserialize(e);
      if (b.signature != null)
        throw Error("There shouldn't be any signatures in this data");
      return b;
    });
    readyEncRequest.addPolicy(policy);
    const encryptingSigningFlow = new dVVKSigningFlow(this.vvkId, this.vvkInfo.UserPublic, this.vvkInfo.OrkInfo, this.sessKey, this.token, this.voucherURL);
    const signatures = await encryptingSigningFlow.start(readyEncRequest);
    return signatures.map((sig, i) => PolicyProtectedSerializedField.create(deserializedDatas[i].encFieldChk, deserializedDatas[i].timestamp, deserializedDatas[i].encKey ? deserializedDatas[i].encKey : null, sig));
  }
  createDecryptionRequest(datasToDecrypt, addHeavyDataToReq = false) {
    const deserializedDatas = datasToDecrypt.map((d) => {
      const b = PolicyProtectedSerializedField.deserialize(d.encrypted);
      if (b.signature == null)
        throw new TideError({
          code: TideJsErrorCodes.VAL_INPUT_SHAPE,
          displayMessage: "The data you are trying to decrypt is missing its authorization signature and cannot be decrypted. Please refresh and try again, or contact support if the problem persists.",
          source: "Flow/EncryptionFlows/PolicyAuthorizedEncryptionFlow.ts:208",
          details: [
            {
              displayMessage: "PolicyProtectedSerializedField.deserialize returned a record with no `signature` field",
              code: `encryptedSize=${d.encrypted?.byteLength ?? "<unknown>"} tags=${JSON.stringify(d.tags)}`
            }
          ]
        });
      const tags_b = d.tags.map((t) => StringToUint8Array(t));
      return {
        ...b,
        tags: tags_b
      };
    });
    const entries = deserializedDatas.map((data, i) => {
      if (data.encKey) {
        const entry = CreateTideMemoryFromArray([
          data.encKey.slice(0, 32),
          // only send c1 (point)
          data.signature,
          data.timestamp,
          ...data.tags
        ]);
        return entry;
      } else {
        const entry = CreateTideMemoryFromArray([
          data.encFieldChk.slice(0, 32),
          // only send c1 (point)
          data.signature,
          data.timestamp,
          ...data.tags
        ]);
        return entry;
      }
    });
    const draft = CreateTideMemoryFromArray(entries);
    const request = new BaseTideRequest("PolicyEnabledDecryption", "1", "Policy:1", draft);
    if (addHeavyDataToReq) {
      request.setCustomExpiry(604800);
      const dynData = TideMemory.CreateFromArray(deserializedDatas.map((d) => {
        return TideMemory.CreateFromArray([d.encFieldChk, d.encKey ? d.encKey : new Uint8Array()]);
      }));
      request.addAuthorizerCertificate(dynData);
    }
    return { request, deserializedDatas };
  }
  async decrypt(datasToDecrypt, policy) {
    const { request: decryptionRequest, deserializedDatas } = this.createDecryptionRequest(datasToDecrypt);
    decryptionRequest.addPolicy(policy);
    const flow = new dVVKDecryptionFlow(this.vvkId, this.vvkInfo.UserPublic, this.vvkInfo.OrkInfo, this.sessKey, this.token, this.voucherURL);
    const dataKeys = await flow.start(decryptionRequest);
    const decryptedDatas = await Promise.all(deserializedDatas.map(async (data, i) => {
      if (data.encKey) {
        const key = await decryptDataRawOutput(data.encKey.slice(32), dataKeys[i]);
        return await decryptDataRawOutput(data.encFieldChk, key);
      } else {
        return await decryptDataRawOutput(data.encFieldChk.slice(32), dataKeys[i]);
      }
    }));
    return decryptedDatas;
  }
  async commitDecrypt(request, policy) {
    const decryptionRequest = BaseTideRequest.decode(request);
    decryptionRequest.addPolicy(policy);
    const heavyData = decryptionRequest.authorizerCert;
    decryptionRequest.authorizerCert = new TideMemory();
    const flow = new dVVKDecryptionFlow(this.vvkId, this.vvkInfo.UserPublic, this.vvkInfo.OrkInfo, this.sessKey, this.token, this.voucherURL);
    const dataKeys = await flow.start(decryptionRequest);
    let resultObj = { result: void 0 };
    let decryptedDatas = [];
    for (let i = 0; TryGetValue(heavyData, i, resultObj); i++) {
      const encFieldChk = GetValue(resultObj.result, 0);
      const encKey = GetValue(resultObj.result, 1);
      if (encKey.length > 0) {
        const key = await decryptDataRawOutput(encKey.slice(32), dataKeys[i]);
        decryptedDatas.push(await decryptDataRawOutput(encFieldChk, key));
      } else {
        decryptedDatas.push(await decryptDataRawOutput(encFieldChk.slice(32), dataKeys[i]));
      }
    }
    return decryptedDatas;
  }
};

// node_modules/@tideorg/js/dist/Models/ModelRegistry.js
var HumanReadableModelBuilder = class {
  _humanReadableName = null;
  _data;
  _draft;
  request;
  reqId;
  // DISPLAY-ONLY names map (roleId->name, userId->username). Never signed; see
  // HumanReadableContext. Optional - undefined when the caller supplies none.
  _context;
  constructor(data, reqId, context) {
    if (data) {
      this._data = data;
      this._draft = GetValue(this._data, 3);
      this.request = BaseTideRequest.decode(data);
    }
    this.reqId = reqId;
    this._context = context;
  }
  static create(data, reqId, context) {
    return new this(data, reqId, context);
  }
  getDetailsMap() {
    return [];
  }
  getRequestDataJson() {
    return {};
  }
  getExpiry() {
    return this.request.expiry;
  }
  async getDataToApprove() {
    return this.request.dataToApprove();
  }
};
var HederaSignRequestBuilder = class extends HumanReadableModelBuilder {
  _name = "HederaTx";
  _version = "1";
  customInfo;
  additionalInfo;
  get _id() {
    return this._name + ":" + this._version;
  }
  constructor(data, reqId) {
    super(data, reqId);
    if (data) {
      this.customInfo = JSON.parse(StringFromUint8Array(Serialization_exports.GetValue(this.request.draft, 0)));
      this.additionalInfo = this.customInfo["additionalInfo"];
      this._humanReadableName = `Request to send ${BigInt(this.additionalInfo["Total being spent (tinybar)"]) / BigInt(1e8)} HBAR`;
    }
  }
  getRequestDataJson() {
    return this.additionalInfo;
  }
};
var OffboardSignRequestBuilder = class extends HumanReadableModelBuilder {
  _name = "Offboard";
  _version = "1";
  _humanReadableName = "Offboard from the Tide network (cancel subscription and protection)";
  get _id() {
    return this._name + ":" + this._version;
  }
  constructor(data, reqId) {
    super(data, reqId);
  }
  getDetailsMap() {
    let summary = {};
    summary["WARNING"] = "Warning: approving this offboards your account from the Tide network. It cancels your subscription and Tide protection, and cannot be undone.";
    summary["You are about to"] = "Offboard this account from the Tide network";
    summary["Note"] = "Only approve this if you intend to permanently offboard from the Tide network.";
    return summary;
  }
  getRequestDataJson() {
    const vrk = Bytes2Hex(GetValue(this._draft, 0));
    let body = {
      "Vendor Rotating Key for Offboarding": vrk
    };
    return body;
  }
};
var PolicySignRequestBuilder = class extends HumanReadableModelBuilder {
  _name = "Policy";
  _version = "1";
  _humanReadableName = "Approve new policy for use with Tide";
  get _id() {
    return this._name + ":" + this._version;
  }
  constructor(data, expiry) {
    super(data, expiry);
    try {
      const policy = this._tryGetPolicy();
      if (policy && this._isAdminThresholdPolicy(policy)) {
        this._humanReadableName = "Update admin approval threshold (re-sign tide-realm-admin policy)";
      }
    } catch {
    }
  }
  // Decode the Policy carried in draft[0], or null if absent/undecodable.
  _tryGetPolicy() {
    try {
      if (!this._draft)
        return null;
      const policyBytes = GetValue(this._draft, 0);
      if (!policyBytes || policyBytes.length === 0)
        return null;
      return Policy.from(policyBytes);
    } catch {
      return null;
    }
  }
  // True when the Policy is the multiAdmin tide-realm-admin approval-threshold
  // policy. Keyed on the producer-stamped contractId
  // ("GenericResourceAccessThresholdRole:1") PLUS the role/resource params, so
  // an ordinary GenericResourceAccessThresholdRole policy for some OTHER
  // role/resource still falls through to the generic title.
  _isAdminThresholdPolicy(policy) {
    try {
      if (policy.contractId !== "GenericResourceAccessThresholdRole:1")
        return false;
      const role = policy.params?.entries?.get("role");
      const resource = policy.params?.entries?.get("resource");
      return role === "tide-realm-admin" && resource === "realm-management";
    } catch {
      return false;
    }
  }
  getDetailsMap() {
    let summary = {};
    const draftBytes = this._draft;
    if (!draftBytes)
      return { error: "No draft data" };
    const policyBytes = GetValue(draftBytes, 0);
    const policy = Policy.from(policyBytes);
    if (this._isAdminThresholdPolicy(policy)) {
      const threshold = policy.params?.entries?.get("threshold");
      if (threshold !== void 0 && !(threshold instanceof Uint8Array)) {
        summary["New admin approvals required"] = threshold;
      }
    }
    summary["Version"] = policy.version;
    summary["ContractId"] = policy.contractId;
    summary["ModelId"] = policy.modelIds.join(", ");
    summary["KeyId"] = policy.keyId;
    summary["Approval Type"] = ApprovalType[policy.approvalType];
    summary["Execution Type"] = ExecutionType[policy.executionType];
    for (const [key, value] of policy.params.entries.entries()) {
      if (!(value instanceof Uint8Array))
        summary[`Parameter:${key}`] = value;
    }
    let res = {};
    if (TryGetValue(draftBytes, 1, res) && res.result && res.result.length >= 4) {
      const contractBytes = res.result;
      const contractType = StringFromUint8Array(GetValue(contractBytes, 0));
      summary["Contract To Upload Type"] = contractType;
      summary["Contract Included"] = "Yes - see Request Data for source code";
    }
    return summary;
  }
  getRequestDataJson() {
    let data = {};
    const draftBytes = this._draft;
    if (!draftBytes)
      return data;
    let res = {};
    if (TryGetValue(draftBytes, 1, res) && res.result && res.result.length >= 4) {
      const contractBytes = res.result;
      let forsetiDataRes = {};
      if (TryGetValue(contractBytes, 1, forsetiDataRes)) {
        const forsetiData = forsetiDataRes.result;
        let innerPayloadRes = {};
        if (TryGetValue(forsetiData, 1, innerPayloadRes)) {
          const innerPayload = innerPayloadRes.result;
          let sourceCodeRes = {};
          if (TryGetValue(innerPayload, 0, sourceCodeRes)) {
            const contractCode = StringFromUint8Array(sourceCodeRes.result);
            data["Contract Source Code"] = contractCode;
          }
        }
      }
    }
    return data;
  }
};
var PolicyEnabledEncryptionRequestBuilder = class extends HumanReadableModelBuilder {
  _name = "PolicyEnabledEncryption";
  _version = "1";
  get _id() {
    return this._name + ":" + this._version;
  }
  constructor(data, expiry) {
    super(data, expiry);
    if (data) {
      const timestamp = GetValue(this.request.draft, 0);
      let resultObj = { result: void 0 };
      let i = 1;
      while (TryGetValue(this.request.draft, i, resultObj)) {
        i++;
      }
      const count = i - 1;
      this._humanReadableName = `Encrypt ${count} piece${count != 1 ? "s" : ""} of data`;
    }
  }
};
var PolicyEnabledDecryptionRequestBuilder = class extends HumanReadableModelBuilder {
  _name = "PolicyEnabledDecryption";
  _version = "1";
  get _id() {
    return this._name + ":" + this._version;
  }
  constructor(data, expiry) {
    super(data, expiry);
    if (data) {
      let resultObj = { result: void 0 };
      let i = 0;
      while (TryGetValue(this.request.draft, i, resultObj)) {
        i++;
      }
      this._humanReadableName = `Decrypt ${i} piece${i != 1 ? "s" : ""} of data`;
    }
  }
};
var LicenseSignRequestBuilder = class extends HumanReadableModelBuilder {
  _name = "RotateVRK";
  _version = "1";
  _humanReadableName = "Renew License with New Permissions";
  get _id() {
    return this._name + ":" + this._version;
  }
  constructor(data, expiry) {
    super(data, expiry);
  }
  getDetailsMap() {
    const authPack = new AuthorizerPack(this._draft);
    let summary = [];
    summary["Signing new license"] = authPack.Authorizer.GVRK.Serialize().ToString();
    summary["Approved Models to Sign"] = authPack.SignModels;
    return summary;
  }
};
var TestInitSignRequestBuilder = class extends HumanReadableModelBuilder {
  _name = "TestInit";
  _version = "1";
  _humanReadableName = "Test Tide Request";
  get _id() {
    return this._name + ":" + this._version;
  }
  constructor(data, expiry) {
    super(data, expiry);
  }
  getDetailsMap() {
    let summary = [];
    summary["Draft Detail"] = StringFromUint8Array(this._draft);
    return summary;
  }
};
var ServerCertSignRequestBuilder = class extends HumanReadableModelBuilder {
  _name = "ServerCert";
  _version = "1";
  _humanReadableName = "Server Certificate";
  get _id() {
    return this._name + ":" + this._version;
  }
  constructor(data, reqId) {
    super(data, reqId);
  }
  getDetailsMap() {
    let summary = {};
    if (this.request && this.request.dyanmicData && this.request.dyanmicData.length > 0) {
      try {
        const jsonStr = new TextDecoder().decode(this.request.dyanmicData);
        const parsed = JSON.parse(jsonStr);
        if (parsed.realm)
          summary["Realm"] = parsed.realm;
        if (parsed.clientId)
          summary["Client ID"] = parsed.clientId;
        if (parsed.instanceId)
          summary["Instance ID"] = parsed.instanceId;
        if (parsed.spiffeId)
          summary["SPIFFE ID"] = parsed.spiffeId;
      } catch {
      }
    }
    return summary;
  }
  getRequestDataJson() {
    let data = {};
    if (this._draft && this._draft.length > 0) {
      data["TBS Certificate (DER)"] = Bytes2Hex(this._draft);
    }
    return data;
  }
};
function decodeCbor(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let pos = 0;
  function readUint(n) {
    let v = 0;
    for (let i = 0; i < n; i++) {
      v = v * 256 + dv.getUint8(pos);
      pos++;
    }
    return v;
  }
  function readLength(ai) {
    if (ai < 24)
      return ai;
    if (ai === 24)
      return readUint(1);
    if (ai === 25)
      return readUint(2);
    if (ai === 26)
      return readUint(4);
    if (ai === 27)
      return readUint(8);
    if (ai === 31)
      return -1;
    throw new Error("Unsupported CBOR additional info: " + ai);
  }
  function readItem() {
    const ib = dv.getUint8(pos);
    pos++;
    const major = ib >> 5;
    const ai = ib & 31;
    switch (major) {
      case 0:
        return readLength(ai);
      case 1:
        return -1 - readLength(ai);
      case 2: {
        if (ai === 31) {
          const chunks = [];
          while (dv.getUint8(pos) !== 255) {
            const c = readItem();
            for (const b of c)
              chunks.push(b);
          }
          pos++;
          return new Uint8Array(chunks);
        }
        const len = readLength(ai);
        const out = bytes.subarray(pos, pos + len);
        pos += len;
        return new Uint8Array(out);
      }
      case 3: {
        if (ai === 31) {
          let s = "";
          while (dv.getUint8(pos) !== 255) {
            s += readItem();
          }
          pos++;
          return s;
        }
        const len = readLength(ai);
        const slice = bytes.subarray(pos, pos + len);
        pos += len;
        return new TextDecoder().decode(slice);
      }
      case 4: {
        const arr = [];
        if (ai === 31) {
          while (dv.getUint8(pos) !== 255)
            arr.push(readItem());
          pos++;
          return arr;
        }
        const len = readLength(ai);
        for (let i = 0; i < len; i++)
          arr.push(readItem());
        return arr;
      }
      case 5: {
        const map = {};
        if (ai === 31) {
          while (dv.getUint8(pos) !== 255) {
            const k = readItem();
            map[String(k)] = readItem();
          }
          pos++;
          return map;
        }
        const len = readLength(ai);
        for (let i = 0; i < len; i++) {
          const k = readItem();
          map[String(k)] = readItem();
        }
        return map;
      }
      case 7:
        if (ai === 20)
          return false;
        if (ai === 21)
          return true;
        if (ai === 22)
          return null;
        if (ai === 23)
          return void 0;
        if (ai === 25 || ai === 26 || ai === 27) {
          readUint(ai === 25 ? 2 : ai === 26 ? 4 : 8);
          return null;
        }
        return null;
      default:
        throw new Error("Unsupported CBOR major type: " + major);
    }
  }
  return readItem();
}
var ATTESTATION_UNIT_TYPE_NAMES = {
  0: "realm_config",
  1: "client_config",
  2: "client_scope_config",
  3: "protocol_mapper",
  4: "role_definition",
  5: "group_definition",
  6: "user_identity",
  7: "user_role_mapping_set",
  8: "user_group_membership_set",
  9: "group_role_mapping_set",
  10: "role_composite_children_set",
  11: "client_scope_assignment_set",
  12: "client_mapper_set",
  13: "client_scope_mapper_set",
  14: "scope_role_allowlist_set",
  15: "realm_default_groups_set",
  16: "organization_definition",
  17: "organization_domain_set"
};
var NODE_ACTION_TITLES = {
  DELETE_CLIENT: (l) => `Delete the app "${l}"`,
  DELETE_CLIENT_SCOPE: (l) => `Delete the client scope "${l}"`,
  DELETE_USER: (l) => `Delete the user "${l}"`,
  DELETE_ROLE: (l) => `Delete the role "${l}"`,
  DELETE_GROUP: (l) => `Delete the group "${l}"`,
  DELETE_ORGANIZATION: (l) => `Delete the organization "${l}"`,
  DISABLE_IGA: () => "Turn off governance (QEA) for this realm",
  OFFBOARD_REALM: () => "Offboard (permanently shut down) this realm",
  CREATE_CLIENT: (l) => `Create the app "${l}"`,
  CREATE_CLIENT_SCOPE: (l) => `Create the client scope "${l}"`,
  CREATE_USER: (l) => `Create the user "${l}"`,
  CREATE_ROLE: (l) => `Create the role "${l}"`,
  CREATE_GROUP: (l) => `Create the group "${l}"`,
  CREATE_ORGANIZATION: (l) => `Create the organization "${l}"`,
  UPDATE_CLIENT_PROPERTY: (l) => `Update the app "${l}"`,
  UPDATE_CLIENT_REDIRECT_URIS: (l) => `Update the redirect URIs for app "${l}"`,
  UPDATE_CLIENT_WEB_ORIGINS: (l) => `Update the web origins for app "${l}"`,
  UPDATE_CLIENT_SCOPE_PROPERTY: (l) => `Update the client scope "${l}"`,
  UPDATE_PROTOCOL_MAPPER: (l) => `Update the protocol mapper "${l}"`,
  UPDATE_ORGANIZATION: (l) => `Update the organization "${l}"`
};
var NODE_DESTRUCTIVE_WARNINGS = {
  DELETE_CLIENT: "Warning: this permanently removes the app and all access through it. Apps and users relying on it will stop working.",
  DELETE_CLIENT_SCOPE: "Warning: this permanently removes the client scope. Apps that depend on it may lose claims or stop working.",
  DELETE_USER: "Warning: this permanently removes the user and their access. This cannot be undone.",
  DELETE_ROLE: "Warning: this permanently removes the role. Users and groups holding it will lose the access it granted.",
  DELETE_GROUP: "Warning: this permanently removes the group. Members will lose any access the group granted.",
  DELETE_ORGANIZATION: "Warning: this permanently removes the organization and its associations. This cannot be undone.",
  DISABLE_IGA: "Warning: this turns off approval governance for the whole realm. Future admin changes will apply without approval.",
  OFFBOARD_REALM: "Warning: this permanently shuts the realm down. This cannot be undone."
};
var NODE_ENTITY_NOUNS = {
  CLIENT: "App",
  CLIENT_SCOPE: "Client scope",
  USER: "User",
  ROLE: "Role",
  GROUP: "Group",
  ORGANIZATION: "Organization",
  REALM: "Realm"
};
var NODE_ACTION_VERBS = {
  DELETE_CLIENT: "Delete an app",
  DELETE_CLIENT_SCOPE: "Delete a client scope",
  DELETE_USER: "Delete a user",
  DELETE_ROLE: "Delete a role",
  DELETE_GROUP: "Delete a group",
  DELETE_ORGANIZATION: "Delete an organization",
  DISABLE_IGA: "Turn off governance for this realm",
  OFFBOARD_REALM: "Permanently shut this realm down",
  CREATE_CLIENT: "Create an app",
  CREATE_CLIENT_SCOPE: "Create a client scope",
  CREATE_USER: "Create a user",
  CREATE_ROLE: "Create a role",
  CREATE_GROUP: "Create a group",
  CREATE_ORGANIZATION: "Create an organization",
  UPDATE_CLIENT_PROPERTY: "Update an app",
  UPDATE_CLIENT_REDIRECT_URIS: "Update an app's redirect URIs",
  UPDATE_CLIENT_WEB_ORIGINS: "Update an app's web origins",
  UPDATE_CLIENT_SCOPE_PROPERTY: "Update a client scope",
  UPDATE_PROTOCOL_MAPPER: "Update a protocol mapper",
  UPDATE_ORGANIZATION: "Update an organization"
};
var NODE_DESTRUCTIVE_ACTIONS = /* @__PURE__ */ new Set([
  "DELETE_CLIENT",
  "DELETE_CLIENT_SCOPE",
  "DELETE_USER",
  "DELETE_ROLE",
  "DELETE_GROUP",
  "DELETE_ORGANIZATION",
  "DISABLE_IGA",
  "OFFBOARD_REALM"
]);
var NODE_LABEL_FIELDS = {
  CLIENT: ["CLIENT_ID"],
  CLIENT_SCOPE: ["CLIENT_SCOPE_NAME"],
  USER: ["USERNAME"],
  ROLE: ["ROLE_NAME"],
  GROUP: ["GROUP_NAME"],
  ORGANIZATION: ["ORG_NAME", "NAME", "ALIAS"],
  REALM: ["REALM_NAME", "NAME"]
};
var NODE_NOISY_FIELDS = /* @__PURE__ */ new Set([
  "CLIENT_UUID",
  "USER_UUID",
  "ROLE_UUID",
  "GROUP_UUID",
  "SCOPE_UUID",
  "CLIENT_SCOPE_UUID",
  "ORG_UUID",
  "ID",
  "REALM_ID"
]);
function decodeUtf8Loose(bytes) {
  try {
    return StringFromUint8Array(bytes);
  } catch {
    return "";
  }
}
function parseNodeCanonical(text) {
  if (!text.startsWith("node="))
    return void 0;
  const lines = text.split("\n");
  let node = "", entityType, entityId;
  const rows = [];
  for (const line of lines) {
    if (line.length === 0)
      continue;
    if (line.startsWith("node="))
      node = line.substring("node=".length);
    else if (line.startsWith("entityType="))
      entityType = line.substring("entityType=".length);
    else if (line.startsWith("entityId="))
      entityId = line.substring("entityId=".length);
    else if (line.startsWith("row=")) {
      const body = line.substring("row=".length);
      const row = {};
      if (body.length > 0) {
        for (const pair of body.split(";")) {
          const eq = pair.indexOf("=");
          if (eq < 0)
            continue;
          row[pair.substring(0, eq)] = pair.substring(eq + 1);
        }
      }
      rows.push(row);
    }
  }
  if (node.length === 0)
    return void 0;
  return { node, entityType, entityId, rows };
}
function parseLinkageCanonical(text) {
  if (!text.startsWith("table="))
    return void 0;
  const lines = text.split("\n");
  let table = "";
  const owners = [];
  let currentOwner;
  for (const line of lines) {
    if (line.length === 0)
      continue;
    if (line.startsWith("table="))
      table = line.substring("table=".length);
    else if (line.startsWith("owner=")) {
      currentOwner = line.substring("owner=".length);
      owners.push({ owner: currentOwner, members: [] });
    } else if (line.startsWith("members=")) {
      const body = line.substring("members=".length);
      const members = body.length > 0 ? body.split(",") : [];
      if (owners.length > 0)
        owners[owners.length - 1].members = members;
    }
  }
  if (table.length === 0)
    return void 0;
  return { table, owners };
}
var AttestationUnitSignRequestBuilder = class extends HumanReadableModelBuilder {
  _name = "AttestationUnit";
  _version = "1";
  // GENERIC, always-human-readable, ACTION-NEUTRAL fallback. The enclave
  // renderer uses `_humanReadableName ?? _name` for the card TITLE, so this MUST
  // never be a raw/opaque code (the old "AE" short code came from a stale bundle
  // that lacked this builder and fell through to the carrier short-name).
  //
  // It must ALSO never assert an action verb (grant/delete/create/update/revoke):
  // the signed draft carries only the structural `unit_type` + payloads, NOT the
  // CR action verb, so we cannot prove what is happening to the artifact from the
  // bytes. A DELETE_CLIENT / OFFBOARD_REALM / etc. must NEVER render as "grant a
  // role". The constructor refines this to a type-specific (still neutral) title
  // below; even if decoding fails the admin sees an honest "Governance change"
  // rather than a fabricated grant.
  _humanReadableName = "Governance change";
  get _id() {
    return this._name + ":" + this._version;
  }
  constructor(data, reqId, context) {
    super(data, reqId, context);
    try {
      this._humanReadableName = this._buildTitle() ?? this._humanReadableName;
    } catch {
    }
  }
  // Lazily decode draft segment 0 as UTF-8 and try the two producer plaintext
  // canonical shapes. Cached so repeated title/details calls parse once. Never
  // throws; returns the parsed form or undefined when the segment is not that
  // plaintext (CBOR unit, empty, or garbage), in which case callers fall through
  // to the CBOR / neutral path.
  _nodeCanon = null;
  // null = not yet computed
  _linkageCanon = null;
  _firstSegmentText() {
    try {
      if (!this._draft)
        return "";
      const res = {};
      if (!TryGetValue(this._draft, 0, res))
        return "";
      const bytes = res.result;
      if (!bytes || bytes.length === 0)
        return "";
      return decodeUtf8Loose(bytes);
    } catch {
      return "";
    }
  }
  _getNodeCanonical() {
    if (this._nodeCanon === null) {
      try {
        this._nodeCanon = parseNodeCanonical(this._firstSegmentText());
      } catch {
        this._nodeCanon = void 0;
      }
    }
    return this._nodeCanon ?? void 0;
  }
  _getLinkageCanonical() {
    if (this._linkageCanon === null) {
      try {
        this._linkageCanon = parseLinkageCanonical(this._firstSegmentText());
      } catch {
        this._linkageCanon = void 0;
      }
    }
    return this._linkageCanon ?? void 0;
  }
  // Pick the most human-friendly label for a node CR from its parsed rows
  // (e.g. CLIENT_ID, USERNAME, NAME), falling back to the entityId, then "(?)".
  _nodeLabel(node) {
    const fields = node.entityType && NODE_LABEL_FIELDS[node.entityType] || [];
    for (const row of node.rows) {
      for (const f of fields) {
        const v = row[f];
        if (typeof v === "string" && v.length > 0)
          return v;
      }
    }
    if (typeof node.entityId === "string" && node.entityId.length > 0 && node.entityId !== "null")
      return node.entityId;
    return "(unspecified)";
  }
  // Compute a specific, human-readable card title for the carried unit, using
  // the display-only HumanReadableContext (role/user names) when present.
  //
  // HONESTY CONTRACT, by draft shape:
  //   - canonicalizeNode plaintext (`node=<ACTION>...`): the TRUE action IS in the
  //     signed bytes, so render it ACCURATELY ("Delete app my-client", "Disable
  //     IGA governance on realm"). Unknown action -> honest "Governance change:
  //     <node>", never a grant.
  //   - canonicalizeLinkageSet plaintext (`table=...`): the resulting member SET
  //     is in the bytes but the VERB is NOT (grant vs revoke are byte-identical),
  //     so render NEUTRAL "Role/membership assignment update" + the members.
  //   - CBOR AttestationUnit: structural `unit_type` only, no verb -> neutral
  //     type-specific title (existing behaviour).
  // Returns undefined only when nothing can be decoded, so the caller keeps the
  // neutral "Governance change" fallback. There is NO path that fabricates a grant.
  _buildTitle() {
    const node = this._getNodeCanonical();
    if (node) {
      const titleFn = NODE_ACTION_TITLES[node.node];
      if (titleFn)
        return titleFn(this._nodeLabel(node));
      return `Governance change: ${node.node}`;
    }
    const linkage = this._getLinkageCanonical();
    if (linkage) {
      const owner = linkage.owners[0]?.owner;
      const ownerName = owner ? this._userName(owner) : void 0;
      if (ownerName && ownerName !== owner)
        return `Update the roles for user "${ownerName}"`;
      return "Update the roles for a user";
    }
    const units = this._decodeUnits();
    const first = units[0];
    if (!first || typeof first !== "object")
      return void 0;
    const ut = first["unit_type"];
    const utName = typeof ut === "number" && ATTESTATION_UNIT_TYPE_NAMES[ut] !== void 0 ? ATTESTATION_UNIT_TYPE_NAMES[ut] : ut !== void 0 ? String(ut) : void 0;
    if (utName === "user_role_mapping_set") {
      const payload = first["payload"];
      const userName = this._titleUserName(payload);
      if (userName)
        return `Update the roles for user "${userName}"`;
      return "Update the roles for a user";
    }
    if (utName)
      return `Approve change: ${utName.replace(/_/g, " ")}`;
    return void 0;
  }
  // User name for the title ONLY when the context resolved it to a username.
  _titleUserName(payload) {
    try {
      const userId = payload?.["user_id"];
      if (userId === void 0)
        return void 0;
      const name = this._context?.users?.[String(userId)];
      return typeof name === "string" && name.length > 0 ? name : void 0;
    } catch {
      return void 0;
    }
  }
  // Resolve a role-id UUID to its friendly name via the display-only context,
  // falling back to the raw UUID when no name is available. Never throws.
  _roleName(roleId) {
    const id = String(roleId);
    try {
      const name = this._context?.roles?.[id];
      if (typeof name === "string" && name.length > 0)
        return name;
    } catch {
    }
    return id;
  }
  // Resolve a user-id UUID to its username via the display-only context,
  // falling back to the raw UUID when no name is available. Never throws.
  _userName(userId) {
    const id = String(userId);
    try {
      const name = this._context?.users?.[id];
      if (typeof name === "string" && name.length > 0)
        return name;
    } catch {
    }
    return id;
  }
  // Decode every attestation-unit envelope the draft carries. The draft is
  // AttestationUnitSignRequest framing: a TideMemory whose segment i is the
  // verbatim CBOR of unit i (req.SetUnits(byte[][]) on the producer). Never
  // throws - a malformed/absent unit is simply skipped.
  _decodeUnits() {
    const units = [];
    if (!this._draft)
      return units;
    let res = {};
    for (let i = 0; TryGetValue(this._draft, i, res); i++) {
      const unitBytes = res.result;
      if (!unitBytes || unitBytes.length === 0)
        continue;
      try {
        units.push(decodeCbor(unitBytes));
      } catch {
      }
    }
    return units;
  }
  // Decode the embedded admin Policy from the request's policy segment
  // (seg-9, req.SetPolicy(adminPolicyBytes)). Returns null when absent or
  // undecodable - never throws.
  _decodePolicy() {
    try {
      const policyBytes = this.request?.policy;
      if (!policyBytes || policyBytes.length === 0)
        return null;
      return Policy.from(policyBytes);
    } catch {
      return null;
    }
  }
  // Pull a parameter from the Policy params map, tolerating missing keys.
  _policyParam(policy, key) {
    try {
      if (!policy || !policy.params)
        return void 0;
      const v = policy.params.entries.get(key);
      if (v instanceof Uint8Array)
        return void 0;
      return v;
    } catch {
      return void 0;
    }
  }
  // Find the human-friendly NAME of the realm this CR applies to, if a row
  // carries one. The signed rows usually carry only REALM_ID (a UUID/surrogate),
  // so a friendly realm name is shown only when REALM_NAME (or NAME on a REALM
  // node) is present. Returns undefined when no friendly name is available.
  _realmName(node) {
    for (const row of node.rows) {
      const v = row["REALM_NAME"];
      if (typeof v === "string" && v.length > 0)
        return v;
    }
    if (node.entityType === "REALM") {
      const lbl = this._nodeLabel(node);
      if (lbl && lbl !== "(unspecified)")
        return lbl;
    }
    return void 0;
  }
  // A single secondary "Technical id" value, when one is genuinely useful and not
  // already shown as a friendly name: prefer the entityId, else a noisy *_UUID/ID
  // row field. Returns undefined when there is nothing meaningful to tuck away.
  _technicalId(node, primaryName) {
    if (typeof node.entityId === "string" && node.entityId.length > 0 && node.entityId !== "null" && node.entityId !== primaryName) {
      return node.entityId;
    }
    for (const row of node.rows) {
      for (const k of Object.keys(row)) {
        if (NODE_NOISY_FIELDS.has(k) && k !== "REALM_ID") {
          const v = row[k];
          if (typeof v === "string" && v.length > 0 && v !== primaryName)
            return v;
        }
      }
    }
    return void 0;
  }
  // Details for a canonicalizeNode plaintext draft (DELETE_*/DISABLE_IGA/...):
  // a small set of friendly, labelled fields stating exactly what the admin is
  // approving, plus a prominent plain-language consequence line for destructive
  // actions (reusing the enclave WARNING/severity convention). No raw row= blob,
  // no raw UUID surfaced as a primary field.
  _nodeDetails(node, summary) {
    if (NODE_DESTRUCTIVE_ACTIONS.has(node.node)) {
      summary["WARNING"] = NODE_DESTRUCTIVE_WARNINGS[node.node] ?? "Warning: this is a destructive governance action and may be unrecoverable.";
    }
    summary["You are about to"] = NODE_ACTION_VERBS[node.node] ?? `Apply governance action: ${node.node}`;
    const noun = node.entityType && NODE_ENTITY_NOUNS[node.entityType] || void 0;
    const primaryName = this._nodeLabel(node);
    const hasFriendly = primaryName && primaryName !== "(unspecified)";
    if (noun && hasFriendly) {
      summary[noun] = primaryName;
    } else if (hasFriendly && node.entityType !== "REALM") {
      summary["Name"] = primaryName;
    }
    const realm = this._realmName(node);
    if (realm)
      summary["Realm"] = realm;
    const tech = this._technicalId(node, hasFriendly ? primaryName : void 0);
    if (tech)
      summary["Technical id"] = tech;
  }
  // Details for a canonicalizeLinkageSet plaintext draft (role/group/composite
  // SET actions): the RESULTING member set per owner, names resolved via the
  // display-only context. The verb (grant vs revoke) is NOT in the signed bytes,
  // so we explicitly note that the resulting set is shown, not the operation.
  _linkageDetails(linkage, summary) {
    const single = linkage.owners.length === 1;
    linkage.owners.forEach((o) => {
      const ownerName = this._userName(o.owner);
      const resolved = o.members.map((m) => {
        const r = this._roleName(m);
        return r !== m ? r : this._userName(m);
      });
      if (single)
        summary["For"] = ownerName;
      const label = single ? "Roles after this change" : `Roles after this change for ${ownerName}`;
      summary[label] = resolved.length > 0 ? resolved.join(", ") : "(none)";
    });
    summary["Note"] = "The system records the resulting set of roles. The signed approval does not record whether roles were added or removed.";
  }
  getDetailsMap() {
    const summary = {};
    try {
      const node = this._getNodeCanonical();
      if (node) {
        this._nodeDetails(node, summary);
        this._appendTimingDetails(summary);
        return summary;
      }
      const linkage = this._getLinkageCanonical();
      if (linkage) {
        this._linkageDetails(linkage, summary);
        this._appendTimingDetails(summary);
        return summary;
      }
      const units = this._decodeUnits();
      const policy = this._decodePolicy();
      const first = units[0];
      if (first && typeof first === "object") {
        const ut = first["unit_type"];
        const utName = typeof ut === "number" && ATTESTATION_UNIT_TYPE_NAMES[ut] !== void 0 ? ATTESTATION_UNIT_TYPE_NAMES[ut] : ut !== void 0 ? String(ut) : void 0;
        if (utName !== void 0)
          summary["Attestation Unit"] = utName;
        const payload = first["payload"];
        if (payload && typeof payload === "object") {
          if (payload["user_id"] !== void 0)
            summary["User"] = this._userName(payload["user_id"]);
          const roleIds = payload["role_ids"];
          if (Array.isArray(roleIds) && roleIds.length > 0) {
            summary["Roles after this change"] = roleIds.map((r) => this._roleName(r)).join(", ");
            summary["Note"] = "The system records the resulting set of roles. The signed approval does not record whether roles were added or removed.";
          }
        }
        if (first["target_id"] !== void 0 && summary["User"] === void 0) {
          summary["Technical id"] = String(first["target_id"]);
        }
      }
      if (units.length > 1)
        summary["Units In Request"] = units.length;
      if (policy) {
        const role = this._policyParam(policy, "role");
        if (role !== void 0)
          summary["Governing Policy Role"] = String(role);
        const resource = this._policyParam(policy, "resource");
        if (resource !== void 0)
          summary["Resource"] = String(resource);
        const threshold = this._policyParam(policy, "threshold");
        if (threshold !== void 0)
          summary["Approvals Required"] = threshold;
      }
      this._appendTimingDetails(summary);
    } catch {
    }
    return summary;
  }
  // Append the request expiry / requested-at lines, each individually guarded so
  // a missing/uninitialized field never throws out of the summary builder.
  _appendTimingDetails(summary) {
    try {
      if (this.request && typeof this.request.expiry === "number") {
        summary["Expires"] = new Date(this.request.expiry * 1e3).toUTCString();
      }
    } catch {
    }
    try {
      if (this.request && this.request.isInitialized()) {
        summary["Requested At"] = new Date(this.request.getInitializedTime() * 1e3).toUTCString();
      }
    } catch {
    }
  }
  getRequestDataJson() {
    const data = {};
    try {
      const node = this._getNodeCanonical();
      if (node) {
        data["node"] = { action: node.node, entityType: node.entityType, entityId: node.entityId, rows: node.rows };
        return data;
      }
      const linkage = this._getLinkageCanonical();
      if (linkage) {
        data["linkageSet"] = { table: linkage.table, owners: linkage.owners };
        return data;
      }
      const units = this._decodeUnits();
      data["units"] = units.map((u) => this._jsonSafe(u));
      const policy = this._decodePolicy();
      if (policy) {
        const role = this._policyParam(policy, "role");
        const resource = this._policyParam(policy, "resource");
        const threshold = this._policyParam(policy, "threshold");
        const p = {};
        if (role !== void 0)
          p.role = role;
        if (resource !== void 0)
          p.resource = resource;
        if (threshold !== void 0)
          p.threshold = threshold;
        data["policy"] = p;
      }
    } catch {
    }
    return data;
  }
  // Recursively replace Uint8Array with hex strings so JSON.stringify in the
  // enclave produces a readable view.
  _jsonSafe(v) {
    if (v instanceof Uint8Array)
      return Bytes2Hex(v);
    if (Array.isArray(v))
      return v.map((x) => this._jsonSafe(x));
    if (v && typeof v === "object") {
      const out = {};
      for (const k of Object.keys(v))
        out[k] = this._jsonSafe(v[k]);
      return out;
    }
    return v;
  }
};
var modelBuildersMap = {
  [new OffboardSignRequestBuilder(null, null)._id]: OffboardSignRequestBuilder,
  [new LicenseSignRequestBuilder(null, null)._id]: LicenseSignRequestBuilder,
  [new TestInitSignRequestBuilder(null, null)._id]: TestInitSignRequestBuilder,
  [new PolicySignRequestBuilder(null, null)._id]: PolicySignRequestBuilder,
  [new HederaSignRequestBuilder(null, null)._id]: HederaSignRequestBuilder,
  [new PolicyEnabledEncryptionRequestBuilder(null, null)._id]: PolicyEnabledEncryptionRequestBuilder,
  [new PolicyEnabledDecryptionRequestBuilder(null, null)._id]: PolicyEnabledDecryptionRequestBuilder,
  [new ServerCertSignRequestBuilder(null, null)._id]: ServerCertSignRequestBuilder,
  [new AttestationUnitSignRequestBuilder(null, null)._id]: AttestationUnitSignRequestBuilder
};

// node_modules/@tideorg/js/dist/Models/Infos/OrkInfo.js
var OrkInfo = class _OrkInfo {
  orkID;
  orkPublic;
  orkURL;
  orkPaymentPublic;
  constructor(orkID, orkPublic, orkURL, orkPaymentPublic) {
    this.orkID = orkID;
    this.orkPublic = orkPublic;
    this.orkURL = orkURL;
    this.orkPaymentPublic = orkPaymentPublic;
  }
  toString() {
    return JSON.stringify({
      Id: this.orkID,
      PublicKey: this.orkPublic.toBase64(),
      URL: this.orkURL,
      PaymentPublicKey: this.orkPaymentPublic.toBase64()
    });
  }
  toNativeTypeObject() {
    return {
      Id: this.orkID,
      PublicKey: this.orkPublic.toBase64(),
      URL: this.orkURL,
      PaymentPublicKey: this.orkPaymentPublic.toBase64()
    };
  }
  static fromNativeTypeObject(json) {
    return new _OrkInfo(json.Id, Point.fromBase64(json.PublicKey), json.URL, Point.fromBase64(json.PaymentPublicKey));
  }
  static from(json) {
    const { publickey, paymentpublickey, id, url } = normalizeKeys(json);
    const pub = Point.fromBytes(Hex2Bytes(publickey).slice(3));
    const paymentPub = Point.fromBytes(Hex2Bytes(paymentpublickey).slice(3));
    return new _OrkInfo(id, pub, url, paymentPub);
  }
};
function normalizeKeys(obj) {
  const normalized = {};
  Object.keys(obj).forEach((key) => {
    normalized[key.toLowerCase()] = obj[key];
  });
  return normalized;
}

// node_modules/@tideorg/js/dist/Cryptide/TideMemoryObjects.js
function CreateVRKPackage(gvrk, expiry) {
  const serializedgvrk = gvrk.Serialize().ToBytes();
  const ex = typeof expiry == "bigint" ? expiry : BigInt(expiry);
  if (ex < BigInt(Tools_exports.CurrentTime() + 5))
    throw new TideError({ code: TideJsErrorCodes.MODEL_VALUE_OUT_OF_RANGE, displayMessage: "Expiry must be at least 5 seconds into future", source: "tide-js/Cryptide/TideMemoryObjects.ts:26" });
  const time_b = writeInt64LittleEndian(ex);
  const vrk_pack = CreateTideMemory(serializedgvrk, 4 + 4 + serializedgvrk.length + time_b.length);
  WriteValue(vrk_pack, 1, time_b);
  return vrk_pack;
}

// node_modules/@tideorg/js/dist/Cryptide/Serialization.js
function writeInt64LittleEndian(value) {
  const INT64_MIN = -9223372036854775808n;
  const INT64_MAX = 9223372036854775807n;
  if (value < INT64_MIN || value > INT64_MAX) {
    throw new TideError({ code: TideJsErrorCodes.SERIAL_LENGTH_OUT_OF_RANGE, displayMessage: "Value is out of range for a 64-bit signed integer.", source: "tide-js/Cryptide/Serialization.ts:32" });
  }
  const bytes = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    bytes[i] = Number(value >> BigInt(8 * i) & 0xffn);
  }
  return bytes;
}
function readInt64LittleEndian(bytes) {
  if (bytes.length !== 8) {
    throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_LENGTH, displayMessage: `Invalid byte array length. Expected 8 bytes, got ${bytes.length}.`, source: "tide-js/Cryptide/Serialization.ts:44" });
  }
  let value = 0n;
  for (let i = 0; i < 8; i++) {
    value |= BigInt(bytes[i]) << BigInt(8 * i);
  }
  value = BigInt.asIntN(64, value);
  return value;
}
var AuthorizerPack = class {
  AuthFlow;
  Authorizer;
  SignModels;
  constructor(data) {
    const d = data;
    const isUint8Like = d && (d instanceof Uint8Array || ArrayBuffer.isView(d) && d.constructor?.name === "Uint8Array" || typeof d === "object" && typeof d.length === "number" && d.buffer instanceof ArrayBuffer);
    if (!isUint8Like)
      throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_TYPE, displayMessage: "Data must be byte array", source: "tide-js/Cryptide/Serialization.ts:67" });
    this.AuthFlow = StringFromUint8Array(GetValue(data, 0));
    this.Authorizer = new GVRK_Pack(GetValue(data, 1));
    var c = true;
    var i = 2;
    this.SignModels = [];
    while (c) {
      try {
        this.SignModels.push(StringFromUint8Array(GetValue(data, i)));
        i++;
      } catch {
        c = false;
      }
    }
  }
};
var GVRK_Pack = class {
  GVRK;
  Expiry;
  constructor(data) {
    this.GVRK = Ed25519PublicComponent.DeserializeComponent(GetValue(data, 0));
    this.Expiry = readInt64LittleEndian(GetValue(data, 1));
  }
  encode() {
    return CreateVRKPackage(this.GVRK, this.Expiry);
  }
};
function CreateTideMemory(initialValue, totalLength, version = 1) {
  if (totalLength < initialValue.length + 4) {
    throw new TideError({
      code: TideJsErrorCodes.PARSE_BUFFER_OVERFLOW,
      displayMessage: `Not enough space to allocate requested data. Make sure to request more space in totalLength than length of InitialValue plus 4 bytes for length. (totalLength=${totalLength}, initialValue.length=${initialValue.length}, required>=${initialValue.length + 4})`,
      source: "Cryptide/Serialization.ts:CreateTideMemory"
    });
  }
  const bufferLength = 4 + totalLength;
  const buffer = new Uint8Array(bufferLength);
  const dataView = new DataView(buffer.buffer);
  dataView.setInt32(0, version, true);
  let dataLocationIndex = 4;
  dataView.setInt32(dataLocationIndex, initialValue.length, true);
  dataLocationIndex += 4;
  buffer.set(initialValue, dataLocationIndex);
  return buffer;
}
function CreateTideMemoryFromArray(datas) {
  if (datas.length == 0)
    return new Uint8Array();
  const length = datas.reduce((sum, next) => sum + 4 + next.length, 0);
  const mem = CreateTideMemory(datas[0], length);
  for (let i = 1; i < datas.length; i++) {
    WriteValue(mem, i, datas[i]);
  }
  return mem;
}
function WriteValue(memory, index, value) {
  if (index < 0)
    throw new TideError({ code: TideJsErrorCodes.MEM_NEGATIVE_INDEX, displayMessage: "Index cannot be less than 0", source: "tide-js/Cryptide/Serialization.ts:129" });
  if (index === 0)
    throw new TideError({ code: TideJsErrorCodes.MEM_INDEX_ZERO_RESERVED, displayMessage: "Use CreateTideMemory to set value at index 0", source: "tide-js/Cryptide/Serialization.ts:130" });
  if (memory.length < 4 + value.length)
    throw new TideError({ code: TideJsErrorCodes.MEM_BUFFER_OVERFLOW, displayMessage: `Could not write to memory. Memory too small for this value (memory.length=${memory.length}, required>=${4 + value.length})`, source: "tide-js/Cryptide/Serialization.ts:131" });
  const dataView = new DataView(memory.buffer);
  let dataLocationIndex = 4;
  for (let i = 0; i < index; i++) {
    if (dataLocationIndex + 4 > memory.length) {
      throw new TideError({
        code: TideJsErrorCodes.PARSE_INDEX_OUT_OF_RANGE,
        displayMessage: `Index out of range: while seeking to segment ${index} at sub-index ${i}, offset ${dataLocationIndex}+4 exceeds memory length ${memory.length}`,
        source: "Cryptide/Serialization.ts:WriteValue"
      });
    }
    const nextDataLength = dataView.getInt32(dataLocationIndex, true);
    dataLocationIndex += 4;
    dataLocationIndex += nextDataLength;
  }
  if (dataLocationIndex + 4 + value.length > memory.length) {
    throw new TideError({
      code: TideJsErrorCodes.PARSE_BUFFER_OVERFLOW,
      displayMessage: `Not enough space to write value: offset ${dataLocationIndex}+4+${value.length} exceeds memory length ${memory.length}`,
      source: "Cryptide/Serialization.ts:WriteValue"
    });
  }
  const existingLength = dataView.getInt32(dataLocationIndex, true);
  if (existingLength !== 0) {
    throw new TideError({ code: TideJsErrorCodes.MEM_INDEX_ALREADY_WRITTEN, displayMessage: `Data has already been written to this index (index=${index}, offset=${dataLocationIndex}, existingLength=${existingLength})`, source: "tide-js/Cryptide/Serialization.ts:165" });
  }
  dataView.setInt32(dataLocationIndex, value.length, true);
  dataLocationIndex += 4;
  memory.set(value, dataLocationIndex);
}
function GetValue(a, index) {
  if (!(a instanceof Uint8Array)) {
    console.error("[GetValue] Invalid input type:", typeof a, "value:", a);
    throw new TypeError("Input must be a Uint8Array.");
  }
  const buffer = a;
  if (buffer.length < 4) {
    throw new TideError({
      code: TideJsErrorCodes.PARSE_INSUFFICIENT_DATA,
      displayMessage: `Insufficient data to read: buffer length is ${buffer.length}, need at least 4 bytes for header`,
      source: "Cryptide/Serialization.ts:GetValue"
    });
  }
  const dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  let dataLocationIndex = 4;
  for (let i = 0; i < index; i++) {
    if (dataLocationIndex + 4 > buffer.length) {
      throw new TideError({
        code: TideJsErrorCodes.PARSE_INDEX_OUT_OF_RANGE,
        displayMessage: `Index out of range: requested segment ${index}, ran out at sub-index ${i}, offset ${dataLocationIndex}+4 exceeds buffer length ${buffer.length}`,
        source: "Cryptide/Serialization.ts:GetValue"
      });
    }
    const nextDataLength = dataView.getInt32(dataLocationIndex, true);
    dataLocationIndex += 4 + nextDataLength;
  }
  if (dataLocationIndex + 4 > buffer.length) {
    throw new TideError({
      code: TideJsErrorCodes.PARSE_INDEX_OUT_OF_RANGE,
      displayMessage: `Index out of range: requested segment ${index}, offset ${dataLocationIndex}+4 (length header) exceeds buffer length ${buffer.length}`,
      source: "Cryptide/Serialization.ts:GetValue"
    });
  }
  const finalDataLength = dataView.getInt32(dataLocationIndex, true);
  dataLocationIndex += 4;
  if (dataLocationIndex + finalDataLength > buffer.length) {
    throw new TideError({
      code: TideJsErrorCodes.PARSE_INDEX_OUT_OF_RANGE,
      displayMessage: `Index out of range: requested segment ${index}, payload offset ${dataLocationIndex}+${finalDataLength} exceeds buffer length ${buffer.length}`,
      source: "Cryptide/Serialization.ts:GetValue"
    });
  }
  return buffer.subarray(dataLocationIndex, dataLocationIndex + finalDataLength);
}
function TryGetValue(a, index, returnObj) {
  try {
    returnObj["result"] = GetValue(a, index);
    return true;
  } catch {
    returnObj["result"] = null;
    return false;
  }
}
function DeserializeNetworkKey(data) {
  return Point.fromBytes(Hex2Bytes(data.toLowerCase()));
}
async function EdPointToJWK(p) {
  return JSON.stringify({
    "kty": "OKP",
    "kid": Bytes2Hex(await SHA256_Digest(p.toRawBytes())),
    "alg": "EdDSA",
    "crv": "Ed25519",
    "x": base64ToBase64Url(p.toBase64())
  });
}
function DeserializeTIDE_KEY(key, prefix) {
  const header = key.substring(0, 8);
  const data = base64ToBytes(key.substring(8, key.length));
  if (header != "tide" + prefix + "key")
    throw new TideError({ code: TideJsErrorCodes.SERIAL_UNEXPECTED_HEADER, displayMessage: `Unexpected header in deserialization (expected "tide${prefix}key")`, source: "tide-js/Cryptide/Serialization.ts:264" });
  if (data.length != 32)
    throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_LENGTH, displayMessage: `Unexpected key length in deserialization (expected 32 bytes, got ${data.length})`, source: "tide-js/Cryptide/Serialization.ts:265" });
  return BigIntFromByteArray(data);
}
async function GetUID(str) {
  return Bytes2Hex(await SHA256_Digest(str.toLowerCase()));
}
function BigIntToByteArray(num) {
  return etc.bigIntToBytes(num);
}
function BigIntFromByteArray(bytes) {
  return etc.bytesToBigInt(bytes);
}
function ConcatUint8Arrays(arrays) {
  const totalLength = arrays.reduce((sum, next) => next.length + sum, 0);
  var newArray = new Uint8Array(totalLength);
  var offset = 0;
  arrays.forEach((item) => {
    newArray.set(item, offset);
    offset += item.length;
  });
  return newArray;
}
function XOR(array1, array2) {
  if (array1.length !== array2.length) {
    throw new TideError({ code: TideJsErrorCodes.SERIAL_LENGTH_MISMATCH, displayMessage: `Arrays have different lengths, cannot XOR them. (array1.length=${array1.length}, array2.length=${array2.length})`, source: "tide-js/Cryptide/Serialization.ts:294" });
  }
  let result = new Uint8Array(array1.length);
  for (let i = 0; i < array1.length; i++) {
    result[i] = array1[i] ^ array2[i];
  }
  return result;
}
function PadRight(array, length, padding = 0) {
  while (array.length < length) {
    array.push(padding);
  }
  return array;
}
function StringToUint8Array(string) {
  const enc2 = new TextEncoder();
  return enc2.encode(string);
}
function StringFromUint8Array(bytes) {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(bytes);
}
var Byte = class _Byte {
  bits = [];
  constructor() {
    this.bits = [];
  }
  /**
   * Sets a bit at the start of the array (index 0)
   */
  setFirstBit(bit) {
    const b = bit === 0 ? 0 : 1;
    this.bits[0] = b;
  }
  toUint8Array() {
    let number = 0;
    for (let i = 0; i < 8; i++) {
      number += this.bits[i] * Math.pow(2, 7 - i);
    }
    const byteArray = new Uint8Array(1);
    byteArray[0] = number & 255;
    return byteArray;
  }
  static fromUint8Array(uint8Array) {
    let bitArray = new _Byte();
    for (let i = 7; i >= 0; i--) {
      bitArray.bits.push(uint8Array[0] >> i & 1);
    }
    return bitArray;
  }
  /**
   * Maximum number of 255
   */
  static fromNumber(number) {
    if (number < 0 || number > 255) {
      throw new TideError({ code: TideJsErrorCodes.SERIAL_LENGTH_OUT_OF_RANGE, displayMessage: `Number must be between 0 and 255 (got ${number})`, source: "tide-js/Cryptide/Serialization.ts:358" });
    }
    let byte = new _Byte();
    let binaryString = number.toString(2).padStart(8, "0");
    for (let i = 0; i < 8; i++) {
      byte.bits.push(binaryString[i] === "1" ? 1 : 0);
    }
    return byte;
  }
};
function getBytesFromInt16(schemeInt) {
  const buffer = new ArrayBuffer(2);
  const view = new DataView(buffer);
  view.setInt16(0, schemeInt, true);
  return new Uint8Array(buffer);
}
function numberToUint8Array(num, len = -1) {
  if (num < 0 || !Number.isInteger(num)) {
    throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_TYPE, displayMessage: `Number must be a non-negative integer. (got ${num})`, source: "tide-js/Cryptide/Serialization.ts:379" });
  }
  if (num === 0)
    return new Uint8Array([0]);
  let numberOfBytes = Math.ceil(Math.log2(num + 1) / 8);
  let byteArray = new Uint8Array(numberOfBytes);
  for (let i = 0; i < numberOfBytes; i++) {
    byteArray[i] = num >> 8 * i & 255;
  }
  if (len == -1)
    return byteArray;
  else {
    const offset = len - byteArray.length;
    if (offset == 0)
      return byteArray;
    const padding = new Uint8Array(offset).fill(0);
    return ConcatUint8Arrays([byteArray, padding]);
  }
}
function Uint8ArrayToNumber(byteArray) {
  if (!(byteArray instanceof Uint8Array)) {
    throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_TYPE, displayMessage: `Input must be a Uint8Array. (got ${typeof byteArray})`, source: "tide-js/Cryptide/Serialization.ts:400" });
  }
  let num = 0;
  for (let i = byteArray.length - 1; i >= 0; i--) {
    num = num << 8 | byteArray[i];
  }
  return num;
}
function base64ToBase64Url(base64) {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64UrlToBase64(base64Url) {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return base64;
}
function bitArrayToUint8Array(array) {
  const byteArray = new Uint8Array(Math.ceil(array.length / 8));
  let bitCount = 0;
  for (let i = 0; i < byteArray.length; i++) {
    const currentByteLength = array.length - bitCount >= 8 ? 8 : array.length - bitCount;
    for (let j = 0; j < currentByteLength; j++) {
      byteArray[i] |= array[bitCount] << currentByteLength - 1 - j;
      bitCount++;
    }
  }
  return byteArray;
}
function serializeBitArray(bitArray_p) {
  let bitArray = bitArray_p.slice();
  while (bitArray.length % 8 !== 0) {
    bitArray.push(0);
  }
  const byteArray = new Uint8Array(bitArray.length / 8);
  for (let byteIndex = 0; byteIndex < byteArray.length; byteIndex++) {
    let byteValue = 0;
    for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
      byteValue |= bitArray[byteIndex * 8 + bitPosition] << bitPosition;
    }
    byteArray[byteIndex] = byteValue;
  }
  return byteArray;
}
function bitArrayAND(bitarray1, bitarray2) {
  return bitarray1.map((b, i) => b == 1 && bitarray2[i] == 1 ? 1 : 0);
}
function deserializeBitArray(byteArray) {
  const bitArray = [];
  byteArray.forEach((byte) => {
    for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
      bitArray.push(byte >> bitPosition & 1);
    }
  });
  while (bitArray.length > 0 && bitArray[bitArray.length - 1] === 0) {
    bitArray.pop();
  }
  return bitArray;
}
function uint8ArrayToBitArray(byteArray) {
  const bitArray = [];
  let count = 0;
  for (let i = 0; i < byteArray.length; i++) {
    for (let j = 7; j >= 0; j--) {
      const bit = byteArray[i] >> j & 1;
      if (count < 16 || count > 19)
        bitArray.push(bit);
      count++;
    }
  }
  return bitArray;
}
function Hex2Bytes(string) {
  const hexRegex = /^0x[0-9A-Fa-f]+$|^[0-9A-Fa-f]+$/;
  if (!hexRegex.test(string))
    throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_HEX, displayMessage: "Invalid Hex", source: "tide-js/Cryptide/Serialization.ts:498" });
  const normal = string.length % 2 ? "0" + string : string;
  const bytes = new Uint8Array(normal.length / 2);
  for (let index = 0; index < bytes.length; ++index) {
    const c1 = normal.charCodeAt(index * 2);
    const c2 = normal.charCodeAt(index * 2 + 1);
    const n1 = c1 - (c1 < 58 ? 48 : c1 < 97 ? 55 : 87);
    const n2 = c2 - (c2 < 58 ? 48 : c2 < 97 ? 55 : 87);
    bytes[index] = n1 * 16 + n2;
  }
  return bytes;
}
function Bytes2Hex(byteArray) {
  const chars = new Uint8Array(byteArray.length * 2);
  const alpha = "a".charCodeAt(0) - 10;
  const digit = "0".charCodeAt(0);
  let p = 0;
  for (let i = 0; i < byteArray.length; i++) {
    let nibble = byteArray[i] >>> 4;
    chars[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
    nibble = byteArray[i] & 15;
    chars[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
  }
  return String.fromCharCode.apply(null, Array.from(chars));
}
var base64abc = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  "/"
];
var base64codes = [
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  255,
  62,
  255,
  255,
  255,
  63,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  255,
  255,
  255,
  0,
  255,
  255,
  255,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  255,
  255,
  255,
  255,
  255,
  255,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51
];
function getBase64Code(charCode) {
  if (charCode >= base64codes.length) {
    throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_BASE64, displayMessage: `Unable to parse base64 string. (charCode ${charCode} >= base64codes.length ${base64codes.length})`, source: "tide-js/Cryptide/Serialization.ts:555" });
  }
  const code = base64codes[charCode];
  if (code === 255) {
    throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_BASE64, displayMessage: `Unable to parse base64 string. (charCode ${charCode} is not a valid base64 character)`, source: "tide-js/Cryptide/Serialization.ts:559" });
  }
  return code;
}
function bytesToBase64(bytes) {
  let result = "", i, l = bytes.length;
  for (i = 2; i < l; i += 3) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
    result += base64abc[(bytes[i - 1] & 15) << 2 | bytes[i] >> 6];
    result += base64abc[bytes[i] & 63];
  }
  if (i === l + 1) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 3) << 4];
    result += "==";
  }
  if (i === l) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
    result += base64abc[(bytes[i - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
function base64ToBytes(str) {
  const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  if (!base64Regex.test(str))
    throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_BASE64, displayMessage: "Not valid base64", source: "tide-js/Cryptide/Serialization.ts:588" });
  if (str.length % 4 !== 0) {
    throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_BASE64, displayMessage: `Unable to parse base64 string. (length ${str.length} is not a multiple of 4)`, source: "tide-js/Cryptide/Serialization.ts:590" });
  }
  const index = str.indexOf("=");
  if (index !== -1 && index < str.length - 2) {
    throw new TideError({ code: TideJsErrorCodes.SERIAL_INVALID_BASE64, displayMessage: `Unable to parse base64 string. (padding '=' at offset ${index} is not within the last 2 characters)`, source: "tide-js/Cryptide/Serialization.ts:594" });
  }
  let missingOctets = str.endsWith("==") ? 2 : str.endsWith("=") ? 1 : 0, n = str.length, result = new Uint8Array(3 * (n / 4)), buffer;
  for (let i = 0, j = 0; i < n; i += 4, j += 3) {
    buffer = getBase64Code(str.charCodeAt(i)) << 18 | getBase64Code(str.charCodeAt(i + 1)) << 12 | getBase64Code(str.charCodeAt(i + 2)) << 6 | getBase64Code(str.charCodeAt(i + 3));
    result[j] = buffer >> 16;
    result[j + 1] = buffer >> 8 & 255;
    result[j + 2] = buffer & 255;
  }
  return result.subarray(0, result.length - missingOctets);
}

// node_modules/@tideorg/js/dist/Cryptide/Ed25519.js
var P = 2n ** 255n - 19n;
var N = 2n ** 252n + 27742317777372353535851937790883648493n;
var Gx = 0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an;
var Gy = 0x6666666666666666666666666666666666666666666666666666666666666658n;
var _d = 37095705934669439343138083508754565189542113879843219016388785533085940283555n;
var MASK = 2n ** 256n;
var CURVE = {
  a: -1n,
  // -1 mod p
  d: _d,
  // -(121665/121666) mod p
  p: P,
  n: N,
  h: 8,
  Gx,
  Gy
  // field prime, curve (group) order, cofactor
};
var err = (m = "") => {
  throw new TideError({ code: TideJsErrorCodes.CRYPTO_ED25519_BAD_POINT, displayMessage: m || "ed25519: bad input", source: "tide-js/Cryptide/Ed25519.ts:err" });
};
var isS = (s) => typeof s === "string";
var isB = (s) => typeof s === "bigint";
var isu8 = (a) => a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
var au8 = (a, l) => (
  // is Uint8Array (of specific length)
  !isu8(a) || typeof l === "number" && l > 0 && a.length !== l ? err("Uint8Array of valid length expected") : a
);
var u8n = (len) => new Uint8Array(len);
var u8fr = (buf) => Uint8Array.from(buf);
var toU8 = (a, len) => au8(isS(a) ? h2b(a) : u8fr(au8(a, void 0)), len);
var M = (a, b = P) => {
  let r = a % b;
  return r >= 0n ? r : b + r;
};
var arange = (n, min, max = MASK, msg = "bad number: out of range") => isB(n) && min <= n && n < max ? n : err(msg);
var apoint = (p) => p instanceof Point ? p : err("Point expected");
var Point = class _Point {
  ex;
  ey;
  ez;
  et;
  static BASE;
  static ZERO;
  constructor(ex, ey, ez = 1n, et = 0n) {
    this.ex = arange(ex, 0n);
    this.ey = arange(ey, 0n);
    this.ez = arange(ez, 1n);
    this.et = arange(et, 0n);
    Object.freeze(this);
  }
  static fromAffine(p) {
    return new _Point(p.x, p.y, 1n, M(p.x * p.y));
  }
  /** RFC8032 5.1.3: hex / Uint8Array to Point. */
  static fromHex(hex, zip215) {
    hex = toU8(hex, 32);
    return this.fromBytes(hex, zip215);
  }
  static fromBase64(b64string) {
    if (isS(b64string))
      return this.fromBytes(base64ToBytes(b64string));
    else
      err("Point.fromBase64 not provided with a string");
  }
  static fromBytes(bytes, zip215 = false) {
    const { d } = CURVE;
    const normed = bytes.slice();
    const lastByte = bytes[31];
    normed[31] = lastByte & ~128;
    const y = b2n_LE(normed);
    const max = zip215 ? MASK : P;
    arange(y, 0n, max);
    const y2 = M(y * y);
    const u = M(y2 - 1n);
    const v = M(d * y2 + 1n);
    let { isValid, value: x } = uvRatio(u, v);
    if (!isValid)
      err("bad y coord 3");
    const isXOdd = (x & 1n) === 1n;
    const isLastByteOdd = (lastByte & 128) !== 0;
    if (!zip215 && x === 0n && isLastByteOdd)
      err("bad y coord 4");
    if (isLastByteOdd !== isXOdd)
      x = M(-x);
    return new _Point(x, y, 1n, M(x * y));
  }
  get x() {
    return this.toAffine().x;
  }
  // .x, .y will call expensive toAffine.
  get y() {
    return this.toAffine().y;
  }
  // Should be used with care.
  assertValidity() {
    const { a, d } = CURVE;
    const p = this;
    if (p.is0())
      throw new TideError({ code: TideJsErrorCodes.CRYPTO_ED25519_BAD_POINT, displayMessage: "bad point: ZERO", source: "tide-js/Cryptide/Ed25519.ts:133" });
    const { ex: X, ey: Y, ez: Z, et: T } = p;
    const X2 = M(X * X);
    const Y2 = M(Y * Y);
    const Z2 = M(Z * Z);
    const Z4 = M(Z2 * Z2);
    const aX2 = M(X2 * a);
    const left = M(Z2 * M(aX2 + Y2));
    const right = M(Z4 + M(d * M(X2 * Y2)));
    if (left !== right)
      throw new TideError({ code: TideJsErrorCodes.CRYPTO_ED25519_BAD_POINT, displayMessage: "bad point: equation left != right (1)", source: "tide-js/Cryptide/Ed25519.ts:145" });
    const XY = M(X * Y);
    const ZT = M(Z * T);
    if (XY !== ZT)
      throw new TideError({ code: TideJsErrorCodes.CRYPTO_ED25519_BAD_POINT, displayMessage: "bad point: equation left != right (2)", source: "tide-js/Cryptide/Ed25519.ts:150" });
    return true;
  }
  equals(other) {
    const { ex: X1, ey: Y1, ez: Z1 } = this;
    const { ex: X2, ey: Y2, ez: Z2 } = apoint(other);
    const X1Z2 = M(X1 * Z2), X2Z1 = M(X2 * Z1);
    const Y1Z2 = M(Y1 * Z2), Y2Z1 = M(Y2 * Z1);
    return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
  }
  is0() {
    return this.equals(I);
  }
  negate() {
    return new _Point(M(-this.ex), this.ey, this.ez, M(-this.et));
  }
  /** Point doubling. Complete formula. */
  double() {
    const { ex: X1, ey: Y1, ez: Z1 } = this;
    const { a } = CURVE;
    const A = M(X1 * X1);
    const B = M(Y1 * Y1);
    const C2 = M(2n * M(Z1 * Z1));
    const D = M(a * A);
    const x1y1 = X1 + Y1;
    const E = M(M(x1y1 * x1y1) - A - B);
    const G2 = D + B;
    const F = G2 - C2;
    const H = D - B;
    const X3 = M(E * F);
    const Y3 = M(G2 * H);
    const T3 = M(E * H);
    const Z3 = M(F * G2);
    return new _Point(X3, Y3, Z3, T3);
  }
  /** Point addition. Complete formula. */
  add(other) {
    const { ex: X1, ey: Y1, ez: Z1, et: T1 } = this;
    const { ex: X2, ey: Y2, ez: Z2, et: T2 } = apoint(other);
    const { a, d } = CURVE;
    const A = M(X1 * X2);
    const B = M(Y1 * Y2);
    const C2 = M(T1 * d * T2);
    const D = M(Z1 * Z2);
    const E = M((X1 + Y1) * (X2 + Y2) - A - B);
    const F = M(D - C2);
    const G2 = M(D + C2);
    const H = M(B - a * A);
    const X3 = M(E * F);
    const Y3 = M(G2 * H);
    const T3 = M(E * H);
    const Z3 = M(F * G2);
    return new _Point(X3, Y3, Z3, T3);
  }
  mul(n, safe = true) {
    if (n === 0n)
      return safe === true ? err("cannot multiply by 0") : I;
    arange(n, 1n, N);
    if (n === 1n || !safe && this.is0())
      return this;
    if (this.equals(G))
      return wNAF(n).p;
    let p = I, f = G;
    for (let d = this; n > 0n; d = d.double(), n >>= 1n) {
      if (n & 1n)
        p = p.add(d);
      else if (safe)
        f = f.add(d);
    }
    return p;
  }
  multiply(scalar) {
    return this.mul(scalar);
  }
  // Aliases for compatibilty
  divide(scalar) {
    return this.mul(invert(scalar, CURVE.n));
  }
  clearCofactor() {
    return this.mul(BigInt(CURVE.h), false);
  }
  // multiply by cofactor
  isSmallOrder() {
    return this.clearCofactor().is0();
  }
  // check if P is small order
  isTorsionFree() {
    let p = this.mul(N / 2n, false).double();
    if (N % 2n)
      p = p.add(this);
    return p.is0();
  }
  /** converts point to 2d xy affine point. (x, y, z, t) ∋ (x=x/z, y=y/z, t=xy). */
  toAffine() {
    const { ex: x, ey: y, ez: z } = this;
    if (this.equals(I))
      return { x: 0n, y: 1n };
    const iz = invert(z, P);
    if (M(z * iz) !== 1n)
      err("invalid inverse");
    return { x: M(x * iz), y: M(y * iz) };
  }
  toRawBytes() {
    const { x, y } = this.toAffine();
    this.assertValidity();
    const b = n2b_32LE(y);
    b[31] |= x & 1n ? 128 : 0;
    return b;
  }
  toHex() {
    return b2h(this.toRawBytes());
  }
  // encode to hex string
  toBase64() {
    return bytesToBase64(this.toRawBytes());
  }
  async hash() {
    return M(b2n_LE(await SHA256_Digest(this.toRawBytes())), CURVE.n);
  }
};
Point.BASE = new Point(Gx, Gy, 1n, M(Gx * Gy));
Point.ZERO = new Point(0n, 1n, 1n, 0n);
var { BASE: G, ZERO: I } = Point;
var padh = (num, pad) => num.toString(16).padStart(pad, "0");
var b2h = (b) => Array.from(au8(b, void 0)).map((e) => padh(e, 2)).join("");
var C = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
var _ch = (ch) => {
  if (ch >= C._0 && ch <= C._9)
    return ch - C._0;
  if (ch >= C.A && ch <= C.F)
    return ch - (C.A - 10);
  if (ch >= C.a && ch <= C.f)
    return ch - (C.a - 10);
  return;
};
var h2b = (hex) => {
  const e = "hex invalid";
  if (!isS(hex))
    return err(e);
  const hl = hex.length, al = hl / 2;
  if (hl % 2)
    return err(e);
  const array = u8n(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = _ch(hex.charCodeAt(hi));
    const n2 = _ch(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0)
      return err(e);
    array[ai] = n1 * 16 + n2;
  }
  return array;
};
var n2b_32LE = (num) => h2b(padh(num, 32 * 2)).reverse();
var b2n_LE = (b) => BigInt("0x" + b2h(u8fr(au8(b, void 0)).reverse()));
var concatB = (...arrs) => {
  const r = u8n(arrs.reduce((sum, a) => sum + au8(a, void 0).length, 0));
  let pad = 0;
  arrs.forEach((a) => {
    r.set(a, pad);
    pad += a.length;
  });
  return r;
};
var invert = (num, md) => {
  if (!isB(num))
    throw new TideError({ code: TideJsErrorCodes.CRYPTO_INVALID_BIGINT_INPUT, displayMessage: `invert: expected bigint (got ${typeof num})`, source: "tide-js/Cryptide/Ed25519.ts:295" });
  if (num === 0n || md <= 0n)
    err(`no inverse (num is ${num === 0n ? "zero" : "non-zero"}, mod is ${md <= 0n ? "non-positive" : "positive"})`);
  let a = M(num, md), b = md, x = 0n, y = 1n, u = 1n, v = 0n;
  while (a !== 0n) {
    const q = b / a, r = b % a;
    const m = x - u * q, n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  return b === 1n ? M(x, md) : err("no inverse");
};
var pow2 = (x, power) => {
  let r = x;
  while (power-- > 0n) {
    r *= r;
    r %= P;
  }
  return r;
};
var pow_2_252_3 = (x) => {
  const x2 = M(x * x);
  const b2 = M(x2 * x);
  const b4 = M(pow2(b2, 2n) * b2);
  const b5 = M(pow2(b4, 1n) * x);
  const b10 = M(pow2(b5, 5n) * b5);
  const b20 = M(pow2(b10, 10n) * b10);
  const b40 = M(pow2(b20, 20n) * b20);
  const b80 = M(pow2(b40, 40n) * b40);
  const b160 = M(pow2(b80, 80n) * b80);
  const b240 = M(pow2(b160, 80n) * b80);
  const b250 = M(pow2(b240, 10n) * b10);
  const pow_p_5_8 = M(pow2(b250, 2n) * x);
  return { pow_p_5_8, b2 };
};
var RM1 = 19681161376707505956807079304988542015446066515923890162744021073123829784752n;
var uvRatio = (u, v) => {
  const v3 = M(v * v * v);
  const v7 = M(v3 * v3 * v);
  const pow = pow_2_252_3(u * v7).pow_p_5_8;
  let x = M(u * v3 * pow);
  const vx2 = M(v * x * x);
  const root1 = x;
  const root2 = M(x * RM1);
  const useRoot1 = vx2 === u;
  const useRoot2 = vx2 === M(-u);
  const noRoot = vx2 === M(BigInt(-1) * u * RM1);
  if (useRoot1)
    x = root1;
  if (useRoot2 || noRoot)
    x = root2;
  if ((M(x) & 1n) === 1n)
    x = M(-x);
  return { isValid: useRoot1 || useRoot2, value: x };
};
var modL_LE = (hash) => M(b2n_LE(hash), N);
var sha512a = (...m) => etc.sha512Async(...m);
var sha512s = (...m) => {
  const fn = etc.sha512Sync;
  if (typeof fn !== "function")
    err("etc.sha512Sync not set");
  return fn(...m);
};
var getExtendedNonDeterministicPublicKeyAsync = (priv) => {
  const prefix = etc.randomBytes(32);
  const point = G.mul(priv);
  const pointBytes = point.toRawBytes();
  return { head: void 0, prefix, scalar: priv, point, pointBytes };
};
function hashFinish(asynchronous, res) {
  if (asynchronous)
    return sha512a(res.hashable).then(res.finish);
  return res.finish(sha512s(res.hashable));
}
var _sign = (e, rBytes, msg) => {
  const { pointBytes: P2, scalar: s } = e;
  const r = modL_LE(rBytes);
  const R = G.mul(r).toRawBytes();
  const hashable = concatB(R, P2, msg);
  const finish = (hashed) => {
    const S = M(r + modL_LE(hashed) * s, N);
    return au8(concatB(R, n2b_32LE(S)), 64);
  };
  return { hashable, finish };
};
var signNonDeterministicAsync = async (msg, privKey) => {
  const m = toU8(msg);
  const e = await getExtendedNonDeterministicPublicKeyAsync(privKey);
  const rBytes = await sha512a(e.prefix, m);
  return hashFinish(true, _sign(e, rBytes, m));
};
var dvo = { zip215: false };
var _verify = (sig, msg, pub, opts = dvo) => {
  sig = toU8(sig, 64);
  msg = toU8(msg);
  pub = toU8(pub, 32);
  const { zip215 } = opts;
  let A, R, s, SB, hashable = new Uint8Array();
  try {
    A = Point.fromHex(pub, zip215);
    R = Point.fromHex(sig.slice(0, 32), zip215);
    s = b2n_LE(sig.slice(32, 64));
    SB = G.mul(s, false);
    hashable = concatB(R.toRawBytes(), A.toRawBytes(), msg);
  } catch (error) {
  }
  const finish = (hashed) => {
    if (SB == null)
      return false;
    if (!zip215 && A.isSmallOrder())
      return false;
    const k = modL_LE(hashed);
    const RkA = R.add(A.mul(k, false));
    return RkA.add(SB.negate()).clearCofactor().is0();
  };
  return { hashable, finish };
};
var verifyAsync = async (s, m, p, opts = dvo) => hashFinish(true, _verify(s, m, p, opts));
var cr = () => (
  // We support: 1) browsers 2) node.js 19+
  typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0
);
var subtle = () => {
  const c = cr();
  return c && c.subtle || err("crypto.subtle must be defined");
};
var etc = {
  bytesToHex: b2h,
  hexToBytes: h2b,
  concatBytes: concatB,
  mod: M,
  invert,
  randomBytes: (len = 32) => {
    const c = cr();
    if (!c || !c.getRandomValues)
      err("crypto.getRandomValues must be defined");
    return c.getRandomValues(u8n(len));
  },
  sha512Async: async (...messages) => {
    const s = subtle();
    const m = concatB(...messages);
    return u8n(await s.digest("SHA-512", m.buffer));
  },
  sha512Sync: void 0,
  // Actual logic below
  bigIntToBytes: n2b_32LE,
  bytesToBigInt: b2n_LE
};
var W = 8;
var scalarBits = 256;
var pwindows = Math.ceil(scalarBits / W) + 1;
var pwindowSize = 2 ** (W - 1);
var precompute = () => {
  const points = [];
  let p = G, b = p;
  for (let w = 0; w < pwindows; w++) {
    b = p;
    points.push(b);
    for (let i = 1; i < pwindowSize; i++) {
      b = b.add(p);
      points.push(b);
    }
    p = b.double();
  }
  return points;
};
var Gpows = void 0;
var wNAF = (n) => {
  const comp = Gpows || (Gpows = precompute());
  const ctneg = (cnd, p2) => {
    let n2 = p2.negate();
    return cnd ? n2 : p2;
  };
  let p = I, f = G;
  const pow_2_w = 2 ** W;
  const maxNum = pow_2_w;
  const mask = BigInt(pow_2_w - 1);
  const shiftBy = BigInt(W);
  for (let w = 0; w < pwindows; w++) {
    let wbits = Number(n & mask);
    n >>= shiftBy;
    if (wbits > pwindowSize) {
      wbits -= maxNum;
      n += 1n;
    }
    const off = w * pwindowSize;
    const offF = off, offP = off + Math.abs(wbits) - 1;
    const isEven = w % 2 !== 0, isNeg = wbits < 0;
    if (wbits === 0) {
      f = f.add(ctneg(isEven, comp[offF]));
    } else {
      p = p.add(ctneg(isNeg, comp[offP]));
    }
  }
  return { p, f };
};

// node_modules/@tideorg/js/dist/Models/Infos/KeyInfo.js
var KeyInfo = class _KeyInfo {
  UserId;
  UserPublic;
  UserM;
  OrkInfo;
  constructor(userId, userPublic, userM, orkInfo) {
    this.UserId = userId;
    this.UserPublic = userPublic;
    this.UserM = userM;
    this.OrkInfo = orkInfo;
  }
  toString() {
    return JSON.stringify({
      UserId: this.UserId,
      UserPublic: this.UserPublic.toBase64(),
      UserM: this.UserM,
      OrkInfos: this.OrkInfo.map((info) => info.toString())
    });
  }
  toNativeTypeObject() {
    return {
      UserId: this.UserId,
      UserPublic: this.UserPublic.toBase64(),
      UserM: this.UserM,
      OrkInfos: this.OrkInfo.map((info) => info.toNativeTypeObject())
    };
  }
  static from(data) {
    const json = JSON.parse(data);
    const pub = Point.fromBase64(json.UserPublic);
    const orkInfo = json.OrkInfos.map((orkInfo2) => OrkInfo.from(orkInfo2));
    return new _KeyInfo(json.UserId, pub, json.UserM, orkInfo);
  }
  static fromNativeTypeObject(json) {
    return new _KeyInfo(json.UserId, Point.fromBase64(json.UserPublic), json.UserM, json.OrkInfos.map((o) => OrkInfo.fromNativeTypeObject(o)));
  }
};

// node_modules/@tideorg/js/dist/Clients/NetworkClient.js
var NetworkClient = class extends ClientBase {
  constructor(url = null) {
    if (url == null)
      super(window.location.origin);
    else
      super(url);
  }
  async FindReservers(uid) {
    const endpoint = `/Network/Authentication/Users/GetReservers/${uid}`;
    const response = await this._get(endpoint);
    try {
      const responseData = await this._handleError(response, "Find Reservers");
      const formattedResponse = JSON.parse(responseData);
      if (formattedResponse.length == 0)
        throw new TideError({
          code: TideJsErrorCodes.VAL_UID_FORBIDDEN,
          displayMessage: `Username forbidden (uid prefix=${(uid ?? "").slice(0, 12)}, endpoint=${endpoint ?? this.url})`,
          source: "Clients/NetworkClient.ts:34"
        });
      const returnedResponse = formattedResponse.map((orkEntry) => OrkInfo.from(orkEntry));
      return returnedResponse;
    } catch (err2) {
      throw err2;
    }
  }
  async GetSomeORKs() {
    const response = await this._get("/Network/Authentication/Node/Some");
    const responseData = await this._handleError(response, "Get Some Orks");
    const formattedResponse = JSON.parse(responseData);
    const returnedResponse = formattedResponse.map((orkEntry) => {
      return OrkInfo.from(orkEntry);
    });
    return returnedResponse;
  }
  async GetPayerUrl(payerPublic) {
    const response = await this._get(`/Network/Payment/Node/Urls/${payerPublic}`);
    const responseData = await this._handleError(response, "Get Payer URL");
    const urlArray = JSON.parse(responseData);
    const randomUrl = urlArray[Math.floor(Math.random() * urlArray.length)];
    return randomUrl;
  }
  async GetKeyInfo(uid) {
    const response = await this._get(`/Network/Authentication/Users/UserInfo/${uid}`);
    let responseData;
    try {
      responseData = await this._handleError(response, "Get Key Info");
    } catch (err2) {
      throw new TideError({
        code: TideJsErrorCodes.VAL_INVALID_ACCOUNT,
        displayMessage: "simulator.invalidAccount",
        // preserve the sentinel string in displayMessage for any callers matching on .message
        source: "Clients/NetworkClient.ts:66",
        cause: err2
        // preserve the upstream TideError if there is one
      });
    }
    return KeyInfo.from(responseData);
  }
};
export {
  AES_exports as AES,
  Ed25519Scheme,
  NetworkClient,
  PolicyProtectedSerializedField as PPSF,
  PolicyAuthorizedEncryptionFlow,
  TideKey,
  dVVKDecryptionFlow
};
