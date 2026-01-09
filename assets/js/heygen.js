var jt = Object.defineProperty;
var wt = (q) => {
  throw TypeError(q);
};
var $t = (q, U, F) =>
  U in q
    ? jt(q, U, { enumerable: !0, configurable: !0, writable: !0, value: F })
    : (q[U] = F);
var De = (q, U, F) => $t(q, typeof U != "symbol" ? U + "" : U, F),
  Rt = (q, U, F) => U.has(q) || wt("Cannot " + F);
var be = (q, U, F) => (
    Rt(q, U, "read from private field"), F ? F.call(q) : U.get(q)
  ),
  Pe = (q, U, F) =>
    U.has(q)
      ? wt("Cannot add the same private member more than once")
      : U instanceof WeakSet
      ? U.add(q)
      : U.set(q, F),
  Ie = (q, U, F, B) => (
    Rt(q, U, "write to private field"), B ? B.call(q, F) : U.set(q, F), F
  );
(function () {
  const U = document.createElement("link").relList;
  if (U && U.supports && U.supports("modulepreload")) return;
  for (const V of document.querySelectorAll('link[rel="modulepreload"]')) B(V);
  new MutationObserver((V) => {
    for (const j of V)
      if (j.type === "childList")
        for (const $ of j.addedNodes)
          $.tagName === "LINK" && $.rel === "modulepreload" && B($);
  }).observe(document, { childList: !0, subtree: !0 });
  function F(V) {
    const j = {};
    return (
      V.integrity && (j.integrity = V.integrity),
      V.referrerPolicy && (j.referrerPolicy = V.referrerPolicy),
      V.crossOrigin === "use-credentials"
        ? (j.credentials = "include")
        : V.crossOrigin === "anonymous"
        ? (j.credentials = "omit")
        : (j.credentials = "same-origin"),
      j
    );
  }
  function B(V) {
    if (V.ep) return;
    V.ep = !0;
    const j = F(V);
    fetch(V.href, j);
  }
})();
var define_process_env_default = {};
function _mergeNamespaces(q, U) {
  return (
    U.forEach(function (F) {
      F &&
        typeof F != "string" &&
        !Array.isArray(F) &&
        Object.keys(F).forEach(function (B) {
          if (B !== "default" && !(B in q)) {
            var V = Object.getOwnPropertyDescriptor(F, B);
            Object.defineProperty(
              q,
              B,
              V.get
                ? V
                : {
                    enumerable: !0,
                    get: function () {
                      return F[B];
                    },
                  }
            );
          }
        });
    }),
    Object.freeze(q)
  );
}
var e$1 = Object.defineProperty,
  h$1 = (q, U, F) =>
    U in q
      ? e$1(q, U, { enumerable: !0, configurable: !0, writable: !0, value: F })
      : (q[U] = F),
  o$1 = (q, U, F) => h$1(q, typeof U != "symbol" ? U + "" : U, F);
let _$1 = class {
  constructor() {
    o$1(this, "_locking"),
      o$1(this, "_locks"),
      (this._locking = Promise.resolve()),
      (this._locks = 0);
  }
  isLocked() {
    return this._locks > 0;
  }
  lock() {
    this._locks += 1;
    let U;
    const F = new Promise(
        (V) =>
          (U = () => {
            (this._locks -= 1), V();
          })
      ),
      B = this._locking.then(() => U);
    return (this._locking = this._locking.then(() => F)), B;
  }
};
function assert(q, U) {
  if (!q) throw new Error(U);
}
const FLOAT32_MAX = 34028234663852886e22,
  FLOAT32_MIN = -34028234663852886e22,
  UINT32_MAX = 4294967295,
  INT32_MAX = 2147483647,
  INT32_MIN = -2147483648;
function assertInt32(q) {
  if (typeof q != "number") throw new Error("invalid int 32: " + typeof q);
  if (!Number.isInteger(q) || q > INT32_MAX || q < INT32_MIN)
    throw new Error("invalid int 32: " + q);
}
function assertUInt32(q) {
  if (typeof q != "number") throw new Error("invalid uint 32: " + typeof q);
  if (!Number.isInteger(q) || q > UINT32_MAX || q < 0)
    throw new Error("invalid uint 32: " + q);
}
function assertFloat32(q) {
  if (typeof q != "number") throw new Error("invalid float 32: " + typeof q);
  if (Number.isFinite(q) && (q > FLOAT32_MAX || q < FLOAT32_MIN))
    throw new Error("invalid float 32: " + q);
}
const enumTypeSymbol = Symbol("@bufbuild/protobuf/enum-type");
function getEnumType(q) {
  const U = q[enumTypeSymbol];
  return assert(U, "missing enum type on enum object"), U;
}
function setEnumType(q, U, F, B) {
  q[enumTypeSymbol] = makeEnumType(
    U,
    F.map((V) => ({ no: V.no, name: V.name, localName: q[V.no] }))
  );
}
function makeEnumType(q, U, F) {
  const B = Object.create(null),
    V = Object.create(null),
    j = [];
  for (const $ of U) {
    const W = normalizeEnumValue($);
    j.push(W), (B[$.name] = W), (V[$.no] = W);
  }
  return {
    typeName: q,
    values: j,
    findName($) {
      return B[$];
    },
    findNumber($) {
      return V[$];
    },
  };
}
function makeEnum(q, U, F) {
  const B = {};
  for (const V of U) {
    const j = normalizeEnumValue(V);
    (B[j.localName] = j.no), (B[j.no] = j.localName);
  }
  return setEnumType(B, q, U), B;
}
function normalizeEnumValue(q) {
  return "localName" in q
    ? q
    : Object.assign(Object.assign({}, q), { localName: q.name });
}
class Message {
  equals(U) {
    return this.getType().runtime.util.equals(this.getType(), this, U);
  }
  clone() {
    return this.getType().runtime.util.clone(this);
  }
  fromBinary(U, F) {
    const B = this.getType(),
      V = B.runtime.bin,
      j = V.makeReadOptions(F);
    return V.readMessage(this, j.readerFactory(U), U.byteLength, j), this;
  }
  fromJson(U, F) {
    const B = this.getType(),
      V = B.runtime.json,
      j = V.makeReadOptions(F);
    return V.readMessage(B, U, j, this), this;
  }
  fromJsonString(U, F) {
    let B;
    try {
      B = JSON.parse(U);
    } catch (V) {
      throw new Error(
        "cannot decode "
          .concat(this.getType().typeName, " from JSON: ")
          .concat(V instanceof Error ? V.message : String(V))
      );
    }
    return this.fromJson(B, F);
  }
  toBinary(U) {
    const F = this.getType(),
      B = F.runtime.bin,
      V = B.makeWriteOptions(U),
      j = V.writerFactory();
    return B.writeMessage(this, j, V), j.finish();
  }
  toJson(U) {
    const F = this.getType(),
      B = F.runtime.json,
      V = B.makeWriteOptions(U);
    return B.writeMessage(this, V);
  }
  toJsonString(U) {
    var F;
    const B = this.toJson(U);
    return JSON.stringify(
      B,
      null,
      (F = U == null ? void 0 : U.prettySpaces) !== null && F !== void 0 ? F : 0
    );
  }
  toJSON() {
    return this.toJson({ emitDefaultValues: !0 });
  }
  getType() {
    return Object.getPrototypeOf(this).constructor;
  }
}
function makeMessageType(q, U, F, B) {
  var V;
  const j =
      (V = B == null ? void 0 : B.localName) !== null && V !== void 0
        ? V
        : U.substring(U.lastIndexOf(".") + 1),
    $ = {
      [j]: function (W) {
        q.util.initFields(this), q.util.initPartial(W, this);
      },
    }[j];
  return (
    Object.setPrototypeOf($.prototype, new Message()),
    Object.assign($, {
      runtime: q,
      typeName: U,
      fields: q.util.newFieldList(F),
      fromBinary(W, K) {
        return new $().fromBinary(W, K);
      },
      fromJson(W, K) {
        return new $().fromJson(W, K);
      },
      fromJsonString(W, K) {
        return new $().fromJsonString(W, K);
      },
      equals(W, K) {
        return q.util.equals($, W, K);
      },
    }),
    $
  );
}
function varint64read() {
  let q = 0,
    U = 0;
  for (let B = 0; B < 28; B += 7) {
    let V = this.buf[this.pos++];
    if (((q |= (V & 127) << B), (V & 128) == 0))
      return this.assertBounds(), [q, U];
  }
  let F = this.buf[this.pos++];
  if (((q |= (F & 15) << 28), (U = (F & 112) >> 4), (F & 128) == 0))
    return this.assertBounds(), [q, U];
  for (let B = 3; B <= 31; B += 7) {
    let V = this.buf[this.pos++];
    if (((U |= (V & 127) << B), (V & 128) == 0))
      return this.assertBounds(), [q, U];
  }
  throw new Error("invalid varint");
}
function varint64write(q, U, F) {
  for (let j = 0; j < 28; j = j + 7) {
    const $ = q >>> j,
      W = !(!($ >>> 7) && U == 0),
      K = (W ? $ | 128 : $) & 255;
    if ((F.push(K), !W)) return;
  }
  const B = ((q >>> 28) & 15) | ((U & 7) << 4),
    V = U >> 3 != 0;
  if ((F.push((V ? B | 128 : B) & 255), !!V)) {
    for (let j = 3; j < 31; j = j + 7) {
      const $ = U >>> j,
        W = !!($ >>> 7),
        K = (W ? $ | 128 : $) & 255;
      if ((F.push(K), !W)) return;
    }
    F.push((U >>> 31) & 1);
  }
}
const TWO_PWR_32_DBL = 4294967296;
function int64FromString(q) {
  const U = q[0] === "-";
  U && (q = q.slice(1));
  const F = 1e6;
  let B = 0,
    V = 0;
  function j($, W) {
    const K = Number(q.slice($, W));
    (V *= F),
      (B = B * F + K),
      B >= TWO_PWR_32_DBL &&
        ((V = V + ((B / TWO_PWR_32_DBL) | 0)), (B = B % TWO_PWR_32_DBL));
  }
  return (
    j(-24, -18),
    j(-18, -12),
    j(-12, -6),
    j(-6),
    U ? negate(B, V) : newBits(B, V)
  );
}
function int64ToString(q, U) {
  let F = newBits(q, U);
  const B = F.hi & 2147483648;
  B && (F = negate(F.lo, F.hi));
  const V = uInt64ToString(F.lo, F.hi);
  return B ? "-" + V : V;
}
function uInt64ToString(q, U) {
  if ((({ lo: q, hi: U } = toUnsigned(q, U)), U <= 2097151))
    return String(TWO_PWR_32_DBL * U + q);
  const F = q & 16777215,
    B = ((q >>> 24) | (U << 8)) & 16777215,
    V = (U >> 16) & 65535;
  let j = F + B * 6777216 + V * 6710656,
    $ = B + V * 8147497,
    W = V * 2;
  const K = 1e7;
  return (
    j >= K && (($ += Math.floor(j / K)), (j %= K)),
    $ >= K && ((W += Math.floor($ / K)), ($ %= K)),
    W.toString() +
      decimalFrom1e7WithLeadingZeros($) +
      decimalFrom1e7WithLeadingZeros(j)
  );
}
function toUnsigned(q, U) {
  return { lo: q >>> 0, hi: U >>> 0 };
}
function newBits(q, U) {
  return { lo: q | 0, hi: U | 0 };
}
function negate(q, U) {
  return (U = ~U), q ? (q = ~q + 1) : (U += 1), newBits(q, U);
}
const decimalFrom1e7WithLeadingZeros = (q) => {
  const U = String(q);
  return "0000000".slice(U.length) + U;
};
function varint32write(q, U) {
  if (q >= 0) {
    for (; q > 127; ) U.push((q & 127) | 128), (q = q >>> 7);
    U.push(q);
  } else {
    for (let F = 0; F < 9; F++) U.push((q & 127) | 128), (q = q >> 7);
    U.push(1);
  }
}
function varint32read() {
  let q = this.buf[this.pos++],
    U = q & 127;
  if ((q & 128) == 0) return this.assertBounds(), U;
  if (((q = this.buf[this.pos++]), (U |= (q & 127) << 7), (q & 128) == 0))
    return this.assertBounds(), U;
  if (((q = this.buf[this.pos++]), (U |= (q & 127) << 14), (q & 128) == 0))
    return this.assertBounds(), U;
  if (((q = this.buf[this.pos++]), (U |= (q & 127) << 21), (q & 128) == 0))
    return this.assertBounds(), U;
  (q = this.buf[this.pos++]), (U |= (q & 15) << 28);
  for (let F = 5; (q & 128) !== 0 && F < 10; F++) q = this.buf[this.pos++];
  if ((q & 128) != 0) throw new Error("invalid varint");
  return this.assertBounds(), U >>> 0;
}
function makeInt64Support() {
  const q = new DataView(new ArrayBuffer(8));
  if (
    typeof BigInt == "function" &&
    typeof q.getBigInt64 == "function" &&
    typeof q.getBigUint64 == "function" &&
    typeof q.setBigInt64 == "function" &&
    typeof q.setBigUint64 == "function" &&
    (typeof process != "object" ||
      typeof define_process_env_default != "object" ||
      define_process_env_default.BUF_BIGINT_DISABLE !== "1")
  ) {
    const V = BigInt("-9223372036854775808"),
      j = BigInt("9223372036854775807"),
      $ = BigInt("0"),
      W = BigInt("18446744073709551615");
    return {
      zero: BigInt(0),
      supported: !0,
      parse(K) {
        const G = typeof K == "bigint" ? K : BigInt(K);
        if (G > j || G < V) throw new Error("int64 invalid: ".concat(K));
        return G;
      },
      uParse(K) {
        const G = typeof K == "bigint" ? K : BigInt(K);
        if (G > W || G < $) throw new Error("uint64 invalid: ".concat(K));
        return G;
      },
      enc(K) {
        return (
          q.setBigInt64(0, this.parse(K), !0),
          { lo: q.getInt32(0, !0), hi: q.getInt32(4, !0) }
        );
      },
      uEnc(K) {
        return (
          q.setBigInt64(0, this.uParse(K), !0),
          { lo: q.getInt32(0, !0), hi: q.getInt32(4, !0) }
        );
      },
      dec(K, G) {
        return q.setInt32(0, K, !0), q.setInt32(4, G, !0), q.getBigInt64(0, !0);
      },
      uDec(K, G) {
        return (
          q.setInt32(0, K, !0), q.setInt32(4, G, !0), q.getBigUint64(0, !0)
        );
      },
    };
  }
  const F = (V) => assert(/^-?[0-9]+$/.test(V), "int64 invalid: ".concat(V)),
    B = (V) => assert(/^[0-9]+$/.test(V), "uint64 invalid: ".concat(V));
  return {
    zero: "0",
    supported: !1,
    parse(V) {
      return typeof V != "string" && (V = V.toString()), F(V), V;
    },
    uParse(V) {
      return typeof V != "string" && (V = V.toString()), B(V), V;
    },
    enc(V) {
      return (
        typeof V != "string" && (V = V.toString()), F(V), int64FromString(V)
      );
    },
    uEnc(V) {
      return (
        typeof V != "string" && (V = V.toString()), B(V), int64FromString(V)
      );
    },
    dec(V, j) {
      return int64ToString(V, j);
    },
    uDec(V, j) {
      return uInt64ToString(V, j);
    },
  };
}
const protoInt64 = makeInt64Support();
var ScalarType;
(function (q) {
  (q[(q.DOUBLE = 1)] = "DOUBLE"),
    (q[(q.FLOAT = 2)] = "FLOAT"),
    (q[(q.INT64 = 3)] = "INT64"),
    (q[(q.UINT64 = 4)] = "UINT64"),
    (q[(q.INT32 = 5)] = "INT32"),
    (q[(q.FIXED64 = 6)] = "FIXED64"),
    (q[(q.FIXED32 = 7)] = "FIXED32"),
    (q[(q.BOOL = 8)] = "BOOL"),
    (q[(q.STRING = 9)] = "STRING"),
    (q[(q.BYTES = 12)] = "BYTES"),
    (q[(q.UINT32 = 13)] = "UINT32"),
    (q[(q.SFIXED32 = 15)] = "SFIXED32"),
    (q[(q.SFIXED64 = 16)] = "SFIXED64"),
    (q[(q.SINT32 = 17)] = "SINT32"),
    (q[(q.SINT64 = 18)] = "SINT64");
})(ScalarType || (ScalarType = {}));
var LongType;
(function (q) {
  (q[(q.BIGINT = 0)] = "BIGINT"), (q[(q.STRING = 1)] = "STRING");
})(LongType || (LongType = {}));
function scalarEquals(q, U, F) {
  if (U === F) return !0;
  if (q == ScalarType.BYTES) {
    if (
      !(U instanceof Uint8Array) ||
      !(F instanceof Uint8Array) ||
      U.length !== F.length
    )
      return !1;
    for (let B = 0; B < U.length; B++) if (U[B] !== F[B]) return !1;
    return !0;
  }
  switch (q) {
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      return U == F;
  }
  return !1;
}
function scalarZeroValue(q, U) {
  switch (q) {
    case ScalarType.BOOL:
      return !1;
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      return U == 0 ? protoInt64.zero : "0";
    case ScalarType.DOUBLE:
    case ScalarType.FLOAT:
      return 0;
    case ScalarType.BYTES:
      return new Uint8Array(0);
    case ScalarType.STRING:
      return "";
    default:
      return 0;
  }
}
function isScalarZeroValue(q, U) {
  switch (q) {
    case ScalarType.BOOL:
      return U === !1;
    case ScalarType.STRING:
      return U === "";
    case ScalarType.BYTES:
      return U instanceof Uint8Array && !U.byteLength;
    default:
      return U == 0;
  }
}
var WireType;
(function (q) {
  (q[(q.Varint = 0)] = "Varint"),
    (q[(q.Bit64 = 1)] = "Bit64"),
    (q[(q.LengthDelimited = 2)] = "LengthDelimited"),
    (q[(q.StartGroup = 3)] = "StartGroup"),
    (q[(q.EndGroup = 4)] = "EndGroup"),
    (q[(q.Bit32 = 5)] = "Bit32");
})(WireType || (WireType = {}));
class BinaryWriter {
  constructor(U) {
    (this.stack = []),
      (this.textEncoder = U ?? new TextEncoder()),
      (this.chunks = []),
      (this.buf = []);
  }
  finish() {
    this.chunks.push(new Uint8Array(this.buf));
    let U = 0;
    for (let V = 0; V < this.chunks.length; V++) U += this.chunks[V].length;
    let F = new Uint8Array(U),
      B = 0;
    for (let V = 0; V < this.chunks.length; V++)
      F.set(this.chunks[V], B), (B += this.chunks[V].length);
    return (this.chunks = []), F;
  }
  fork() {
    return (
      this.stack.push({ chunks: this.chunks, buf: this.buf }),
      (this.chunks = []),
      (this.buf = []),
      this
    );
  }
  join() {
    let U = this.finish(),
      F = this.stack.pop();
    if (!F) throw new Error("invalid state, fork stack empty");
    return (
      (this.chunks = F.chunks),
      (this.buf = F.buf),
      this.uint32(U.byteLength),
      this.raw(U)
    );
  }
  tag(U, F) {
    return this.uint32(((U << 3) | F) >>> 0);
  }
  raw(U) {
    return (
      this.buf.length &&
        (this.chunks.push(new Uint8Array(this.buf)), (this.buf = [])),
      this.chunks.push(U),
      this
    );
  }
  uint32(U) {
    for (assertUInt32(U); U > 127; )
      this.buf.push((U & 127) | 128), (U = U >>> 7);
    return this.buf.push(U), this;
  }
  int32(U) {
    return assertInt32(U), varint32write(U, this.buf), this;
  }
  bool(U) {
    return this.buf.push(U ? 1 : 0), this;
  }
  bytes(U) {
    return this.uint32(U.byteLength), this.raw(U);
  }
  string(U) {
    let F = this.textEncoder.encode(U);
    return this.uint32(F.byteLength), this.raw(F);
  }
  float(U) {
    assertFloat32(U);
    let F = new Uint8Array(4);
    return new DataView(F.buffer).setFloat32(0, U, !0), this.raw(F);
  }
  double(U) {
    let F = new Uint8Array(8);
    return new DataView(F.buffer).setFloat64(0, U, !0), this.raw(F);
  }
  fixed32(U) {
    assertUInt32(U);
    let F = new Uint8Array(4);
    return new DataView(F.buffer).setUint32(0, U, !0), this.raw(F);
  }
  sfixed32(U) {
    assertInt32(U);
    let F = new Uint8Array(4);
    return new DataView(F.buffer).setInt32(0, U, !0), this.raw(F);
  }
  sint32(U) {
    return (
      assertInt32(U),
      (U = ((U << 1) ^ (U >> 31)) >>> 0),
      varint32write(U, this.buf),
      this
    );
  }
  sfixed64(U) {
    let F = new Uint8Array(8),
      B = new DataView(F.buffer),
      V = protoInt64.enc(U);
    return B.setInt32(0, V.lo, !0), B.setInt32(4, V.hi, !0), this.raw(F);
  }
  fixed64(U) {
    let F = new Uint8Array(8),
      B = new DataView(F.buffer),
      V = protoInt64.uEnc(U);
    return B.setInt32(0, V.lo, !0), B.setInt32(4, V.hi, !0), this.raw(F);
  }
  int64(U) {
    let F = protoInt64.enc(U);
    return varint64write(F.lo, F.hi, this.buf), this;
  }
  sint64(U) {
    let F = protoInt64.enc(U),
      B = F.hi >> 31,
      V = (F.lo << 1) ^ B,
      j = ((F.hi << 1) | (F.lo >>> 31)) ^ B;
    return varint64write(V, j, this.buf), this;
  }
  uint64(U) {
    let F = protoInt64.uEnc(U);
    return varint64write(F.lo, F.hi, this.buf), this;
  }
}
class BinaryReader {
  constructor(U, F) {
    (this.varint64 = varint64read),
      (this.uint32 = varint32read),
      (this.buf = U),
      (this.len = U.length),
      (this.pos = 0),
      (this.view = new DataView(U.buffer, U.byteOffset, U.byteLength)),
      (this.textDecoder = F ?? new TextDecoder());
  }
  tag() {
    let U = this.uint32(),
      F = U >>> 3,
      B = U & 7;
    if (F <= 0 || B < 0 || B > 5)
      throw new Error("illegal tag: field no " + F + " wire type " + B);
    return [F, B];
  }
  skip(U, F) {
    let B = this.pos;
    switch (U) {
      case WireType.Varint:
        for (; this.buf[this.pos++] & 128; );
        break;
      case WireType.Bit64:
        this.pos += 4;
      case WireType.Bit32:
        this.pos += 4;
        break;
      case WireType.LengthDelimited:
        let V = this.uint32();
        this.pos += V;
        break;
      case WireType.StartGroup:
        for (;;) {
          const [j, $] = this.tag();
          if ($ === WireType.EndGroup) {
            if (F !== void 0 && j !== F)
              throw new Error("invalid end group tag");
            break;
          }
          this.skip($, j);
        }
        break;
      default:
        throw new Error("cant skip wire type " + U);
    }
    return this.assertBounds(), this.buf.subarray(B, this.pos);
  }
  assertBounds() {
    if (this.pos > this.len) throw new RangeError("premature EOF");
  }
  int32() {
    return this.uint32() | 0;
  }
  sint32() {
    let U = this.uint32();
    return (U >>> 1) ^ -(U & 1);
  }
  int64() {
    return protoInt64.dec(...this.varint64());
  }
  uint64() {
    return protoInt64.uDec(...this.varint64());
  }
  sint64() {
    let [U, F] = this.varint64(),
      B = -(U & 1);
    return (
      (U = ((U >>> 1) | ((F & 1) << 31)) ^ B),
      (F = (F >>> 1) ^ B),
      protoInt64.dec(U, F)
    );
  }
  bool() {
    let [U, F] = this.varint64();
    return U !== 0 || F !== 0;
  }
  fixed32() {
    return this.view.getUint32((this.pos += 4) - 4, !0);
  }
  sfixed32() {
    return this.view.getInt32((this.pos += 4) - 4, !0);
  }
  fixed64() {
    return protoInt64.uDec(this.sfixed32(), this.sfixed32());
  }
  sfixed64() {
    return protoInt64.dec(this.sfixed32(), this.sfixed32());
  }
  float() {
    return this.view.getFloat32((this.pos += 4) - 4, !0);
  }
  double() {
    return this.view.getFloat64((this.pos += 8) - 8, !0);
  }
  bytes() {
    let U = this.uint32(),
      F = this.pos;
    return (this.pos += U), this.assertBounds(), this.buf.subarray(F, F + U);
  }
  string() {
    return this.textDecoder.decode(this.bytes());
  }
}
function makeExtension(q, U, F, B) {
  let V;
  return {
    typeName: U,
    extendee: F,
    get field() {
      if (!V) {
        const j = typeof B == "function" ? B() : B;
        (j.name = U.split(".").pop()),
          (j.jsonName = "[".concat(U, "]")),
          (V = q.util.newFieldList([j]).list()[0]);
      }
      return V;
    },
    runtime: q,
  };
}
function createExtensionContainer(q) {
  const U = q.field.localName,
    F = Object.create(null);
  return (F[U] = initExtensionField(q)), [F, () => F[U]];
}
function initExtensionField(q) {
  const U = q.field;
  if (U.repeated) return [];
  if (U.default !== void 0) return U.default;
  switch (U.kind) {
    case "enum":
      return U.T.values[0].no;
    case "scalar":
      return scalarZeroValue(U.T, U.L);
    case "message":
      const F = U.T,
        B = new F();
      return F.fieldWrapper ? F.fieldWrapper.unwrapField(B) : B;
    case "map":
      throw "map fields are not allowed to be extensions";
  }
}
function filterUnknownFields(q, U) {
  if (!U.repeated && (U.kind == "enum" || U.kind == "scalar")) {
    for (let F = q.length - 1; F >= 0; --F) if (q[F].no == U.no) return [q[F]];
    return [];
  }
  return q.filter((F) => F.no === U.no);
}
let encTable =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(
      ""
    ),
  decTable = [];
for (let q = 0; q < encTable.length; q++)
  decTable[encTable[q].charCodeAt(0)] = q;
decTable[45] = encTable.indexOf("+");
decTable[95] = encTable.indexOf("/");
const protoBase64 = {
  dec(q) {
    let U = (q.length * 3) / 4;
    q[q.length - 2] == "=" ? (U -= 2) : q[q.length - 1] == "=" && (U -= 1);
    let F = new Uint8Array(U),
      B = 0,
      V = 0,
      j,
      $ = 0;
    for (let W = 0; W < q.length; W++) {
      if (((j = decTable[q.charCodeAt(W)]), j === void 0))
        switch (q[W]) {
          case "=":
            V = 0;
          case `
`:
          case "\r":
          case "	":
          case " ":
            continue;
          default:
            throw Error("invalid base64 string.");
        }
      switch (V) {
        case 0:
          ($ = j), (V = 1);
          break;
        case 1:
          (F[B++] = ($ << 2) | ((j & 48) >> 4)), ($ = j), (V = 2);
          break;
        case 2:
          (F[B++] = (($ & 15) << 4) | ((j & 60) >> 2)), ($ = j), (V = 3);
          break;
        case 3:
          (F[B++] = (($ & 3) << 6) | j), (V = 0);
          break;
      }
    }
    if (V == 1) throw Error("invalid base64 string.");
    return F.subarray(0, B);
  },
  enc(q) {
    let U = "",
      F = 0,
      B,
      V = 0;
    for (let j = 0; j < q.length; j++)
      switch (((B = q[j]), F)) {
        case 0:
          (U += encTable[B >> 2]), (V = (B & 3) << 4), (F = 1);
          break;
        case 1:
          (U += encTable[V | (B >> 4)]), (V = (B & 15) << 2), (F = 2);
          break;
        case 2:
          (U += encTable[V | (B >> 6)]), (U += encTable[B & 63]), (F = 0);
          break;
      }
    return F && ((U += encTable[V]), (U += "="), F == 1 && (U += "=")), U;
  },
};
function getExtension(q, U, F) {
  assertExtendee(U, q);
  const B = U.runtime.bin.makeReadOptions(F),
    V = filterUnknownFields(
      q.getType().runtime.bin.listUnknownFields(q),
      U.field
    ),
    [j, $] = createExtensionContainer(U);
  for (const W of V)
    U.runtime.bin.readField(j, B.readerFactory(W.data), U.field, W.wireType, B);
  return $();
}
function setExtension(q, U, F, B) {
  assertExtendee(U, q);
  const V = U.runtime.bin.makeReadOptions(B),
    j = U.runtime.bin.makeWriteOptions(B);
  if (hasExtension(q, U)) {
    const G = q
      .getType()
      .runtime.bin.listUnknownFields(q)
      .filter((Q) => Q.no != U.field.no);
    q.getType().runtime.bin.discardUnknownFields(q);
    for (const Q of G)
      q.getType().runtime.bin.onUnknownField(q, Q.no, Q.wireType, Q.data);
  }
  const $ = j.writerFactory();
  let W = U.field;
  !W.opt &&
    !W.repeated &&
    (W.kind == "enum" || W.kind == "scalar") &&
    (W = Object.assign(Object.assign({}, U.field), { opt: !0 })),
    U.runtime.bin.writeField(W, F, $, j);
  const K = V.readerFactory($.finish());
  for (; K.pos < K.len; ) {
    const [G, Q] = K.tag(),
      z = K.skip(Q, G);
    q.getType().runtime.bin.onUnknownField(q, G, Q, z);
  }
}
function hasExtension(q, U) {
  const F = q.getType();
  return (
    U.extendee.typeName === F.typeName &&
    !!F.runtime.bin.listUnknownFields(q).find((B) => B.no == U.field.no)
  );
}
function assertExtendee(q, U) {
  assert(
    q.extendee.typeName == U.getType().typeName,
    "extension "
      .concat(q.typeName, " can only be applied to message ")
      .concat(q.extendee.typeName)
  );
}
function isFieldSet(q, U) {
  const F = q.localName;
  if (q.repeated) return U[F].length > 0;
  if (q.oneof) return U[q.oneof.localName].case === F;
  switch (q.kind) {
    case "enum":
    case "scalar":
      return q.opt || q.req
        ? U[F] !== void 0
        : q.kind == "enum"
        ? U[F] !== q.T.values[0].no
        : !isScalarZeroValue(q.T, U[F]);
    case "message":
      return U[F] !== void 0;
    case "map":
      return Object.keys(U[F]).length > 0;
  }
}
function clearField(q, U) {
  const F = q.localName,
    B = !q.opt && !q.req;
  if (q.repeated) U[F] = [];
  else if (q.oneof) U[q.oneof.localName] = { case: void 0 };
  else
    switch (q.kind) {
      case "map":
        U[F] = {};
        break;
      case "enum":
        U[F] = B ? q.T.values[0].no : void 0;
        break;
      case "scalar":
        U[F] = B ? scalarZeroValue(q.T, q.L) : void 0;
        break;
      case "message":
        U[F] = void 0;
        break;
    }
}
function isMessage(q, U) {
  if (
    q === null ||
    typeof q != "object" ||
    !Object.getOwnPropertyNames(Message.prototype).every(
      (B) => B in q && typeof q[B] == "function"
    )
  )
    return !1;
  const F = q.getType();
  return F === null ||
    typeof F != "function" ||
    !("typeName" in F) ||
    typeof F.typeName != "string"
    ? !1
    : U === void 0
    ? !0
    : F.typeName == U.typeName;
}
function wrapField(q, U) {
  return isMessage(U) || !q.fieldWrapper ? U : q.fieldWrapper.wrapField(U);
}
ScalarType.DOUBLE,
  ScalarType.FLOAT,
  ScalarType.INT64,
  ScalarType.UINT64,
  ScalarType.INT32,
  ScalarType.UINT32,
  ScalarType.BOOL,
  ScalarType.STRING,
  ScalarType.BYTES;
const jsonReadDefaults = { ignoreUnknownFields: !1 },
  jsonWriteDefaults = {
    emitDefaultValues: !1,
    enumAsInteger: !1,
    useProtoFieldName: !1,
    prettySpaces: 0,
  };
function makeReadOptions$1(q) {
  return q
    ? Object.assign(Object.assign({}, jsonReadDefaults), q)
    : jsonReadDefaults;
}
function makeWriteOptions$1(q) {
  return q
    ? Object.assign(Object.assign({}, jsonWriteDefaults), q)
    : jsonWriteDefaults;
}
const tokenNull = Symbol(),
  tokenIgnoredUnknownEnum = Symbol();
function makeJsonFormat() {
  return {
    makeReadOptions: makeReadOptions$1,
    makeWriteOptions: makeWriteOptions$1,
    readMessage(q, U, F, B) {
      if (U == null || Array.isArray(U) || typeof U != "object")
        throw new Error(
          "cannot decode message "
            .concat(q.typeName, " from JSON: ")
            .concat(debugJsonValue(U))
        );
      B = B ?? new q();
      const V = new Map(),
        j = F.typeRegistry;
      for (const [$, W] of Object.entries(U)) {
        const K = q.fields.findJsonName($);
        if (K) {
          if (K.oneof) {
            if (W === null && K.kind == "scalar") continue;
            const G = V.get(K.oneof);
            if (G !== void 0)
              throw new Error(
                "cannot decode message "
                  .concat(q.typeName, ' from JSON: multiple keys for oneof "')
                  .concat(K.oneof.name, '" present: "')
                  .concat(G, '", "')
                  .concat($, '"')
              );
            V.set(K.oneof, $);
          }
          readField$1(B, W, K, F, q);
        } else {
          let G = !1;
          if (
            j != null &&
            j.findExtension &&
            $.startsWith("[") &&
            $.endsWith("]")
          ) {
            const Q = j.findExtension($.substring(1, $.length - 1));
            if (Q && Q.extendee.typeName == q.typeName) {
              G = !0;
              const [z, H] = createExtensionContainer(Q);
              readField$1(z, W, Q.field, F, Q), setExtension(B, Q, H(), F);
            }
          }
          if (!G && !F.ignoreUnknownFields)
            throw new Error(
              "cannot decode message "
                .concat(q.typeName, ' from JSON: key "')
                .concat($, '" is unknown')
            );
        }
      }
      return B;
    },
    writeMessage(q, U) {
      const F = q.getType(),
        B = {};
      let V;
      try {
        for (V of F.fields.byNumber()) {
          if (!isFieldSet(V, q)) {
            if (V.req) throw "required field not set";
            if (!U.emitDefaultValues || !canEmitFieldDefaultValue(V)) continue;
          }
          const $ = V.oneof ? q[V.oneof.localName].value : q[V.localName],
            W = writeField$1(V, $, U);
          W !== void 0 && (B[U.useProtoFieldName ? V.name : V.jsonName] = W);
        }
        const j = U.typeRegistry;
        if (j != null && j.findExtensionFor)
          for (const $ of F.runtime.bin.listUnknownFields(q)) {
            const W = j.findExtensionFor(F.typeName, $.no);
            if (W && hasExtension(q, W)) {
              const K = getExtension(q, W, U),
                G = writeField$1(W.field, K, U);
              G !== void 0 && (B[W.field.jsonName] = G);
            }
          }
      } catch (j) {
        const $ = V
            ? "cannot encode field "
                .concat(F.typeName, ".")
                .concat(V.name, " to JSON")
            : "cannot encode message ".concat(F.typeName, " to JSON"),
          W = j instanceof Error ? j.message : String(j);
        throw new Error($ + (W.length > 0 ? ": ".concat(W) : ""));
      }
      return B;
    },
    readScalar(q, U, F) {
      return readScalar$1(q, U, F ?? LongType.BIGINT, !0);
    },
    writeScalar(q, U, F) {
      if (U !== void 0 && (F || isScalarZeroValue(q, U)))
        return writeScalar$1(q, U);
    },
    debug: debugJsonValue,
  };
}
function debugJsonValue(q) {
  if (q === null) return "null";
  switch (typeof q) {
    case "object":
      return Array.isArray(q) ? "array" : "object";
    case "string":
      return q.length > 100
        ? "string"
        : '"'.concat(q.split('"').join('\\"'), '"');
    default:
      return String(q);
  }
}
function readField$1(q, U, F, B, V) {
  let j = F.localName;
  if (F.repeated) {
    if ((assert(F.kind != "map"), U === null)) return;
    if (!Array.isArray(U))
      throw new Error(
        "cannot decode field "
          .concat(V.typeName, ".")
          .concat(F.name, " from JSON: ")
          .concat(debugJsonValue(U))
      );
    const $ = q[j];
    for (const W of U) {
      if (W === null)
        throw new Error(
          "cannot decode field "
            .concat(V.typeName, ".")
            .concat(F.name, " from JSON: ")
            .concat(debugJsonValue(W))
        );
      switch (F.kind) {
        case "message":
          $.push(F.T.fromJson(W, B));
          break;
        case "enum":
          const K = readEnum(F.T, W, B.ignoreUnknownFields, !0);
          K !== tokenIgnoredUnknownEnum && $.push(K);
          break;
        case "scalar":
          try {
            $.push(readScalar$1(F.T, W, F.L, !0));
          } catch (G) {
            let Q = "cannot decode field "
              .concat(V.typeName, ".")
              .concat(F.name, " from JSON: ")
              .concat(debugJsonValue(W));
            throw (
              (G instanceof Error &&
                G.message.length > 0 &&
                (Q += ": ".concat(G.message)),
              new Error(Q))
            );
          }
          break;
      }
    }
  } else if (F.kind == "map") {
    if (U === null) return;
    if (typeof U != "object" || Array.isArray(U))
      throw new Error(
        "cannot decode field "
          .concat(V.typeName, ".")
          .concat(F.name, " from JSON: ")
          .concat(debugJsonValue(U))
      );
    const $ = q[j];
    for (const [W, K] of Object.entries(U)) {
      if (K === null)
        throw new Error(
          "cannot decode field "
            .concat(V.typeName, ".")
            .concat(F.name, " from JSON: map value null")
        );
      let G;
      try {
        G = readMapKey(F.K, W);
      } catch (Q) {
        let z = "cannot decode map key for field "
          .concat(V.typeName, ".")
          .concat(F.name, " from JSON: ")
          .concat(debugJsonValue(U));
        throw (
          (Q instanceof Error &&
            Q.message.length > 0 &&
            (z += ": ".concat(Q.message)),
          new Error(z))
        );
      }
      switch (F.V.kind) {
        case "message":
          $[G] = F.V.T.fromJson(K, B);
          break;
        case "enum":
          const Q = readEnum(F.V.T, K, B.ignoreUnknownFields, !0);
          Q !== tokenIgnoredUnknownEnum && ($[G] = Q);
          break;
        case "scalar":
          try {
            $[G] = readScalar$1(F.V.T, K, LongType.BIGINT, !0);
          } catch (z) {
            let H = "cannot decode map value for field "
              .concat(V.typeName, ".")
              .concat(F.name, " from JSON: ")
              .concat(debugJsonValue(U));
            throw (
              (z instanceof Error &&
                z.message.length > 0 &&
                (H += ": ".concat(z.message)),
              new Error(H))
            );
          }
          break;
      }
    }
  } else
    switch (
      (F.oneof && ((q = q[F.oneof.localName] = { case: j }), (j = "value")),
      F.kind)
    ) {
      case "message":
        const $ = F.T;
        if (U === null && $.typeName != "google.protobuf.Value") return;
        let W = q[j];
        isMessage(W)
          ? W.fromJson(U, B)
          : ((q[j] = W = $.fromJson(U, B)),
            $.fieldWrapper &&
              !F.oneof &&
              (q[j] = $.fieldWrapper.unwrapField(W)));
        break;
      case "enum":
        const K = readEnum(F.T, U, B.ignoreUnknownFields, !1);
        switch (K) {
          case tokenNull:
            clearField(F, q);
            break;
          case tokenIgnoredUnknownEnum:
            break;
          default:
            q[j] = K;
            break;
        }
        break;
      case "scalar":
        try {
          const G = readScalar$1(F.T, U, F.L, !1);
          switch (G) {
            case tokenNull:
              clearField(F, q);
              break;
            default:
              q[j] = G;
              break;
          }
        } catch (G) {
          let Q = "cannot decode field "
            .concat(V.typeName, ".")
            .concat(F.name, " from JSON: ")
            .concat(debugJsonValue(U));
          throw (
            (G instanceof Error &&
              G.message.length > 0 &&
              (Q += ": ".concat(G.message)),
            new Error(Q))
          );
        }
        break;
    }
}
function readMapKey(q, U) {
  if (q === ScalarType.BOOL)
    switch (U) {
      case "true":
        U = !0;
        break;
      case "false":
        U = !1;
        break;
    }
  return readScalar$1(q, U, LongType.BIGINT, !0).toString();
}
function readScalar$1(q, U, F, B) {
  if (U === null) return B ? scalarZeroValue(q, F) : tokenNull;
  switch (q) {
    case ScalarType.DOUBLE:
    case ScalarType.FLOAT:
      if (U === "NaN") return Number.NaN;
      if (U === "Infinity") return Number.POSITIVE_INFINITY;
      if (U === "-Infinity") return Number.NEGATIVE_INFINITY;
      if (
        U === "" ||
        (typeof U == "string" && U.trim().length !== U.length) ||
        (typeof U != "string" && typeof U != "number")
      )
        break;
      const V = Number(U);
      if (Number.isNaN(V) || !Number.isFinite(V)) break;
      return q == ScalarType.FLOAT && assertFloat32(V), V;
    case ScalarType.INT32:
    case ScalarType.FIXED32:
    case ScalarType.SFIXED32:
    case ScalarType.SINT32:
    case ScalarType.UINT32:
      let j;
      if (
        (typeof U == "number"
          ? (j = U)
          : typeof U == "string" &&
            U.length > 0 &&
            U.trim().length === U.length &&
            (j = Number(U)),
        j === void 0)
      )
        break;
      return (
        q == ScalarType.UINT32 || q == ScalarType.FIXED32
          ? assertUInt32(j)
          : assertInt32(j),
        j
      );
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      if (typeof U != "number" && typeof U != "string") break;
      const $ = protoInt64.parse(U);
      return F ? $.toString() : $;
    case ScalarType.FIXED64:
    case ScalarType.UINT64:
      if (typeof U != "number" && typeof U != "string") break;
      const W = protoInt64.uParse(U);
      return F ? W.toString() : W;
    case ScalarType.BOOL:
      if (typeof U != "boolean") break;
      return U;
    case ScalarType.STRING:
      if (typeof U != "string") break;
      try {
        encodeURIComponent(U);
      } catch {
        throw new Error("invalid UTF8");
      }
      return U;
    case ScalarType.BYTES:
      if (U === "") return new Uint8Array(0);
      if (typeof U != "string") break;
      return protoBase64.dec(U);
  }
  throw new Error();
}
function readEnum(q, U, F, B) {
  if (U === null)
    return q.typeName == "google.protobuf.NullValue"
      ? 0
      : B
      ? q.values[0].no
      : tokenNull;
  switch (typeof U) {
    case "number":
      if (Number.isInteger(U)) return U;
      break;
    case "string":
      const V = q.findName(U);
      if (V !== void 0) return V.no;
      if (F) return tokenIgnoredUnknownEnum;
      break;
  }
  throw new Error(
    "cannot decode enum "
      .concat(q.typeName, " from JSON: ")
      .concat(debugJsonValue(U))
  );
}
function canEmitFieldDefaultValue(q) {
  return q.repeated || q.kind == "map"
    ? !0
    : !(q.oneof || q.kind == "message" || q.opt || q.req);
}
function writeField$1(q, U, F) {
  if (q.kind == "map") {
    assert(typeof U == "object" && U != null);
    const B = {},
      V = Object.entries(U);
    switch (q.V.kind) {
      case "scalar":
        for (const [$, W] of V) B[$.toString()] = writeScalar$1(q.V.T, W);
        break;
      case "message":
        for (const [$, W] of V) B[$.toString()] = W.toJson(F);
        break;
      case "enum":
        const j = q.V.T;
        for (const [$, W] of V)
          B[$.toString()] = writeEnum(j, W, F.enumAsInteger);
        break;
    }
    return F.emitDefaultValues || V.length > 0 ? B : void 0;
  }
  if (q.repeated) {
    assert(Array.isArray(U));
    const B = [];
    switch (q.kind) {
      case "scalar":
        for (let V = 0; V < U.length; V++) B.push(writeScalar$1(q.T, U[V]));
        break;
      case "enum":
        for (let V = 0; V < U.length; V++)
          B.push(writeEnum(q.T, U[V], F.enumAsInteger));
        break;
      case "message":
        for (let V = 0; V < U.length; V++) B.push(U[V].toJson(F));
        break;
    }
    return F.emitDefaultValues || B.length > 0 ? B : void 0;
  }
  switch (q.kind) {
    case "scalar":
      return writeScalar$1(q.T, U);
    case "enum":
      return writeEnum(q.T, U, F.enumAsInteger);
    case "message":
      return wrapField(q.T, U).toJson(F);
  }
}
function writeEnum(q, U, F) {
  var B;
  if ((assert(typeof U == "number"), q.typeName == "google.protobuf.NullValue"))
    return null;
  if (F) return U;
  const V = q.findNumber(U);
  return (B = V == null ? void 0 : V.name) !== null && B !== void 0 ? B : U;
}
function writeScalar$1(q, U) {
  switch (q) {
    case ScalarType.INT32:
    case ScalarType.SFIXED32:
    case ScalarType.SINT32:
    case ScalarType.FIXED32:
    case ScalarType.UINT32:
      return assert(typeof U == "number"), U;
    case ScalarType.FLOAT:
    case ScalarType.DOUBLE:
      return (
        assert(typeof U == "number"),
        Number.isNaN(U)
          ? "NaN"
          : U === Number.POSITIVE_INFINITY
          ? "Infinity"
          : U === Number.NEGATIVE_INFINITY
          ? "-Infinity"
          : U
      );
    case ScalarType.STRING:
      return assert(typeof U == "string"), U;
    case ScalarType.BOOL:
      return assert(typeof U == "boolean"), U;
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      return (
        assert(
          typeof U == "bigint" || typeof U == "string" || typeof U == "number"
        ),
        U.toString()
      );
    case ScalarType.BYTES:
      return assert(U instanceof Uint8Array), protoBase64.enc(U);
  }
}
const unknownFieldsSymbol = Symbol("@bufbuild/protobuf/unknown-fields"),
  readDefaults = {
    readUnknownFields: !0,
    readerFactory: (q) => new BinaryReader(q),
  },
  writeDefaults = {
    writeUnknownFields: !0,
    writerFactory: () => new BinaryWriter(),
  };
function makeReadOptions(q) {
  return q ? Object.assign(Object.assign({}, readDefaults), q) : readDefaults;
}
function makeWriteOptions(q) {
  return q ? Object.assign(Object.assign({}, writeDefaults), q) : writeDefaults;
}
function makeBinaryFormat() {
  return {
    makeReadOptions,
    makeWriteOptions,
    listUnknownFields(q) {
      var U;
      return (U = q[unknownFieldsSymbol]) !== null && U !== void 0 ? U : [];
    },
    discardUnknownFields(q) {
      delete q[unknownFieldsSymbol];
    },
    writeUnknownFields(q, U) {
      const B = q[unknownFieldsSymbol];
      if (B) for (const V of B) U.tag(V.no, V.wireType).raw(V.data);
    },
    onUnknownField(q, U, F, B) {
      const V = q;
      Array.isArray(V[unknownFieldsSymbol]) || (V[unknownFieldsSymbol] = []),
        V[unknownFieldsSymbol].push({ no: U, wireType: F, data: B });
    },
    readMessage(q, U, F, B, V) {
      const j = q.getType(),
        $ = V ? U.len : U.pos + F;
      let W, K;
      for (
        ;
        U.pos < $ &&
        (([W, K] = U.tag()), !(V === !0 && K == WireType.EndGroup));

      ) {
        const G = j.fields.find(W);
        if (!G) {
          const Q = U.skip(K, W);
          B.readUnknownFields && this.onUnknownField(q, W, K, Q);
          continue;
        }
        readField(q, U, G, K, B);
      }
      if (V && (K != WireType.EndGroup || W !== F))
        throw new Error("invalid end group tag");
    },
    readField,
    writeMessage(q, U, F) {
      const B = q.getType();
      for (const V of B.fields.byNumber()) {
        if (!isFieldSet(V, q)) {
          if (V.req)
            throw new Error(
              "cannot encode field "
                .concat(B.typeName, ".")
                .concat(V.name, " to binary: required field not set")
            );
          continue;
        }
        const j = V.oneof ? q[V.oneof.localName].value : q[V.localName];
        writeField(V, j, U, F);
      }
      return F.writeUnknownFields && this.writeUnknownFields(q, U), U;
    },
    writeField(q, U, F, B) {
      U !== void 0 && writeField(q, U, F, B);
    },
  };
}
function readField(q, U, F, B, V) {
  let { repeated: j, localName: $ } = F;
  switch (
    (F.oneof &&
      ((q = q[F.oneof.localName]),
      q.case != $ && delete q.value,
      (q.case = $),
      ($ = "value")),
    F.kind)
  ) {
    case "scalar":
    case "enum":
      const W = F.kind == "enum" ? ScalarType.INT32 : F.T;
      let K = readScalar;
      if ((F.kind == "scalar" && F.L > 0 && (K = readScalarLTString), j)) {
        let H = q[$];
        if (
          B == WireType.LengthDelimited &&
          W != ScalarType.STRING &&
          W != ScalarType.BYTES
        ) {
          let X = U.uint32() + U.pos;
          for (; U.pos < X; ) H.push(K(U, W));
        } else H.push(K(U, W));
      } else q[$] = K(U, W);
      break;
    case "message":
      const G = F.T;
      j
        ? q[$].push(readMessageField(U, new G(), V, F))
        : isMessage(q[$])
        ? readMessageField(U, q[$], V, F)
        : ((q[$] = readMessageField(U, new G(), V, F)),
          G.fieldWrapper &&
            !F.oneof &&
            !F.repeated &&
            (q[$] = G.fieldWrapper.unwrapField(q[$])));
      break;
    case "map":
      let [Q, z] = readMapEntry(F, U, V);
      q[$][Q] = z;
      break;
  }
}
function readMessageField(q, U, F, B) {
  const V = U.getType().runtime.bin,
    j = B == null ? void 0 : B.delimited;
  return V.readMessage(U, q, j ? B.no : q.uint32(), F, j), U;
}
function readMapEntry(q, U, F) {
  const B = U.uint32(),
    V = U.pos + B;
  let j, $;
  for (; U.pos < V; ) {
    const [W] = U.tag();
    switch (W) {
      case 1:
        j = readScalar(U, q.K);
        break;
      case 2:
        switch (q.V.kind) {
          case "scalar":
            $ = readScalar(U, q.V.T);
            break;
          case "enum":
            $ = U.int32();
            break;
          case "message":
            $ = readMessageField(U, new q.V.T(), F, void 0);
            break;
        }
        break;
    }
  }
  if (
    (j === void 0 && (j = scalarZeroValue(q.K, LongType.BIGINT)),
    typeof j != "string" && typeof j != "number" && (j = j.toString()),
    $ === void 0)
  )
    switch (q.V.kind) {
      case "scalar":
        $ = scalarZeroValue(q.V.T, LongType.BIGINT);
        break;
      case "enum":
        $ = q.V.T.values[0].no;
        break;
      case "message":
        $ = new q.V.T();
        break;
    }
  return [j, $];
}
function readScalarLTString(q, U) {
  const F = readScalar(q, U);
  return typeof F == "bigint" ? F.toString() : F;
}
function readScalar(q, U) {
  switch (U) {
    case ScalarType.STRING:
      return q.string();
    case ScalarType.BOOL:
      return q.bool();
    case ScalarType.DOUBLE:
      return q.double();
    case ScalarType.FLOAT:
      return q.float();
    case ScalarType.INT32:
      return q.int32();
    case ScalarType.INT64:
      return q.int64();
    case ScalarType.UINT64:
      return q.uint64();
    case ScalarType.FIXED64:
      return q.fixed64();
    case ScalarType.BYTES:
      return q.bytes();
    case ScalarType.FIXED32:
      return q.fixed32();
    case ScalarType.SFIXED32:
      return q.sfixed32();
    case ScalarType.SFIXED64:
      return q.sfixed64();
    case ScalarType.SINT64:
      return q.sint64();
    case ScalarType.UINT32:
      return q.uint32();
    case ScalarType.SINT32:
      return q.sint32();
  }
}
function writeField(q, U, F, B) {
  assert(U !== void 0);
  const V = q.repeated;
  switch (q.kind) {
    case "scalar":
    case "enum":
      let j = q.kind == "enum" ? ScalarType.INT32 : q.T;
      if (V)
        if ((assert(Array.isArray(U)), q.packed)) writePacked(F, j, q.no, U);
        else for (const $ of U) writeScalar(F, j, q.no, $);
      else writeScalar(F, j, q.no, U);
      break;
    case "message":
      if (V) {
        assert(Array.isArray(U));
        for (const $ of U) writeMessageField(F, B, q, $);
      } else writeMessageField(F, B, q, U);
      break;
    case "map":
      assert(typeof U == "object" && U != null);
      for (const [$, W] of Object.entries(U)) writeMapEntry(F, B, q, $, W);
      break;
  }
}
function writeMapEntry(q, U, F, B, V) {
  q.tag(F.no, WireType.LengthDelimited), q.fork();
  let j = B;
  switch (F.K) {
    case ScalarType.INT32:
    case ScalarType.FIXED32:
    case ScalarType.UINT32:
    case ScalarType.SFIXED32:
    case ScalarType.SINT32:
      j = Number.parseInt(B);
      break;
    case ScalarType.BOOL:
      assert(B == "true" || B == "false"), (j = B == "true");
      break;
  }
  switch ((writeScalar(q, F.K, 1, j), F.V.kind)) {
    case "scalar":
      writeScalar(q, F.V.T, 2, V);
      break;
    case "enum":
      writeScalar(q, ScalarType.INT32, 2, V);
      break;
    case "message":
      assert(V !== void 0),
        q.tag(2, WireType.LengthDelimited).bytes(V.toBinary(U));
      break;
  }
  q.join();
}
function writeMessageField(q, U, F, B) {
  const V = wrapField(F.T, B);
  F.delimited
    ? q
        .tag(F.no, WireType.StartGroup)
        .raw(V.toBinary(U))
        .tag(F.no, WireType.EndGroup)
    : q.tag(F.no, WireType.LengthDelimited).bytes(V.toBinary(U));
}
function writeScalar(q, U, F, B) {
  assert(B !== void 0);
  let [V, j] = scalarTypeInfo(U);
  q.tag(F, V)[j](B);
}
function writePacked(q, U, F, B) {
  if (!B.length) return;
  q.tag(F, WireType.LengthDelimited).fork();
  let [, V] = scalarTypeInfo(U);
  for (let j = 0; j < B.length; j++) q[V](B[j]);
  q.join();
}
function scalarTypeInfo(q) {
  let U = WireType.Varint;
  switch (q) {
    case ScalarType.BYTES:
    case ScalarType.STRING:
      U = WireType.LengthDelimited;
      break;
    case ScalarType.DOUBLE:
    case ScalarType.FIXED64:
    case ScalarType.SFIXED64:
      U = WireType.Bit64;
      break;
    case ScalarType.FIXED32:
    case ScalarType.SFIXED32:
    case ScalarType.FLOAT:
      U = WireType.Bit32;
      break;
  }
  const F = ScalarType[q].toLowerCase();
  return [U, F];
}
function makeUtilCommon() {
  return {
    setEnumType,
    initPartial(q, U) {
      if (q === void 0) return;
      const F = U.getType();
      for (const B of F.fields.byMember()) {
        const V = B.localName,
          j = U,
          $ = q;
        if ($[V] != null)
          switch (B.kind) {
            case "oneof":
              const W = $[V].case;
              if (W === void 0) continue;
              const K = B.findField(W);
              let G = $[V].value;
              K && K.kind == "message" && !isMessage(G, K.T)
                ? (G = new K.T(G))
                : K &&
                  K.kind === "scalar" &&
                  K.T === ScalarType.BYTES &&
                  (G = toU8Arr(G)),
                (j[V] = { case: W, value: G });
              break;
            case "scalar":
            case "enum":
              let Q = $[V];
              B.T === ScalarType.BYTES &&
                (Q = B.repeated ? Q.map(toU8Arr) : toU8Arr(Q)),
                (j[V] = Q);
              break;
            case "map":
              switch (B.V.kind) {
                case "scalar":
                case "enum":
                  if (B.V.T === ScalarType.BYTES)
                    for (const [Y, X] of Object.entries($[V]))
                      j[V][Y] = toU8Arr(X);
                  else Object.assign(j[V], $[V]);
                  break;
                case "message":
                  const H = B.V.T;
                  for (const Y of Object.keys($[V])) {
                    let X = $[V][Y];
                    H.fieldWrapper || (X = new H(X)), (j[V][Y] = X);
                  }
                  break;
              }
              break;
            case "message":
              const z = B.T;
              if (B.repeated)
                j[V] = $[V].map((H) => (isMessage(H, z) ? H : new z(H)));
              else {
                const H = $[V];
                z.fieldWrapper
                  ? z.typeName === "google.protobuf.BytesValue"
                    ? (j[V] = toU8Arr(H))
                    : (j[V] = H)
                  : (j[V] = isMessage(H, z) ? H : new z(H));
              }
              break;
          }
      }
    },
    equals(q, U, F) {
      return U === F
        ? !0
        : !U || !F
        ? !1
        : q.fields.byMember().every((B) => {
            const V = U[B.localName],
              j = F[B.localName];
            if (B.repeated) {
              if (V.length !== j.length) return !1;
              switch (B.kind) {
                case "message":
                  return V.every(($, W) => B.T.equals($, j[W]));
                case "scalar":
                  return V.every(($, W) => scalarEquals(B.T, $, j[W]));
                case "enum":
                  return V.every(($, W) =>
                    scalarEquals(ScalarType.INT32, $, j[W])
                  );
              }
              throw new Error("repeated cannot contain ".concat(B.kind));
            }
            switch (B.kind) {
              case "message":
                return B.T.equals(V, j);
              case "enum":
                return scalarEquals(ScalarType.INT32, V, j);
              case "scalar":
                return scalarEquals(B.T, V, j);
              case "oneof":
                if (V.case !== j.case) return !1;
                const $ = B.findField(V.case);
                if ($ === void 0) return !0;
                switch ($.kind) {
                  case "message":
                    return $.T.equals(V.value, j.value);
                  case "enum":
                    return scalarEquals(ScalarType.INT32, V.value, j.value);
                  case "scalar":
                    return scalarEquals($.T, V.value, j.value);
                }
                throw new Error("oneof cannot contain ".concat($.kind));
              case "map":
                const W = Object.keys(V).concat(Object.keys(j));
                switch (B.V.kind) {
                  case "message":
                    const K = B.V.T;
                    return W.every((Q) => K.equals(V[Q], j[Q]));
                  case "enum":
                    return W.every((Q) =>
                      scalarEquals(ScalarType.INT32, V[Q], j[Q])
                    );
                  case "scalar":
                    const G = B.V.T;
                    return W.every((Q) => scalarEquals(G, V[Q], j[Q]));
                }
                break;
            }
          });
    },
    clone(q) {
      const U = q.getType(),
        F = new U(),
        B = F;
      for (const V of U.fields.byMember()) {
        const j = q[V.localName];
        let $;
        if (V.repeated) $ = j.map(cloneSingularField);
        else if (V.kind == "map") {
          $ = B[V.localName];
          for (const [W, K] of Object.entries(j)) $[W] = cloneSingularField(K);
        } else
          V.kind == "oneof"
            ? ($ = V.findField(j.case)
                ? { case: j.case, value: cloneSingularField(j.value) }
                : { case: void 0 })
            : ($ = cloneSingularField(j));
        B[V.localName] = $;
      }
      for (const V of U.runtime.bin.listUnknownFields(q))
        U.runtime.bin.onUnknownField(B, V.no, V.wireType, V.data);
      return F;
    },
  };
}
function cloneSingularField(q) {
  if (q === void 0) return q;
  if (isMessage(q)) return q.clone();
  if (q instanceof Uint8Array) {
    const U = new Uint8Array(q.byteLength);
    return U.set(q), U;
  }
  return q;
}
function toU8Arr(q) {
  return q instanceof Uint8Array ? q : new Uint8Array(q);
}
function makeProtoRuntime(q, U, F) {
  return {
    syntax: q,
    json: makeJsonFormat(),
    bin: makeBinaryFormat(),
    util: Object.assign(Object.assign({}, makeUtilCommon()), {
      newFieldList: U,
      initFields: F,
    }),
    makeMessageType(B, V, j) {
      return makeMessageType(this, B, V, j);
    },
    makeEnum,
    makeEnumType,
    getEnumType,
    makeExtension(B, V, j) {
      return makeExtension(this, B, V, j);
    },
  };
}
class InternalFieldList {
  constructor(U, F) {
    (this._fields = U), (this._normalizer = F);
  }
  findJsonName(U) {
    if (!this.jsonNames) {
      const F = {};
      for (const B of this.list()) F[B.jsonName] = F[B.name] = B;
      this.jsonNames = F;
    }
    return this.jsonNames[U];
  }
  find(U) {
    if (!this.numbers) {
      const F = {};
      for (const B of this.list()) F[B.no] = B;
      this.numbers = F;
    }
    return this.numbers[U];
  }
  list() {
    return this.all || (this.all = this._normalizer(this._fields)), this.all;
  }
  byNumber() {
    return (
      this.numbersAsc ||
        (this.numbersAsc = this.list()
          .concat()
          .sort((U, F) => U.no - F.no)),
      this.numbersAsc
    );
  }
  byMember() {
    if (!this.members) {
      this.members = [];
      const U = this.members;
      let F;
      for (const B of this.list())
        B.oneof ? B.oneof !== F && ((F = B.oneof), U.push(F)) : U.push(B);
    }
    return this.members;
  }
}
function localFieldName(q, U) {
  const F = protoCamelCase(q);
  return U ? F : safeObjectProperty(safeMessageProperty(F));
}
function localOneofName(q) {
  return localFieldName(q, !1);
}
const fieldJsonName = protoCamelCase;
function protoCamelCase(q) {
  let U = !1;
  const F = [];
  for (let B = 0; B < q.length; B++) {
    let V = q.charAt(B);
    switch (V) {
      case "_":
        U = !0;
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        F.push(V), (U = !1);
        break;
      default:
        U && ((U = !1), (V = V.toUpperCase())), F.push(V);
        break;
    }
  }
  return F.join("");
}
const reservedObjectProperties = new Set([
    "constructor",
    "toString",
    "toJSON",
    "valueOf",
  ]),
  reservedMessageProperties = new Set([
    "getType",
    "clone",
    "equals",
    "fromBinary",
    "fromJson",
    "fromJsonString",
    "toBinary",
    "toJson",
    "toJsonString",
    "toObject",
  ]),
  fallback = (q) => "".concat(q, "$"),
  safeMessageProperty = (q) =>
    reservedMessageProperties.has(q) ? fallback(q) : q,
  safeObjectProperty = (q) =>
    reservedObjectProperties.has(q) ? fallback(q) : q;
class InternalOneofInfo {
  constructor(U) {
    (this.kind = "oneof"),
      (this.repeated = !1),
      (this.packed = !1),
      (this.opt = !1),
      (this.req = !1),
      (this.default = void 0),
      (this.fields = []),
      (this.name = U),
      (this.localName = localOneofName(U));
  }
  addField(U) {
    assert(
      U.oneof === this,
      "field ".concat(U.name, " not one of ").concat(this.name)
    ),
      this.fields.push(U);
  }
  findField(U) {
    if (!this._lookup) {
      this._lookup = Object.create(null);
      for (let F = 0; F < this.fields.length; F++)
        this._lookup[this.fields[F].localName] = this.fields[F];
    }
    return this._lookup[U];
  }
}
function normalizeFieldInfos(q, U) {
  var F, B, V, j, $, W;
  const K = [];
  let G;
  for (const Q of typeof q == "function" ? q() : q) {
    const z = Q;
    if (
      ((z.localName = localFieldName(Q.name, Q.oneof !== void 0)),
      (z.jsonName =
        (F = Q.jsonName) !== null && F !== void 0 ? F : fieldJsonName(Q.name)),
      (z.repeated = (B = Q.repeated) !== null && B !== void 0 ? B : !1),
      Q.kind == "scalar" &&
        (z.L = (V = Q.L) !== null && V !== void 0 ? V : LongType.BIGINT),
      (z.delimited = (j = Q.delimited) !== null && j !== void 0 ? j : !1),
      (z.req = ($ = Q.req) !== null && $ !== void 0 ? $ : !1),
      (z.opt = (W = Q.opt) !== null && W !== void 0 ? W : !1),
      Q.packed === void 0 &&
        (z.packed =
          Q.kind == "enum" ||
          (Q.kind == "scalar" &&
            Q.T != ScalarType.BYTES &&
            Q.T != ScalarType.STRING)),
      Q.oneof !== void 0)
    ) {
      const H = typeof Q.oneof == "string" ? Q.oneof : Q.oneof.name;
      (!G || G.name != H) && (G = new InternalOneofInfo(H)),
        (z.oneof = G),
        G.addField(z);
    }
    K.push(z);
  }
  return K;
}
const proto3 = makeProtoRuntime(
  "proto3",
  (q) => new InternalFieldList(q, (U) => normalizeFieldInfos(U)),
  (q) => {
    for (const U of q.getType().fields.byMember()) {
      if (U.opt) continue;
      const F = U.localName,
        B = q;
      if (U.repeated) {
        B[F] = [];
        continue;
      }
      switch (U.kind) {
        case "oneof":
          B[F] = { case: void 0 };
          break;
        case "enum":
          B[F] = 0;
          break;
        case "map":
          B[F] = {};
          break;
        case "scalar":
          B[F] = scalarZeroValue(U.T, U.L);
          break;
      }
    }
  }
);
class Timestamp extends Message {
  constructor(U) {
    super(),
      (this.seconds = protoInt64.zero),
      (this.nanos = 0),
      proto3.util.initPartial(U, this);
  }
  fromJson(U, F) {
    if (typeof U != "string")
      throw new Error(
        "cannot decode google.protobuf.Timestamp from JSON: ".concat(
          proto3.json.debug(U)
        )
      );
    const B = U.match(
      /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/
    );
    if (!B)
      throw new Error(
        "cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string"
      );
    const V = Date.parse(
      B[1] +
        "-" +
        B[2] +
        "-" +
        B[3] +
        "T" +
        B[4] +
        ":" +
        B[5] +
        ":" +
        B[6] +
        (B[8] ? B[8] : "Z")
    );
    if (Number.isNaN(V))
      throw new Error(
        "cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string"
      );
    if (
      V < Date.parse("0001-01-01T00:00:00Z") ||
      V > Date.parse("9999-12-31T23:59:59Z")
    )
      throw new Error(
        "cannot decode message google.protobuf.Timestamp from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive"
      );
    return (
      (this.seconds = protoInt64.parse(V / 1e3)),
      (this.nanos = 0),
      B[7] &&
        (this.nanos = parseInt("1" + B[7] + "0".repeat(9 - B[7].length)) - 1e9),
      this
    );
  }
  toJson(U) {
    const F = Number(this.seconds) * 1e3;
    if (
      F < Date.parse("0001-01-01T00:00:00Z") ||
      F > Date.parse("9999-12-31T23:59:59Z")
    )
      throw new Error(
        "cannot encode google.protobuf.Timestamp to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive"
      );
    if (this.nanos < 0)
      throw new Error(
        "cannot encode google.protobuf.Timestamp to JSON: nanos must not be negative"
      );
    let B = "Z";
    if (this.nanos > 0) {
      const V = (this.nanos + 1e9).toString().substring(1);
      V.substring(3) === "000000"
        ? (B = "." + V.substring(0, 3) + "Z")
        : V.substring(6) === "000"
        ? (B = "." + V.substring(0, 6) + "Z")
        : (B = "." + V + "Z");
    }
    return new Date(F).toISOString().replace(".000Z", B);
  }
  toDate() {
    return new Date(Number(this.seconds) * 1e3 + Math.ceil(this.nanos / 1e6));
  }
  static now() {
    return Timestamp.fromDate(new Date());
  }
  static fromDate(U) {
    const F = U.getTime();
    return new Timestamp({
      seconds: protoInt64.parse(Math.floor(F / 1e3)),
      nanos: (F % 1e3) * 1e6,
    });
  }
  static fromBinary(U, F) {
    return new Timestamp().fromBinary(U, F);
  }
  static fromJson(U, F) {
    return new Timestamp().fromJson(U, F);
  }
  static fromJsonString(U, F) {
    return new Timestamp().fromJsonString(U, F);
  }
  static equals(U, F) {
    return proto3.util.equals(Timestamp, U, F);
  }
}
Timestamp.runtime = proto3;
Timestamp.typeName = "google.protobuf.Timestamp";
Timestamp.fields = proto3.util.newFieldList(() => [
  { no: 1, name: "seconds", kind: "scalar", T: 3 },
  { no: 2, name: "nanos", kind: "scalar", T: 5 },
]);
const MetricsBatch = proto3.makeMessageType("livekit.MetricsBatch", () => [
    { no: 1, name: "timestamp_ms", kind: "scalar", T: 3 },
    { no: 2, name: "normalized_timestamp", kind: "message", T: Timestamp },
    { no: 3, name: "str_data", kind: "scalar", T: 9, repeated: !0 },
    {
      no: 4,
      name: "time_series",
      kind: "message",
      T: TimeSeriesMetric,
      repeated: !0,
    },
    { no: 5, name: "events", kind: "message", T: EventMetric, repeated: !0 },
  ]),
  TimeSeriesMetric = proto3.makeMessageType("livekit.TimeSeriesMetric", () => [
    { no: 1, name: "label", kind: "scalar", T: 13 },
    { no: 2, name: "participant_identity", kind: "scalar", T: 13 },
    { no: 3, name: "track_sid", kind: "scalar", T: 13 },
    { no: 4, name: "samples", kind: "message", T: MetricSample, repeated: !0 },
    { no: 5, name: "rid", kind: "scalar", T: 13 },
  ]),
  MetricSample = proto3.makeMessageType("livekit.MetricSample", () => [
    { no: 1, name: "timestamp_ms", kind: "scalar", T: 3 },
    { no: 2, name: "normalized_timestamp", kind: "message", T: Timestamp },
    { no: 3, name: "value", kind: "scalar", T: 2 },
  ]),
  EventMetric = proto3.makeMessageType("livekit.EventMetric", () => [
    { no: 1, name: "label", kind: "scalar", T: 13 },
    { no: 2, name: "participant_identity", kind: "scalar", T: 13 },
    { no: 3, name: "track_sid", kind: "scalar", T: 13 },
    { no: 4, name: "start_timestamp_ms", kind: "scalar", T: 3 },
    { no: 5, name: "end_timestamp_ms", kind: "scalar", T: 3, opt: !0 },
    {
      no: 6,
      name: "normalized_start_timestamp",
      kind: "message",
      T: Timestamp,
    },
    {
      no: 7,
      name: "normalized_end_timestamp",
      kind: "message",
      T: Timestamp,
      opt: !0,
    },
    { no: 8, name: "metadata", kind: "scalar", T: 9 },
    { no: 9, name: "rid", kind: "scalar", T: 13 },
  ]),
  BackupCodecPolicy$1 = proto3.makeEnum("livekit.BackupCodecPolicy", [
    { no: 0, name: "PREFER_REGRESSION" },
    { no: 1, name: "SIMULCAST" },
    { no: 2, name: "REGRESSION" },
  ]),
  TrackType = proto3.makeEnum("livekit.TrackType", [
    { no: 0, name: "AUDIO" },
    { no: 1, name: "VIDEO" },
    { no: 2, name: "DATA" },
  ]),
  TrackSource = proto3.makeEnum("livekit.TrackSource", [
    { no: 0, name: "UNKNOWN" },
    { no: 1, name: "CAMERA" },
    { no: 2, name: "MICROPHONE" },
    { no: 3, name: "SCREEN_SHARE" },
    { no: 4, name: "SCREEN_SHARE_AUDIO" },
  ]),
  VideoQuality$1 = proto3.makeEnum("livekit.VideoQuality", [
    { no: 0, name: "LOW" },
    { no: 1, name: "MEDIUM" },
    { no: 2, name: "HIGH" },
    { no: 3, name: "OFF" },
  ]),
  ConnectionQuality$1 = proto3.makeEnum("livekit.ConnectionQuality", [
    { no: 0, name: "POOR" },
    { no: 1, name: "GOOD" },
    { no: 2, name: "EXCELLENT" },
    { no: 3, name: "LOST" },
  ]),
  ClientConfigSetting = proto3.makeEnum("livekit.ClientConfigSetting", [
    { no: 0, name: "UNSET" },
    { no: 1, name: "DISABLED" },
    { no: 2, name: "ENABLED" },
  ]),
  DisconnectReason = proto3.makeEnum("livekit.DisconnectReason", [
    { no: 0, name: "UNKNOWN_REASON" },
    { no: 1, name: "CLIENT_INITIATED" },
    { no: 2, name: "DUPLICATE_IDENTITY" },
    { no: 3, name: "SERVER_SHUTDOWN" },
    { no: 4, name: "PARTICIPANT_REMOVED" },
    { no: 5, name: "ROOM_DELETED" },
    { no: 6, name: "STATE_MISMATCH" },
    { no: 7, name: "JOIN_FAILURE" },
    { no: 8, name: "MIGRATION" },
    { no: 9, name: "SIGNAL_CLOSE" },
    { no: 10, name: "ROOM_CLOSED" },
    { no: 11, name: "USER_UNAVAILABLE" },
    { no: 12, name: "USER_REJECTED" },
    { no: 13, name: "SIP_TRUNK_FAILURE" },
  ]),
  ReconnectReason = proto3.makeEnum("livekit.ReconnectReason", [
    { no: 0, name: "RR_UNKNOWN" },
    { no: 1, name: "RR_SIGNAL_DISCONNECTED" },
    { no: 2, name: "RR_PUBLISHER_FAILED" },
    { no: 3, name: "RR_SUBSCRIBER_FAILED" },
    { no: 4, name: "RR_SWITCH_CANDIDATE" },
  ]),
  SubscriptionError = proto3.makeEnum("livekit.SubscriptionError", [
    { no: 0, name: "SE_UNKNOWN" },
    { no: 1, name: "SE_CODEC_UNSUPPORTED" },
    { no: 2, name: "SE_TRACK_NOTFOUND" },
  ]),
  AudioTrackFeature = proto3.makeEnum("livekit.AudioTrackFeature", [
    { no: 0, name: "TF_STEREO" },
    { no: 1, name: "TF_NO_DTX" },
    { no: 2, name: "TF_AUTO_GAIN_CONTROL" },
    { no: 3, name: "TF_ECHO_CANCELLATION" },
    { no: 4, name: "TF_NOISE_SUPPRESSION" },
    { no: 5, name: "TF_ENHANCED_NOISE_CANCELLATION" },
  ]),
  Room$1 = proto3.makeMessageType("livekit.Room", () => [
    { no: 1, name: "sid", kind: "scalar", T: 9 },
    { no: 2, name: "name", kind: "scalar", T: 9 },
    { no: 3, name: "empty_timeout", kind: "scalar", T: 13 },
    { no: 14, name: "departure_timeout", kind: "scalar", T: 13 },
    { no: 4, name: "max_participants", kind: "scalar", T: 13 },
    { no: 5, name: "creation_time", kind: "scalar", T: 3 },
    { no: 15, name: "creation_time_ms", kind: "scalar", T: 3 },
    { no: 6, name: "turn_password", kind: "scalar", T: 9 },
    { no: 7, name: "enabled_codecs", kind: "message", T: Codec, repeated: !0 },
    { no: 8, name: "metadata", kind: "scalar", T: 9 },
    { no: 9, name: "num_participants", kind: "scalar", T: 13 },
    { no: 11, name: "num_publishers", kind: "scalar", T: 13 },
    { no: 10, name: "active_recording", kind: "scalar", T: 8 },
    { no: 13, name: "version", kind: "message", T: TimedVersion },
  ]),
  Codec = proto3.makeMessageType("livekit.Codec", () => [
    { no: 1, name: "mime", kind: "scalar", T: 9 },
    { no: 2, name: "fmtp_line", kind: "scalar", T: 9 },
  ]),
  ParticipantPermission = proto3.makeMessageType(
    "livekit.ParticipantPermission",
    () => [
      { no: 1, name: "can_subscribe", kind: "scalar", T: 8 },
      { no: 2, name: "can_publish", kind: "scalar", T: 8 },
      { no: 3, name: "can_publish_data", kind: "scalar", T: 8 },
      {
        no: 9,
        name: "can_publish_sources",
        kind: "enum",
        T: proto3.getEnumType(TrackSource),
        repeated: !0,
      },
      { no: 7, name: "hidden", kind: "scalar", T: 8 },
      { no: 8, name: "recorder", kind: "scalar", T: 8 },
      { no: 10, name: "can_update_metadata", kind: "scalar", T: 8 },
      { no: 11, name: "agent", kind: "scalar", T: 8 },
      { no: 12, name: "can_subscribe_metrics", kind: "scalar", T: 8 },
    ]
  ),
  ParticipantInfo = proto3.makeMessageType("livekit.ParticipantInfo", () => [
    { no: 1, name: "sid", kind: "scalar", T: 9 },
    { no: 2, name: "identity", kind: "scalar", T: 9 },
    {
      no: 3,
      name: "state",
      kind: "enum",
      T: proto3.getEnumType(ParticipantInfo_State),
    },
    { no: 4, name: "tracks", kind: "message", T: TrackInfo, repeated: !0 },
    { no: 5, name: "metadata", kind: "scalar", T: 9 },
    { no: 6, name: "joined_at", kind: "scalar", T: 3 },
    { no: 17, name: "joined_at_ms", kind: "scalar", T: 3 },
    { no: 9, name: "name", kind: "scalar", T: 9 },
    { no: 10, name: "version", kind: "scalar", T: 13 },
    { no: 11, name: "permission", kind: "message", T: ParticipantPermission },
    { no: 12, name: "region", kind: "scalar", T: 9 },
    { no: 13, name: "is_publisher", kind: "scalar", T: 8 },
    {
      no: 14,
      name: "kind",
      kind: "enum",
      T: proto3.getEnumType(ParticipantInfo_Kind),
    },
    {
      no: 15,
      name: "attributes",
      kind: "map",
      K: 9,
      V: { kind: "scalar", T: 9 },
    },
    {
      no: 16,
      name: "disconnect_reason",
      kind: "enum",
      T: proto3.getEnumType(DisconnectReason),
    },
    {
      no: 18,
      name: "kind_details",
      kind: "enum",
      T: proto3.getEnumType(ParticipantInfo_KindDetail),
      repeated: !0,
    },
  ]),
  ParticipantInfo_State = proto3.makeEnum("livekit.ParticipantInfo.State", [
    { no: 0, name: "JOINING" },
    { no: 1, name: "JOINED" },
    { no: 2, name: "ACTIVE" },
    { no: 3, name: "DISCONNECTED" },
  ]),
  ParticipantInfo_Kind = proto3.makeEnum("livekit.ParticipantInfo.Kind", [
    { no: 0, name: "STANDARD" },
    { no: 1, name: "INGRESS" },
    { no: 2, name: "EGRESS" },
    { no: 3, name: "SIP" },
    { no: 4, name: "AGENT" },
  ]),
  ParticipantInfo_KindDetail = proto3.makeEnum(
    "livekit.ParticipantInfo.KindDetail",
    [
      { no: 0, name: "CLOUD_AGENT" },
      { no: 1, name: "FORWARDED" },
    ]
  ),
  Encryption_Type = proto3.makeEnum("livekit.Encryption.Type", [
    { no: 0, name: "NONE" },
    { no: 1, name: "GCM" },
    { no: 2, name: "CUSTOM" },
  ]),
  SimulcastCodecInfo = proto3.makeMessageType(
    "livekit.SimulcastCodecInfo",
    () => [
      { no: 1, name: "mime_type", kind: "scalar", T: 9 },
      { no: 2, name: "mid", kind: "scalar", T: 9 },
      { no: 3, name: "cid", kind: "scalar", T: 9 },
      { no: 4, name: "layers", kind: "message", T: VideoLayer, repeated: !0 },
    ]
  ),
  TrackInfo = proto3.makeMessageType("livekit.TrackInfo", () => [
    { no: 1, name: "sid", kind: "scalar", T: 9 },
    { no: 2, name: "type", kind: "enum", T: proto3.getEnumType(TrackType) },
    { no: 3, name: "name", kind: "scalar", T: 9 },
    { no: 4, name: "muted", kind: "scalar", T: 8 },
    { no: 5, name: "width", kind: "scalar", T: 13 },
    { no: 6, name: "height", kind: "scalar", T: 13 },
    { no: 7, name: "simulcast", kind: "scalar", T: 8 },
    { no: 8, name: "disable_dtx", kind: "scalar", T: 8 },
    { no: 9, name: "source", kind: "enum", T: proto3.getEnumType(TrackSource) },
    { no: 10, name: "layers", kind: "message", T: VideoLayer, repeated: !0 },
    { no: 11, name: "mime_type", kind: "scalar", T: 9 },
    { no: 12, name: "mid", kind: "scalar", T: 9 },
    {
      no: 13,
      name: "codecs",
      kind: "message",
      T: SimulcastCodecInfo,
      repeated: !0,
    },
    { no: 14, name: "stereo", kind: "scalar", T: 8 },
    { no: 15, name: "disable_red", kind: "scalar", T: 8 },
    {
      no: 16,
      name: "encryption",
      kind: "enum",
      T: proto3.getEnumType(Encryption_Type),
    },
    { no: 17, name: "stream", kind: "scalar", T: 9 },
    { no: 18, name: "version", kind: "message", T: TimedVersion },
    {
      no: 19,
      name: "audio_features",
      kind: "enum",
      T: proto3.getEnumType(AudioTrackFeature),
      repeated: !0,
    },
    {
      no: 20,
      name: "backup_codec_policy",
      kind: "enum",
      T: proto3.getEnumType(BackupCodecPolicy$1),
    },
  ]),
  VideoLayer = proto3.makeMessageType("livekit.VideoLayer", () => [
    {
      no: 1,
      name: "quality",
      kind: "enum",
      T: proto3.getEnumType(VideoQuality$1),
    },
    { no: 2, name: "width", kind: "scalar", T: 13 },
    { no: 3, name: "height", kind: "scalar", T: 13 },
    { no: 4, name: "bitrate", kind: "scalar", T: 13 },
    { no: 5, name: "ssrc", kind: "scalar", T: 13 },
  ]),
  DataPacket = proto3.makeMessageType("livekit.DataPacket", () => [
    {
      no: 1,
      name: "kind",
      kind: "enum",
      T: proto3.getEnumType(DataPacket_Kind),
    },
    { no: 4, name: "participant_identity", kind: "scalar", T: 9 },
    {
      no: 5,
      name: "destination_identities",
      kind: "scalar",
      T: 9,
      repeated: !0,
    },
    { no: 2, name: "user", kind: "message", T: UserPacket, oneof: "value" },
    {
      no: 3,
      name: "speaker",
      kind: "message",
      T: ActiveSpeakerUpdate,
      oneof: "value",
    },
    { no: 6, name: "sip_dtmf", kind: "message", T: SipDTMF, oneof: "value" },
    {
      no: 7,
      name: "transcription",
      kind: "message",
      T: Transcription,
      oneof: "value",
    },
    {
      no: 8,
      name: "metrics",
      kind: "message",
      T: MetricsBatch,
      oneof: "value",
    },
    {
      no: 9,
      name: "chat_message",
      kind: "message",
      T: ChatMessage,
      oneof: "value",
    },
    {
      no: 10,
      name: "rpc_request",
      kind: "message",
      T: RpcRequest,
      oneof: "value",
    },
    { no: 11, name: "rpc_ack", kind: "message", T: RpcAck, oneof: "value" },
    {
      no: 12,
      name: "rpc_response",
      kind: "message",
      T: RpcResponse,
      oneof: "value",
    },
    {
      no: 13,
      name: "stream_header",
      kind: "message",
      T: DataStream_Header,
      oneof: "value",
    },
    {
      no: 14,
      name: "stream_chunk",
      kind: "message",
      T: DataStream_Chunk,
      oneof: "value",
    },
    {
      no: 15,
      name: "stream_trailer",
      kind: "message",
      T: DataStream_Trailer,
      oneof: "value",
    },
  ]),
  DataPacket_Kind = proto3.makeEnum("livekit.DataPacket.Kind", [
    { no: 0, name: "RELIABLE" },
    { no: 1, name: "LOSSY" },
  ]),
  ActiveSpeakerUpdate = proto3.makeMessageType(
    "livekit.ActiveSpeakerUpdate",
    () => [
      {
        no: 1,
        name: "speakers",
        kind: "message",
        T: SpeakerInfo,
        repeated: !0,
      },
    ]
  ),
  SpeakerInfo = proto3.makeMessageType("livekit.SpeakerInfo", () => [
    { no: 1, name: "sid", kind: "scalar", T: 9 },
    { no: 2, name: "level", kind: "scalar", T: 2 },
    { no: 3, name: "active", kind: "scalar", T: 8 },
  ]),
  UserPacket = proto3.makeMessageType("livekit.UserPacket", () => [
    { no: 1, name: "participant_sid", kind: "scalar", T: 9 },
    { no: 5, name: "participant_identity", kind: "scalar", T: 9 },
    { no: 2, name: "payload", kind: "scalar", T: 12 },
    { no: 3, name: "destination_sids", kind: "scalar", T: 9, repeated: !0 },
    {
      no: 6,
      name: "destination_identities",
      kind: "scalar",
      T: 9,
      repeated: !0,
    },
    { no: 4, name: "topic", kind: "scalar", T: 9, opt: !0 },
    { no: 8, name: "id", kind: "scalar", T: 9, opt: !0 },
    { no: 9, name: "start_time", kind: "scalar", T: 4, opt: !0 },
    { no: 10, name: "end_time", kind: "scalar", T: 4, opt: !0 },
    { no: 11, name: "nonce", kind: "scalar", T: 12 },
  ]),
  SipDTMF = proto3.makeMessageType("livekit.SipDTMF", () => [
    { no: 3, name: "code", kind: "scalar", T: 13 },
    { no: 4, name: "digit", kind: "scalar", T: 9 },
  ]),
  Transcription = proto3.makeMessageType("livekit.Transcription", () => [
    { no: 2, name: "transcribed_participant_identity", kind: "scalar", T: 9 },
    { no: 3, name: "track_id", kind: "scalar", T: 9 },
    {
      no: 4,
      name: "segments",
      kind: "message",
      T: TranscriptionSegment,
      repeated: !0,
    },
  ]),
  TranscriptionSegment = proto3.makeMessageType(
    "livekit.TranscriptionSegment",
    () => [
      { no: 1, name: "id", kind: "scalar", T: 9 },
      { no: 2, name: "text", kind: "scalar", T: 9 },
      { no: 3, name: "start_time", kind: "scalar", T: 4 },
      { no: 4, name: "end_time", kind: "scalar", T: 4 },
      { no: 5, name: "final", kind: "scalar", T: 8 },
      { no: 6, name: "language", kind: "scalar", T: 9 },
    ]
  ),
  ChatMessage = proto3.makeMessageType("livekit.ChatMessage", () => [
    { no: 1, name: "id", kind: "scalar", T: 9 },
    { no: 2, name: "timestamp", kind: "scalar", T: 3 },
    { no: 3, name: "edit_timestamp", kind: "scalar", T: 3, opt: !0 },
    { no: 4, name: "message", kind: "scalar", T: 9 },
    { no: 5, name: "deleted", kind: "scalar", T: 8 },
    { no: 6, name: "generated", kind: "scalar", T: 8 },
  ]),
  RpcRequest = proto3.makeMessageType("livekit.RpcRequest", () => [
    { no: 1, name: "id", kind: "scalar", T: 9 },
    { no: 2, name: "method", kind: "scalar", T: 9 },
    { no: 3, name: "payload", kind: "scalar", T: 9 },
    { no: 4, name: "response_timeout_ms", kind: "scalar", T: 13 },
    { no: 5, name: "version", kind: "scalar", T: 13 },
  ]),
  RpcAck = proto3.makeMessageType("livekit.RpcAck", () => [
    { no: 1, name: "request_id", kind: "scalar", T: 9 },
  ]),
  RpcResponse = proto3.makeMessageType("livekit.RpcResponse", () => [
    { no: 1, name: "request_id", kind: "scalar", T: 9 },
    { no: 2, name: "payload", kind: "scalar", T: 9, oneof: "value" },
    { no: 3, name: "error", kind: "message", T: RpcError$1, oneof: "value" },
  ]),
  RpcError$1 = proto3.makeMessageType("livekit.RpcError", () => [
    { no: 1, name: "code", kind: "scalar", T: 13 },
    { no: 2, name: "message", kind: "scalar", T: 9 },
    { no: 3, name: "data", kind: "scalar", T: 9 },
  ]),
  ParticipantTracks = proto3.makeMessageType(
    "livekit.ParticipantTracks",
    () => [
      { no: 1, name: "participant_sid", kind: "scalar", T: 9 },
      { no: 2, name: "track_sids", kind: "scalar", T: 9, repeated: !0 },
    ]
  ),
  ServerInfo = proto3.makeMessageType("livekit.ServerInfo", () => [
    {
      no: 1,
      name: "edition",
      kind: "enum",
      T: proto3.getEnumType(ServerInfo_Edition),
    },
    { no: 2, name: "version", kind: "scalar", T: 9 },
    { no: 3, name: "protocol", kind: "scalar", T: 5 },
    { no: 4, name: "region", kind: "scalar", T: 9 },
    { no: 5, name: "node_id", kind: "scalar", T: 9 },
    { no: 6, name: "debug_info", kind: "scalar", T: 9 },
    { no: 7, name: "agent_protocol", kind: "scalar", T: 5 },
  ]),
  ServerInfo_Edition = proto3.makeEnum("livekit.ServerInfo.Edition", [
    { no: 0, name: "Standard" },
    { no: 1, name: "Cloud" },
  ]),
  ClientInfo = proto3.makeMessageType("livekit.ClientInfo", () => [
    { no: 1, name: "sdk", kind: "enum", T: proto3.getEnumType(ClientInfo_SDK) },
    { no: 2, name: "version", kind: "scalar", T: 9 },
    { no: 3, name: "protocol", kind: "scalar", T: 5 },
    { no: 4, name: "os", kind: "scalar", T: 9 },
    { no: 5, name: "os_version", kind: "scalar", T: 9 },
    { no: 6, name: "device_model", kind: "scalar", T: 9 },
    { no: 7, name: "browser", kind: "scalar", T: 9 },
    { no: 8, name: "browser_version", kind: "scalar", T: 9 },
    { no: 9, name: "address", kind: "scalar", T: 9 },
    { no: 10, name: "network", kind: "scalar", T: 9 },
    { no: 11, name: "other_sdks", kind: "scalar", T: 9 },
  ]),
  ClientInfo_SDK = proto3.makeEnum("livekit.ClientInfo.SDK", [
    { no: 0, name: "UNKNOWN" },
    { no: 1, name: "JS" },
    { no: 2, name: "SWIFT" },
    { no: 3, name: "ANDROID" },
    { no: 4, name: "FLUTTER" },
    { no: 5, name: "GO" },
    { no: 6, name: "UNITY" },
    { no: 7, name: "REACT_NATIVE" },
    { no: 8, name: "RUST" },
    { no: 9, name: "PYTHON" },
    { no: 10, name: "CPP" },
    { no: 11, name: "UNITY_WEB" },
    { no: 12, name: "NODE" },
  ]),
  ClientConfiguration = proto3.makeMessageType(
    "livekit.ClientConfiguration",
    () => [
      { no: 1, name: "video", kind: "message", T: VideoConfiguration },
      { no: 2, name: "screen", kind: "message", T: VideoConfiguration },
      {
        no: 3,
        name: "resume_connection",
        kind: "enum",
        T: proto3.getEnumType(ClientConfigSetting),
      },
      { no: 4, name: "disabled_codecs", kind: "message", T: DisabledCodecs },
      {
        no: 5,
        name: "force_relay",
        kind: "enum",
        T: proto3.getEnumType(ClientConfigSetting),
      },
    ]
  ),
  VideoConfiguration = proto3.makeMessageType(
    "livekit.VideoConfiguration",
    () => [
      {
        no: 1,
        name: "hardware_encoder",
        kind: "enum",
        T: proto3.getEnumType(ClientConfigSetting),
      },
    ]
  ),
  DisabledCodecs = proto3.makeMessageType("livekit.DisabledCodecs", () => [
    { no: 1, name: "codecs", kind: "message", T: Codec, repeated: !0 },
    { no: 2, name: "publish", kind: "message", T: Codec, repeated: !0 },
  ]),
  TimedVersion = proto3.makeMessageType("livekit.TimedVersion", () => [
    { no: 1, name: "unix_micro", kind: "scalar", T: 3 },
    { no: 2, name: "ticks", kind: "scalar", T: 5 },
  ]),
  DataStream_OperationType = proto3.makeEnum(
    "livekit.DataStream.OperationType",
    [
      { no: 0, name: "CREATE" },
      { no: 1, name: "UPDATE" },
      { no: 2, name: "DELETE" },
      { no: 3, name: "REACTION" },
    ]
  ),
  DataStream_TextHeader = proto3.makeMessageType(
    "livekit.DataStream.TextHeader",
    () => [
      {
        no: 1,
        name: "operation_type",
        kind: "enum",
        T: proto3.getEnumType(DataStream_OperationType),
      },
      { no: 2, name: "version", kind: "scalar", T: 5 },
      { no: 3, name: "reply_to_stream_id", kind: "scalar", T: 9 },
      {
        no: 4,
        name: "attached_stream_ids",
        kind: "scalar",
        T: 9,
        repeated: !0,
      },
      { no: 5, name: "generated", kind: "scalar", T: 8 },
    ],
    { localName: "DataStream_TextHeader" }
  ),
  DataStream_ByteHeader = proto3.makeMessageType(
    "livekit.DataStream.ByteHeader",
    () => [{ no: 1, name: "name", kind: "scalar", T: 9 }],
    { localName: "DataStream_ByteHeader" }
  ),
  DataStream_Header = proto3.makeMessageType(
    "livekit.DataStream.Header",
    () => [
      { no: 1, name: "stream_id", kind: "scalar", T: 9 },
      { no: 2, name: "timestamp", kind: "scalar", T: 3 },
      { no: 3, name: "topic", kind: "scalar", T: 9 },
      { no: 4, name: "mime_type", kind: "scalar", T: 9 },
      { no: 5, name: "total_length", kind: "scalar", T: 4, opt: !0 },
      {
        no: 7,
        name: "encryption_type",
        kind: "enum",
        T: proto3.getEnumType(Encryption_Type),
      },
      {
        no: 8,
        name: "attributes",
        kind: "map",
        K: 9,
        V: { kind: "scalar", T: 9 },
      },
      {
        no: 9,
        name: "text_header",
        kind: "message",
        T: DataStream_TextHeader,
        oneof: "content_header",
      },
      {
        no: 10,
        name: "byte_header",
        kind: "message",
        T: DataStream_ByteHeader,
        oneof: "content_header",
      },
    ],
    { localName: "DataStream_Header" }
  ),
  DataStream_Chunk = proto3.makeMessageType(
    "livekit.DataStream.Chunk",
    () => [
      { no: 1, name: "stream_id", kind: "scalar", T: 9 },
      { no: 2, name: "chunk_index", kind: "scalar", T: 4 },
      { no: 3, name: "content", kind: "scalar", T: 12 },
      { no: 4, name: "version", kind: "scalar", T: 5 },
      { no: 5, name: "iv", kind: "scalar", T: 12, opt: !0 },
    ],
    { localName: "DataStream_Chunk" }
  ),
  DataStream_Trailer = proto3.makeMessageType(
    "livekit.DataStream.Trailer",
    () => [
      { no: 1, name: "stream_id", kind: "scalar", T: 9 },
      { no: 2, name: "reason", kind: "scalar", T: 9 },
      {
        no: 3,
        name: "attributes",
        kind: "map",
        K: 9,
        V: { kind: "scalar", T: 9 },
      },
    ],
    { localName: "DataStream_Trailer" }
  ),
  SignalTarget = proto3.makeEnum("livekit.SignalTarget", [
    { no: 0, name: "PUBLISHER" },
    { no: 1, name: "SUBSCRIBER" },
  ]),
  StreamState = proto3.makeEnum("livekit.StreamState", [
    { no: 0, name: "ACTIVE" },
    { no: 1, name: "PAUSED" },
  ]),
  CandidateProtocol = proto3.makeEnum("livekit.CandidateProtocol", [
    { no: 0, name: "UDP" },
    { no: 1, name: "TCP" },
    { no: 2, name: "TLS" },
  ]),
  SignalRequest = proto3.makeMessageType("livekit.SignalRequest", () => [
    {
      no: 1,
      name: "offer",
      kind: "message",
      T: SessionDescription,
      oneof: "message",
    },
    {
      no: 2,
      name: "answer",
      kind: "message",
      T: SessionDescription,
      oneof: "message",
    },
    {
      no: 3,
      name: "trickle",
      kind: "message",
      T: TrickleRequest,
      oneof: "message",
    },
    {
      no: 4,
      name: "add_track",
      kind: "message",
      T: AddTrackRequest,
      oneof: "message",
    },
    {
      no: 5,
      name: "mute",
      kind: "message",
      T: MuteTrackRequest,
      oneof: "message",
    },
    {
      no: 6,
      name: "subscription",
      kind: "message",
      T: UpdateSubscription,
      oneof: "message",
    },
    {
      no: 7,
      name: "track_setting",
      kind: "message",
      T: UpdateTrackSettings,
      oneof: "message",
    },
    {
      no: 8,
      name: "leave",
      kind: "message",
      T: LeaveRequest,
      oneof: "message",
    },
    {
      no: 10,
      name: "update_layers",
      kind: "message",
      T: UpdateVideoLayers,
      oneof: "message",
    },
    {
      no: 11,
      name: "subscription_permission",
      kind: "message",
      T: SubscriptionPermission,
      oneof: "message",
    },
    {
      no: 12,
      name: "sync_state",
      kind: "message",
      T: SyncState,
      oneof: "message",
    },
    {
      no: 13,
      name: "simulate",
      kind: "message",
      T: SimulateScenario,
      oneof: "message",
    },
    { no: 14, name: "ping", kind: "scalar", T: 3, oneof: "message" },
    {
      no: 15,
      name: "update_metadata",
      kind: "message",
      T: UpdateParticipantMetadata,
      oneof: "message",
    },
    { no: 16, name: "ping_req", kind: "message", T: Ping, oneof: "message" },
    {
      no: 17,
      name: "update_audio_track",
      kind: "message",
      T: UpdateLocalAudioTrack,
      oneof: "message",
    },
    {
      no: 18,
      name: "update_video_track",
      kind: "message",
      T: UpdateLocalVideoTrack,
      oneof: "message",
    },
  ]),
  SignalResponse = proto3.makeMessageType("livekit.SignalResponse", () => [
    { no: 1, name: "join", kind: "message", T: JoinResponse, oneof: "message" },
    {
      no: 2,
      name: "answer",
      kind: "message",
      T: SessionDescription,
      oneof: "message",
    },
    {
      no: 3,
      name: "offer",
      kind: "message",
      T: SessionDescription,
      oneof: "message",
    },
    {
      no: 4,
      name: "trickle",
      kind: "message",
      T: TrickleRequest,
      oneof: "message",
    },
    {
      no: 5,
      name: "update",
      kind: "message",
      T: ParticipantUpdate,
      oneof: "message",
    },
    {
      no: 6,
      name: "track_published",
      kind: "message",
      T: TrackPublishedResponse,
      oneof: "message",
    },
    {
      no: 8,
      name: "leave",
      kind: "message",
      T: LeaveRequest,
      oneof: "message",
    },
    {
      no: 9,
      name: "mute",
      kind: "message",
      T: MuteTrackRequest,
      oneof: "message",
    },
    {
      no: 10,
      name: "speakers_changed",
      kind: "message",
      T: SpeakersChanged,
      oneof: "message",
    },
    {
      no: 11,
      name: "room_update",
      kind: "message",
      T: RoomUpdate,
      oneof: "message",
    },
    {
      no: 12,
      name: "connection_quality",
      kind: "message",
      T: ConnectionQualityUpdate,
      oneof: "message",
    },
    {
      no: 13,
      name: "stream_state_update",
      kind: "message",
      T: StreamStateUpdate,
      oneof: "message",
    },
    {
      no: 14,
      name: "subscribed_quality_update",
      kind: "message",
      T: SubscribedQualityUpdate,
      oneof: "message",
    },
    {
      no: 15,
      name: "subscription_permission_update",
      kind: "message",
      T: SubscriptionPermissionUpdate,
      oneof: "message",
    },
    { no: 16, name: "refresh_token", kind: "scalar", T: 9, oneof: "message" },
    {
      no: 17,
      name: "track_unpublished",
      kind: "message",
      T: TrackUnpublishedResponse,
      oneof: "message",
    },
    { no: 18, name: "pong", kind: "scalar", T: 3, oneof: "message" },
    {
      no: 19,
      name: "reconnect",
      kind: "message",
      T: ReconnectResponse,
      oneof: "message",
    },
    { no: 20, name: "pong_resp", kind: "message", T: Pong, oneof: "message" },
    {
      no: 21,
      name: "subscription_response",
      kind: "message",
      T: SubscriptionResponse,
      oneof: "message",
    },
    {
      no: 22,
      name: "request_response",
      kind: "message",
      T: RequestResponse,
      oneof: "message",
    },
    {
      no: 23,
      name: "track_subscribed",
      kind: "message",
      T: TrackSubscribed,
      oneof: "message",
    },
  ]),
  SimulcastCodec = proto3.makeMessageType("livekit.SimulcastCodec", () => [
    { no: 1, name: "codec", kind: "scalar", T: 9 },
    { no: 2, name: "cid", kind: "scalar", T: 9 },
  ]),
  AddTrackRequest = proto3.makeMessageType("livekit.AddTrackRequest", () => [
    { no: 1, name: "cid", kind: "scalar", T: 9 },
    { no: 2, name: "name", kind: "scalar", T: 9 },
    { no: 3, name: "type", kind: "enum", T: proto3.getEnumType(TrackType) },
    { no: 4, name: "width", kind: "scalar", T: 13 },
    { no: 5, name: "height", kind: "scalar", T: 13 },
    { no: 6, name: "muted", kind: "scalar", T: 8 },
    { no: 7, name: "disable_dtx", kind: "scalar", T: 8 },
    { no: 8, name: "source", kind: "enum", T: proto3.getEnumType(TrackSource) },
    { no: 9, name: "layers", kind: "message", T: VideoLayer, repeated: !0 },
    {
      no: 10,
      name: "simulcast_codecs",
      kind: "message",
      T: SimulcastCodec,
      repeated: !0,
    },
    { no: 11, name: "sid", kind: "scalar", T: 9 },
    { no: 12, name: "stereo", kind: "scalar", T: 8 },
    { no: 13, name: "disable_red", kind: "scalar", T: 8 },
    {
      no: 14,
      name: "encryption",
      kind: "enum",
      T: proto3.getEnumType(Encryption_Type),
    },
    { no: 15, name: "stream", kind: "scalar", T: 9 },
    {
      no: 16,
      name: "backup_codec_policy",
      kind: "enum",
      T: proto3.getEnumType(BackupCodecPolicy$1),
    },
  ]),
  TrickleRequest = proto3.makeMessageType("livekit.TrickleRequest", () => [
    { no: 1, name: "candidateInit", kind: "scalar", T: 9 },
    {
      no: 2,
      name: "target",
      kind: "enum",
      T: proto3.getEnumType(SignalTarget),
    },
    { no: 3, name: "final", kind: "scalar", T: 8 },
  ]),
  MuteTrackRequest = proto3.makeMessageType("livekit.MuteTrackRequest", () => [
    { no: 1, name: "sid", kind: "scalar", T: 9 },
    { no: 2, name: "muted", kind: "scalar", T: 8 },
  ]),
  JoinResponse = proto3.makeMessageType("livekit.JoinResponse", () => [
    { no: 1, name: "room", kind: "message", T: Room$1 },
    { no: 2, name: "participant", kind: "message", T: ParticipantInfo },
    {
      no: 3,
      name: "other_participants",
      kind: "message",
      T: ParticipantInfo,
      repeated: !0,
    },
    { no: 4, name: "server_version", kind: "scalar", T: 9 },
    { no: 5, name: "ice_servers", kind: "message", T: ICEServer, repeated: !0 },
    { no: 6, name: "subscriber_primary", kind: "scalar", T: 8 },
    { no: 7, name: "alternative_url", kind: "scalar", T: 9 },
    {
      no: 8,
      name: "client_configuration",
      kind: "message",
      T: ClientConfiguration,
    },
    { no: 9, name: "server_region", kind: "scalar", T: 9 },
    { no: 10, name: "ping_timeout", kind: "scalar", T: 5 },
    { no: 11, name: "ping_interval", kind: "scalar", T: 5 },
    { no: 12, name: "server_info", kind: "message", T: ServerInfo },
    { no: 13, name: "sif_trailer", kind: "scalar", T: 12 },
    {
      no: 14,
      name: "enabled_publish_codecs",
      kind: "message",
      T: Codec,
      repeated: !0,
    },
    { no: 15, name: "fast_publish", kind: "scalar", T: 8 },
  ]),
  ReconnectResponse = proto3.makeMessageType(
    "livekit.ReconnectResponse",
    () => [
      {
        no: 1,
        name: "ice_servers",
        kind: "message",
        T: ICEServer,
        repeated: !0,
      },
      {
        no: 2,
        name: "client_configuration",
        kind: "message",
        T: ClientConfiguration,
      },
    ]
  ),
  TrackPublishedResponse = proto3.makeMessageType(
    "livekit.TrackPublishedResponse",
    () => [
      { no: 1, name: "cid", kind: "scalar", T: 9 },
      { no: 2, name: "track", kind: "message", T: TrackInfo },
    ]
  ),
  TrackUnpublishedResponse = proto3.makeMessageType(
    "livekit.TrackUnpublishedResponse",
    () => [{ no: 1, name: "track_sid", kind: "scalar", T: 9 }]
  ),
  SessionDescription = proto3.makeMessageType(
    "livekit.SessionDescription",
    () => [
      { no: 1, name: "type", kind: "scalar", T: 9 },
      { no: 2, name: "sdp", kind: "scalar", T: 9 },
    ]
  ),
  ParticipantUpdate = proto3.makeMessageType(
    "livekit.ParticipantUpdate",
    () => [
      {
        no: 1,
        name: "participants",
        kind: "message",
        T: ParticipantInfo,
        repeated: !0,
      },
    ]
  ),
  UpdateSubscription = proto3.makeMessageType(
    "livekit.UpdateSubscription",
    () => [
      { no: 1, name: "track_sids", kind: "scalar", T: 9, repeated: !0 },
      { no: 2, name: "subscribe", kind: "scalar", T: 8 },
      {
        no: 3,
        name: "participant_tracks",
        kind: "message",
        T: ParticipantTracks,
        repeated: !0,
      },
    ]
  ),
  UpdateTrackSettings = proto3.makeMessageType(
    "livekit.UpdateTrackSettings",
    () => [
      { no: 1, name: "track_sids", kind: "scalar", T: 9, repeated: !0 },
      { no: 3, name: "disabled", kind: "scalar", T: 8 },
      {
        no: 4,
        name: "quality",
        kind: "enum",
        T: proto3.getEnumType(VideoQuality$1),
      },
      { no: 5, name: "width", kind: "scalar", T: 13 },
      { no: 6, name: "height", kind: "scalar", T: 13 },
      { no: 7, name: "fps", kind: "scalar", T: 13 },
      { no: 8, name: "priority", kind: "scalar", T: 13 },
    ]
  ),
  UpdateLocalAudioTrack = proto3.makeMessageType(
    "livekit.UpdateLocalAudioTrack",
    () => [
      { no: 1, name: "track_sid", kind: "scalar", T: 9 },
      {
        no: 2,
        name: "features",
        kind: "enum",
        T: proto3.getEnumType(AudioTrackFeature),
        repeated: !0,
      },
    ]
  ),
  UpdateLocalVideoTrack = proto3.makeMessageType(
    "livekit.UpdateLocalVideoTrack",
    () => [
      { no: 1, name: "track_sid", kind: "scalar", T: 9 },
      { no: 2, name: "width", kind: "scalar", T: 13 },
      { no: 3, name: "height", kind: "scalar", T: 13 },
    ]
  ),
  LeaveRequest = proto3.makeMessageType("livekit.LeaveRequest", () => [
    { no: 1, name: "can_reconnect", kind: "scalar", T: 8 },
    {
      no: 2,
      name: "reason",
      kind: "enum",
      T: proto3.getEnumType(DisconnectReason),
    },
    {
      no: 3,
      name: "action",
      kind: "enum",
      T: proto3.getEnumType(LeaveRequest_Action),
    },
    { no: 4, name: "regions", kind: "message", T: RegionSettings },
  ]),
  LeaveRequest_Action = proto3.makeEnum("livekit.LeaveRequest.Action", [
    { no: 0, name: "DISCONNECT" },
    { no: 1, name: "RESUME" },
    { no: 2, name: "RECONNECT" },
  ]),
  UpdateVideoLayers = proto3.makeMessageType(
    "livekit.UpdateVideoLayers",
    () => [
      { no: 1, name: "track_sid", kind: "scalar", T: 9 },
      { no: 2, name: "layers", kind: "message", T: VideoLayer, repeated: !0 },
    ]
  ),
  UpdateParticipantMetadata = proto3.makeMessageType(
    "livekit.UpdateParticipantMetadata",
    () => [
      { no: 1, name: "metadata", kind: "scalar", T: 9 },
      { no: 2, name: "name", kind: "scalar", T: 9 },
      {
        no: 3,
        name: "attributes",
        kind: "map",
        K: 9,
        V: { kind: "scalar", T: 9 },
      },
      { no: 4, name: "request_id", kind: "scalar", T: 13 },
    ]
  ),
  ICEServer = proto3.makeMessageType("livekit.ICEServer", () => [
    { no: 1, name: "urls", kind: "scalar", T: 9, repeated: !0 },
    { no: 2, name: "username", kind: "scalar", T: 9 },
    { no: 3, name: "credential", kind: "scalar", T: 9 },
  ]),
  SpeakersChanged = proto3.makeMessageType("livekit.SpeakersChanged", () => [
    { no: 1, name: "speakers", kind: "message", T: SpeakerInfo, repeated: !0 },
  ]),
  RoomUpdate = proto3.makeMessageType("livekit.RoomUpdate", () => [
    { no: 1, name: "room", kind: "message", T: Room$1 },
  ]),
  ConnectionQualityInfo = proto3.makeMessageType(
    "livekit.ConnectionQualityInfo",
    () => [
      { no: 1, name: "participant_sid", kind: "scalar", T: 9 },
      {
        no: 2,
        name: "quality",
        kind: "enum",
        T: proto3.getEnumType(ConnectionQuality$1),
      },
      { no: 3, name: "score", kind: "scalar", T: 2 },
    ]
  ),
  ConnectionQualityUpdate = proto3.makeMessageType(
    "livekit.ConnectionQualityUpdate",
    () => [
      {
        no: 1,
        name: "updates",
        kind: "message",
        T: ConnectionQualityInfo,
        repeated: !0,
      },
    ]
  ),
  StreamStateInfo = proto3.makeMessageType("livekit.StreamStateInfo", () => [
    { no: 1, name: "participant_sid", kind: "scalar", T: 9 },
    { no: 2, name: "track_sid", kind: "scalar", T: 9 },
    { no: 3, name: "state", kind: "enum", T: proto3.getEnumType(StreamState) },
  ]),
  StreamStateUpdate = proto3.makeMessageType(
    "livekit.StreamStateUpdate",
    () => [
      {
        no: 1,
        name: "stream_states",
        kind: "message",
        T: StreamStateInfo,
        repeated: !0,
      },
    ]
  ),
  SubscribedQuality = proto3.makeMessageType(
    "livekit.SubscribedQuality",
    () => [
      {
        no: 1,
        name: "quality",
        kind: "enum",
        T: proto3.getEnumType(VideoQuality$1),
      },
      { no: 2, name: "enabled", kind: "scalar", T: 8 },
    ]
  ),
  SubscribedCodec = proto3.makeMessageType("livekit.SubscribedCodec", () => [
    { no: 1, name: "codec", kind: "scalar", T: 9 },
    {
      no: 2,
      name: "qualities",
      kind: "message",
      T: SubscribedQuality,
      repeated: !0,
    },
  ]),
  SubscribedQualityUpdate = proto3.makeMessageType(
    "livekit.SubscribedQualityUpdate",
    () => [
      { no: 1, name: "track_sid", kind: "scalar", T: 9 },
      {
        no: 2,
        name: "subscribed_qualities",
        kind: "message",
        T: SubscribedQuality,
        repeated: !0,
      },
      {
        no: 3,
        name: "subscribed_codecs",
        kind: "message",
        T: SubscribedCodec,
        repeated: !0,
      },
    ]
  ),
  TrackPermission = proto3.makeMessageType("livekit.TrackPermission", () => [
    { no: 1, name: "participant_sid", kind: "scalar", T: 9 },
    { no: 2, name: "all_tracks", kind: "scalar", T: 8 },
    { no: 3, name: "track_sids", kind: "scalar", T: 9, repeated: !0 },
    { no: 4, name: "participant_identity", kind: "scalar", T: 9 },
  ]),
  SubscriptionPermission = proto3.makeMessageType(
    "livekit.SubscriptionPermission",
    () => [
      { no: 1, name: "all_participants", kind: "scalar", T: 8 },
      {
        no: 2,
        name: "track_permissions",
        kind: "message",
        T: TrackPermission,
        repeated: !0,
      },
    ]
  ),
  SubscriptionPermissionUpdate = proto3.makeMessageType(
    "livekit.SubscriptionPermissionUpdate",
    () => [
      { no: 1, name: "participant_sid", kind: "scalar", T: 9 },
      { no: 2, name: "track_sid", kind: "scalar", T: 9 },
      { no: 3, name: "allowed", kind: "scalar", T: 8 },
    ]
  ),
  SyncState = proto3.makeMessageType("livekit.SyncState", () => [
    { no: 1, name: "answer", kind: "message", T: SessionDescription },
    { no: 2, name: "subscription", kind: "message", T: UpdateSubscription },
    {
      no: 3,
      name: "publish_tracks",
      kind: "message",
      T: TrackPublishedResponse,
      repeated: !0,
    },
    {
      no: 4,
      name: "data_channels",
      kind: "message",
      T: DataChannelInfo,
      repeated: !0,
    },
    { no: 5, name: "offer", kind: "message", T: SessionDescription },
    { no: 6, name: "track_sids_disabled", kind: "scalar", T: 9, repeated: !0 },
  ]),
  DataChannelInfo = proto3.makeMessageType("livekit.DataChannelInfo", () => [
    { no: 1, name: "label", kind: "scalar", T: 9 },
    { no: 2, name: "id", kind: "scalar", T: 13 },
    {
      no: 3,
      name: "target",
      kind: "enum",
      T: proto3.getEnumType(SignalTarget),
    },
  ]),
  SimulateScenario = proto3.makeMessageType("livekit.SimulateScenario", () => [
    { no: 1, name: "speaker_update", kind: "scalar", T: 5, oneof: "scenario" },
    { no: 2, name: "node_failure", kind: "scalar", T: 8, oneof: "scenario" },
    { no: 3, name: "migration", kind: "scalar", T: 8, oneof: "scenario" },
    { no: 4, name: "server_leave", kind: "scalar", T: 8, oneof: "scenario" },
    {
      no: 5,
      name: "switch_candidate_protocol",
      kind: "enum",
      T: proto3.getEnumType(CandidateProtocol),
      oneof: "scenario",
    },
    {
      no: 6,
      name: "subscriber_bandwidth",
      kind: "scalar",
      T: 3,
      oneof: "scenario",
    },
    {
      no: 7,
      name: "disconnect_signal_on_resume",
      kind: "scalar",
      T: 8,
      oneof: "scenario",
    },
    {
      no: 8,
      name: "disconnect_signal_on_resume_no_messages",
      kind: "scalar",
      T: 8,
      oneof: "scenario",
    },
    {
      no: 9,
      name: "leave_request_full_reconnect",
      kind: "scalar",
      T: 8,
      oneof: "scenario",
    },
  ]),
  Ping = proto3.makeMessageType("livekit.Ping", () => [
    { no: 1, name: "timestamp", kind: "scalar", T: 3 },
    { no: 2, name: "rtt", kind: "scalar", T: 3 },
  ]),
  Pong = proto3.makeMessageType("livekit.Pong", () => [
    { no: 1, name: "last_ping_timestamp", kind: "scalar", T: 3 },
    { no: 2, name: "timestamp", kind: "scalar", T: 3 },
  ]),
  RegionSettings = proto3.makeMessageType("livekit.RegionSettings", () => [
    { no: 1, name: "regions", kind: "message", T: RegionInfo, repeated: !0 },
  ]),
  RegionInfo = proto3.makeMessageType("livekit.RegionInfo", () => [
    { no: 1, name: "region", kind: "scalar", T: 9 },
    { no: 2, name: "url", kind: "scalar", T: 9 },
    { no: 3, name: "distance", kind: "scalar", T: 3 },
  ]),
  SubscriptionResponse = proto3.makeMessageType(
    "livekit.SubscriptionResponse",
    () => [
      { no: 1, name: "track_sid", kind: "scalar", T: 9 },
      {
        no: 2,
        name: "err",
        kind: "enum",
        T: proto3.getEnumType(SubscriptionError),
      },
    ]
  ),
  RequestResponse = proto3.makeMessageType("livekit.RequestResponse", () => [
    { no: 1, name: "request_id", kind: "scalar", T: 13 },
    {
      no: 2,
      name: "reason",
      kind: "enum",
      T: proto3.getEnumType(RequestResponse_Reason),
    },
    { no: 3, name: "message", kind: "scalar", T: 9 },
  ]),
  RequestResponse_Reason = proto3.makeEnum("livekit.RequestResponse.Reason", [
    { no: 0, name: "OK" },
    { no: 1, name: "NOT_FOUND" },
    { no: 2, name: "NOT_ALLOWED" },
    { no: 3, name: "LIMIT_EXCEEDED" },
  ]),
  TrackSubscribed = proto3.makeMessageType("livekit.TrackSubscribed", () => [
    { no: 1, name: "track_sid", kind: "scalar", T: 9 },
  ]);
function getDefaultExportFromCjs$1(q) {
  return q && q.__esModule && Object.prototype.hasOwnProperty.call(q, "default")
    ? q.default
    : q;
}
var loglevel$1 = { exports: {} },
  loglevel = loglevel$1.exports,
  hasRequiredLoglevel;
function requireLoglevel() {
  return (
    hasRequiredLoglevel ||
      ((hasRequiredLoglevel = 1),
      (function (q) {
        (function (U, F) {
          q.exports ? (q.exports = F()) : (U.log = F());
        })(loglevel, function () {
          var U = function () {},
            F = "undefined",
            B =
              typeof window !== F &&
              typeof window.navigator !== F &&
              /Trident\/|MSIE /.test(window.navigator.userAgent),
            V = ["trace", "debug", "info", "warn", "error"],
            j = {},
            $ = null;
          function W(Z, ie) {
            var ee = Z[ie];
            if (typeof ee.bind == "function") return ee.bind(Z);
            try {
              return Function.prototype.bind.call(ee, Z);
            } catch {
              return function () {
                return Function.prototype.apply.apply(ee, [Z, arguments]);
              };
            }
          }
          function K() {
            console.log &&
              (console.log.apply
                ? console.log.apply(console, arguments)
                : Function.prototype.apply.apply(console.log, [
                    console,
                    arguments,
                  ])),
              console.trace && console.trace();
          }
          function G(Z) {
            return (
              Z === "debug" && (Z = "log"),
              typeof console === F
                ? !1
                : Z === "trace" && B
                ? K
                : console[Z] !== void 0
                ? W(console, Z)
                : console.log !== void 0
                ? W(console, "log")
                : U
            );
          }
          function Q() {
            for (var Z = this.getLevel(), ie = 0; ie < V.length; ie++) {
              var ee = V[ie];
              this[ee] = ie < Z ? U : this.methodFactory(ee, Z, this.name);
            }
            if (
              ((this.log = this.debug),
              typeof console === F && Z < this.levels.SILENT)
            )
              return "No console available for logging";
          }
          function z(Z) {
            return function () {
              typeof console !== F &&
                (Q.call(this), this[Z].apply(this, arguments));
            };
          }
          function H(Z, ie, ee) {
            return G(Z) || z.apply(this, arguments);
          }
          function Y(Z, ie) {
            var ee = this,
              te,
              re,
              ne,
              se = "loglevel";
            typeof Z == "string"
              ? (se += ":" + Z)
              : typeof Z == "symbol" && (se = void 0);
            function oe(ue) {
              var Te = (V[ue] || "silent").toUpperCase();
              if (!(typeof window === F || !se)) {
                try {
                  window.localStorage[se] = Te;
                  return;
                } catch {}
                try {
                  window.document.cookie =
                    encodeURIComponent(se) + "=" + Te + ";";
                } catch {}
              }
            }
            function le() {
              var ue;
              if (!(typeof window === F || !se)) {
                try {
                  ue = window.localStorage[se];
                } catch {}
                if (typeof ue === F)
                  try {
                    var Te = window.document.cookie,
                      we = encodeURIComponent(se),
                      me = Te.indexOf(we + "=");
                    me !== -1 &&
                      (ue = /^([^;]+)/.exec(Te.slice(me + we.length + 1))[1]);
                  } catch {}
                return ee.levels[ue] === void 0 && (ue = void 0), ue;
              }
            }
            function fe() {
              if (!(typeof window === F || !se)) {
                try {
                  window.localStorage.removeItem(se);
                } catch {}
                try {
                  window.document.cookie =
                    encodeURIComponent(se) +
                    "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                } catch {}
              }
            }
            function pe(ue) {
              var Te = ue;
              if (
                (typeof Te == "string" &&
                  ee.levels[Te.toUpperCase()] !== void 0 &&
                  (Te = ee.levels[Te.toUpperCase()]),
                typeof Te == "number" && Te >= 0 && Te <= ee.levels.SILENT)
              )
                return Te;
              throw new TypeError(
                "log.setLevel() called with invalid level: " + ue
              );
            }
            (ee.name = Z),
              (ee.levels = {
                TRACE: 0,
                DEBUG: 1,
                INFO: 2,
                WARN: 3,
                ERROR: 4,
                SILENT: 5,
              }),
              (ee.methodFactory = ie || H),
              (ee.getLevel = function () {
                return ne ?? re ?? te;
              }),
              (ee.setLevel = function (ue, Te) {
                return (ne = pe(ue)), Te !== !1 && oe(ne), Q.call(ee);
              }),
              (ee.setDefaultLevel = function (ue) {
                (re = pe(ue)), le() || ee.setLevel(ue, !1);
              }),
              (ee.resetLevel = function () {
                (ne = null), fe(), Q.call(ee);
              }),
              (ee.enableAll = function (ue) {
                ee.setLevel(ee.levels.TRACE, ue);
              }),
              (ee.disableAll = function (ue) {
                ee.setLevel(ee.levels.SILENT, ue);
              }),
              (ee.rebuild = function () {
                if (($ !== ee && (te = pe($.getLevel())), Q.call(ee), $ === ee))
                  for (var ue in j) j[ue].rebuild();
              }),
              (te = pe($ ? $.getLevel() : "WARN"));
            var he = le();
            he != null && (ne = pe(he)), Q.call(ee);
          }
          ($ = new Y()),
            ($.getLogger = function (ie) {
              if ((typeof ie != "symbol" && typeof ie != "string") || ie === "")
                throw new TypeError(
                  "You must supply a name when creating a logger."
                );
              var ee = j[ie];
              return ee || (ee = j[ie] = new Y(ie, $.methodFactory)), ee;
            });
          var X = typeof window !== F ? window.log : void 0;
          return (
            ($.noConflict = function () {
              return (
                typeof window !== F && window.log === $ && (window.log = X), $
              );
            }),
            ($.getLoggers = function () {
              return j;
            }),
            ($.default = $),
            $
          );
        });
      })(loglevel$1)),
    loglevel$1.exports
  );
}
var loglevelExports = requireLoglevel(),
  LogLevel;
(function (q) {
  (q[(q.trace = 0)] = "trace"),
    (q[(q.debug = 1)] = "debug"),
    (q[(q.info = 2)] = "info"),
    (q[(q.warn = 3)] = "warn"),
    (q[(q.error = 4)] = "error"),
    (q[(q.silent = 5)] = "silent");
})(LogLevel || (LogLevel = {}));
var LoggerNames;
(function (q) {
  (q.Default = "livekit"),
    (q.Room = "livekit-room"),
    (q.Participant = "livekit-participant"),
    (q.Track = "livekit-track"),
    (q.Publication = "livekit-track-publication"),
    (q.Engine = "livekit-engine"),
    (q.Signal = "livekit-signal"),
    (q.PCManager = "livekit-pc-manager"),
    (q.PCTransport = "livekit-pc-transport"),
    (q.E2EE = "lk-e2ee");
})(LoggerNames || (LoggerNames = {}));
let livekitLogger = loglevelExports.getLogger("livekit");
Object.values(LoggerNames).map((q) => loglevelExports.getLogger(q));
livekitLogger.setDefaultLevel(LogLevel.info);
function getLogger(q) {
  const U = loglevelExports.getLogger(q);
  return U.setDefaultLevel(livekitLogger.getLevel()), U;
}
const workerLogger = loglevelExports.getLogger("lk-e2ee"),
  maxRetryDelay = 7e3,
  DEFAULT_RETRY_DELAYS_IN_MS = [
    0,
    300,
    2 * 2 * 300,
    3 * 3 * 300,
    4 * 4 * 300,
    maxRetryDelay,
    maxRetryDelay,
    maxRetryDelay,
    maxRetryDelay,
    maxRetryDelay,
  ];
class DefaultReconnectPolicy {
  constructor(U) {
    this._retryDelays = U !== void 0 ? [...U] : DEFAULT_RETRY_DELAYS_IN_MS;
  }
  nextRetryDelayInMs(U) {
    if (U.retryCount >= this._retryDelays.length) return null;
    const F = this._retryDelays[U.retryCount];
    return U.retryCount <= 1 ? F : F + Math.random() * 1e3;
  }
}
function __rest(q, U) {
  var F = {};
  for (var B in q)
    Object.prototype.hasOwnProperty.call(q, B) &&
      U.indexOf(B) < 0 &&
      (F[B] = q[B]);
  if (q != null && typeof Object.getOwnPropertySymbols == "function")
    for (var V = 0, B = Object.getOwnPropertySymbols(q); V < B.length; V++)
      U.indexOf(B[V]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(q, B[V]) &&
        (F[B[V]] = q[B[V]]);
  return F;
}
function __awaiter$1(q, U, F, B) {
  function V(j) {
    return j instanceof F
      ? j
      : new F(function ($) {
          $(j);
        });
  }
  return new (F || (F = Promise))(function (j, $) {
    function W(Q) {
      try {
        G(B.next(Q));
      } catch (z) {
        $(z);
      }
    }
    function K(Q) {
      try {
        G(B.throw(Q));
      } catch (z) {
        $(z);
      }
    }
    function G(Q) {
      Q.done ? j(Q.value) : V(Q.value).then(W, K);
    }
    G((B = B.apply(q, U || [])).next());
  });
}
function __values(q) {
  var U = typeof Symbol == "function" && Symbol.iterator,
    F = U && q[U],
    B = 0;
  if (F) return F.call(q);
  if (q && typeof q.length == "number")
    return {
      next: function () {
        return (
          q && B >= q.length && (q = void 0), { value: q && q[B++], done: !q }
        );
      },
    };
  throw new TypeError(
    U ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function __asyncValues(q) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var U = q[Symbol.asyncIterator],
    F;
  return U
    ? U.call(q)
    : ((q = typeof __values == "function" ? __values(q) : q[Symbol.iterator]()),
      (F = {}),
      B("next"),
      B("throw"),
      B("return"),
      (F[Symbol.asyncIterator] = function () {
        return this;
      }),
      F);
  function B(j) {
    F[j] =
      q[j] &&
      function ($) {
        return new Promise(function (W, K) {
          ($ = q[j]($)), V(W, K, $.done, $.value);
        });
      };
  }
  function V(j, $, W, K) {
    Promise.resolve(K).then(function (G) {
      j({ value: G, done: W });
    }, $);
  }
}
typeof SuppressedError == "function" && SuppressedError;
var events = { exports: {} },
  hasRequiredEvents;
function requireEvents() {
  if (hasRequiredEvents) return events.exports;
  hasRequiredEvents = 1;
  var q = typeof Reflect == "object" ? Reflect : null,
    U =
      q && typeof q.apply == "function"
        ? q.apply
        : function (se, oe, le) {
            return Function.prototype.apply.call(se, oe, le);
          },
    F;
  q && typeof q.ownKeys == "function"
    ? (F = q.ownKeys)
    : Object.getOwnPropertySymbols
    ? (F = function (se) {
        return Object.getOwnPropertyNames(se).concat(
          Object.getOwnPropertySymbols(se)
        );
      })
    : (F = function (se) {
        return Object.getOwnPropertyNames(se);
      });
  function B(ne) {
    console && console.warn && console.warn(ne);
  }
  var V =
    Number.isNaN ||
    function (se) {
      return se !== se;
    };
  function j() {
    j.init.call(this);
  }
  (events.exports = j),
    (events.exports.once = ee),
    (j.EventEmitter = j),
    (j.prototype._events = void 0),
    (j.prototype._eventsCount = 0),
    (j.prototype._maxListeners = void 0);
  var $ = 10;
  function W(ne) {
    if (typeof ne != "function")
      throw new TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof ne
      );
  }
  Object.defineProperty(j, "defaultMaxListeners", {
    enumerable: !0,
    get: function () {
      return $;
    },
    set: function (ne) {
      if (typeof ne != "number" || ne < 0 || V(ne))
        throw new RangeError(
          'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
            ne +
            "."
        );
      $ = ne;
    },
  }),
    (j.init = function () {
      (this._events === void 0 ||
        this._events === Object.getPrototypeOf(this)._events) &&
        ((this._events = Object.create(null)), (this._eventsCount = 0)),
        (this._maxListeners = this._maxListeners || void 0);
    }),
    (j.prototype.setMaxListeners = function (se) {
      if (typeof se != "number" || se < 0 || V(se))
        throw new RangeError(
          'The value of "n" is out of range. It must be a non-negative number. Received ' +
            se +
            "."
        );
      return (this._maxListeners = se), this;
    });
  function K(ne) {
    return ne._maxListeners === void 0
      ? j.defaultMaxListeners
      : ne._maxListeners;
  }
  (j.prototype.getMaxListeners = function () {
    return K(this);
  }),
    (j.prototype.emit = function (se) {
      for (var oe = [], le = 1; le < arguments.length; le++)
        oe.push(arguments[le]);
      var fe = se === "error",
        pe = this._events;
      if (pe !== void 0) fe = fe && pe.error === void 0;
      else if (!fe) return !1;
      if (fe) {
        var he;
        if ((oe.length > 0 && (he = oe[0]), he instanceof Error)) throw he;
        var ue = new Error(
          "Unhandled error." + (he ? " (" + he.message + ")" : "")
        );
        throw ((ue.context = he), ue);
      }
      var Te = pe[se];
      if (Te === void 0) return !1;
      if (typeof Te == "function") U(Te, this, oe);
      else
        for (var we = Te.length, me = X(Te, we), le = 0; le < we; ++le)
          U(me[le], this, oe);
      return !0;
    });
  function G(ne, se, oe, le) {
    var fe, pe, he;
    if (
      (W(oe),
      (pe = ne._events),
      pe === void 0
        ? ((pe = ne._events = Object.create(null)), (ne._eventsCount = 0))
        : (pe.newListener !== void 0 &&
            (ne.emit("newListener", se, oe.listener ? oe.listener : oe),
            (pe = ne._events)),
          (he = pe[se])),
      he === void 0)
    )
      (he = pe[se] = oe), ++ne._eventsCount;
    else if (
      (typeof he == "function"
        ? (he = pe[se] = le ? [oe, he] : [he, oe])
        : le
        ? he.unshift(oe)
        : he.push(oe),
      (fe = K(ne)),
      fe > 0 && he.length > fe && !he.warned)
    ) {
      he.warned = !0;
      var ue = new Error(
        "Possible EventEmitter memory leak detected. " +
          he.length +
          " " +
          String(se) +
          " listeners added. Use emitter.setMaxListeners() to increase limit"
      );
      (ue.name = "MaxListenersExceededWarning"),
        (ue.emitter = ne),
        (ue.type = se),
        (ue.count = he.length),
        B(ue);
    }
    return ne;
  }
  (j.prototype.addListener = function (se, oe) {
    return G(this, se, oe, !1);
  }),
    (j.prototype.on = j.prototype.addListener),
    (j.prototype.prependListener = function (se, oe) {
      return G(this, se, oe, !0);
    });
  function Q() {
    if (!this.fired)
      return (
        this.target.removeListener(this.type, this.wrapFn),
        (this.fired = !0),
        arguments.length === 0
          ? this.listener.call(this.target)
          : this.listener.apply(this.target, arguments)
      );
  }
  function z(ne, se, oe) {
    var le = { fired: !1, wrapFn: void 0, target: ne, type: se, listener: oe },
      fe = Q.bind(le);
    return (fe.listener = oe), (le.wrapFn = fe), fe;
  }
  (j.prototype.once = function (se, oe) {
    return W(oe), this.on(se, z(this, se, oe)), this;
  }),
    (j.prototype.prependOnceListener = function (se, oe) {
      return W(oe), this.prependListener(se, z(this, se, oe)), this;
    }),
    (j.prototype.removeListener = function (se, oe) {
      var le, fe, pe, he, ue;
      if ((W(oe), (fe = this._events), fe === void 0)) return this;
      if (((le = fe[se]), le === void 0)) return this;
      if (le === oe || le.listener === oe)
        --this._eventsCount === 0
          ? (this._events = Object.create(null))
          : (delete fe[se],
            fe.removeListener &&
              this.emit("removeListener", se, le.listener || oe));
      else if (typeof le != "function") {
        for (pe = -1, he = le.length - 1; he >= 0; he--)
          if (le[he] === oe || le[he].listener === oe) {
            (ue = le[he].listener), (pe = he);
            break;
          }
        if (pe < 0) return this;
        pe === 0 ? le.shift() : Z(le, pe),
          le.length === 1 && (fe[se] = le[0]),
          fe.removeListener !== void 0 &&
            this.emit("removeListener", se, ue || oe);
      }
      return this;
    }),
    (j.prototype.off = j.prototype.removeListener),
    (j.prototype.removeAllListeners = function (se) {
      var oe, le, fe;
      if (((le = this._events), le === void 0)) return this;
      if (le.removeListener === void 0)
        return (
          arguments.length === 0
            ? ((this._events = Object.create(null)), (this._eventsCount = 0))
            : le[se] !== void 0 &&
              (--this._eventsCount === 0
                ? (this._events = Object.create(null))
                : delete le[se]),
          this
        );
      if (arguments.length === 0) {
        var pe = Object.keys(le),
          he;
        for (fe = 0; fe < pe.length; ++fe)
          (he = pe[fe]), he !== "removeListener" && this.removeAllListeners(he);
        return (
          this.removeAllListeners("removeListener"),
          (this._events = Object.create(null)),
          (this._eventsCount = 0),
          this
        );
      }
      if (((oe = le[se]), typeof oe == "function")) this.removeListener(se, oe);
      else if (oe !== void 0)
        for (fe = oe.length - 1; fe >= 0; fe--) this.removeListener(se, oe[fe]);
      return this;
    });
  function H(ne, se, oe) {
    var le = ne._events;
    if (le === void 0) return [];
    var fe = le[se];
    return fe === void 0
      ? []
      : typeof fe == "function"
      ? oe
        ? [fe.listener || fe]
        : [fe]
      : oe
      ? ie(fe)
      : X(fe, fe.length);
  }
  (j.prototype.listeners = function (se) {
    return H(this, se, !0);
  }),
    (j.prototype.rawListeners = function (se) {
      return H(this, se, !1);
    }),
    (j.listenerCount = function (ne, se) {
      return typeof ne.listenerCount == "function"
        ? ne.listenerCount(se)
        : Y.call(ne, se);
    }),
    (j.prototype.listenerCount = Y);
  function Y(ne) {
    var se = this._events;
    if (se !== void 0) {
      var oe = se[ne];
      if (typeof oe == "function") return 1;
      if (oe !== void 0) return oe.length;
    }
    return 0;
  }
  j.prototype.eventNames = function () {
    return this._eventsCount > 0 ? F(this._events) : [];
  };
  function X(ne, se) {
    for (var oe = new Array(se), le = 0; le < se; ++le) oe[le] = ne[le];
    return oe;
  }
  function Z(ne, se) {
    for (; se + 1 < ne.length; se++) ne[se] = ne[se + 1];
    ne.pop();
  }
  function ie(ne) {
    for (var se = new Array(ne.length), oe = 0; oe < se.length; ++oe)
      se[oe] = ne[oe].listener || ne[oe];
    return se;
  }
  function ee(ne, se) {
    return new Promise(function (oe, le) {
      function fe(he) {
        ne.removeListener(se, pe), le(he);
      }
      function pe() {
        typeof ne.removeListener == "function" &&
          ne.removeListener("error", fe),
          oe([].slice.call(arguments));
      }
      re(ne, se, pe, { once: !0 }), se !== "error" && te(ne, fe, { once: !0 });
    });
  }
  function te(ne, se, oe) {
    typeof ne.on == "function" && re(ne, "error", se, oe);
  }
  function re(ne, se, oe, le) {
    if (typeof ne.on == "function") le.once ? ne.once(se, oe) : ne.on(se, oe);
    else if (typeof ne.addEventListener == "function")
      ne.addEventListener(se, function fe(pe) {
        le.once && ne.removeEventListener(se, fe), oe(pe);
      });
    else
      throw new TypeError(
        'The "emitter" argument must be of type EventEmitter. Received type ' +
          typeof ne
      );
  }
  return events.exports;
}
var eventsExports = requireEvents();
let logDisabled_ = !0,
  deprecationWarnings_ = !0;
function extractVersion(q, U, F) {
  const B = q.match(U);
  return B && B.length >= F && parseInt(B[F], 10);
}
function wrapPeerConnectionEvent(q, U, F) {
  if (!q.RTCPeerConnection) return;
  const B = q.RTCPeerConnection.prototype,
    V = B.addEventListener;
  B.addEventListener = function ($, W) {
    if ($ !== U) return V.apply(this, arguments);
    const K = (G) => {
      const Q = F(G);
      Q && (W.handleEvent ? W.handleEvent(Q) : W(Q));
    };
    return (
      (this._eventMap = this._eventMap || {}),
      this._eventMap[U] || (this._eventMap[U] = new Map()),
      this._eventMap[U].set(W, K),
      V.apply(this, [$, K])
    );
  };
  const j = B.removeEventListener;
  (B.removeEventListener = function ($, W) {
    if ($ !== U || !this._eventMap || !this._eventMap[U])
      return j.apply(this, arguments);
    if (!this._eventMap[U].has(W)) return j.apply(this, arguments);
    const K = this._eventMap[U].get(W);
    return (
      this._eventMap[U].delete(W),
      this._eventMap[U].size === 0 && delete this._eventMap[U],
      Object.keys(this._eventMap).length === 0 && delete this._eventMap,
      j.apply(this, [$, K])
    );
  }),
    Object.defineProperty(B, "on" + U, {
      get() {
        return this["_on" + U];
      },
      set($) {
        this["_on" + U] &&
          (this.removeEventListener(U, this["_on" + U]),
          delete this["_on" + U]),
          $ && this.addEventListener(U, (this["_on" + U] = $));
      },
      enumerable: !0,
      configurable: !0,
    });
}
function disableLog(q) {
  return typeof q != "boolean"
    ? new Error("Argument type: " + typeof q + ". Please use a boolean.")
    : ((logDisabled_ = q),
      q ? "adapter.js logging disabled" : "adapter.js logging enabled");
}
function disableWarnings(q) {
  return typeof q != "boolean"
    ? new Error("Argument type: " + typeof q + ". Please use a boolean.")
    : ((deprecationWarnings_ = !q),
      "adapter.js deprecation warnings " + (q ? "disabled" : "enabled"));
}
function log() {
  if (typeof window == "object") {
    if (logDisabled_) return;
    typeof console < "u" &&
      typeof console.log == "function" &&
      console.log.apply(console, arguments);
  }
}
function deprecated(q, U) {
  deprecationWarnings_ &&
    console.warn(q + " is deprecated, please use " + U + " instead.");
}
function detectBrowser(q) {
  const U = { browser: null, version: null };
  if (typeof q > "u" || !q.navigator || !q.navigator.userAgent)
    return (U.browser = "Not a browser."), U;
  const { navigator: F } = q;
  if (F.userAgentData && F.userAgentData.brands) {
    const B = F.userAgentData.brands.find((V) => V.brand === "Chromium");
    if (B) return { browser: "chrome", version: parseInt(B.version, 10) };
  }
  if (F.mozGetUserMedia)
    (U.browser = "firefox"),
      (U.version = extractVersion(F.userAgent, /Firefox\/(\d+)\./, 1));
  else if (
    F.webkitGetUserMedia ||
    (q.isSecureContext === !1 && q.webkitRTCPeerConnection)
  )
    (U.browser = "chrome"),
      (U.version = extractVersion(F.userAgent, /Chrom(e|ium)\/(\d+)\./, 2));
  else if (q.RTCPeerConnection && F.userAgent.match(/AppleWebKit\/(\d+)\./))
    (U.browser = "safari"),
      (U.version = extractVersion(F.userAgent, /AppleWebKit\/(\d+)\./, 1)),
      (U.supportsUnifiedPlan =
        q.RTCRtpTransceiver &&
        "currentDirection" in q.RTCRtpTransceiver.prototype);
  else return (U.browser = "Not a supported browser."), U;
  return U;
}
function isObject(q) {
  return Object.prototype.toString.call(q) === "[object Object]";
}
function compactObject(q) {
  return isObject(q)
    ? Object.keys(q).reduce(function (U, F) {
        const B = isObject(q[F]),
          V = B ? compactObject(q[F]) : q[F],
          j = B && !Object.keys(V).length;
        return V === void 0 || j ? U : Object.assign(U, { [F]: V });
      }, {})
    : q;
}
function walkStats(q, U, F) {
  !U ||
    F.has(U.id) ||
    (F.set(U.id, U),
    Object.keys(U).forEach((B) => {
      B.endsWith("Id")
        ? walkStats(q, q.get(U[B]), F)
        : B.endsWith("Ids") &&
          U[B].forEach((V) => {
            walkStats(q, q.get(V), F);
          });
    }));
}
function filterStats(q, U, F) {
  const B = F ? "outbound-rtp" : "inbound-rtp",
    V = new Map();
  if (U === null) return V;
  const j = [];
  return (
    q.forEach(($) => {
      $.type === "track" && $.trackIdentifier === U.id && j.push($);
    }),
    j.forEach(($) => {
      q.forEach((W) => {
        W.type === B && W.trackId === $.id && walkStats(q, W, V);
      });
    }),
    V
  );
}
const logging = log;
function shimGetUserMedia$2(q, U) {
  const F = q && q.navigator;
  if (!F.mediaDevices) return;
  const B = function (W) {
      if (typeof W != "object" || W.mandatory || W.optional) return W;
      const K = {};
      return (
        Object.keys(W).forEach((G) => {
          if (G === "require" || G === "advanced" || G === "mediaSource")
            return;
          const Q = typeof W[G] == "object" ? W[G] : { ideal: W[G] };
          Q.exact !== void 0 &&
            typeof Q.exact == "number" &&
            (Q.min = Q.max = Q.exact);
          const z = function (H, Y) {
            return H
              ? H + Y.charAt(0).toUpperCase() + Y.slice(1)
              : Y === "deviceId"
              ? "sourceId"
              : Y;
          };
          if (Q.ideal !== void 0) {
            K.optional = K.optional || [];
            let H = {};
            typeof Q.ideal == "number"
              ? ((H[z("min", G)] = Q.ideal),
                K.optional.push(H),
                (H = {}),
                (H[z("max", G)] = Q.ideal),
                K.optional.push(H))
              : ((H[z("", G)] = Q.ideal), K.optional.push(H));
          }
          Q.exact !== void 0 && typeof Q.exact != "number"
            ? ((K.mandatory = K.mandatory || {}),
              (K.mandatory[z("", G)] = Q.exact))
            : ["min", "max"].forEach((H) => {
                Q[H] !== void 0 &&
                  ((K.mandatory = K.mandatory || {}),
                  (K.mandatory[z(H, G)] = Q[H]));
              });
        }),
        W.advanced && (K.optional = (K.optional || []).concat(W.advanced)),
        K
      );
    },
    V = function (W, K) {
      if (U.version >= 61) return K(W);
      if (
        ((W = JSON.parse(JSON.stringify(W))), W && typeof W.audio == "object")
      ) {
        const G = function (Q, z, H) {
          z in Q && !(H in Q) && ((Q[H] = Q[z]), delete Q[z]);
        };
        (W = JSON.parse(JSON.stringify(W))),
          G(W.audio, "autoGainControl", "googAutoGainControl"),
          G(W.audio, "noiseSuppression", "googNoiseSuppression"),
          (W.audio = B(W.audio));
      }
      if (W && typeof W.video == "object") {
        let G = W.video.facingMode;
        G = G && (typeof G == "object" ? G : { ideal: G });
        const Q = U.version < 66;
        if (
          G &&
          (G.exact === "user" ||
            G.exact === "environment" ||
            G.ideal === "user" ||
            G.ideal === "environment") &&
          !(
            F.mediaDevices.getSupportedConstraints &&
            F.mediaDevices.getSupportedConstraints().facingMode &&
            !Q
          )
        ) {
          delete W.video.facingMode;
          let z;
          if (
            (G.exact === "environment" || G.ideal === "environment"
              ? (z = ["back", "rear"])
              : (G.exact === "user" || G.ideal === "user") && (z = ["front"]),
            z)
          )
            return F.mediaDevices.enumerateDevices().then((H) => {
              H = H.filter((X) => X.kind === "videoinput");
              let Y = H.find((X) =>
                z.some((Z) => X.label.toLowerCase().includes(Z))
              );
              return (
                !Y && H.length && z.includes("back") && (Y = H[H.length - 1]),
                Y &&
                  (W.video.deviceId = G.exact
                    ? { exact: Y.deviceId }
                    : { ideal: Y.deviceId }),
                (W.video = B(W.video)),
                logging("chrome: " + JSON.stringify(W)),
                K(W)
              );
            });
        }
        W.video = B(W.video);
      }
      return logging("chrome: " + JSON.stringify(W)), K(W);
    },
    j = function (W) {
      return U.version >= 64
        ? W
        : {
            name:
              {
                PermissionDeniedError: "NotAllowedError",
                PermissionDismissedError: "NotAllowedError",
                InvalidStateError: "NotAllowedError",
                DevicesNotFoundError: "NotFoundError",
                ConstraintNotSatisfiedError: "OverconstrainedError",
                TrackStartError: "NotReadableError",
                MediaDeviceFailedDueToShutdown: "NotAllowedError",
                MediaDeviceKillSwitchOn: "NotAllowedError",
                TabCaptureError: "AbortError",
                ScreenCaptureError: "AbortError",
                DeviceCaptureError: "AbortError",
              }[W.name] || W.name,
            message: W.message,
            constraint: W.constraint || W.constraintName,
            toString() {
              return this.name + (this.message && ": ") + this.message;
            },
          };
    },
    $ = function (W, K, G) {
      V(W, (Q) => {
        F.webkitGetUserMedia(Q, K, (z) => {
          G && G(j(z));
        });
      });
    };
  if (((F.getUserMedia = $.bind(F)), F.mediaDevices.getUserMedia)) {
    const W = F.mediaDevices.getUserMedia.bind(F.mediaDevices);
    F.mediaDevices.getUserMedia = function (K) {
      return V(K, (G) =>
        W(G).then(
          (Q) => {
            if (
              (G.audio && !Q.getAudioTracks().length) ||
              (G.video && !Q.getVideoTracks().length)
            )
              throw (
                (Q.getTracks().forEach((z) => {
                  z.stop();
                }),
                new DOMException("", "NotFoundError"))
              );
            return Q;
          },
          (Q) => Promise.reject(j(Q))
        )
      );
    };
  }
}
function shimMediaStream(q) {
  q.MediaStream = q.MediaStream || q.webkitMediaStream;
}
function shimOnTrack$1(q) {
  if (
    typeof q == "object" &&
    q.RTCPeerConnection &&
    !("ontrack" in q.RTCPeerConnection.prototype)
  ) {
    Object.defineProperty(q.RTCPeerConnection.prototype, "ontrack", {
      get() {
        return this._ontrack;
      },
      set(F) {
        this._ontrack && this.removeEventListener("track", this._ontrack),
          this.addEventListener("track", (this._ontrack = F));
      },
      enumerable: !0,
      configurable: !0,
    });
    const U = q.RTCPeerConnection.prototype.setRemoteDescription;
    q.RTCPeerConnection.prototype.setRemoteDescription = function () {
      return (
        this._ontrackpoly ||
          ((this._ontrackpoly = (B) => {
            B.stream.addEventListener("addtrack", (V) => {
              let j;
              q.RTCPeerConnection.prototype.getReceivers
                ? (j = this.getReceivers().find(
                    (W) => W.track && W.track.id === V.track.id
                  ))
                : (j = { track: V.track });
              const $ = new Event("track");
              ($.track = V.track),
                ($.receiver = j),
                ($.transceiver = { receiver: j }),
                ($.streams = [B.stream]),
                this.dispatchEvent($);
            }),
              B.stream.getTracks().forEach((V) => {
                let j;
                q.RTCPeerConnection.prototype.getReceivers
                  ? (j = this.getReceivers().find(
                      (W) => W.track && W.track.id === V.id
                    ))
                  : (j = { track: V });
                const $ = new Event("track");
                ($.track = V),
                  ($.receiver = j),
                  ($.transceiver = { receiver: j }),
                  ($.streams = [B.stream]),
                  this.dispatchEvent($);
              });
          }),
          this.addEventListener("addstream", this._ontrackpoly)),
        U.apply(this, arguments)
      );
    };
  } else
    wrapPeerConnectionEvent(
      q,
      "track",
      (U) => (
        U.transceiver ||
          Object.defineProperty(U, "transceiver", {
            value: { receiver: U.receiver },
          }),
        U
      )
    );
}
function shimGetSendersWithDtmf(q) {
  if (
    typeof q == "object" &&
    q.RTCPeerConnection &&
    !("getSenders" in q.RTCPeerConnection.prototype) &&
    "createDTMFSender" in q.RTCPeerConnection.prototype
  ) {
    const U = function (V, j) {
      return {
        track: j,
        get dtmf() {
          return (
            this._dtmf === void 0 &&
              (j.kind === "audio"
                ? (this._dtmf = V.createDTMFSender(j))
                : (this._dtmf = null)),
            this._dtmf
          );
        },
        _pc: V,
      };
    };
    if (!q.RTCPeerConnection.prototype.getSenders) {
      q.RTCPeerConnection.prototype.getSenders = function () {
        return (this._senders = this._senders || []), this._senders.slice();
      };
      const V = q.RTCPeerConnection.prototype.addTrack;
      q.RTCPeerConnection.prototype.addTrack = function (W, K) {
        let G = V.apply(this, arguments);
        return G || ((G = U(this, W)), this._senders.push(G)), G;
      };
      const j = q.RTCPeerConnection.prototype.removeTrack;
      q.RTCPeerConnection.prototype.removeTrack = function (W) {
        j.apply(this, arguments);
        const K = this._senders.indexOf(W);
        K !== -1 && this._senders.splice(K, 1);
      };
    }
    const F = q.RTCPeerConnection.prototype.addStream;
    q.RTCPeerConnection.prototype.addStream = function (j) {
      (this._senders = this._senders || []),
        F.apply(this, [j]),
        j.getTracks().forEach(($) => {
          this._senders.push(U(this, $));
        });
    };
    const B = q.RTCPeerConnection.prototype.removeStream;
    q.RTCPeerConnection.prototype.removeStream = function (j) {
      (this._senders = this._senders || []),
        B.apply(this, [j]),
        j.getTracks().forEach(($) => {
          const W = this._senders.find((K) => K.track === $);
          W && this._senders.splice(this._senders.indexOf(W), 1);
        });
    };
  } else if (
    typeof q == "object" &&
    q.RTCPeerConnection &&
    "getSenders" in q.RTCPeerConnection.prototype &&
    "createDTMFSender" in q.RTCPeerConnection.prototype &&
    q.RTCRtpSender &&
    !("dtmf" in q.RTCRtpSender.prototype)
  ) {
    const U = q.RTCPeerConnection.prototype.getSenders;
    (q.RTCPeerConnection.prototype.getSenders = function () {
      const B = U.apply(this, []);
      return B.forEach((V) => (V._pc = this)), B;
    }),
      Object.defineProperty(q.RTCRtpSender.prototype, "dtmf", {
        get() {
          return (
            this._dtmf === void 0 &&
              (this.track.kind === "audio"
                ? (this._dtmf = this._pc.createDTMFSender(this.track))
                : (this._dtmf = null)),
            this._dtmf
          );
        },
      });
  }
}
function shimSenderReceiverGetStats(q) {
  if (
    !(
      typeof q == "object" &&
      q.RTCPeerConnection &&
      q.RTCRtpSender &&
      q.RTCRtpReceiver
    )
  )
    return;
  if (!("getStats" in q.RTCRtpSender.prototype)) {
    const F = q.RTCPeerConnection.prototype.getSenders;
    F &&
      (q.RTCPeerConnection.prototype.getSenders = function () {
        const j = F.apply(this, []);
        return j.forEach(($) => ($._pc = this)), j;
      });
    const B = q.RTCPeerConnection.prototype.addTrack;
    B &&
      (q.RTCPeerConnection.prototype.addTrack = function () {
        const j = B.apply(this, arguments);
        return (j._pc = this), j;
      }),
      (q.RTCRtpSender.prototype.getStats = function () {
        const j = this;
        return this._pc.getStats().then(($) => filterStats($, j.track, !0));
      });
  }
  if (!("getStats" in q.RTCRtpReceiver.prototype)) {
    const F = q.RTCPeerConnection.prototype.getReceivers;
    F &&
      (q.RTCPeerConnection.prototype.getReceivers = function () {
        const V = F.apply(this, []);
        return V.forEach((j) => (j._pc = this)), V;
      }),
      wrapPeerConnectionEvent(
        q,
        "track",
        (B) => ((B.receiver._pc = B.srcElement), B)
      ),
      (q.RTCRtpReceiver.prototype.getStats = function () {
        const V = this;
        return this._pc.getStats().then((j) => filterStats(j, V.track, !1));
      });
  }
  if (
    !(
      "getStats" in q.RTCRtpSender.prototype &&
      "getStats" in q.RTCRtpReceiver.prototype
    )
  )
    return;
  const U = q.RTCPeerConnection.prototype.getStats;
  q.RTCPeerConnection.prototype.getStats = function () {
    if (arguments.length > 0 && arguments[0] instanceof q.MediaStreamTrack) {
      const B = arguments[0];
      let V, j, $;
      return (
        this.getSenders().forEach((W) => {
          W.track === B && (V ? ($ = !0) : (V = W));
        }),
        this.getReceivers().forEach(
          (W) => (W.track === B && (j ? ($ = !0) : (j = W)), W.track === B)
        ),
        $ || (V && j)
          ? Promise.reject(
              new DOMException(
                "There are more than one sender or receiver for the track.",
                "InvalidAccessError"
              )
            )
          : V
          ? V.getStats()
          : j
          ? j.getStats()
          : Promise.reject(
              new DOMException(
                "There is no sender or receiver for the track.",
                "InvalidAccessError"
              )
            )
      );
    }
    return U.apply(this, arguments);
  };
}
function shimAddTrackRemoveTrackWithNative(q) {
  q.RTCPeerConnection.prototype.getLocalStreams = function () {
    return (
      (this._shimmedLocalStreams = this._shimmedLocalStreams || {}),
      Object.keys(this._shimmedLocalStreams).map(
        ($) => this._shimmedLocalStreams[$][0]
      )
    );
  };
  const U = q.RTCPeerConnection.prototype.addTrack;
  q.RTCPeerConnection.prototype.addTrack = function ($, W) {
    if (!W) return U.apply(this, arguments);
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    const K = U.apply(this, arguments);
    return (
      this._shimmedLocalStreams[W.id]
        ? this._shimmedLocalStreams[W.id].indexOf(K) === -1 &&
          this._shimmedLocalStreams[W.id].push(K)
        : (this._shimmedLocalStreams[W.id] = [W, K]),
      K
    );
  };
  const F = q.RTCPeerConnection.prototype.addStream;
  q.RTCPeerConnection.prototype.addStream = function ($) {
    (this._shimmedLocalStreams = this._shimmedLocalStreams || {}),
      $.getTracks().forEach((G) => {
        if (this.getSenders().find((z) => z.track === G))
          throw new DOMException("Track already exists.", "InvalidAccessError");
      });
    const W = this.getSenders();
    F.apply(this, arguments);
    const K = this.getSenders().filter((G) => W.indexOf(G) === -1);
    this._shimmedLocalStreams[$.id] = [$].concat(K);
  };
  const B = q.RTCPeerConnection.prototype.removeStream;
  q.RTCPeerConnection.prototype.removeStream = function ($) {
    return (
      (this._shimmedLocalStreams = this._shimmedLocalStreams || {}),
      delete this._shimmedLocalStreams[$.id],
      B.apply(this, arguments)
    );
  };
  const V = q.RTCPeerConnection.prototype.removeTrack;
  q.RTCPeerConnection.prototype.removeTrack = function ($) {
    return (
      (this._shimmedLocalStreams = this._shimmedLocalStreams || {}),
      $ &&
        Object.keys(this._shimmedLocalStreams).forEach((W) => {
          const K = this._shimmedLocalStreams[W].indexOf($);
          K !== -1 && this._shimmedLocalStreams[W].splice(K, 1),
            this._shimmedLocalStreams[W].length === 1 &&
              delete this._shimmedLocalStreams[W];
        }),
      V.apply(this, arguments)
    );
  };
}
function shimAddTrackRemoveTrack(q, U) {
  if (!q.RTCPeerConnection) return;
  if (q.RTCPeerConnection.prototype.addTrack && U.version >= 65)
    return shimAddTrackRemoveTrackWithNative(q);
  const F = q.RTCPeerConnection.prototype.getLocalStreams;
  q.RTCPeerConnection.prototype.getLocalStreams = function () {
    const Q = F.apply(this);
    return (
      (this._reverseStreams = this._reverseStreams || {}),
      Q.map((z) => this._reverseStreams[z.id])
    );
  };
  const B = q.RTCPeerConnection.prototype.addStream;
  q.RTCPeerConnection.prototype.addStream = function (Q) {
    if (
      ((this._streams = this._streams || {}),
      (this._reverseStreams = this._reverseStreams || {}),
      Q.getTracks().forEach((z) => {
        if (this.getSenders().find((Y) => Y.track === z))
          throw new DOMException("Track already exists.", "InvalidAccessError");
      }),
      !this._reverseStreams[Q.id])
    ) {
      const z = new q.MediaStream(Q.getTracks());
      (this._streams[Q.id] = z), (this._reverseStreams[z.id] = Q), (Q = z);
    }
    B.apply(this, [Q]);
  };
  const V = q.RTCPeerConnection.prototype.removeStream;
  (q.RTCPeerConnection.prototype.removeStream = function (Q) {
    (this._streams = this._streams || {}),
      (this._reverseStreams = this._reverseStreams || {}),
      V.apply(this, [this._streams[Q.id] || Q]),
      delete this._reverseStreams[
        this._streams[Q.id] ? this._streams[Q.id].id : Q.id
      ],
      delete this._streams[Q.id];
  }),
    (q.RTCPeerConnection.prototype.addTrack = function (Q, z) {
      if (this.signalingState === "closed")
        throw new DOMException(
          "The RTCPeerConnection's signalingState is 'closed'.",
          "InvalidStateError"
        );
      const H = [].slice.call(arguments, 1);
      if (H.length !== 1 || !H[0].getTracks().find((Z) => Z === Q))
        throw new DOMException(
          "The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.",
          "NotSupportedError"
        );
      if (this.getSenders().find((Z) => Z.track === Q))
        throw new DOMException("Track already exists.", "InvalidAccessError");
      (this._streams = this._streams || {}),
        (this._reverseStreams = this._reverseStreams || {});
      const X = this._streams[z.id];
      if (X)
        X.addTrack(Q),
          Promise.resolve().then(() => {
            this.dispatchEvent(new Event("negotiationneeded"));
          });
      else {
        const Z = new q.MediaStream([Q]);
        (this._streams[z.id] = Z),
          (this._reverseStreams[Z.id] = z),
          this.addStream(Z);
      }
      return this.getSenders().find((Z) => Z.track === Q);
    });
  function j(G, Q) {
    let z = Q.sdp;
    return (
      Object.keys(G._reverseStreams || []).forEach((H) => {
        const Y = G._reverseStreams[H],
          X = G._streams[Y.id];
        z = z.replace(new RegExp(X.id, "g"), Y.id);
      }),
      new RTCSessionDescription({ type: Q.type, sdp: z })
    );
  }
  function $(G, Q) {
    let z = Q.sdp;
    return (
      Object.keys(G._reverseStreams || []).forEach((H) => {
        const Y = G._reverseStreams[H],
          X = G._streams[Y.id];
        z = z.replace(new RegExp(Y.id, "g"), X.id);
      }),
      new RTCSessionDescription({ type: Q.type, sdp: z })
    );
  }
  ["createOffer", "createAnswer"].forEach(function (G) {
    const Q = q.RTCPeerConnection.prototype[G],
      z = {
        [G]() {
          const H = arguments;
          return arguments.length && typeof arguments[0] == "function"
            ? Q.apply(this, [
                (X) => {
                  const Z = j(this, X);
                  H[0].apply(null, [Z]);
                },
                (X) => {
                  H[1] && H[1].apply(null, X);
                },
                arguments[2],
              ])
            : Q.apply(this, arguments).then((X) => j(this, X));
        },
      };
    q.RTCPeerConnection.prototype[G] = z[G];
  });
  const W = q.RTCPeerConnection.prototype.setLocalDescription;
  q.RTCPeerConnection.prototype.setLocalDescription = function () {
    return !arguments.length || !arguments[0].type
      ? W.apply(this, arguments)
      : ((arguments[0] = $(this, arguments[0])), W.apply(this, arguments));
  };
  const K = Object.getOwnPropertyDescriptor(
    q.RTCPeerConnection.prototype,
    "localDescription"
  );
  Object.defineProperty(q.RTCPeerConnection.prototype, "localDescription", {
    get() {
      const G = K.get.apply(this);
      return G.type === "" ? G : j(this, G);
    },
  }),
    (q.RTCPeerConnection.prototype.removeTrack = function (Q) {
      if (this.signalingState === "closed")
        throw new DOMException(
          "The RTCPeerConnection's signalingState is 'closed'.",
          "InvalidStateError"
        );
      if (!Q._pc)
        throw new DOMException(
          "Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.",
          "TypeError"
        );
      if (!(Q._pc === this))
        throw new DOMException(
          "Sender was not created by this connection.",
          "InvalidAccessError"
        );
      this._streams = this._streams || {};
      let H;
      Object.keys(this._streams).forEach((Y) => {
        this._streams[Y].getTracks().find((Z) => Q.track === Z) &&
          (H = this._streams[Y]);
      }),
        H &&
          (H.getTracks().length === 1
            ? this.removeStream(this._reverseStreams[H.id])
            : H.removeTrack(Q.track),
          this.dispatchEvent(new Event("negotiationneeded")));
    });
}
function shimPeerConnection$1(q, U) {
  !q.RTCPeerConnection &&
    q.webkitRTCPeerConnection &&
    (q.RTCPeerConnection = q.webkitRTCPeerConnection),
    q.RTCPeerConnection &&
      U.version < 53 &&
      [
        "setLocalDescription",
        "setRemoteDescription",
        "addIceCandidate",
      ].forEach(function (F) {
        const B = q.RTCPeerConnection.prototype[F],
          V = {
            [F]() {
              return (
                (arguments[0] = new (
                  F === "addIceCandidate"
                    ? q.RTCIceCandidate
                    : q.RTCSessionDescription
                )(arguments[0])),
                B.apply(this, arguments)
              );
            },
          };
        q.RTCPeerConnection.prototype[F] = V[F];
      });
}
function fixNegotiationNeeded(q, U) {
  wrapPeerConnectionEvent(q, "negotiationneeded", (F) => {
    const B = F.target;
    if (
      !(
        (U.version < 72 ||
          (B.getConfiguration &&
            B.getConfiguration().sdpSemantics === "plan-b")) &&
        B.signalingState !== "stable"
      )
    )
      return F;
  });
}
var chromeShim = Object.freeze({
  __proto__: null,
  fixNegotiationNeeded,
  shimAddTrackRemoveTrack,
  shimAddTrackRemoveTrackWithNative,
  shimGetSendersWithDtmf,
  shimGetUserMedia: shimGetUserMedia$2,
  shimMediaStream,
  shimOnTrack: shimOnTrack$1,
  shimPeerConnection: shimPeerConnection$1,
  shimSenderReceiverGetStats,
});
function shimGetUserMedia$1(q, U) {
  const F = q && q.navigator,
    B = q && q.MediaStreamTrack;
  if (
    ((F.getUserMedia = function (V, j, $) {
      deprecated(
        "navigator.getUserMedia",
        "navigator.mediaDevices.getUserMedia"
      ),
        F.mediaDevices.getUserMedia(V).then(j, $);
    }),
    !(
      U.version > 55 &&
      "autoGainControl" in F.mediaDevices.getSupportedConstraints()
    ))
  ) {
    const V = function ($, W, K) {
        W in $ && !(K in $) && (($[K] = $[W]), delete $[W]);
      },
      j = F.mediaDevices.getUserMedia.bind(F.mediaDevices);
    if (
      ((F.mediaDevices.getUserMedia = function ($) {
        return (
          typeof $ == "object" &&
            typeof $.audio == "object" &&
            (($ = JSON.parse(JSON.stringify($))),
            V($.audio, "autoGainControl", "mozAutoGainControl"),
            V($.audio, "noiseSuppression", "mozNoiseSuppression")),
          j($)
        );
      }),
      B && B.prototype.getSettings)
    ) {
      const $ = B.prototype.getSettings;
      B.prototype.getSettings = function () {
        const W = $.apply(this, arguments);
        return (
          V(W, "mozAutoGainControl", "autoGainControl"),
          V(W, "mozNoiseSuppression", "noiseSuppression"),
          W
        );
      };
    }
    if (B && B.prototype.applyConstraints) {
      const $ = B.prototype.applyConstraints;
      B.prototype.applyConstraints = function (W) {
        return (
          this.kind === "audio" &&
            typeof W == "object" &&
            ((W = JSON.parse(JSON.stringify(W))),
            V(W, "autoGainControl", "mozAutoGainControl"),
            V(W, "noiseSuppression", "mozNoiseSuppression")),
          $.apply(this, [W])
        );
      };
    }
  }
}
function shimGetDisplayMedia(q, U) {
  (q.navigator.mediaDevices && "getDisplayMedia" in q.navigator.mediaDevices) ||
    (q.navigator.mediaDevices &&
      (q.navigator.mediaDevices.getDisplayMedia = function (B) {
        if (!(B && B.video)) {
          const V = new DOMException(
            "getDisplayMedia without video constraints is undefined"
          );
          return (V.name = "NotFoundError"), (V.code = 8), Promise.reject(V);
        }
        return (
          B.video === !0
            ? (B.video = { mediaSource: U })
            : (B.video.mediaSource = U),
          q.navigator.mediaDevices.getUserMedia(B)
        );
      }));
}
function shimOnTrack(q) {
  typeof q == "object" &&
    q.RTCTrackEvent &&
    "receiver" in q.RTCTrackEvent.prototype &&
    !("transceiver" in q.RTCTrackEvent.prototype) &&
    Object.defineProperty(q.RTCTrackEvent.prototype, "transceiver", {
      get() {
        return { receiver: this.receiver };
      },
    });
}
function shimPeerConnection(q, U) {
  if (typeof q != "object" || !(q.RTCPeerConnection || q.mozRTCPeerConnection))
    return;
  !q.RTCPeerConnection &&
    q.mozRTCPeerConnection &&
    (q.RTCPeerConnection = q.mozRTCPeerConnection),
    U.version < 53 &&
      [
        "setLocalDescription",
        "setRemoteDescription",
        "addIceCandidate",
      ].forEach(function (V) {
        const j = q.RTCPeerConnection.prototype[V],
          $ = {
            [V]() {
              return (
                (arguments[0] = new (
                  V === "addIceCandidate"
                    ? q.RTCIceCandidate
                    : q.RTCSessionDescription
                )(arguments[0])),
                j.apply(this, arguments)
              );
            },
          };
        q.RTCPeerConnection.prototype[V] = $[V];
      });
  const F = {
      inboundrtp: "inbound-rtp",
      outboundrtp: "outbound-rtp",
      candidatepair: "candidate-pair",
      localcandidate: "local-candidate",
      remotecandidate: "remote-candidate",
    },
    B = q.RTCPeerConnection.prototype.getStats;
  q.RTCPeerConnection.prototype.getStats = function () {
    const [j, $, W] = arguments;
    return B.apply(this, [j || null])
      .then((K) => {
        if (U.version < 53 && !$)
          try {
            K.forEach((G) => {
              G.type = F[G.type] || G.type;
            });
          } catch (G) {
            if (G.name !== "TypeError") throw G;
            K.forEach((Q, z) => {
              K.set(z, Object.assign({}, Q, { type: F[Q.type] || Q.type }));
            });
          }
        return K;
      })
      .then($, W);
  };
}
function shimSenderGetStats(q) {
  if (
    !(typeof q == "object" && q.RTCPeerConnection && q.RTCRtpSender) ||
    (q.RTCRtpSender && "getStats" in q.RTCRtpSender.prototype)
  )
    return;
  const U = q.RTCPeerConnection.prototype.getSenders;
  U &&
    (q.RTCPeerConnection.prototype.getSenders = function () {
      const V = U.apply(this, []);
      return V.forEach((j) => (j._pc = this)), V;
    });
  const F = q.RTCPeerConnection.prototype.addTrack;
  F &&
    (q.RTCPeerConnection.prototype.addTrack = function () {
      const V = F.apply(this, arguments);
      return (V._pc = this), V;
    }),
    (q.RTCRtpSender.prototype.getStats = function () {
      return this.track
        ? this._pc.getStats(this.track)
        : Promise.resolve(new Map());
    });
}
function shimReceiverGetStats(q) {
  if (
    !(typeof q == "object" && q.RTCPeerConnection && q.RTCRtpSender) ||
    (q.RTCRtpSender && "getStats" in q.RTCRtpReceiver.prototype)
  )
    return;
  const U = q.RTCPeerConnection.prototype.getReceivers;
  U &&
    (q.RTCPeerConnection.prototype.getReceivers = function () {
      const B = U.apply(this, []);
      return B.forEach((V) => (V._pc = this)), B;
    }),
    wrapPeerConnectionEvent(
      q,
      "track",
      (F) => ((F.receiver._pc = F.srcElement), F)
    ),
    (q.RTCRtpReceiver.prototype.getStats = function () {
      return this._pc.getStats(this.track);
    });
}
function shimRemoveStream(q) {
  !q.RTCPeerConnection ||
    "removeStream" in q.RTCPeerConnection.prototype ||
    (q.RTCPeerConnection.prototype.removeStream = function (F) {
      deprecated("removeStream", "removeTrack"),
        this.getSenders().forEach((B) => {
          B.track && F.getTracks().includes(B.track) && this.removeTrack(B);
        });
    });
}
function shimRTCDataChannel(q) {
  q.DataChannel && !q.RTCDataChannel && (q.RTCDataChannel = q.DataChannel);
}
function shimAddTransceiver(q) {
  if (!(typeof q == "object" && q.RTCPeerConnection)) return;
  const U = q.RTCPeerConnection.prototype.addTransceiver;
  U &&
    (q.RTCPeerConnection.prototype.addTransceiver = function () {
      this.setParametersPromises = [];
      let B = arguments[1] && arguments[1].sendEncodings;
      B === void 0 && (B = []), (B = [...B]);
      const V = B.length > 0;
      V &&
        B.forEach(($) => {
          if ("rid" in $ && !/^[a-z0-9]{0,16}$/i.test($.rid))
            throw new TypeError("Invalid RID value provided.");
          if (
            "scaleResolutionDownBy" in $ &&
            !(parseFloat($.scaleResolutionDownBy) >= 1)
          )
            throw new RangeError("scale_resolution_down_by must be >= 1.0");
          if ("maxFramerate" in $ && !(parseFloat($.maxFramerate) >= 0))
            throw new RangeError("max_framerate must be >= 0.0");
        });
      const j = U.apply(this, arguments);
      if (V) {
        const { sender: $ } = j,
          W = $.getParameters();
        (!("encodings" in W) ||
          (W.encodings.length === 1 &&
            Object.keys(W.encodings[0]).length === 0)) &&
          ((W.encodings = B),
          ($.sendEncodings = B),
          this.setParametersPromises.push(
            $.setParameters(W)
              .then(() => {
                delete $.sendEncodings;
              })
              .catch(() => {
                delete $.sendEncodings;
              })
          ));
      }
      return j;
    });
}
function shimGetParameters(q) {
  if (!(typeof q == "object" && q.RTCRtpSender)) return;
  const U = q.RTCRtpSender.prototype.getParameters;
  U &&
    (q.RTCRtpSender.prototype.getParameters = function () {
      const B = U.apply(this, arguments);
      return (
        "encodings" in B ||
          (B.encodings = [].concat(this.sendEncodings || [{}])),
        B
      );
    });
}
function shimCreateOffer(q) {
  if (!(typeof q == "object" && q.RTCPeerConnection)) return;
  const U = q.RTCPeerConnection.prototype.createOffer;
  q.RTCPeerConnection.prototype.createOffer = function () {
    return this.setParametersPromises && this.setParametersPromises.length
      ? Promise.all(this.setParametersPromises)
          .then(() => U.apply(this, arguments))
          .finally(() => {
            this.setParametersPromises = [];
          })
      : U.apply(this, arguments);
  };
}
function shimCreateAnswer(q) {
  if (!(typeof q == "object" && q.RTCPeerConnection)) return;
  const U = q.RTCPeerConnection.prototype.createAnswer;
  q.RTCPeerConnection.prototype.createAnswer = function () {
    return this.setParametersPromises && this.setParametersPromises.length
      ? Promise.all(this.setParametersPromises)
          .then(() => U.apply(this, arguments))
          .finally(() => {
            this.setParametersPromises = [];
          })
      : U.apply(this, arguments);
  };
}
var firefoxShim = Object.freeze({
  __proto__: null,
  shimAddTransceiver,
  shimCreateAnswer,
  shimCreateOffer,
  shimGetDisplayMedia,
  shimGetParameters,
  shimGetUserMedia: shimGetUserMedia$1,
  shimOnTrack,
  shimPeerConnection,
  shimRTCDataChannel,
  shimReceiverGetStats,
  shimRemoveStream,
  shimSenderGetStats,
});
function shimLocalStreamsAPI(q) {
  if (!(typeof q != "object" || !q.RTCPeerConnection)) {
    if (
      ("getLocalStreams" in q.RTCPeerConnection.prototype ||
        (q.RTCPeerConnection.prototype.getLocalStreams = function () {
          return (
            this._localStreams || (this._localStreams = []), this._localStreams
          );
        }),
      !("addStream" in q.RTCPeerConnection.prototype))
    ) {
      const U = q.RTCPeerConnection.prototype.addTrack;
      (q.RTCPeerConnection.prototype.addStream = function (B) {
        this._localStreams || (this._localStreams = []),
          this._localStreams.includes(B) || this._localStreams.push(B),
          B.getAudioTracks().forEach((V) => U.call(this, V, B)),
          B.getVideoTracks().forEach((V) => U.call(this, V, B));
      }),
        (q.RTCPeerConnection.prototype.addTrack = function (B) {
          for (
            var V = arguments.length, j = new Array(V > 1 ? V - 1 : 0), $ = 1;
            $ < V;
            $++
          )
            j[$ - 1] = arguments[$];
          return (
            j &&
              j.forEach((W) => {
                this._localStreams
                  ? this._localStreams.includes(W) || this._localStreams.push(W)
                  : (this._localStreams = [W]);
              }),
            U.apply(this, arguments)
          );
        });
    }
    "removeStream" in q.RTCPeerConnection.prototype ||
      (q.RTCPeerConnection.prototype.removeStream = function (F) {
        this._localStreams || (this._localStreams = []);
        const B = this._localStreams.indexOf(F);
        if (B === -1) return;
        this._localStreams.splice(B, 1);
        const V = F.getTracks();
        this.getSenders().forEach((j) => {
          V.includes(j.track) && this.removeTrack(j);
        });
      });
  }
}
function shimRemoteStreamsAPI(q) {
  if (
    !(typeof q != "object" || !q.RTCPeerConnection) &&
    ("getRemoteStreams" in q.RTCPeerConnection.prototype ||
      (q.RTCPeerConnection.prototype.getRemoteStreams = function () {
        return this._remoteStreams ? this._remoteStreams : [];
      }),
    !("onaddstream" in q.RTCPeerConnection.prototype))
  ) {
    Object.defineProperty(q.RTCPeerConnection.prototype, "onaddstream", {
      get() {
        return this._onaddstream;
      },
      set(F) {
        this._onaddstream &&
          (this.removeEventListener("addstream", this._onaddstream),
          this.removeEventListener("track", this._onaddstreampoly)),
          this.addEventListener("addstream", (this._onaddstream = F)),
          this.addEventListener(
            "track",
            (this._onaddstreampoly = (B) => {
              B.streams.forEach((V) => {
                if (
                  (this._remoteStreams || (this._remoteStreams = []),
                  this._remoteStreams.includes(V))
                )
                  return;
                this._remoteStreams.push(V);
                const j = new Event("addstream");
                (j.stream = V), this.dispatchEvent(j);
              });
            })
          );
      },
    });
    const U = q.RTCPeerConnection.prototype.setRemoteDescription;
    q.RTCPeerConnection.prototype.setRemoteDescription = function () {
      const B = this;
      return (
        this._onaddstreampoly ||
          this.addEventListener(
            "track",
            (this._onaddstreampoly = function (V) {
              V.streams.forEach((j) => {
                if (
                  (B._remoteStreams || (B._remoteStreams = []),
                  B._remoteStreams.indexOf(j) >= 0)
                )
                  return;
                B._remoteStreams.push(j);
                const $ = new Event("addstream");
                ($.stream = j), B.dispatchEvent($);
              });
            })
          ),
        U.apply(B, arguments)
      );
    };
  }
}
function shimCallbacksAPI(q) {
  if (typeof q != "object" || !q.RTCPeerConnection) return;
  const U = q.RTCPeerConnection.prototype,
    F = U.createOffer,
    B = U.createAnswer,
    V = U.setLocalDescription,
    j = U.setRemoteDescription,
    $ = U.addIceCandidate;
  (U.createOffer = function (G, Q) {
    const z = arguments.length >= 2 ? arguments[2] : arguments[0],
      H = F.apply(this, [z]);
    return Q ? (H.then(G, Q), Promise.resolve()) : H;
  }),
    (U.createAnswer = function (G, Q) {
      const z = arguments.length >= 2 ? arguments[2] : arguments[0],
        H = B.apply(this, [z]);
      return Q ? (H.then(G, Q), Promise.resolve()) : H;
    });
  let W = function (K, G, Q) {
    const z = V.apply(this, [K]);
    return Q ? (z.then(G, Q), Promise.resolve()) : z;
  };
  (U.setLocalDescription = W),
    (W = function (K, G, Q) {
      const z = j.apply(this, [K]);
      return Q ? (z.then(G, Q), Promise.resolve()) : z;
    }),
    (U.setRemoteDescription = W),
    (W = function (K, G, Q) {
      const z = $.apply(this, [K]);
      return Q ? (z.then(G, Q), Promise.resolve()) : z;
    }),
    (U.addIceCandidate = W);
}
function shimGetUserMedia(q) {
  const U = q && q.navigator;
  if (U.mediaDevices && U.mediaDevices.getUserMedia) {
    const F = U.mediaDevices,
      B = F.getUserMedia.bind(F);
    U.mediaDevices.getUserMedia = (V) => B(shimConstraints(V));
  }
  !U.getUserMedia &&
    U.mediaDevices &&
    U.mediaDevices.getUserMedia &&
    (U.getUserMedia = function (B, V, j) {
      U.mediaDevices.getUserMedia(B).then(V, j);
    }.bind(U));
}
function shimConstraints(q) {
  return q && q.video !== void 0
    ? Object.assign({}, q, { video: compactObject(q.video) })
    : q;
}
function shimRTCIceServerUrls(q) {
  if (!q.RTCPeerConnection) return;
  const U = q.RTCPeerConnection;
  (q.RTCPeerConnection = function (B, V) {
    if (B && B.iceServers) {
      const j = [];
      for (let $ = 0; $ < B.iceServers.length; $++) {
        let W = B.iceServers[$];
        W.urls === void 0 && W.url
          ? (deprecated("RTCIceServer.url", "RTCIceServer.urls"),
            (W = JSON.parse(JSON.stringify(W))),
            (W.urls = W.url),
            delete W.url,
            j.push(W))
          : j.push(B.iceServers[$]);
      }
      B.iceServers = j;
    }
    return new U(B, V);
  }),
    (q.RTCPeerConnection.prototype = U.prototype),
    "generateCertificate" in U &&
      Object.defineProperty(q.RTCPeerConnection, "generateCertificate", {
        get() {
          return U.generateCertificate;
        },
      });
}
function shimTrackEventTransceiver(q) {
  typeof q == "object" &&
    q.RTCTrackEvent &&
    "receiver" in q.RTCTrackEvent.prototype &&
    !("transceiver" in q.RTCTrackEvent.prototype) &&
    Object.defineProperty(q.RTCTrackEvent.prototype, "transceiver", {
      get() {
        return { receiver: this.receiver };
      },
    });
}
function shimCreateOfferLegacy(q) {
  const U = q.RTCPeerConnection.prototype.createOffer;
  q.RTCPeerConnection.prototype.createOffer = function (B) {
    if (B) {
      typeof B.offerToReceiveAudio < "u" &&
        (B.offerToReceiveAudio = !!B.offerToReceiveAudio);
      const V = this.getTransceivers().find(
        ($) => $.receiver.track.kind === "audio"
      );
      B.offerToReceiveAudio === !1 && V
        ? V.direction === "sendrecv"
          ? V.setDirection
            ? V.setDirection("sendonly")
            : (V.direction = "sendonly")
          : V.direction === "recvonly" &&
            (V.setDirection
              ? V.setDirection("inactive")
              : (V.direction = "inactive"))
        : B.offerToReceiveAudio === !0 &&
          !V &&
          this.addTransceiver("audio", { direction: "recvonly" }),
        typeof B.offerToReceiveVideo < "u" &&
          (B.offerToReceiveVideo = !!B.offerToReceiveVideo);
      const j = this.getTransceivers().find(
        ($) => $.receiver.track.kind === "video"
      );
      B.offerToReceiveVideo === !1 && j
        ? j.direction === "sendrecv"
          ? j.setDirection
            ? j.setDirection("sendonly")
            : (j.direction = "sendonly")
          : j.direction === "recvonly" &&
            (j.setDirection
              ? j.setDirection("inactive")
              : (j.direction = "inactive"))
        : B.offerToReceiveVideo === !0 &&
          !j &&
          this.addTransceiver("video", { direction: "recvonly" });
    }
    return U.apply(this, arguments);
  };
}
function shimAudioContext(q) {
  typeof q != "object" ||
    q.AudioContext ||
    (q.AudioContext = q.webkitAudioContext);
}
var safariShim = Object.freeze({
    __proto__: null,
    shimAudioContext,
    shimCallbacksAPI,
    shimConstraints,
    shimCreateOfferLegacy,
    shimGetUserMedia,
    shimLocalStreamsAPI,
    shimRTCIceServerUrls,
    shimRemoteStreamsAPI,
    shimTrackEventTransceiver,
  }),
  sdp$1 = { exports: {} },
  hasRequiredSdp;
function requireSdp() {
  return (
    hasRequiredSdp ||
      ((hasRequiredSdp = 1),
      (function (q) {
        const U = {};
        (U.generateIdentifier = function () {
          return Math.random().toString(36).substring(2, 12);
        }),
          (U.localCName = U.generateIdentifier()),
          (U.splitLines = function (F) {
            return F.trim()
              .split(
                `
`
              )
              .map((B) => B.trim());
          }),
          (U.splitSections = function (F) {
            return F.split(
              `
m=`
            ).map(
              (V, j) =>
                (j > 0 ? "m=" + V : V).trim() +
                `\r
`
            );
          }),
          (U.getDescription = function (F) {
            const B = U.splitSections(F);
            return B && B[0];
          }),
          (U.getMediaSections = function (F) {
            const B = U.splitSections(F);
            return B.shift(), B;
          }),
          (U.matchPrefix = function (F, B) {
            return U.splitLines(F).filter((V) => V.indexOf(B) === 0);
          }),
          (U.parseCandidate = function (F) {
            let B;
            F.indexOf("a=candidate:") === 0
              ? (B = F.substring(12).split(" "))
              : (B = F.substring(10).split(" "));
            const V = {
              foundation: B[0],
              component: { 1: "rtp", 2: "rtcp" }[B[1]] || B[1],
              protocol: B[2].toLowerCase(),
              priority: parseInt(B[3], 10),
              ip: B[4],
              address: B[4],
              port: parseInt(B[5], 10),
              type: B[7],
            };
            for (let j = 8; j < B.length; j += 2)
              switch (B[j]) {
                case "raddr":
                  V.relatedAddress = B[j + 1];
                  break;
                case "rport":
                  V.relatedPort = parseInt(B[j + 1], 10);
                  break;
                case "tcptype":
                  V.tcpType = B[j + 1];
                  break;
                case "ufrag":
                  (V.ufrag = B[j + 1]), (V.usernameFragment = B[j + 1]);
                  break;
                default:
                  V[B[j]] === void 0 && (V[B[j]] = B[j + 1]);
                  break;
              }
            return V;
          }),
          (U.writeCandidate = function (F) {
            const B = [];
            B.push(F.foundation);
            const V = F.component;
            V === "rtp" ? B.push(1) : V === "rtcp" ? B.push(2) : B.push(V),
              B.push(F.protocol.toUpperCase()),
              B.push(F.priority),
              B.push(F.address || F.ip),
              B.push(F.port);
            const j = F.type;
            return (
              B.push("typ"),
              B.push(j),
              j !== "host" &&
                F.relatedAddress &&
                F.relatedPort &&
                (B.push("raddr"),
                B.push(F.relatedAddress),
                B.push("rport"),
                B.push(F.relatedPort)),
              F.tcpType &&
                F.protocol.toLowerCase() === "tcp" &&
                (B.push("tcptype"), B.push(F.tcpType)),
              (F.usernameFragment || F.ufrag) &&
                (B.push("ufrag"), B.push(F.usernameFragment || F.ufrag)),
              "candidate:" + B.join(" ")
            );
          }),
          (U.parseIceOptions = function (F) {
            return F.substring(14).split(" ");
          }),
          (U.parseRtpMap = function (F) {
            let B = F.substring(9).split(" ");
            const V = { payloadType: parseInt(B.shift(), 10) };
            return (
              (B = B[0].split("/")),
              (V.name = B[0]),
              (V.clockRate = parseInt(B[1], 10)),
              (V.channels = B.length === 3 ? parseInt(B[2], 10) : 1),
              (V.numChannels = V.channels),
              V
            );
          }),
          (U.writeRtpMap = function (F) {
            let B = F.payloadType;
            F.preferredPayloadType !== void 0 && (B = F.preferredPayloadType);
            const V = F.channels || F.numChannels || 1;
            return (
              "a=rtpmap:" +
              B +
              " " +
              F.name +
              "/" +
              F.clockRate +
              (V !== 1 ? "/" + V : "") +
              `\r
`
            );
          }),
          (U.parseExtmap = function (F) {
            const B = F.substring(9).split(" ");
            return {
              id: parseInt(B[0], 10),
              direction:
                B[0].indexOf("/") > 0 ? B[0].split("/")[1] : "sendrecv",
              uri: B[1],
              attributes: B.slice(2).join(" "),
            };
          }),
          (U.writeExtmap = function (F) {
            return (
              "a=extmap:" +
              (F.id || F.preferredId) +
              (F.direction && F.direction !== "sendrecv"
                ? "/" + F.direction
                : "") +
              " " +
              F.uri +
              (F.attributes ? " " + F.attributes : "") +
              `\r
`
            );
          }),
          (U.parseFmtp = function (F) {
            const B = {};
            let V;
            const j = F.substring(F.indexOf(" ") + 1).split(";");
            for (let $ = 0; $ < j.length; $++)
              (V = j[$].trim().split("=")), (B[V[0].trim()] = V[1]);
            return B;
          }),
          (U.writeFmtp = function (F) {
            let B = "",
              V = F.payloadType;
            if (
              (F.preferredPayloadType !== void 0 &&
                (V = F.preferredPayloadType),
              F.parameters && Object.keys(F.parameters).length)
            ) {
              const j = [];
              Object.keys(F.parameters).forEach(($) => {
                F.parameters[$] !== void 0
                  ? j.push($ + "=" + F.parameters[$])
                  : j.push($);
              }),
                (B +=
                  "a=fmtp:" +
                  V +
                  " " +
                  j.join(";") +
                  `\r
`);
            }
            return B;
          }),
          (U.parseRtcpFb = function (F) {
            const B = F.substring(F.indexOf(" ") + 1).split(" ");
            return { type: B.shift(), parameter: B.join(" ") };
          }),
          (U.writeRtcpFb = function (F) {
            let B = "",
              V = F.payloadType;
            return (
              F.preferredPayloadType !== void 0 && (V = F.preferredPayloadType),
              F.rtcpFeedback &&
                F.rtcpFeedback.length &&
                F.rtcpFeedback.forEach((j) => {
                  B +=
                    "a=rtcp-fb:" +
                    V +
                    " " +
                    j.type +
                    (j.parameter && j.parameter.length
                      ? " " + j.parameter
                      : "") +
                    `\r
`;
                }),
              B
            );
          }),
          (U.parseSsrcMedia = function (F) {
            const B = F.indexOf(" "),
              V = { ssrc: parseInt(F.substring(7, B), 10) },
              j = F.indexOf(":", B);
            return (
              j > -1
                ? ((V.attribute = F.substring(B + 1, j)),
                  (V.value = F.substring(j + 1)))
                : (V.attribute = F.substring(B + 1)),
              V
            );
          }),
          (U.parseSsrcGroup = function (F) {
            const B = F.substring(13).split(" ");
            return {
              semantics: B.shift(),
              ssrcs: B.map((V) => parseInt(V, 10)),
            };
          }),
          (U.getMid = function (F) {
            const B = U.matchPrefix(F, "a=mid:")[0];
            if (B) return B.substring(6);
          }),
          (U.parseFingerprint = function (F) {
            const B = F.substring(14).split(" ");
            return { algorithm: B[0].toLowerCase(), value: B[1].toUpperCase() };
          }),
          (U.getDtlsParameters = function (F, B) {
            return {
              role: "auto",
              fingerprints: U.matchPrefix(F + B, "a=fingerprint:").map(
                U.parseFingerprint
              ),
            };
          }),
          (U.writeDtlsParameters = function (F, B) {
            let V =
              "a=setup:" +
              B +
              `\r
`;
            return (
              F.fingerprints.forEach((j) => {
                V +=
                  "a=fingerprint:" +
                  j.algorithm +
                  " " +
                  j.value +
                  `\r
`;
              }),
              V
            );
          }),
          (U.parseCryptoLine = function (F) {
            const B = F.substring(9).split(" ");
            return {
              tag: parseInt(B[0], 10),
              cryptoSuite: B[1],
              keyParams: B[2],
              sessionParams: B.slice(3),
            };
          }),
          (U.writeCryptoLine = function (F) {
            return (
              "a=crypto:" +
              F.tag +
              " " +
              F.cryptoSuite +
              " " +
              (typeof F.keyParams == "object"
                ? U.writeCryptoKeyParams(F.keyParams)
                : F.keyParams) +
              (F.sessionParams ? " " + F.sessionParams.join(" ") : "") +
              `\r
`
            );
          }),
          (U.parseCryptoKeyParams = function (F) {
            if (F.indexOf("inline:") !== 0) return null;
            const B = F.substring(7).split("|");
            return {
              keyMethod: "inline",
              keySalt: B[0],
              lifeTime: B[1],
              mkiValue: B[2] ? B[2].split(":")[0] : void 0,
              mkiLength: B[2] ? B[2].split(":")[1] : void 0,
            };
          }),
          (U.writeCryptoKeyParams = function (F) {
            return (
              F.keyMethod +
              ":" +
              F.keySalt +
              (F.lifeTime ? "|" + F.lifeTime : "") +
              (F.mkiValue && F.mkiLength
                ? "|" + F.mkiValue + ":" + F.mkiLength
                : "")
            );
          }),
          (U.getCryptoParameters = function (F, B) {
            return U.matchPrefix(F + B, "a=crypto:").map(U.parseCryptoLine);
          }),
          (U.getIceParameters = function (F, B) {
            const V = U.matchPrefix(F + B, "a=ice-ufrag:")[0],
              j = U.matchPrefix(F + B, "a=ice-pwd:")[0];
            return V && j
              ? { usernameFragment: V.substring(12), password: j.substring(10) }
              : null;
          }),
          (U.writeIceParameters = function (F) {
            let B =
              "a=ice-ufrag:" +
              F.usernameFragment +
              `\r
a=ice-pwd:` +
              F.password +
              `\r
`;
            return (
              F.iceLite &&
                (B += `a=ice-lite\r
`),
              B
            );
          }),
          (U.parseRtpParameters = function (F) {
            const B = {
                codecs: [],
                headerExtensions: [],
                fecMechanisms: [],
                rtcp: [],
              },
              j = U.splitLines(F)[0].split(" ");
            B.profile = j[2];
            for (let W = 3; W < j.length; W++) {
              const K = j[W],
                G = U.matchPrefix(F, "a=rtpmap:" + K + " ")[0];
              if (G) {
                const Q = U.parseRtpMap(G),
                  z = U.matchPrefix(F, "a=fmtp:" + K + " ");
                switch (
                  ((Q.parameters = z.length ? U.parseFmtp(z[0]) : {}),
                  (Q.rtcpFeedback = U.matchPrefix(
                    F,
                    "a=rtcp-fb:" + K + " "
                  ).map(U.parseRtcpFb)),
                  B.codecs.push(Q),
                  Q.name.toUpperCase())
                ) {
                  case "RED":
                  case "ULPFEC":
                    B.fecMechanisms.push(Q.name.toUpperCase());
                    break;
                }
              }
            }
            U.matchPrefix(F, "a=extmap:").forEach((W) => {
              B.headerExtensions.push(U.parseExtmap(W));
            });
            const $ = U.matchPrefix(F, "a=rtcp-fb:* ").map(U.parseRtcpFb);
            return (
              B.codecs.forEach((W) => {
                $.forEach((K) => {
                  W.rtcpFeedback.find(
                    (Q) => Q.type === K.type && Q.parameter === K.parameter
                  ) || W.rtcpFeedback.push(K);
                });
              }),
              B
            );
          }),
          (U.writeRtpDescription = function (F, B) {
            let V = "";
            (V += "m=" + F + " "),
              (V += B.codecs.length > 0 ? "9" : "0"),
              (V += " " + (B.profile || "UDP/TLS/RTP/SAVPF") + " "),
              (V +=
                B.codecs
                  .map(($) =>
                    $.preferredPayloadType !== void 0
                      ? $.preferredPayloadType
                      : $.payloadType
                  )
                  .join(" ") +
                `\r
`),
              (V += `c=IN IP4 0.0.0.0\r
`),
              (V += `a=rtcp:9 IN IP4 0.0.0.0\r
`),
              B.codecs.forEach(($) => {
                (V += U.writeRtpMap($)),
                  (V += U.writeFmtp($)),
                  (V += U.writeRtcpFb($));
              });
            let j = 0;
            return (
              B.codecs.forEach(($) => {
                $.maxptime > j && (j = $.maxptime);
              }),
              j > 0 &&
                (V +=
                  "a=maxptime:" +
                  j +
                  `\r
`),
              B.headerExtensions &&
                B.headerExtensions.forEach(($) => {
                  V += U.writeExtmap($);
                }),
              V
            );
          }),
          (U.parseRtpEncodingParameters = function (F) {
            const B = [],
              V = U.parseRtpParameters(F),
              j = V.fecMechanisms.indexOf("RED") !== -1,
              $ = V.fecMechanisms.indexOf("ULPFEC") !== -1,
              W = U.matchPrefix(F, "a=ssrc:")
                .map((H) => U.parseSsrcMedia(H))
                .filter((H) => H.attribute === "cname"),
              K = W.length > 0 && W[0].ssrc;
            let G;
            const Q = U.matchPrefix(F, "a=ssrc-group:FID").map((H) =>
              H.substring(17)
                .split(" ")
                .map((X) => parseInt(X, 10))
            );
            Q.length > 0 && Q[0].length > 1 && Q[0][0] === K && (G = Q[0][1]),
              V.codecs.forEach((H) => {
                if (H.name.toUpperCase() === "RTX" && H.parameters.apt) {
                  let Y = {
                    ssrc: K,
                    codecPayloadType: parseInt(H.parameters.apt, 10),
                  };
                  K && G && (Y.rtx = { ssrc: G }),
                    B.push(Y),
                    j &&
                      ((Y = JSON.parse(JSON.stringify(Y))),
                      (Y.fec = {
                        ssrc: K,
                        mechanism: $ ? "red+ulpfec" : "red",
                      }),
                      B.push(Y));
                }
              }),
              B.length === 0 && K && B.push({ ssrc: K });
            let z = U.matchPrefix(F, "b=");
            return (
              z.length &&
                (z[0].indexOf("b=TIAS:") === 0
                  ? (z = parseInt(z[0].substring(7), 10))
                  : z[0].indexOf("b=AS:") === 0
                  ? (z =
                      parseInt(z[0].substring(5), 10) * 1e3 * 0.95 -
                      50 * 40 * 8)
                  : (z = void 0),
                B.forEach((H) => {
                  H.maxBitrate = z;
                })),
              B
            );
          }),
          (U.parseRtcpParameters = function (F) {
            const B = {},
              V = U.matchPrefix(F, "a=ssrc:")
                .map((W) => U.parseSsrcMedia(W))
                .filter((W) => W.attribute === "cname")[0];
            V && ((B.cname = V.value), (B.ssrc = V.ssrc));
            const j = U.matchPrefix(F, "a=rtcp-rsize");
            (B.reducedSize = j.length > 0), (B.compound = j.length === 0);
            const $ = U.matchPrefix(F, "a=rtcp-mux");
            return (B.mux = $.length > 0), B;
          }),
          (U.writeRtcpParameters = function (F) {
            let B = "";
            return (
              F.reducedSize &&
                (B += `a=rtcp-rsize\r
`),
              F.mux &&
                (B += `a=rtcp-mux\r
`),
              F.ssrc !== void 0 &&
                F.cname &&
                (B +=
                  "a=ssrc:" +
                  F.ssrc +
                  " cname:" +
                  F.cname +
                  `\r
`),
              B
            );
          }),
          (U.parseMsid = function (F) {
            let B;
            const V = U.matchPrefix(F, "a=msid:");
            if (V.length === 1)
              return (
                (B = V[0].substring(7).split(" ")),
                { stream: B[0], track: B[1] }
              );
            const j = U.matchPrefix(F, "a=ssrc:")
              .map(($) => U.parseSsrcMedia($))
              .filter(($) => $.attribute === "msid");
            if (j.length > 0)
              return (B = j[0].value.split(" ")), { stream: B[0], track: B[1] };
          }),
          (U.parseSctpDescription = function (F) {
            const B = U.parseMLine(F),
              V = U.matchPrefix(F, "a=max-message-size:");
            let j;
            V.length > 0 && (j = parseInt(V[0].substring(19), 10)),
              isNaN(j) && (j = 65536);
            const $ = U.matchPrefix(F, "a=sctp-port:");
            if ($.length > 0)
              return {
                port: parseInt($[0].substring(12), 10),
                protocol: B.fmt,
                maxMessageSize: j,
              };
            const W = U.matchPrefix(F, "a=sctpmap:");
            if (W.length > 0) {
              const K = W[0].substring(10).split(" ");
              return {
                port: parseInt(K[0], 10),
                protocol: K[1],
                maxMessageSize: j,
              };
            }
          }),
          (U.writeSctpDescription = function (F, B) {
            let V = [];
            return (
              F.protocol !== "DTLS/SCTP"
                ? (V = [
                    "m=" +
                      F.kind +
                      " 9 " +
                      F.protocol +
                      " " +
                      B.protocol +
                      `\r
`,
                    `c=IN IP4 0.0.0.0\r
`,
                    "a=sctp-port:" +
                      B.port +
                      `\r
`,
                  ])
                : (V = [
                    "m=" +
                      F.kind +
                      " 9 " +
                      F.protocol +
                      " " +
                      B.port +
                      `\r
`,
                    `c=IN IP4 0.0.0.0\r
`,
                    "a=sctpmap:" +
                      B.port +
                      " " +
                      B.protocol +
                      ` 65535\r
`,
                  ]),
              B.maxMessageSize !== void 0 &&
                V.push(
                  "a=max-message-size:" +
                    B.maxMessageSize +
                    `\r
`
                ),
              V.join("")
            );
          }),
          (U.generateSessionId = function () {
            return Math.random().toString().substr(2, 22);
          }),
          (U.writeSessionBoilerplate = function (F, B, V) {
            let j;
            const $ = B !== void 0 ? B : 2;
            return (
              F ? (j = F) : (j = U.generateSessionId()),
              `v=0\r
o=` +
                (V || "thisisadapterortc") +
                " " +
                j +
                " " +
                $ +
                ` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`
            );
          }),
          (U.getDirection = function (F, B) {
            const V = U.splitLines(F);
            for (let j = 0; j < V.length; j++)
              switch (V[j]) {
                case "a=sendrecv":
                case "a=sendonly":
                case "a=recvonly":
                case "a=inactive":
                  return V[j].substring(2);
              }
            return B ? U.getDirection(B) : "sendrecv";
          }),
          (U.getKind = function (F) {
            return U.splitLines(F)[0].split(" ")[0].substring(2);
          }),
          (U.isRejected = function (F) {
            return F.split(" ", 2)[1] === "0";
          }),
          (U.parseMLine = function (F) {
            const V = U.splitLines(F)[0].substring(2).split(" ");
            return {
              kind: V[0],
              port: parseInt(V[1], 10),
              protocol: V[2],
              fmt: V.slice(3).join(" "),
            };
          }),
          (U.parseOLine = function (F) {
            const V = U.matchPrefix(F, "o=")[0].substring(2).split(" ");
            return {
              username: V[0],
              sessionId: V[1],
              sessionVersion: parseInt(V[2], 10),
              netType: V[3],
              addressType: V[4],
              address: V[5],
            };
          }),
          (U.isValidSDP = function (F) {
            if (typeof F != "string" || F.length === 0) return !1;
            const B = U.splitLines(F);
            for (let V = 0; V < B.length; V++)
              if (B[V].length < 2 || B[V].charAt(1) !== "=") return !1;
            return !0;
          }),
          (q.exports = U);
      })(sdp$1)),
    sdp$1.exports
  );
}
var sdpExports = requireSdp(),
  SDPUtils = getDefaultExportFromCjs$1(sdpExports),
  sdp = _mergeNamespaces({ __proto__: null, default: SDPUtils }, [sdpExports]);
function shimRTCIceCandidate(q) {
  if (
    !q.RTCIceCandidate ||
    (q.RTCIceCandidate && "foundation" in q.RTCIceCandidate.prototype)
  )
    return;
  const U = q.RTCIceCandidate;
  (q.RTCIceCandidate = function (B) {
    if (
      (typeof B == "object" &&
        B.candidate &&
        B.candidate.indexOf("a=") === 0 &&
        ((B = JSON.parse(JSON.stringify(B))),
        (B.candidate = B.candidate.substring(2))),
      B.candidate && B.candidate.length)
    ) {
      const V = new U(B),
        j = SDPUtils.parseCandidate(B.candidate);
      for (const $ in j) $ in V || Object.defineProperty(V, $, { value: j[$] });
      return (
        (V.toJSON = function () {
          return {
            candidate: V.candidate,
            sdpMid: V.sdpMid,
            sdpMLineIndex: V.sdpMLineIndex,
            usernameFragment: V.usernameFragment,
          };
        }),
        V
      );
    }
    return new U(B);
  }),
    (q.RTCIceCandidate.prototype = U.prototype),
    wrapPeerConnectionEvent(
      q,
      "icecandidate",
      (F) => (
        F.candidate &&
          Object.defineProperty(F, "candidate", {
            value: new q.RTCIceCandidate(F.candidate),
            writable: "false",
          }),
        F
      )
    );
}
function shimRTCIceCandidateRelayProtocol(q) {
  !q.RTCIceCandidate ||
    (q.RTCIceCandidate && "relayProtocol" in q.RTCIceCandidate.prototype) ||
    wrapPeerConnectionEvent(q, "icecandidate", (U) => {
      if (U.candidate) {
        const F = SDPUtils.parseCandidate(U.candidate.candidate);
        F.type === "relay" &&
          (U.candidate.relayProtocol = { 0: "tls", 1: "tcp", 2: "udp" }[
            F.priority >> 24
          ]);
      }
      return U;
    });
}
function shimMaxMessageSize(q, U) {
  if (!q.RTCPeerConnection) return;
  "sctp" in q.RTCPeerConnection.prototype ||
    Object.defineProperty(q.RTCPeerConnection.prototype, "sctp", {
      get() {
        return typeof this._sctp > "u" ? null : this._sctp;
      },
    });
  const F = function (W) {
      if (!W || !W.sdp) return !1;
      const K = SDPUtils.splitSections(W.sdp);
      return (
        K.shift(),
        K.some((G) => {
          const Q = SDPUtils.parseMLine(G);
          return (
            Q && Q.kind === "application" && Q.protocol.indexOf("SCTP") !== -1
          );
        })
      );
    },
    B = function (W) {
      const K = W.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
      if (K === null || K.length < 2) return -1;
      const G = parseInt(K[1], 10);
      return G !== G ? -1 : G;
    },
    V = function (W) {
      let K = 65536;
      return (
        U.browser === "firefox" &&
          (U.version < 57
            ? W === -1
              ? (K = 16384)
              : (K = 2147483637)
            : U.version < 60
            ? (K = U.version === 57 ? 65535 : 65536)
            : (K = 2147483637)),
        K
      );
    },
    j = function (W, K) {
      let G = 65536;
      U.browser === "firefox" && U.version === 57 && (G = 65535);
      const Q = SDPUtils.matchPrefix(W.sdp, "a=max-message-size:");
      return (
        Q.length > 0
          ? (G = parseInt(Q[0].substring(19), 10))
          : U.browser === "firefox" && K !== -1 && (G = 2147483637),
        G
      );
    },
    $ = q.RTCPeerConnection.prototype.setRemoteDescription;
  q.RTCPeerConnection.prototype.setRemoteDescription = function () {
    if (((this._sctp = null), U.browser === "chrome" && U.version >= 76)) {
      const { sdpSemantics: K } = this.getConfiguration();
      K === "plan-b" &&
        Object.defineProperty(this, "sctp", {
          get() {
            return typeof this._sctp > "u" ? null : this._sctp;
          },
          enumerable: !0,
          configurable: !0,
        });
    }
    if (F(arguments[0])) {
      const K = B(arguments[0]),
        G = V(K),
        Q = j(arguments[0], K);
      let z;
      G === 0 && Q === 0
        ? (z = Number.POSITIVE_INFINITY)
        : G === 0 || Q === 0
        ? (z = Math.max(G, Q))
        : (z = Math.min(G, Q));
      const H = {};
      Object.defineProperty(H, "maxMessageSize", {
        get() {
          return z;
        },
      }),
        (this._sctp = H);
    }
    return $.apply(this, arguments);
  };
}
function shimSendThrowTypeError(q) {
  if (
    !(
      q.RTCPeerConnection &&
      "createDataChannel" in q.RTCPeerConnection.prototype
    )
  )
    return;
  function U(B, V) {
    const j = B.send;
    B.send = function () {
      const W = arguments[0],
        K = W.length || W.size || W.byteLength;
      if (B.readyState === "open" && V.sctp && K > V.sctp.maxMessageSize)
        throw new TypeError(
          "Message too large (can send a maximum of " +
            V.sctp.maxMessageSize +
            " bytes)"
        );
      return j.apply(B, arguments);
    };
  }
  const F = q.RTCPeerConnection.prototype.createDataChannel;
  (q.RTCPeerConnection.prototype.createDataChannel = function () {
    const V = F.apply(this, arguments);
    return U(V, this), V;
  }),
    wrapPeerConnectionEvent(
      q,
      "datachannel",
      (B) => (U(B.channel, B.target), B)
    );
}
function shimConnectionState(q) {
  if (
    !q.RTCPeerConnection ||
    "connectionState" in q.RTCPeerConnection.prototype
  )
    return;
  const U = q.RTCPeerConnection.prototype;
  Object.defineProperty(U, "connectionState", {
    get() {
      return (
        { completed: "connected", checking: "connecting" }[
          this.iceConnectionState
        ] || this.iceConnectionState
      );
    },
    enumerable: !0,
    configurable: !0,
  }),
    Object.defineProperty(U, "onconnectionstatechange", {
      get() {
        return this._onconnectionstatechange || null;
      },
      set(F) {
        this._onconnectionstatechange &&
          (this.removeEventListener(
            "connectionstatechange",
            this._onconnectionstatechange
          ),
          delete this._onconnectionstatechange),
          F &&
            this.addEventListener(
              "connectionstatechange",
              (this._onconnectionstatechange = F)
            );
      },
      enumerable: !0,
      configurable: !0,
    }),
    ["setLocalDescription", "setRemoteDescription"].forEach((F) => {
      const B = U[F];
      U[F] = function () {
        return (
          this._connectionstatechangepoly ||
            ((this._connectionstatechangepoly = (V) => {
              const j = V.target;
              if (j._lastConnectionState !== j.connectionState) {
                j._lastConnectionState = j.connectionState;
                const $ = new Event("connectionstatechange", V);
                j.dispatchEvent($);
              }
              return V;
            }),
            this.addEventListener(
              "iceconnectionstatechange",
              this._connectionstatechangepoly
            )),
          B.apply(this, arguments)
        );
      };
    });
}
function removeExtmapAllowMixed(q, U) {
  if (
    !q.RTCPeerConnection ||
    (U.browser === "chrome" && U.version >= 71) ||
    (U.browser === "safari" && U.version >= 605)
  )
    return;
  const F = q.RTCPeerConnection.prototype.setRemoteDescription;
  q.RTCPeerConnection.prototype.setRemoteDescription = function (V) {
    if (
      V &&
      V.sdp &&
      V.sdp.indexOf(`
a=extmap-allow-mixed`) !== -1
    ) {
      const j = V.sdp
        .split(
          `
`
        )
        .filter(($) => $.trim() !== "a=extmap-allow-mixed").join(`
`);
      q.RTCSessionDescription && V instanceof q.RTCSessionDescription
        ? (arguments[0] = new q.RTCSessionDescription({ type: V.type, sdp: j }))
        : (V.sdp = j);
    }
    return F.apply(this, arguments);
  };
}
function shimAddIceCandidateNullOrEmpty(q, U) {
  if (!(q.RTCPeerConnection && q.RTCPeerConnection.prototype)) return;
  const F = q.RTCPeerConnection.prototype.addIceCandidate;
  !F ||
    F.length === 0 ||
    (q.RTCPeerConnection.prototype.addIceCandidate = function () {
      return arguments[0]
        ? ((U.browser === "chrome" && U.version < 78) ||
            (U.browser === "firefox" && U.version < 68) ||
            U.browser === "safari") &&
          arguments[0] &&
          arguments[0].candidate === ""
          ? Promise.resolve()
          : F.apply(this, arguments)
        : (arguments[1] && arguments[1].apply(null), Promise.resolve());
    });
}
function shimParameterlessSetLocalDescription(q, U) {
  if (!(q.RTCPeerConnection && q.RTCPeerConnection.prototype)) return;
  const F = q.RTCPeerConnection.prototype.setLocalDescription;
  !F ||
    F.length === 0 ||
    (q.RTCPeerConnection.prototype.setLocalDescription = function () {
      let V = arguments[0] || {};
      if (typeof V != "object" || (V.type && V.sdp))
        return F.apply(this, arguments);
      if (((V = { type: V.type, sdp: V.sdp }), !V.type))
        switch (this.signalingState) {
          case "stable":
          case "have-local-offer":
          case "have-remote-pranswer":
            V.type = "offer";
            break;
          default:
            V.type = "answer";
            break;
        }
      return V.sdp || (V.type !== "offer" && V.type !== "answer")
        ? F.apply(this, [V])
        : (V.type === "offer" ? this.createOffer : this.createAnswer)
            .apply(this)
            .then(($) => F.apply(this, [$]));
    });
}
var commonShim = Object.freeze({
  __proto__: null,
  removeExtmapAllowMixed,
  shimAddIceCandidateNullOrEmpty,
  shimConnectionState,
  shimMaxMessageSize,
  shimParameterlessSetLocalDescription,
  shimRTCIceCandidate,
  shimRTCIceCandidateRelayProtocol,
  shimSendThrowTypeError,
});
function adapterFactory() {
  let { window: q } =
      arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
    U =
      arguments.length > 1 && arguments[1] !== void 0
        ? arguments[1]
        : { shimChrome: !0, shimFirefox: !0, shimSafari: !0 };
  const F = log,
    B = detectBrowser(q),
    V = {
      browserDetails: B,
      commonShim,
      extractVersion,
      disableLog,
      disableWarnings,
      sdp,
    };
  switch (B.browser) {
    case "chrome":
      if (!chromeShim || !shimPeerConnection$1 || !U.shimChrome)
        return F("Chrome shim is not included in this adapter release."), V;
      if (B.version === null)
        return F("Chrome shim can not determine version, not shimming."), V;
      F("adapter.js shimming chrome."),
        (V.browserShim = chromeShim),
        shimAddIceCandidateNullOrEmpty(q, B),
        shimParameterlessSetLocalDescription(q),
        shimGetUserMedia$2(q, B),
        shimMediaStream(q),
        shimPeerConnection$1(q, B),
        shimOnTrack$1(q),
        shimAddTrackRemoveTrack(q, B),
        shimGetSendersWithDtmf(q),
        shimSenderReceiverGetStats(q),
        fixNegotiationNeeded(q, B),
        shimRTCIceCandidate(q),
        shimRTCIceCandidateRelayProtocol(q),
        shimConnectionState(q),
        shimMaxMessageSize(q, B),
        shimSendThrowTypeError(q),
        removeExtmapAllowMixed(q, B);
      break;
    case "firefox":
      if (!firefoxShim || !shimPeerConnection || !U.shimFirefox)
        return F("Firefox shim is not included in this adapter release."), V;
      F("adapter.js shimming firefox."),
        (V.browserShim = firefoxShim),
        shimAddIceCandidateNullOrEmpty(q, B),
        shimParameterlessSetLocalDescription(q),
        shimGetUserMedia$1(q, B),
        shimPeerConnection(q, B),
        shimOnTrack(q),
        shimRemoveStream(q),
        shimSenderGetStats(q),
        shimReceiverGetStats(q),
        shimRTCDataChannel(q),
        shimAddTransceiver(q),
        shimGetParameters(q),
        shimCreateOffer(q),
        shimCreateAnswer(q),
        shimRTCIceCandidate(q),
        shimConnectionState(q),
        shimMaxMessageSize(q, B),
        shimSendThrowTypeError(q);
      break;
    case "safari":
      if (!safariShim || !U.shimSafari)
        return F("Safari shim is not included in this adapter release."), V;
      F("adapter.js shimming safari."),
        (V.browserShim = safariShim),
        shimAddIceCandidateNullOrEmpty(q, B),
        shimParameterlessSetLocalDescription(q),
        shimRTCIceServerUrls(q),
        shimCreateOfferLegacy(q),
        shimCallbacksAPI(q),
        shimLocalStreamsAPI(q),
        shimRemoteStreamsAPI(q),
        shimTrackEventTransceiver(q),
        shimGetUserMedia(q),
        shimAudioContext(q),
        shimRTCIceCandidate(q),
        shimRTCIceCandidateRelayProtocol(q),
        shimMaxMessageSize(q, B),
        shimSendThrowTypeError(q),
        removeExtmapAllowMixed(q, B);
      break;
    default:
      F("Unsupported browser!");
      break;
  }
  return V;
}
adapterFactory({ window: typeof window > "u" ? void 0 : window });
const DECRYPTION_FAILURE_TOLERANCE = 10,
  E2EE_FLAG = "lk_e2ee",
  SALT = "LKFrameEncryptionKey",
  KEY_PROVIDER_DEFAULTS = {
    sharedKey: !1,
    ratchetSalt: SALT,
    ratchetWindowSize: 8,
    failureTolerance: DECRYPTION_FAILURE_TOLERANCE,
    keyringSize: 16,
    allowKeyExtraction: !1,
  };
var KeyProviderEvent;
(function (q) {
  (q.SetKey = "setKey"),
    (q.RatchetRequest = "ratchetRequest"),
    (q.KeyRatcheted = "keyRatcheted");
})(KeyProviderEvent || (KeyProviderEvent = {}));
var KeyHandlerEvent;
(function (q) {
  q.KeyRatcheted = "keyRatcheted";
})(KeyHandlerEvent || (KeyHandlerEvent = {}));
var EncryptionEvent;
(function (q) {
  (q.ParticipantEncryptionStatusChanged = "participantEncryptionStatusChanged"),
    (q.EncryptionError = "encryptionError");
})(EncryptionEvent || (EncryptionEvent = {}));
var CryptorEvent;
(function (q) {
  q.Error = "cryptorError";
})(CryptorEvent || (CryptorEvent = {}));
function isE2EESupported() {
  return isInsertableStreamSupported() || isScriptTransformSupported();
}
function isScriptTransformSupported() {
  return typeof window.RTCRtpScriptTransform < "u";
}
function isInsertableStreamSupported() {
  return (
    typeof window.RTCRtpSender < "u" &&
    typeof window.RTCRtpSender.prototype.createEncodedStreams < "u"
  );
}
class BaseKeyProvider extends eventsExports.EventEmitter {
  constructor() {
    let U = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super(),
      (this.onKeyRatcheted = (F, B) => {
        livekitLogger.debug("key ratcheted event received", {
          material: F,
          keyIndex: B,
        });
      }),
      (this.keyInfoMap = new Map()),
      (this.options = Object.assign(
        Object.assign({}, KEY_PROVIDER_DEFAULTS),
        U
      )),
      this.on(KeyProviderEvent.KeyRatcheted, this.onKeyRatcheted);
  }
  onSetEncryptionKey(U, F, B) {
    const V = { key: U, participantIdentity: F, keyIndex: B };
    if (!this.options.sharedKey && !F)
      throw new Error(
        "participant identity needs to be passed for encryption key if sharedKey option is false"
      );
    this.keyInfoMap.set("".concat(F ?? "shared", "-").concat(B ?? 0), V),
      this.emit(KeyProviderEvent.SetKey, V);
  }
  getKeys() {
    return Array.from(this.keyInfoMap.values());
  }
  getOptions() {
    return this.options;
  }
  ratchetKey(U, F) {
    this.emit(KeyProviderEvent.RatchetRequest, U, F);
  }
}
class LivekitError extends Error {
  constructor(U, F) {
    super(F || "an error has occured"),
      (this.name = "LiveKitError"),
      (this.code = U);
  }
}
var ConnectionErrorReason;
(function (q) {
  (q[(q.NotAllowed = 0)] = "NotAllowed"),
    (q[(q.ServerUnreachable = 1)] = "ServerUnreachable"),
    (q[(q.InternalError = 2)] = "InternalError"),
    (q[(q.Cancelled = 3)] = "Cancelled"),
    (q[(q.LeaveRequest = 4)] = "LeaveRequest");
})(ConnectionErrorReason || (ConnectionErrorReason = {}));
class ConnectionError extends LivekitError {
  constructor(U, F, B, V) {
    super(1, U),
      (this.name = "ConnectionError"),
      (this.status = B),
      (this.reason = F),
      (this.context = V),
      (this.reasonName = ConnectionErrorReason[F]);
  }
}
class DeviceUnsupportedError extends LivekitError {
  constructor(U) {
    super(21, U ?? "device is unsupported"),
      (this.name = "DeviceUnsupportedError");
  }
}
class TrackInvalidError extends LivekitError {
  constructor(U) {
    super(20, U ?? "track is invalid"), (this.name = "TrackInvalidError");
  }
}
class UnsupportedServer extends LivekitError {
  constructor(U) {
    super(10, U ?? "unsupported server"), (this.name = "UnsupportedServer");
  }
}
class UnexpectedConnectionState extends LivekitError {
  constructor(U) {
    super(12, U ?? "unexpected connection state"),
      (this.name = "UnexpectedConnectionState");
  }
}
class NegotiationError extends LivekitError {
  constructor(U) {
    super(13, U ?? "unable to negotiate"), (this.name = "NegotiationError");
  }
}
class PublishTrackError extends LivekitError {
  constructor(U, F) {
    super(15, U), (this.name = "PublishTrackError"), (this.status = F);
  }
}
class SignalRequestError extends LivekitError {
  constructor(U, F) {
    super(15, U),
      (this.reason = F),
      (this.reasonName = typeof F == "string" ? F : RequestResponse_Reason[F]);
  }
}
var MediaDeviceFailure;
(function (q) {
  (q.PermissionDenied = "PermissionDenied"),
    (q.NotFound = "NotFound"),
    (q.DeviceInUse = "DeviceInUse"),
    (q.Other = "Other");
})(MediaDeviceFailure || (MediaDeviceFailure = {}));
(function (q) {
  function U(F) {
    if (F && "name" in F)
      return F.name === "NotFoundError" || F.name === "DevicesNotFoundError"
        ? q.NotFound
        : F.name === "NotAllowedError" || F.name === "PermissionDeniedError"
        ? q.PermissionDenied
        : F.name === "NotReadableError" || F.name === "TrackStartError"
        ? q.DeviceInUse
        : q.Other;
  }
  q.getFailure = U;
})(MediaDeviceFailure || (MediaDeviceFailure = {}));
var CryptorErrorReason;
(function (q) {
  (q[(q.InvalidKey = 0)] = "InvalidKey"),
    (q[(q.MissingKey = 1)] = "MissingKey"),
    (q[(q.InternalError = 2)] = "InternalError");
})(CryptorErrorReason || (CryptorErrorReason = {}));
var RoomEvent;
(function (q) {
  (q.Connected = "connected"),
    (q.Reconnecting = "reconnecting"),
    (q.SignalReconnecting = "signalReconnecting"),
    (q.Reconnected = "reconnected"),
    (q.Disconnected = "disconnected"),
    (q.ConnectionStateChanged = "connectionStateChanged"),
    (q.MediaDevicesChanged = "mediaDevicesChanged"),
    (q.ParticipantConnected = "participantConnected"),
    (q.ParticipantDisconnected = "participantDisconnected"),
    (q.TrackPublished = "trackPublished"),
    (q.TrackSubscribed = "trackSubscribed"),
    (q.TrackSubscriptionFailed = "trackSubscriptionFailed"),
    (q.TrackUnpublished = "trackUnpublished"),
    (q.TrackUnsubscribed = "trackUnsubscribed"),
    (q.TrackMuted = "trackMuted"),
    (q.TrackUnmuted = "trackUnmuted"),
    (q.LocalTrackPublished = "localTrackPublished"),
    (q.LocalTrackUnpublished = "localTrackUnpublished"),
    (q.LocalAudioSilenceDetected = "localAudioSilenceDetected"),
    (q.ActiveSpeakersChanged = "activeSpeakersChanged"),
    (q.ParticipantMetadataChanged = "participantMetadataChanged"),
    (q.ParticipantNameChanged = "participantNameChanged"),
    (q.ParticipantAttributesChanged = "participantAttributesChanged"),
    (q.RoomMetadataChanged = "roomMetadataChanged"),
    (q.DataReceived = "dataReceived"),
    (q.SipDTMFReceived = "sipDTMFReceived"),
    (q.TranscriptionReceived = "transcriptionReceived"),
    (q.ConnectionQualityChanged = "connectionQualityChanged"),
    (q.TrackStreamStateChanged = "trackStreamStateChanged"),
    (q.TrackSubscriptionPermissionChanged =
      "trackSubscriptionPermissionChanged"),
    (q.TrackSubscriptionStatusChanged = "trackSubscriptionStatusChanged"),
    (q.AudioPlaybackStatusChanged = "audioPlaybackChanged"),
    (q.VideoPlaybackStatusChanged = "videoPlaybackChanged"),
    (q.MediaDevicesError = "mediaDevicesError"),
    (q.ParticipantPermissionsChanged = "participantPermissionsChanged"),
    (q.SignalConnected = "signalConnected"),
    (q.RecordingStatusChanged = "recordingStatusChanged"),
    (q.ParticipantEncryptionStatusChanged =
      "participantEncryptionStatusChanged"),
    (q.EncryptionError = "encryptionError"),
    (q.DCBufferStatusChanged = "dcBufferStatusChanged"),
    (q.ActiveDeviceChanged = "activeDeviceChanged"),
    (q.ChatMessage = "chatMessage"),
    (q.LocalTrackSubscribed = "localTrackSubscribed"),
    (q.MetricsReceived = "metricsReceived");
})(RoomEvent || (RoomEvent = {}));
var ParticipantEvent;
(function (q) {
  (q.TrackPublished = "trackPublished"),
    (q.TrackSubscribed = "trackSubscribed"),
    (q.TrackSubscriptionFailed = "trackSubscriptionFailed"),
    (q.TrackUnpublished = "trackUnpublished"),
    (q.TrackUnsubscribed = "trackUnsubscribed"),
    (q.TrackMuted = "trackMuted"),
    (q.TrackUnmuted = "trackUnmuted"),
    (q.LocalTrackPublished = "localTrackPublished"),
    (q.LocalTrackUnpublished = "localTrackUnpublished"),
    (q.ParticipantMetadataChanged = "participantMetadataChanged"),
    (q.ParticipantNameChanged = "participantNameChanged"),
    (q.DataReceived = "dataReceived"),
    (q.SipDTMFReceived = "sipDTMFReceived"),
    (q.TranscriptionReceived = "transcriptionReceived"),
    (q.IsSpeakingChanged = "isSpeakingChanged"),
    (q.ConnectionQualityChanged = "connectionQualityChanged"),
    (q.TrackStreamStateChanged = "trackStreamStateChanged"),
    (q.TrackSubscriptionPermissionChanged =
      "trackSubscriptionPermissionChanged"),
    (q.TrackSubscriptionStatusChanged = "trackSubscriptionStatusChanged"),
    (q.MediaDevicesError = "mediaDevicesError"),
    (q.AudioStreamAcquired = "audioStreamAcquired"),
    (q.ParticipantPermissionsChanged = "participantPermissionsChanged"),
    (q.PCTrackAdded = "pcTrackAdded"),
    (q.AttributesChanged = "attributesChanged"),
    (q.LocalTrackSubscribed = "localTrackSubscribed"),
    (q.ChatMessage = "chatMessage");
})(ParticipantEvent || (ParticipantEvent = {}));
var EngineEvent;
(function (q) {
  (q.TransportsCreated = "transportsCreated"),
    (q.Connected = "connected"),
    (q.Disconnected = "disconnected"),
    (q.Resuming = "resuming"),
    (q.Resumed = "resumed"),
    (q.Restarting = "restarting"),
    (q.Restarted = "restarted"),
    (q.SignalResumed = "signalResumed"),
    (q.SignalRestarted = "signalRestarted"),
    (q.Closing = "closing"),
    (q.MediaTrackAdded = "mediaTrackAdded"),
    (q.ActiveSpeakersUpdate = "activeSpeakersUpdate"),
    (q.DataPacketReceived = "dataPacketReceived"),
    (q.RTPVideoMapUpdate = "rtpVideoMapUpdate"),
    (q.DCBufferStatusChanged = "dcBufferStatusChanged"),
    (q.ParticipantUpdate = "participantUpdate"),
    (q.RoomUpdate = "roomUpdate"),
    (q.SpeakersChanged = "speakersChanged"),
    (q.StreamStateChanged = "streamStateChanged"),
    (q.ConnectionQualityUpdate = "connectionQualityUpdate"),
    (q.SubscriptionError = "subscriptionError"),
    (q.SubscriptionPermissionUpdate = "subscriptionPermissionUpdate"),
    (q.RemoteMute = "remoteMute"),
    (q.SubscribedQualityUpdate = "subscribedQualityUpdate"),
    (q.LocalTrackUnpublished = "localTrackUnpublished"),
    (q.LocalTrackSubscribed = "localTrackSubscribed"),
    (q.Offline = "offline"),
    (q.SignalRequestResponse = "signalRequestResponse"),
    (q.SignalConnected = "signalConnected");
})(EngineEvent || (EngineEvent = {}));
var TrackEvent;
(function (q) {
  (q.Message = "message"),
    (q.Muted = "muted"),
    (q.Unmuted = "unmuted"),
    (q.Restarted = "restarted"),
    (q.Ended = "ended"),
    (q.Subscribed = "subscribed"),
    (q.Unsubscribed = "unsubscribed"),
    (q.UpdateSettings = "updateSettings"),
    (q.UpdateSubscription = "updateSubscription"),
    (q.AudioPlaybackStarted = "audioPlaybackStarted"),
    (q.AudioPlaybackFailed = "audioPlaybackFailed"),
    (q.AudioSilenceDetected = "audioSilenceDetected"),
    (q.VisibilityChanged = "visibilityChanged"),
    (q.VideoDimensionsChanged = "videoDimensionsChanged"),
    (q.VideoPlaybackStarted = "videoPlaybackStarted"),
    (q.VideoPlaybackFailed = "videoPlaybackFailed"),
    (q.ElementAttached = "elementAttached"),
    (q.ElementDetached = "elementDetached"),
    (q.UpstreamPaused = "upstreamPaused"),
    (q.UpstreamResumed = "upstreamResumed"),
    (q.SubscriptionPermissionChanged = "subscriptionPermissionChanged"),
    (q.SubscriptionStatusChanged = "subscriptionStatusChanged"),
    (q.SubscriptionFailed = "subscriptionFailed"),
    (q.TrackProcessorUpdate = "trackProcessorUpdate"),
    (q.AudioTrackFeatureUpdate = "audioTrackFeatureUpdate"),
    (q.TranscriptionReceived = "transcriptionReceived"),
    (q.TimeSyncUpdate = "timeSyncUpdate");
})(TrackEvent || (TrackEvent = {}));
function cloneDeep(q) {
  return typeof q > "u"
    ? q
    : typeof structuredClone == "function"
    ? structuredClone(q)
    : JSON.parse(JSON.stringify(q));
}
const commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
let browserDetails;
function getBrowser(q) {
  let U = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  if (typeof navigator > "u") return;
  const F = navigator.userAgent.toLowerCase();
  if (browserDetails === void 0 || U) {
    const B = browsersList.find((V) => {
      let { test: j } = V;
      return j.test(F);
    });
    browserDetails = B == null ? void 0 : B.describe(F);
  }
  return browserDetails;
}
const browsersList = [
  {
    test: /firefox|iceweasel|fxios/i,
    describe(q) {
      return {
        name: "Firefox",
        version: getMatch(
          /(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i,
          q
        ),
        os: q.toLowerCase().includes("fxios") ? "iOS" : void 0,
        osVersion: getOSVersion(q),
      };
    },
  },
  {
    test: /chrom|crios|crmo/i,
    describe(q) {
      return {
        name: "Chrome",
        version: getMatch(
          /(?:chrome|chromium|crios|crmo)\/(\d+(\.?_?\d+)+)/i,
          q
        ),
        os: q.toLowerCase().includes("crios") ? "iOS" : void 0,
        osVersion: getOSVersion(q),
      };
    },
  },
  {
    test: /safari|applewebkit/i,
    describe(q) {
      return {
        name: "Safari",
        version: getMatch(commonVersionIdentifier, q),
        os: q.includes("mobile/") ? "iOS" : "macOS",
        osVersion: getOSVersion(q),
      };
    },
  },
];
function getMatch(q, U) {
  let F = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  const B = U.match(q);
  return (B && B.length >= F && B[F]) || "";
}
function getOSVersion(q) {
  return q.includes("mac os")
    ? getMatch(/\(.+?(\d+_\d+(:?_\d+)?)/, q, 1).replace(/_/g, ".")
    : void 0;
}
var version$1 = "2.11.3";
const version = version$1,
  protocolVersion = 15;
class CriticalTimers {}
CriticalTimers.setTimeout = function () {
  return setTimeout(...arguments);
};
CriticalTimers.setInterval = function () {
  return setInterval(...arguments);
};
CriticalTimers.clearTimeout = function () {
  return clearTimeout(...arguments);
};
CriticalTimers.clearInterval = function () {
  return clearInterval(...arguments);
};
const BACKGROUND_REACTION_DELAY = 5e3,
  recycledElements = [];
var VideoQuality;
(function (q) {
  (q[(q.LOW = 0)] = "LOW"),
    (q[(q.MEDIUM = 1)] = "MEDIUM"),
    (q[(q.HIGH = 2)] = "HIGH");
})(VideoQuality || (VideoQuality = {}));
class Track extends eventsExports.EventEmitter {
  constructor(U, F) {
    let B = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var V;
    super(),
      (this.attachedElements = []),
      (this.isMuted = !1),
      (this.streamState = Track.StreamState.Active),
      (this.isInBackground = !1),
      (this._currentBitrate = 0),
      (this.log = livekitLogger),
      (this.appVisibilityChangedListener = () => {
        this.backgroundTimeout && clearTimeout(this.backgroundTimeout),
          document.visibilityState === "hidden"
            ? (this.backgroundTimeout = setTimeout(
                () => this.handleAppVisibilityChanged(),
                BACKGROUND_REACTION_DELAY
              ))
            : this.handleAppVisibilityChanged();
      }),
      (this.log = getLogger(
        (V = B.loggerName) !== null && V !== void 0 ? V : LoggerNames.Track
      )),
      (this.loggerContextCb = B.loggerContextCb),
      this.setMaxListeners(100),
      (this.kind = F),
      (this._mediaStreamTrack = U),
      (this._mediaStreamID = U.id),
      (this.source = Track.Source.Unknown);
  }
  get logContext() {
    var U;
    return Object.assign(
      Object.assign(
        {},
        (U = this.loggerContextCb) === null || U === void 0
          ? void 0
          : U.call(this)
      ),
      getLogContextFromTrack(this)
    );
  }
  get currentBitrate() {
    return this._currentBitrate;
  }
  get mediaStreamTrack() {
    return this._mediaStreamTrack;
  }
  get mediaStreamID() {
    return this._mediaStreamID;
  }
  attach(U) {
    let F = "audio";
    this.kind === Track.Kind.Video && (F = "video"),
      this.attachedElements.length === 0 &&
        this.kind === Track.Kind.Video &&
        this.addAppVisibilityListener(),
      U ||
        (F === "audio" &&
          (recycledElements.forEach((j) => {
            j.parentElement === null && !U && (U = j);
          }),
          U && recycledElements.splice(recycledElements.indexOf(U), 1)),
        U || (U = document.createElement(F))),
      this.attachedElements.includes(U) || this.attachedElements.push(U),
      attachToElement(this.mediaStreamTrack, U);
    const B = U.srcObject.getTracks(),
      V = B.some((j) => j.kind === "audio");
    return (
      U.play()
        .then(() => {
          this.emit(
            V
              ? TrackEvent.AudioPlaybackStarted
              : TrackEvent.VideoPlaybackStarted
          );
        })
        .catch((j) => {
          j.name === "NotAllowedError"
            ? this.emit(
                V
                  ? TrackEvent.AudioPlaybackFailed
                  : TrackEvent.VideoPlaybackFailed,
                j
              )
            : j.name === "AbortError"
            ? livekitLogger.debug(
                "".concat(
                  V ? "audio" : "video",
                  " playback aborted, likely due to new play request"
                )
              )
            : livekitLogger.warn(
                "could not playback ".concat(V ? "audio" : "video"),
                j
              ),
            V &&
              U &&
              B.some(($) => $.kind === "video") &&
              j.name === "NotAllowedError" &&
              ((U.muted = !0), U.play().catch(() => {}));
        }),
      this.emit(TrackEvent.ElementAttached, U),
      U
    );
  }
  detach(U) {
    try {
      if (U) {
        detachTrack(this.mediaStreamTrack, U);
        const B = this.attachedElements.indexOf(U);
        return (
          B >= 0 &&
            (this.attachedElements.splice(B, 1),
            this.recycleElement(U),
            this.emit(TrackEvent.ElementDetached, U)),
          U
        );
      }
      const F = [];
      return (
        this.attachedElements.forEach((B) => {
          detachTrack(this.mediaStreamTrack, B),
            F.push(B),
            this.recycleElement(B),
            this.emit(TrackEvent.ElementDetached, B);
        }),
        (this.attachedElements = []),
        F
      );
    } finally {
      this.attachedElements.length === 0 && this.removeAppVisibilityListener();
    }
  }
  stop() {
    this.stopMonitor(), this._mediaStreamTrack.stop();
  }
  enable() {
    this._mediaStreamTrack.enabled = !0;
  }
  disable() {
    this._mediaStreamTrack.enabled = !1;
  }
  stopMonitor() {
    this.monitorInterval && clearInterval(this.monitorInterval),
      this.timeSyncHandle && cancelAnimationFrame(this.timeSyncHandle);
  }
  updateLoggerOptions(U) {
    U.loggerName && (this.log = getLogger(U.loggerName)),
      U.loggerContextCb && (this.loggerContextCb = U.loggerContextCb);
  }
  recycleElement(U) {
    if (U instanceof HTMLAudioElement) {
      let F = !0;
      U.pause(),
        recycledElements.forEach((B) => {
          B.parentElement || (F = !1);
        }),
        F && recycledElements.push(U);
    }
  }
  handleAppVisibilityChanged() {
    return __awaiter$1(this, void 0, void 0, function* () {
      (this.isInBackground = document.visibilityState === "hidden"),
        !this.isInBackground &&
          this.kind === Track.Kind.Video &&
          setTimeout(
            () =>
              this.attachedElements.forEach((U) => U.play().catch(() => {})),
            0
          );
    });
  }
  addAppVisibilityListener() {
    isWeb()
      ? ((this.isInBackground = document.visibilityState === "hidden"),
        document.addEventListener(
          "visibilitychange",
          this.appVisibilityChangedListener
        ))
      : (this.isInBackground = !1);
  }
  removeAppVisibilityListener() {
    isWeb() &&
      document.removeEventListener(
        "visibilitychange",
        this.appVisibilityChangedListener
      );
  }
}
function attachToElement(q, U) {
  let F;
  U.srcObject instanceof MediaStream
    ? (F = U.srcObject)
    : (F = new MediaStream());
  let B;
  q.kind === "audio" ? (B = F.getAudioTracks()) : (B = F.getVideoTracks()),
    B.includes(q) ||
      (B.forEach((V) => {
        F.removeTrack(V);
      }),
      F.addTrack(q)),
    (!isSafari() || !(U instanceof HTMLVideoElement)) && (U.autoplay = !0),
    (U.muted = F.getAudioTracks().length === 0),
    U instanceof HTMLVideoElement && (U.playsInline = !0),
    U.srcObject !== F &&
      ((U.srcObject = F),
      (isSafari() || isFireFox()) &&
        U instanceof HTMLVideoElement &&
        setTimeout(() => {
          (U.srcObject = F), U.play().catch(() => {});
        }, 0));
}
function detachTrack(q, U) {
  if (U.srcObject instanceof MediaStream) {
    const F = U.srcObject;
    F.removeTrack(q),
      F.getTracks().length > 0 ? (U.srcObject = F) : (U.srcObject = null);
  }
}
(function (q) {
  let U;
  (function (G) {
    (G.Audio = "audio"), (G.Video = "video"), (G.Unknown = "unknown");
  })((U = q.Kind || (q.Kind = {})));
  let F;
  (function (G) {
    (G.Camera = "camera"),
      (G.Microphone = "microphone"),
      (G.ScreenShare = "screen_share"),
      (G.ScreenShareAudio = "screen_share_audio"),
      (G.Unknown = "unknown");
  })((F = q.Source || (q.Source = {})));
  let B;
  (function (G) {
    (G.Active = "active"), (G.Paused = "paused"), (G.Unknown = "unknown");
  })((B = q.StreamState || (q.StreamState = {})));
  function V(G) {
    switch (G) {
      case U.Audio:
        return TrackType.AUDIO;
      case U.Video:
        return TrackType.VIDEO;
      default:
        return TrackType.DATA;
    }
  }
  q.kindToProto = V;
  function j(G) {
    switch (G) {
      case TrackType.AUDIO:
        return U.Audio;
      case TrackType.VIDEO:
        return U.Video;
      default:
        return U.Unknown;
    }
  }
  q.kindFromProto = j;
  function $(G) {
    switch (G) {
      case F.Camera:
        return TrackSource.CAMERA;
      case F.Microphone:
        return TrackSource.MICROPHONE;
      case F.ScreenShare:
        return TrackSource.SCREEN_SHARE;
      case F.ScreenShareAudio:
        return TrackSource.SCREEN_SHARE_AUDIO;
      default:
        return TrackSource.UNKNOWN;
    }
  }
  q.sourceToProto = $;
  function W(G) {
    switch (G) {
      case TrackSource.CAMERA:
        return F.Camera;
      case TrackSource.MICROPHONE:
        return F.Microphone;
      case TrackSource.SCREEN_SHARE:
        return F.ScreenShare;
      case TrackSource.SCREEN_SHARE_AUDIO:
        return F.ScreenShareAudio;
      default:
        return F.Unknown;
    }
  }
  q.sourceFromProto = W;
  function K(G) {
    switch (G) {
      case StreamState.ACTIVE:
        return B.Active;
      case StreamState.PAUSED:
        return B.Paused;
      default:
        return B.Unknown;
    }
  }
  q.streamStateFromProto = K;
})(Track || (Track = {}));
class VideoPreset {
  constructor(U, F, B, V, j) {
    if (typeof U == "object")
      (this.width = U.width),
        (this.height = U.height),
        (this.aspectRatio = U.aspectRatio),
        (this.encoding = {
          maxBitrate: U.maxBitrate,
          maxFramerate: U.maxFramerate,
          priority: U.priority,
        });
    else if (F !== void 0 && B !== void 0)
      (this.width = U),
        (this.height = F),
        (this.aspectRatio = U / F),
        (this.encoding = { maxBitrate: B, maxFramerate: V, priority: j });
    else
      throw new TypeError(
        "Unsupported options: provide at least width, height and maxBitrate"
      );
  }
  get resolution() {
    return {
      width: this.width,
      height: this.height,
      frameRate: this.encoding.maxFramerate,
      aspectRatio: this.aspectRatio,
    };
  }
}
const backupCodecs = ["vp8", "h264"],
  videoCodecs = ["vp8", "h264", "vp9", "av1"];
function isBackupCodec(q) {
  return !!backupCodecs.find((U) => U === q);
}
var BackupCodecPolicy;
(function (q) {
  (q[(q.PREFER_REGRESSION = 0)] = "PREFER_REGRESSION"),
    (q[(q.SIMULCAST = 1)] = "SIMULCAST"),
    (q[(q.REGRESSION = 2)] = "REGRESSION");
})(BackupCodecPolicy || (BackupCodecPolicy = {}));
var AudioPresets;
(function (q) {
  (q.telephone = { maxBitrate: 12e3 }),
    (q.speech = { maxBitrate: 24e3 }),
    (q.music = { maxBitrate: 48e3 }),
    (q.musicStereo = { maxBitrate: 64e3 }),
    (q.musicHighQuality = { maxBitrate: 96e3 }),
    (q.musicHighQualityStereo = { maxBitrate: 128e3 });
})(AudioPresets || (AudioPresets = {}));
const VideoPresets = {
    h90: new VideoPreset(160, 90, 9e4, 20),
    h180: new VideoPreset(320, 180, 16e4, 20),
    h216: new VideoPreset(384, 216, 18e4, 20),
    h360: new VideoPreset(640, 360, 45e4, 20),
    h540: new VideoPreset(960, 540, 8e5, 25),
    h720: new VideoPreset(1280, 720, 17e5, 30),
    h1080: new VideoPreset(1920, 1080, 3e6, 30),
    h1440: new VideoPreset(2560, 1440, 5e6, 30),
    h2160: new VideoPreset(3840, 2160, 8e6, 30),
  },
  VideoPresets43 = {
    h120: new VideoPreset(160, 120, 7e4, 20),
    h180: new VideoPreset(240, 180, 125e3, 20),
    h240: new VideoPreset(320, 240, 14e4, 20),
    h360: new VideoPreset(480, 360, 33e4, 20),
    h480: new VideoPreset(640, 480, 5e5, 20),
    h540: new VideoPreset(720, 540, 6e5, 25),
    h720: new VideoPreset(960, 720, 13e5, 30),
    h1080: new VideoPreset(1440, 1080, 23e5, 30),
    h1440: new VideoPreset(1920, 1440, 38e5, 30),
  },
  ScreenSharePresets = {
    h360fps3: new VideoPreset(640, 360, 2e5, 3, "medium"),
    h360fps15: new VideoPreset(640, 360, 4e5, 15, "medium"),
    h720fps5: new VideoPreset(1280, 720, 8e5, 5, "medium"),
    h720fps15: new VideoPreset(1280, 720, 15e5, 15, "medium"),
    h720fps30: new VideoPreset(1280, 720, 2e6, 30, "medium"),
    h1080fps15: new VideoPreset(1920, 1080, 25e5, 15, "medium"),
    h1080fps30: new VideoPreset(1920, 1080, 5e6, 30, "medium"),
    original: new VideoPreset(0, 0, 7e6, 30, "medium"),
  },
  separator = "|",
  ddExtensionURI =
    "https://aomediacodec.github.io/av1-rtp-spec/#dependency-descriptor-rtp-header-extension";
function unpackStreamId(q) {
  const U = q.split(separator);
  return U.length > 1 ? [U[0], q.substr(U[0].length + 1)] : [q, ""];
}
function sleep$1(q) {
  return __awaiter$1(this, void 0, void 0, function* () {
    return new Promise((U) => CriticalTimers.setTimeout(U, q));
  });
}
function supportsTransceiver() {
  return "addTransceiver" in RTCPeerConnection.prototype;
}
function supportsAddTrack() {
  return "addTrack" in RTCPeerConnection.prototype;
}
function supportsAV1() {
  if (!("getCapabilities" in RTCRtpSender) || isSafari()) return !1;
  const q = RTCRtpSender.getCapabilities("video");
  let U = !1;
  if (q) {
    for (const F of q.codecs)
      if (F.mimeType === "video/AV1") {
        U = !0;
        break;
      }
  }
  return U;
}
function supportsVP9() {
  if (!("getCapabilities" in RTCRtpSender) || isFireFox()) return !1;
  if (isSafari()) {
    const F = getBrowser();
    if (F != null && F.version && compareVersions(F.version, "16") < 0)
      return !1;
  }
  const q = RTCRtpSender.getCapabilities("video");
  let U = !1;
  if (q) {
    for (const F of q.codecs)
      if (F.mimeType === "video/VP9") {
        U = !0;
        break;
      }
  }
  return U;
}
function isSVCCodec(q) {
  return q === "av1" || q === "vp9";
}
function supportsSetSinkId(q) {
  return document
    ? (q || (q = document.createElement("audio")), "setSinkId" in q)
    : !1;
}
function isBrowserSupported() {
  return typeof RTCPeerConnection > "u"
    ? !1
    : supportsTransceiver() || supportsAddTrack();
}
function isFireFox() {
  var q;
  return (
    ((q = getBrowser()) === null || q === void 0 ? void 0 : q.name) ===
    "Firefox"
  );
}
function isSafari() {
  var q;
  return (
    ((q = getBrowser()) === null || q === void 0 ? void 0 : q.name) === "Safari"
  );
}
function isSafari17() {
  const q = getBrowser();
  return (
    (q == null ? void 0 : q.name) === "Safari" && q.version.startsWith("17.")
  );
}
function isMobile() {
  var q, U;
  return isWeb()
    ? (U =
        (q = navigator.userAgentData) === null || q === void 0
          ? void 0
          : q.mobile) !== null && U !== void 0
      ? U
      : /Tablet|iPad|Mobile|Android|BlackBerry/.test(navigator.userAgent)
    : !1;
}
function isE2EESimulcastSupported() {
  const q = getBrowser(),
    U = "17.2";
  if (q)
    return (q.name !== "Safari" && q.os !== "iOS") ||
      (q.os === "iOS" && q.osVersion && compareVersions(U, q.osVersion) >= 0)
      ? !0
      : q.name === "Safari" && compareVersions(U, q.version) >= 0;
}
function isWeb() {
  return typeof document < "u";
}
function isReactNative() {
  return navigator.product == "ReactNative";
}
function isCloud(q) {
  return (
    q.hostname.endsWith(".livekit.cloud") || q.hostname.endsWith(".livekit.run")
  );
}
function getLKReactNativeInfo() {
  if (global && global.LiveKitReactNativeGlobal)
    return global.LiveKitReactNativeGlobal;
}
function getReactNativeOs() {
  if (!isReactNative()) return;
  let q = getLKReactNativeInfo();
  if (q) return q.platform;
}
function getDevicePixelRatio() {
  if (isWeb()) return window.devicePixelRatio;
  if (isReactNative()) {
    let q = getLKReactNativeInfo();
    if (q) return q.devicePixelRatio;
  }
  return 1;
}
function compareVersions(q, U) {
  const F = q.split("."),
    B = U.split("."),
    V = Math.min(F.length, B.length);
  for (let j = 0; j < V; ++j) {
    const $ = parseInt(F[j], 10),
      W = parseInt(B[j], 10);
    if ($ > W) return 1;
    if ($ < W) return -1;
    if (j === V - 1 && $ === W) return 0;
  }
  return q === "" && U !== ""
    ? -1
    : U === ""
    ? 1
    : F.length == B.length
    ? 0
    : F.length < B.length
    ? -1
    : 1;
}
function roDispatchCallback(q) {
  for (const U of q) U.target.handleResize(U);
}
function ioDispatchCallback(q) {
  for (const U of q) U.target.handleVisibilityChanged(U);
}
let resizeObserver = null;
const getResizeObserver = () => (
  resizeObserver || (resizeObserver = new ResizeObserver(roDispatchCallback)),
  resizeObserver
);
let intersectionObserver = null;
const getIntersectionObserver = () => (
  intersectionObserver ||
    (intersectionObserver = new IntersectionObserver(ioDispatchCallback, {
      root: null,
      rootMargin: "0px",
    })),
  intersectionObserver
);
function getClientInfo() {
  var q;
  const U = new ClientInfo({
    sdk: ClientInfo_SDK.JS,
    protocol: protocolVersion,
    version,
  });
  return (
    isReactNative() &&
      (U.os = (q = getReactNativeOs()) !== null && q !== void 0 ? q : ""),
    U
  );
}
function createDummyVideoStreamTrack() {
  let q = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 16,
    U = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 16,
    F = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1,
    B = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
  const V = document.createElement("canvas");
  (V.width = q), (V.height = U);
  const j = V.getContext("2d");
  j == null || j.fillRect(0, 0, V.width, V.height),
    B &&
      j &&
      (j.beginPath(),
      j.arc(q / 2, U / 2, 50, 0, Math.PI * 2, !0),
      j.closePath(),
      (j.fillStyle = "grey"),
      j.fill());
  const $ = V.captureStream(),
    [W] = $.getTracks();
  if (!W) throw Error("Could not get empty media stream video track");
  return (W.enabled = F), W;
}
let emptyAudioStreamTrack;
function getEmptyAudioStreamTrack() {
  if (!emptyAudioStreamTrack) {
    const q = new AudioContext(),
      U = q.createOscillator(),
      F = q.createGain();
    F.gain.setValueAtTime(0, 0);
    const B = q.createMediaStreamDestination();
    if (
      (U.connect(F),
      F.connect(B),
      U.start(),
      ([emptyAudioStreamTrack] = B.stream.getAudioTracks()),
      !emptyAudioStreamTrack)
    )
      throw Error("Could not get empty media stream audio track");
    emptyAudioStreamTrack.enabled = !1;
  }
  return emptyAudioStreamTrack.clone();
}
class Future {
  constructor(U, F) {
    (this.onFinally = F),
      (this.promise = new Promise((B, V) =>
        __awaiter$1(this, void 0, void 0, function* () {
          (this.resolve = B), (this.reject = V), U && (yield U(B, V));
        })
      ).finally(() => {
        var B;
        return (B = this.onFinally) === null || B === void 0
          ? void 0
          : B.call(this);
      }));
  }
}
function isVideoCodec(q) {
  return videoCodecs.includes(q);
}
function unwrapConstraint(q) {
  if (typeof q == "string" || typeof q == "number") return q;
  if (Array.isArray(q)) return q[0];
  if (q.exact) return Array.isArray(q.exact) ? q.exact[0] : q.exact;
  if (q.ideal) return Array.isArray(q.ideal) ? q.ideal[0] : q.ideal;
  throw Error("could not unwrap constraint");
}
function toWebsocketUrl(q) {
  return q.startsWith("http") ? q.replace(/^(http)/, "ws") : q;
}
function toHttpUrl(q) {
  return q.startsWith("ws") ? q.replace(/^(ws)/, "http") : q;
}
function extractTranscriptionSegments(q, U) {
  return q.segments.map((F) => {
    let { id: B, text: V, language: j, startTime: $, endTime: W, final: K } = F;
    var G;
    const Q = (G = U.get(B)) !== null && G !== void 0 ? G : Date.now(),
      z = Date.now();
    return (
      K ? U.delete(B) : U.set(B, Q),
      {
        id: B,
        text: V,
        startTime: Number.parseInt($.toString()),
        endTime: Number.parseInt(W.toString()),
        final: K,
        language: j,
        firstReceivedTime: Q,
        lastReceivedTime: z,
      }
    );
  });
}
function extractChatMessage(q) {
  const { id: U, timestamp: F, message: B, editTimestamp: V } = q;
  return {
    id: U,
    timestamp: Number.parseInt(F.toString()),
    editTimestamp: V ? Number.parseInt(V.toString()) : void 0,
    message: B,
  };
}
function getDisconnectReasonFromConnectionError(q) {
  switch (q.reason) {
    case ConnectionErrorReason.LeaveRequest:
      return q.context;
    case ConnectionErrorReason.Cancelled:
      return DisconnectReason.CLIENT_INITIATED;
    case ConnectionErrorReason.NotAllowed:
      return DisconnectReason.USER_REJECTED;
    case ConnectionErrorReason.ServerUnreachable:
      return DisconnectReason.JOIN_FAILURE;
    default:
      return DisconnectReason.UNKNOWN_REASON;
  }
}
function bigIntToNumber(q) {
  return q !== void 0 ? Number(q) : void 0;
}
function numberToBigInt(q) {
  return q !== void 0 ? BigInt(q) : void 0;
}
function isLocalTrack(q) {
  return !!q && !(q instanceof MediaStreamTrack) && q.isLocal;
}
function isAudioTrack(q) {
  return !!q && q.kind == Track.Kind.Audio;
}
function isVideoTrack(q) {
  return !!q && q.kind == Track.Kind.Video;
}
function isLocalVideoTrack(q) {
  return isLocalTrack(q) && isVideoTrack(q);
}
function isLocalAudioTrack(q) {
  return isLocalTrack(q) && isAudioTrack(q);
}
function isRemoteTrack(q) {
  return !!q && !q.isLocal;
}
function isRemotePub(q) {
  return !!q && !q.isLocal;
}
function isRemoteVideoTrack(q) {
  return isRemoteTrack(q) && isVideoTrack(q);
}
function isLocalParticipant(q) {
  return q.isLocal;
}
function splitUtf8(q, U) {
  const F = [];
  let B = new TextEncoder().encode(q);
  for (; B.length > U; ) {
    let V = U;
    for (; V > 0; ) {
      const j = B[V];
      if (j !== void 0 && (j & 192) !== 128) break;
      V--;
    }
    F.push(B.slice(0, V)), (B = B.slice(V));
  }
  return B.length > 0 && F.push(B), F;
}
function mergeDefaultOptions(q, U, F) {
  var B, V, j, $;
  const {
      optionsWithoutProcessor: W,
      audioProcessor: K,
      videoProcessor: G,
    } = extractProcessorsFromOptions(q ?? {}),
    Q = U == null ? void 0 : U.processor,
    z = F == null ? void 0 : F.processor,
    H = W ?? {};
  return (
    H.audio === !0 && (H.audio = {}),
    H.video === !0 && (H.video = {}),
    H.audio &&
      (mergeObjectWithoutOverwriting(H.audio, U),
      ((B = (j = H.audio).deviceId) !== null && B !== void 0) ||
        (j.deviceId = { ideal: "default" }),
      (K || Q) && (H.audio.processor = K ?? Q)),
    H.video &&
      (mergeObjectWithoutOverwriting(H.video, F),
      ((V = ($ = H.video).deviceId) !== null && V !== void 0) ||
        ($.deviceId = { ideal: "default" }),
      (G || z) && (H.video.processor = G ?? z)),
    H
  );
}
function mergeObjectWithoutOverwriting(q, U) {
  return (
    Object.keys(U).forEach((F) => {
      q[F] === void 0 && (q[F] = U[F]);
    }),
    q
  );
}
function constraintsForOptions(q) {
  var U, F, B, V;
  const j = {};
  if (q.video)
    if (typeof q.video == "object") {
      const $ = {},
        W = $,
        K = q.video;
      Object.keys(K).forEach((G) => {
        switch (G) {
          case "resolution":
            mergeObjectWithoutOverwriting(W, K.resolution);
            break;
          default:
            W[G] = K[G];
        }
      }),
        (j.video = $),
        ((U = (B = j.video).deviceId) !== null && U !== void 0) ||
          (B.deviceId = { ideal: "default" });
    } else j.video = q.video ? { deviceId: { ideal: "default" } } : !1;
  else j.video = !1;
  return (
    q.audio
      ? typeof q.audio == "object"
        ? ((j.audio = q.audio),
          ((F = (V = j.audio).deviceId) !== null && F !== void 0) ||
            (V.deviceId = { ideal: "default" }))
        : (j.audio = { deviceId: { ideal: "default" } })
      : (j.audio = !1),
    j
  );
}
function detectSilence(q) {
  return __awaiter$1(this, arguments, void 0, function (U) {
    let F =
      arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 200;
    return (function* () {
      const B = getNewAudioContext();
      if (B) {
        const V = B.createAnalyser();
        V.fftSize = 2048;
        const j = V.frequencyBinCount,
          $ = new Uint8Array(j);
        B.createMediaStreamSource(
          new MediaStream([U.mediaStreamTrack])
        ).connect(V),
          yield sleep$1(F),
          V.getByteTimeDomainData($);
        const K = $.some((G) => G !== 128 && G !== 0);
        return B.close(), !K;
      }
      return !1;
    })();
  });
}
function getNewAudioContext() {
  var q;
  const U =
    typeof window < "u" && (window.AudioContext || window.webkitAudioContext);
  if (U) {
    const F = new U({ latencyHint: "interactive" });
    if (
      F.state === "suspended" &&
      typeof window < "u" &&
      !((q = window.document) === null || q === void 0) &&
      q.body
    ) {
      const B = () =>
        __awaiter$1(this, void 0, void 0, function* () {
          var V;
          try {
            F.state === "suspended" && (yield F.resume());
          } catch (j) {
            console.warn("Error trying to auto-resume audio context", j);
          }
          (V = window.document.body) === null ||
            V === void 0 ||
            V.removeEventListener("click", B);
        });
      window.document.body.addEventListener("click", B);
    }
    return F;
  }
}
function sourceToKind(q) {
  return q === Track.Source.Microphone
    ? "audioinput"
    : q === Track.Source.Camera
    ? "videoinput"
    : void 0;
}
function screenCaptureToDisplayMediaStreamOptions(q) {
  var U, F;
  let B = (U = q.video) !== null && U !== void 0 ? U : !0;
  return (
    q.resolution &&
      q.resolution.width > 0 &&
      q.resolution.height > 0 &&
      ((B = typeof B == "boolean" ? {} : B),
      isSafari()
        ? (B = Object.assign(Object.assign({}, B), {
            width: { max: q.resolution.width },
            height: { max: q.resolution.height },
            frameRate: q.resolution.frameRate,
          }))
        : (B = Object.assign(Object.assign({}, B), {
            width: { ideal: q.resolution.width },
            height: { ideal: q.resolution.height },
            frameRate: q.resolution.frameRate,
          }))),
    {
      audio: (F = q.audio) !== null && F !== void 0 ? F : !1,
      video: B,
      controller: q.controller,
      selfBrowserSurface: q.selfBrowserSurface,
      surfaceSwitching: q.surfaceSwitching,
      systemAudio: q.systemAudio,
      preferCurrentTab: q.preferCurrentTab,
    }
  );
}
function mimeTypeToVideoCodecString(q) {
  return q.split("/")[1].toLowerCase();
}
function getTrackPublicationInfo(q) {
  const U = [];
  return (
    q.forEach((F) => {
      F.track !== void 0 &&
        U.push(
          new TrackPublishedResponse({
            cid: F.track.mediaStreamID,
            track: F.trackInfo,
          })
        );
    }),
    U
  );
}
function getLogContextFromTrack(q) {
  return "mediaStreamTrack" in q
    ? {
        trackID: q.sid,
        source: q.source,
        muted: q.isMuted,
        enabled: q.mediaStreamTrack.enabled,
        kind: q.kind,
        streamID: q.mediaStreamID,
        streamTrackID: q.mediaStreamTrack.id,
      }
    : {
        trackID: q.trackSid,
        enabled: q.isEnabled,
        muted: q.isMuted,
        trackInfo: Object.assign(
          {
            mimeType: q.mimeType,
            name: q.trackName,
            encrypted: q.isEncrypted,
            kind: q.kind,
            source: q.source,
          },
          q.track ? getLogContextFromTrack(q.track) : {}
        ),
      };
}
function supportsSynchronizationSources() {
  return (
    typeof RTCRtpReceiver < "u" && "getSynchronizationSources" in RTCRtpReceiver
  );
}
function diffAttributes(q, U) {
  var F;
  q === void 0 && (q = {}), U === void 0 && (U = {});
  const B = [...Object.keys(U), ...Object.keys(q)],
    V = {};
  for (const j of B)
    q[j] !== U[j] && (V[j] = (F = U[j]) !== null && F !== void 0 ? F : "");
  return V;
}
function extractProcessorsFromOptions(q) {
  const U = Object.assign({}, q);
  let F, B;
  return (
    typeof U.audio == "object" &&
      U.audio.processor &&
      ((F = U.audio.processor),
      (U.audio = Object.assign(Object.assign({}, U.audio), {
        processor: void 0,
      }))),
    typeof U.video == "object" &&
      U.video.processor &&
      ((B = U.video.processor),
      (U.video = Object.assign(Object.assign({}, U.video), {
        processor: void 0,
      }))),
    {
      audioProcessor: F,
      videoProcessor: B,
      optionsWithoutProcessor: cloneDeep(U),
    }
  );
}
function getTrackSourceFromProto(q) {
  switch (q) {
    case TrackSource.CAMERA:
      return Track.Source.Camera;
    case TrackSource.MICROPHONE:
      return Track.Source.Microphone;
    case TrackSource.SCREEN_SHARE:
      return Track.Source.ScreenShare;
    case TrackSource.SCREEN_SHARE_AUDIO:
      return Track.Source.ScreenShareAudio;
    default:
      return Track.Source.Unknown;
  }
}
class E2EEManager extends eventsExports.EventEmitter {
  constructor(U) {
    super(),
      (this.onWorkerMessage = (F) => {
        var B, V;
        const { kind: j, data: $ } = F.data;
        switch (j) {
          case "error":
            livekitLogger.error($.error.message),
              this.emit(EncryptionEvent.EncryptionError, $.error);
            break;
          case "initAck":
            $.enabled &&
              this.keyProvider.getKeys().forEach((W) => {
                this.postKey(W);
              });
            break;
          case "enable":
            if (
              ($.enabled &&
                this.keyProvider.getKeys().forEach((W) => {
                  this.postKey(W);
                }),
              this.encryptionEnabled !== $.enabled &&
                $.participantIdentity ===
                  ((B = this.room) === null || B === void 0
                    ? void 0
                    : B.localParticipant.identity))
            )
              this.emit(
                EncryptionEvent.ParticipantEncryptionStatusChanged,
                $.enabled,
                this.room.localParticipant
              ),
                (this.encryptionEnabled = $.enabled);
            else if ($.participantIdentity) {
              const W =
                (V = this.room) === null || V === void 0
                  ? void 0
                  : V.getParticipantByIdentity($.participantIdentity);
              if (!W)
                throw TypeError(
                  "couldn't set encryption status, participant not found".concat(
                    $.participantIdentity
                  )
                );
              this.emit(
                EncryptionEvent.ParticipantEncryptionStatusChanged,
                $.enabled,
                W
              );
            }
            break;
          case "ratchetKey":
            this.keyProvider.emit(
              KeyProviderEvent.KeyRatcheted,
              $.material,
              $.keyIndex
            );
            break;
        }
      }),
      (this.onWorkerError = (F) => {
        livekitLogger.error("e2ee worker encountered an error:", {
          error: F.error,
        }),
          this.emit(EncryptionEvent.EncryptionError, F.error);
      }),
      (this.keyProvider = U.keyProvider),
      (this.worker = U.worker),
      (this.encryptionEnabled = !1);
  }
  setup(U) {
    if (!isE2EESupported())
      throw new DeviceUnsupportedError(
        "tried to setup end-to-end encryption on an unsupported browser"
      );
    if ((livekitLogger.info("setting up e2ee"), U !== this.room)) {
      (this.room = U), this.setupEventListeners(U, this.keyProvider);
      const F = {
        kind: "init",
        data: {
          keyProviderOptions: this.keyProvider.getOptions(),
          loglevel: workerLogger.getLevel(),
        },
      };
      this.worker &&
        (livekitLogger.info("initializing worker", { worker: this.worker }),
        (this.worker.onmessage = this.onWorkerMessage),
        (this.worker.onerror = this.onWorkerError),
        this.worker.postMessage(F));
    }
  }
  setParticipantCryptorEnabled(U, F) {
    livekitLogger.debug(
      "set e2ee to ".concat(U, " for participant ").concat(F)
    ),
      this.postEnable(U, F);
  }
  setSifTrailer(U) {
    !U || U.length === 0
      ? livekitLogger.warn("ignoring server sent trailer as it's empty")
      : this.postSifTrailer(U);
  }
  setupEngine(U) {
    U.on(EngineEvent.RTPVideoMapUpdate, (F) => {
      this.postRTPMap(F);
    });
  }
  setupEventListeners(U, F) {
    U.on(RoomEvent.TrackPublished, (B, V) =>
      this.setParticipantCryptorEnabled(
        B.trackInfo.encryption !== Encryption_Type.NONE,
        V.identity
      )
    ),
      U.on(RoomEvent.ConnectionStateChanged, (B) => {
        B === ConnectionState.Connected &&
          U.remoteParticipants.forEach((V) => {
            V.trackPublications.forEach((j) => {
              this.setParticipantCryptorEnabled(
                j.trackInfo.encryption !== Encryption_Type.NONE,
                V.identity
              );
            });
          });
      })
        .on(RoomEvent.TrackUnsubscribed, (B, V, j) => {
          var $;
          const W = {
            kind: "removeTransform",
            data: { participantIdentity: j.identity, trackId: B.mediaStreamID },
          };
          ($ = this.worker) === null || $ === void 0 || $.postMessage(W);
        })
        .on(RoomEvent.TrackSubscribed, (B, V, j) => {
          this.setupE2EEReceiver(B, j.identity, V.trackInfo);
        })
        .on(RoomEvent.SignalConnected, () => {
          if (!this.room)
            throw new TypeError(
              "expected room to be present on signal connect"
            );
          F.getKeys().forEach((B) => {
            this.postKey(B);
          }),
            this.setParticipantCryptorEnabled(
              this.room.localParticipant.isE2EEEnabled,
              this.room.localParticipant.identity
            );
        }),
      U.localParticipant.on(ParticipantEvent.LocalTrackPublished, (B) =>
        __awaiter$1(this, void 0, void 0, function* () {
          this.setupE2EESender(B.track, B.track.sender);
        })
      ),
      F.on(KeyProviderEvent.SetKey, (B) => this.postKey(B)).on(
        KeyProviderEvent.RatchetRequest,
        (B, V) =>
          this.postRatchetRequest(B, V, F.getOptions().allowKeyExtraction)
      );
  }
  postRatchetRequest(U, F, B) {
    if (!this.worker) throw Error("could not ratchet key, worker is missing");
    const V = {
      kind: "ratchetRequest",
      data: { participantIdentity: U, keyIndex: F, extractable: B },
    };
    this.worker.postMessage(V);
  }
  postKey(U) {
    let { key: F, participantIdentity: B, keyIndex: V } = U;
    var j;
    if (!this.worker) throw Error("could not set key, worker is missing");
    const $ = {
      kind: "setKey",
      data: {
        participantIdentity: B,
        isPublisher:
          B ===
          ((j = this.room) === null || j === void 0
            ? void 0
            : j.localParticipant.identity),
        key: F,
        keyIndex: V,
      },
    };
    this.worker.postMessage($);
  }
  postEnable(U, F) {
    if (this.worker) {
      const B = {
        kind: "enable",
        data: { enabled: U, participantIdentity: F },
      };
      this.worker.postMessage(B);
    } else
      throw new ReferenceError("failed to enable e2ee, worker is not ready");
  }
  postRTPMap(U) {
    var F;
    if (!this.worker)
      throw TypeError("could not post rtp map, worker is missing");
    if (
      !(
        !((F = this.room) === null || F === void 0) &&
        F.localParticipant.identity
      )
    )
      throw TypeError(
        "could not post rtp map, local participant identity is missing"
      );
    const B = {
      kind: "setRTPMap",
      data: {
        map: U,
        participantIdentity: this.room.localParticipant.identity,
      },
    };
    this.worker.postMessage(B);
  }
  postSifTrailer(U) {
    if (!this.worker)
      throw Error("could not post SIF trailer, worker is missing");
    const F = { kind: "setSifTrailer", data: { trailer: U } };
    this.worker.postMessage(F);
  }
  setupE2EEReceiver(U, F, B) {
    if (U.receiver) {
      if (!(B != null && B.mimeType) || B.mimeType === "")
        throw new TypeError(
          "MimeType missing from trackInfo, cannot set up E2EE cryptor"
        );
      this.handleReceiver(
        U.receiver,
        U.mediaStreamID,
        F,
        U.kind === "video" ? mimeTypeToVideoCodecString(B.mimeType) : void 0
      );
    }
  }
  setupE2EESender(U, F) {
    if (!isLocalTrack(U) || !F) {
      F || livekitLogger.warn("early return because sender is not ready");
      return;
    }
    this.handleSender(F, U.mediaStreamID, void 0);
  }
  handleReceiver(U, F, B, V) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (this.worker) {
        if (isScriptTransformSupported()) {
          const j = {
            kind: "decode",
            participantIdentity: B,
            trackId: F,
            codec: V,
          };
          U.transform = new RTCRtpScriptTransform(this.worker, j);
        } else {
          if (E2EE_FLAG in U && V) {
            const K = {
              kind: "updateCodec",
              data: { trackId: F, codec: V, participantIdentity: B },
            };
            this.worker.postMessage(K);
            return;
          }
          let j = U.writableStream,
            $ = U.readableStream;
          if (!j || !$) {
            const K = U.createEncodedStreams();
            (U.writableStream = K.writable),
              (j = K.writable),
              (U.readableStream = K.readable),
              ($ = K.readable);
          }
          const W = {
            kind: "decode",
            data: {
              readableStream: $,
              writableStream: j,
              trackId: F,
              codec: V,
              participantIdentity: B,
            },
          };
          this.worker.postMessage(W, [$, j]);
        }
        U[E2EE_FLAG] = !0;
      }
    });
  }
  handleSender(U, F, B) {
    var V;
    if (!(E2EE_FLAG in U || !this.worker)) {
      if (
        !(
          !((V = this.room) === null || V === void 0) &&
          V.localParticipant.identity
        ) ||
        this.room.localParticipant.identity === ""
      )
        throw TypeError(
          "local identity needs to be known in order to set up encrypted sender"
        );
      if (isScriptTransformSupported()) {
        livekitLogger.info("initialize script transform");
        const j = {
          kind: "encode",
          participantIdentity: this.room.localParticipant.identity,
          trackId: F,
          codec: B,
        };
        U.transform = new RTCRtpScriptTransform(this.worker, j);
      } else {
        livekitLogger.info("initialize encoded streams");
        const j = U.createEncodedStreams(),
          $ = {
            kind: "encode",
            data: {
              readableStream: j.readable,
              writableStream: j.writable,
              codec: B,
              trackId: F,
              participantIdentity: this.room.localParticipant.identity,
            },
          };
        this.worker.postMessage($, [j.readable, j.writable]);
      }
      U[E2EE_FLAG] = !0;
    }
  }
}
const defaultId = "default";
class DeviceManager {
  constructor() {
    this._previousDevices = [];
  }
  static getInstance() {
    return (
      this.instance === void 0 && (this.instance = new DeviceManager()),
      this.instance
    );
  }
  get previousDevices() {
    return this._previousDevices;
  }
  getDevices(U) {
    return __awaiter$1(this, arguments, void 0, function (F) {
      var B = this;
      let V =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
      return (function* () {
        var j;
        if (
          ((j = DeviceManager.userMediaPromiseMap) === null || j === void 0
            ? void 0
            : j.size) > 0
        ) {
          livekitLogger.debug("awaiting getUserMedia promise");
          try {
            F
              ? yield DeviceManager.userMediaPromiseMap.get(F)
              : yield Promise.all(DeviceManager.userMediaPromiseMap.values());
          } catch {
            livekitLogger.warn("error waiting for media permissons");
          }
        }
        let $ = yield navigator.mediaDevices.enumerateDevices();
        if (
          V &&
          !(isSafari() && B.hasDeviceInUse(F)) &&
          ($.filter((K) => K.kind === F).length === 0 ||
            $.some((K) => {
              const G = K.label === "",
                Q = F ? K.kind === F : !0;
              return G && Q;
            }))
        ) {
          const K = {
              video: F !== "audioinput" && F !== "audiooutput",
              audio: F !== "videoinput" && { deviceId: { ideal: "default" } },
            },
            G = yield navigator.mediaDevices.getUserMedia(K);
          ($ = yield navigator.mediaDevices.enumerateDevices()),
            G.getTracks().forEach((Q) => {
              Q.stop();
            });
        }
        return (
          (B._previousDevices = $), F && ($ = $.filter((W) => W.kind === F)), $
        );
      })();
    });
  }
  normalizeDeviceId(U, F, B) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (F !== defaultId) return F;
      const V = yield this.getDevices(U),
        j = V.find((W) => W.deviceId === defaultId);
      if (!j) {
        livekitLogger.warn("could not reliably determine default device");
        return;
      }
      const $ = V.find(
        (W) => W.deviceId !== defaultId && W.groupId === (B ?? j.groupId)
      );
      if (!$) {
        livekitLogger.warn("could not reliably determine default device");
        return;
      }
      return $ == null ? void 0 : $.deviceId;
    });
  }
  hasDeviceInUse(U) {
    return U
      ? DeviceManager.userMediaPromiseMap.has(U)
      : DeviceManager.userMediaPromiseMap.size > 0;
  }
}
DeviceManager.mediaDeviceKinds = ["audioinput", "audiooutput", "videoinput"];
DeviceManager.userMediaPromiseMap = new Map();
var QueueTaskStatus;
(function (q) {
  (q[(q.WAITING = 0)] = "WAITING"),
    (q[(q.RUNNING = 1)] = "RUNNING"),
    (q[(q.COMPLETED = 2)] = "COMPLETED");
})(QueueTaskStatus || (QueueTaskStatus = {}));
class AsyncQueue {
  constructor() {
    (this.pendingTasks = new Map()),
      (this.taskMutex = new _$1()),
      (this.nextTaskIndex = 0);
  }
  run(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const F = {
        id: this.nextTaskIndex++,
        enqueuedAt: Date.now(),
        status: QueueTaskStatus.WAITING,
      };
      this.pendingTasks.set(F.id, F);
      const B = yield this.taskMutex.lock();
      try {
        return (
          (F.executedAt = Date.now()),
          (F.status = QueueTaskStatus.RUNNING),
          yield U()
        );
      } finally {
        (F.status = QueueTaskStatus.COMPLETED),
          this.pendingTasks.delete(F.id),
          B();
      }
    });
  }
  flush() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.run(() => __awaiter$1(this, void 0, void 0, function* () {}));
    });
  }
  snapshot() {
    return Array.from(this.pendingTasks.values());
  }
}
function createRtcUrl(q, U) {
  const F = new URL(toWebsocketUrl(q));
  return (
    U.forEach((B, V) => {
      F.searchParams.set(V, B);
    }),
    appendUrlPath(F, "rtc")
  );
}
function createValidateUrl(q) {
  const U = new URL(toHttpUrl(q));
  return appendUrlPath(U, "validate");
}
function ensureTrailingSlash(q) {
  return q.endsWith("/") ? q : "".concat(q, "/");
}
function appendUrlPath(q, U) {
  return (
    (q.pathname = "".concat(ensureTrailingSlash(q.pathname)).concat(U)),
    q.toString()
  );
}
const passThroughQueueSignals = [
  "syncState",
  "trickle",
  "offer",
  "answer",
  "simulate",
  "leave",
];
function canPassThroughQueue(q) {
  const U = passThroughQueueSignals.indexOf(q.case) >= 0;
  return (
    livekitLogger.trace("request allowed to bypass queue:", {
      canPass: U,
      req: q,
    }),
    U
  );
}
var SignalConnectionState;
(function (q) {
  (q[(q.CONNECTING = 0)] = "CONNECTING"),
    (q[(q.CONNECTED = 1)] = "CONNECTED"),
    (q[(q.RECONNECTING = 2)] = "RECONNECTING"),
    (q[(q.DISCONNECTING = 3)] = "DISCONNECTING"),
    (q[(q.DISCONNECTED = 4)] = "DISCONNECTED");
})(SignalConnectionState || (SignalConnectionState = {}));
class SignalClient {
  get currentState() {
    return this.state;
  }
  get isDisconnected() {
    return (
      this.state === SignalConnectionState.DISCONNECTING ||
      this.state === SignalConnectionState.DISCONNECTED
    );
  }
  get isEstablishingConnection() {
    return (
      this.state === SignalConnectionState.CONNECTING ||
      this.state === SignalConnectionState.RECONNECTING
    );
  }
  getNextRequestId() {
    return (this._requestId += 1), this._requestId;
  }
  constructor() {
    let U = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1,
      F = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var B;
    (this.rtt = 0),
      (this.state = SignalConnectionState.DISCONNECTED),
      (this.log = livekitLogger),
      (this._requestId = 0),
      (this.resetCallbacks = () => {
        (this.onAnswer = void 0),
          (this.onLeave = void 0),
          (this.onLocalTrackPublished = void 0),
          (this.onLocalTrackUnpublished = void 0),
          (this.onNegotiateRequested = void 0),
          (this.onOffer = void 0),
          (this.onRemoteMuteChanged = void 0),
          (this.onSubscribedQualityUpdate = void 0),
          (this.onTokenRefresh = void 0),
          (this.onTrickle = void 0),
          (this.onClose = void 0);
      }),
      (this.log = getLogger(
        (B = F.loggerName) !== null && B !== void 0 ? B : LoggerNames.Signal
      )),
      (this.loggerContextCb = F.loggerContextCb),
      (this.useJSON = U),
      (this.requestQueue = new AsyncQueue()),
      (this.queuedRequests = []),
      (this.closingLock = new _$1()),
      (this.connectionLock = new _$1()),
      (this.state = SignalConnectionState.DISCONNECTED);
  }
  get logContext() {
    var U, F;
    return (F =
      (U = this.loggerContextCb) === null || U === void 0
        ? void 0
        : U.call(this)) !== null && F !== void 0
      ? F
      : {};
  }
  join(U, F, B, V) {
    return __awaiter$1(this, void 0, void 0, function* () {
      return (
        (this.state = SignalConnectionState.CONNECTING),
        (this.options = B),
        yield this.connect(U, F, B, V)
      );
    });
  }
  reconnect(U, F, B, V) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (!this.options) {
        this.log.warn(
          "attempted to reconnect without signal options being set, ignoring",
          this.logContext
        );
        return;
      }
      return (
        (this.state = SignalConnectionState.RECONNECTING),
        this.clearPingInterval(),
        yield this.connect(
          U,
          F,
          Object.assign(Object.assign({}, this.options), {
            reconnect: !0,
            sid: B,
            reconnectReason: V,
          })
        )
      );
    });
  }
  connect(U, F, B, V) {
    this.connectOptions = B;
    const j = getClientInfo(),
      $ = createConnectionParams(F, j, B),
      W = createRtcUrl(U, $),
      K = createValidateUrl(W);
    return new Promise((G, Q) =>
      __awaiter$1(this, void 0, void 0, function* () {
        const z = yield this.connectionLock.lock();
        try {
          const H = () =>
              __awaiter$1(this, void 0, void 0, function* () {
                this.close(),
                  clearTimeout(Y),
                  Q(
                    new ConnectionError(
                      "room connection has been cancelled (signal)",
                      ConnectionErrorReason.Cancelled
                    )
                  );
              }),
            Y = setTimeout(() => {
              this.close(),
                Q(
                  new ConnectionError(
                    "room connection has timed out (signal)",
                    ConnectionErrorReason.ServerUnreachable
                  )
                );
            }, B.websocketTimeout);
          V != null && V.aborted && H(),
            V == null || V.addEventListener("abort", H);
          const X = new URL(W);
          X.searchParams.has("access_token") &&
            X.searchParams.set("access_token", "<redacted>"),
            this.log.debug(
              "connecting to ".concat(X),
              Object.assign(
                { reconnect: B.reconnect, reconnectReason: B.reconnectReason },
                this.logContext
              )
            ),
            this.ws && (yield this.close(!1)),
            (this.ws = new WebSocket(W)),
            (this.ws.binaryType = "arraybuffer"),
            (this.ws.onopen = () => {
              clearTimeout(Y);
            }),
            (this.ws.onerror = (Z) =>
              __awaiter$1(this, void 0, void 0, function* () {
                if (this.state !== SignalConnectionState.CONNECTED) {
                  (this.state = SignalConnectionState.DISCONNECTED),
                    clearTimeout(Y);
                  try {
                    const ie = yield fetch(K);
                    if (ie.status.toFixed(0).startsWith("4")) {
                      const ee = yield ie.text();
                      Q(
                        new ConnectionError(
                          ee,
                          ConnectionErrorReason.NotAllowed,
                          ie.status
                        )
                      );
                    } else
                      Q(
                        new ConnectionError(
                          "Encountered unknown websocket error during connection: ".concat(
                            Z.toString()
                          ),
                          ConnectionErrorReason.InternalError,
                          ie.status
                        )
                      );
                  } catch (ie) {
                    Q(
                      new ConnectionError(
                        ie instanceof Error
                          ? ie.message
                          : "server was not reachable",
                        ConnectionErrorReason.ServerUnreachable
                      )
                    );
                  }
                  return;
                }
                this.handleWSError(Z);
              })),
            (this.ws.onmessage = (Z) =>
              __awaiter$1(this, void 0, void 0, function* () {
                var ie, ee, te;
                let re;
                if (typeof Z.data == "string") {
                  const ne = JSON.parse(Z.data);
                  re = SignalResponse.fromJson(ne, { ignoreUnknownFields: !0 });
                } else if (Z.data instanceof ArrayBuffer)
                  re = SignalResponse.fromBinary(new Uint8Array(Z.data));
                else {
                  this.log.error(
                    "could not decode websocket message: ".concat(
                      typeof Z.data
                    ),
                    this.logContext
                  );
                  return;
                }
                if (this.state !== SignalConnectionState.CONNECTED) {
                  let ne = !1;
                  if (
                    (((ie = re.message) === null || ie === void 0
                      ? void 0
                      : ie.case) === "join"
                      ? ((this.state = SignalConnectionState.CONNECTED),
                        V == null || V.removeEventListener("abort", H),
                        (this.pingTimeoutDuration =
                          re.message.value.pingTimeout),
                        (this.pingIntervalDuration =
                          re.message.value.pingInterval),
                        this.pingTimeoutDuration &&
                          this.pingTimeoutDuration > 0 &&
                          (this.log.debug(
                            "ping config",
                            Object.assign(Object.assign({}, this.logContext), {
                              timeout: this.pingTimeoutDuration,
                              interval: this.pingIntervalDuration,
                            })
                          ),
                          this.startPingInterval()),
                        G(re.message.value))
                      : this.state === SignalConnectionState.RECONNECTING &&
                        re.message.case !== "leave"
                      ? ((this.state = SignalConnectionState.CONNECTED),
                        V == null || V.removeEventListener("abort", H),
                        this.startPingInterval(),
                        ((ee = re.message) === null || ee === void 0
                          ? void 0
                          : ee.case) === "reconnect"
                          ? G(re.message.value)
                          : (this.log.debug(
                              "declaring signal reconnected without reconnect response received",
                              this.logContext
                            ),
                            G(void 0),
                            (ne = !0)))
                      : this.isEstablishingConnection &&
                        re.message.case === "leave"
                      ? Q(
                          new ConnectionError(
                            "Received leave request while trying to (re)connect",
                            ConnectionErrorReason.LeaveRequest,
                            void 0,
                            re.message.value.reason
                          )
                        )
                      : B.reconnect ||
                        Q(
                          new ConnectionError(
                            "did not receive join response, got ".concat(
                              (te = re.message) === null || te === void 0
                                ? void 0
                                : te.case,
                              " instead"
                            ),
                            ConnectionErrorReason.InternalError
                          )
                        ),
                    !ne)
                  )
                    return;
                }
                this.signalLatency && (yield sleep$1(this.signalLatency)),
                  this.handleSignalResponse(re);
              })),
            (this.ws.onclose = (Z) => {
              this.isEstablishingConnection &&
                Q(
                  new ConnectionError(
                    "Websocket got closed during a (re)connection attempt",
                    ConnectionErrorReason.InternalError
                  )
                ),
                this.log.warn(
                  "websocket closed",
                  Object.assign(Object.assign({}, this.logContext), {
                    reason: Z.reason,
                    code: Z.code,
                    wasClean: Z.wasClean,
                    state: this.state,
                  })
                ),
                this.handleOnClose(Z.reason);
            });
        } finally {
          z();
        }
      })
    );
  }
  close() {
    return __awaiter$1(this, arguments, void 0, function () {
      var U = this;
      let F =
        arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
      return (function* () {
        const B = yield U.closingLock.lock();
        try {
          if (
            (U.clearPingInterval(),
            F && (U.state = SignalConnectionState.DISCONNECTING),
            U.ws)
          ) {
            (U.ws.onmessage = null),
              (U.ws.onopen = null),
              (U.ws.onclose = null);
            const V = new Promise((j) => {
              U.ws
                ? (U.ws.onclose = () => {
                    j();
                  })
                : j();
            });
            U.ws.readyState < U.ws.CLOSING &&
              (U.ws.close(), yield Promise.race([V, sleep$1(250)])),
              (U.ws = void 0);
          }
        } finally {
          F && (U.state = SignalConnectionState.DISCONNECTED), B();
        }
      })();
    });
  }
  sendOffer(U) {
    this.log.debug(
      "sending offer",
      Object.assign(Object.assign({}, this.logContext), { offerSdp: U.sdp })
    ),
      this.sendRequest({ case: "offer", value: toProtoSessionDescription(U) });
  }
  sendAnswer(U) {
    return (
      this.log.debug(
        "sending answer",
        Object.assign(Object.assign({}, this.logContext), { answerSdp: U.sdp })
      ),
      this.sendRequest({ case: "answer", value: toProtoSessionDescription(U) })
    );
  }
  sendIceCandidate(U, F) {
    return (
      this.log.debug(
        "sending ice candidate",
        Object.assign(Object.assign({}, this.logContext), { candidate: U })
      ),
      this.sendRequest({
        case: "trickle",
        value: new TrickleRequest({
          candidateInit: JSON.stringify(U),
          target: F,
        }),
      })
    );
  }
  sendMuteTrack(U, F) {
    return this.sendRequest({
      case: "mute",
      value: new MuteTrackRequest({ sid: U, muted: F }),
    });
  }
  sendAddTrack(U) {
    return this.sendRequest({ case: "addTrack", value: U });
  }
  sendUpdateLocalMetadata(U, F) {
    return __awaiter$1(this, arguments, void 0, function (B, V) {
      var j = this;
      let $ =
        arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return (function* () {
        const W = j.getNextRequestId();
        return (
          yield j.sendRequest({
            case: "updateMetadata",
            value: new UpdateParticipantMetadata({
              requestId: W,
              metadata: B,
              name: V,
              attributes: $,
            }),
          }),
          W
        );
      })();
    });
  }
  sendUpdateTrackSettings(U) {
    this.sendRequest({ case: "trackSetting", value: U });
  }
  sendUpdateSubscription(U) {
    return this.sendRequest({ case: "subscription", value: U });
  }
  sendSyncState(U) {
    return this.sendRequest({ case: "syncState", value: U });
  }
  sendUpdateVideoLayers(U, F) {
    return this.sendRequest({
      case: "updateLayers",
      value: new UpdateVideoLayers({ trackSid: U, layers: F }),
    });
  }
  sendUpdateSubscriptionPermissions(U, F) {
    return this.sendRequest({
      case: "subscriptionPermission",
      value: new SubscriptionPermission({
        allParticipants: U,
        trackPermissions: F,
      }),
    });
  }
  sendSimulateScenario(U) {
    return this.sendRequest({ case: "simulate", value: U });
  }
  sendPing() {
    return Promise.all([
      this.sendRequest({ case: "ping", value: protoInt64.parse(Date.now()) }),
      this.sendRequest({
        case: "pingReq",
        value: new Ping({
          timestamp: protoInt64.parse(Date.now()),
          rtt: protoInt64.parse(this.rtt),
        }),
      }),
    ]);
  }
  sendUpdateLocalAudioTrack(U, F) {
    return this.sendRequest({
      case: "updateAudioTrack",
      value: new UpdateLocalAudioTrack({ trackSid: U, features: F }),
    });
  }
  sendLeave() {
    return this.sendRequest({
      case: "leave",
      value: new LeaveRequest({
        reason: DisconnectReason.CLIENT_INITIATED,
        action: LeaveRequest_Action.DISCONNECT,
      }),
    });
  }
  sendRequest(U) {
    return __awaiter$1(this, arguments, void 0, function (F) {
      var B = this;
      let V =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      return (function* () {
        if (
          !V &&
          !canPassThroughQueue(F) &&
          B.state === SignalConnectionState.RECONNECTING
        ) {
          B.queuedRequests.push(() =>
            __awaiter$1(B, void 0, void 0, function* () {
              yield this.sendRequest(F, !0);
            })
          );
          return;
        }
        if (
          (V || (yield B.requestQueue.flush()),
          B.signalLatency && (yield sleep$1(B.signalLatency)),
          !B.ws || B.ws.readyState !== B.ws.OPEN)
        ) {
          B.log.error(
            "cannot send signal request before connected, type: ".concat(
              F == null ? void 0 : F.case
            ),
            B.logContext
          );
          return;
        }
        const $ = new SignalRequest({ message: F });
        try {
          B.useJSON ? B.ws.send($.toJsonString()) : B.ws.send($.toBinary());
        } catch (W) {
          B.log.error(
            "error sending signal message",
            Object.assign(Object.assign({}, B.logContext), { error: W })
          );
        }
      })();
    });
  }
  handleSignalResponse(U) {
    var F, B;
    const V = U.message;
    if (V == null) {
      this.log.debug("received unsupported message", this.logContext);
      return;
    }
    let j = !1;
    if (V.case === "answer") {
      const $ = fromProtoSessionDescription(V.value);
      this.onAnswer && this.onAnswer($);
    } else if (V.case === "offer") {
      const $ = fromProtoSessionDescription(V.value);
      this.onOffer && this.onOffer($);
    } else if (V.case === "trickle") {
      const $ = JSON.parse(V.value.candidateInit);
      this.onTrickle && this.onTrickle($, V.value.target);
    } else
      V.case === "update"
        ? this.onParticipantUpdate &&
          this.onParticipantUpdate(
            (F = V.value.participants) !== null && F !== void 0 ? F : []
          )
        : V.case === "trackPublished"
        ? this.onLocalTrackPublished && this.onLocalTrackPublished(V.value)
        : V.case === "speakersChanged"
        ? this.onSpeakersChanged &&
          this.onSpeakersChanged(
            (B = V.value.speakers) !== null && B !== void 0 ? B : []
          )
        : V.case === "leave"
        ? this.onLeave && this.onLeave(V.value)
        : V.case === "mute"
        ? this.onRemoteMuteChanged &&
          this.onRemoteMuteChanged(V.value.sid, V.value.muted)
        : V.case === "roomUpdate"
        ? this.onRoomUpdate && V.value.room && this.onRoomUpdate(V.value.room)
        : V.case === "connectionQuality"
        ? this.onConnectionQuality && this.onConnectionQuality(V.value)
        : V.case === "streamStateUpdate"
        ? this.onStreamStateUpdate && this.onStreamStateUpdate(V.value)
        : V.case === "subscribedQualityUpdate"
        ? this.onSubscribedQualityUpdate &&
          this.onSubscribedQualityUpdate(V.value)
        : V.case === "subscriptionPermissionUpdate"
        ? this.onSubscriptionPermissionUpdate &&
          this.onSubscriptionPermissionUpdate(V.value)
        : V.case === "refreshToken"
        ? this.onTokenRefresh && this.onTokenRefresh(V.value)
        : V.case === "trackUnpublished"
        ? this.onLocalTrackUnpublished && this.onLocalTrackUnpublished(V.value)
        : V.case === "subscriptionResponse"
        ? this.onSubscriptionError && this.onSubscriptionError(V.value)
        : V.case === "pong" ||
          (V.case === "pongResp"
            ? ((this.rtt =
                Date.now() -
                Number.parseInt(V.value.lastPingTimestamp.toString())),
              this.resetPingTimeout(),
              (j = !0))
            : V.case === "requestResponse"
            ? this.onRequestResponse && this.onRequestResponse(V.value)
            : V.case === "trackSubscribed"
            ? this.onLocalTrackSubscribed &&
              this.onLocalTrackSubscribed(V.value.trackSid)
            : this.log.debug(
                "unsupported message",
                Object.assign(Object.assign({}, this.logContext), {
                  msgCase: V.case,
                })
              ));
    j || this.resetPingTimeout();
  }
  setReconnected() {
    for (; this.queuedRequests.length > 0; ) {
      const U = this.queuedRequests.shift();
      U && this.requestQueue.run(U);
    }
  }
  handleOnClose(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (this.state === SignalConnectionState.DISCONNECTED) return;
      const F = this.onClose;
      yield this.close(),
        this.log.debug(
          "websocket connection closed: ".concat(U),
          Object.assign(Object.assign({}, this.logContext), { reason: U })
        ),
        F && F(U);
    });
  }
  handleWSError(U) {
    this.log.error(
      "websocket error",
      Object.assign(Object.assign({}, this.logContext), { error: U })
    );
  }
  resetPingTimeout() {
    if ((this.clearPingTimeout(), !this.pingTimeoutDuration)) {
      this.log.warn("ping timeout duration not set", this.logContext);
      return;
    }
    this.pingTimeout = CriticalTimers.setTimeout(() => {
      this.log.warn(
        "ping timeout triggered. last pong received at: ".concat(
          new Date(Date.now() - this.pingTimeoutDuration * 1e3).toUTCString()
        ),
        this.logContext
      ),
        this.handleOnClose("ping timeout");
    }, this.pingTimeoutDuration * 1e3);
  }
  clearPingTimeout() {
    this.pingTimeout && CriticalTimers.clearTimeout(this.pingTimeout);
  }
  startPingInterval() {
    if (
      (this.clearPingInterval(),
      this.resetPingTimeout(),
      !this.pingIntervalDuration)
    ) {
      this.log.warn("ping interval duration not set", this.logContext);
      return;
    }
    this.log.debug("start ping interval", this.logContext),
      (this.pingInterval = CriticalTimers.setInterval(() => {
        this.sendPing();
      }, this.pingIntervalDuration * 1e3));
  }
  clearPingInterval() {
    this.log.debug("clearing ping interval", this.logContext),
      this.clearPingTimeout(),
      this.pingInterval && CriticalTimers.clearInterval(this.pingInterval);
  }
}
function fromProtoSessionDescription(q) {
  const U = { type: "offer", sdp: q.sdp };
  switch (q.type) {
    case "answer":
    case "offer":
    case "pranswer":
    case "rollback":
      U.type = q.type;
      break;
  }
  return U;
}
function toProtoSessionDescription(q) {
  return new SessionDescription({ sdp: q.sdp, type: q.type });
}
function createConnectionParams(q, U, F) {
  var B;
  const V = new URLSearchParams();
  return (
    V.set("access_token", q),
    F.reconnect && (V.set("reconnect", "1"), F.sid && V.set("sid", F.sid)),
    V.set("auto_subscribe", F.autoSubscribe ? "1" : "0"),
    V.set("sdk", isReactNative() ? "reactnative" : "js"),
    V.set("version", U.version),
    V.set("protocol", U.protocol.toString()),
    U.deviceModel && V.set("device_model", U.deviceModel),
    U.os && V.set("os", U.os),
    U.osVersion && V.set("os_version", U.osVersion),
    U.browser && V.set("browser", U.browser),
    U.browserVersion && V.set("browser_version", U.browserVersion),
    F.adaptiveStream && V.set("adaptive_stream", "1"),
    F.reconnectReason &&
      V.set("reconnect_reason", F.reconnectReason.toString()),
    !((B = navigator.connection) === null || B === void 0) &&
      B.type &&
      V.set("network", navigator.connection.type),
    V
  );
}
var lib = {},
  parser = {},
  grammar = { exports: {} },
  hasRequiredGrammar;
function requireGrammar() {
  if (hasRequiredGrammar) return grammar.exports;
  hasRequiredGrammar = 1;
  var q = (grammar.exports = {
    v: [{ name: "version", reg: /^(\d*)$/ }],
    o: [
      {
        name: "origin",
        reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
        names: [
          "username",
          "sessionId",
          "sessionVersion",
          "netType",
          "ipVer",
          "address",
        ],
        format: "%s %s %d %s IP%d %s",
      },
    ],
    s: [{ name: "name" }],
    i: [{ name: "description" }],
    u: [{ name: "uri" }],
    e: [{ name: "email" }],
    p: [{ name: "phone" }],
    z: [{ name: "timezones" }],
    r: [{ name: "repeats" }],
    t: [
      {
        name: "timing",
        reg: /^(\d*) (\d*)/,
        names: ["start", "stop"],
        format: "%d %d",
      },
    ],
    c: [
      {
        name: "connection",
        reg: /^IN IP(\d) (\S*)/,
        names: ["version", "ip"],
        format: "IN IP%d %s",
      },
    ],
    b: [
      {
        push: "bandwidth",
        reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
        names: ["type", "limit"],
        format: "%s:%s",
      },
    ],
    m: [
      {
        reg: /^(\w*) (\d*) ([\w/]*)(?: (.*))?/,
        names: ["type", "port", "protocol", "payloads"],
        format: "%s %d %s %s",
      },
    ],
    a: [
      {
        push: "rtp",
        reg: /^rtpmap:(\d*) ([\w\-.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
        names: ["payload", "codec", "rate", "encoding"],
        format: function (U) {
          return U.encoding
            ? "rtpmap:%d %s/%s/%s"
            : U.rate
            ? "rtpmap:%d %s/%s"
            : "rtpmap:%d %s";
        },
      },
      {
        push: "fmtp",
        reg: /^fmtp:(\d*) ([\S| ]*)/,
        names: ["payload", "config"],
        format: "fmtp:%d %s",
      },
      { name: "control", reg: /^control:(.*)/, format: "control:%s" },
      {
        name: "rtcp",
        reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
        names: ["port", "netType", "ipVer", "address"],
        format: function (U) {
          return U.address != null ? "rtcp:%d %s IP%d %s" : "rtcp:%d";
        },
      },
      {
        push: "rtcpFbTrrInt",
        reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
        names: ["payload", "value"],
        format: "rtcp-fb:%s trr-int %d",
      },
      {
        push: "rtcpFb",
        reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
        names: ["payload", "type", "subtype"],
        format: function (U) {
          return U.subtype != null ? "rtcp-fb:%s %s %s" : "rtcp-fb:%s %s";
        },
      },
      {
        push: "ext",
        reg: /^extmap:(\d+)(?:\/(\w+))?(?: (urn:ietf:params:rtp-hdrext:encrypt))? (\S*)(?: (\S*))?/,
        names: ["value", "direction", "encrypt-uri", "uri", "config"],
        format: function (U) {
          return (
            "extmap:%d" +
            (U.direction ? "/%s" : "%v") +
            (U["encrypt-uri"] ? " %s" : "%v") +
            " %s" +
            (U.config ? " %s" : "")
          );
        },
      },
      { name: "extmapAllowMixed", reg: /^(extmap-allow-mixed)/ },
      {
        push: "crypto",
        reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
        names: ["id", "suite", "config", "sessionConfig"],
        format: function (U) {
          return U.sessionConfig != null
            ? "crypto:%d %s %s %s"
            : "crypto:%d %s %s";
        },
      },
      { name: "setup", reg: /^setup:(\w*)/, format: "setup:%s" },
      {
        name: "connectionType",
        reg: /^connection:(new|existing)/,
        format: "connection:%s",
      },
      { name: "mid", reg: /^mid:([^\s]*)/, format: "mid:%s" },
      { name: "msid", reg: /^msid:(.*)/, format: "msid:%s" },
      { name: "ptime", reg: /^ptime:(\d*(?:\.\d*)*)/, format: "ptime:%d" },
      {
        name: "maxptime",
        reg: /^maxptime:(\d*(?:\.\d*)*)/,
        format: "maxptime:%d",
      },
      { name: "direction", reg: /^(sendrecv|recvonly|sendonly|inactive)/ },
      { name: "icelite", reg: /^(ice-lite)/ },
      { name: "iceUfrag", reg: /^ice-ufrag:(\S*)/, format: "ice-ufrag:%s" },
      { name: "icePwd", reg: /^ice-pwd:(\S*)/, format: "ice-pwd:%s" },
      {
        name: "fingerprint",
        reg: /^fingerprint:(\S*) (\S*)/,
        names: ["type", "hash"],
        format: "fingerprint:%s %s",
      },
      {
        push: "candidates",
        reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
        names: [
          "foundation",
          "component",
          "transport",
          "priority",
          "ip",
          "port",
          "type",
          "raddr",
          "rport",
          "tcptype",
          "generation",
          "network-id",
          "network-cost",
        ],
        format: function (U) {
          var F = "candidate:%s %d %s %d %s %d typ %s";
          return (
            (F += U.raddr != null ? " raddr %s rport %d" : "%v%v"),
            (F += U.tcptype != null ? " tcptype %s" : "%v"),
            U.generation != null && (F += " generation %d"),
            (F += U["network-id"] != null ? " network-id %d" : "%v"),
            (F += U["network-cost"] != null ? " network-cost %d" : "%v"),
            F
          );
        },
      },
      { name: "endOfCandidates", reg: /^(end-of-candidates)/ },
      {
        name: "remoteCandidates",
        reg: /^remote-candidates:(.*)/,
        format: "remote-candidates:%s",
      },
      {
        name: "iceOptions",
        reg: /^ice-options:(\S*)/,
        format: "ice-options:%s",
      },
      {
        push: "ssrcs",
        reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
        names: ["id", "attribute", "value"],
        format: function (U) {
          var F = "ssrc:%d";
          return (
            U.attribute != null &&
              ((F += " %s"), U.value != null && (F += ":%s")),
            F
          );
        },
      },
      {
        push: "ssrcGroups",
        reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
        names: ["semantics", "ssrcs"],
        format: "ssrc-group:%s %s",
      },
      {
        name: "msidSemantic",
        reg: /^msid-semantic:\s?(\w*) (\S*)/,
        names: ["semantic", "token"],
        format: "msid-semantic: %s %s",
      },
      {
        push: "groups",
        reg: /^group:(\w*) (.*)/,
        names: ["type", "mids"],
        format: "group:%s %s",
      },
      { name: "rtcpMux", reg: /^(rtcp-mux)/ },
      { name: "rtcpRsize", reg: /^(rtcp-rsize)/ },
      {
        name: "sctpmap",
        reg: /^sctpmap:([\w_/]*) (\S*)(?: (\S*))?/,
        names: ["sctpmapNumber", "app", "maxMessageSize"],
        format: function (U) {
          return U.maxMessageSize != null
            ? "sctpmap:%s %s %s"
            : "sctpmap:%s %s";
        },
      },
      {
        name: "xGoogleFlag",
        reg: /^x-google-flag:([^\s]*)/,
        format: "x-google-flag:%s",
      },
      {
        push: "rids",
        reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
        names: ["id", "direction", "params"],
        format: function (U) {
          return U.params ? "rid:%s %s %s" : "rid:%s %s";
        },
      },
      {
        push: "imageattrs",
        reg: new RegExp(
          "^imageattr:(\\d+|\\*)[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?"
        ),
        names: ["pt", "dir1", "attrs1", "dir2", "attrs2"],
        format: function (U) {
          return "imageattr:%s %s %s" + (U.dir2 ? " %s %s" : "");
        },
      },
      {
        name: "simulcast",
        reg: new RegExp(
          "^simulcast:(send|recv) ([a-zA-Z0-9\\-_~;,]+)(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?$"
        ),
        names: ["dir1", "list1", "dir2", "list2"],
        format: function (U) {
          return "simulcast:%s %s" + (U.dir2 ? " %s %s" : "");
        },
      },
      {
        name: "simulcast_03",
        reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
        names: ["value"],
        format: "simulcast: %s",
      },
      {
        name: "framerate",
        reg: /^framerate:(\d+(?:$|\.\d+))/,
        format: "framerate:%s",
      },
      {
        name: "sourceFilter",
        reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
        names: [
          "filterMode",
          "netType",
          "addressTypes",
          "destAddress",
          "srcList",
        ],
        format: "source-filter: %s %s %s %s %s",
      },
      { name: "bundleOnly", reg: /^(bundle-only)/ },
      { name: "label", reg: /^label:(.+)/, format: "label:%s" },
      { name: "sctpPort", reg: /^sctp-port:(\d+)$/, format: "sctp-port:%s" },
      {
        name: "maxMessageSize",
        reg: /^max-message-size:(\d+)$/,
        format: "max-message-size:%s",
      },
      {
        push: "tsRefClocks",
        reg: /^ts-refclk:([^\s=]*)(?:=(\S*))?/,
        names: ["clksrc", "clksrcExt"],
        format: function (U) {
          return "ts-refclk:%s" + (U.clksrcExt != null ? "=%s" : "");
        },
      },
      {
        name: "mediaClk",
        reg: /^mediaclk:(?:id=(\S*))? *([^\s=]*)(?:=(\S*))?(?: *rate=(\d+)\/(\d+))?/,
        names: [
          "id",
          "mediaClockName",
          "mediaClockValue",
          "rateNumerator",
          "rateDenominator",
        ],
        format: function (U) {
          var F = "mediaclk:";
          return (
            (F += U.id != null ? "id=%s %s" : "%v%s"),
            (F += U.mediaClockValue != null ? "=%s" : ""),
            (F += U.rateNumerator != null ? " rate=%s" : ""),
            (F += U.rateDenominator != null ? "/%s" : ""),
            F
          );
        },
      },
      { name: "keywords", reg: /^keywds:(.+)$/, format: "keywds:%s" },
      { name: "content", reg: /^content:(.+)/, format: "content:%s" },
      {
        name: "bfcpFloorCtrl",
        reg: /^floorctrl:(c-only|s-only|c-s)/,
        format: "floorctrl:%s",
      },
      { name: "bfcpConfId", reg: /^confid:(\d+)/, format: "confid:%s" },
      { name: "bfcpUserId", reg: /^userid:(\d+)/, format: "userid:%s" },
      {
        name: "bfcpFloorId",
        reg: /^floorid:(.+) (?:m-stream|mstrm):(.+)/,
        names: ["id", "mStream"],
        format: "floorid:%s mstrm:%s",
      },
      { push: "invalid", names: ["value"] },
    ],
  });
  return (
    Object.keys(q).forEach(function (U) {
      var F = q[U];
      F.forEach(function (B) {
        B.reg || (B.reg = /(.*)/), B.format || (B.format = "%s");
      });
    }),
    grammar.exports
  );
}
var hasRequiredParser;
function requireParser() {
  return (
    hasRequiredParser ||
      ((hasRequiredParser = 1),
      (function (q) {
        var U = function (W) {
            return String(Number(W)) === W ? Number(W) : W;
          },
          F = function (W, K, G, Q) {
            if (Q && !G) K[Q] = U(W[1]);
            else
              for (var z = 0; z < G.length; z += 1)
                W[z + 1] != null && (K[G[z]] = U(W[z + 1]));
          },
          B = function (W, K, G) {
            var Q = W.name && W.names;
            W.push && !K[W.push]
              ? (K[W.push] = [])
              : Q && !K[W.name] && (K[W.name] = {});
            var z = W.push ? {} : Q ? K[W.name] : K;
            F(G.match(W.reg), z, W.names, W.name), W.push && K[W.push].push(z);
          },
          V = requireGrammar(),
          j = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
        q.parse = function (W) {
          var K = {},
            G = [],
            Q = K;
          return (
            W.split(/(\r\n|\r|\n)/)
              .filter(j)
              .forEach(function (z) {
                var H = z[0],
                  Y = z.slice(2);
                H === "m" &&
                  (G.push({ rtp: [], fmtp: [] }), (Q = G[G.length - 1]));
                for (var X = 0; X < (V[H] || []).length; X += 1) {
                  var Z = V[H][X];
                  if (Z.reg.test(Y)) return B(Z, Q, Y);
                }
              }),
            (K.media = G),
            K
          );
        };
        var $ = function (W, K) {
          var G = K.split(/=(.+)/, 2);
          return (
            G.length === 2
              ? (W[G[0]] = U(G[1]))
              : G.length === 1 && K.length > 1 && (W[G[0]] = void 0),
            W
          );
        };
        (q.parseParams = function (W) {
          return W.split(/;\s?/).reduce($, {});
        }),
          (q.parseFmtpConfig = q.parseParams),
          (q.parsePayloads = function (W) {
            return W.toString().split(" ").map(Number);
          }),
          (q.parseRemoteCandidates = function (W) {
            for (
              var K = [], G = W.split(" ").map(U), Q = 0;
              Q < G.length;
              Q += 3
            )
              K.push({ component: G[Q], ip: G[Q + 1], port: G[Q + 2] });
            return K;
          }),
          (q.parseImageAttributes = function (W) {
            return W.split(" ").map(function (K) {
              return K.substring(1, K.length - 1)
                .split(",")
                .reduce($, {});
            });
          }),
          (q.parseSimulcastStreamList = function (W) {
            return W.split(";").map(function (K) {
              return K.split(",").map(function (G) {
                var Q,
                  z = !1;
                return (
                  G[0] !== "~"
                    ? (Q = U(G))
                    : ((Q = U(G.substring(1, G.length))), (z = !0)),
                  { scid: Q, paused: z }
                );
              });
            });
          });
      })(parser)),
    parser
  );
}
var writer$1, hasRequiredWriter$1;
function requireWriter$1() {
  if (hasRequiredWriter$1) return writer$1;
  hasRequiredWriter$1 = 1;
  var q = requireGrammar(),
    U = /%[sdv%]/g,
    F = function ($) {
      var W = 1,
        K = arguments,
        G = K.length;
      return $.replace(U, function (Q) {
        if (W >= G) return Q;
        var z = K[W];
        switch (((W += 1), Q)) {
          case "%%":
            return "%";
          case "%s":
            return String(z);
          case "%d":
            return Number(z);
          case "%v":
            return "";
        }
      });
    },
    B = function ($, W, K) {
      var G =
          W.format instanceof Function
            ? W.format(W.push ? K : K[W.name])
            : W.format,
        Q = [$ + "=" + G];
      if (W.names)
        for (var z = 0; z < W.names.length; z += 1) {
          var H = W.names[z];
          W.name ? Q.push(K[W.name][H]) : Q.push(K[W.names[z]]);
        }
      else Q.push(K[W.name]);
      return F.apply(null, Q);
    },
    V = ["v", "o", "s", "i", "u", "e", "p", "c", "b", "t", "r", "z", "a"],
    j = ["i", "c", "b", "a"];
  return (
    (writer$1 = function ($, W) {
      (W = W || {}),
        $.version == null && ($.version = 0),
        $.name == null && ($.name = " "),
        $.media.forEach(function (z) {
          z.payloads == null && (z.payloads = "");
        });
      var K = W.outerOrder || V,
        G = W.innerOrder || j,
        Q = [];
      return (
        K.forEach(function (z) {
          q[z].forEach(function (H) {
            H.name in $ && $[H.name] != null
              ? Q.push(B(z, H, $))
              : H.push in $ &&
                $[H.push] != null &&
                $[H.push].forEach(function (Y) {
                  Q.push(B(z, H, Y));
                });
          });
        }),
        $.media.forEach(function (z) {
          Q.push(B("m", q.m[0], z)),
            G.forEach(function (H) {
              q[H].forEach(function (Y) {
                Y.name in z && z[Y.name] != null
                  ? Q.push(B(H, Y, z))
                  : Y.push in z &&
                    z[Y.push] != null &&
                    z[Y.push].forEach(function (X) {
                      Q.push(B(H, Y, X));
                    });
              });
            });
        }),
        Q.join(`\r
`) +
          `\r
`
      );
    }),
    writer$1
  );
}
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  var q = requireParser(),
    U = requireWriter$1(),
    F = requireGrammar();
  return (
    (lib.grammar = F),
    (lib.write = U),
    (lib.parse = q.parse),
    (lib.parseParams = q.parseParams),
    (lib.parseFmtpConfig = q.parseFmtpConfig),
    (lib.parsePayloads = q.parsePayloads),
    (lib.parseRemoteCandidates = q.parseRemoteCandidates),
    (lib.parseImageAttributes = q.parseImageAttributes),
    (lib.parseSimulcastStreamList = q.parseSimulcastStreamList),
    lib
  );
}
var libExports = requireLib();
function r$1(q, U, F) {
  var B, V, j;
  U === void 0 && (U = 50), F === void 0 && (F = {});
  var $ = (B = F.isImmediate) != null && B,
    W = (V = F.callback) != null && V,
    K = F.maxWait,
    G = Date.now(),
    Q = [];
  function z() {
    if (K !== void 0) {
      var Y = Date.now() - G;
      if (Y + U >= K) return K - Y;
    }
    return U;
  }
  var H = function () {
    var Y = [].slice.call(arguments),
      X = this;
    return new Promise(function (Z, ie) {
      var ee = $ && j === void 0;
      if (
        (j !== void 0 && clearTimeout(j),
        (j = setTimeout(function () {
          if (((j = void 0), (G = Date.now()), !$)) {
            var re = q.apply(X, Y);
            W && W(re),
              Q.forEach(function (ne) {
                return (0, ne.resolve)(re);
              }),
              (Q = []);
          }
        }, z())),
        ee)
      ) {
        var te = q.apply(X, Y);
        return W && W(te), Z(te);
      }
      Q.push({ resolve: Z, reject: ie });
    });
  };
  return (
    (H.cancel = function (Y) {
      j !== void 0 && clearTimeout(j),
        Q.forEach(function (X) {
          return (0, X.reject)(Y);
        }),
        (Q = []);
    }),
    H
  );
}
const startBitrateForSVC = 0.7,
  debounceInterval = 20,
  PCEvents = {
    NegotiationStarted: "negotiationStarted",
    NegotiationComplete: "negotiationComplete",
    RTPVideoPayloadTypes: "rtpVideoPayloadTypes",
  };
class PCTransport extends eventsExports.EventEmitter {
  get pc() {
    return this._pc || (this._pc = this.createPC()), this._pc;
  }
  constructor(U) {
    let F = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var B;
    super(),
      (this.log = livekitLogger),
      (this.ddExtID = 0),
      (this.pendingCandidates = []),
      (this.restartingIce = !1),
      (this.renegotiate = !1),
      (this.trackBitrates = []),
      (this.remoteStereoMids = []),
      (this.remoteNackMids = []),
      (this.negotiate = r$1(
        (V) =>
          __awaiter$1(this, void 0, void 0, function* () {
            this.emit(PCEvents.NegotiationStarted);
            try {
              yield this.createAndSendOffer();
            } catch (j) {
              if (V) V(j);
              else throw j;
            }
          }),
        debounceInterval
      )),
      (this.close = () => {
        this._pc &&
          (this._pc.close(),
          (this._pc.onconnectionstatechange = null),
          (this._pc.oniceconnectionstatechange = null),
          (this._pc.onicegatheringstatechange = null),
          (this._pc.ondatachannel = null),
          (this._pc.onnegotiationneeded = null),
          (this._pc.onsignalingstatechange = null),
          (this._pc.onicecandidate = null),
          (this._pc.ondatachannel = null),
          (this._pc.ontrack = null),
          (this._pc.onconnectionstatechange = null),
          (this._pc.oniceconnectionstatechange = null),
          (this._pc = null));
      }),
      (this.log = getLogger(
        (B = F.loggerName) !== null && B !== void 0
          ? B
          : LoggerNames.PCTransport
      )),
      (this.loggerOptions = F),
      (this.config = U),
      (this._pc = this.createPC());
  }
  createPC() {
    const U = new RTCPeerConnection(this.config);
    return (
      (U.onicecandidate = (F) => {
        var B;
        F.candidate &&
          ((B = this.onIceCandidate) === null ||
            B === void 0 ||
            B.call(this, F.candidate));
      }),
      (U.onicecandidateerror = (F) => {
        var B;
        (B = this.onIceCandidateError) === null ||
          B === void 0 ||
          B.call(this, F);
      }),
      (U.oniceconnectionstatechange = () => {
        var F;
        (F = this.onIceConnectionStateChange) === null ||
          F === void 0 ||
          F.call(this, U.iceConnectionState);
      }),
      (U.onsignalingstatechange = () => {
        var F;
        (F = this.onSignalingStatechange) === null ||
          F === void 0 ||
          F.call(this, U.signalingState);
      }),
      (U.onconnectionstatechange = () => {
        var F;
        (F = this.onConnectionStateChange) === null ||
          F === void 0 ||
          F.call(this, U.connectionState);
      }),
      (U.ondatachannel = (F) => {
        var B;
        (B = this.onDataChannel) === null || B === void 0 || B.call(this, F);
      }),
      (U.ontrack = (F) => {
        var B;
        (B = this.onTrack) === null || B === void 0 || B.call(this, F);
      }),
      U
    );
  }
  get logContext() {
    var U, F;
    return Object.assign(
      {},
      (F = (U = this.loggerOptions).loggerContextCb) === null || F === void 0
        ? void 0
        : F.call(U)
    );
  }
  get isICEConnected() {
    return (
      this._pc !== null &&
      (this.pc.iceConnectionState === "connected" ||
        this.pc.iceConnectionState === "completed")
    );
  }
  addIceCandidate(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (this.pc.remoteDescription && !this.restartingIce)
        return this.pc.addIceCandidate(U);
      this.pendingCandidates.push(U);
    });
  }
  setRemoteDescription(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F;
      let B;
      if (U.type === "offer") {
        let { stereoMids: V, nackMids: j } =
          extractStereoAndNackAudioFromOffer(U);
        (this.remoteStereoMids = V), (this.remoteNackMids = j);
      } else if (U.type === "answer") {
        const V = libExports.parse(
          (F = U.sdp) !== null && F !== void 0 ? F : ""
        );
        V.media.forEach((j) => {
          j.type === "audio" &&
            this.trackBitrates.some(($) => {
              if (!$.transceiver || j.mid != $.transceiver.mid) return !1;
              let W = 0;
              if (
                (j.rtp.some((G) =>
                  G.codec.toUpperCase() === $.codec.toUpperCase()
                    ? ((W = G.payload), !0)
                    : !1
                ),
                W === 0)
              )
                return !0;
              let K = !1;
              for (const G of j.fmtp)
                if (G.payload === W) {
                  (G.config = G.config
                    .split(";")
                    .filter((Q) => !Q.includes("maxaveragebitrate"))
                    .join(";")),
                    $.maxbr > 0 &&
                      (G.config += ";maxaveragebitrate=".concat($.maxbr * 1e3)),
                    (K = !0);
                  break;
                }
              return (
                K ||
                  ($.maxbr > 0 &&
                    j.fmtp.push({
                      payload: W,
                      config: "maxaveragebitrate=".concat($.maxbr * 1e3),
                    })),
                !0
              );
            });
        }),
          (B = libExports.write(V));
      }
      yield this.setMungedSDP(U, B, !0),
        this.pendingCandidates.forEach((V) => {
          this.pc.addIceCandidate(V);
        }),
        (this.pendingCandidates = []),
        (this.restartingIce = !1),
        this.renegotiate
          ? ((this.renegotiate = !1), yield this.createAndSendOffer())
          : U.type === "answer" &&
            (this.emit(PCEvents.NegotiationComplete),
            U.sdp &&
              libExports.parse(U.sdp).media.forEach((j) => {
                j.type === "video" &&
                  this.emit(PCEvents.RTPVideoPayloadTypes, j.rtp);
              }));
    });
  }
  createAndSendOffer(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F;
      if (this.onOffer === void 0) return;
      if (
        (U != null &&
          U.iceRestart &&
          (this.log.debug("restarting ICE", this.logContext),
          (this.restartingIce = !0)),
        this._pc && this._pc.signalingState === "have-local-offer")
      ) {
        const j = this._pc.remoteDescription;
        if (U != null && U.iceRestart && j)
          yield this._pc.setRemoteDescription(j);
        else {
          this.renegotiate = !0;
          return;
        }
      } else if (!this._pc || this._pc.signalingState === "closed") {
        this.log.warn(
          "could not createOffer with closed peer connection",
          this.logContext
        );
        return;
      }
      this.log.debug("starting to negotiate", this.logContext);
      const B = yield this.pc.createOffer(U);
      this.log.debug(
        "original offer",
        Object.assign({ sdp: B.sdp }, this.logContext)
      );
      const V = libExports.parse((F = B.sdp) !== null && F !== void 0 ? F : "");
      V.media.forEach((j) => {
        ensureIPAddrMatchVersion(j),
          j.type === "audio"
            ? ensureAudioNackAndStereo(j, [], [])
            : j.type === "video" &&
              this.trackBitrates.some(($) => {
                if (!j.msid || !$.cid || !j.msid.includes($.cid)) return !1;
                let W = 0;
                if (
                  (j.rtp.some((G) =>
                    G.codec.toUpperCase() === $.codec.toUpperCase()
                      ? ((W = G.payload), !0)
                      : !1
                  ),
                  W === 0 ||
                    (isSVCCodec($.codec) &&
                      this.ensureVideoDDExtensionForSVC(j, V),
                    $.codec !== "av1"))
                )
                  return !0;
                const K = Math.round($.maxbr * startBitrateForSVC);
                for (const G of j.fmtp)
                  if (G.payload === W) {
                    G.config.includes("x-google-start-bitrate") ||
                      (G.config += ";x-google-start-bitrate=".concat(K));
                    break;
                  }
                return !0;
              });
      }),
        yield this.setMungedSDP(B, libExports.write(V)),
        this.onOffer(B);
    });
  }
  createAndSetAnswer() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      const F = yield this.pc.createAnswer(),
        B = libExports.parse((U = F.sdp) !== null && U !== void 0 ? U : "");
      return (
        B.media.forEach((V) => {
          ensureIPAddrMatchVersion(V),
            V.type === "audio" &&
              ensureAudioNackAndStereo(
                V,
                this.remoteStereoMids,
                this.remoteNackMids
              );
        }),
        yield this.setMungedSDP(F, libExports.write(B)),
        F
      );
    });
  }
  createDataChannel(U, F) {
    return this.pc.createDataChannel(U, F);
  }
  addTransceiver(U, F) {
    return this.pc.addTransceiver(U, F);
  }
  addTrack(U) {
    if (!this._pc)
      throw new UnexpectedConnectionState("PC closed, cannot add track");
    return this._pc.addTrack(U);
  }
  setTrackCodecBitrate(U) {
    this.trackBitrates.push(U);
  }
  setConfiguration(U) {
    var F;
    if (!this._pc)
      throw new UnexpectedConnectionState("PC closed, cannot configure");
    return (F = this._pc) === null || F === void 0
      ? void 0
      : F.setConfiguration(U);
  }
  canRemoveTrack() {
    var U;
    return !!(!((U = this._pc) === null || U === void 0) && U.removeTrack);
  }
  removeTrack(U) {
    var F;
    return (F = this._pc) === null || F === void 0 ? void 0 : F.removeTrack(U);
  }
  getConnectionState() {
    var U, F;
    return (F =
      (U = this._pc) === null || U === void 0 ? void 0 : U.connectionState) !==
      null && F !== void 0
      ? F
      : "closed";
  }
  getICEConnectionState() {
    var U, F;
    return (F =
      (U = this._pc) === null || U === void 0
        ? void 0
        : U.iceConnectionState) !== null && F !== void 0
      ? F
      : "closed";
  }
  getSignallingState() {
    var U, F;
    return (F =
      (U = this._pc) === null || U === void 0 ? void 0 : U.signalingState) !==
      null && F !== void 0
      ? F
      : "closed";
  }
  getTransceivers() {
    var U, F;
    return (F =
      (U = this._pc) === null || U === void 0
        ? void 0
        : U.getTransceivers()) !== null && F !== void 0
      ? F
      : [];
  }
  getSenders() {
    var U, F;
    return (F =
      (U = this._pc) === null || U === void 0 ? void 0 : U.getSenders()) !==
      null && F !== void 0
      ? F
      : [];
  }
  getLocalDescription() {
    var U;
    return (U = this._pc) === null || U === void 0
      ? void 0
      : U.localDescription;
  }
  getRemoteDescription() {
    var U;
    return (U = this.pc) === null || U === void 0
      ? void 0
      : U.remoteDescription;
  }
  getStats() {
    return this.pc.getStats();
  }
  getConnectedAddress() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      if (!this._pc) return;
      let F = "";
      const B = new Map(),
        V = new Map();
      if (
        ((yield this._pc.getStats()).forEach((W) => {
          switch (W.type) {
            case "transport":
              F = W.selectedCandidatePairId;
              break;
            case "candidate-pair":
              F === "" && W.selected && (F = W.id), B.set(W.id, W);
              break;
            case "remote-candidate":
              V.set(W.id, "".concat(W.address, ":").concat(W.port));
              break;
          }
        }),
        F === "")
      )
        return;
      const $ =
        (U = B.get(F)) === null || U === void 0 ? void 0 : U.remoteCandidateId;
      if ($ !== void 0) return V.get($);
    });
  }
  setMungedSDP(U, F, B) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (F) {
        const V = U.sdp;
        U.sdp = F;
        try {
          this.log.debug(
            "setting munged ".concat(B ? "remote" : "local", " description"),
            this.logContext
          ),
            B
              ? yield this.pc.setRemoteDescription(U)
              : yield this.pc.setLocalDescription(U);
          return;
        } catch (j) {
          this.log.warn(
            "not able to set ".concat(
              U.type,
              ", falling back to unmodified sdp"
            ),
            Object.assign(Object.assign({}, this.logContext), {
              error: j,
              sdp: F,
            })
          ),
            (U.sdp = V);
        }
      }
      try {
        B
          ? yield this.pc.setRemoteDescription(U)
          : yield this.pc.setLocalDescription(U);
      } catch (V) {
        let j = "unknown error";
        V instanceof Error ? (j = V.message) : typeof V == "string" && (j = V);
        const $ = { error: j, sdp: U.sdp };
        throw (
          (!B &&
            this.pc.remoteDescription &&
            ($.remoteSdp = this.pc.remoteDescription),
          this.log.error(
            "unable to set ".concat(U.type),
            Object.assign(Object.assign({}, this.logContext), { fields: $ })
          ),
          new NegotiationError(j))
        );
      }
    });
  }
  ensureVideoDDExtensionForSVC(U, F) {
    var B, V;
    if (
      !((B = U.ext) === null || B === void 0
        ? void 0
        : B.some(($) => $.uri === ddExtensionURI))
    ) {
      if (this.ddExtID === 0) {
        let $ = 0;
        F.media.forEach((W) => {
          var K;
          W.type === "video" &&
            ((K = W.ext) === null ||
              K === void 0 ||
              K.forEach((G) => {
                G.value > $ && ($ = G.value);
              }));
        }),
          (this.ddExtID = $ + 1);
      }
      (V = U.ext) === null ||
        V === void 0 ||
        V.push({ value: this.ddExtID, uri: ddExtensionURI });
    }
  }
}
function ensureAudioNackAndStereo(q, U, F) {
  let B = 0;
  q.rtp.some((V) => (V.codec === "opus" ? ((B = V.payload), !0) : !1)),
    B > 0 &&
      (q.rtcpFb || (q.rtcpFb = []),
      F.includes(q.mid) &&
        !q.rtcpFb.some((V) => V.payload === B && V.type === "nack") &&
        q.rtcpFb.push({ payload: B, type: "nack" }),
      U.includes(q.mid) &&
        q.fmtp.some((V) =>
          V.payload === B
            ? (V.config.includes("stereo=1") || (V.config += ";stereo=1"), !0)
            : !1
        ));
}
function extractStereoAndNackAudioFromOffer(q) {
  var U;
  const F = [],
    B = [],
    V = libExports.parse((U = q.sdp) !== null && U !== void 0 ? U : "");
  let j = 0;
  return (
    V.media.forEach(($) => {
      var W;
      $.type === "audio" &&
        ($.rtp.some((K) => (K.codec === "opus" ? ((j = K.payload), !0) : !1)),
        !((W = $.rtcpFb) === null || W === void 0) &&
          W.some((K) => K.payload === j && K.type === "nack") &&
          B.push($.mid),
        $.fmtp.some((K) =>
          K.payload === j
            ? (K.config.includes("sprop-stereo=1") && F.push($.mid), !0)
            : !1
        ));
    }),
    { stereoMids: F, nackMids: B }
  );
}
function ensureIPAddrMatchVersion(q) {
  if (q.connection) {
    const U = q.connection.ip.indexOf(":") >= 0;
    ((q.connection.version === 4 && U) || (q.connection.version === 6 && !U)) &&
      ((q.connection.ip = "0.0.0.0"), (q.connection.version = 4));
  }
}
const defaultVideoCodec = "vp8",
  publishDefaults = {
    audioPreset: AudioPresets.music,
    dtx: !0,
    red: !0,
    forceStereo: !1,
    simulcast: !0,
    screenShareEncoding: ScreenSharePresets.h1080fps15.encoding,
    stopMicTrackOnMute: !1,
    videoCodec: defaultVideoCodec,
    backupCodec: !0,
  },
  audioDefaults = {
    deviceId: { ideal: "default" },
    autoGainControl: !0,
    echoCancellation: !0,
    noiseSuppression: !0,
    voiceIsolation: !0,
  },
  videoDefaults = {
    deviceId: { ideal: "default" },
    resolution: VideoPresets.h720.resolution,
  },
  roomOptionDefaults = {
    adaptiveStream: !1,
    dynacast: !1,
    stopLocalTrackOnUnpublish: !0,
    reconnectPolicy: new DefaultReconnectPolicy(),
    disconnectOnPageLeave: !0,
    webAudioMix: !1,
  },
  roomConnectOptionDefaults = {
    autoSubscribe: !0,
    maxRetries: 1,
    peerConnectionTimeout: 15e3,
    websocketTimeout: 15e3,
  };
var PCTransportState;
(function (q) {
  (q[(q.NEW = 0)] = "NEW"),
    (q[(q.CONNECTING = 1)] = "CONNECTING"),
    (q[(q.CONNECTED = 2)] = "CONNECTED"),
    (q[(q.FAILED = 3)] = "FAILED"),
    (q[(q.CLOSING = 4)] = "CLOSING"),
    (q[(q.CLOSED = 5)] = "CLOSED");
})(PCTransportState || (PCTransportState = {}));
class PCTransportManager {
  get needsPublisher() {
    return this.isPublisherConnectionRequired;
  }
  get needsSubscriber() {
    return this.isSubscriberConnectionRequired;
  }
  get currentState() {
    return this.state;
  }
  constructor(U, F, B) {
    var V;
    (this.peerConnectionTimeout =
      roomConnectOptionDefaults.peerConnectionTimeout),
      (this.log = livekitLogger),
      (this.updateState = () => {
        var j;
        const $ = this.state,
          W = this.requiredTransports.map((K) => K.getConnectionState());
        W.every((K) => K === "connected")
          ? (this.state = PCTransportState.CONNECTED)
          : W.some((K) => K === "failed")
          ? (this.state = PCTransportState.FAILED)
          : W.some((K) => K === "connecting")
          ? (this.state = PCTransportState.CONNECTING)
          : W.every((K) => K === "closed")
          ? (this.state = PCTransportState.CLOSED)
          : W.some((K) => K === "closed")
          ? (this.state = PCTransportState.CLOSING)
          : W.every((K) => K === "new") && (this.state = PCTransportState.NEW),
          $ !== this.state &&
            (this.log.debug(
              "pc state change: from "
                .concat(PCTransportState[$], " to ")
                .concat(PCTransportState[this.state]),
              this.logContext
            ),
            (j = this.onStateChange) === null ||
              j === void 0 ||
              j.call(
                this,
                this.state,
                this.publisher.getConnectionState(),
                this.subscriber.getConnectionState()
              ));
      }),
      (this.log = getLogger(
        (V = B.loggerName) !== null && V !== void 0 ? V : LoggerNames.PCManager
      )),
      (this.loggerOptions = B),
      (this.isPublisherConnectionRequired = !F),
      (this.isSubscriberConnectionRequired = F),
      (this.publisher = new PCTransport(U, B)),
      (this.subscriber = new PCTransport(U, B)),
      (this.publisher.onConnectionStateChange = this.updateState),
      (this.subscriber.onConnectionStateChange = this.updateState),
      (this.publisher.onIceConnectionStateChange = this.updateState),
      (this.subscriber.onIceConnectionStateChange = this.updateState),
      (this.publisher.onSignalingStatechange = this.updateState),
      (this.subscriber.onSignalingStatechange = this.updateState),
      (this.publisher.onIceCandidate = (j) => {
        var $;
        ($ = this.onIceCandidate) === null ||
          $ === void 0 ||
          $.call(this, j, SignalTarget.PUBLISHER);
      }),
      (this.subscriber.onIceCandidate = (j) => {
        var $;
        ($ = this.onIceCandidate) === null ||
          $ === void 0 ||
          $.call(this, j, SignalTarget.SUBSCRIBER);
      }),
      (this.subscriber.onDataChannel = (j) => {
        var $;
        ($ = this.onDataChannel) === null || $ === void 0 || $.call(this, j);
      }),
      (this.subscriber.onTrack = (j) => {
        var $;
        ($ = this.onTrack) === null || $ === void 0 || $.call(this, j);
      }),
      (this.publisher.onOffer = (j) => {
        var $;
        ($ = this.onPublisherOffer) === null || $ === void 0 || $.call(this, j);
      }),
      (this.state = PCTransportState.NEW),
      (this.connectionLock = new _$1()),
      (this.remoteOfferLock = new _$1());
  }
  get logContext() {
    var U, F;
    return Object.assign(
      {},
      (F = (U = this.loggerOptions).loggerContextCb) === null || F === void 0
        ? void 0
        : F.call(U)
    );
  }
  requirePublisher() {
    let U = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
    (this.isPublisherConnectionRequired = U), this.updateState();
  }
  requireSubscriber() {
    let U = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
    (this.isSubscriberConnectionRequired = U), this.updateState();
  }
  createAndSendPublisherOffer(U) {
    return this.publisher.createAndSendOffer(U);
  }
  setPublisherAnswer(U) {
    return this.publisher.setRemoteDescription(U);
  }
  removeTrack(U) {
    return this.publisher.removeTrack(U);
  }
  close() {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (this.publisher && this.publisher.getSignallingState() !== "closed") {
        const U = this.publisher;
        for (const F of U.getSenders())
          try {
            U.canRemoveTrack() && U.removeTrack(F);
          } catch (B) {
            this.log.warn(
              "could not removeTrack",
              Object.assign(Object.assign({}, this.logContext), { error: B })
            );
          }
      }
      yield Promise.all([this.publisher.close(), this.subscriber.close()]),
        this.updateState();
    });
  }
  triggerIceRestart() {
    return __awaiter$1(this, void 0, void 0, function* () {
      (this.subscriber.restartingIce = !0),
        this.needsPublisher &&
          (yield this.createAndSendPublisherOffer({ iceRestart: !0 }));
    });
  }
  addIceCandidate(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      F === SignalTarget.PUBLISHER
        ? yield this.publisher.addIceCandidate(U)
        : yield this.subscriber.addIceCandidate(U);
    });
  }
  createSubscriberAnswerFromOffer(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      this.log.debug(
        "received server offer",
        Object.assign(Object.assign({}, this.logContext), {
          RTCSdpType: U.type,
          sdp: U.sdp,
          signalingState: this.subscriber.getSignallingState().toString(),
        })
      );
      const F = yield this.remoteOfferLock.lock();
      try {
        return (
          yield this.subscriber.setRemoteDescription(U),
          yield this.subscriber.createAndSetAnswer()
        );
      } finally {
        F();
      }
    });
  }
  updateConfiguration(U, F) {
    this.publisher.setConfiguration(U),
      this.subscriber.setConfiguration(U),
      F && this.triggerIceRestart();
  }
  ensurePCTransportConnection(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var B;
      const V = yield this.connectionLock.lock();
      try {
        this.isPublisherConnectionRequired &&
          this.publisher.getConnectionState() !== "connected" &&
          this.publisher.getConnectionState() !== "connecting" &&
          (this.log.debug(
            "negotiation required, start negotiating",
            this.logContext
          ),
          this.publisher.negotiate()),
          yield Promise.all(
            (B = this.requiredTransports) === null || B === void 0
              ? void 0
              : B.map((j) => this.ensureTransportConnected(j, U, F))
          );
      } finally {
        V();
      }
    });
  }
  negotiate(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      return new Promise((F, B) =>
        __awaiter$1(this, void 0, void 0, function* () {
          const V = setTimeout(() => {
              B("negotiation timed out");
            }, this.peerConnectionTimeout),
            j = () => {
              clearTimeout(V), B("negotiation aborted");
            };
          U.signal.addEventListener("abort", j),
            this.publisher.once(PCEvents.NegotiationStarted, () => {
              U.signal.aborted ||
                this.publisher.once(PCEvents.NegotiationComplete, () => {
                  clearTimeout(V), F();
                });
            }),
            yield this.publisher.negotiate(($) => {
              clearTimeout(V), B($);
            });
        })
      );
    });
  }
  addPublisherTransceiver(U, F) {
    return this.publisher.addTransceiver(U, F);
  }
  addPublisherTrack(U) {
    return this.publisher.addTrack(U);
  }
  createPublisherDataChannel(U, F) {
    return this.publisher.createDataChannel(U, F);
  }
  getConnectedAddress(U) {
    return U === SignalTarget.PUBLISHER
      ? this.publisher.getConnectedAddress()
      : U === SignalTarget.SUBSCRIBER
      ? this.publisher.getConnectedAddress()
      : this.requiredTransports[0].getConnectedAddress();
  }
  get requiredTransports() {
    const U = [];
    return (
      this.isPublisherConnectionRequired && U.push(this.publisher),
      this.isSubscriberConnectionRequired && U.push(this.subscriber),
      U
    );
  }
  ensureTransportConnected(U, F) {
    return __awaiter$1(this, arguments, void 0, function (B, V) {
      var j = this;
      let $ =
        arguments.length > 2 && arguments[2] !== void 0
          ? arguments[2]
          : this.peerConnectionTimeout;
      return (function* () {
        if (B.getConnectionState() !== "connected")
          return new Promise((K, G) =>
            __awaiter$1(j, void 0, void 0, function* () {
              const Q = () => {
                this.log.warn("abort transport connection", this.logContext),
                  CriticalTimers.clearTimeout(z),
                  G(
                    new ConnectionError(
                      "room connection has been cancelled",
                      ConnectionErrorReason.Cancelled
                    )
                  );
              };
              V != null && V.signal.aborted && Q(),
                V == null || V.signal.addEventListener("abort", Q);
              const z = CriticalTimers.setTimeout(() => {
                V == null || V.signal.removeEventListener("abort", Q),
                  G(
                    new ConnectionError(
                      "could not establish pc connection",
                      ConnectionErrorReason.InternalError
                    )
                  );
              }, $);
              for (; this.state !== PCTransportState.CONNECTED; )
                if ((yield sleep$1(50), V != null && V.signal.aborted)) {
                  G(
                    new ConnectionError(
                      "room connection has been cancelled",
                      ConnectionErrorReason.Cancelled
                    )
                  );
                  return;
                }
              CriticalTimers.clearTimeout(z),
                V == null || V.signal.removeEventListener("abort", Q),
                K();
            })
          );
      })();
    });
  }
}
class RpcError extends Error {
  constructor(U, F, B) {
    super(F),
      (this.code = U),
      (this.message = truncateBytes(F, RpcError.MAX_MESSAGE_BYTES)),
      (this.data = B ? truncateBytes(B, RpcError.MAX_DATA_BYTES) : void 0);
  }
  static fromProto(U) {
    return new RpcError(U.code, U.message, U.data);
  }
  toProto() {
    return new RpcError$1({
      code: this.code,
      message: this.message,
      data: this.data,
    });
  }
  static builtIn(U, F) {
    return new RpcError(RpcError.ErrorCode[U], RpcError.ErrorMessage[U], F);
  }
}
RpcError.MAX_MESSAGE_BYTES = 256;
RpcError.MAX_DATA_BYTES = 15360;
RpcError.ErrorCode = {
  APPLICATION_ERROR: 1500,
  CONNECTION_TIMEOUT: 1501,
  RESPONSE_TIMEOUT: 1502,
  RECIPIENT_DISCONNECTED: 1503,
  RESPONSE_PAYLOAD_TOO_LARGE: 1504,
  SEND_FAILED: 1505,
  UNSUPPORTED_METHOD: 1400,
  RECIPIENT_NOT_FOUND: 1401,
  REQUEST_PAYLOAD_TOO_LARGE: 1402,
  UNSUPPORTED_SERVER: 1403,
  UNSUPPORTED_VERSION: 1404,
};
RpcError.ErrorMessage = {
  APPLICATION_ERROR: "Application error in method handler",
  CONNECTION_TIMEOUT: "Connection timeout",
  RESPONSE_TIMEOUT: "Response timeout",
  RECIPIENT_DISCONNECTED: "Recipient disconnected",
  RESPONSE_PAYLOAD_TOO_LARGE: "Response payload too large",
  SEND_FAILED: "Failed to send",
  UNSUPPORTED_METHOD: "Method not supported at destination",
  RECIPIENT_NOT_FOUND: "Recipient not found",
  REQUEST_PAYLOAD_TOO_LARGE: "Request payload too large",
  UNSUPPORTED_SERVER: "RPC not supported by server",
  UNSUPPORTED_VERSION: "Unsupported RPC version",
};
const MAX_PAYLOAD_BYTES = 15360;
function byteLength(q) {
  return new TextEncoder().encode(q).length;
}
function truncateBytes(q, U) {
  if (byteLength(q) <= U) return q;
  let F = 0,
    B = q.length;
  const V = new TextEncoder();
  for (; F < B; ) {
    const j = Math.floor((F + B + 1) / 2);
    V.encode(q.slice(0, j)).length <= U ? (F = j) : (B = j - 1);
  }
  return q.slice(0, F);
}
const monitorFrequency = 2e3;
function computeBitrate(q, U) {
  if (!U) return 0;
  let F, B;
  return (
    "bytesReceived" in q
      ? ((F = q.bytesReceived), (B = U.bytesReceived))
      : "bytesSent" in q && ((F = q.bytesSent), (B = U.bytesSent)),
    F === void 0 ||
    B === void 0 ||
    q.timestamp === void 0 ||
    U.timestamp === void 0
      ? 0
      : ((F - B) * 8 * 1e3) / (q.timestamp - U.timestamp)
  );
}
const defaultDimensionsTimeout = 1e3;
class LocalTrack extends Track {
  get sender() {
    return this._sender;
  }
  set sender(U) {
    this._sender = U;
  }
  get constraints() {
    return this._constraints;
  }
  constructor(U, F, B) {
    let V = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1,
      j = arguments.length > 4 ? arguments[4] : void 0;
    super(U, F, j),
      (this.manuallyStopped = !1),
      (this._isUpstreamPaused = !1),
      (this.handleTrackMuteEvent = () =>
        this.debouncedTrackMuteHandler().catch(() =>
          this.log.debug(
            "track mute bounce got cancelled by an unmute event",
            this.logContext
          )
        )),
      (this.debouncedTrackMuteHandler = r$1(
        () =>
          __awaiter$1(this, void 0, void 0, function* () {
            yield this.pauseUpstream();
          }),
        5e3
      )),
      (this.handleTrackUnmuteEvent = () =>
        __awaiter$1(this, void 0, void 0, function* () {
          this.debouncedTrackMuteHandler.cancel("unmute"),
            yield this.resumeUpstream();
        })),
      (this.handleEnded = () => {
        this.isInBackground && (this.reacquireTrack = !0),
          this._mediaStreamTrack.removeEventListener(
            "mute",
            this.handleTrackMuteEvent
          ),
          this._mediaStreamTrack.removeEventListener(
            "unmute",
            this.handleTrackUnmuteEvent
          ),
          this.emit(TrackEvent.Ended, this);
      }),
      (this.reacquireTrack = !1),
      (this.providedByUser = V),
      (this.muteLock = new _$1()),
      (this.pauseUpstreamLock = new _$1()),
      (this.processorLock = new _$1()),
      (this.restartLock = new _$1()),
      this.setMediaStreamTrack(U, !0),
      (this._constraints = U.getConstraints()),
      B && (this._constraints = B);
  }
  get id() {
    return this._mediaStreamTrack.id;
  }
  get dimensions() {
    if (this.kind !== Track.Kind.Video) return;
    const { width: U, height: F } = this._mediaStreamTrack.getSettings();
    if (U && F) return { width: U, height: F };
  }
  get isUpstreamPaused() {
    return this._isUpstreamPaused;
  }
  get isUserProvided() {
    return this.providedByUser;
  }
  get mediaStreamTrack() {
    var U, F;
    return (F =
      (U = this.processor) === null || U === void 0
        ? void 0
        : U.processedTrack) !== null && F !== void 0
      ? F
      : this._mediaStreamTrack;
  }
  get isLocal() {
    return !0;
  }
  getSourceTrackSettings() {
    return this._mediaStreamTrack.getSettings();
  }
  setMediaStreamTrack(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var B;
      if (U === this._mediaStreamTrack && !F) return;
      this._mediaStreamTrack &&
        (this.attachedElements.forEach((j) => {
          detachTrack(this._mediaStreamTrack, j);
        }),
        this.debouncedTrackMuteHandler.cancel("new-track"),
        this._mediaStreamTrack.removeEventListener("ended", this.handleEnded),
        this._mediaStreamTrack.removeEventListener(
          "mute",
          this.handleTrackMuteEvent
        ),
        this._mediaStreamTrack.removeEventListener(
          "unmute",
          this.handleTrackUnmuteEvent
        )),
        (this.mediaStream = new MediaStream([U])),
        U &&
          (U.addEventListener("ended", this.handleEnded),
          U.addEventListener("mute", this.handleTrackMuteEvent),
          U.addEventListener("unmute", this.handleTrackUnmuteEvent),
          (this._constraints = U.getConstraints()));
      let V;
      if (this.processor && U) {
        const j = yield this.processorLock.lock();
        try {
          if (
            (this.log.debug("restarting processor", this.logContext),
            this.kind === "unknown")
          )
            throw TypeError("cannot set processor on track of unknown kind");
          this.processorElement &&
            (attachToElement(U, this.processorElement),
            (this.processorElement.muted = !0)),
            yield this.processor.restart({
              track: U,
              kind: this.kind,
              element: this.processorElement,
            }),
            (V = this.processor.processedTrack);
        } finally {
          j();
        }
      }
      this.sender &&
        ((B = this.sender.transport) === null || B === void 0
          ? void 0
          : B.state) !== "closed" &&
        (yield this.sender.replaceTrack(V ?? U)),
        !this.providedByUser &&
          this._mediaStreamTrack !== U &&
          this._mediaStreamTrack.stop(),
        (this._mediaStreamTrack = U),
        U &&
          ((this._mediaStreamTrack.enabled = !this.isMuted),
          yield this.resumeUpstream(),
          this.attachedElements.forEach((j) => {
            attachToElement(V ?? U, j);
          }));
    });
  }
  waitForDimensions() {
    return __awaiter$1(this, arguments, void 0, function () {
      var U = this;
      let F =
        arguments.length > 0 && arguments[0] !== void 0
          ? arguments[0]
          : defaultDimensionsTimeout;
      return (function* () {
        var B;
        if (U.kind === Track.Kind.Audio)
          throw new Error("cannot get dimensions for audio tracks");
        ((B = getBrowser()) === null || B === void 0 ? void 0 : B.os) ===
          "iOS" && (yield sleep$1(10));
        const V = Date.now();
        for (; Date.now() - V < F; ) {
          const j = U.dimensions;
          if (j) return j;
          yield sleep$1(50);
        }
        throw new TrackInvalidError(
          "unable to get track dimensions after timeout"
        );
      })();
    });
  }
  setDeviceId(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      return (this._constraints.deviceId === U &&
        this._mediaStreamTrack.getSettings().deviceId ===
          unwrapConstraint(U)) ||
        ((this._constraints.deviceId = U), this.isMuted)
        ? !0
        : (yield this.restartTrack(),
          unwrapConstraint(U) ===
            this._mediaStreamTrack.getSettings().deviceId);
    });
  }
  getDeviceId() {
    return __awaiter$1(this, arguments, void 0, function () {
      var U = this;
      let F =
        arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
      return (function* () {
        if (U.source === Track.Source.ScreenShare) return;
        const { deviceId: B, groupId: V } = U._mediaStreamTrack.getSettings(),
          j = U.kind === Track.Kind.Audio ? "audioinput" : "videoinput";
        return F ? DeviceManager.getInstance().normalizeDeviceId(j, B, V) : B;
      })();
    });
  }
  mute() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.setTrackMuted(!0), this;
    });
  }
  unmute() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.setTrackMuted(!1), this;
    });
  }
  replaceTrack(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (!this.sender)
        throw new TrackInvalidError("unable to replace an unpublished track");
      let B, V;
      return (
        typeof F == "boolean"
          ? (B = F)
          : F !== void 0 && ((B = F.userProvidedTrack), (V = F.stopProcessor)),
        (this.providedByUser = B ?? !0),
        this.log.debug("replace MediaStreamTrack", this.logContext),
        yield this.setMediaStreamTrack(U),
        V && this.processor && (yield this.stopProcessor()),
        this
      );
    });
  }
  restart(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      this.manuallyStopped = !1;
      const F = yield this.restartLock.lock();
      try {
        U || (U = this._constraints);
        const { deviceId: B, facingMode: V } = U,
          j = __rest(U, ["deviceId", "facingMode"]);
        this.log.debug(
          "restarting track with constraints",
          Object.assign(Object.assign({}, this.logContext), { constraints: U })
        );
        const $ = { audio: !1, video: !1 };
        this.kind === Track.Kind.Video
          ? ($.video = B || V ? { deviceId: B, facingMode: V } : !0)
          : ($.audio = B ? { deviceId: B } : !0),
          this.attachedElements.forEach((G) => {
            detachTrack(this.mediaStreamTrack, G);
          }),
          this._mediaStreamTrack.removeEventListener("ended", this.handleEnded),
          this._mediaStreamTrack.stop();
        const K = (yield navigator.mediaDevices.getUserMedia($)).getTracks()[0];
        return (
          yield K.applyConstraints(j),
          K.addEventListener("ended", this.handleEnded),
          this.log.debug("re-acquired MediaStreamTrack", this.logContext),
          yield this.setMediaStreamTrack(K),
          (this._constraints = U),
          this.emit(TrackEvent.Restarted, this),
          this.manuallyStopped &&
            (this.log.warn(
              "track was stopped during a restart, stopping restarted track",
              this.logContext
            ),
            this.stop()),
          this
        );
      } finally {
        F();
      }
    });
  }
  setTrackMuted(U) {
    this.log.debug(
      "setting ".concat(this.kind, " track ").concat(U ? "muted" : "unmuted"),
      this.logContext
    ),
      !(this.isMuted === U && this._mediaStreamTrack.enabled !== U) &&
        ((this.isMuted = U),
        (this._mediaStreamTrack.enabled = !U),
        this.emit(U ? TrackEvent.Muted : TrackEvent.Unmuted, this));
  }
  get needsReAcquisition() {
    return (
      this._mediaStreamTrack.readyState !== "live" ||
      this._mediaStreamTrack.muted ||
      !this._mediaStreamTrack.enabled ||
      this.reacquireTrack
    );
  }
  handleAppVisibilityChanged() {
    const U = Object.create(null, {
      handleAppVisibilityChanged: {
        get: () => super.handleAppVisibilityChanged,
      },
    });
    return __awaiter$1(this, void 0, void 0, function* () {
      yield U.handleAppVisibilityChanged.call(this),
        isMobile() &&
          (this.log.debug(
            "visibility changed, is in Background: ".concat(
              this.isInBackground
            ),
            this.logContext
          ),
          !this.isInBackground &&
            this.needsReAcquisition &&
            !this.isUserProvided &&
            !this.isMuted &&
            (this.log.debug(
              "track needs to be reacquired, restarting ".concat(this.source),
              this.logContext
            ),
            yield this.restart(),
            (this.reacquireTrack = !1)));
    });
  }
  stop() {
    var U;
    (this.manuallyStopped = !0),
      super.stop(),
      this._mediaStreamTrack.removeEventListener("ended", this.handleEnded),
      this._mediaStreamTrack.removeEventListener(
        "mute",
        this.handleTrackMuteEvent
      ),
      this._mediaStreamTrack.removeEventListener(
        "unmute",
        this.handleTrackUnmuteEvent
      ),
      (U = this.processor) === null || U === void 0 || U.destroy(),
      (this.processor = void 0);
  }
  pauseUpstream() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      const F = yield this.pauseUpstreamLock.lock();
      try {
        if (this._isUpstreamPaused === !0) return;
        if (!this.sender) {
          this.log.warn(
            "unable to pause upstream for an unpublished track",
            this.logContext
          );
          return;
        }
        (this._isUpstreamPaused = !0),
          this.emit(TrackEvent.UpstreamPaused, this);
        const B = getBrowser();
        if (
          (B == null ? void 0 : B.name) === "Safari" &&
          compareVersions(B.version, "12.0") < 0
        )
          throw new DeviceUnsupportedError(
            "pauseUpstream is not supported on Safari < 12."
          );
        ((U = this.sender.transport) === null || U === void 0
          ? void 0
          : U.state) !== "closed" && (yield this.sender.replaceTrack(null));
      } finally {
        F();
      }
    });
  }
  resumeUpstream() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      const F = yield this.pauseUpstreamLock.lock();
      try {
        if (this._isUpstreamPaused === !1) return;
        if (!this.sender) {
          this.log.warn(
            "unable to resume upstream for an unpublished track",
            this.logContext
          );
          return;
        }
        (this._isUpstreamPaused = !1),
          this.emit(TrackEvent.UpstreamResumed, this),
          ((U = this.sender.transport) === null || U === void 0
            ? void 0
            : U.state) !== "closed" &&
            (yield this.sender.replaceTrack(this.mediaStreamTrack));
      } finally {
        F();
      }
    });
  }
  getRTCStatsReport() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      return !((U = this.sender) === null || U === void 0) && U.getStats
        ? yield this.sender.getStats()
        : void 0;
    });
  }
  setProcessor(U) {
    return __awaiter$1(this, arguments, void 0, function (F) {
      var B = this;
      let V =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
      return (function* () {
        var j;
        const $ = yield B.processorLock.lock();
        try {
          B.log.debug("setting up processor", B.logContext);
          const W = document.createElement(B.kind),
            K = {
              kind: B.kind,
              track: B._mediaStreamTrack,
              element: W,
              audioContext: B.audioContext,
            };
          if (
            (yield F.init(K),
            B.log.debug("processor initialized", B.logContext),
            B.processor && (yield B.stopProcessor()),
            B.kind === "unknown")
          )
            throw TypeError("cannot set processor on track of unknown kind");
          if (
            (attachToElement(B._mediaStreamTrack, W),
            (W.muted = !0),
            W.play().catch((G) =>
              B.log.error(
                "failed to play processor element",
                Object.assign(Object.assign({}, B.logContext), { error: G })
              )
            ),
            (B.processor = F),
            (B.processorElement = W),
            B.processor.processedTrack)
          ) {
            for (const G of B.attachedElements)
              G !== B.processorElement &&
                V &&
                (detachTrack(B._mediaStreamTrack, G),
                attachToElement(B.processor.processedTrack, G));
            yield (j = B.sender) === null || j === void 0
              ? void 0
              : j.replaceTrack(B.processor.processedTrack);
          }
          B.emit(TrackEvent.TrackProcessorUpdate, B.processor);
        } finally {
          $();
        }
      })();
    });
  }
  getProcessor() {
    return this.processor;
  }
  stopProcessor() {
    return __awaiter$1(this, arguments, void 0, function () {
      var U = this;
      let F =
        arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
      return (function* () {
        var B, V;
        U.processor &&
          (U.log.debug("stopping processor", U.logContext),
          (B = U.processor.processedTrack) === null || B === void 0 || B.stop(),
          yield U.processor.destroy(),
          (U.processor = void 0),
          F ||
            ((V = U.processorElement) === null || V === void 0 || V.remove(),
            (U.processorElement = void 0)),
          yield U._mediaStreamTrack.applyConstraints(U._constraints),
          yield U.setMediaStreamTrack(U._mediaStreamTrack, !0),
          U.emit(TrackEvent.TrackProcessorUpdate));
      })();
    });
  }
}
class LocalAudioTrack extends LocalTrack {
  get enhancedNoiseCancellation() {
    return this.isKrispNoiseFilterEnabled;
  }
  constructor(U, F) {
    let B = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0,
      V = arguments.length > 3 ? arguments[3] : void 0,
      j = arguments.length > 4 ? arguments[4] : void 0;
    super(U, Track.Kind.Audio, F, B, j),
      (this.stopOnMute = !1),
      (this.isKrispNoiseFilterEnabled = !1),
      (this.monitorSender = () =>
        __awaiter$1(this, void 0, void 0, function* () {
          if (!this.sender) {
            this._currentBitrate = 0;
            return;
          }
          let $;
          try {
            $ = yield this.getSenderStats();
          } catch (W) {
            this.log.error(
              "could not get audio sender stats",
              Object.assign(Object.assign({}, this.logContext), { error: W })
            );
            return;
          }
          $ &&
            this.prevStats &&
            (this._currentBitrate = computeBitrate($, this.prevStats)),
            (this.prevStats = $);
        })),
      (this.handleKrispNoiseFilterEnable = () => {
        (this.isKrispNoiseFilterEnabled = !0),
          this.log.debug("Krisp noise filter enabled", this.logContext),
          this.emit(
            TrackEvent.AudioTrackFeatureUpdate,
            this,
            AudioTrackFeature.TF_ENHANCED_NOISE_CANCELLATION,
            !0
          );
      }),
      (this.handleKrispNoiseFilterDisable = () => {
        (this.isKrispNoiseFilterEnabled = !1),
          this.log.debug("Krisp noise filter disabled", this.logContext),
          this.emit(
            TrackEvent.AudioTrackFeatureUpdate,
            this,
            AudioTrackFeature.TF_ENHANCED_NOISE_CANCELLATION,
            !1
          );
      }),
      (this.audioContext = V),
      this.checkForSilence();
  }
  mute() {
    const U = Object.create(null, { mute: { get: () => super.mute } });
    return __awaiter$1(this, void 0, void 0, function* () {
      const F = yield this.muteLock.lock();
      try {
        return this.isMuted
          ? (this.log.debug("Track already muted", this.logContext), this)
          : (this.source === Track.Source.Microphone &&
              this.stopOnMute &&
              !this.isUserProvided &&
              (this.log.debug("stopping mic track", this.logContext),
              this._mediaStreamTrack.stop()),
            yield U.mute.call(this),
            this);
      } finally {
        F();
      }
    });
  }
  unmute() {
    const U = Object.create(null, { unmute: { get: () => super.unmute } });
    return __awaiter$1(this, void 0, void 0, function* () {
      const F = yield this.muteLock.lock();
      try {
        if (!this.isMuted)
          return this.log.debug("Track already unmuted", this.logContext), this;
        const B =
          this._constraints.deviceId &&
          this._mediaStreamTrack.getSettings().deviceId !==
            unwrapConstraint(this._constraints.deviceId);
        return (
          this.source === Track.Source.Microphone &&
            (this.stopOnMute ||
              this._mediaStreamTrack.readyState === "ended" ||
              B) &&
            !this.isUserProvided &&
            (this.log.debug("reacquiring mic track", this.logContext),
            yield this.restartTrack()),
          yield U.unmute.call(this),
          this
        );
      } finally {
        F();
      }
    });
  }
  restartTrack(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      let F;
      if (U) {
        const B = constraintsForOptions({ audio: U });
        typeof B.audio != "boolean" && (F = B.audio);
      }
      yield this.restart(F);
    });
  }
  restart(U) {
    const F = Object.create(null, { restart: { get: () => super.restart } });
    return __awaiter$1(this, void 0, void 0, function* () {
      const B = yield F.restart.call(this, U);
      return this.checkForSilence(), B;
    });
  }
  startMonitor() {
    isWeb() &&
      (this.monitorInterval ||
        (this.monitorInterval = setInterval(() => {
          this.monitorSender();
        }, monitorFrequency)));
  }
  setProcessor(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F;
      const B = yield this.processorLock.lock();
      try {
        if (!isReactNative() && !this.audioContext)
          throw Error(
            "Audio context needs to be set on LocalAudioTrack in order to enable processors"
          );
        this.processor && (yield this.stopProcessor());
        const V = {
          kind: this.kind,
          track: this._mediaStreamTrack,
          audioContext: this.audioContext,
        };
        this.log.debug(
          "setting up audio processor ".concat(U.name),
          this.logContext
        ),
          yield U.init(V),
          (this.processor = U),
          this.processor.processedTrack &&
            (yield (F = this.sender) === null || F === void 0
              ? void 0
              : F.replaceTrack(this.processor.processedTrack),
            this.processor.processedTrack.addEventListener(
              "enable-lk-krisp-noise-filter",
              this.handleKrispNoiseFilterEnable
            ),
            this.processor.processedTrack.addEventListener(
              "disable-lk-krisp-noise-filter",
              this.handleKrispNoiseFilterDisable
            )),
          this.emit(TrackEvent.TrackProcessorUpdate, this.processor);
      } finally {
        B();
      }
    });
  }
  setAudioContext(U) {
    this.audioContext = U;
  }
  getSenderStats() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      if (!(!((U = this.sender) === null || U === void 0) && U.getStats))
        return;
      const F = yield this.sender.getStats();
      let B;
      return (
        F.forEach((V) => {
          V.type === "outbound-rtp" &&
            (B = {
              type: "audio",
              streamId: V.id,
              packetsSent: V.packetsSent,
              packetsLost: V.packetsLost,
              bytesSent: V.bytesSent,
              timestamp: V.timestamp,
              roundTripTime: V.roundTripTime,
              jitter: V.jitter,
            });
        }),
        B
      );
    });
  }
  checkForSilence() {
    return __awaiter$1(this, void 0, void 0, function* () {
      const U = yield detectSilence(this);
      return (
        U &&
          (this.isMuted ||
            this.log.warn(
              "silence detected on local audio track",
              this.logContext
            ),
          this.emit(TrackEvent.AudioSilenceDetected)),
        U
      );
    });
  }
}
function mediaTrackToLocalTrack(q, U, F) {
  switch (q.kind) {
    case "audio":
      return new LocalAudioTrack(q, U, !1, void 0, F);
    case "video":
      return new LocalVideoTrack(q, U, !1, F);
    default:
      throw new TrackInvalidError("unsupported track type: ".concat(q.kind));
  }
}
const presets169 = Object.values(VideoPresets),
  presets43 = Object.values(VideoPresets43),
  presetsScreenShare = Object.values(ScreenSharePresets),
  defaultSimulcastPresets169 = [VideoPresets.h180, VideoPresets.h360],
  defaultSimulcastPresets43 = [VideoPresets43.h180, VideoPresets43.h360],
  computeDefaultScreenShareSimulcastPresets = (q) =>
    [{ scaleResolutionDownBy: 2, fps: q.encoding.maxFramerate }].map((F) => {
      var B, V;
      return new VideoPreset(
        Math.floor(q.width / F.scaleResolutionDownBy),
        Math.floor(q.height / F.scaleResolutionDownBy),
        Math.max(
          15e4,
          Math.floor(
            q.encoding.maxBitrate /
              (Math.pow(F.scaleResolutionDownBy, 2) *
                (((B = q.encoding.maxFramerate) !== null && B !== void 0
                  ? B
                  : 30) /
                  ((V = F.fps) !== null && V !== void 0 ? V : 30)))
          )
        ),
        F.fps,
        q.encoding.priority
      );
    }),
  videoRids = ["q", "h", "f"];
function computeVideoEncodings(q, U, F, B) {
  var V, j;
  let $ = B == null ? void 0 : B.videoEncoding;
  q && ($ = B == null ? void 0 : B.screenShareEncoding);
  const W = B == null ? void 0 : B.simulcast,
    K = B == null ? void 0 : B.scalabilityMode,
    G = B == null ? void 0 : B.videoCodec;
  if ((!$ && !W && !K) || !U || !F) return [{}];
  $ ||
    (($ = determineAppropriateEncoding(q, U, F, G)),
    livekitLogger.debug("using video encoding", $));
  const Q = $.maxFramerate,
    z = new VideoPreset(U, F, $.maxBitrate, $.maxFramerate, $.priority);
  if (K && isSVCCodec(G)) {
    const X = new ScalabilityMode(K),
      Z = [];
    if (X.spatial > 3)
      throw new Error("unsupported scalabilityMode: ".concat(K));
    const ie = getBrowser();
    if (
      isSafari() ||
      isReactNative() ||
      ((ie == null ? void 0 : ie.name) === "Chrome" &&
        compareVersions(ie == null ? void 0 : ie.version, "113") < 0)
    ) {
      const ee = X.suffix == "h" ? 2 : 3;
      for (let te = 0; te < X.spatial; te += 1)
        Z.push({
          rid: videoRids[2 - te],
          maxBitrate: $.maxBitrate / Math.pow(ee, te),
          maxFramerate: z.encoding.maxFramerate,
        });
      Z[0].scalabilityMode = K;
    } else
      Z.push({
        maxBitrate: $.maxBitrate,
        maxFramerate: z.encoding.maxFramerate,
        scalabilityMode: K,
      });
    return (
      z.encoding.priority &&
        ((Z[0].priority = z.encoding.priority),
        (Z[0].networkPriority = z.encoding.priority)),
      livekitLogger.debug("using svc encoding", { encodings: Z }),
      Z
    );
  }
  if (!W) return [$];
  let H = [];
  q
    ? (H =
        (V = sortPresets(B == null ? void 0 : B.screenShareSimulcastLayers)) !==
          null && V !== void 0
          ? V
          : defaultSimulcastLayers(q, z))
    : (H =
        (j = sortPresets(B == null ? void 0 : B.videoSimulcastLayers)) !==
          null && j !== void 0
          ? j
          : defaultSimulcastLayers(q, z));
  let Y;
  if (H.length > 0) {
    const X = H[0];
    H.length > 1 && ([, Y] = H);
    const Z = Math.max(U, F);
    if (Z >= 960 && Y) return encodingsFromPresets(U, F, [X, Y, z], Q);
    if (Z >= 480) return encodingsFromPresets(U, F, [X, z], Q);
  }
  return encodingsFromPresets(U, F, [z]);
}
function computeTrackBackupEncodings(q, U, F) {
  var B, V, j, $;
  if (
    !F.backupCodec ||
    F.backupCodec === !0 ||
    F.backupCodec.codec === F.videoCodec
  )
    return;
  U !== F.backupCodec.codec &&
    livekitLogger.warn("requested a different codec than specified as backup", {
      serverRequested: U,
      backup: F.backupCodec.codec,
    }),
    (F.videoCodec = U),
    (F.videoEncoding = F.backupCodec.encoding);
  const W = q.mediaStreamTrack.getSettings(),
    K =
      (B = W.width) !== null && B !== void 0
        ? B
        : (V = q.dimensions) === null || V === void 0
        ? void 0
        : V.width,
    G =
      (j = W.height) !== null && j !== void 0
        ? j
        : ($ = q.dimensions) === null || $ === void 0
        ? void 0
        : $.height;
  return (
    q.source === Track.Source.ScreenShare && F.simulcast && (F.simulcast = !1),
    computeVideoEncodings(q.source === Track.Source.ScreenShare, K, G, F)
  );
}
function determineAppropriateEncoding(q, U, F, B) {
  const V = presetsForResolution(q, U, F);
  let { encoding: j } = V[0];
  const $ = Math.max(U, F);
  for (let W = 0; W < V.length; W += 1) {
    const K = V[W];
    if (((j = K.encoding), K.width >= $)) break;
  }
  if (B)
    switch (B) {
      case "av1":
        (j = Object.assign({}, j)), (j.maxBitrate = j.maxBitrate * 0.7);
        break;
      case "vp9":
        (j = Object.assign({}, j)), (j.maxBitrate = j.maxBitrate * 0.85);
        break;
    }
  return j;
}
function presetsForResolution(q, U, F) {
  if (q) return presetsScreenShare;
  const B = U > F ? U / F : F / U;
  return Math.abs(B - 16 / 9) < Math.abs(B - 4 / 3) ? presets169 : presets43;
}
function defaultSimulcastLayers(q, U) {
  if (q) return computeDefaultScreenShareSimulcastPresets(U);
  const { width: F, height: B } = U,
    V = F > B ? F / B : B / F;
  return Math.abs(V - 16 / 9) < Math.abs(V - 4 / 3)
    ? defaultSimulcastPresets169
    : defaultSimulcastPresets43;
}
function encodingsFromPresets(q, U, F, B) {
  const V = [];
  if (
    (F.forEach((j, $) => {
      if ($ >= videoRids.length) return;
      const W = Math.min(q, U),
        G = {
          rid: videoRids[$],
          scaleResolutionDownBy: Math.max(1, W / Math.min(j.width, j.height)),
          maxBitrate: j.encoding.maxBitrate,
        },
        Q =
          B && j.encoding.maxFramerate
            ? Math.min(B, j.encoding.maxFramerate)
            : j.encoding.maxFramerate;
      Q && (G.maxFramerate = Q);
      const z = isFireFox() || $ === 0;
      j.encoding.priority &&
        z &&
        ((G.priority = j.encoding.priority),
        (G.networkPriority = j.encoding.priority)),
        V.push(G);
    }),
    isReactNative() && getReactNativeOs() === "ios")
  ) {
    let j;
    V.forEach((W) => {
      j
        ? W.maxFramerate && W.maxFramerate > j && (j = W.maxFramerate)
        : (j = W.maxFramerate);
    });
    let $ = !0;
    V.forEach((W) => {
      var K;
      W.maxFramerate != j &&
        ($ &&
          (($ = !1),
          livekitLogger.info(
            "Simulcast on iOS React-Native requires all encodings to share the same framerate."
          )),
        livekitLogger.info(
          'Setting framerate of encoding "'
            .concat((K = W.rid) !== null && K !== void 0 ? K : "", '" to ')
            .concat(j)
        ),
        (W.maxFramerate = j));
    });
  }
  return V;
}
function sortPresets(q) {
  if (q)
    return q.sort((U, F) => {
      const { encoding: B } = U,
        { encoding: V } = F;
      return B.maxBitrate > V.maxBitrate
        ? 1
        : B.maxBitrate < V.maxBitrate
        ? -1
        : B.maxBitrate === V.maxBitrate && B.maxFramerate && V.maxFramerate
        ? B.maxFramerate > V.maxFramerate
          ? 1
          : -1
        : 0;
    });
}
class ScalabilityMode {
  constructor(U) {
    const F = U.match(/^L(\d)T(\d)(h|_KEY|_KEY_SHIFT){0,1}$/);
    if (!F) throw new Error("invalid scalability mode");
    if (
      ((this.spatial = parseInt(F[1])),
      (this.temporal = parseInt(F[2])),
      F.length > 3)
    )
      switch (F[3]) {
        case "h":
        case "_KEY":
        case "_KEY_SHIFT":
          this.suffix = F[3];
      }
  }
  toString() {
    var U;
    return "L"
      .concat(this.spatial, "T")
      .concat(this.temporal)
      .concat((U = this.suffix) !== null && U !== void 0 ? U : "");
  }
}
function getDefaultDegradationPreference(q) {
  return q.source === Track.Source.ScreenShare ||
    (q.constraints.height && unwrapConstraint(q.constraints.height) >= 1080)
    ? "maintain-resolution"
    : "balanced";
}
const refreshSubscribedCodecAfterNewCodec = 5e3;
class LocalVideoTrack extends LocalTrack {
  get sender() {
    return this._sender;
  }
  set sender(U) {
    (this._sender = U),
      this.degradationPreference &&
        this.setDegradationPreference(this.degradationPreference);
  }
  constructor(U, F) {
    let B = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0,
      V = arguments.length > 3 ? arguments[3] : void 0;
    super(U, Track.Kind.Video, F, B, V),
      (this.simulcastCodecs = new Map()),
      (this.degradationPreference = "balanced"),
      (this.monitorSender = () =>
        __awaiter$1(this, void 0, void 0, function* () {
          if (!this.sender) {
            this._currentBitrate = 0;
            return;
          }
          let j;
          try {
            j = yield this.getSenderStats();
          } catch (W) {
            this.log.error(
              "could not get audio sender stats",
              Object.assign(Object.assign({}, this.logContext), { error: W })
            );
            return;
          }
          const $ = new Map(j.map((W) => [W.rid, W]));
          if (this.prevStats) {
            let W = 0;
            $.forEach((K, G) => {
              var Q;
              const z =
                (Q = this.prevStats) === null || Q === void 0
                  ? void 0
                  : Q.get(G);
              W += computeBitrate(K, z);
            }),
              (this._currentBitrate = W);
          }
          this.prevStats = $;
        })),
      (this.senderLock = new _$1());
  }
  get isSimulcast() {
    return !!(this.sender && this.sender.getParameters().encodings.length > 1);
  }
  startMonitor(U) {
    var F;
    if (((this.signalClient = U), !isWeb())) return;
    const B =
      (F = this.sender) === null || F === void 0 ? void 0 : F.getParameters();
    B && (this.encodings = B.encodings),
      !this.monitorInterval &&
        (this.monitorInterval = setInterval(() => {
          this.monitorSender();
        }, monitorFrequency));
  }
  stop() {
    this._mediaStreamTrack.getConstraints(),
      this.simulcastCodecs.forEach((U) => {
        U.mediaStreamTrack.stop();
      }),
      super.stop();
  }
  pauseUpstream() {
    const U = Object.create(null, {
      pauseUpstream: { get: () => super.pauseUpstream },
    });
    return __awaiter$1(this, void 0, void 0, function* () {
      var F, B, V, j, $;
      yield U.pauseUpstream.call(this);
      try {
        for (
          var W = !0, K = __asyncValues(this.simulcastCodecs.values()), G;
          (G = yield K.next()), (F = G.done), !F;
          W = !0
        )
          (j = G.value),
            (W = !1),
            yield ($ = j.sender) === null || $ === void 0
              ? void 0
              : $.replaceTrack(null);
      } catch (Q) {
        B = { error: Q };
      } finally {
        try {
          !W && !F && (V = K.return) && (yield V.call(K));
        } finally {
          if (B) throw B.error;
        }
      }
    });
  }
  resumeUpstream() {
    const U = Object.create(null, {
      resumeUpstream: { get: () => super.resumeUpstream },
    });
    return __awaiter$1(this, void 0, void 0, function* () {
      var F, B, V, j, $;
      yield U.resumeUpstream.call(this);
      try {
        for (
          var W = !0, K = __asyncValues(this.simulcastCodecs.values()), G;
          (G = yield K.next()), (F = G.done), !F;
          W = !0
        ) {
          (j = G.value), (W = !1);
          const Q = j;
          yield ($ = Q.sender) === null || $ === void 0
            ? void 0
            : $.replaceTrack(Q.mediaStreamTrack);
        }
      } catch (Q) {
        B = { error: Q };
      } finally {
        try {
          !W && !F && (V = K.return) && (yield V.call(K));
        } finally {
          if (B) throw B.error;
        }
      }
    });
  }
  mute() {
    const U = Object.create(null, { mute: { get: () => super.mute } });
    return __awaiter$1(this, void 0, void 0, function* () {
      const F = yield this.muteLock.lock();
      try {
        return this.isMuted
          ? (this.log.debug("Track already muted", this.logContext), this)
          : (this.source === Track.Source.Camera &&
              !this.isUserProvided &&
              (this.log.debug("stopping camera track", this.logContext),
              this._mediaStreamTrack.stop()),
            yield U.mute.call(this),
            this);
      } finally {
        F();
      }
    });
  }
  unmute() {
    const U = Object.create(null, { unmute: { get: () => super.unmute } });
    return __awaiter$1(this, void 0, void 0, function* () {
      const F = yield this.muteLock.lock();
      try {
        return this.isMuted
          ? (this.source === Track.Source.Camera &&
              !this.isUserProvided &&
              (this.log.debug("reacquiring camera track", this.logContext),
              yield this.restartTrack()),
            yield U.unmute.call(this),
            this)
          : (this.log.debug("Track already unmuted", this.logContext), this);
      } finally {
        F();
      }
    });
  }
  setTrackMuted(U) {
    super.setTrackMuted(U);
    for (const F of this.simulcastCodecs.values())
      F.mediaStreamTrack.enabled = !U;
  }
  getSenderStats() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      if (!(!((U = this.sender) === null || U === void 0) && U.getStats))
        return [];
      const F = [],
        B = yield this.sender.getStats();
      return (
        B.forEach((V) => {
          var j;
          if (V.type === "outbound-rtp") {
            const $ = {
                type: "video",
                streamId: V.id,
                frameHeight: V.frameHeight,
                frameWidth: V.frameWidth,
                framesPerSecond: V.framesPerSecond,
                framesSent: V.framesSent,
                firCount: V.firCount,
                pliCount: V.pliCount,
                nackCount: V.nackCount,
                packetsSent: V.packetsSent,
                bytesSent: V.bytesSent,
                qualityLimitationReason: V.qualityLimitationReason,
                qualityLimitationDurations: V.qualityLimitationDurations,
                qualityLimitationResolutionChanges:
                  V.qualityLimitationResolutionChanges,
                rid: (j = V.rid) !== null && j !== void 0 ? j : V.id,
                retransmittedPacketsSent: V.retransmittedPacketsSent,
                targetBitrate: V.targetBitrate,
                timestamp: V.timestamp,
              },
              W = B.get(V.remoteId);
            W &&
              (($.jitter = W.jitter),
              ($.packetsLost = W.packetsLost),
              ($.roundTripTime = W.roundTripTime)),
              F.push($);
          }
        }),
        F.sort((V, j) => {
          var $, W;
          return (
            (($ = j.frameWidth) !== null && $ !== void 0 ? $ : 0) -
            ((W = V.frameWidth) !== null && W !== void 0 ? W : 0)
          );
        }),
        F
      );
    });
  }
  setPublishingQuality(U) {
    const F = [];
    for (let B = VideoQuality.LOW; B <= VideoQuality.HIGH; B += 1)
      F.push(new SubscribedQuality({ quality: B, enabled: B <= U }));
    this.log.debug(
      "setting publishing quality. max quality ".concat(U),
      this.logContext
    ),
      this.setPublishingLayers(F);
  }
  restartTrack(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F, B, V, j, $;
      let W;
      if (U) {
        const z = constraintsForOptions({ video: U });
        typeof z.video != "boolean" && (W = z.video);
      }
      yield this.restart(W);
      try {
        for (
          var K = !0, G = __asyncValues(this.simulcastCodecs.values()), Q;
          (Q = yield G.next()), (F = Q.done), !F;
          K = !0
        ) {
          (j = Q.value), (K = !1);
          const z = j;
          z.sender &&
            (($ = z.sender.transport) === null || $ === void 0
              ? void 0
              : $.state) !== "closed" &&
            ((z.mediaStreamTrack = this.mediaStreamTrack.clone()),
            yield z.sender.replaceTrack(z.mediaStreamTrack));
        }
      } catch (z) {
        B = { error: z };
      } finally {
        try {
          !K && !F && (V = G.return) && (yield V.call(G));
        } finally {
          if (B) throw B.error;
        }
      }
    });
  }
  setProcessor(U) {
    const F = Object.create(null, {
      setProcessor: { get: () => super.setProcessor },
    });
    return __awaiter$1(this, arguments, void 0, function (B) {
      var V = this;
      let j =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
      return (function* () {
        var $, W, K, G, Q, z;
        if (
          (yield F.setProcessor.call(V, B, j),
          !((Q = V.processor) === null || Q === void 0) && Q.processedTrack)
        )
          try {
            for (
              var H = !0, Y = __asyncValues(V.simulcastCodecs.values()), X;
              (X = yield Y.next()), ($ = X.done), !$;
              H = !0
            )
              (G = X.value),
                (H = !1),
                yield (z = G.sender) === null || z === void 0
                  ? void 0
                  : z.replaceTrack(V.processor.processedTrack);
          } catch (Z) {
            W = { error: Z };
          } finally {
            try {
              !H && !$ && (K = Y.return) && (yield K.call(Y));
            } finally {
              if (W) throw W.error;
            }
          }
      })();
    });
  }
  setDegradationPreference(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (((this.degradationPreference = U), this.sender))
        try {
          this.log.debug(
            "setting degradationPreference to ".concat(U),
            this.logContext
          );
          const F = this.sender.getParameters();
          (F.degradationPreference = U), this.sender.setParameters(F);
        } catch (F) {
          this.log.warn(
            "failed to set degradationPreference",
            Object.assign({ error: F }, this.logContext)
          );
        }
    });
  }
  addSimulcastTrack(U, F) {
    if (this.simulcastCodecs.has(U)) {
      this.log.error(
        "".concat(U, " already added, skipping adding simulcast codec"),
        this.logContext
      );
      return;
    }
    const B = {
      codec: U,
      mediaStreamTrack: this.mediaStreamTrack.clone(),
      sender: void 0,
      encodings: F,
    };
    return this.simulcastCodecs.set(U, B), B;
  }
  setSimulcastTrackSender(U, F) {
    const B = this.simulcastCodecs.get(U);
    B &&
      ((B.sender = F),
      setTimeout(() => {
        this.subscribedCodecs &&
          this.setPublishingCodecs(this.subscribedCodecs);
      }, refreshSubscribedCodecAfterNewCodec));
  }
  setPublishingCodecs(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F, B, V, j, $, W, K;
      if (
        (this.log.debug(
          "setting publishing codecs",
          Object.assign(Object.assign({}, this.logContext), {
            codecs: U,
            currentCodec: this.codec,
          })
        ),
        !this.codec && U.length > 0)
      )
        return yield this.setPublishingLayers(U[0].qualities), [];
      this.subscribedCodecs = U;
      const G = [];
      try {
        for (
          F = !0, B = __asyncValues(U);
          (V = yield B.next()), (j = V.done), !j;
          F = !0
        ) {
          (K = V.value), (F = !1);
          const Q = K;
          if (!this.codec || this.codec === Q.codec)
            yield this.setPublishingLayers(Q.qualities);
          else {
            const z = this.simulcastCodecs.get(Q.codec);
            if (
              (this.log.debug(
                "try setPublishingCodec for ".concat(Q.codec),
                Object.assign(Object.assign({}, this.logContext), {
                  simulcastCodecInfo: z,
                })
              ),
              !z || !z.sender)
            ) {
              for (const H of Q.qualities)
                if (H.enabled) {
                  G.push(Q.codec);
                  break;
                }
            } else
              z.encodings &&
                (this.log.debug(
                  "try setPublishingLayersForSender ".concat(Q.codec),
                  this.logContext
                ),
                yield setPublishingLayersForSender(
                  z.sender,
                  z.encodings,
                  Q.qualities,
                  this.senderLock,
                  this.log,
                  this.logContext
                ));
          }
        }
      } catch (Q) {
        $ = { error: Q };
      } finally {
        try {
          !F && !j && (W = B.return) && (yield W.call(B));
        } finally {
          if ($) throw $.error;
        }
      }
      return G;
    });
  }
  setPublishingLayers(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      this.log.debug(
        "setting publishing layers",
        Object.assign(Object.assign({}, this.logContext), { qualities: U })
      ),
        !(!this.sender || !this.encodings) &&
          (yield setPublishingLayersForSender(
            this.sender,
            this.encodings,
            U,
            this.senderLock,
            this.log,
            this.logContext
          ));
    });
  }
  handleAppVisibilityChanged() {
    const U = Object.create(null, {
      handleAppVisibilityChanged: {
        get: () => super.handleAppVisibilityChanged,
      },
    });
    return __awaiter$1(this, void 0, void 0, function* () {
      yield U.handleAppVisibilityChanged.call(this),
        isMobile() &&
          this.isInBackground &&
          this.source === Track.Source.Camera &&
          (this._mediaStreamTrack.enabled = !1);
    });
  }
}
function setPublishingLayersForSender(q, U, F, B, V, j) {
  return __awaiter$1(this, void 0, void 0, function* () {
    const $ = yield B.lock();
    V.debug(
      "setPublishingLayersForSender",
      Object.assign(Object.assign({}, j), {
        sender: q,
        qualities: F,
        senderEncodings: U,
      })
    );
    try {
      const W = q.getParameters(),
        { encodings: K } = W;
      if (!K) return;
      if (K.length !== U.length) {
        V.warn(
          "cannot set publishing layers, encodings mismatch",
          Object.assign(Object.assign({}, j), {
            encodings: K,
            senderEncodings: U,
          })
        );
        return;
      }
      let G = !1;
      const Q = getBrowser();
      if (
        (Q == null ? void 0 : Q.name) === "Chrome" &&
        compareVersions(Q == null ? void 0 : Q.version, "133") > 0 &&
        K[0].scalabilityMode
      ) {
        const H = K[0],
          Y = new ScalabilityMode(H.scalabilityMode);
        let X = VideoQuality$1.OFF;
        if (
          (F.forEach((Z) => {
            Z.enabled &&
              (X === VideoQuality$1.OFF || Z.quality > X) &&
              (X = Z.quality);
          }),
          X === VideoQuality$1.OFF)
        )
          H.active && ((H.active = !1), (G = !0));
        else if (!H.active || Y.spatial !== X + 1) {
          (G = !0), (H.active = !0);
          const Z = new ScalabilityMode(U[0].scalabilityMode);
          (Y.spatial = X + 1),
            (Y.suffix = Z.suffix),
            Y.spatial === 1 && (Y.suffix = void 0),
            (H.scalabilityMode = Y.toString()),
            (H.scaleResolutionDownBy = Math.pow(2, 2 - X)),
            U[0].maxBitrate &&
              (H.maxBitrate =
                U[0].maxBitrate /
                (H.scaleResolutionDownBy * H.scaleResolutionDownBy));
        }
      } else
        K.forEach((H, Y) => {
          var X;
          let Z = (X = H.rid) !== null && X !== void 0 ? X : "";
          Z === "" && (Z = "q");
          const ie = videoQualityForRid(Z),
            ee = F.find((te) => te.quality === ie);
          ee &&
            H.active !== ee.enabled &&
            ((G = !0),
            (H.active = ee.enabled),
            V.debug(
              "setting layer "
                .concat(ee.quality, " to ")
                .concat(H.active ? "enabled" : "disabled"),
              j
            ),
            isFireFox() &&
              (ee.enabled
                ? ((H.scaleResolutionDownBy = U[Y].scaleResolutionDownBy),
                  (H.maxBitrate = U[Y].maxBitrate),
                  (H.maxFrameRate = U[Y].maxFrameRate))
                : ((H.scaleResolutionDownBy = 4),
                  (H.maxBitrate = 10),
                  (H.maxFrameRate = 2))));
        });
      G &&
        ((W.encodings = K),
        V.debug(
          "setting encodings",
          Object.assign(Object.assign({}, j), { encodings: W.encodings })
        ),
        yield q.setParameters(W));
    } finally {
      $();
    }
  });
}
function videoQualityForRid(q) {
  switch (q) {
    case "f":
      return VideoQuality.HIGH;
    case "h":
      return VideoQuality.MEDIUM;
    case "q":
      return VideoQuality.LOW;
    default:
      return VideoQuality.HIGH;
  }
}
function videoLayersFromEncodings(q, U, F, B) {
  if (!F)
    return [
      new VideoLayer({
        quality: VideoQuality.HIGH,
        width: q,
        height: U,
        bitrate: 0,
        ssrc: 0,
      }),
    ];
  if (B) {
    const V = F[0].scalabilityMode,
      j = new ScalabilityMode(V),
      $ = [],
      W = j.suffix == "h" ? 1.5 : 2,
      K = j.suffix == "h" ? 2 : 3;
    for (let G = 0; G < j.spatial; G += 1)
      $.push(
        new VideoLayer({
          quality: Math.min(VideoQuality.HIGH, j.spatial - 1) - G,
          width: Math.ceil(q / Math.pow(W, G)),
          height: Math.ceil(U / Math.pow(W, G)),
          bitrate: F[0].maxBitrate
            ? Math.ceil(F[0].maxBitrate / Math.pow(K, G))
            : 0,
          ssrc: 0,
        })
      );
    return $;
  }
  return F.map((V) => {
    var j, $, W;
    const K = (j = V.scaleResolutionDownBy) !== null && j !== void 0 ? j : 1;
    let G = videoQualityForRid(($ = V.rid) !== null && $ !== void 0 ? $ : "");
    return new VideoLayer({
      quality: G,
      width: Math.ceil(q / K),
      height: Math.ceil(U / K),
      bitrate: (W = V.maxBitrate) !== null && W !== void 0 ? W : 0,
      ssrc: 0,
    });
  });
}
const lossyDataChannel = "_lossy",
  reliableDataChannel = "_reliable",
  minReconnectWait = 2 * 1e3,
  leaveReconnect = "leave-reconnect";
var PCState;
(function (q) {
  (q[(q.New = 0)] = "New"),
    (q[(q.Connected = 1)] = "Connected"),
    (q[(q.Disconnected = 2)] = "Disconnected"),
    (q[(q.Reconnecting = 3)] = "Reconnecting"),
    (q[(q.Closed = 4)] = "Closed");
})(PCState || (PCState = {}));
class RTCEngine extends eventsExports.EventEmitter {
  get isClosed() {
    return this._isClosed;
  }
  get pendingReconnect() {
    return !!this.reconnectTimeout;
  }
  constructor(U) {
    var F;
    super(),
      (this.options = U),
      (this.rtcConfig = {}),
      (this.peerConnectionTimeout =
        roomConnectOptionDefaults.peerConnectionTimeout),
      (this.fullReconnectOnNext = !1),
      (this.subscriberPrimary = !1),
      (this.pcState = PCState.New),
      (this._isClosed = !0),
      (this.pendingTrackResolvers = {}),
      (this.reconnectAttempts = 0),
      (this.reconnectStart = 0),
      (this.attemptingReconnect = !1),
      (this.joinAttempts = 0),
      (this.maxJoinAttempts = 1),
      (this.shouldFailNext = !1),
      (this.log = livekitLogger),
      (this.handleDataChannel = (B) =>
        __awaiter$1(this, [B], void 0, function (V) {
          var j = this;
          let { channel: $ } = V;
          return (function* () {
            if ($) {
              if ($.label === reliableDataChannel) j.reliableDCSub = $;
              else if ($.label === lossyDataChannel) j.lossyDCSub = $;
              else return;
              j.log.debug(
                "on data channel ".concat($.id, ", ").concat($.label),
                j.logContext
              ),
                ($.onmessage = j.handleDataMessage);
            }
          })();
        })),
      (this.handleDataMessage = (B) =>
        __awaiter$1(this, void 0, void 0, function* () {
          var V, j;
          const $ = yield this.dataProcessLock.lock();
          try {
            let W;
            if (B.data instanceof ArrayBuffer) W = B.data;
            else if (B.data instanceof Blob) W = yield B.data.arrayBuffer();
            else {
              this.log.error(
                "unsupported data type",
                Object.assign(Object.assign({}, this.logContext), {
                  data: B.data,
                })
              );
              return;
            }
            const K = DataPacket.fromBinary(new Uint8Array(W));
            ((V = K.value) === null || V === void 0 ? void 0 : V.case) ===
            "speaker"
              ? this.emit(
                  EngineEvent.ActiveSpeakersUpdate,
                  K.value.value.speakers
                )
              : (((j = K.value) === null || j === void 0 ? void 0 : j.case) ===
                  "user" && applyUserDataCompat(K, K.value.value),
                this.emit(EngineEvent.DataPacketReceived, K));
          } finally {
            $();
          }
        })),
      (this.handleDataError = (B) => {
        const j = B.currentTarget.maxRetransmits === 0 ? "lossy" : "reliable";
        if (B instanceof ErrorEvent && B.error) {
          const { error: $ } = B.error;
          this.log.error(
            "DataChannel error on ".concat(j, ": ").concat(B.message),
            Object.assign(Object.assign({}, this.logContext), { error: $ })
          );
        } else
          this.log.error(
            "Unknown DataChannel error on ".concat(j),
            Object.assign(Object.assign({}, this.logContext), { event: B })
          );
      }),
      (this.handleBufferedAmountLow = (B) => {
        const j =
          B.currentTarget.maxRetransmits === 0
            ? DataPacket_Kind.LOSSY
            : DataPacket_Kind.RELIABLE;
        this.updateAndEmitDCBufferStatus(j);
      }),
      (this.handleDisconnect = (B, V) => {
        if (this._isClosed) return;
        this.log.warn("".concat(B, " disconnected"), this.logContext),
          this.reconnectAttempts === 0 && (this.reconnectStart = Date.now());
        const j = (K) => {
            this.log.warn(
              "could not recover connection after "
                .concat(this.reconnectAttempts, " attempts, ")
                .concat(K, "ms. giving up"),
              this.logContext
            ),
              this.emit(EngineEvent.Disconnected),
              this.close();
          },
          $ = Date.now() - this.reconnectStart;
        let W = this.getNextRetryDelay({
          elapsedMs: $,
          retryCount: this.reconnectAttempts,
        });
        if (W === null) {
          j($);
          return;
        }
        B === leaveReconnect && (W = 0),
          this.log.debug("reconnecting in ".concat(W, "ms"), this.logContext),
          this.clearReconnectTimeout(),
          this.token &&
            this.regionUrlProvider &&
            this.regionUrlProvider.updateToken(this.token),
          (this.reconnectTimeout = CriticalTimers.setTimeout(
            () =>
              this.attemptReconnect(V).finally(
                () => (this.reconnectTimeout = void 0)
              ),
            W
          ));
      }),
      (this.waitForRestarted = () =>
        new Promise((B, V) => {
          this.pcState === PCState.Connected && B();
          const j = () => {
              this.off(EngineEvent.Disconnected, $), B();
            },
            $ = () => {
              this.off(EngineEvent.Restarted, j), V();
            };
          this.once(EngineEvent.Restarted, j),
            this.once(EngineEvent.Disconnected, $);
        })),
      (this.updateAndEmitDCBufferStatus = (B) => {
        const V = this.isBufferStatusLow(B);
        typeof V < "u" &&
          V !== this.dcBufferStatus.get(B) &&
          (this.dcBufferStatus.set(B, V),
          this.emit(EngineEvent.DCBufferStatusChanged, V, B));
      }),
      (this.isBufferStatusLow = (B) => {
        const V = this.dataChannelForKind(B);
        if (V) return V.bufferedAmount <= V.bufferedAmountLowThreshold;
      }),
      (this.handleBrowserOnLine = () => {
        this.client.currentState === SignalConnectionState.RECONNECTING &&
          (this.clearReconnectTimeout(),
          this.attemptReconnect(ReconnectReason.RR_SIGNAL_DISCONNECTED));
      }),
      (this.log = getLogger(
        (F = U.loggerName) !== null && F !== void 0 ? F : LoggerNames.Engine
      )),
      (this.loggerOptions = {
        loggerName: U.loggerName,
        loggerContextCb: () => this.logContext,
      }),
      (this.client = new SignalClient(void 0, this.loggerOptions)),
      (this.client.signalLatency = this.options.expSignalLatency),
      (this.reconnectPolicy = this.options.reconnectPolicy),
      this.registerOnLineListener(),
      (this.closingLock = new _$1()),
      (this.dataProcessLock = new _$1()),
      (this.dcBufferStatus = new Map([
        [DataPacket_Kind.LOSSY, !0],
        [DataPacket_Kind.RELIABLE, !0],
      ])),
      (this.client.onParticipantUpdate = (B) =>
        this.emit(EngineEvent.ParticipantUpdate, B)),
      (this.client.onConnectionQuality = (B) =>
        this.emit(EngineEvent.ConnectionQualityUpdate, B)),
      (this.client.onRoomUpdate = (B) => this.emit(EngineEvent.RoomUpdate, B)),
      (this.client.onSubscriptionError = (B) =>
        this.emit(EngineEvent.SubscriptionError, B)),
      (this.client.onSubscriptionPermissionUpdate = (B) =>
        this.emit(EngineEvent.SubscriptionPermissionUpdate, B)),
      (this.client.onSpeakersChanged = (B) =>
        this.emit(EngineEvent.SpeakersChanged, B)),
      (this.client.onStreamStateUpdate = (B) =>
        this.emit(EngineEvent.StreamStateChanged, B)),
      (this.client.onRequestResponse = (B) =>
        this.emit(EngineEvent.SignalRequestResponse, B));
  }
  get logContext() {
    var U, F, B, V, j, $, W, K;
    return {
      room:
        (F =
          (U = this.latestJoinResponse) === null || U === void 0
            ? void 0
            : U.room) === null || F === void 0
          ? void 0
          : F.name,
      roomID:
        (V =
          (B = this.latestJoinResponse) === null || B === void 0
            ? void 0
            : B.room) === null || V === void 0
          ? void 0
          : V.sid,
      participant:
        ($ =
          (j = this.latestJoinResponse) === null || j === void 0
            ? void 0
            : j.participant) === null || $ === void 0
          ? void 0
          : $.identity,
      pID:
        (K =
          (W = this.latestJoinResponse) === null || W === void 0
            ? void 0
            : W.participant) === null || K === void 0
          ? void 0
          : K.sid,
    };
  }
  join(U, F, B, V) {
    return __awaiter$1(this, void 0, void 0, function* () {
      (this.url = U),
        (this.token = F),
        (this.signalOpts = B),
        (this.maxJoinAttempts = B.maxRetries);
      try {
        (this.joinAttempts += 1), this.setupSignalClientCallbacks();
        const j = yield this.client.join(U, F, B, V);
        return (
          (this._isClosed = !1),
          (this.latestJoinResponse = j),
          (this.subscriberPrimary = j.subscriberPrimary),
          this.pcManager || (yield this.configure(j)),
          (!this.subscriberPrimary || j.fastPublish) && this.negotiate(),
          (this.clientConfiguration = j.clientConfiguration),
          setTimeout(() => {
            this.emit(EngineEvent.SignalConnected);
          }, 10),
          j
        );
      } catch (j) {
        if (
          j instanceof ConnectionError &&
          j.reason === ConnectionErrorReason.ServerUnreachable &&
          (this.log.warn(
            "Couldn't connect to server, attempt "
              .concat(this.joinAttempts, " of ")
              .concat(this.maxJoinAttempts),
            this.logContext
          ),
          this.joinAttempts < this.maxJoinAttempts)
        )
          return this.join(U, F, B, V);
        throw j;
      }
    });
  }
  close() {
    return __awaiter$1(this, void 0, void 0, function* () {
      const U = yield this.closingLock.lock();
      if (this.isClosed) {
        U();
        return;
      }
      try {
        (this._isClosed = !0),
          (this.joinAttempts = 0),
          this.emit(EngineEvent.Closing),
          this.removeAllListeners(),
          this.deregisterOnLineListener(),
          this.clearPendingReconnect(),
          yield this.cleanupPeerConnections(),
          yield this.cleanupClient();
      } finally {
        U();
      }
    });
  }
  cleanupPeerConnections() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      yield (U = this.pcManager) === null || U === void 0 ? void 0 : U.close(),
        (this.pcManager = void 0);
      const F = (B) => {
        B &&
          (B.close(),
          (B.onbufferedamountlow = null),
          (B.onclose = null),
          (B.onclosing = null),
          (B.onerror = null),
          (B.onmessage = null),
          (B.onopen = null));
      };
      F(this.lossyDC),
        F(this.lossyDCSub),
        F(this.reliableDC),
        F(this.reliableDCSub),
        (this.lossyDC = void 0),
        (this.lossyDCSub = void 0),
        (this.reliableDC = void 0),
        (this.reliableDCSub = void 0);
    });
  }
  cleanupClient() {
    return __awaiter$1(this, void 0, void 0, function* () {
      yield this.client.close(), this.client.resetCallbacks();
    });
  }
  addTrack(U) {
    if (this.pendingTrackResolvers[U.cid])
      throw new TrackInvalidError(
        "a track with the same ID has already been published"
      );
    return new Promise((F, B) => {
      const V = setTimeout(() => {
        delete this.pendingTrackResolvers[U.cid],
          B(
            new ConnectionError(
              "publication of local track timed out, no response from server",
              ConnectionErrorReason.InternalError
            )
          );
      }, 1e4);
      (this.pendingTrackResolvers[U.cid] = {
        resolve: (j) => {
          clearTimeout(V), F(j);
        },
        reject: () => {
          clearTimeout(V),
            B(new Error("Cancelled publication by calling unpublish"));
        },
      }),
        this.client.sendAddTrack(U);
    });
  }
  removeTrack(U) {
    if (U.track && this.pendingTrackResolvers[U.track.id]) {
      const { reject: F } = this.pendingTrackResolvers[U.track.id];
      F && F(), delete this.pendingTrackResolvers[U.track.id];
    }
    try {
      return this.pcManager.removeTrack(U), !0;
    } catch (F) {
      this.log.warn(
        "failed to remove track",
        Object.assign(Object.assign({}, this.logContext), { error: F })
      );
    }
    return !1;
  }
  updateMuteStatus(U, F) {
    this.client.sendMuteTrack(U, F);
  }
  get dataSubscriberReadyState() {
    var U;
    return (U = this.reliableDCSub) === null || U === void 0
      ? void 0
      : U.readyState;
  }
  getConnectedServerAddress() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      return (U = this.pcManager) === null || U === void 0
        ? void 0
        : U.getConnectedAddress();
    });
  }
  setRegionUrlProvider(U) {
    this.regionUrlProvider = U;
  }
  configure(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F, B;
      if (
        this.pcManager &&
        this.pcManager.currentState !== PCTransportState.NEW
      )
        return;
      this.participantSid =
        (F = U.participant) === null || F === void 0 ? void 0 : F.sid;
      const V = this.makeRTCConfiguration(U);
      (this.pcManager = new PCTransportManager(
        V,
        U.subscriberPrimary,
        this.loggerOptions
      )),
        this.emit(
          EngineEvent.TransportsCreated,
          this.pcManager.publisher,
          this.pcManager.subscriber
        ),
        (this.pcManager.onIceCandidate = (j, $) => {
          this.client.sendIceCandidate(j, $);
        }),
        (this.pcManager.onPublisherOffer = (j) => {
          this.client.sendOffer(j);
        }),
        (this.pcManager.onDataChannel = this.handleDataChannel),
        (this.pcManager.onStateChange = (j, $, W) =>
          __awaiter$1(this, void 0, void 0, function* () {
            if (
              (this.log.debug(
                "primary PC state changed ".concat(j),
                this.logContext
              ),
              ["closed", "disconnected", "failed"].includes($) &&
                (this.publisherConnectionPromise = void 0),
              j === PCTransportState.CONNECTED)
            ) {
              const Q = this.pcState === PCState.New;
              (this.pcState = PCState.Connected),
                Q && this.emit(EngineEvent.Connected, U);
            } else j === PCTransportState.FAILED && this.pcState === PCState.Connected && ((this.pcState = PCState.Disconnected), this.handleDisconnect("peerconnection failed", W === "failed" ? ReconnectReason.RR_SUBSCRIBER_FAILED : ReconnectReason.RR_PUBLISHER_FAILED));
            const K =
                this.client.isDisconnected ||
                this.client.currentState === SignalConnectionState.RECONNECTING,
              G = [
                PCTransportState.FAILED,
                PCTransportState.CLOSING,
                PCTransportState.CLOSED,
              ].includes(j);
            K && G && !this._isClosed && this.emit(EngineEvent.Offline);
          })),
        (this.pcManager.onTrack = (j) => {
          this.emit(
            EngineEvent.MediaTrackAdded,
            j.track,
            j.streams[0],
            j.receiver
          );
        }),
        supportOptionalDatachannel(
          (B = U.serverInfo) === null || B === void 0 ? void 0 : B.protocol
        ) || this.createDataChannels();
    });
  }
  setupSignalClientCallbacks() {
    (this.client.onAnswer = (U) =>
      __awaiter$1(this, void 0, void 0, function* () {
        this.pcManager &&
          (this.log.debug(
            "received server answer",
            Object.assign(Object.assign({}, this.logContext), {
              RTCSdpType: U.type,
            })
          ),
          yield this.pcManager.setPublisherAnswer(U));
      })),
      (this.client.onTrickle = (U, F) => {
        this.pcManager &&
          (this.log.debug(
            "got ICE candidate from peer",
            Object.assign(Object.assign({}, this.logContext), {
              candidate: U,
              target: F,
            })
          ),
          this.pcManager.addIceCandidate(U, F));
      }),
      (this.client.onOffer = (U) =>
        __awaiter$1(this, void 0, void 0, function* () {
          if (!this.pcManager) return;
          const F = yield this.pcManager.createSubscriberAnswerFromOffer(U);
          this.client.sendAnswer(F);
        })),
      (this.client.onLocalTrackPublished = (U) => {
        var F;
        if (
          (this.log.debug(
            "received trackPublishedResponse",
            Object.assign(Object.assign({}, this.logContext), {
              cid: U.cid,
              track: (F = U.track) === null || F === void 0 ? void 0 : F.sid,
            })
          ),
          !this.pendingTrackResolvers[U.cid])
        ) {
          this.log.error(
            "missing track resolver for ".concat(U.cid),
            Object.assign(Object.assign({}, this.logContext), { cid: U.cid })
          );
          return;
        }
        const { resolve: B } = this.pendingTrackResolvers[U.cid];
        delete this.pendingTrackResolvers[U.cid], B(U.track);
      }),
      (this.client.onLocalTrackUnpublished = (U) => {
        this.emit(EngineEvent.LocalTrackUnpublished, U);
      }),
      (this.client.onLocalTrackSubscribed = (U) => {
        this.emit(EngineEvent.LocalTrackSubscribed, U);
      }),
      (this.client.onTokenRefresh = (U) => {
        this.token = U;
      }),
      (this.client.onRemoteMuteChanged = (U, F) => {
        this.emit(EngineEvent.RemoteMute, U, F);
      }),
      (this.client.onSubscribedQualityUpdate = (U) => {
        this.emit(EngineEvent.SubscribedQualityUpdate, U);
      }),
      (this.client.onClose = () => {
        this.handleDisconnect("signal", ReconnectReason.RR_SIGNAL_DISCONNECTED);
      }),
      (this.client.onLeave = (U) => {
        switch (
          (this.log.debug(
            "client leave request",
            Object.assign(Object.assign({}, this.logContext), {
              reason: U == null ? void 0 : U.reason,
            })
          ),
          U.regions &&
            this.regionUrlProvider &&
            (this.log.debug("updating regions", this.logContext),
            this.regionUrlProvider.setServerReportedRegions(U.regions)),
          U.action)
        ) {
          case LeaveRequest_Action.DISCONNECT:
            this.emit(EngineEvent.Disconnected, U == null ? void 0 : U.reason),
              this.close();
            break;
          case LeaveRequest_Action.RECONNECT:
            (this.fullReconnectOnNext = !0),
              this.handleDisconnect(leaveReconnect);
            break;
          case LeaveRequest_Action.RESUME:
            this.handleDisconnect(leaveReconnect);
        }
      });
  }
  makeRTCConfiguration(U) {
    var F;
    const B = Object.assign({}, this.rtcConfig);
    if (
      (!((F = this.signalOpts) === null || F === void 0) &&
        F.e2eeEnabled &&
        (this.log.debug(
          "E2EE - setting up transports with insertable streams",
          this.logContext
        ),
        (B.encodedInsertableStreams = !0)),
      U.iceServers && !B.iceServers)
    ) {
      const V = [];
      U.iceServers.forEach((j) => {
        const $ = { urls: j.urls };
        j.username && ($.username = j.username),
          j.credential && ($.credential = j.credential),
          V.push($);
      }),
        (B.iceServers = V);
    }
    return (
      U.clientConfiguration &&
        U.clientConfiguration.forceRelay === ClientConfigSetting.ENABLED &&
        (B.iceTransportPolicy = "relay"),
      (B.sdpSemantics = "unified-plan"),
      (B.continualGatheringPolicy = "gather_continually"),
      B
    );
  }
  createDataChannels() {
    this.pcManager &&
      (this.lossyDC &&
        ((this.lossyDC.onmessage = null), (this.lossyDC.onerror = null)),
      this.reliableDC &&
        ((this.reliableDC.onmessage = null), (this.reliableDC.onerror = null)),
      (this.lossyDC = this.pcManager.createPublisherDataChannel(
        lossyDataChannel,
        { ordered: !0, maxRetransmits: 0 }
      )),
      (this.reliableDC = this.pcManager.createPublisherDataChannel(
        reliableDataChannel,
        { ordered: !0 }
      )),
      (this.lossyDC.onmessage = this.handleDataMessage),
      (this.reliableDC.onmessage = this.handleDataMessage),
      (this.lossyDC.onerror = this.handleDataError),
      (this.reliableDC.onerror = this.handleDataError),
      (this.lossyDC.bufferedAmountLowThreshold = 65535),
      (this.reliableDC.bufferedAmountLowThreshold = 65535),
      (this.lossyDC.onbufferedamountlow = this.handleBufferedAmountLow),
      (this.reliableDC.onbufferedamountlow = this.handleBufferedAmountLow));
  }
  createSender(U, F, B) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (supportsTransceiver())
        return yield this.createTransceiverRTCRtpSender(U, F, B);
      if (supportsAddTrack())
        return (
          this.log.warn("using add-track fallback", this.logContext),
          yield this.createRTCRtpSender(U.mediaStreamTrack)
        );
      throw new UnexpectedConnectionState(
        "Required webRTC APIs not supported on this device"
      );
    });
  }
  createSimulcastSender(U, F, B, V) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (supportsTransceiver())
        return this.createSimulcastTransceiverSender(U, F, B, V);
      if (supportsAddTrack())
        return (
          this.log.debug("using add-track fallback", this.logContext),
          this.createRTCRtpSender(U.mediaStreamTrack)
        );
      throw new UnexpectedConnectionState("Cannot stream on this device");
    });
  }
  createTransceiverRTCRtpSender(U, F, B) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (!this.pcManager)
        throw new UnexpectedConnectionState("publisher is closed");
      const V = [];
      U.mediaStream && V.push(U.mediaStream),
        isVideoTrack(U) && (U.codec = F.videoCodec);
      const j = { direction: "sendonly", streams: V };
      return (
        B && (j.sendEncodings = B),
        (yield this.pcManager.addPublisherTransceiver(U.mediaStreamTrack, j))
          .sender
      );
    });
  }
  createSimulcastTransceiverSender(U, F, B, V) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (!this.pcManager)
        throw new UnexpectedConnectionState("publisher is closed");
      const j = { direction: "sendonly" };
      V && (j.sendEncodings = V);
      const $ = yield this.pcManager.addPublisherTransceiver(
        F.mediaStreamTrack,
        j
      );
      if (B.videoCodec)
        return U.setSimulcastTrackSender(B.videoCodec, $.sender), $.sender;
    });
  }
  createRTCRtpSender(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (!this.pcManager)
        throw new UnexpectedConnectionState("publisher is closed");
      return this.pcManager.addPublisherTrack(U);
    });
  }
  attemptReconnect(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F, B, V;
      if (!this._isClosed) {
        if (this.attemptingReconnect) {
          livekitLogger.warn(
            "already attempting reconnect, returning early",
            this.logContext
          );
          return;
        }
        (((F = this.clientConfiguration) === null || F === void 0
          ? void 0
          : F.resumeConnection) === ClientConfigSetting.DISABLED ||
          ((V =
            (B = this.pcManager) === null || B === void 0
              ? void 0
              : B.currentState) !== null && V !== void 0
            ? V
            : PCTransportState.NEW) === PCTransportState.NEW) &&
          (this.fullReconnectOnNext = !0);
        try {
          (this.attemptingReconnect = !0),
            this.fullReconnectOnNext
              ? yield this.restartConnection()
              : yield this.resumeConnection(U),
            this.clearPendingReconnect(),
            (this.fullReconnectOnNext = !1);
        } catch (j) {
          this.reconnectAttempts += 1;
          let $ = !0;
          j instanceof UnexpectedConnectionState
            ? (this.log.debug(
                "received unrecoverable error",
                Object.assign(Object.assign({}, this.logContext), { error: j })
              ),
              ($ = !1))
            : j instanceof SignalReconnectError ||
              (this.fullReconnectOnNext = !0),
            $
              ? this.handleDisconnect("reconnect", ReconnectReason.RR_UNKNOWN)
              : (this.log.info(
                  "could not recover connection after "
                    .concat(this.reconnectAttempts, " attempts, ")
                    .concat(Date.now() - this.reconnectStart, "ms. giving up"),
                  this.logContext
                ),
                this.emit(EngineEvent.Disconnected),
                yield this.close());
        } finally {
          this.attemptingReconnect = !1;
        }
      }
    });
  }
  getNextRetryDelay(U) {
    try {
      return this.reconnectPolicy.nextRetryDelayInMs(U);
    } catch (F) {
      this.log.warn(
        "encountered error in reconnect policy",
        Object.assign(Object.assign({}, this.logContext), { error: F })
      );
    }
    return null;
  }
  restartConnection(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F, B, V;
      try {
        if (!this.url || !this.token)
          throw new UnexpectedConnectionState(
            "could not reconnect, url or token not saved"
          );
        this.log.info(
          "reconnecting, attempt: ".concat(this.reconnectAttempts),
          this.logContext
        ),
          this.emit(EngineEvent.Restarting),
          this.client.isDisconnected || (yield this.client.sendLeave()),
          yield this.cleanupPeerConnections(),
          yield this.cleanupClient();
        let j;
        try {
          if (!this.signalOpts)
            throw (
              (this.log.warn(
                "attempted connection restart, without signal options present",
                this.logContext
              ),
              new SignalReconnectError())
            );
          j = yield this.join(U ?? this.url, this.token, this.signalOpts);
        } catch ($) {
          throw $ instanceof ConnectionError &&
            $.reason === ConnectionErrorReason.NotAllowed
            ? new UnexpectedConnectionState(
                "could not reconnect, token might be expired"
              )
            : new SignalReconnectError();
        }
        if (this.shouldFailNext)
          throw ((this.shouldFailNext = !1), new Error("simulated failure"));
        if (
          (this.client.setReconnected(),
          this.emit(EngineEvent.SignalRestarted, j),
          yield this.waitForPCReconnected(),
          this.client.currentState !== SignalConnectionState.CONNECTED)
        )
          throw new SignalReconnectError(
            "Signal connection got severed during reconnect"
          );
        (F = this.regionUrlProvider) === null ||
          F === void 0 ||
          F.resetAttempts(),
          this.emit(EngineEvent.Restarted);
      } catch (j) {
        const $ = yield (B = this.regionUrlProvider) === null || B === void 0
          ? void 0
          : B.getNextBestRegionUrl();
        if ($) {
          yield this.restartConnection($);
          return;
        } else throw ((V = this.regionUrlProvider) === null || V === void 0 || V.resetAttempts(), j);
      }
    });
  }
  resumeConnection(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F;
      if (!this.url || !this.token)
        throw new UnexpectedConnectionState(
          "could not reconnect, url or token not saved"
        );
      if (!this.pcManager)
        throw new UnexpectedConnectionState(
          "publisher and subscriber connections unset"
        );
      this.log.info(
        "resuming signal connection, attempt ".concat(this.reconnectAttempts),
        this.logContext
      ),
        this.emit(EngineEvent.Resuming);
      let B;
      try {
        this.setupSignalClientCallbacks(),
          (B = yield this.client.reconnect(
            this.url,
            this.token,
            this.participantSid,
            U
          ));
      } catch (V) {
        let j = "";
        throw (
          (V instanceof Error &&
            ((j = V.message),
            this.log.error(
              V.message,
              Object.assign(Object.assign({}, this.logContext), { error: V })
            )),
          V instanceof ConnectionError &&
          V.reason === ConnectionErrorReason.NotAllowed
            ? new UnexpectedConnectionState(
                "could not reconnect, token might be expired"
              )
            : V instanceof ConnectionError &&
              V.reason === ConnectionErrorReason.LeaveRequest
            ? V
            : new SignalReconnectError(j))
        );
      }
      if ((this.emit(EngineEvent.SignalResumed), B)) {
        const V = this.makeRTCConfiguration(B);
        this.pcManager.updateConfiguration(V);
      } else this.log.warn("Did not receive reconnect response", this.logContext);
      if (this.shouldFailNext)
        throw ((this.shouldFailNext = !1), new Error("simulated failure"));
      if (
        (yield this.pcManager.triggerIceRestart(),
        yield this.waitForPCReconnected(),
        this.client.currentState !== SignalConnectionState.CONNECTED)
      )
        throw new SignalReconnectError(
          "Signal connection got severed during reconnect"
        );
      this.client.setReconnected(),
        ((F = this.reliableDC) === null || F === void 0
          ? void 0
          : F.readyState) === "open" &&
          this.reliableDC.id === null &&
          this.createDataChannels(),
        this.emit(EngineEvent.Resumed);
    });
  }
  waitForPCInitialConnection(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (!this.pcManager)
        throw new UnexpectedConnectionState("PC manager is closed");
      yield this.pcManager.ensurePCTransportConnection(F, U);
    });
  }
  waitForPCReconnected() {
    return __awaiter$1(this, void 0, void 0, function* () {
      (this.pcState = PCState.Reconnecting),
        this.log.debug(
          "waiting for peer connection to reconnect",
          this.logContext
        );
      try {
        if ((yield sleep$1(minReconnectWait), !this.pcManager))
          throw new UnexpectedConnectionState("PC manager is closed");
        yield this.pcManager.ensurePCTransportConnection(
          void 0,
          this.peerConnectionTimeout
        ),
          (this.pcState = PCState.Connected);
      } catch (U) {
        throw (
          ((this.pcState = PCState.Disconnected),
          new ConnectionError(
            "could not establish PC connection, ".concat(U.message),
            ConnectionErrorReason.InternalError
          ))
        );
      }
    });
  }
  publishRpcResponse(U, F, B, V) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const j = new DataPacket({
        destinationIdentities: [U],
        kind: DataPacket_Kind.RELIABLE,
        value: {
          case: "rpcResponse",
          value: new RpcResponse({
            requestId: F,
            value: V
              ? { case: "error", value: V.toProto() }
              : { case: "payload", value: B ?? "" },
          }),
        },
      });
      yield this.sendDataPacket(j, DataPacket_Kind.RELIABLE);
    });
  }
  publishRpcAck(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const B = new DataPacket({
        destinationIdentities: [U],
        kind: DataPacket_Kind.RELIABLE,
        value: { case: "rpcAck", value: new RpcAck({ requestId: F }) },
      });
      yield this.sendDataPacket(B, DataPacket_Kind.RELIABLE);
    });
  }
  sendDataPacket(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const B = U.toBinary();
      yield this.ensurePublisherConnected(F);
      const V = this.dataChannelForKind(F);
      V && V.send(B), this.updateAndEmitDCBufferStatus(F);
    });
  }
  waitForBufferStatusLow(U) {
    return new Promise((F, B) =>
      __awaiter$1(this, void 0, void 0, function* () {
        if (this.isBufferStatusLow(U)) F();
        else {
          const V = () => B("Engine closed");
          for (this.once(EngineEvent.Closing, V); !this.dcBufferStatus.get(U); )
            yield sleep$1(10);
          this.off(EngineEvent.Closing, V), F();
        }
      })
    );
  }
  ensureDataTransportConnected(U) {
    return __awaiter$1(this, arguments, void 0, function (F) {
      var B = this;
      let V =
        arguments.length > 1 && arguments[1] !== void 0
          ? arguments[1]
          : this.subscriberPrimary;
      return (function* () {
        var j;
        if (!B.pcManager)
          throw new UnexpectedConnectionState("PC manager is closed");
        const $ = V ? B.pcManager.subscriber : B.pcManager.publisher,
          W = V ? "Subscriber" : "Publisher";
        if (!$)
          throw new ConnectionError(
            "".concat(W, " connection not set"),
            ConnectionErrorReason.InternalError
          );
        let K = !1;
        !V && !B.dataChannelForKind(F, V) && (B.createDataChannels(), (K = !0)),
          !K &&
            !V &&
            !B.pcManager.publisher.isICEConnected &&
            B.pcManager.publisher.getICEConnectionState() !== "checking" &&
            (K = !0),
          K && B.negotiate();
        const G = B.dataChannelForKind(F, V);
        if ((G == null ? void 0 : G.readyState) === "open") return;
        const Q = new Date().getTime() + B.peerConnectionTimeout;
        for (; new Date().getTime() < Q; ) {
          if (
            $.isICEConnected &&
            ((j = B.dataChannelForKind(F, V)) === null || j === void 0
              ? void 0
              : j.readyState) === "open"
          )
            return;
          yield sleep$1(50);
        }
        throw new ConnectionError(
          "could not establish "
            .concat(W, " connection, state: ")
            .concat($.getICEConnectionState()),
          ConnectionErrorReason.InternalError
        );
      })();
    });
  }
  ensurePublisherConnected(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      this.publisherConnectionPromise ||
        (this.publisherConnectionPromise = this.ensureDataTransportConnected(
          U,
          !1
        )),
        yield this.publisherConnectionPromise;
    });
  }
  verifyTransport() {
    return !(
      !this.pcManager ||
      this.pcManager.currentState !== PCTransportState.CONNECTED ||
      !this.client.ws ||
      this.client.ws.readyState === WebSocket.CLOSED
    );
  }
  negotiate() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return new Promise((U, F) =>
        __awaiter$1(this, void 0, void 0, function* () {
          if (!this.pcManager) {
            F(new NegotiationError("PC manager is closed"));
            return;
          }
          this.pcManager.requirePublisher(),
            this.pcManager.publisher.getTransceivers().length == 0 &&
              !this.lossyDC &&
              !this.reliableDC &&
              this.createDataChannels();
          const B = new AbortController(),
            V = () => {
              B.abort(),
                this.log.debug(
                  "engine disconnected while negotiation was ongoing",
                  this.logContext
                ),
                U();
            };
          this.isClosed && F("cannot negotiate on closed engine"),
            this.on(EngineEvent.Closing, V),
            this.pcManager.publisher.once(
              PCEvents.RTPVideoPayloadTypes,
              (j) => {
                const $ = new Map();
                j.forEach((W) => {
                  const K = W.codec.toLowerCase();
                  isVideoCodec(K) && $.set(W.payload, K);
                }),
                  this.emit(EngineEvent.RTPVideoMapUpdate, $);
              }
            );
          try {
            yield this.pcManager.negotiate(B), U();
          } catch (j) {
            j instanceof NegotiationError && (this.fullReconnectOnNext = !0),
              this.handleDisconnect("negotiation", ReconnectReason.RR_UNKNOWN),
              F(j);
          } finally {
            this.off(EngineEvent.Closing, V);
          }
        })
      );
    });
  }
  dataChannelForKind(U, F) {
    if (F) {
      if (U === DataPacket_Kind.LOSSY) return this.lossyDCSub;
      if (U === DataPacket_Kind.RELIABLE) return this.reliableDCSub;
    } else {
      if (U === DataPacket_Kind.LOSSY) return this.lossyDC;
      if (U === DataPacket_Kind.RELIABLE) return this.reliableDC;
    }
  }
  sendSyncState(U, F) {
    var B, V;
    if (!this.pcManager) {
      this.log.warn(
        "sync state cannot be sent without peer connection setup",
        this.logContext
      );
      return;
    }
    const j = this.pcManager.subscriber.getLocalDescription(),
      $ = this.pcManager.subscriber.getRemoteDescription(),
      W =
        (V =
          (B = this.signalOpts) === null || B === void 0
            ? void 0
            : B.autoSubscribe) !== null && V !== void 0
          ? V
          : !0,
      K = new Array(),
      G = new Array();
    U.forEach((Q) => {
      Q.isDesired !== W && K.push(Q.trackSid),
        Q.isEnabled || G.push(Q.trackSid);
    }),
      this.client.sendSyncState(
        new SyncState({
          answer: j
            ? toProtoSessionDescription({ sdp: j.sdp, type: j.type })
            : void 0,
          offer: $
            ? toProtoSessionDescription({ sdp: $.sdp, type: $.type })
            : void 0,
          subscription: new UpdateSubscription({
            trackSids: K,
            subscribe: !W,
            participantTracks: [],
          }),
          publishTracks: getTrackPublicationInfo(F),
          dataChannels: this.dataChannelsInfo(),
          trackSidsDisabled: G,
        })
      );
  }
  failNext() {
    this.shouldFailNext = !0;
  }
  dataChannelsInfo() {
    const U = [],
      F = (B, V) => {
        (B == null ? void 0 : B.id) !== void 0 &&
          B.id !== null &&
          U.push(new DataChannelInfo({ label: B.label, id: B.id, target: V }));
      };
    return (
      F(this.dataChannelForKind(DataPacket_Kind.LOSSY), SignalTarget.PUBLISHER),
      F(
        this.dataChannelForKind(DataPacket_Kind.RELIABLE),
        SignalTarget.PUBLISHER
      ),
      F(
        this.dataChannelForKind(DataPacket_Kind.LOSSY, !0),
        SignalTarget.SUBSCRIBER
      ),
      F(
        this.dataChannelForKind(DataPacket_Kind.RELIABLE, !0),
        SignalTarget.SUBSCRIBER
      ),
      U
    );
  }
  clearReconnectTimeout() {
    this.reconnectTimeout && CriticalTimers.clearTimeout(this.reconnectTimeout);
  }
  clearPendingReconnect() {
    this.clearReconnectTimeout(), (this.reconnectAttempts = 0);
  }
  registerOnLineListener() {
    isWeb() && window.addEventListener("online", this.handleBrowserOnLine);
  }
  deregisterOnLineListener() {
    isWeb() && window.removeEventListener("online", this.handleBrowserOnLine);
  }
}
class SignalReconnectError extends Error {}
function supportOptionalDatachannel(q) {
  return q !== void 0 && q > 13;
}
function applyUserDataCompat(q, U) {
  const F = q.participantIdentity
    ? q.participantIdentity
    : U.participantIdentity;
  (q.participantIdentity = F), (U.participantIdentity = F);
  const B =
    q.destinationIdentities.length !== 0
      ? q.destinationIdentities
      : U.destinationIdentities;
  (q.destinationIdentities = B), (U.destinationIdentities = B);
}
class RegionUrlProvider {
  constructor(U, F) {
    (this.lastUpdateAt = 0),
      (this.settingsCacheTime = 3e3),
      (this.attemptedRegions = []),
      (this.serverUrl = new URL(U)),
      (this.token = F);
  }
  updateToken(U) {
    this.token = U;
  }
  isCloud() {
    return isCloud(this.serverUrl);
  }
  getServerUrl() {
    return this.serverUrl;
  }
  getNextBestRegionUrl(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (!this.isCloud())
        throw Error(
          "region availability is only supported for LiveKit Cloud domains"
        );
      (!this.regionSettings ||
        Date.now() - this.lastUpdateAt > this.settingsCacheTime) &&
        (this.regionSettings = yield this.fetchRegionSettings(U));
      const F = this.regionSettings.regions.filter(
        (B) => !this.attemptedRegions.find((V) => V.url === B.url)
      );
      if (F.length > 0) {
        const B = F[0];
        return (
          this.attemptedRegions.push(B),
          livekitLogger.debug("next region: ".concat(B.region)),
          B.url
        );
      } else return null;
    });
  }
  resetAttempts() {
    this.attemptedRegions = [];
  }
  fetchRegionSettings(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const F = yield fetch(
        "".concat(getCloudConfigUrl(this.serverUrl), "/regions"),
        { headers: { authorization: "Bearer ".concat(this.token) }, signal: U }
      );
      if (F.ok) {
        const B = yield F.json();
        return (this.lastUpdateAt = Date.now()), B;
      } else throw new ConnectionError("Could not fetch region settings: ".concat(F.statusText), F.status === 401 ? ConnectionErrorReason.NotAllowed : ConnectionErrorReason.InternalError, F.status);
    });
  }
  setServerReportedRegions(U) {
    (this.regionSettings = U), (this.lastUpdateAt = Date.now());
  }
}
function getCloudConfigUrl(q) {
  return ""
    .concat(q.protocol.replace("ws", "http"), "//")
    .concat(q.host, "/settings");
}
class BaseStreamReader {
  get info() {
    return this._info;
  }
  constructor(U, F, B) {
    (this.reader = F),
      (this.totalByteSize = B),
      (this._info = U),
      (this.bytesReceived = 0);
  }
}
class ByteStreamReader extends BaseStreamReader {
  handleChunkReceived(U) {
    var F;
    this.bytesReceived += U.content.byteLength;
    const B = this.totalByteSize
      ? this.bytesReceived / this.totalByteSize
      : void 0;
    (F = this.onProgress) === null || F === void 0 || F.call(this, B);
  }
  [Symbol.asyncIterator]() {
    const U = this.reader.getReader();
    return {
      next: () =>
        __awaiter$1(this, void 0, void 0, function* () {
          try {
            const { done: F, value: B } = yield U.read();
            return F
              ? { done: !0, value: void 0 }
              : (this.handleChunkReceived(B), { done: !1, value: B.content });
          } catch {
            return { done: !0, value: void 0 };
          }
        }),
      return() {
        return __awaiter$1(this, void 0, void 0, function* () {
          return U.releaseLock(), { done: !0, value: void 0 };
        });
      },
    };
  }
  readAll() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U, F, B, V;
      let j = new Set();
      try {
        for (
          var $ = !0, W = __asyncValues(this), K;
          (K = yield W.next()), (U = K.done), !U;
          $ = !0
        ) {
          (V = K.value), ($ = !1);
          const G = V;
          j.add(G);
        }
      } catch (G) {
        F = { error: G };
      } finally {
        try {
          !$ && !U && (B = W.return) && (yield B.call(W));
        } finally {
          if (F) throw F.error;
        }
      }
      return Array.from(j);
    });
  }
}
class TextStreamReader extends BaseStreamReader {
  constructor(U, F, B) {
    super(U, F, B), (this.receivedChunks = new Map());
  }
  handleChunkReceived(U) {
    var F;
    const B = bigIntToNumber(U.chunkIndex),
      V = this.receivedChunks.get(B);
    if (V && V.version > U.version) return;
    this.receivedChunks.set(B, U), (this.bytesReceived += U.content.byteLength);
    const j = this.totalByteSize
      ? this.bytesReceived / this.totalByteSize
      : void 0;
    (F = this.onProgress) === null || F === void 0 || F.call(this, j);
  }
  [Symbol.asyncIterator]() {
    const U = this.reader.getReader(),
      F = new TextDecoder();
    return {
      next: () =>
        __awaiter$1(this, void 0, void 0, function* () {
          try {
            const { done: B, value: V } = yield U.read();
            return B
              ? { done: !0, value: void 0 }
              : (this.handleChunkReceived(V),
                { done: !1, value: F.decode(V.content) });
          } catch {
            return { done: !0, value: void 0 };
          }
        }),
      return() {
        return __awaiter$1(this, void 0, void 0, function* () {
          return U.releaseLock(), { done: !0, value: void 0 };
        });
      },
    };
  }
  readAll() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U, F, B, V;
      let j = "";
      try {
        for (
          var $ = !0, W = __asyncValues(this), K;
          (K = yield W.next()), (U = K.done), !U;
          $ = !0
        )
          (V = K.value), ($ = !1), (j += V);
      } catch (G) {
        F = { error: G };
      } finally {
        try {
          !$ && !U && (B = W.return) && (yield B.call(W));
        } finally {
          if (F) throw F.error;
        }
      }
      return j;
    });
  }
}
class BaseStreamWriter {
  constructor(U, F, B) {
    (this.writableStream = U),
      (this.defaultWriter = U.getWriter()),
      (this.onClose = B),
      (this.info = F);
  }
  write(U) {
    return this.defaultWriter.write(U);
  }
  close() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      yield this.defaultWriter.close(),
        this.defaultWriter.releaseLock(),
        (U = this.onClose) === null || U === void 0 || U.call(this);
    });
  }
}
class TextStreamWriter extends BaseStreamWriter {}
class ByteStreamWriter extends BaseStreamWriter {}
class RemoteTrack extends Track {
  constructor(U, F, B, V, j) {
    super(U, B, j), (this.sid = F), (this.receiver = V);
  }
  get isLocal() {
    return !1;
  }
  setMuted(U) {
    this.isMuted !== U &&
      ((this.isMuted = U),
      (this._mediaStreamTrack.enabled = !U),
      this.emit(U ? TrackEvent.Muted : TrackEvent.Unmuted, this));
  }
  setMediaStream(U) {
    this.mediaStream = U;
    const F = (B) => {
      B.track === this._mediaStreamTrack &&
        (U.removeEventListener("removetrack", F),
        this.receiver &&
          "playoutDelayHint" in this.receiver &&
          (this.receiver.playoutDelayHint = void 0),
        (this.receiver = void 0),
        (this._currentBitrate = 0),
        this.emit(TrackEvent.Ended, this));
    };
    U.addEventListener("removetrack", F);
  }
  start() {
    this.startMonitor(), super.enable();
  }
  stop() {
    this.stopMonitor(), super.disable();
  }
  getRTCStatsReport() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      return !((U = this.receiver) === null || U === void 0) && U.getStats
        ? yield this.receiver.getStats()
        : void 0;
    });
  }
  setPlayoutDelay(U) {
    this.receiver
      ? "playoutDelayHint" in this.receiver
        ? (this.receiver.playoutDelayHint = U)
        : this.log.warn("Playout delay not supported in this browser")
      : this.log.warn("Cannot set playout delay, track already ended");
  }
  getPlayoutDelay() {
    if (this.receiver) {
      if ("playoutDelayHint" in this.receiver)
        return this.receiver.playoutDelayHint;
      this.log.warn("Playout delay not supported in this browser");
    } else this.log.warn("Cannot get playout delay, track already ended");
    return 0;
  }
  startMonitor() {
    this.monitorInterval ||
      (this.monitorInterval = setInterval(
        () => this.monitorReceiver(),
        monitorFrequency
      )),
      supportsSynchronizationSources() && this.registerTimeSyncUpdate();
  }
  registerTimeSyncUpdate() {
    const U = () => {
      var F;
      this.timeSyncHandle = requestAnimationFrame(() => U());
      const B =
        (F = this.receiver) === null || F === void 0
          ? void 0
          : F.getSynchronizationSources()[0];
      if (B) {
        const { timestamp: V, rtpTimestamp: j } = B;
        j &&
          this.rtpTimestamp !== j &&
          (this.emit(TrackEvent.TimeSyncUpdate, {
            timestamp: V,
            rtpTimestamp: j,
          }),
          (this.rtpTimestamp = j));
      }
    };
    U();
  }
}
class RemoteAudioTrack extends RemoteTrack {
  constructor(U, F, B, V, j, $) {
    super(U, F, Track.Kind.Audio, B, $),
      (this.monitorReceiver = () =>
        __awaiter$1(this, void 0, void 0, function* () {
          if (!this.receiver) {
            this._currentBitrate = 0;
            return;
          }
          const W = yield this.getReceiverStats();
          W &&
            this.prevStats &&
            this.receiver &&
            (this._currentBitrate = computeBitrate(W, this.prevStats)),
            (this.prevStats = W);
        })),
      (this.audioContext = V),
      (this.webAudioPluginNodes = []),
      j && (this.sinkId = j.deviceId);
  }
  setVolume(U) {
    var F;
    for (const B of this.attachedElements)
      this.audioContext
        ? (F = this.gainNode) === null ||
          F === void 0 ||
          F.gain.setTargetAtTime(U, 0, 0.1)
        : (B.volume = U);
    isReactNative() && this._mediaStreamTrack._setVolume(U),
      (this.elementVolume = U);
  }
  getVolume() {
    if (this.elementVolume) return this.elementVolume;
    if (isReactNative()) return 1;
    let U = 0;
    return (
      this.attachedElements.forEach((F) => {
        F.volume > U && (U = F.volume);
      }),
      U
    );
  }
  setSinkId(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      (this.sinkId = U),
        yield Promise.all(
          this.attachedElements.map((F) => {
            if (supportsSetSinkId(F)) return F.setSinkId(U);
          })
        );
    });
  }
  attach(U) {
    const F = this.attachedElements.length === 0;
    return (
      U ? super.attach(U) : (U = super.attach()),
      this.sinkId && supportsSetSinkId(U) && U.setSinkId(this.sinkId),
      this.audioContext &&
        F &&
        (this.log.debug("using audio context mapping", this.logContext),
        this.connectWebAudio(this.audioContext, U),
        (U.volume = 0),
        (U.muted = !0)),
      this.elementVolume && this.setVolume(this.elementVolume),
      U
    );
  }
  detach(U) {
    let F;
    return (
      U
        ? ((F = super.detach(U)),
          this.audioContext &&
            (this.attachedElements.length > 0
              ? this.connectWebAudio(
                  this.audioContext,
                  this.attachedElements[0]
                )
              : this.disconnectWebAudio()))
        : ((F = super.detach()), this.disconnectWebAudio()),
      F
    );
  }
  setAudioContext(U) {
    (this.audioContext = U),
      U && this.attachedElements.length > 0
        ? this.connectWebAudio(U, this.attachedElements[0])
        : U || this.disconnectWebAudio();
  }
  setWebAudioPlugins(U) {
    (this.webAudioPluginNodes = U),
      this.attachedElements.length > 0 &&
        this.audioContext &&
        this.connectWebAudio(this.audioContext, this.attachedElements[0]);
  }
  connectWebAudio(U, F) {
    this.disconnectWebAudio(),
      (this.sourceNode = U.createMediaStreamSource(F.srcObject));
    let B = this.sourceNode;
    this.webAudioPluginNodes.forEach((V) => {
      B.connect(V), (B = V);
    }),
      (this.gainNode = U.createGain()),
      B.connect(this.gainNode),
      this.gainNode.connect(U.destination),
      this.elementVolume &&
        this.gainNode.gain.setTargetAtTime(this.elementVolume, 0, 0.1),
      U.state !== "running" &&
        U.resume()
          .then(() => {
            U.state !== "running" &&
              this.emit(
                TrackEvent.AudioPlaybackFailed,
                new Error("Audio Context couldn't be started automatically")
              );
          })
          .catch((V) => {
            this.emit(TrackEvent.AudioPlaybackFailed, V);
          });
  }
  disconnectWebAudio() {
    var U, F;
    (U = this.gainNode) === null || U === void 0 || U.disconnect(),
      (F = this.sourceNode) === null || F === void 0 || F.disconnect(),
      (this.gainNode = void 0),
      (this.sourceNode = void 0);
  }
  getReceiverStats() {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (!this.receiver || !this.receiver.getStats) return;
      const U = yield this.receiver.getStats();
      let F;
      return (
        U.forEach((B) => {
          B.type === "inbound-rtp" &&
            (F = {
              type: "audio",
              streamId: B.id,
              timestamp: B.timestamp,
              jitter: B.jitter,
              bytesReceived: B.bytesReceived,
              concealedSamples: B.concealedSamples,
              concealmentEvents: B.concealmentEvents,
              silentConcealedSamples: B.silentConcealedSamples,
              silentConcealmentEvents: B.silentConcealmentEvents,
              totalAudioEnergy: B.totalAudioEnergy,
              totalSamplesDuration: B.totalSamplesDuration,
            });
        }),
        F
      );
    });
  }
}
const REACTION_DELAY = 100;
class RemoteVideoTrack extends RemoteTrack {
  constructor(U, F, B, V, j) {
    super(U, F, Track.Kind.Video, B, j),
      (this.elementInfos = []),
      (this.monitorReceiver = () =>
        __awaiter$1(this, void 0, void 0, function* () {
          if (!this.receiver) {
            this._currentBitrate = 0;
            return;
          }
          const $ = yield this.getReceiverStats();
          $ &&
            this.prevStats &&
            this.receiver &&
            (this._currentBitrate = computeBitrate($, this.prevStats)),
            (this.prevStats = $);
        })),
      (this.debouncedHandleResize = r$1(() => {
        this.updateDimensions();
      }, REACTION_DELAY)),
      (this.adaptiveStreamSettings = V);
  }
  get isAdaptiveStream() {
    return this.adaptiveStreamSettings !== void 0;
  }
  get mediaStreamTrack() {
    return this._mediaStreamTrack;
  }
  setMuted(U) {
    super.setMuted(U),
      this.attachedElements.forEach((F) => {
        U
          ? detachTrack(this._mediaStreamTrack, F)
          : attachToElement(this._mediaStreamTrack, F);
      });
  }
  attach(U) {
    if (
      (U ? super.attach(U) : (U = super.attach()),
      this.adaptiveStreamSettings &&
        this.elementInfos.find((F) => F.element === U) === void 0)
    ) {
      const F = new HTMLElementInfo(U);
      this.observeElementInfo(F);
    }
    return U;
  }
  observeElementInfo(U) {
    this.adaptiveStreamSettings &&
    this.elementInfos.find((F) => F === U) === void 0
      ? ((U.handleResize = () => {
          this.debouncedHandleResize();
        }),
        (U.handleVisibilityChanged = () => {
          this.updateVisibility();
        }),
        this.elementInfos.push(U),
        U.observe(),
        this.debouncedHandleResize(),
        this.updateVisibility())
      : this.log.warn(
          "visibility resize observer not triggered",
          this.logContext
        );
  }
  stopObservingElementInfo(U) {
    if (!this.isAdaptiveStream) {
      this.log.warn("stopObservingElementInfo ignored", this.logContext);
      return;
    }
    const F = this.elementInfos.filter((B) => B === U);
    for (const B of F) B.stopObserving();
    (this.elementInfos = this.elementInfos.filter((B) => B !== U)),
      this.updateVisibility(),
      this.debouncedHandleResize();
  }
  detach(U) {
    let F = [];
    if (U) return this.stopObservingElement(U), super.detach(U);
    F = super.detach();
    for (const B of F) this.stopObservingElement(B);
    return F;
  }
  getDecoderImplementation() {
    var U;
    return (U = this.prevStats) === null || U === void 0
      ? void 0
      : U.decoderImplementation;
  }
  getReceiverStats() {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (!this.receiver || !this.receiver.getStats) return;
      const U = yield this.receiver.getStats();
      let F,
        B = "",
        V = new Map();
      return (
        U.forEach((j) => {
          j.type === "inbound-rtp"
            ? ((B = j.codecId),
              (F = {
                type: "video",
                streamId: j.id,
                framesDecoded: j.framesDecoded,
                framesDropped: j.framesDropped,
                framesReceived: j.framesReceived,
                packetsReceived: j.packetsReceived,
                packetsLost: j.packetsLost,
                frameWidth: j.frameWidth,
                frameHeight: j.frameHeight,
                pliCount: j.pliCount,
                firCount: j.firCount,
                nackCount: j.nackCount,
                jitter: j.jitter,
                timestamp: j.timestamp,
                bytesReceived: j.bytesReceived,
                decoderImplementation: j.decoderImplementation,
              }))
            : j.type === "codec" && V.set(j.id, j);
        }),
        F && B !== "" && V.get(B) && (F.mimeType = V.get(B).mimeType),
        F
      );
    });
  }
  stopObservingElement(U) {
    const F = this.elementInfos.filter((B) => B.element === U);
    for (const B of F) this.stopObservingElementInfo(B);
  }
  handleAppVisibilityChanged() {
    const U = Object.create(null, {
      handleAppVisibilityChanged: {
        get: () => super.handleAppVisibilityChanged,
      },
    });
    return __awaiter$1(this, void 0, void 0, function* () {
      yield U.handleAppVisibilityChanged.call(this),
        this.isAdaptiveStream && this.updateVisibility();
    });
  }
  updateVisibility() {
    var U, F;
    const B = this.elementInfos.reduce(
        (W, K) => Math.max(W, K.visibilityChangedAt || 0),
        0
      ),
      V =
        !(
          (F =
            (U = this.adaptiveStreamSettings) === null || U === void 0
              ? void 0
              : U.pauseVideoInBackground) !== null && F !== void 0
        ) || F
          ? this.isInBackground
          : !1,
      j = this.elementInfos.some((W) => W.pictureInPicture),
      $ = (this.elementInfos.some((W) => W.visible) && !V) || j;
    if (this.lastVisible !== $) {
      if (!$ && Date.now() - B < REACTION_DELAY) {
        CriticalTimers.setTimeout(() => {
          this.updateVisibility();
        }, REACTION_DELAY);
        return;
      }
      (this.lastVisible = $), this.emit(TrackEvent.VisibilityChanged, $, this);
    }
  }
  updateDimensions() {
    var U, F;
    let B = 0,
      V = 0;
    const j = this.getPixelDensity();
    for (const $ of this.elementInfos) {
      const W = $.width() * j,
        K = $.height() * j;
      W + K > B + V && ((B = W), (V = K));
    }
    (((U = this.lastDimensions) === null || U === void 0 ? void 0 : U.width) ===
      B &&
      ((F = this.lastDimensions) === null || F === void 0
        ? void 0
        : F.height) === V) ||
      ((this.lastDimensions = { width: B, height: V }),
      this.emit(TrackEvent.VideoDimensionsChanged, this.lastDimensions, this));
  }
  getPixelDensity() {
    var U;
    const F =
      (U = this.adaptiveStreamSettings) === null || U === void 0
        ? void 0
        : U.pixelDensity;
    return F === "screen"
      ? getDevicePixelRatio()
      : F || (getDevicePixelRatio() > 2 ? 2 : 1);
  }
}
class HTMLElementInfo {
  get visible() {
    return this.isPiP || this.isIntersecting;
  }
  get pictureInPicture() {
    return this.isPiP;
  }
  constructor(U, F) {
    (this.onVisibilityChanged = (B) => {
      var V;
      const { target: j, isIntersecting: $ } = B;
      j === this.element &&
        ((this.isIntersecting = $),
        (this.isPiP = isElementInPiP(this.element)),
        (this.visibilityChangedAt = Date.now()),
        (V = this.handleVisibilityChanged) === null ||
          V === void 0 ||
          V.call(this));
    }),
      (this.onEnterPiP = () => {
        var B, V, j;
        (V =
          (B = window.documentPictureInPicture) === null || B === void 0
            ? void 0
            : B.window) === null ||
          V === void 0 ||
          V.addEventListener("pagehide", this.onLeavePiP),
          (this.isPiP = isElementInPiP(this.element)),
          (j = this.handleVisibilityChanged) === null ||
            j === void 0 ||
            j.call(this);
      }),
      (this.onLeavePiP = () => {
        var B;
        (this.isPiP = isElementInPiP(this.element)),
          (B = this.handleVisibilityChanged) === null ||
            B === void 0 ||
            B.call(this);
      }),
      (this.element = U),
      (this.isIntersecting = F ?? isElementInViewport(U)),
      (this.isPiP = isWeb() && isElementInPiP(U)),
      (this.visibilityChangedAt = 0);
  }
  width() {
    return this.element.clientWidth;
  }
  height() {
    return this.element.clientHeight;
  }
  observe() {
    var U, F, B;
    (this.isIntersecting = isElementInViewport(this.element)),
      (this.isPiP = isElementInPiP(this.element)),
      (this.element.handleResize = () => {
        var V;
        (V = this.handleResize) === null || V === void 0 || V.call(this);
      }),
      (this.element.handleVisibilityChanged = this.onVisibilityChanged),
      getIntersectionObserver().observe(this.element),
      getResizeObserver().observe(this.element),
      this.element.addEventListener("enterpictureinpicture", this.onEnterPiP),
      this.element.addEventListener("leavepictureinpicture", this.onLeavePiP),
      (U = window.documentPictureInPicture) === null ||
        U === void 0 ||
        U.addEventListener("enter", this.onEnterPiP),
      (B =
        (F = window.documentPictureInPicture) === null || F === void 0
          ? void 0
          : F.window) === null ||
        B === void 0 ||
        B.addEventListener("pagehide", this.onLeavePiP);
  }
  stopObserving() {
    var U, F, B, V, j;
    (U = getIntersectionObserver()) === null ||
      U === void 0 ||
      U.unobserve(this.element),
      (F = getResizeObserver()) === null ||
        F === void 0 ||
        F.unobserve(this.element),
      this.element.removeEventListener(
        "enterpictureinpicture",
        this.onEnterPiP
      ),
      this.element.removeEventListener(
        "leavepictureinpicture",
        this.onLeavePiP
      ),
      (B = window.documentPictureInPicture) === null ||
        B === void 0 ||
        B.removeEventListener("enter", this.onEnterPiP),
      (j =
        (V = window.documentPictureInPicture) === null || V === void 0
          ? void 0
          : V.window) === null ||
        j === void 0 ||
        j.removeEventListener("pagehide", this.onLeavePiP);
  }
}
function isElementInPiP(q) {
  var U, F;
  return document.pictureInPictureElement === q
    ? !0
    : !((U = window.documentPictureInPicture) === null || U === void 0) &&
      U.window
    ? isElementInViewport(
        q,
        (F = window.documentPictureInPicture) === null || F === void 0
          ? void 0
          : F.window
      )
    : !1;
}
function isElementInViewport(q, U) {
  const F = U || window;
  let B = q.offsetTop,
    V = q.offsetLeft;
  const j = q.offsetWidth,
    $ = q.offsetHeight,
    { hidden: W } = q,
    { display: K } = getComputedStyle(q);
  for (; q.offsetParent; )
    (q = q.offsetParent), (B += q.offsetTop), (V += q.offsetLeft);
  return (
    B < F.pageYOffset + F.innerHeight &&
    V < F.pageXOffset + F.innerWidth &&
    B + $ > F.pageYOffset &&
    V + j > F.pageXOffset &&
    !W &&
    K !== "none"
  );
}
class TrackPublication extends eventsExports.EventEmitter {
  constructor(U, F, B, V) {
    var j;
    super(),
      (this.metadataMuted = !1),
      (this.encryption = Encryption_Type.NONE),
      (this.log = livekitLogger),
      (this.handleMuted = () => {
        this.emit(TrackEvent.Muted);
      }),
      (this.handleUnmuted = () => {
        this.emit(TrackEvent.Unmuted);
      }),
      (this.log = getLogger(
        (j = V == null ? void 0 : V.loggerName) !== null && j !== void 0
          ? j
          : LoggerNames.Publication
      )),
      (this.loggerContextCb = this.loggerContextCb),
      this.setMaxListeners(100),
      (this.kind = U),
      (this.trackSid = F),
      (this.trackName = B),
      (this.source = Track.Source.Unknown);
  }
  setTrack(U) {
    this.track &&
      (this.track.off(TrackEvent.Muted, this.handleMuted),
      this.track.off(TrackEvent.Unmuted, this.handleUnmuted)),
      (this.track = U),
      U &&
        (U.on(TrackEvent.Muted, this.handleMuted),
        U.on(TrackEvent.Unmuted, this.handleUnmuted));
  }
  get logContext() {
    var U;
    return Object.assign(
      Object.assign(
        {},
        (U = this.loggerContextCb) === null || U === void 0
          ? void 0
          : U.call(this)
      ),
      getLogContextFromTrack(this)
    );
  }
  get isMuted() {
    return this.metadataMuted;
  }
  get isEnabled() {
    return !0;
  }
  get isSubscribed() {
    return this.track !== void 0;
  }
  get isEncrypted() {
    return this.encryption !== Encryption_Type.NONE;
  }
  get audioTrack() {
    if (isAudioTrack(this.track)) return this.track;
  }
  get videoTrack() {
    if (isVideoTrack(this.track)) return this.track;
  }
  updateInfo(U) {
    (this.trackSid = U.sid),
      (this.trackName = U.name),
      (this.source = Track.sourceFromProto(U.source)),
      (this.mimeType = U.mimeType),
      this.kind === Track.Kind.Video &&
        U.width > 0 &&
        ((this.dimensions = { width: U.width, height: U.height }),
        (this.simulcasted = U.simulcast)),
      (this.encryption = U.encryption),
      (this.trackInfo = U),
      this.log.debug(
        "update publication info",
        Object.assign(Object.assign({}, this.logContext), { info: U })
      );
  }
}
(function (q) {
  (function (U) {
    (U.Desired = "desired"),
      (U.Subscribed = "subscribed"),
      (U.Unsubscribed = "unsubscribed");
  })(q.SubscriptionStatus || (q.SubscriptionStatus = {})),
    (function (U) {
      (U.Allowed = "allowed"), (U.NotAllowed = "not_allowed");
    })(q.PermissionStatus || (q.PermissionStatus = {}));
})(TrackPublication || (TrackPublication = {}));
class LocalTrackPublication extends TrackPublication {
  get isUpstreamPaused() {
    var U;
    return (U = this.track) === null || U === void 0
      ? void 0
      : U.isUpstreamPaused;
  }
  constructor(U, F, B, V) {
    super(U, F.sid, F.name, V),
      (this.track = void 0),
      (this.handleTrackEnded = () => {
        this.emit(TrackEvent.Ended);
      }),
      this.updateInfo(F),
      this.setTrack(B);
  }
  setTrack(U) {
    this.track && this.track.off(TrackEvent.Ended, this.handleTrackEnded),
      super.setTrack(U),
      U && U.on(TrackEvent.Ended, this.handleTrackEnded);
  }
  get isMuted() {
    return this.track ? this.track.isMuted : super.isMuted;
  }
  get audioTrack() {
    return super.audioTrack;
  }
  get videoTrack() {
    return super.videoTrack;
  }
  get isLocal() {
    return !0;
  }
  mute() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      return (U = this.track) === null || U === void 0 ? void 0 : U.mute();
    });
  }
  unmute() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      return (U = this.track) === null || U === void 0 ? void 0 : U.unmute();
    });
  }
  pauseUpstream() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      yield (U = this.track) === null || U === void 0
        ? void 0
        : U.pauseUpstream();
    });
  }
  resumeUpstream() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      yield (U = this.track) === null || U === void 0
        ? void 0
        : U.resumeUpstream();
    });
  }
  getTrackFeatures() {
    var U;
    if (isAudioTrack(this.track)) {
      const F = this.track.getSourceTrackSettings(),
        B = new Set();
      return (
        F.autoGainControl && B.add(AudioTrackFeature.TF_AUTO_GAIN_CONTROL),
        F.echoCancellation && B.add(AudioTrackFeature.TF_ECHO_CANCELLATION),
        F.noiseSuppression && B.add(AudioTrackFeature.TF_NOISE_SUPPRESSION),
        F.channelCount &&
          F.channelCount > 1 &&
          B.add(AudioTrackFeature.TF_STEREO),
        (!((U = this.options) === null || U === void 0) && U.dtx) ||
          B.add(AudioTrackFeature.TF_NO_DTX),
        this.track.enhancedNoiseCancellation &&
          B.add(AudioTrackFeature.TF_ENHANCED_NOISE_CANCELLATION),
        Array.from(B.values())
      );
    } else return [];
  }
}
function createLocalTracks(q, U) {
  return __awaiter$1(this, void 0, void 0, function* () {
    q ?? (q = {});
    let F = !1;
    const {
      audioProcessor: B,
      videoProcessor: V,
      optionsWithoutProcessor: j,
    } = extractProcessorsFromOptions(q);
    let $ = j.audio,
      W = j.video;
    if (
      (B && typeof j.audio == "object" && (j.audio.processor = B),
      V && typeof j.video == "object" && (j.video.processor = V),
      q.audio &&
        typeof j.audio == "object" &&
        typeof j.audio.deviceId == "string")
    ) {
      const z = j.audio.deviceId;
      (j.audio.deviceId = { exact: z }),
        (F = !0),
        ($ = Object.assign(Object.assign({}, j.audio), {
          deviceId: { ideal: z },
        }));
    }
    if (
      j.video &&
      typeof j.video == "object" &&
      typeof j.video.deviceId == "string"
    ) {
      const z = j.video.deviceId;
      (j.video.deviceId = { exact: z }),
        (F = !0),
        (W = Object.assign(Object.assign({}, j.video), {
          deviceId: { ideal: z },
        }));
    }
    (j.audio === !0 || (typeof j.audio == "object" && !j.audio.deviceId)) &&
      (j.audio = { deviceId: "default" }),
      (j.video === !0 || (typeof j.video == "object" && !j.video.deviceId)) &&
        (j.video = { deviceId: "default" });
    const K = mergeDefaultOptions(j, audioDefaults, videoDefaults),
      G = constraintsForOptions(K),
      Q = navigator.mediaDevices.getUserMedia(G);
    j.audio &&
      (DeviceManager.userMediaPromiseMap.set("audioinput", Q),
      Q.catch(() => DeviceManager.userMediaPromiseMap.delete("audioinput"))),
      j.video &&
        (DeviceManager.userMediaPromiseMap.set("videoinput", Q),
        Q.catch(() => DeviceManager.userMediaPromiseMap.delete("videoinput")));
    try {
      const z = yield Q;
      return yield Promise.all(
        z.getTracks().map((H) =>
          __awaiter$1(this, void 0, void 0, function* () {
            const Y = H.kind === "audio";
            let X = Y ? K.audio : K.video;
            (typeof X == "boolean" || !X) && (X = {});
            let Z;
            const ie = Y ? G.audio : G.video;
            typeof ie != "boolean" && (Z = ie);
            const ee = H.getSettings().deviceId;
            Z != null && Z.deviceId && unwrapConstraint(Z.deviceId) !== ee
              ? (Z.deviceId = ee)
              : Z || (Z = { deviceId: ee });
            const te = mediaTrackToLocalTrack(H, Z, U);
            return (
              te.kind === Track.Kind.Video
                ? (te.source = Track.Source.Camera)
                : te.kind === Track.Kind.Audio &&
                  (te.source = Track.Source.Microphone),
              (te.mediaStream = z),
              isAudioTrack(te) && B
                ? yield te.setProcessor(B)
                : isVideoTrack(te) && V && (yield te.setProcessor(V)),
              te
            );
          })
        )
      );
    } catch (z) {
      if (!F) throw z;
      return createLocalTracks(
        Object.assign(Object.assign({}, q), { audio: $, video: W }),
        U
      );
    }
  });
}
function createLocalVideoTrack(q) {
  return __awaiter$1(this, void 0, void 0, function* () {
    return (yield createLocalTracks({ audio: !1, video: !0 }))[0];
  });
}
function createLocalAudioTrack(q) {
  return __awaiter$1(this, void 0, void 0, function* () {
    return (yield createLocalTracks({ audio: q ?? !0, video: !1 }))[0];
  });
}
var ConnectionQuality$2;
(function (q) {
  (q.Excellent = "excellent"),
    (q.Good = "good"),
    (q.Poor = "poor"),
    (q.Lost = "lost"),
    (q.Unknown = "unknown");
})(ConnectionQuality$2 || (ConnectionQuality$2 = {}));
function qualityFromProto(q) {
  switch (q) {
    case ConnectionQuality$1.EXCELLENT:
      return ConnectionQuality$2.Excellent;
    case ConnectionQuality$1.GOOD:
      return ConnectionQuality$2.Good;
    case ConnectionQuality$1.POOR:
      return ConnectionQuality$2.Poor;
    case ConnectionQuality$1.LOST:
      return ConnectionQuality$2.Lost;
    default:
      return ConnectionQuality$2.Unknown;
  }
}
class Participant extends eventsExports.EventEmitter {
  get logContext() {
    var U, F;
    return Object.assign(
      {},
      (F =
        (U = this.loggerOptions) === null || U === void 0
          ? void 0
          : U.loggerContextCb) === null || F === void 0
        ? void 0
        : F.call(U)
    );
  }
  get isEncrypted() {
    return (
      this.trackPublications.size > 0 &&
      Array.from(this.trackPublications.values()).every((U) => U.isEncrypted)
    );
  }
  get isAgent() {
    var U;
    return (
      ((U = this.permissions) === null || U === void 0 ? void 0 : U.agent) ||
      this.kind === ParticipantInfo_Kind.AGENT
    );
  }
  get kind() {
    return this._kind;
  }
  get attributes() {
    return Object.freeze(Object.assign({}, this._attributes));
  }
  constructor(U, F, B, V, j, $) {
    let W =
      arguments.length > 6 && arguments[6] !== void 0
        ? arguments[6]
        : ParticipantInfo_Kind.STANDARD;
    var K;
    super(),
      (this.audioLevel = 0),
      (this.isSpeaking = !1),
      (this._connectionQuality = ConnectionQuality$2.Unknown),
      (this.log = livekitLogger),
      (this.log = getLogger(
        (K = $ == null ? void 0 : $.loggerName) !== null && K !== void 0
          ? K
          : LoggerNames.Participant
      )),
      (this.loggerOptions = $),
      this.setMaxListeners(100),
      (this.sid = U),
      (this.identity = F),
      (this.name = B),
      (this.metadata = V),
      (this.audioTrackPublications = new Map()),
      (this.videoTrackPublications = new Map()),
      (this.trackPublications = new Map()),
      (this._kind = W),
      (this._attributes = j ?? {});
  }
  getTrackPublications() {
    return Array.from(this.trackPublications.values());
  }
  getTrackPublication(U) {
    for (const [, F] of this.trackPublications) if (F.source === U) return F;
  }
  getTrackPublicationByName(U) {
    for (const [, F] of this.trackPublications) if (F.trackName === U) return F;
  }
  get connectionQuality() {
    return this._connectionQuality;
  }
  get isCameraEnabled() {
    var U;
    const F = this.getTrackPublication(Track.Source.Camera);
    return !(
      !((U = F == null ? void 0 : F.isMuted) !== null && U !== void 0) || U
    );
  }
  get isMicrophoneEnabled() {
    var U;
    const F = this.getTrackPublication(Track.Source.Microphone);
    return !(
      !((U = F == null ? void 0 : F.isMuted) !== null && U !== void 0) || U
    );
  }
  get isScreenShareEnabled() {
    return !!this.getTrackPublication(Track.Source.ScreenShare);
  }
  get isLocal() {
    return !1;
  }
  get joinedAt() {
    return this.participantInfo
      ? new Date(
          Number.parseInt(this.participantInfo.joinedAt.toString()) * 1e3
        )
      : new Date();
  }
  updateInfo(U) {
    return this.participantInfo &&
      this.participantInfo.sid === U.sid &&
      this.participantInfo.version > U.version
      ? !1
      : ((this.identity = U.identity),
        (this.sid = U.sid),
        this._setName(U.name),
        this._setMetadata(U.metadata),
        this._setAttributes(U.attributes),
        U.permission && this.setPermissions(U.permission),
        (this.participantInfo = U),
        this.log.trace(
          "update participant info",
          Object.assign(Object.assign({}, this.logContext), { info: U })
        ),
        !0);
  }
  _setMetadata(U) {
    const F = this.metadata !== U,
      B = this.metadata;
    (this.metadata = U),
      F && this.emit(ParticipantEvent.ParticipantMetadataChanged, B);
  }
  _setName(U) {
    const F = this.name !== U;
    (this.name = U), F && this.emit(ParticipantEvent.ParticipantNameChanged, U);
  }
  _setAttributes(U) {
    const F = diffAttributes(this.attributes, U);
    (this._attributes = U),
      Object.keys(F).length > 0 &&
        this.emit(ParticipantEvent.AttributesChanged, F);
  }
  setPermissions(U) {
    var F, B, V, j, $, W;
    const K = this.permissions,
      G =
        U.canPublish !==
          ((F = this.permissions) === null || F === void 0
            ? void 0
            : F.canPublish) ||
        U.canSubscribe !==
          ((B = this.permissions) === null || B === void 0
            ? void 0
            : B.canSubscribe) ||
        U.canPublishData !==
          ((V = this.permissions) === null || V === void 0
            ? void 0
            : V.canPublishData) ||
        U.hidden !==
          ((j = this.permissions) === null || j === void 0
            ? void 0
            : j.hidden) ||
        U.recorder !==
          (($ = this.permissions) === null || $ === void 0
            ? void 0
            : $.recorder) ||
        U.canPublishSources.length !==
          this.permissions.canPublishSources.length ||
        U.canPublishSources.some((Q, z) => {
          var H;
          return (
            Q !==
            ((H = this.permissions) === null || H === void 0
              ? void 0
              : H.canPublishSources[z])
          );
        }) ||
        U.canSubscribeMetrics !==
          ((W = this.permissions) === null || W === void 0
            ? void 0
            : W.canSubscribeMetrics);
    return (
      (this.permissions = U),
      G && this.emit(ParticipantEvent.ParticipantPermissionsChanged, K),
      G
    );
  }
  setIsSpeaking(U) {
    U !== this.isSpeaking &&
      ((this.isSpeaking = U),
      U && (this.lastSpokeAt = new Date()),
      this.emit(ParticipantEvent.IsSpeakingChanged, U));
  }
  setConnectionQuality(U) {
    const F = this._connectionQuality;
    (this._connectionQuality = qualityFromProto(U)),
      F !== this._connectionQuality &&
        this.emit(
          ParticipantEvent.ConnectionQualityChanged,
          this._connectionQuality
        );
  }
  setAudioContext(U) {
    (this.audioContext = U),
      this.audioTrackPublications.forEach(
        (F) => isAudioTrack(F.track) && F.track.setAudioContext(U)
      );
  }
  addTrackPublication(U) {
    U.on(TrackEvent.Muted, () => {
      this.emit(ParticipantEvent.TrackMuted, U);
    }),
      U.on(TrackEvent.Unmuted, () => {
        this.emit(ParticipantEvent.TrackUnmuted, U);
      });
    const F = U;
    switch (
      (F.track && (F.track.sid = U.trackSid),
      this.trackPublications.set(U.trackSid, U),
      U.kind)
    ) {
      case Track.Kind.Audio:
        this.audioTrackPublications.set(U.trackSid, U);
        break;
      case Track.Kind.Video:
        this.videoTrackPublications.set(U.trackSid, U);
        break;
    }
  }
}
function trackPermissionToProto(q) {
  var U, F, B;
  if (!q.participantSid && !q.participantIdentity)
    throw new Error(
      "Invalid track permission, must provide at least one of participantIdentity and participantSid"
    );
  return new TrackPermission({
    participantIdentity:
      (U = q.participantIdentity) !== null && U !== void 0 ? U : "",
    participantSid: (F = q.participantSid) !== null && F !== void 0 ? F : "",
    allTracks: (B = q.allowAll) !== null && B !== void 0 ? B : !1,
    trackSids: q.allowedTrackSids || [],
  });
}
const STREAM_CHUNK_SIZE = 15e3;
class LocalParticipant extends Participant {
  constructor(U, F, B, V, j) {
    super(U, F, void 0, void 0, void 0, {
      loggerName: V.loggerName,
      loggerContextCb: () => this.engine.logContext,
    }),
      (this.pendingPublishing = new Set()),
      (this.pendingPublishPromises = new Map()),
      (this.participantTrackPermissions = []),
      (this.allParticipantsAllowedToSubscribe = !0),
      (this.encryptionType = Encryption_Type.NONE),
      (this.enabledPublishVideoCodecs = []),
      (this.pendingAcks = new Map()),
      (this.pendingResponses = new Map()),
      (this.handleReconnecting = () => {
        this.reconnectFuture || (this.reconnectFuture = new Future());
      }),
      (this.handleReconnected = () => {
        var $, W;
        (W =
          ($ = this.reconnectFuture) === null || $ === void 0
            ? void 0
            : $.resolve) === null ||
          W === void 0 ||
          W.call($),
          (this.reconnectFuture = void 0),
          this.updateTrackSubscriptionPermissions();
      }),
      (this.handleDisconnected = () => {
        var $, W;
        this.reconnectFuture &&
          (this.reconnectFuture.promise.catch((K) =>
            this.log.warn(K.message, this.logContext)
          ),
          (W =
            ($ = this.reconnectFuture) === null || $ === void 0
              ? void 0
              : $.reject) === null ||
            W === void 0 ||
            W.call($, "Got disconnected during reconnection attempt"),
          (this.reconnectFuture = void 0));
      }),
      (this.handleSignalRequestResponse = ($) => {
        const { requestId: W, reason: K, message: G } = $,
          Q = this.pendingSignalRequests.get(W);
        Q &&
          (K !== RequestResponse_Reason.OK &&
            Q.reject(new SignalRequestError(G, K)),
          this.pendingSignalRequests.delete(W));
      }),
      (this.handleDataPacket = ($) => {
        switch ($.value.case) {
          case "rpcResponse":
            let W = $.value.value,
              K = null,
              G = null;
            W.value.case === "payload"
              ? (K = W.value.value)
              : W.value.case === "error" &&
                (G = RpcError.fromProto(W.value.value)),
              this.handleIncomingRpcResponse(W.requestId, K, G);
            break;
          case "rpcAck":
            let Q = $.value.value;
            this.handleIncomingRpcAck(Q.requestId);
            break;
        }
      }),
      (this.updateTrackSubscriptionPermissions = () => {
        this.log.debug(
          "updating track subscription permissions",
          Object.assign(Object.assign({}, this.logContext), {
            allParticipantsAllowed: this.allParticipantsAllowedToSubscribe,
            participantTrackPermissions: this.participantTrackPermissions,
          })
        ),
          this.engine.client.sendUpdateSubscriptionPermissions(
            this.allParticipantsAllowedToSubscribe,
            this.participantTrackPermissions.map(($) =>
              trackPermissionToProto($)
            )
          );
      }),
      (this.onTrackUnmuted = ($) => {
        this.onTrackMuted($, $.isUpstreamPaused);
      }),
      (this.onTrackMuted = ($, W) => {
        if ((W === void 0 && (W = !0), !$.sid)) {
          this.log.error(
            "could not update mute status for unpublished track",
            Object.assign(
              Object.assign({}, this.logContext),
              getLogContextFromTrack($)
            )
          );
          return;
        }
        this.engine.updateMuteStatus($.sid, W);
      }),
      (this.onTrackUpstreamPaused = ($) => {
        this.log.debug(
          "upstream paused",
          Object.assign(
            Object.assign({}, this.logContext),
            getLogContextFromTrack($)
          )
        ),
          this.onTrackMuted($, !0);
      }),
      (this.onTrackUpstreamResumed = ($) => {
        this.log.debug(
          "upstream resumed",
          Object.assign(
            Object.assign({}, this.logContext),
            getLogContextFromTrack($)
          )
        ),
          this.onTrackMuted($, $.isMuted);
      }),
      (this.onTrackFeatureUpdate = ($) => {
        const W = this.audioTrackPublications.get($.sid);
        if (!W) {
          this.log.warn(
            "Could not update local audio track settings, missing publication for track ".concat(
              $.sid
            ),
            this.logContext
          );
          return;
        }
        this.engine.client.sendUpdateLocalAudioTrack(
          W.trackSid,
          W.getTrackFeatures()
        );
      }),
      (this.handleSubscribedQualityUpdate = ($) =>
        __awaiter$1(this, void 0, void 0, function* () {
          var W, K, G, Q, z, H;
          if (
            !(!((z = this.roomOptions) === null || z === void 0) && z.dynacast)
          )
            return;
          const Y = this.videoTrackPublications.get($.trackSid);
          if (!Y) {
            this.log.warn(
              "received subscribed quality update for unknown track",
              Object.assign(Object.assign({}, this.logContext), {
                trackSid: $.trackSid,
              })
            );
            return;
          }
          if ($.subscribedCodecs.length > 0) {
            if (!Y.videoTrack) return;
            const ee = yield Y.videoTrack.setPublishingCodecs(
              $.subscribedCodecs
            );
            try {
              for (
                var X = !0, Z = __asyncValues(ee), ie;
                (ie = yield Z.next()), (W = ie.done), !W;
                X = !0
              ) {
                (Q = ie.value), (X = !1);
                const te = Q;
                isBackupCodec(te) &&
                  (this.log.debug(
                    "publish ".concat(te, " for ").concat(Y.videoTrack.sid),
                    Object.assign(
                      Object.assign({}, this.logContext),
                      getLogContextFromTrack(Y)
                    )
                  ),
                  yield this.publishAdditionalCodecForTrack(
                    Y.videoTrack,
                    te,
                    Y.options
                  ));
              }
            } catch (te) {
              K = { error: te };
            } finally {
              try {
                !X && !W && (G = Z.return) && (yield G.call(Z));
              } finally {
                if (K) throw K.error;
              }
            }
          } else $.subscribedQualities.length > 0 && (yield (H = Y.videoTrack) === null || H === void 0 ? void 0 : H.setPublishingLayers($.subscribedQualities));
        })),
      (this.handleLocalTrackUnpublished = ($) => {
        const W = this.trackPublications.get($.trackSid);
        if (!W) {
          this.log.warn(
            "received unpublished event for unknown track",
            Object.assign(Object.assign({}, this.logContext), {
              trackSid: $.trackSid,
            })
          );
          return;
        }
        this.unpublishTrack(W.track);
      }),
      (this.handleTrackEnded = ($) =>
        __awaiter$1(this, void 0, void 0, function* () {
          if (
            $.source === Track.Source.ScreenShare ||
            $.source === Track.Source.ScreenShareAudio
          )
            this.log.debug(
              "unpublishing local track due to TrackEnded",
              Object.assign(
                Object.assign({}, this.logContext),
                getLogContextFromTrack($)
              )
            ),
              this.unpublishTrack($);
          else if ($.isUserProvided) yield $.mute();
          else if (isLocalAudioTrack($) || isLocalVideoTrack($))
            try {
              if (isWeb())
                try {
                  const W = yield navigator == null
                    ? void 0
                    : navigator.permissions.query({
                        name:
                          $.source === Track.Source.Camera
                            ? "camera"
                            : "microphone",
                      });
                  if (W && W.state === "denied")
                    throw (
                      (this.log.warn(
                        "user has revoked access to ".concat($.source),
                        Object.assign(
                          Object.assign({}, this.logContext),
                          getLogContextFromTrack($)
                        )
                      ),
                      (W.onchange = () => {
                        W.state !== "denied" &&
                          ($.isMuted || $.restartTrack(), (W.onchange = null));
                      }),
                      new Error("GetUserMedia Permission denied"))
                    );
                } catch {}
              $.isMuted ||
                (this.log.debug(
                  "track ended, attempting to use a different device",
                  Object.assign(
                    Object.assign({}, this.logContext),
                    getLogContextFromTrack($)
                  )
                ),
                isLocalAudioTrack($)
                  ? yield $.restartTrack({ deviceId: "default" })
                  : yield $.restartTrack());
            } catch {
              this.log.warn(
                "could not restart track, muting instead",
                Object.assign(
                  Object.assign({}, this.logContext),
                  getLogContextFromTrack($)
                )
              ),
                yield $.mute();
            }
        })),
      (this.audioTrackPublications = new Map()),
      (this.videoTrackPublications = new Map()),
      (this.trackPublications = new Map()),
      (this.engine = B),
      (this.roomOptions = V),
      this.setupEngine(B),
      (this.activeDeviceMap = new Map([
        ["audioinput", "default"],
        ["videoinput", "default"],
        ["audiooutput", "default"],
      ])),
      (this.pendingSignalRequests = new Map()),
      (this.rpcHandlers = j);
  }
  get lastCameraError() {
    return this.cameraError;
  }
  get lastMicrophoneError() {
    return this.microphoneError;
  }
  get isE2EEEnabled() {
    return this.encryptionType !== Encryption_Type.NONE;
  }
  getTrackPublication(U) {
    const F = super.getTrackPublication(U);
    if (F) return F;
  }
  getTrackPublicationByName(U) {
    const F = super.getTrackPublicationByName(U);
    if (F) return F;
  }
  setupEngine(U) {
    (this.engine = U),
      this.engine.on(EngineEvent.RemoteMute, (F, B) => {
        const V = this.trackPublications.get(F);
        !V || !V.track || (B ? V.mute() : V.unmute());
      }),
      this.engine
        .on(EngineEvent.Connected, this.handleReconnected)
        .on(EngineEvent.SignalRestarted, this.handleReconnected)
        .on(EngineEvent.SignalResumed, this.handleReconnected)
        .on(EngineEvent.Restarting, this.handleReconnecting)
        .on(EngineEvent.Resuming, this.handleReconnecting)
        .on(EngineEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished)
        .on(
          EngineEvent.SubscribedQualityUpdate,
          this.handleSubscribedQualityUpdate
        )
        .on(EngineEvent.Disconnected, this.handleDisconnected)
        .on(EngineEvent.SignalRequestResponse, this.handleSignalRequestResponse)
        .on(EngineEvent.DataPacketReceived, this.handleDataPacket);
  }
  setMetadata(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      yield this.requestMetadataUpdate({ metadata: U });
    });
  }
  setName(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      yield this.requestMetadataUpdate({ name: U });
    });
  }
  setAttributes(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      yield this.requestMetadataUpdate({ attributes: U });
    });
  }
  requestMetadataUpdate(U) {
    return __awaiter$1(this, arguments, void 0, function (F) {
      var B = this;
      let { metadata: V, name: j, attributes: $ } = F;
      return (function* () {
        return new Promise((W, K) =>
          __awaiter$1(B, void 0, void 0, function* () {
            var G, Q;
            try {
              let z = !1;
              const H = yield this.engine.client.sendUpdateLocalMetadata(
                  (G = V ?? this.metadata) !== null && G !== void 0 ? G : "",
                  (Q = j ?? this.name) !== null && Q !== void 0 ? Q : "",
                  $
                ),
                Y = performance.now();
              for (
                this.pendingSignalRequests.set(H, {
                  resolve: W,
                  reject: (X) => {
                    K(X), (z = !0);
                  },
                  values: { name: j, metadata: V, attributes: $ },
                });
                performance.now() - Y < 5e3 && !z;

              ) {
                if (
                  (!j || this.name === j) &&
                  (!V || this.metadata === V) &&
                  (!$ ||
                    Object.entries($).every((X) => {
                      let [Z, ie] = X;
                      return (
                        this.attributes[Z] === ie ||
                        (ie === "" && !this.attributes[Z])
                      );
                    }))
                ) {
                  this.pendingSignalRequests.delete(H), W();
                  return;
                }
                yield sleep$1(50);
              }
              K(
                new SignalRequestError(
                  "Request to update local metadata timed out",
                  "TimeoutError"
                )
              );
            } catch (z) {
              z instanceof Error && K(z);
            }
          })
        );
      })();
    });
  }
  setCameraEnabled(U, F, B) {
    return this.setTrackEnabled(Track.Source.Camera, U, F, B);
  }
  setMicrophoneEnabled(U, F, B) {
    return this.setTrackEnabled(Track.Source.Microphone, U, F, B);
  }
  setScreenShareEnabled(U, F, B) {
    return this.setTrackEnabled(Track.Source.ScreenShare, U, F, B);
  }
  setPermissions(U) {
    const F = this.permissions,
      B = super.setPermissions(U);
    return (
      B && F && this.emit(ParticipantEvent.ParticipantPermissionsChanged, F), B
    );
  }
  setE2EEEnabled(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      (this.encryptionType = U ? Encryption_Type.GCM : Encryption_Type.NONE),
        yield this.republishAllTracks(void 0, !1);
    });
  }
  setTrackEnabled(U, F, B, V) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var j, $;
      this.log.debug(
        "setTrackEnabled",
        Object.assign(Object.assign({}, this.logContext), {
          source: U,
          enabled: F,
        })
      ),
        this.republishPromise && (yield this.republishPromise);
      let W = this.getTrackPublication(U);
      if (F)
        if (W) yield W.unmute();
        else {
          let K;
          if (this.pendingPublishing.has(U)) {
            const G = yield this.waitForPendingPublicationOfSource(U);
            return (
              G ||
                this.log.info(
                  "waiting for pending publication promise timed out",
                  Object.assign(Object.assign({}, this.logContext), {
                    source: U,
                  })
                ),
              yield G == null ? void 0 : G.unmute(),
              G
            );
          }
          this.pendingPublishing.add(U);
          try {
            switch (U) {
              case Track.Source.Camera:
                K = yield this.createTracks({
                  video: (j = B) !== null && j !== void 0 ? j : !0,
                });
                break;
              case Track.Source.Microphone:
                K = yield this.createTracks({
                  audio: ($ = B) !== null && $ !== void 0 ? $ : !0,
                });
                break;
              case Track.Source.ScreenShare:
                K = yield this.createScreenTracks(Object.assign({}, B));
                break;
              default:
                throw new TrackInvalidError(U);
            }
          } catch (G) {
            throw (
              (K == null ||
                K.forEach((Q) => {
                  Q.stop();
                }),
              G instanceof Error &&
                this.emit(ParticipantEvent.MediaDevicesError, G),
              this.pendingPublishing.delete(U),
              G)
            );
          }
          try {
            const G = [];
            for (const z of K)
              this.log.info(
                "publishing track",
                Object.assign(
                  Object.assign({}, this.logContext),
                  getLogContextFromTrack(z)
                )
              ),
                G.push(this.publishTrack(z, V));
            [W] = yield Promise.all(G);
          } catch (G) {
            throw (
              (K == null ||
                K.forEach((Q) => {
                  Q.stop();
                }),
              G)
            );
          } finally {
            this.pendingPublishing.delete(U);
          }
        }
      else if (
        (!(W != null && W.track) &&
          this.pendingPublishing.has(U) &&
          ((W = yield this.waitForPendingPublicationOfSource(U)),
          W ||
            this.log.info(
              "waiting for pending publication promise timed out",
              Object.assign(Object.assign({}, this.logContext), { source: U })
            )),
        W && W.track)
      )
        if (U === Track.Source.ScreenShare) {
          W = yield this.unpublishTrack(W.track);
          const K = this.getTrackPublication(Track.Source.ScreenShareAudio);
          K && K.track && this.unpublishTrack(K.track);
        } else yield W.mute();
      return W;
    });
  }
  enableCameraAndMicrophone() {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (
        !(
          this.pendingPublishing.has(Track.Source.Camera) ||
          this.pendingPublishing.has(Track.Source.Microphone)
        )
      ) {
        this.pendingPublishing.add(Track.Source.Camera),
          this.pendingPublishing.add(Track.Source.Microphone);
        try {
          const U = yield this.createTracks({ audio: !0, video: !0 });
          yield Promise.all(U.map((F) => this.publishTrack(F)));
        } finally {
          this.pendingPublishing.delete(Track.Source.Camera),
            this.pendingPublishing.delete(Track.Source.Microphone);
        }
      }
    });
  }
  createTracks(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F, B;
      U ?? (U = {});
      const V = mergeDefaultOptions(
        U,
        (F = this.roomOptions) === null || F === void 0
          ? void 0
          : F.audioCaptureDefaults,
        (B = this.roomOptions) === null || B === void 0
          ? void 0
          : B.videoCaptureDefaults
      );
      try {
        return (yield createLocalTracks(V, {
          loggerName: this.roomOptions.loggerName,
          loggerContextCb: () => this.logContext,
        })).map(
          (W) => (
            isAudioTrack(W) &&
              ((this.microphoneError = void 0),
              W.setAudioContext(this.audioContext),
              (W.source = Track.Source.Microphone),
              this.emit(ParticipantEvent.AudioStreamAcquired)),
            isVideoTrack(W) &&
              ((this.cameraError = void 0), (W.source = Track.Source.Camera)),
            W
          )
        );
      } catch (j) {
        throw (
          (j instanceof Error &&
            (U.audio && (this.microphoneError = j),
            U.video && (this.cameraError = j)),
          j)
        );
      }
    });
  }
  createScreenTracks(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (
        (U === void 0 && (U = {}),
        navigator.mediaDevices.getDisplayMedia === void 0)
      )
        throw new DeviceUnsupportedError("getDisplayMedia not supported");
      U.resolution === void 0 &&
        !isSafari17() &&
        (U.resolution = ScreenSharePresets.h1080fps30.resolution);
      const F = screenCaptureToDisplayMediaStreamOptions(U),
        B = yield navigator.mediaDevices.getDisplayMedia(F),
        V = B.getVideoTracks();
      if (V.length === 0) throw new TrackInvalidError("no video track found");
      const j = new LocalVideoTrack(V[0], void 0, !1, {
        loggerName: this.roomOptions.loggerName,
        loggerContextCb: () => this.logContext,
      });
      (j.source = Track.Source.ScreenShare),
        U.contentHint && (j.mediaStreamTrack.contentHint = U.contentHint);
      const $ = [j];
      if (B.getAudioTracks().length > 0) {
        this.emit(ParticipantEvent.AudioStreamAcquired);
        const W = new LocalAudioTrack(
          B.getAudioTracks()[0],
          void 0,
          !1,
          this.audioContext,
          {
            loggerName: this.roomOptions.loggerName,
            loggerContextCb: () => this.logContext,
          }
        );
        (W.source = Track.Source.ScreenShareAudio), $.push(W);
      }
      return $;
    });
  }
  publishTrack(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.publishOrRepublishTrack(U, F);
    });
  }
  publishOrRepublishTrack(U, F) {
    return __awaiter$1(this, arguments, void 0, function (B, V) {
      var j = this;
      let $ =
        arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
      return (function* () {
        var W, K, G, Q;
        isLocalAudioTrack(B) && B.setAudioContext(j.audioContext),
          yield (W = j.reconnectFuture) === null || W === void 0
            ? void 0
            : W.promise,
          j.republishPromise && !$ && (yield j.republishPromise),
          isLocalTrack(B) &&
            j.pendingPublishPromises.has(B) &&
            (yield j.pendingPublishPromises.get(B));
        let z;
        if (B instanceof MediaStreamTrack) z = B.getConstraints();
        else {
          z = B.constraints;
          let ee;
          switch (B.source) {
            case Track.Source.Microphone:
              ee = "audioinput";
              break;
            case Track.Source.Camera:
              ee = "videoinput";
          }
          ee &&
            j.activeDeviceMap.has(ee) &&
            (z = Object.assign(Object.assign({}, z), {
              deviceId: j.activeDeviceMap.get(ee),
            }));
        }
        if (B instanceof MediaStreamTrack)
          switch (B.kind) {
            case "audio":
              B = new LocalAudioTrack(B, z, !0, j.audioContext, {
                loggerName: j.roomOptions.loggerName,
                loggerContextCb: () => j.logContext,
              });
              break;
            case "video":
              B = new LocalVideoTrack(B, z, !0, {
                loggerName: j.roomOptions.loggerName,
                loggerContextCb: () => j.logContext,
              });
              break;
            default:
              throw new TrackInvalidError(
                "unsupported MediaStreamTrack kind ".concat(B.kind)
              );
          }
        else
          B.updateLoggerOptions({
            loggerName: j.roomOptions.loggerName,
            loggerContextCb: () => j.logContext,
          });
        let H;
        if (
          (j.trackPublications.forEach((ee) => {
            ee.track && ee.track === B && (H = ee);
          }),
          H)
        )
          return (
            j.log.warn(
              "track has already been published, skipping",
              Object.assign(
                Object.assign({}, j.logContext),
                getLogContextFromTrack(H)
              )
            ),
            H
          );
        const Y =
            ("channelCount" in B.mediaStreamTrack.getSettings() &&
              B.mediaStreamTrack.getSettings().channelCount === 2) ||
            B.mediaStreamTrack.getConstraints().channelCount === 2,
          X =
            (K = V == null ? void 0 : V.forceStereo) !== null && K !== void 0
              ? K
              : Y;
        X &&
          (V || (V = {}),
          V.dtx === void 0 &&
            j.log.info(
              "Opus DTX will be disabled for stereo tracks by default. Enable them explicitly to make it work.",
              Object.assign(
                Object.assign({}, j.logContext),
                getLogContextFromTrack(B)
              )
            ),
          V.red === void 0 &&
            j.log.info(
              "Opus RED will be disabled for stereo tracks by default. Enable them explicitly to make it work."
            ),
          ((G = V.dtx) !== null && G !== void 0) || (V.dtx = !1),
          ((Q = V.red) !== null && Q !== void 0) || (V.red = !1));
        const Z = Object.assign(
          Object.assign({}, j.roomOptions.publishDefaults),
          V
        );
        !isE2EESimulcastSupported() &&
          j.roomOptions.e2ee &&
          (j.log.info(
            "End-to-end encryption is set up, simulcast publishing will be disabled on Safari versions and iOS browsers running iOS < v17.2",
            Object.assign({}, j.logContext)
          ),
          (Z.simulcast = !1)),
          Z.source && (B.source = Z.source);
        const ie = new Promise((ee, te) =>
          __awaiter$1(j, void 0, void 0, function* () {
            try {
              if (
                this.engine.client.currentState !==
                SignalConnectionState.CONNECTED
              ) {
                this.log.debug(
                  "deferring track publication until signal is connected",
                  Object.assign(Object.assign({}, this.logContext), {
                    track: getLogContextFromTrack(B),
                  })
                );
                const re = () =>
                  __awaiter$1(this, void 0, void 0, function* () {
                    try {
                      const ne = yield this.publish(B, Z, X);
                      ee(ne);
                    } catch (ne) {
                      te(ne);
                    }
                  });
                setTimeout(() => {
                  this.engine.off(EngineEvent.SignalConnected, re),
                    te(
                      new PublishTrackError(
                        "publishing rejected as engine not connected within timeout",
                        408
                      )
                    );
                }, 15e3),
                  this.engine.once(EngineEvent.SignalConnected, re),
                  this.engine.on(EngineEvent.Closing, () => {
                    this.engine.off(EngineEvent.SignalConnected, re),
                      te(
                        new PublishTrackError(
                          "publishing rejected as engine closed",
                          499
                        )
                      );
                  });
              } else
                try {
                  const re = yield this.publish(B, Z, X);
                  ee(re);
                } catch (re) {
                  te(re);
                }
            } catch (re) {
              te(re);
            }
          })
        );
        j.pendingPublishPromises.set(B, ie);
        try {
          return yield ie;
        } catch (ee) {
          throw ee;
        } finally {
          j.pendingPublishPromises.delete(B);
        }
      })();
    });
  }
  hasPermissionsToPublish(U) {
    if (!this.permissions)
      return (
        this.log.warn(
          "no permissions present for publishing track",
          Object.assign(
            Object.assign({}, this.logContext),
            getLogContextFromTrack(U)
          )
        ),
        !1
      );
    const { canPublish: F, canPublishSources: B } = this.permissions;
    return F &&
      (B.length === 0 ||
        B.map((V) => getTrackSourceFromProto(V)).includes(U.source))
      ? !0
      : (this.log.warn(
          "insufficient permissions to publish",
          Object.assign(
            Object.assign({}, this.logContext),
            getLogContextFromTrack(U)
          )
        ),
        !1);
  }
  publish(U, F, B) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var V, j, $, W, K, G, Q, z, H, Y;
      if (!this.hasPermissionsToPublish(U))
        throw new PublishTrackError(
          "failed to publish track, insufficient permissions",
          403
        );
      Array.from(this.trackPublications.values()).find(
        (se) => isLocalTrack(U) && se.source === U.source
      ) &&
        U.source !== Track.Source.Unknown &&
        this.log.info(
          "publishing a second track with the same source: ".concat(U.source),
          Object.assign(
            Object.assign({}, this.logContext),
            getLogContextFromTrack(U)
          )
        ),
        F.stopMicTrackOnMute && isAudioTrack(U) && (U.stopOnMute = !0),
        U.source === Track.Source.ScreenShare &&
          isFireFox() &&
          (F.simulcast = !1),
        F.videoCodec === "av1" && !supportsAV1() && (F.videoCodec = void 0),
        F.videoCodec === "vp9" && !supportsVP9() && (F.videoCodec = void 0),
        F.videoCodec === void 0 && (F.videoCodec = defaultVideoCodec),
        this.enabledPublishVideoCodecs.length > 0 &&
          (this.enabledPublishVideoCodecs.some(
            (se) => F.videoCodec === mimeTypeToVideoCodecString(se.mime)
          ) ||
            (F.videoCodec = mimeTypeToVideoCodecString(
              this.enabledPublishVideoCodecs[0].mime
            )));
      const Z = F.videoCodec;
      U.on(TrackEvent.Muted, this.onTrackMuted),
        U.on(TrackEvent.Unmuted, this.onTrackUnmuted),
        U.on(TrackEvent.Ended, this.handleTrackEnded),
        U.on(TrackEvent.UpstreamPaused, this.onTrackUpstreamPaused),
        U.on(TrackEvent.UpstreamResumed, this.onTrackUpstreamResumed),
        U.on(TrackEvent.AudioTrackFeatureUpdate, this.onTrackFeatureUpdate);
      const ie = new AddTrackRequest({
        cid: U.mediaStreamTrack.id,
        name: F.name,
        type: Track.kindToProto(U.kind),
        muted: U.isMuted,
        source: Track.sourceToProto(U.source),
        disableDtx: !(!((V = F.dtx) !== null && V !== void 0) || V),
        encryption: this.encryptionType,
        stereo: B,
        disableRed:
          this.isE2EEEnabled || !(!((j = F.red) !== null && j !== void 0) || j),
        stream: F == null ? void 0 : F.stream,
        backupCodecPolicy: F == null ? void 0 : F.backupCodecPolicy,
      });
      let ee;
      if (U.kind === Track.Kind.Video) {
        let se = { width: 0, height: 0 };
        try {
          se = yield U.waitForDimensions();
        } catch {
          const le =
            (W =
              ($ = this.roomOptions.videoCaptureDefaults) === null ||
              $ === void 0
                ? void 0
                : $.resolution) !== null && W !== void 0
              ? W
              : VideoPresets.h720.resolution;
          (se = { width: le.width, height: le.height }),
            this.log.error(
              "could not determine track dimensions, using defaults",
              Object.assign(
                Object.assign(
                  Object.assign({}, this.logContext),
                  getLogContextFromTrack(U)
                ),
                { dims: se }
              )
            );
        }
        (ie.width = se.width),
          (ie.height = se.height),
          isLocalVideoTrack(U) &&
            (isSVCCodec(Z) &&
              (U.source === Track.Source.ScreenShare &&
                ((F.scalabilityMode = "L1T3"),
                "contentHint" in U.mediaStreamTrack &&
                  ((U.mediaStreamTrack.contentHint = "motion"),
                  this.log.info(
                    "forcing contentHint to motion for screenshare with SVC codecs",
                    Object.assign(
                      Object.assign({}, this.logContext),
                      getLogContextFromTrack(U)
                    )
                  ))),
              (F.scalabilityMode =
                (K = F.scalabilityMode) !== null && K !== void 0
                  ? K
                  : "L3T3_KEY")),
            (ie.simulcastCodecs = [
              new SimulcastCodec({ codec: Z, cid: U.mediaStreamTrack.id }),
            ]),
            F.backupCodec === !0 &&
              (F.backupCodec = { codec: defaultVideoCodec }),
            F.backupCodec &&
              Z !== F.backupCodec.codec &&
              ie.encryption === Encryption_Type.NONE &&
              (this.roomOptions.dynacast || (this.roomOptions.dynacast = !0),
              ie.simulcastCodecs.push(
                new SimulcastCodec({ codec: F.backupCodec.codec, cid: "" })
              ))),
          (ee = computeVideoEncodings(
            U.source === Track.Source.ScreenShare,
            ie.width,
            ie.height,
            F
          )),
          (ie.layers = videoLayersFromEncodings(
            ie.width,
            ie.height,
            ee,
            isSVCCodec(F.videoCodec)
          ));
      } else U.kind === Track.Kind.Audio && (ee = [{ maxBitrate: (G = F.audioPreset) === null || G === void 0 ? void 0 : G.maxBitrate, priority: (z = (Q = F.audioPreset) === null || Q === void 0 ? void 0 : Q.priority) !== null && z !== void 0 ? z : "high", networkPriority: (Y = (H = F.audioPreset) === null || H === void 0 ? void 0 : H.priority) !== null && Y !== void 0 ? Y : "high" }]);
      if (!this.engine || this.engine.isClosed)
        throw new UnexpectedConnectionState(
          "cannot publish track when not connected"
        );
      const te = () =>
        __awaiter$1(this, void 0, void 0, function* () {
          var se, oe, le;
          if (!this.engine.pcManager)
            throw new UnexpectedConnectionState("pcManager is not ready");
          if (
            ((U.sender = yield this.engine.createSender(U, F, ee)),
            isLocalVideoTrack(U) &&
              (((se = F.degradationPreference) !== null && se !== void 0) ||
                (F.degradationPreference = getDefaultDegradationPreference(U)),
              U.setDegradationPreference(F.degradationPreference)),
            ee)
          )
            if (isFireFox() && U.kind === Track.Kind.Audio) {
              let fe;
              for (const pe of this.engine.pcManager.publisher.getTransceivers())
                if (pe.sender === U.sender) {
                  fe = pe;
                  break;
                }
              fe &&
                this.engine.pcManager.publisher.setTrackCodecBitrate({
                  transceiver: fe,
                  codec: "opus",
                  maxbr:
                    !((oe = ee[0]) === null || oe === void 0) && oe.maxBitrate
                      ? ee[0].maxBitrate / 1e3
                      : 0,
                });
            } else
              U.codec &&
                isSVCCodec(U.codec) &&
                !((le = ee[0]) === null || le === void 0) &&
                le.maxBitrate &&
                this.engine.pcManager.publisher.setTrackCodecBitrate({
                  cid: ie.cid,
                  codec: U.codec,
                  maxbr: ee[0].maxBitrate / 1e3,
                });
          yield this.engine.negotiate();
        });
      let re;
      if (this.enabledPublishVideoCodecs.length > 0)
        re = (yield Promise.all([this.engine.addTrack(ie), te()]))[0];
      else {
        re = yield this.engine.addTrack(ie);
        let se;
        if (
          (re.codecs.forEach((oe) => {
            se === void 0 && (se = oe.mimeType);
          }),
          se && U.kind === Track.Kind.Video)
        ) {
          const oe = mimeTypeToVideoCodecString(se);
          oe !== Z &&
            (this.log.debug(
              "falling back to server selected codec",
              Object.assign(
                Object.assign(
                  Object.assign({}, this.logContext),
                  getLogContextFromTrack(U)
                ),
                { codec: oe }
              )
            ),
            (F.videoCodec = oe),
            (ee = computeVideoEncodings(
              U.source === Track.Source.ScreenShare,
              ie.width,
              ie.height,
              F
            )));
        }
        yield te();
      }
      const ne = new LocalTrackPublication(U.kind, re, U, {
        loggerName: this.roomOptions.loggerName,
        loggerContextCb: () => this.logContext,
      });
      return (
        (ne.options = F),
        (U.sid = re.sid),
        this.log.debug(
          "publishing ".concat(U.kind, " with encodings"),
          Object.assign(Object.assign({}, this.logContext), {
            encodings: ee,
            trackInfo: re,
          })
        ),
        isLocalVideoTrack(U)
          ? U.startMonitor(this.engine.client)
          : isLocalAudioTrack(U) && U.startMonitor(),
        this.addTrackPublication(ne),
        this.emit(ParticipantEvent.LocalTrackPublished, ne),
        ne
      );
    });
  }
  get isLocal() {
    return !0;
  }
  publishAdditionalCodecForTrack(U, F, B) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var V;
      if (this.encryptionType !== Encryption_Type.NONE) return;
      let j;
      if (
        (this.trackPublications.forEach((Y) => {
          Y.track && Y.track === U && (j = Y);
        }),
        !j)
      )
        throw new TrackInvalidError("track is not published");
      if (!isLocalVideoTrack(U))
        throw new TrackInvalidError("track is not a video track");
      const $ = Object.assign(
          Object.assign(
            {},
            (V = this.roomOptions) === null || V === void 0
              ? void 0
              : V.publishDefaults
          ),
          B
        ),
        W = computeTrackBackupEncodings(U, F, $);
      if (!W) {
        this.log.info(
          "backup codec has been disabled, ignoring request to add additional codec for track",
          Object.assign(
            Object.assign({}, this.logContext),
            getLogContextFromTrack(U)
          )
        );
        return;
      }
      const K = U.addSimulcastTrack(F, W);
      if (!K) return;
      const G = new AddTrackRequest({
        cid: K.mediaStreamTrack.id,
        type: Track.kindToProto(U.kind),
        muted: U.isMuted,
        source: Track.sourceToProto(U.source),
        sid: U.sid,
        simulcastCodecs: [{ codec: $.videoCodec, cid: K.mediaStreamTrack.id }],
      });
      if (
        ((G.layers = videoLayersFromEncodings(G.width, G.height, W)),
        !this.engine || this.engine.isClosed)
      )
        throw new UnexpectedConnectionState(
          "cannot publish track when not connected"
        );
      const Q = () =>
          __awaiter$1(this, void 0, void 0, function* () {
            yield this.engine.createSimulcastSender(U, K, $, W),
              yield this.engine.negotiate();
          }),
        H = (yield Promise.all([this.engine.addTrack(G), Q()]))[0];
      this.log.debug(
        "published ".concat(F, " for track ").concat(U.sid),
        Object.assign(Object.assign({}, this.logContext), {
          encodings: W,
          trackInfo: H,
        })
      );
    });
  }
  unpublishTrack(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var B, V;
      if (isLocalTrack(U)) {
        const G = this.pendingPublishPromises.get(U);
        G &&
          (this.log.info(
            "awaiting publish promise before attempting to unpublish",
            Object.assign(
              Object.assign({}, this.logContext),
              getLogContextFromTrack(U)
            )
          ),
          yield G);
      }
      const j = this.getPublicationForTrack(U),
        $ = j ? getLogContextFromTrack(j) : void 0;
      if (
        (this.log.debug(
          "unpublishing track",
          Object.assign(Object.assign({}, this.logContext), $)
        ),
        !j || !j.track)
      ) {
        this.log.warn(
          "track was not unpublished because no publication was found",
          Object.assign(Object.assign({}, this.logContext), $)
        );
        return;
      }
      (U = j.track),
        U.off(TrackEvent.Muted, this.onTrackMuted),
        U.off(TrackEvent.Unmuted, this.onTrackUnmuted),
        U.off(TrackEvent.Ended, this.handleTrackEnded),
        U.off(TrackEvent.UpstreamPaused, this.onTrackUpstreamPaused),
        U.off(TrackEvent.UpstreamResumed, this.onTrackUpstreamResumed),
        U.off(TrackEvent.AudioTrackFeatureUpdate, this.onTrackFeatureUpdate),
        F === void 0 &&
          (F =
            (V =
              (B = this.roomOptions) === null || B === void 0
                ? void 0
                : B.stopLocalTrackOnUnpublish) !== null && V !== void 0
              ? V
              : !0),
        F ? U.stop() : U.stopMonitor();
      let W = !1;
      const K = U.sender;
      if (
        ((U.sender = void 0),
        this.engine.pcManager &&
          this.engine.pcManager.currentState < PCTransportState.FAILED &&
          K)
      )
        try {
          for (const G of this.engine.pcManager.publisher.getTransceivers())
            G.sender === K && ((G.direction = "inactive"), (W = !0));
          if ((this.engine.removeTrack(K) && (W = !0), isLocalVideoTrack(U))) {
            for (const [, G] of U.simulcastCodecs)
              G.sender &&
                (this.engine.removeTrack(G.sender) && (W = !0),
                (G.sender = void 0));
            U.simulcastCodecs.clear();
          }
        } catch (G) {
          this.log.warn(
            "failed to unpublish track",
            Object.assign(
              Object.assign(Object.assign({}, this.logContext), $),
              { error: G }
            )
          );
        }
      switch ((this.trackPublications.delete(j.trackSid), j.kind)) {
        case Track.Kind.Audio:
          this.audioTrackPublications.delete(j.trackSid);
          break;
        case Track.Kind.Video:
          this.videoTrackPublications.delete(j.trackSid);
          break;
      }
      return (
        this.emit(ParticipantEvent.LocalTrackUnpublished, j),
        j.setTrack(void 0),
        W && (yield this.engine.negotiate()),
        j
      );
    });
  }
  unpublishTracks(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      return (yield Promise.all(U.map((B) => this.unpublishTrack(B)))).filter(
        (B) => !!B
      );
    });
  }
  republishAllTracks(U) {
    return __awaiter$1(this, arguments, void 0, function (F) {
      var B = this;
      let V =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
      return (function* () {
        B.republishPromise && (yield B.republishPromise),
          (B.republishPromise = new Promise((j, $) =>
            __awaiter$1(B, void 0, void 0, function* () {
              try {
                const W = [];
                this.trackPublications.forEach((K) => {
                  K.track &&
                    (F &&
                      (K.options = Object.assign(
                        Object.assign({}, K.options),
                        F
                      )),
                    W.push(K));
                }),
                  yield Promise.all(
                    W.map((K) =>
                      __awaiter$1(this, void 0, void 0, function* () {
                        const G = K.track;
                        yield this.unpublishTrack(G, !1),
                          V &&
                            !G.isMuted &&
                            G.source !== Track.Source.ScreenShare &&
                            G.source !== Track.Source.ScreenShareAudio &&
                            (isLocalAudioTrack(G) || isLocalVideoTrack(G)) &&
                            !G.isUserProvided &&
                            (this.log.debug(
                              "restarting existing track",
                              Object.assign(
                                Object.assign({}, this.logContext),
                                { track: K.trackSid }
                              )
                            ),
                            yield G.restartTrack()),
                          yield this.publishOrRepublishTrack(G, K.options, !0);
                      })
                    )
                  ),
                  j();
              } catch (W) {
                $(W);
              } finally {
                this.republishPromise = void 0;
              }
            })
          )),
          yield B.republishPromise;
      })();
    });
  }
  publishData(U) {
    return __awaiter$1(this, arguments, void 0, function (F) {
      var B = this;
      let V =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return (function* () {
        const j = V.reliable ? DataPacket_Kind.RELIABLE : DataPacket_Kind.LOSSY,
          $ = V.destinationIdentities,
          W = V.topic,
          K = new DataPacket({
            kind: j,
            value: {
              case: "user",
              value: new UserPacket({
                participantIdentity: B.identity,
                payload: F,
                destinationIdentities: $,
                topic: W,
              }),
            },
          });
        yield B.engine.sendDataPacket(K, j);
      })();
    });
  }
  publishDtmf(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const B = new DataPacket({
        kind: DataPacket_Kind.RELIABLE,
        value: { case: "sipDtmf", value: new SipDTMF({ code: U, digit: F }) },
      });
      yield this.engine.sendDataPacket(B, DataPacket_Kind.RELIABLE);
    });
  }
  sendChatMessage(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const B = {
          id: crypto.randomUUID(),
          message: U,
          timestamp: Date.now(),
          attachedFiles: F == null ? void 0 : F.attachments,
        },
        V = new DataPacket({
          value: {
            case: "chatMessage",
            value: new ChatMessage(
              Object.assign(Object.assign({}, B), {
                timestamp: protoInt64.parse(B.timestamp),
              })
            ),
          },
        });
      return (
        yield this.engine.sendDataPacket(V, DataPacket_Kind.RELIABLE),
        this.emit(ParticipantEvent.ChatMessage, B),
        B
      );
    });
  }
  editChatMessage(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const B = Object.assign(Object.assign({}, F), {
          message: U,
          editTimestamp: Date.now(),
        }),
        V = new DataPacket({
          value: {
            case: "chatMessage",
            value: new ChatMessage(
              Object.assign(Object.assign({}, B), {
                timestamp: protoInt64.parse(B.timestamp),
                editTimestamp: protoInt64.parse(B.editTimestamp),
              })
            ),
          },
        });
      return (
        yield this.engine.sendDataPacket(V, DataPacket_Kind.RELIABLE),
        this.emit(ParticipantEvent.ChatMessage, B),
        B
      );
    });
  }
  sendText(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var B;
      const V = crypto.randomUUID(),
        $ = new TextEncoder().encode(U).byteLength,
        W =
          (B = F == null ? void 0 : F.attachments) === null || B === void 0
            ? void 0
            : B.map(() => crypto.randomUUID()),
        K = new Array(W ? W.length + 1 : 1).fill(0),
        G = (z, H) => {
          var Y;
          K[H] = z;
          const X = K.reduce((Z, ie) => Z + ie, 0);
          (Y = F == null ? void 0 : F.onProgress) === null ||
            Y === void 0 ||
            Y.call(F, X);
        },
        Q = yield this.streamText({
          streamId: V,
          totalSize: $,
          destinationIdentities: F == null ? void 0 : F.destinationIdentities,
          topic: F == null ? void 0 : F.topic,
          attachedStreamIds: W,
          attributes: F == null ? void 0 : F.attributes,
        });
      return (
        yield Q.write(U),
        G(1, 0),
        yield Q.close(),
        F != null &&
          F.attachments &&
          W &&
          (yield Promise.all(
            F.attachments.map((z, H) =>
              __awaiter$1(this, void 0, void 0, function* () {
                return this._sendFile(W[H], z, {
                  topic: F.topic,
                  mimeType: z.type,
                  onProgress: (Y) => {
                    G(Y, H + 1);
                  },
                });
              })
            )
          )),
        Q.info
      );
    });
  }
  streamText(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F, B;
      const V =
          (F = U == null ? void 0 : U.streamId) !== null && F !== void 0
            ? F
            : crypto.randomUUID(),
        j = {
          id: V,
          mimeType: "text/plain",
          timestamp: Date.now(),
          topic:
            (B = U == null ? void 0 : U.topic) !== null && B !== void 0
              ? B
              : "",
          size: U == null ? void 0 : U.totalSize,
          attributes: U == null ? void 0 : U.attributes,
        },
        $ = new DataStream_Header({
          streamId: V,
          mimeType: j.mimeType,
          topic: j.topic,
          timestamp: numberToBigInt(j.timestamp),
          totalLength: numberToBigInt(U == null ? void 0 : U.totalSize),
          attributes: j.attributes,
          contentHeader: {
            case: "textHeader",
            value: new DataStream_TextHeader({
              version: U == null ? void 0 : U.version,
              attachedStreamIds: U == null ? void 0 : U.attachedStreamIds,
              replyToStreamId: U == null ? void 0 : U.replyToStreamId,
              operationType:
                (U == null ? void 0 : U.type) === "update"
                  ? DataStream_OperationType.UPDATE
                  : DataStream_OperationType.CREATE,
            }),
          },
        }),
        W = U == null ? void 0 : U.destinationIdentities,
        K = new DataPacket({
          destinationIdentities: W,
          value: { case: "streamHeader", value: $ },
        });
      yield this.engine.sendDataPacket(K, DataPacket_Kind.RELIABLE);
      let G = 0;
      const Q = this,
        z = new WritableStream({
          write(X) {
            return __awaiter$1(this, void 0, void 0, function* () {
              for (const Z of splitUtf8(X, STREAM_CHUNK_SIZE)) {
                yield Q.engine.waitForBufferStatusLow(DataPacket_Kind.RELIABLE);
                const ie = new DataStream_Chunk({
                    content: Z,
                    streamId: V,
                    chunkIndex: numberToBigInt(G),
                  }),
                  ee = new DataPacket({
                    destinationIdentities: W,
                    value: { case: "streamChunk", value: ie },
                  });
                yield Q.engine.sendDataPacket(ee, DataPacket_Kind.RELIABLE),
                  (G += 1);
              }
            });
          },
          close() {
            return __awaiter$1(this, void 0, void 0, function* () {
              const X = new DataStream_Trailer({ streamId: V }),
                Z = new DataPacket({
                  destinationIdentities: W,
                  value: { case: "streamTrailer", value: X },
                });
              yield Q.engine.sendDataPacket(Z, DataPacket_Kind.RELIABLE);
            });
          },
          abort(X) {
            console.log("Sink error:", X);
          },
        });
      let H = () =>
        __awaiter$1(this, void 0, void 0, function* () {
          yield Y.close();
        });
      Q.engine.once(EngineEvent.Closing, H);
      const Y = new TextStreamWriter(z, j, () =>
        this.engine.off(EngineEvent.Closing, H)
      );
      return Y;
    });
  }
  sendFile(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const B = crypto.randomUUID();
      return yield this._sendFile(B, U, F), { id: B };
    });
  }
  _sendFile(U, F, B) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var V;
      const j = yield this.streamBytes({
          streamId: U,
          totalSize: F.size,
          name: F.name,
          mimeType:
            (V = B == null ? void 0 : B.mimeType) !== null && V !== void 0
              ? V
              : F.type,
          topic: B == null ? void 0 : B.topic,
          destinationIdentities: B == null ? void 0 : B.destinationIdentities,
        }),
        $ = F.stream().getReader();
      for (;;) {
        const { done: W, value: K } = yield $.read();
        if (W) break;
        yield j.write(K);
      }
      return yield j.close(), j.info;
    });
  }
  streamBytes(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F, B, V, j, $;
      const W =
          (F = U == null ? void 0 : U.streamId) !== null && F !== void 0
            ? F
            : crypto.randomUUID(),
        K = U == null ? void 0 : U.destinationIdentities,
        G = {
          id: W,
          mimeType:
            (B = U == null ? void 0 : U.mimeType) !== null && B !== void 0
              ? B
              : "application/octet-stream",
          topic:
            (V = U == null ? void 0 : U.topic) !== null && V !== void 0
              ? V
              : "",
          timestamp: Date.now(),
          attributes: U == null ? void 0 : U.attributes,
          size: U == null ? void 0 : U.totalSize,
          name:
            (j = U == null ? void 0 : U.name) !== null && j !== void 0
              ? j
              : "unknown",
        },
        Q = new DataStream_Header({
          totalLength: numberToBigInt(
            ($ = G.size) !== null && $ !== void 0 ? $ : 0
          ),
          mimeType: G.mimeType,
          streamId: W,
          topic: G.topic,
          timestamp: numberToBigInt(Date.now()),
          contentHeader: {
            case: "byteHeader",
            value: new DataStream_ByteHeader({ name: G.name }),
          },
        }),
        z = new DataPacket({
          destinationIdentities: K,
          value: { case: "streamHeader", value: Q },
        });
      yield this.engine.sendDataPacket(z, DataPacket_Kind.RELIABLE);
      let H = 0;
      const Y = new _$1(),
        X = this.engine,
        Z = this.log,
        ie = new WritableStream({
          write(te) {
            return __awaiter$1(this, void 0, void 0, function* () {
              const re = yield Y.lock();
              let ne = 0;
              try {
                for (; ne < te.byteLength; ) {
                  const se = te.slice(ne, ne + STREAM_CHUNK_SIZE);
                  yield X.waitForBufferStatusLow(DataPacket_Kind.RELIABLE);
                  const oe = new DataPacket({
                    destinationIdentities: K,
                    value: {
                      case: "streamChunk",
                      value: new DataStream_Chunk({
                        content: se,
                        streamId: W,
                        chunkIndex: numberToBigInt(H),
                      }),
                    },
                  });
                  yield X.sendDataPacket(oe, DataPacket_Kind.RELIABLE),
                    (H += 1),
                    (ne += se.byteLength);
                }
              } finally {
                re();
              }
            });
          },
          close() {
            return __awaiter$1(this, void 0, void 0, function* () {
              const te = new DataStream_Trailer({ streamId: W }),
                re = new DataPacket({
                  destinationIdentities: K,
                  value: { case: "streamTrailer", value: te },
                });
              yield X.sendDataPacket(re, DataPacket_Kind.RELIABLE);
            });
          },
          abort(te) {
            Z.error("Sink error:", te);
          },
        });
      return new ByteStreamWriter(ie, G);
    });
  }
  performRpc(U) {
    return __awaiter$1(this, arguments, void 0, function (F) {
      var B = this;
      let {
        destinationIdentity: V,
        method: j,
        payload: $,
        responseTimeout: W = 1e4,
      } = F;
      return (function* () {
        return new Promise((G, Q) =>
          __awaiter$1(B, void 0, void 0, function* () {
            var z, H, Y, X;
            if (byteLength($) > MAX_PAYLOAD_BYTES) {
              Q(RpcError.builtIn("REQUEST_PAYLOAD_TOO_LARGE"));
              return;
            }
            if (
              !(
                (H =
                  (z = this.engine.latestJoinResponse) === null || z === void 0
                    ? void 0
                    : z.serverInfo) === null || H === void 0
              ) &&
              H.version &&
              compareVersions(
                (X =
                  (Y = this.engine.latestJoinResponse) === null || Y === void 0
                    ? void 0
                    : Y.serverInfo) === null || X === void 0
                  ? void 0
                  : X.version,
                "1.8.0"
              ) < 0
            ) {
              Q(RpcError.builtIn("UNSUPPORTED_SERVER"));
              return;
            }
            const Z = crypto.randomUUID();
            yield this.publishRpcRequest(V, Z, j, $, W - 2e3);
            const ie = setTimeout(() => {
              this.pendingAcks.delete(Z),
                Q(RpcError.builtIn("CONNECTION_TIMEOUT")),
                this.pendingResponses.delete(Z),
                clearTimeout(ee);
            }, 2e3);
            this.pendingAcks.set(Z, {
              resolve: () => {
                clearTimeout(ie);
              },
              participantIdentity: V,
            });
            const ee = setTimeout(() => {
              this.pendingResponses.delete(Z),
                Q(RpcError.builtIn("RESPONSE_TIMEOUT"));
            }, W);
            this.pendingResponses.set(Z, {
              resolve: (te, re) => {
                clearTimeout(ee),
                  this.pendingAcks.has(Z) &&
                    (console.warn("RPC response received before ack", Z),
                    this.pendingAcks.delete(Z),
                    clearTimeout(ie)),
                  re ? Q(re) : G(te ?? "");
              },
              participantIdentity: V,
            });
          })
        );
      })();
    });
  }
  registerRpcMethod(U, F) {
    this.rpcHandlers.has(U) &&
      this.log.warn(
        "you're overriding the RPC handler for method ".concat(
          U,
          ", in the future this will throw an error"
        )
      ),
      this.rpcHandlers.set(U, F);
  }
  unregisterRpcMethod(U) {
    this.rpcHandlers.delete(U);
  }
  setTrackSubscriptionPermissions(U) {
    let F = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    (this.participantTrackPermissions = F),
      (this.allParticipantsAllowedToSubscribe = U),
      this.engine.client.isDisconnected ||
        this.updateTrackSubscriptionPermissions();
  }
  handleIncomingRpcAck(U) {
    const F = this.pendingAcks.get(U);
    F
      ? (F.resolve(), this.pendingAcks.delete(U))
      : console.error("Ack received for unexpected RPC request", U);
  }
  handleIncomingRpcResponse(U, F, B) {
    const V = this.pendingResponses.get(U);
    V
      ? (V.resolve(F, B), this.pendingResponses.delete(U))
      : console.error("Response received for unexpected RPC request", U);
  }
  publishRpcRequest(U, F, B, V, j) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const $ = new DataPacket({
        destinationIdentities: [U],
        kind: DataPacket_Kind.RELIABLE,
        value: {
          case: "rpcRequest",
          value: new RpcRequest({
            id: F,
            method: B,
            payload: V,
            responseTimeoutMs: j,
            version: 1,
          }),
        },
      });
      yield this.engine.sendDataPacket($, DataPacket_Kind.RELIABLE);
    });
  }
  handleParticipantDisconnected(U) {
    for (const [F, { participantIdentity: B }] of this.pendingAcks)
      B === U && this.pendingAcks.delete(F);
    for (const [F, { participantIdentity: B, resolve: V }] of this
      .pendingResponses)
      B === U &&
        (V(null, RpcError.builtIn("RECIPIENT_DISCONNECTED")),
        this.pendingResponses.delete(F));
  }
  setEnabledPublishCodecs(U) {
    this.enabledPublishVideoCodecs = U.filter(
      (F) => F.mime.split("/")[0].toLowerCase() === "video"
    );
  }
  updateInfo(U) {
    return U.sid !== this.sid || !super.updateInfo(U)
      ? !1
      : (U.tracks.forEach((F) => {
          var B, V;
          const j = this.trackPublications.get(F.sid);
          if (j) {
            const $ =
              j.isMuted ||
              ((V =
                (B = j.track) === null || B === void 0
                  ? void 0
                  : B.isUpstreamPaused) !== null && V !== void 0
                ? V
                : !1);
            $ !== F.muted &&
              (this.log.debug(
                "updating server mute state after reconcile",
                Object.assign(
                  Object.assign(
                    Object.assign({}, this.logContext),
                    getLogContextFromTrack(j)
                  ),
                  { mutedOnServer: $ }
                )
              ),
              this.engine.client.sendMuteTrack(F.sid, $));
          }
        }),
        !0);
  }
  getPublicationForTrack(U) {
    let F;
    return (
      this.trackPublications.forEach((B) => {
        const V = B.track;
        V &&
          (U instanceof MediaStreamTrack
            ? (isLocalAudioTrack(V) || isLocalVideoTrack(V)) &&
              V.mediaStreamTrack === U &&
              (F = B)
            : U === V && (F = B));
      }),
      F
    );
  }
  waitForPendingPublicationOfSource(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const B = Date.now();
      for (; Date.now() < B + 1e4; ) {
        const V = Array.from(this.pendingPublishPromises.entries()).find(
          (j) => {
            let [$] = j;
            return $.source === U;
          }
        );
        if (V) return V[1];
        yield sleep$1(20);
      }
    });
  }
}
class RemoteTrackPublication extends TrackPublication {
  constructor(U, F, B, V) {
    super(U, F.sid, F.name, V),
      (this.track = void 0),
      (this.allowed = !0),
      (this.disabled = !1),
      (this.currentVideoQuality = VideoQuality.HIGH),
      (this.handleEnded = (j) => {
        this.setTrack(void 0), this.emit(TrackEvent.Ended, j);
      }),
      (this.handleVisibilityChange = (j) => {
        this.log.debug(
          "adaptivestream video visibility "
            .concat(this.trackSid, ", visible=")
            .concat(j),
          this.logContext
        ),
          (this.disabled = !j),
          this.emitTrackUpdate();
      }),
      (this.handleVideoDimensionsChange = (j) => {
        this.log.debug(
          "adaptivestream video dimensions "
            .concat(j.width, "x")
            .concat(j.height),
          this.logContext
        ),
          (this.videoDimensions = j),
          this.emitTrackUpdate();
      }),
      (this.subscribed = B),
      this.updateInfo(F);
  }
  setSubscribed(U) {
    const F = this.subscriptionStatus,
      B = this.permissionStatus;
    (this.subscribed = U), U && (this.allowed = !0);
    const V = new UpdateSubscription({
      trackSids: [this.trackSid],
      subscribe: this.subscribed,
      participantTracks: [
        new ParticipantTracks({
          participantSid: "",
          trackSids: [this.trackSid],
        }),
      ],
    });
    this.emit(TrackEvent.UpdateSubscription, V),
      this.emitSubscriptionUpdateIfChanged(F),
      this.emitPermissionUpdateIfChanged(B);
  }
  get subscriptionStatus() {
    return this.subscribed === !1
      ? TrackPublication.SubscriptionStatus.Unsubscribed
      : super.isSubscribed
      ? TrackPublication.SubscriptionStatus.Subscribed
      : TrackPublication.SubscriptionStatus.Desired;
  }
  get permissionStatus() {
    return this.allowed
      ? TrackPublication.PermissionStatus.Allowed
      : TrackPublication.PermissionStatus.NotAllowed;
  }
  get isSubscribed() {
    return this.subscribed === !1 ? !1 : super.isSubscribed;
  }
  get isDesired() {
    return this.subscribed !== !1;
  }
  get isEnabled() {
    return !this.disabled;
  }
  get isLocal() {
    return !1;
  }
  setEnabled(U) {
    !this.isManualOperationAllowed() ||
      this.disabled === !U ||
      ((this.disabled = !U), this.emitTrackUpdate());
  }
  setVideoQuality(U) {
    !this.isManualOperationAllowed() ||
      this.currentVideoQuality === U ||
      ((this.currentVideoQuality = U),
      (this.videoDimensions = void 0),
      this.emitTrackUpdate());
  }
  setVideoDimensions(U) {
    var F, B;
    this.isManualOperationAllowed() &&
      ((((F = this.videoDimensions) === null || F === void 0
        ? void 0
        : F.width) === U.width &&
        ((B = this.videoDimensions) === null || B === void 0
          ? void 0
          : B.height) === U.height) ||
        (isRemoteVideoTrack(this.track) && (this.videoDimensions = U),
        (this.currentVideoQuality = void 0),
        this.emitTrackUpdate()));
  }
  setVideoFPS(U) {
    this.isManualOperationAllowed() &&
      isRemoteVideoTrack(this.track) &&
      this.fps !== U &&
      ((this.fps = U), this.emitTrackUpdate());
  }
  get videoQuality() {
    return this.currentVideoQuality;
  }
  setTrack(U) {
    const F = this.subscriptionStatus,
      B = this.permissionStatus,
      V = this.track;
    V !== U &&
      (V &&
        (V.off(
          TrackEvent.VideoDimensionsChanged,
          this.handleVideoDimensionsChange
        ),
        V.off(TrackEvent.VisibilityChanged, this.handleVisibilityChange),
        V.off(TrackEvent.Ended, this.handleEnded),
        V.detach(),
        V.stopMonitor(),
        this.emit(TrackEvent.Unsubscribed, V)),
      super.setTrack(U),
      U &&
        ((U.sid = this.trackSid),
        U.on(
          TrackEvent.VideoDimensionsChanged,
          this.handleVideoDimensionsChange
        ),
        U.on(TrackEvent.VisibilityChanged, this.handleVisibilityChange),
        U.on(TrackEvent.Ended, this.handleEnded),
        this.emit(TrackEvent.Subscribed, U)),
      this.emitPermissionUpdateIfChanged(B),
      this.emitSubscriptionUpdateIfChanged(F));
  }
  setAllowed(U) {
    const F = this.subscriptionStatus,
      B = this.permissionStatus;
    (this.allowed = U),
      this.emitPermissionUpdateIfChanged(B),
      this.emitSubscriptionUpdateIfChanged(F);
  }
  setSubscriptionError(U) {
    this.emit(TrackEvent.SubscriptionFailed, U);
  }
  updateInfo(U) {
    super.updateInfo(U);
    const F = this.metadataMuted;
    (this.metadataMuted = U.muted),
      this.track
        ? this.track.setMuted(U.muted)
        : F !== U.muted &&
          this.emit(U.muted ? TrackEvent.Muted : TrackEvent.Unmuted);
  }
  emitSubscriptionUpdateIfChanged(U) {
    const F = this.subscriptionStatus;
    U !== F && this.emit(TrackEvent.SubscriptionStatusChanged, F, U);
  }
  emitPermissionUpdateIfChanged(U) {
    this.permissionStatus !== U &&
      this.emit(
        TrackEvent.SubscriptionPermissionChanged,
        this.permissionStatus,
        U
      );
  }
  isManualOperationAllowed() {
    return this.kind === Track.Kind.Video && this.isAdaptiveStream
      ? (this.log.warn(
          "adaptive stream is enabled, cannot change video track settings",
          this.logContext
        ),
        !1)
      : this.isDesired
      ? !0
      : (this.log.warn(
          "cannot update track settings when not subscribed",
          this.logContext
        ),
        !1);
  }
  get isAdaptiveStream() {
    return isRemoteVideoTrack(this.track) && this.track.isAdaptiveStream;
  }
  emitTrackUpdate() {
    const U = new UpdateTrackSettings({
      trackSids: [this.trackSid],
      disabled: this.disabled,
      fps: this.fps,
    });
    this.videoDimensions
      ? ((U.width = Math.ceil(this.videoDimensions.width)),
        (U.height = Math.ceil(this.videoDimensions.height)))
      : this.currentVideoQuality !== void 0
      ? (U.quality = this.currentVideoQuality)
      : (U.quality = VideoQuality.HIGH),
      this.emit(TrackEvent.UpdateSettings, U);
  }
}
class RemoteParticipant extends Participant {
  static fromParticipantInfo(U, F, B) {
    return new RemoteParticipant(
      U,
      F.sid,
      F.identity,
      F.name,
      F.metadata,
      F.attributes,
      B,
      F.kind
    );
  }
  get logContext() {
    return Object.assign(Object.assign({}, super.logContext), {
      rpID: this.sid,
      remoteParticipant: this.identity,
    });
  }
  constructor(U, F, B, V, j, $, W) {
    let K =
      arguments.length > 7 && arguments[7] !== void 0
        ? arguments[7]
        : ParticipantInfo_Kind.STANDARD;
    super(F, B || "", V, j, $, W, K),
      (this.signalClient = U),
      (this.trackPublications = new Map()),
      (this.audioTrackPublications = new Map()),
      (this.videoTrackPublications = new Map()),
      (this.volumeMap = new Map());
  }
  addTrackPublication(U) {
    super.addTrackPublication(U),
      U.on(TrackEvent.UpdateSettings, (F) => {
        this.log.debug(
          "send update settings",
          Object.assign(
            Object.assign({}, this.logContext),
            getLogContextFromTrack(U)
          )
        ),
          this.signalClient.sendUpdateTrackSettings(F);
      }),
      U.on(TrackEvent.UpdateSubscription, (F) => {
        F.participantTracks.forEach((B) => {
          B.participantSid = this.sid;
        }),
          this.signalClient.sendUpdateSubscription(F);
      }),
      U.on(TrackEvent.SubscriptionPermissionChanged, (F) => {
        this.emit(ParticipantEvent.TrackSubscriptionPermissionChanged, U, F);
      }),
      U.on(TrackEvent.SubscriptionStatusChanged, (F) => {
        this.emit(ParticipantEvent.TrackSubscriptionStatusChanged, U, F);
      }),
      U.on(TrackEvent.Subscribed, (F) => {
        this.emit(ParticipantEvent.TrackSubscribed, F, U);
      }),
      U.on(TrackEvent.Unsubscribed, (F) => {
        this.emit(ParticipantEvent.TrackUnsubscribed, F, U);
      }),
      U.on(TrackEvent.SubscriptionFailed, (F) => {
        this.emit(ParticipantEvent.TrackSubscriptionFailed, U.trackSid, F);
      });
  }
  getTrackPublication(U) {
    const F = super.getTrackPublication(U);
    if (F) return F;
  }
  getTrackPublicationByName(U) {
    const F = super.getTrackPublicationByName(U);
    if (F) return F;
  }
  setVolume(U) {
    let F =
      arguments.length > 1 && arguments[1] !== void 0
        ? arguments[1]
        : Track.Source.Microphone;
    this.volumeMap.set(F, U);
    const B = this.getTrackPublication(F);
    B && B.track && B.track.setVolume(U);
  }
  getVolume() {
    let U =
      arguments.length > 0 && arguments[0] !== void 0
        ? arguments[0]
        : Track.Source.Microphone;
    const F = this.getTrackPublication(U);
    return F && F.track ? F.track.getVolume() : this.volumeMap.get(U);
  }
  addSubscribedMediaTrack(U, F, B, V, j, $) {
    let W = this.getTrackPublicationBySid(F);
    if (
      (W ||
        F.startsWith("TR") ||
        this.trackPublications.forEach((Q) => {
          !W && U.kind === Q.kind.toString() && (W = Q);
        }),
      !W)
    ) {
      if ($ === 0) {
        this.log.error(
          "could not find published track",
          Object.assign(Object.assign({}, this.logContext), { trackSid: F })
        ),
          this.emit(ParticipantEvent.TrackSubscriptionFailed, F);
        return;
      }
      $ === void 0 && ($ = 20),
        setTimeout(() => {
          this.addSubscribedMediaTrack(U, F, B, V, j, $ - 1);
        }, 150);
      return;
    }
    if (U.readyState === "ended") {
      this.log.error(
        "unable to subscribe because MediaStreamTrack is ended. Do not call MediaStreamTrack.stop()",
        Object.assign(
          Object.assign({}, this.logContext),
          getLogContextFromTrack(W)
        )
      ),
        this.emit(ParticipantEvent.TrackSubscriptionFailed, F);
      return;
    }
    const K = U.kind === "video";
    let G;
    return (
      K
        ? (G = new RemoteVideoTrack(U, F, V, j))
        : (G = new RemoteAudioTrack(
            U,
            F,
            V,
            this.audioContext,
            this.audioOutput
          )),
      (G.source = W.source),
      (G.isMuted = W.isMuted),
      G.setMediaStream(B),
      G.start(),
      W.setTrack(G),
      this.volumeMap.has(W.source) &&
        isRemoteTrack(G) &&
        isAudioTrack(G) &&
        G.setVolume(this.volumeMap.get(W.source)),
      W
    );
  }
  get hasMetadata() {
    return !!this.participantInfo;
  }
  getTrackPublicationBySid(U) {
    return this.trackPublications.get(U);
  }
  updateInfo(U) {
    if (!super.updateInfo(U)) return !1;
    const F = new Map(),
      B = new Map();
    return (
      U.tracks.forEach((V) => {
        var j, $;
        let W = this.getTrackPublicationBySid(V.sid);
        if (W) W.updateInfo(V);
        else {
          const K = Track.kindFromProto(V.type);
          if (!K) return;
          (W = new RemoteTrackPublication(
            K,
            V,
            (j = this.signalClient.connectOptions) === null || j === void 0
              ? void 0
              : j.autoSubscribe,
            {
              loggerContextCb: () => this.logContext,
              loggerName:
                ($ = this.loggerOptions) === null || $ === void 0
                  ? void 0
                  : $.loggerName,
            }
          )),
            W.updateInfo(V),
            B.set(V.sid, W);
          const G = Array.from(this.trackPublications.values()).find(
            (Q) => Q.source === (W == null ? void 0 : W.source)
          );
          G &&
            W.source !== Track.Source.Unknown &&
            this.log.debug(
              "received a second track publication for "
                .concat(this.identity, " with the same source: ")
                .concat(W.source),
              Object.assign(Object.assign({}, this.logContext), {
                oldTrack: getLogContextFromTrack(G),
                newTrack: getLogContextFromTrack(W),
              })
            ),
            this.addTrackPublication(W);
        }
        F.set(V.sid, W);
      }),
      this.trackPublications.forEach((V) => {
        F.has(V.trackSid) ||
          (this.log.trace(
            "detected removed track on remote participant, unpublishing",
            Object.assign(
              Object.assign({}, this.logContext),
              getLogContextFromTrack(V)
            )
          ),
          this.unpublishTrack(V.trackSid, !0));
      }),
      B.forEach((V) => {
        this.emit(ParticipantEvent.TrackPublished, V);
      }),
      !0
    );
  }
  unpublishTrack(U, F) {
    const B = this.trackPublications.get(U);
    if (!B) return;
    const { track: V } = B;
    switch (
      (V && (V.stop(), B.setTrack(void 0)),
      this.trackPublications.delete(U),
      B.kind)
    ) {
      case Track.Kind.Audio:
        this.audioTrackPublications.delete(U);
        break;
      case Track.Kind.Video:
        this.videoTrackPublications.delete(U);
        break;
    }
    F && this.emit(ParticipantEvent.TrackUnpublished, B);
  }
  setAudioOutput(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      this.audioOutput = U;
      const F = [];
      this.audioTrackPublications.forEach((B) => {
        var V;
        isAudioTrack(B.track) &&
          isRemoteTrack(B.track) &&
          F.push(
            B.track.setSinkId(
              (V = U.deviceId) !== null && V !== void 0 ? V : "default"
            )
          );
      }),
        yield Promise.all(F);
    });
  }
  emit(U) {
    for (
      var F = arguments.length, B = new Array(F > 1 ? F - 1 : 0), V = 1;
      V < F;
      V++
    )
      B[V - 1] = arguments[V];
    return (
      this.log.trace(
        "participant event",
        Object.assign(Object.assign({}, this.logContext), { event: U, args: B })
      ),
      super.emit(U, ...B)
    );
  }
}
var ConnectionState;
(function (q) {
  (q.Disconnected = "disconnected"),
    (q.Connecting = "connecting"),
    (q.Connected = "connected"),
    (q.Reconnecting = "reconnecting"),
    (q.SignalReconnecting = "signalReconnecting");
})(ConnectionState || (ConnectionState = {}));
const connectionReconcileFrequency = 4 * 1e3;
class Room extends eventsExports.EventEmitter {
  constructor(U) {
    var F, B, V, j;
    if (
      (super(),
      (F = this),
      (this.state = ConnectionState.Disconnected),
      (this.activeSpeakers = []),
      (this.isE2EEEnabled = !1),
      (this.audioEnabled = !0),
      (this.isVideoPlaybackBlocked = !1),
      (this.log = livekitLogger),
      (this.bufferedEvents = []),
      (this.isResuming = !1),
      (this.byteStreamControllers = new Map()),
      (this.textStreamControllers = new Map()),
      (this.byteStreamHandlers = new Map()),
      (this.textStreamHandlers = new Map()),
      (this.rpcHandlers = new Map()),
      (this.connect = ($, W, K) =>
        __awaiter$1(this, void 0, void 0, function* () {
          var G;
          if (!isBrowserSupported())
            throw isReactNative()
              ? Error("WebRTC isn't detected, have you called registerGlobals?")
              : Error(
                  "LiveKit doesn't seem to be supported on this browser. Try to update your browser and make sure no browser extensions are disabling webRTC."
                );
          const Q = yield this.disconnectLock.lock();
          if (this.state === ConnectionState.Connected)
            return (
              this.log.info(
                "already connected to room ".concat(this.name),
                this.logContext
              ),
              Q(),
              Promise.resolve()
            );
          if (this.connectFuture) return Q(), this.connectFuture.promise;
          this.setAndEmitConnectionState(ConnectionState.Connecting),
            ((G = this.regionUrlProvider) === null || G === void 0
              ? void 0
              : G.getServerUrl().toString()) !== $ &&
              ((this.regionUrl = void 0), (this.regionUrlProvider = void 0)),
            isCloud(new URL($)) &&
              (this.regionUrlProvider === void 0
                ? (this.regionUrlProvider = new RegionUrlProvider($, W))
                : this.regionUrlProvider.updateToken(W),
              this.regionUrlProvider
                .fetchRegionSettings()
                .then((Y) => {
                  var X;
                  (X = this.regionUrlProvider) === null ||
                    X === void 0 ||
                    X.setServerReportedRegions(Y);
                })
                .catch((Y) => {
                  this.log.warn(
                    "could not fetch region settings",
                    Object.assign(Object.assign({}, this.logContext), {
                      error: Y,
                    })
                  );
                }));
          const z = (Y, X, Z) =>
              __awaiter$1(this, void 0, void 0, function* () {
                var ie, ee;
                this.abortController && this.abortController.abort();
                const te = new AbortController();
                (this.abortController = te), Q == null || Q();
                try {
                  yield this.attemptConnection(Z ?? $, W, K, te),
                    (this.abortController = void 0),
                    Y();
                } catch (re) {
                  if (
                    this.regionUrlProvider &&
                    re instanceof ConnectionError &&
                    re.reason !== ConnectionErrorReason.Cancelled &&
                    re.reason !== ConnectionErrorReason.NotAllowed
                  ) {
                    let ne = null;
                    try {
                      ne = yield this.regionUrlProvider.getNextBestRegionUrl(
                        (ie = this.abortController) === null || ie === void 0
                          ? void 0
                          : ie.signal
                      );
                    } catch (se) {
                      if (
                        se instanceof ConnectionError &&
                        (se.status === 401 ||
                          se.reason === ConnectionErrorReason.Cancelled)
                      ) {
                        this.handleDisconnect(
                          this.options.stopLocalTrackOnUnpublish
                        ),
                          X(se);
                        return;
                      }
                    }
                    ne &&
                    !(
                      !(
                        (ee = this.abortController) === null || ee === void 0
                      ) && ee.signal.aborted
                    )
                      ? (this.log.info(
                          "Initial connection failed with ConnectionError: "
                            .concat(
                              re.message,
                              ". Retrying with another region: "
                            )
                            .concat(ne),
                          this.logContext
                        ),
                        this.recreateEngine(),
                        yield z(Y, X, ne))
                      : (this.handleDisconnect(
                          this.options.stopLocalTrackOnUnpublish,
                          getDisconnectReasonFromConnectionError(re)
                        ),
                        X(re));
                  } else {
                    let ne = DisconnectReason.UNKNOWN_REASON;
                    re instanceof ConnectionError &&
                      (ne = getDisconnectReasonFromConnectionError(re)),
                      this.handleDisconnect(
                        this.options.stopLocalTrackOnUnpublish,
                        ne
                      ),
                      X(re);
                  }
                }
              }),
            H = this.regionUrl;
          return (
            (this.regionUrl = void 0),
            (this.connectFuture = new Future(
              (Y, X) => {
                z(Y, X, H);
              },
              () => {
                this.clearConnectionFutures();
              }
            )),
            this.connectFuture.promise
          );
        })),
      (this.connectSignal = ($, W, K, G, Q, z) =>
        __awaiter$1(this, void 0, void 0, function* () {
          var H, Y, X;
          const Z = yield K.join(
            $,
            W,
            {
              autoSubscribe: G.autoSubscribe,
              adaptiveStream:
                typeof Q.adaptiveStream == "object" ? !0 : Q.adaptiveStream,
              maxRetries: G.maxRetries,
              e2eeEnabled: !!this.e2eeManager,
              websocketTimeout: G.websocketTimeout,
            },
            z.signal
          );
          let ie = Z.serverInfo;
          if (
            (ie || (ie = { version: Z.serverVersion, region: Z.serverRegion }),
            (this.serverInfo = ie),
            this.log.debug(
              "connected to Livekit Server ".concat(
                Object.entries(ie)
                  .map((ee) => {
                    let [te, re] = ee;
                    return "".concat(te, ": ").concat(re);
                  })
                  .join(", ")
              ),
              {
                room: (H = Z.room) === null || H === void 0 ? void 0 : H.name,
                roomSid: (Y = Z.room) === null || Y === void 0 ? void 0 : Y.sid,
                identity:
                  (X = Z.participant) === null || X === void 0
                    ? void 0
                    : X.identity,
              }
            ),
            !ie.version)
          )
            throw new UnsupportedServer("unknown server version");
          return (
            ie.version === "0.15.1" &&
              this.options.dynacast &&
              (this.log.debug(
                "disabling dynacast due to server version",
                this.logContext
              ),
              (Q.dynacast = !1)),
            Z
          );
        })),
      (this.applyJoinResponse = ($) => {
        const W = $.participant;
        if (
          ((this.localParticipant.sid = W.sid),
          (this.localParticipant.identity = W.identity),
          this.localParticipant.setEnabledPublishCodecs($.enabledPublishCodecs),
          this.options.e2ee && this.e2eeManager)
        )
          try {
            this.e2eeManager.setSifTrailer($.sifTrailer);
          } catch (K) {
            this.log.error(
              K instanceof Error ? K.message : "Could not set SifTrailer",
              Object.assign(Object.assign({}, this.logContext), { error: K })
            );
          }
        this.handleParticipantUpdates([W, ...$.otherParticipants]),
          $.room && this.handleRoomUpdate($.room);
      }),
      (this.attemptConnection = ($, W, K, G) =>
        __awaiter$1(this, void 0, void 0, function* () {
          var Q, z;
          this.state === ConnectionState.Reconnecting ||
          this.isResuming ||
          (!((Q = this.engine) === null || Q === void 0) && Q.pendingReconnect)
            ? (this.log.info(
                "Reconnection attempt replaced by new connection attempt",
                this.logContext
              ),
              this.recreateEngine())
            : this.maybeCreateEngine(),
            !((z = this.regionUrlProvider) === null || z === void 0) &&
              z.isCloud() &&
              this.engine.setRegionUrlProvider(this.regionUrlProvider),
            this.acquireAudioContext(),
            (this.connOptions = Object.assign(
              Object.assign({}, roomConnectOptionDefaults),
              K
            )),
            this.connOptions.rtcConfig &&
              (this.engine.rtcConfig = this.connOptions.rtcConfig),
            this.connOptions.peerConnectionTimeout &&
              (this.engine.peerConnectionTimeout =
                this.connOptions.peerConnectionTimeout);
          try {
            const H = yield this.connectSignal(
              $,
              W,
              this.engine,
              this.connOptions,
              this.options,
              G
            );
            this.applyJoinResponse(H),
              this.setupLocalParticipantEvents(),
              this.emit(RoomEvent.SignalConnected);
          } catch (H) {
            yield this.engine.close(), this.recreateEngine();
            const Y = new ConnectionError(
              "could not establish signal connection",
              ConnectionErrorReason.ServerUnreachable
            );
            throw (
              (H instanceof Error &&
                (Y.message = "".concat(Y.message, ": ").concat(H.message)),
              H instanceof ConnectionError &&
                ((Y.reason = H.reason), (Y.status = H.status)),
              this.log.debug(
                "error trying to establish signal connection",
                Object.assign(Object.assign({}, this.logContext), { error: H })
              ),
              Y)
            );
          }
          if (G.signal.aborted)
            throw (
              (yield this.engine.close(),
              this.recreateEngine(),
              new ConnectionError(
                "Connection attempt aborted",
                ConnectionErrorReason.Cancelled
              ))
            );
          try {
            yield this.engine.waitForPCInitialConnection(
              this.connOptions.peerConnectionTimeout,
              G
            );
          } catch (H) {
            throw (yield this.engine.close(), this.recreateEngine(), H);
          }
          isWeb() &&
            this.options.disconnectOnPageLeave &&
            (window.addEventListener("pagehide", this.onPageLeave),
            window.addEventListener("beforeunload", this.onPageLeave)),
            isWeb() && document.addEventListener("freeze", this.onPageLeave),
            this.setAndEmitConnectionState(ConnectionState.Connected),
            this.emit(RoomEvent.Connected),
            this.registerConnectionReconcile();
        })),
      (this.disconnect = function () {
        for (var $ = arguments.length, W = new Array($), K = 0; K < $; K++)
          W[K] = arguments[K];
        return __awaiter$1(F, [...W], void 0, function () {
          var G = this;
          let Q =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
          return (function* () {
            var z, H, Y, X;
            const Z = yield G.disconnectLock.lock();
            try {
              if (G.state === ConnectionState.Disconnected) {
                G.log.debug("already disconnected", G.logContext);
                return;
              }
              G.log.info(
                "disconnect from room",
                Object.assign({}, G.logContext)
              ),
                (G.state === ConnectionState.Connecting ||
                  G.state === ConnectionState.Reconnecting ||
                  G.isResuming) &&
                  (G.log.warn("abort connection attempt", G.logContext),
                  (z = G.abortController) === null || z === void 0 || z.abort(),
                  (Y =
                    (H = G.connectFuture) === null || H === void 0
                      ? void 0
                      : H.reject) === null ||
                    Y === void 0 ||
                    Y.call(
                      H,
                      new ConnectionError(
                        "Client initiated disconnect",
                        ConnectionErrorReason.Cancelled
                      )
                    ),
                  (G.connectFuture = void 0)),
                (!((X = G.engine) === null || X === void 0) &&
                  X.client.isDisconnected) ||
                  (yield G.engine.client.sendLeave()),
                G.engine && (yield G.engine.close()),
                G.handleDisconnect(Q, DisconnectReason.CLIENT_INITIATED),
                (G.engine = void 0);
            } finally {
              Z();
            }
          })();
        });
      }),
      (this.onPageLeave = () =>
        __awaiter$1(this, void 0, void 0, function* () {
          this.log.info("Page leave detected, disconnecting", this.logContext),
            yield this.disconnect();
        })),
      (this.startAudio = () =>
        __awaiter$1(this, void 0, void 0, function* () {
          const $ = [],
            W = getBrowser();
          if (W && W.os === "iOS") {
            const K = "livekit-dummy-audio-el";
            let G = document.getElementById(K);
            if (!G) {
              (G = document.createElement("audio")),
                (G.id = K),
                (G.autoplay = !0),
                (G.hidden = !0);
              const Q = getEmptyAudioStreamTrack();
              Q.enabled = !0;
              const z = new MediaStream([Q]);
              (G.srcObject = z),
                document.addEventListener("visibilitychange", () => {
                  G &&
                    ((G.srcObject = document.hidden ? null : z),
                    document.hidden ||
                      (this.log.debug(
                        "page visible again, triggering startAudio to resume playback and update playback status",
                        this.logContext
                      ),
                      this.startAudio()));
                }),
                document.body.append(G),
                this.once(RoomEvent.Disconnected, () => {
                  G == null || G.remove(), (G = null);
                });
            }
            $.push(G);
          }
          this.remoteParticipants.forEach((K) => {
            K.audioTrackPublications.forEach((G) => {
              G.track &&
                G.track.attachedElements.forEach((Q) => {
                  $.push(Q);
                });
            });
          });
          try {
            yield Promise.all([
              this.acquireAudioContext(),
              ...$.map((K) => ((K.muted = !1), K.play())),
            ]),
              this.handleAudioPlaybackStarted();
          } catch (K) {
            throw (this.handleAudioPlaybackFailed(K), K);
          }
        })),
      (this.startVideo = () =>
        __awaiter$1(this, void 0, void 0, function* () {
          const $ = [];
          for (const W of this.remoteParticipants.values())
            W.videoTrackPublications.forEach((K) => {
              var G;
              (G = K.track) === null ||
                G === void 0 ||
                G.attachedElements.forEach((Q) => {
                  $.includes(Q) || $.push(Q);
                });
            });
          yield Promise.all($.map((W) => W.play()))
            .then(() => {
              this.handleVideoPlaybackStarted();
            })
            .catch((W) => {
              W.name === "NotAllowedError"
                ? this.handleVideoPlaybackFailed()
                : this.log.warn(
                    "Resuming video playback failed, make sure you call `startVideo` directly in a user gesture handler",
                    this.logContext
                  );
            });
        })),
      (this.handleRestarting = () => {
        this.clearConnectionReconcile(), (this.isResuming = !1);
        for (const $ of this.remoteParticipants.values())
          this.handleParticipantDisconnected($.identity, $);
        this.setAndEmitConnectionState(ConnectionState.Reconnecting) &&
          this.emit(RoomEvent.Reconnecting);
      }),
      (this.handleSignalRestarted = ($) =>
        __awaiter$1(this, void 0, void 0, function* () {
          this.log.debug(
            "signal reconnected to server, region ".concat($.serverRegion),
            Object.assign(Object.assign({}, this.logContext), {
              region: $.serverRegion,
            })
          ),
            (this.bufferedEvents = []),
            this.applyJoinResponse($);
          try {
            yield this.localParticipant.republishAllTracks(void 0, !0);
          } catch (W) {
            this.log.error(
              "error trying to re-publish tracks after reconnection",
              Object.assign(Object.assign({}, this.logContext), { error: W })
            );
          }
          try {
            yield this.engine.waitForRestarted(),
              this.log.debug(
                "fully reconnected to server",
                Object.assign(Object.assign({}, this.logContext), {
                  region: $.serverRegion,
                })
              );
          } catch {
            return;
          }
          this.setAndEmitConnectionState(ConnectionState.Connected),
            this.emit(RoomEvent.Reconnected),
            this.registerConnectionReconcile(),
            this.emitBufferedEvents();
        })),
      (this.handleParticipantUpdates = ($) => {
        $.forEach((W) => {
          var K;
          if (W.identity === this.localParticipant.identity) {
            this.localParticipant.updateInfo(W);
            return;
          }
          W.identity === "" &&
            (W.identity =
              (K = this.sidToIdentity.get(W.sid)) !== null && K !== void 0
                ? K
                : "");
          let G = this.remoteParticipants.get(W.identity);
          W.state === ParticipantInfo_State.DISCONNECTED
            ? this.handleParticipantDisconnected(W.identity, G)
            : (G = this.getOrCreateParticipant(W.identity, W));
        });
      }),
      (this.handleActiveSpeakersUpdate = ($) => {
        const W = [],
          K = {};
        $.forEach((G) => {
          if (((K[G.sid] = !0), G.sid === this.localParticipant.sid))
            (this.localParticipant.audioLevel = G.level),
              this.localParticipant.setIsSpeaking(!0),
              W.push(this.localParticipant);
          else {
            const Q = this.getRemoteParticipantBySid(G.sid);
            Q && ((Q.audioLevel = G.level), Q.setIsSpeaking(!0), W.push(Q));
          }
        }),
          K[this.localParticipant.sid] ||
            ((this.localParticipant.audioLevel = 0),
            this.localParticipant.setIsSpeaking(!1)),
          this.remoteParticipants.forEach((G) => {
            K[G.sid] || ((G.audioLevel = 0), G.setIsSpeaking(!1));
          }),
          (this.activeSpeakers = W),
          this.emitWhenConnected(RoomEvent.ActiveSpeakersChanged, W);
      }),
      (this.handleSpeakersChanged = ($) => {
        const W = new Map();
        this.activeSpeakers.forEach((G) => {
          const Q = this.remoteParticipants.get(G.identity);
          (Q && Q.sid !== G.sid) || W.set(G.sid, G);
        }),
          $.forEach((G) => {
            let Q = this.getRemoteParticipantBySid(G.sid);
            G.sid === this.localParticipant.sid && (Q = this.localParticipant),
              Q &&
                ((Q.audioLevel = G.level),
                Q.setIsSpeaking(G.active),
                G.active ? W.set(G.sid, Q) : W.delete(G.sid));
          });
        const K = Array.from(W.values());
        K.sort((G, Q) => Q.audioLevel - G.audioLevel),
          (this.activeSpeakers = K),
          this.emitWhenConnected(RoomEvent.ActiveSpeakersChanged, K);
      }),
      (this.handleStreamStateUpdate = ($) => {
        $.streamStates.forEach((W) => {
          const K = this.getRemoteParticipantBySid(W.participantSid);
          if (!K) return;
          const G = K.getTrackPublicationBySid(W.trackSid);
          if (!G || !G.track) return;
          const Q = Track.streamStateFromProto(W.state);
          Q !== G.track.streamState &&
            ((G.track.streamState = Q),
            K.emit(
              ParticipantEvent.TrackStreamStateChanged,
              G,
              G.track.streamState
            ),
            this.emitWhenConnected(
              RoomEvent.TrackStreamStateChanged,
              G,
              G.track.streamState,
              K
            ));
        });
      }),
      (this.handleSubscriptionPermissionUpdate = ($) => {
        const W = this.getRemoteParticipantBySid($.participantSid);
        if (!W) return;
        const K = W.getTrackPublicationBySid($.trackSid);
        K && K.setAllowed($.allowed);
      }),
      (this.handleSubscriptionError = ($) => {
        const W = Array.from(this.remoteParticipants.values()).find((G) =>
          G.trackPublications.has($.trackSid)
        );
        if (!W) return;
        const K = W.getTrackPublicationBySid($.trackSid);
        K && K.setSubscriptionError($.err);
      }),
      (this.handleDataPacket = ($) => {
        const W = this.remoteParticipants.get($.participantIdentity);
        if ($.value.case === "user")
          this.handleUserPacket(W, $.value.value, $.kind);
        else if ($.value.case === "transcription")
          this.handleTranscription(W, $.value.value);
        else if ($.value.case === "sipDtmf")
          this.handleSipDtmf(W, $.value.value);
        else if ($.value.case === "chatMessage")
          this.handleChatMessage(W, $.value.value);
        else if ($.value.case === "metrics")
          this.handleMetrics($.value.value, W);
        else if ($.value.case === "streamHeader")
          this.handleStreamHeader($.value.value, $.participantIdentity);
        else if ($.value.case === "streamChunk")
          this.handleStreamChunk($.value.value);
        else if ($.value.case === "streamTrailer")
          this.handleStreamTrailer($.value.value);
        else if ($.value.case === "rpcRequest") {
          const K = $.value.value;
          this.handleIncomingRpcRequest(
            $.participantIdentity,
            K.id,
            K.method,
            K.payload,
            K.responseTimeoutMs,
            K.version
          );
        }
      }),
      (this.handleUserPacket = ($, W, K) => {
        this.emit(RoomEvent.DataReceived, W.payload, $, K, W.topic),
          $ == null || $.emit(ParticipantEvent.DataReceived, W.payload, K);
      }),
      (this.handleSipDtmf = ($, W) => {
        this.emit(RoomEvent.SipDTMFReceived, W, $),
          $ == null || $.emit(ParticipantEvent.SipDTMFReceived, W);
      }),
      (this.bufferedSegments = new Map()),
      (this.handleTranscription = ($, W) => {
        const K =
            W.transcribedParticipantIdentity === this.localParticipant.identity
              ? this.localParticipant
              : this.getParticipantByIdentity(W.transcribedParticipantIdentity),
          G = K == null ? void 0 : K.trackPublications.get(W.trackId),
          Q = extractTranscriptionSegments(W, this.transcriptionReceivedTimes);
        G == null || G.emit(TrackEvent.TranscriptionReceived, Q),
          K == null || K.emit(ParticipantEvent.TranscriptionReceived, Q, G),
          this.emit(RoomEvent.TranscriptionReceived, Q, K, G);
      }),
      (this.handleChatMessage = ($, W) => {
        const K = extractChatMessage(W);
        this.emit(RoomEvent.ChatMessage, K, $);
      }),
      (this.handleMetrics = ($, W) => {
        this.emit(RoomEvent.MetricsReceived, $, W);
      }),
      (this.handleAudioPlaybackStarted = () => {
        this.canPlaybackAudio ||
          ((this.audioEnabled = !0),
          this.emit(RoomEvent.AudioPlaybackStatusChanged, !0));
      }),
      (this.handleAudioPlaybackFailed = ($) => {
        this.log.warn(
          "could not playback audio",
          Object.assign(Object.assign({}, this.logContext), { error: $ })
        ),
          this.canPlaybackAudio &&
            ((this.audioEnabled = !1),
            this.emit(RoomEvent.AudioPlaybackStatusChanged, !1));
      }),
      (this.handleVideoPlaybackStarted = () => {
        this.isVideoPlaybackBlocked &&
          ((this.isVideoPlaybackBlocked = !1),
          this.emit(RoomEvent.VideoPlaybackStatusChanged, !0));
      }),
      (this.handleVideoPlaybackFailed = () => {
        this.isVideoPlaybackBlocked ||
          ((this.isVideoPlaybackBlocked = !0),
          this.emit(RoomEvent.VideoPlaybackStatusChanged, !1));
      }),
      (this.handleDeviceChange = () =>
        __awaiter$1(this, void 0, void 0, function* () {
          var $, W;
          const K = DeviceManager.getInstance().previousDevices,
            G = yield DeviceManager.getInstance().getDevices(void 0, !1),
            Q = getBrowser();
          if ((Q == null ? void 0 : Q.name) === "Chrome" && Q.os !== "iOS")
            for (let H of G) {
              const Y = K.find((X) => X.deviceId === H.deviceId);
              Y &&
                Y.label !== "" &&
                Y.kind === H.kind &&
                Y.label !== H.label &&
                this.getActiveDevice(H.kind) === "default" &&
                this.emit(RoomEvent.ActiveDeviceChanged, H.kind, H.deviceId);
            }
          const z = ["audiooutput", "audioinput", "videoinput"];
          for (let H of z) {
            const Y = G.filter((Z) => Z.kind === H),
              X = this.getActiveDevice(H);
            if (
              X ===
                (($ = K.filter((Z) => Z.kind === H)[0]) === null || $ === void 0
                  ? void 0
                  : $.deviceId) &&
              Y.length > 0 &&
              ((W = Y[0]) === null || W === void 0 ? void 0 : W.deviceId) !== X
            ) {
              yield this.switchActiveDevice(H, Y[0].deviceId);
              continue;
            }
            (H === "audioinput" && !isSafari()) ||
              H === "videoinput" ||
              (Y.length > 0 &&
                !Y.find((Z) => Z.deviceId === this.getActiveDevice(H)) &&
                (yield this.switchActiveDevice(H, Y[0].deviceId)));
          }
          this.emit(RoomEvent.MediaDevicesChanged);
        })),
      (this.handleRoomUpdate = ($) => {
        const W = this.roomInfo;
        (this.roomInfo = $),
          W &&
            W.metadata !== $.metadata &&
            this.emitWhenConnected(RoomEvent.RoomMetadataChanged, $.metadata),
          (W == null ? void 0 : W.activeRecording) !== $.activeRecording &&
            this.emitWhenConnected(
              RoomEvent.RecordingStatusChanged,
              $.activeRecording
            );
      }),
      (this.handleConnectionQualityUpdate = ($) => {
        $.updates.forEach((W) => {
          if (W.participantSid === this.localParticipant.sid) {
            this.localParticipant.setConnectionQuality(W.quality);
            return;
          }
          const K = this.getRemoteParticipantBySid(W.participantSid);
          K && K.setConnectionQuality(W.quality);
        });
      }),
      (this.onLocalParticipantMetadataChanged = ($) => {
        this.emit(
          RoomEvent.ParticipantMetadataChanged,
          $,
          this.localParticipant
        );
      }),
      (this.onLocalParticipantNameChanged = ($) => {
        this.emit(RoomEvent.ParticipantNameChanged, $, this.localParticipant);
      }),
      (this.onLocalAttributesChanged = ($) => {
        this.emit(
          RoomEvent.ParticipantAttributesChanged,
          $,
          this.localParticipant
        );
      }),
      (this.onLocalTrackMuted = ($) => {
        this.emit(RoomEvent.TrackMuted, $, this.localParticipant);
      }),
      (this.onLocalTrackUnmuted = ($) => {
        this.emit(RoomEvent.TrackUnmuted, $, this.localParticipant);
      }),
      (this.onTrackProcessorUpdate = ($) => {
        var W;
        (W = $ == null ? void 0 : $.onPublish) === null ||
          W === void 0 ||
          W.call($, this);
      }),
      (this.onLocalTrackPublished = ($) =>
        __awaiter$1(this, void 0, void 0, function* () {
          var W, K, G, Q, z, H;
          (W = $.track) === null ||
            W === void 0 ||
            W.on(TrackEvent.TrackProcessorUpdate, this.onTrackProcessorUpdate),
            (K = $.track) === null ||
              K === void 0 ||
              K.on(TrackEvent.Restarted, this.onLocalTrackRestarted),
            (z =
              (Q =
                (G = $.track) === null || G === void 0
                  ? void 0
                  : G.getProcessor()) === null || Q === void 0
                ? void 0
                : Q.onPublish) === null ||
              z === void 0 ||
              z.call(Q, this),
            this.emit(RoomEvent.LocalTrackPublished, $, this.localParticipant),
            isLocalAudioTrack($.track) &&
              (yield $.track.checkForSilence()) &&
              this.emit(RoomEvent.LocalAudioSilenceDetected, $);
          const Y = yield (H = $.track) === null || H === void 0
              ? void 0
              : H.getDeviceId(!1),
            X = sourceToKind($.source);
          X &&
            Y &&
            Y !== this.localParticipant.activeDeviceMap.get(X) &&
            (this.localParticipant.activeDeviceMap.set(X, Y),
            this.emit(RoomEvent.ActiveDeviceChanged, X, Y));
        })),
      (this.onLocalTrackUnpublished = ($) => {
        var W, K;
        (W = $.track) === null ||
          W === void 0 ||
          W.off(TrackEvent.TrackProcessorUpdate, this.onTrackProcessorUpdate),
          (K = $.track) === null ||
            K === void 0 ||
            K.off(TrackEvent.Restarted, this.onLocalTrackRestarted),
          this.emit(RoomEvent.LocalTrackUnpublished, $, this.localParticipant);
      }),
      (this.onLocalTrackRestarted = ($) =>
        __awaiter$1(this, void 0, void 0, function* () {
          const W = yield $.getDeviceId(!1),
            K = sourceToKind($.source);
          K &&
            W &&
            W !== this.localParticipant.activeDeviceMap.get(K) &&
            (this.log.debug(
              "local track restarted, setting "
                .concat(K, " ")
                .concat(W, " active"),
              this.logContext
            ),
            this.localParticipant.activeDeviceMap.set(K, W),
            this.emit(RoomEvent.ActiveDeviceChanged, K, W));
        })),
      (this.onLocalConnectionQualityChanged = ($) => {
        this.emit(RoomEvent.ConnectionQualityChanged, $, this.localParticipant);
      }),
      (this.onMediaDevicesError = ($) => {
        this.emit(RoomEvent.MediaDevicesError, $);
      }),
      (this.onLocalParticipantPermissionsChanged = ($) => {
        this.emit(
          RoomEvent.ParticipantPermissionsChanged,
          $,
          this.localParticipant
        );
      }),
      (this.onLocalChatMessageSent = ($) => {
        this.emit(RoomEvent.ChatMessage, $, this.localParticipant);
      }),
      this.setMaxListeners(100),
      (this.remoteParticipants = new Map()),
      (this.sidToIdentity = new Map()),
      (this.options = Object.assign(Object.assign({}, roomOptionDefaults), U)),
      (this.log = getLogger(
        (B = this.options.loggerName) !== null && B !== void 0
          ? B
          : LoggerNames.Room
      )),
      (this.transcriptionReceivedTimes = new Map()),
      (this.options.audioCaptureDefaults = Object.assign(
        Object.assign({}, audioDefaults),
        U == null ? void 0 : U.audioCaptureDefaults
      )),
      (this.options.videoCaptureDefaults = Object.assign(
        Object.assign({}, videoDefaults),
        U == null ? void 0 : U.videoCaptureDefaults
      )),
      (this.options.publishDefaults = Object.assign(
        Object.assign({}, publishDefaults),
        U == null ? void 0 : U.publishDefaults
      )),
      this.maybeCreateEngine(),
      (this.disconnectLock = new _$1()),
      (this.localParticipant = new LocalParticipant(
        "",
        "",
        this.engine,
        this.options,
        this.rpcHandlers
      )),
      this.options.videoCaptureDefaults.deviceId &&
        this.localParticipant.activeDeviceMap.set(
          "videoinput",
          unwrapConstraint(this.options.videoCaptureDefaults.deviceId)
        ),
      this.options.audioCaptureDefaults.deviceId &&
        this.localParticipant.activeDeviceMap.set(
          "audioinput",
          unwrapConstraint(this.options.audioCaptureDefaults.deviceId)
        ),
      !((V = this.options.audioOutput) === null || V === void 0) &&
        V.deviceId &&
        this.switchActiveDevice(
          "audiooutput",
          unwrapConstraint(this.options.audioOutput.deviceId)
        ).catch(($) =>
          this.log.warn(
            "Could not set audio output: ".concat($.message),
            this.logContext
          )
        ),
      this.options.e2ee && this.setupE2EE(),
      isWeb())
    ) {
      const $ = new AbortController();
      (j = navigator.mediaDevices) === null ||
        j === void 0 ||
        j.addEventListener("devicechange", this.handleDeviceChange, {
          signal: $.signal,
        }),
        Room.cleanupRegistry &&
          Room.cleanupRegistry.register(this, () => {
            $.abort();
          });
    }
  }
  registerTextStreamHandler(U, F) {
    if (this.textStreamHandlers.has(U))
      throw new TypeError(
        'A text stream handler for topic "'.concat(U, '" has already been set.')
      );
    this.textStreamHandlers.set(U, F);
  }
  unregisterTextStreamHandler(U) {
    this.textStreamHandlers.delete(U);
  }
  registerByteStreamHandler(U, F) {
    if (this.byteStreamHandlers.has(U))
      throw new TypeError(
        'A byte stream handler for topic "'.concat(U, '" has already been set.')
      );
    this.byteStreamHandlers.set(U, F);
  }
  unregisterByteStreamHandler(U) {
    this.byteStreamHandlers.delete(U);
  }
  registerRpcMethod(U, F) {
    if (this.rpcHandlers.has(U))
      throw Error(
        "RPC handler already registered for method ".concat(
          U,
          ", unregisterRpcMethod before trying to register again"
        )
      );
    this.rpcHandlers.set(U, F);
  }
  unregisterRpcMethod(U) {
    this.rpcHandlers.delete(U);
  }
  handleIncomingRpcRequest(U, F, B, V, j, $) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if ((yield this.engine.publishRpcAck(U, F), $ !== 1)) {
        yield this.engine.publishRpcResponse(
          U,
          F,
          null,
          RpcError.builtIn("UNSUPPORTED_VERSION")
        );
        return;
      }
      const W = this.rpcHandlers.get(B);
      if (!W) {
        yield this.engine.publishRpcResponse(
          U,
          F,
          null,
          RpcError.builtIn("UNSUPPORTED_METHOD")
        );
        return;
      }
      let K = null,
        G = null;
      try {
        const Q = yield W({
          requestId: F,
          callerIdentity: U,
          payload: V,
          responseTimeout: j,
        });
        byteLength(Q) > MAX_PAYLOAD_BYTES
          ? ((K = RpcError.builtIn("RESPONSE_PAYLOAD_TOO_LARGE")),
            console.warn("RPC Response payload too large for ".concat(B)))
          : (G = Q);
      } catch (Q) {
        Q instanceof RpcError
          ? (K = Q)
          : (console.warn(
              "Uncaught error returned by RPC handler for ".concat(
                B,
                ". Returning APPLICATION_ERROR instead."
              ),
              Q
            ),
            (K = RpcError.builtIn("APPLICATION_ERROR")));
      }
      yield this.engine.publishRpcResponse(U, F, G, K);
    });
  }
  setE2EEEnabled(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (this.e2eeManager)
        yield Promise.all([this.localParticipant.setE2EEEnabled(U)]),
          this.localParticipant.identity !== "" &&
            this.e2eeManager.setParticipantCryptorEnabled(
              U,
              this.localParticipant.identity
            );
      else
        throw Error(
          "e2ee not configured, please set e2ee settings within the room options"
        );
    });
  }
  setupE2EE() {
    var U;
    this.options.e2ee &&
      ("e2eeManager" in this.options.e2ee
        ? (this.e2eeManager = this.options.e2ee.e2eeManager)
        : (this.e2eeManager = new E2EEManager(this.options.e2ee)),
      this.e2eeManager.on(
        EncryptionEvent.ParticipantEncryptionStatusChanged,
        (F, B) => {
          isLocalParticipant(B) && (this.isE2EEEnabled = F),
            this.emit(RoomEvent.ParticipantEncryptionStatusChanged, F, B);
        }
      ),
      this.e2eeManager.on(EncryptionEvent.EncryptionError, (F) =>
        this.emit(RoomEvent.EncryptionError, F)
      ),
      (U = this.e2eeManager) === null || U === void 0 || U.setup(this));
  }
  get logContext() {
    var U;
    return {
      room: this.name,
      roomID: (U = this.roomInfo) === null || U === void 0 ? void 0 : U.sid,
      participant: this.localParticipant.identity,
      pID: this.localParticipant.sid,
    };
  }
  get isRecording() {
    var U, F;
    return (F =
      (U = this.roomInfo) === null || U === void 0
        ? void 0
        : U.activeRecording) !== null && F !== void 0
      ? F
      : !1;
  }
  getSid() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.state === ConnectionState.Disconnected
        ? ""
        : this.roomInfo && this.roomInfo.sid !== ""
        ? this.roomInfo.sid
        : new Promise((U, F) => {
            const B = (V) => {
              V.sid !== "" &&
                (this.engine.off(EngineEvent.RoomUpdate, B), U(V.sid));
            };
            this.engine.on(EngineEvent.RoomUpdate, B),
              this.once(RoomEvent.Disconnected, () => {
                this.engine.off(EngineEvent.RoomUpdate, B),
                  F("Room disconnected before room server id was available");
              });
          });
    });
  }
  get name() {
    var U, F;
    return (F =
      (U = this.roomInfo) === null || U === void 0 ? void 0 : U.name) !==
      null && F !== void 0
      ? F
      : "";
  }
  get metadata() {
    var U;
    return (U = this.roomInfo) === null || U === void 0 ? void 0 : U.metadata;
  }
  get numParticipants() {
    var U, F;
    return (F =
      (U = this.roomInfo) === null || U === void 0
        ? void 0
        : U.numParticipants) !== null && F !== void 0
      ? F
      : 0;
  }
  get numPublishers() {
    var U, F;
    return (F =
      (U = this.roomInfo) === null || U === void 0
        ? void 0
        : U.numPublishers) !== null && F !== void 0
      ? F
      : 0;
  }
  maybeCreateEngine() {
    (this.engine && !this.engine.isClosed) ||
      ((this.engine = new RTCEngine(this.options)),
      this.engine
        .on(EngineEvent.ParticipantUpdate, this.handleParticipantUpdates)
        .on(EngineEvent.RoomUpdate, this.handleRoomUpdate)
        .on(EngineEvent.SpeakersChanged, this.handleSpeakersChanged)
        .on(EngineEvent.StreamStateChanged, this.handleStreamStateUpdate)
        .on(
          EngineEvent.ConnectionQualityUpdate,
          this.handleConnectionQualityUpdate
        )
        .on(EngineEvent.SubscriptionError, this.handleSubscriptionError)
        .on(
          EngineEvent.SubscriptionPermissionUpdate,
          this.handleSubscriptionPermissionUpdate
        )
        .on(EngineEvent.MediaTrackAdded, (U, F, B) => {
          this.onTrackAdded(U, F, B);
        })
        .on(EngineEvent.Disconnected, (U) => {
          this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, U);
        })
        .on(EngineEvent.ActiveSpeakersUpdate, this.handleActiveSpeakersUpdate)
        .on(EngineEvent.DataPacketReceived, this.handleDataPacket)
        .on(EngineEvent.Resuming, () => {
          this.clearConnectionReconcile(),
            (this.isResuming = !0),
            this.log.info("Resuming signal connection", this.logContext),
            this.setAndEmitConnectionState(
              ConnectionState.SignalReconnecting
            ) && this.emit(RoomEvent.SignalReconnecting);
        })
        .on(EngineEvent.Resumed, () => {
          this.registerConnectionReconcile(),
            (this.isResuming = !1),
            this.log.info("Resumed signal connection", this.logContext),
            this.updateSubscriptions(),
            this.emitBufferedEvents(),
            this.setAndEmitConnectionState(ConnectionState.Connected) &&
              this.emit(RoomEvent.Reconnected);
        })
        .on(EngineEvent.SignalResumed, () => {
          (this.bufferedEvents = []),
            (this.state === ConnectionState.Reconnecting || this.isResuming) &&
              this.sendSyncState();
        })
        .on(EngineEvent.Restarting, this.handleRestarting)
        .on(EngineEvent.SignalRestarted, this.handleSignalRestarted)
        .on(EngineEvent.Offline, () => {
          this.setAndEmitConnectionState(ConnectionState.Reconnecting) &&
            this.emit(RoomEvent.Reconnecting);
        })
        .on(EngineEvent.DCBufferStatusChanged, (U, F) => {
          this.emit(RoomEvent.DCBufferStatusChanged, U, F);
        })
        .on(EngineEvent.LocalTrackSubscribed, (U) => {
          const F = this.localParticipant.getTrackPublications().find((B) => {
            let { trackSid: V } = B;
            return V === U;
          });
          if (!F) {
            this.log.warn(
              "could not find local track subscription for subscribed event",
              this.logContext
            );
            return;
          }
          this.localParticipant.emit(ParticipantEvent.LocalTrackSubscribed, F),
            this.emitWhenConnected(
              RoomEvent.LocalTrackSubscribed,
              F,
              this.localParticipant
            );
        }),
      this.localParticipant && this.localParticipant.setupEngine(this.engine),
      this.e2eeManager && this.e2eeManager.setupEngine(this.engine));
  }
  static getLocalDevices(U) {
    let F = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
    return DeviceManager.getInstance().getDevices(U, F);
  }
  prepareConnection(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (this.state === ConnectionState.Disconnected) {
        this.log.debug("prepareConnection to ".concat(U), this.logContext);
        try {
          if (isCloud(new URL(U)) && F) {
            this.regionUrlProvider = new RegionUrlProvider(U, F);
            const B = yield this.regionUrlProvider.getNextBestRegionUrl();
            B &&
              this.state === ConnectionState.Disconnected &&
              ((this.regionUrl = B),
              yield fetch(toHttpUrl(B), { method: "HEAD" }),
              this.log.debug(
                "prepared connection to ".concat(B),
                this.logContext
              ));
          } else yield fetch(toHttpUrl(U), { method: "HEAD" });
        } catch (B) {
          this.log.warn(
            "could not prepare connection",
            Object.assign(Object.assign({}, this.logContext), { error: B })
          );
        }
      }
    });
  }
  getParticipantByIdentity(U) {
    return this.localParticipant.identity === U
      ? this.localParticipant
      : this.remoteParticipants.get(U);
  }
  clearConnectionFutures() {
    this.connectFuture = void 0;
  }
  simulateScenario(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      let B = () => {},
        V;
      switch (U) {
        case "signal-reconnect":
          yield this.engine.client.handleOnClose("simulate disconnect");
          break;
        case "speaker":
          V = new SimulateScenario({
            scenario: { case: "speakerUpdate", value: 3 },
          });
          break;
        case "node-failure":
          V = new SimulateScenario({
            scenario: { case: "nodeFailure", value: !0 },
          });
          break;
        case "server-leave":
          V = new SimulateScenario({
            scenario: { case: "serverLeave", value: !0 },
          });
          break;
        case "migration":
          V = new SimulateScenario({
            scenario: { case: "migration", value: !0 },
          });
          break;
        case "resume-reconnect":
          this.engine.failNext(),
            yield this.engine.client.handleOnClose(
              "simulate resume-disconnect"
            );
          break;
        case "disconnect-signal-on-resume":
          (B = () =>
            __awaiter$1(this, void 0, void 0, function* () {
              yield this.engine.client.handleOnClose(
                "simulate resume-disconnect"
              );
            })),
            (V = new SimulateScenario({
              scenario: { case: "disconnectSignalOnResume", value: !0 },
            }));
          break;
        case "disconnect-signal-on-resume-no-messages":
          (B = () =>
            __awaiter$1(this, void 0, void 0, function* () {
              yield this.engine.client.handleOnClose(
                "simulate resume-disconnect"
              );
            })),
            (V = new SimulateScenario({
              scenario: {
                case: "disconnectSignalOnResumeNoMessages",
                value: !0,
              },
            }));
          break;
        case "full-reconnect":
          (this.engine.fullReconnectOnNext = !0),
            yield this.engine.client.handleOnClose("simulate full-reconnect");
          break;
        case "force-tcp":
        case "force-tls":
          (V = new SimulateScenario({
            scenario: {
              case: "switchCandidateProtocol",
              value: U === "force-tls" ? 2 : 1,
            },
          })),
            (B = () =>
              __awaiter$1(this, void 0, void 0, function* () {
                const j = this.engine.client.onLeave;
                j &&
                  j(
                    new LeaveRequest({
                      reason: DisconnectReason.CLIENT_INITIATED,
                      action: LeaveRequest_Action.RECONNECT,
                    })
                  );
              }));
          break;
        case "subscriber-bandwidth":
          if (F === void 0 || typeof F != "number")
            throw new Error(
              "subscriber-bandwidth requires a number as argument"
            );
          V = new SimulateScenario({
            scenario: { case: "subscriberBandwidth", value: numberToBigInt(F) },
          });
          break;
        case "leave-full-reconnect":
          V = new SimulateScenario({
            scenario: { case: "leaveRequestFullReconnect", value: !0 },
          });
      }
      V && (yield this.engine.client.sendSimulateScenario(V), yield B());
    });
  }
  get canPlaybackAudio() {
    return this.audioEnabled;
  }
  get canPlaybackVideo() {
    return !this.isVideoPlaybackBlocked;
  }
  getActiveDevice(U) {
    return this.localParticipant.activeDeviceMap.get(U);
  }
  switchActiveDevice(U, F) {
    return __awaiter$1(this, arguments, void 0, function (B, V) {
      var j = this;
      let $ =
        arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
      return (function* () {
        var W, K, G, Q, z, H, Y, X;
        let Z = !0,
          ie = !1;
        const ee = $ ? { exact: V } : V;
        if (B === "audioinput") {
          ie = j.localParticipant.audioTrackPublications.size === 0;
          const te =
            (W = j.getActiveDevice(B)) !== null && W !== void 0
              ? W
              : j.options.audioCaptureDefaults.deviceId;
          j.options.audioCaptureDefaults.deviceId = ee;
          const re = Array.from(
            j.localParticipant.audioTrackPublications.values()
          ).filter((ne) => ne.source === Track.Source.Microphone);
          try {
            Z = (yield Promise.all(
              re.map((ne) => {
                var se;
                return (se = ne.audioTrack) === null || se === void 0
                  ? void 0
                  : se.setDeviceId(ee);
              })
            )).every((ne) => ne === !0);
          } catch (ne) {
            throw ((j.options.audioCaptureDefaults.deviceId = te), ne);
          }
        } else if (B === "videoinput") {
          ie = j.localParticipant.videoTrackPublications.size === 0;
          const te =
            (K = j.getActiveDevice(B)) !== null && K !== void 0
              ? K
              : j.options.videoCaptureDefaults.deviceId;
          j.options.videoCaptureDefaults.deviceId = ee;
          const re = Array.from(
            j.localParticipant.videoTrackPublications.values()
          ).filter((ne) => ne.source === Track.Source.Camera);
          try {
            Z = (yield Promise.all(
              re.map((ne) => {
                var se;
                return (se = ne.videoTrack) === null || se === void 0
                  ? void 0
                  : se.setDeviceId(ee);
              })
            )).every((ne) => ne === !0);
          } catch (ne) {
            throw ((j.options.videoCaptureDefaults.deviceId = te), ne);
          }
        } else if (B === "audiooutput") {
          if (
            (!supportsSetSinkId() && !j.options.webAudioMix) ||
            (j.options.webAudioMix &&
              j.audioContext &&
              !("setSinkId" in j.audioContext))
          )
            throw new Error(
              "cannot switch audio output, setSinkId not supported"
            );
          j.options.webAudioMix &&
            (V =
              (G = yield DeviceManager.getInstance().normalizeDeviceId(
                "audiooutput",
                V
              )) !== null && G !== void 0
                ? G
                : ""),
            ((Q = (X = j.options).audioOutput) !== null && Q !== void 0) ||
              (X.audioOutput = {});
          const te =
            (z = j.getActiveDevice(B)) !== null && z !== void 0
              ? z
              : j.options.audioOutput.deviceId;
          j.options.audioOutput.deviceId = V;
          try {
            j.options.webAudioMix &&
              ((H = j.audioContext) === null || H === void 0 || H.setSinkId(V)),
              yield Promise.all(
                Array.from(j.remoteParticipants.values()).map((re) =>
                  re.setAudioOutput({ deviceId: V })
                )
              );
          } catch (re) {
            throw ((j.options.audioOutput.deviceId = te), re);
          }
        }
        return (
          (ie || B === "audiooutput") &&
            (j.localParticipant.activeDeviceMap.set(
              B,
              (B === "audiooutput" &&
                ((Y = j.options.audioOutput) === null || Y === void 0
                  ? void 0
                  : Y.deviceId)) ||
                V
            ),
            j.emit(RoomEvent.ActiveDeviceChanged, B, V)),
          Z
        );
      })();
    });
  }
  setupLocalParticipantEvents() {
    this.localParticipant
      .on(
        ParticipantEvent.ParticipantMetadataChanged,
        this.onLocalParticipantMetadataChanged
      )
      .on(
        ParticipantEvent.ParticipantNameChanged,
        this.onLocalParticipantNameChanged
      )
      .on(ParticipantEvent.AttributesChanged, this.onLocalAttributesChanged)
      .on(ParticipantEvent.TrackMuted, this.onLocalTrackMuted)
      .on(ParticipantEvent.TrackUnmuted, this.onLocalTrackUnmuted)
      .on(ParticipantEvent.LocalTrackPublished, this.onLocalTrackPublished)
      .on(ParticipantEvent.LocalTrackUnpublished, this.onLocalTrackUnpublished)
      .on(
        ParticipantEvent.ConnectionQualityChanged,
        this.onLocalConnectionQualityChanged
      )
      .on(ParticipantEvent.MediaDevicesError, this.onMediaDevicesError)
      .on(ParticipantEvent.AudioStreamAcquired, this.startAudio)
      .on(ParticipantEvent.ChatMessage, this.onLocalChatMessageSent)
      .on(
        ParticipantEvent.ParticipantPermissionsChanged,
        this.onLocalParticipantPermissionsChanged
      );
  }
  recreateEngine() {
    var U;
    (U = this.engine) === null || U === void 0 || U.close(),
      (this.engine = void 0),
      (this.isResuming = !1),
      this.remoteParticipants.clear(),
      this.sidToIdentity.clear(),
      (this.bufferedEvents = []),
      this.maybeCreateEngine();
  }
  onTrackAdded(U, F, B) {
    if (
      this.state === ConnectionState.Connecting ||
      this.state === ConnectionState.Reconnecting
    ) {
      const Q = () => {
          this.onTrackAdded(U, F, B), z();
        },
        z = () => {
          this.off(RoomEvent.Reconnected, Q),
            this.off(RoomEvent.Connected, Q),
            this.off(RoomEvent.Disconnected, z);
        };
      this.once(RoomEvent.Reconnected, Q),
        this.once(RoomEvent.Connected, Q),
        this.once(RoomEvent.Disconnected, z);
      return;
    }
    if (this.state === ConnectionState.Disconnected) {
      this.log.warn(
        "skipping incoming track after Room disconnected",
        this.logContext
      );
      return;
    }
    if (U.readyState === "ended") {
      this.log.info(
        "skipping incoming track as it already ended",
        this.logContext
      );
      return;
    }
    const V = unpackStreamId(F.id),
      j = V[0];
    let $ = V[1],
      W = U.id;
    if (($ && $.startsWith("TR") && (W = $), j === this.localParticipant.sid)) {
      this.log.warn(
        "tried to create RemoteParticipant for local participant",
        this.logContext
      );
      return;
    }
    const K = Array.from(this.remoteParticipants.values()).find(
      (Q) => Q.sid === j
    );
    if (!K) {
      this.log.error(
        "Tried to add a track for a participant, that's not present. Sid: ".concat(
          j
        ),
        this.logContext
      );
      return;
    }
    let G;
    this.options.adaptiveStream &&
      (typeof this.options.adaptiveStream == "object"
        ? (G = this.options.adaptiveStream)
        : (G = {})),
      K.addSubscribedMediaTrack(U, W, F, B, G);
  }
  handleDisconnect() {
    let U = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0,
      F = arguments.length > 1 ? arguments[1] : void 0;
    var B;
    if (
      (this.clearConnectionReconcile(),
      (this.isResuming = !1),
      (this.bufferedEvents = []),
      this.transcriptionReceivedTimes.clear(),
      this.state !== ConnectionState.Disconnected)
    ) {
      this.regionUrl = void 0;
      try {
        this.remoteParticipants.forEach((V) => {
          V.trackPublications.forEach((j) => {
            V.unpublishTrack(j.trackSid);
          });
        }),
          this.localParticipant.trackPublications.forEach((V) => {
            var j, $, W;
            V.track && this.localParticipant.unpublishTrack(V.track, U),
              U
                ? ((j = V.track) === null || j === void 0 || j.detach(),
                  ($ = V.track) === null || $ === void 0 || $.stop())
                : (W = V.track) === null || W === void 0 || W.stopMonitor();
          }),
          this.localParticipant
            .off(
              ParticipantEvent.ParticipantMetadataChanged,
              this.onLocalParticipantMetadataChanged
            )
            .off(
              ParticipantEvent.ParticipantNameChanged,
              this.onLocalParticipantNameChanged
            )
            .off(
              ParticipantEvent.AttributesChanged,
              this.onLocalAttributesChanged
            )
            .off(ParticipantEvent.TrackMuted, this.onLocalTrackMuted)
            .off(ParticipantEvent.TrackUnmuted, this.onLocalTrackUnmuted)
            .off(
              ParticipantEvent.LocalTrackPublished,
              this.onLocalTrackPublished
            )
            .off(
              ParticipantEvent.LocalTrackUnpublished,
              this.onLocalTrackUnpublished
            )
            .off(
              ParticipantEvent.ConnectionQualityChanged,
              this.onLocalConnectionQualityChanged
            )
            .off(ParticipantEvent.MediaDevicesError, this.onMediaDevicesError)
            .off(ParticipantEvent.AudioStreamAcquired, this.startAudio)
            .off(ParticipantEvent.ChatMessage, this.onLocalChatMessageSent)
            .off(
              ParticipantEvent.ParticipantPermissionsChanged,
              this.onLocalParticipantPermissionsChanged
            ),
          this.localParticipant.trackPublications.clear(),
          this.localParticipant.videoTrackPublications.clear(),
          this.localParticipant.audioTrackPublications.clear(),
          this.remoteParticipants.clear(),
          this.sidToIdentity.clear(),
          (this.activeSpeakers = []),
          this.audioContext &&
            typeof this.options.webAudioMix == "boolean" &&
            (this.audioContext.close(), (this.audioContext = void 0)),
          isWeb() &&
            (window.removeEventListener("beforeunload", this.onPageLeave),
            window.removeEventListener("pagehide", this.onPageLeave),
            window.removeEventListener("freeze", this.onPageLeave),
            (B = navigator.mediaDevices) === null ||
              B === void 0 ||
              B.removeEventListener("devicechange", this.handleDeviceChange));
      } finally {
        this.setAndEmitConnectionState(ConnectionState.Disconnected),
          this.emit(RoomEvent.Disconnected, F);
      }
    }
  }
  handleParticipantDisconnected(U, F) {
    var B;
    this.remoteParticipants.delete(U),
      F &&
        (F.trackPublications.forEach((V) => {
          F.unpublishTrack(V.trackSid, !0);
        }),
        this.emit(RoomEvent.ParticipantDisconnected, F),
        (B = this.localParticipant) === null ||
          B === void 0 ||
          B.handleParticipantDisconnected(F.identity));
  }
  handleStreamHeader(U, F) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var B;
      if (U.contentHeader.case === "byteHeader") {
        const V = this.byteStreamHandlers.get(U.topic);
        if (!V) {
          this.log.debug(
            "ignoring incoming byte stream due to no handler for topic",
            U.topic
          );
          return;
        }
        let j;
        const $ = {
            id: U.streamId,
            name:
              (B = U.contentHeader.value.name) !== null && B !== void 0
                ? B
                : "unknown",
            mimeType: U.mimeType,
            size: U.totalLength ? Number(U.totalLength) : void 0,
            topic: U.topic,
            timestamp: bigIntToNumber(U.timestamp),
            attributes: U.attributes,
          },
          W = new ReadableStream({
            start: (K) => {
              (j = K),
                this.byteStreamControllers.set(U.streamId, {
                  info: $,
                  controller: j,
                  startTime: Date.now(),
                });
            },
          });
        V(new ByteStreamReader($, W, bigIntToNumber(U.totalLength)), {
          identity: F,
        });
      } else if (U.contentHeader.case === "textHeader") {
        const V = this.textStreamHandlers.get(U.topic);
        if (!V) {
          this.log.debug(
            "ignoring incoming text stream due to no handler for topic",
            U.topic
          );
          return;
        }
        let j;
        const $ = {
            id: U.streamId,
            mimeType: U.mimeType,
            size: U.totalLength ? Number(U.totalLength) : void 0,
            topic: U.topic,
            timestamp: Number(U.timestamp),
            attributes: U.attributes,
          },
          W = new ReadableStream({
            start: (K) => {
              (j = K),
                this.textStreamControllers.set(U.streamId, {
                  info: $,
                  controller: j,
                  startTime: Date.now(),
                });
            },
          });
        V(new TextStreamReader($, W, bigIntToNumber(U.totalLength)), {
          identity: F,
        });
      }
    });
  }
  handleStreamChunk(U) {
    const F = this.byteStreamControllers.get(U.streamId);
    F && U.content.length > 0 && F.controller.enqueue(U);
    const B = this.textStreamControllers.get(U.streamId);
    B && U.content.length > 0 && B.controller.enqueue(U);
  }
  handleStreamTrailer(U) {
    const F = this.textStreamControllers.get(U.streamId);
    F &&
      ((F.info.attributes = Object.assign(
        Object.assign({}, F.info.attributes),
        U.attributes
      )),
      F.controller.close(),
      this.textStreamControllers.delete(U.streamId));
    const B = this.byteStreamControllers.get(U.streamId);
    B &&
      ((B.info.attributes = Object.assign(
        Object.assign({}, B.info.attributes),
        U.attributes
      )),
      B.controller.close(),
      this.byteStreamControllers.delete(U.streamId));
  }
  acquireAudioContext() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U, F;
      if (
        (typeof this.options.webAudioMix != "boolean" &&
        this.options.webAudioMix.audioContext
          ? (this.audioContext = this.options.webAudioMix.audioContext)
          : (!this.audioContext || this.audioContext.state === "closed") &&
            (this.audioContext =
              (U = getNewAudioContext()) !== null && U !== void 0 ? U : void 0),
        this.options.webAudioMix &&
          this.remoteParticipants.forEach((V) =>
            V.setAudioContext(this.audioContext)
          ),
        this.localParticipant.setAudioContext(this.audioContext),
        this.audioContext && this.audioContext.state === "suspended")
      )
        try {
          yield Promise.race([this.audioContext.resume(), sleep$1(200)]);
        } catch (V) {
          this.log.warn(
            "Could not resume audio context",
            Object.assign(Object.assign({}, this.logContext), { error: V })
          );
        }
      const B =
        ((F = this.audioContext) === null || F === void 0
          ? void 0
          : F.state) === "running";
      B !== this.canPlaybackAudio &&
        ((this.audioEnabled = B),
        this.emit(RoomEvent.AudioPlaybackStatusChanged, B));
    });
  }
  createParticipant(U, F) {
    var B;
    let V;
    return (
      F
        ? (V = RemoteParticipant.fromParticipantInfo(this.engine.client, F, {
            loggerContextCb: () => this.logContext,
            loggerName: this.options.loggerName,
          }))
        : (V = new RemoteParticipant(
            this.engine.client,
            "",
            U,
            void 0,
            void 0,
            void 0,
            {
              loggerContextCb: () => this.logContext,
              loggerName: this.options.loggerName,
            }
          )),
      this.options.webAudioMix && V.setAudioContext(this.audioContext),
      !((B = this.options.audioOutput) === null || B === void 0) &&
        B.deviceId &&
        V.setAudioOutput(this.options.audioOutput).catch((j) =>
          this.log.warn(
            "Could not set audio output: ".concat(j.message),
            this.logContext
          )
        ),
      V
    );
  }
  getOrCreateParticipant(U, F) {
    if (this.remoteParticipants.has(U)) {
      const V = this.remoteParticipants.get(U);
      return (
        F && V.updateInfo(F) && this.sidToIdentity.set(F.sid, F.identity), V
      );
    }
    const B = this.createParticipant(U, F);
    return (
      this.remoteParticipants.set(U, B),
      this.sidToIdentity.set(F.sid, F.identity),
      this.emitWhenConnected(RoomEvent.ParticipantConnected, B),
      B.on(ParticipantEvent.TrackPublished, (V) => {
        this.emitWhenConnected(RoomEvent.TrackPublished, V, B);
      })
        .on(ParticipantEvent.TrackSubscribed, (V, j) => {
          V.kind === Track.Kind.Audio
            ? (V.on(
                TrackEvent.AudioPlaybackStarted,
                this.handleAudioPlaybackStarted
              ),
              V.on(
                TrackEvent.AudioPlaybackFailed,
                this.handleAudioPlaybackFailed
              ))
            : V.kind === Track.Kind.Video &&
              (V.on(
                TrackEvent.VideoPlaybackFailed,
                this.handleVideoPlaybackFailed
              ),
              V.on(
                TrackEvent.VideoPlaybackStarted,
                this.handleVideoPlaybackStarted
              )),
            this.emit(RoomEvent.TrackSubscribed, V, j, B);
        })
        .on(ParticipantEvent.TrackUnpublished, (V) => {
          this.emit(RoomEvent.TrackUnpublished, V, B);
        })
        .on(ParticipantEvent.TrackUnsubscribed, (V, j) => {
          this.emit(RoomEvent.TrackUnsubscribed, V, j, B);
        })
        .on(ParticipantEvent.TrackMuted, (V) => {
          this.emitWhenConnected(RoomEvent.TrackMuted, V, B);
        })
        .on(ParticipantEvent.TrackUnmuted, (V) => {
          this.emitWhenConnected(RoomEvent.TrackUnmuted, V, B);
        })
        .on(ParticipantEvent.ParticipantMetadataChanged, (V) => {
          this.emitWhenConnected(RoomEvent.ParticipantMetadataChanged, V, B);
        })
        .on(ParticipantEvent.ParticipantNameChanged, (V) => {
          this.emitWhenConnected(RoomEvent.ParticipantNameChanged, V, B);
        })
        .on(ParticipantEvent.AttributesChanged, (V) => {
          this.emitWhenConnected(RoomEvent.ParticipantAttributesChanged, V, B);
        })
        .on(ParticipantEvent.ConnectionQualityChanged, (V) => {
          this.emitWhenConnected(RoomEvent.ConnectionQualityChanged, V, B);
        })
        .on(ParticipantEvent.ParticipantPermissionsChanged, (V) => {
          this.emitWhenConnected(RoomEvent.ParticipantPermissionsChanged, V, B);
        })
        .on(ParticipantEvent.TrackSubscriptionStatusChanged, (V, j) => {
          this.emitWhenConnected(
            RoomEvent.TrackSubscriptionStatusChanged,
            V,
            j,
            B
          );
        })
        .on(ParticipantEvent.TrackSubscriptionFailed, (V, j) => {
          this.emit(RoomEvent.TrackSubscriptionFailed, V, B, j);
        })
        .on(ParticipantEvent.TrackSubscriptionPermissionChanged, (V, j) => {
          this.emitWhenConnected(
            RoomEvent.TrackSubscriptionPermissionChanged,
            V,
            j,
            B
          );
        }),
      F && B.updateInfo(F),
      B
    );
  }
  sendSyncState() {
    const U = Array.from(this.remoteParticipants.values()).reduce(
        (B, V) => (B.push(...V.getTrackPublications()), B),
        []
      ),
      F = this.localParticipant.getTrackPublications();
    this.engine.sendSyncState(U, F);
  }
  updateSubscriptions() {
    for (const U of this.remoteParticipants.values())
      for (const F of U.videoTrackPublications.values())
        F.isSubscribed && isRemotePub(F) && F.emitTrackUpdate();
  }
  getRemoteParticipantBySid(U) {
    const F = this.sidToIdentity.get(U);
    if (F) return this.remoteParticipants.get(F);
  }
  registerConnectionReconcile() {
    this.clearConnectionReconcile();
    let U = 0;
    this.connectionReconcileInterval = CriticalTimers.setInterval(() => {
      !this.engine || this.engine.isClosed || !this.engine.verifyTransport()
        ? (U++,
          this.log.warn(
            "detected connection state mismatch",
            Object.assign(Object.assign({}, this.logContext), {
              numFailures: U,
              engine: this.engine
                ? {
                    closed: this.engine.isClosed,
                    transportsConnected: this.engine.verifyTransport(),
                  }
                : void 0,
            })
          ),
          U >= 3 &&
            (this.recreateEngine(),
            this.handleDisconnect(
              this.options.stopLocalTrackOnUnpublish,
              DisconnectReason.STATE_MISMATCH
            )))
        : (U = 0);
    }, connectionReconcileFrequency);
  }
  clearConnectionReconcile() {
    this.connectionReconcileInterval &&
      CriticalTimers.clearInterval(this.connectionReconcileInterval);
  }
  setAndEmitConnectionState(U) {
    return U === this.state
      ? !1
      : ((this.state = U),
        this.emit(RoomEvent.ConnectionStateChanged, this.state),
        !0);
  }
  emitBufferedEvents() {
    this.bufferedEvents.forEach((U) => {
      let [F, B] = U;
      this.emit(F, ...B);
    }),
      (this.bufferedEvents = []);
  }
  emitWhenConnected(U) {
    for (
      var F = arguments.length, B = new Array(F > 1 ? F - 1 : 0), V = 1;
      V < F;
      V++
    )
      B[V - 1] = arguments[V];
    if (
      this.state === ConnectionState.Reconnecting ||
      this.isResuming ||
      !this.engine ||
      this.engine.pendingReconnect
    )
      this.bufferedEvents.push([U, B]);
    else if (this.state === ConnectionState.Connected)
      return this.emit(U, ...B);
    return !1;
  }
  simulateParticipants(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F, B;
      const V = Object.assign(
          { audio: !0, video: !0, useRealTracks: !1 },
          U.publish
        ),
        j = Object.assign(
          { count: 9, audio: !1, video: !0, aspectRatios: [1.66, 1.7, 1.3] },
          U.participants
        );
      if (
        (this.handleDisconnect(),
        (this.roomInfo = new Room$1({
          sid: "RM_SIMULATED",
          name: "simulated-room",
          emptyTimeout: 0,
          maxParticipants: 0,
          creationTime: protoInt64.parse(new Date().getTime()),
          metadata: "",
          numParticipants: 1,
          numPublishers: 1,
          turnPassword: "",
          enabledCodecs: [],
          activeRecording: !1,
        })),
        this.localParticipant.updateInfo(
          new ParticipantInfo({
            identity: "simulated-local",
            name: "local-name",
          })
        ),
        this.setupLocalParticipantEvents(),
        this.emit(RoomEvent.SignalConnected),
        this.emit(RoomEvent.Connected),
        this.setAndEmitConnectionState(ConnectionState.Connected),
        V.video)
      ) {
        const $ = new LocalTrackPublication(
          Track.Kind.Video,
          new TrackInfo({
            source: TrackSource.CAMERA,
            sid: Math.floor(Math.random() * 1e4).toString(),
            type: TrackType.AUDIO,
            name: "video-dummy",
          }),
          new LocalVideoTrack(
            V.useRealTracks
              ? (yield window.navigator.mediaDevices.getUserMedia({
                  video: !0,
                })).getVideoTracks()[0]
              : createDummyVideoStreamTrack(
                  160 *
                    ((F = j.aspectRatios[0]) !== null && F !== void 0 ? F : 1),
                  160,
                  !0,
                  !0
                ),
            void 0,
            !1,
            {
              loggerName: this.options.loggerName,
              loggerContextCb: () => this.logContext,
            }
          ),
          {
            loggerName: this.options.loggerName,
            loggerContextCb: () => this.logContext,
          }
        );
        this.localParticipant.addTrackPublication($),
          this.localParticipant.emit(ParticipantEvent.LocalTrackPublished, $);
      }
      if (V.audio) {
        const $ = new LocalTrackPublication(
          Track.Kind.Audio,
          new TrackInfo({
            source: TrackSource.MICROPHONE,
            sid: Math.floor(Math.random() * 1e4).toString(),
            type: TrackType.AUDIO,
          }),
          new LocalAudioTrack(
            V.useRealTracks
              ? (yield navigator.mediaDevices.getUserMedia({
                  audio: !0,
                })).getAudioTracks()[0]
              : getEmptyAudioStreamTrack(),
            void 0,
            !1,
            this.audioContext,
            {
              loggerName: this.options.loggerName,
              loggerContextCb: () => this.logContext,
            }
          ),
          {
            loggerName: this.options.loggerName,
            loggerContextCb: () => this.logContext,
          }
        );
        this.localParticipant.addTrackPublication($),
          this.localParticipant.emit(ParticipantEvent.LocalTrackPublished, $);
      }
      for (let $ = 0; $ < j.count - 1; $ += 1) {
        let W = new ParticipantInfo({
          sid: Math.floor(Math.random() * 1e4).toString(),
          identity: "simulated-".concat($),
          state: ParticipantInfo_State.ACTIVE,
          tracks: [],
          joinedAt: protoInt64.parse(Date.now()),
        });
        const K = this.getOrCreateParticipant(W.identity, W);
        if (j.video) {
          const G = createDummyVideoStreamTrack(
              160 *
                ((B = j.aspectRatios[$ % j.aspectRatios.length]) !== null &&
                B !== void 0
                  ? B
                  : 1),
              160,
              !1,
              !0
            ),
            Q = new TrackInfo({
              source: TrackSource.CAMERA,
              sid: Math.floor(Math.random() * 1e4).toString(),
              type: TrackType.AUDIO,
            });
          K.addSubscribedMediaTrack(
            G,
            Q.sid,
            new MediaStream([G]),
            new RTCRtpReceiver()
          ),
            (W.tracks = [...W.tracks, Q]);
        }
        if (j.audio) {
          const G = getEmptyAudioStreamTrack(),
            Q = new TrackInfo({
              source: TrackSource.MICROPHONE,
              sid: Math.floor(Math.random() * 1e4).toString(),
              type: TrackType.AUDIO,
            });
          K.addSubscribedMediaTrack(
            G,
            Q.sid,
            new MediaStream([G]),
            new RTCRtpReceiver()
          ),
            (W.tracks = [...W.tracks, Q]);
        }
        K.updateInfo(W);
      }
    });
  }
  emit(U) {
    for (
      var F = arguments.length, B = new Array(F > 1 ? F - 1 : 0), V = 1;
      V < F;
      V++
    )
      B[V - 1] = arguments[V];
    if (
      U !== RoomEvent.ActiveSpeakersChanged &&
      U !== RoomEvent.TranscriptionReceived
    ) {
      const j = mapArgs(B).filter(($) => $ !== void 0);
      this.log.debug(
        "room event ".concat(U),
        Object.assign(Object.assign({}, this.logContext), { event: U, args: j })
      );
    }
    return super.emit(U, ...B);
  }
}
Room.cleanupRegistry =
  typeof FinalizationRegistry < "u" &&
  new FinalizationRegistry((q) => {
    q();
  });
function mapArgs(q) {
  return q.map((U) => {
    if (U)
      return Array.isArray(U)
        ? mapArgs(U)
        : typeof U == "object"
        ? "logContext" in U
          ? U.logContext
          : void 0
        : U;
  });
}
var CheckStatus;
(function (q) {
  (q[(q.IDLE = 0)] = "IDLE"),
    (q[(q.RUNNING = 1)] = "RUNNING"),
    (q[(q.SKIPPED = 2)] = "SKIPPED"),
    (q[(q.SUCCESS = 3)] = "SUCCESS"),
    (q[(q.FAILED = 4)] = "FAILED");
})(CheckStatus || (CheckStatus = {}));
class Checker extends eventsExports.EventEmitter {
  constructor(U, F) {
    let B = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    super(),
      (this.status = CheckStatus.IDLE),
      (this.logs = []),
      (this.options = {}),
      (this.url = U),
      (this.token = F),
      (this.name = this.constructor.name),
      (this.room = new Room(B.roomOptions)),
      (this.connectOptions = B.connectOptions),
      (this.options = B);
  }
  run(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      if (this.status !== CheckStatus.IDLE)
        throw Error("check is running already");
      this.setStatus(CheckStatus.RUNNING);
      try {
        yield this.perform();
      } catch (F) {
        F instanceof Error &&
          (this.options.errorsAsWarnings
            ? this.appendWarning(F.message)
            : this.appendError(F.message));
      }
      return (
        yield this.disconnect(),
        yield new Promise((F) => setTimeout(F, 500)),
        this.status !== CheckStatus.SKIPPED &&
          this.setStatus(
            this.isSuccess() ? CheckStatus.SUCCESS : CheckStatus.FAILED
          ),
        U && U(),
        this.getInfo()
      );
    });
  }
  isSuccess() {
    return !this.logs.some((U) => U.level === "error");
  }
  connect(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.room.state === ConnectionState.Connected
        ? this.room
        : (U || (U = this.url),
          yield this.room.connect(U, this.token, this.connectOptions),
          this.room);
    });
  }
  disconnect() {
    return __awaiter$1(this, void 0, void 0, function* () {
      this.room &&
        this.room.state !== ConnectionState.Disconnected &&
        (yield this.room.disconnect(),
        yield new Promise((U) => setTimeout(U, 500)));
    });
  }
  skip() {
    this.setStatus(CheckStatus.SKIPPED);
  }
  switchProtocol(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      let F = !1,
        B = !1;
      if (
        (this.room.on(RoomEvent.Reconnecting, () => {
          F = !0;
        }),
        this.room.once(RoomEvent.Reconnected, () => {
          B = !0;
        }),
        this.room.simulateScenario("force-".concat(U)),
        yield new Promise((j) => setTimeout(j, 1e3)),
        !F)
      )
        return;
      const V = Date.now() + 1e4;
      for (; Date.now() < V; ) {
        if (B) return;
        yield sleep$1(100);
      }
      throw new Error(
        "Could not reconnect using ".concat(U, " protocol after 10 seconds")
      );
    });
  }
  appendMessage(U) {
    this.logs.push({ level: "info", message: U }),
      this.emit("update", this.getInfo());
  }
  appendWarning(U) {
    this.logs.push({ level: "warning", message: U }),
      this.emit("update", this.getInfo());
  }
  appendError(U) {
    this.logs.push({ level: "error", message: U }),
      this.emit("update", this.getInfo());
  }
  setStatus(U) {
    (this.status = U), this.emit("update", this.getInfo());
  }
  get engine() {
    var U;
    return (U = this.room) === null || U === void 0 ? void 0 : U.engine;
  }
  getInfo() {
    return {
      logs: this.logs,
      name: this.name,
      status: this.status,
      description: this.description,
    };
  }
}
class CloudRegionCheck extends Checker {
  get description() {
    return "Cloud regions";
  }
  perform() {
    return __awaiter$1(this, void 0, void 0, function* () {
      const U = new RegionUrlProvider(this.url, this.token);
      if (!U.isCloud()) {
        this.skip();
        return;
      }
      const F = [],
        B = new Set();
      for (let j = 0; j < 3; j++) {
        const $ = yield U.getNextBestRegionUrl();
        if (!$) break;
        if (B.has($)) continue;
        B.add($);
        const W = yield this.checkCloudRegion($);
        this.appendMessage(
          ""
            .concat(W.region, " RTT: ")
            .concat(W.rtt, "ms, duration: ")
            .concat(W.duration, "ms")
        ),
          F.push(W);
      }
      F.sort((j, $) => (j.duration - $.duration) * 0.5 + (j.rtt - $.rtt) * 0.5);
      const V = F[0];
      (this.bestStats = V),
        this.appendMessage("best Cloud region: ".concat(V.region));
    });
  }
  getInfo() {
    const U = super.getInfo();
    return (U.data = this.bestStats), U;
  }
  checkCloudRegion(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      var F, B;
      yield this.connect(U),
        this.options.protocol === "tcp" && (yield this.switchProtocol("tcp"));
      const V =
        (F = this.room.serverInfo) === null || F === void 0 ? void 0 : F.region;
      if (!V) throw new Error("Region not found");
      const j = yield this.room.localParticipant.streamText({ topic: "test" }),
        $ = 1e3,
        K = 1e6 / $,
        G = "A".repeat($),
        Q = Date.now();
      for (let X = 0; X < K; X++) yield j.write(G);
      yield j.close();
      const z = Date.now(),
        H = yield (B = this.room.engine.pcManager) === null || B === void 0
          ? void 0
          : B.publisher.getStats(),
        Y = { region: V, rtt: 1e4, duration: z - Q };
      return (
        H == null ||
          H.forEach((X) => {
            X.type === "candidate-pair" &&
              X.nominated &&
              (Y.rtt = X.currentRoundTripTime * 1e3);
          }),
        yield this.disconnect(),
        Y
      );
    });
  }
}
const TEST_DURATION = 1e4;
class ConnectionProtocolCheck extends Checker {
  get description() {
    return "Connection via UDP vs TCP";
  }
  perform() {
    return __awaiter$1(this, void 0, void 0, function* () {
      const U = yield this.checkConnectionProtocol("udp"),
        F = yield this.checkConnectionProtocol("tcp");
      (this.bestStats = U),
        U.qualityLimitationDurations.bandwidth -
          F.qualityLimitationDurations.bandwidth >
          0.5 || (U.packetsLost - F.packetsLost) / U.packetsSent > 0.01
          ? (this.appendMessage("best connection quality via tcp"),
            (this.bestStats = F))
          : this.appendMessage("best connection quality via udp");
      const B = this.bestStats;
      this.appendMessage(
        "upstream bitrate: ".concat(
          (B.bitrateTotal / B.count / 1e3 / 1e3).toFixed(2),
          " mbps"
        )
      ),
        this.appendMessage(
          "RTT: ".concat(((B.rttTotal / B.count) * 1e3).toFixed(2), " ms")
        ),
        this.appendMessage(
          "jitter: ".concat(((B.jitterTotal / B.count) * 1e3).toFixed(2), " ms")
        ),
        B.packetsLost > 0 &&
          this.appendWarning(
            "packets lost: ".concat(
              ((B.packetsLost / B.packetsSent) * 100).toFixed(2),
              "%"
            )
          ),
        B.qualityLimitationDurations.bandwidth > 1 &&
          this.appendWarning(
            "bandwidth limited ".concat(
              (
                (B.qualityLimitationDurations.bandwidth /
                  (TEST_DURATION / 1e3)) *
                100
              ).toFixed(2),
              "%"
            )
          ),
        B.qualityLimitationDurations.cpu > 0 &&
          this.appendWarning(
            "cpu limited ".concat(
              (
                (B.qualityLimitationDurations.cpu / (TEST_DURATION / 1e3)) *
                100
              ).toFixed(2),
              "%"
            )
          );
    });
  }
  getInfo() {
    const U = super.getInfo();
    return (U.data = this.bestStats), U;
  }
  checkConnectionProtocol(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      yield this.connect(),
        U === "tcp"
          ? yield this.switchProtocol("tcp")
          : yield this.switchProtocol("udp");
      const F = document.createElement("canvas");
      (F.width = 1280), (F.height = 720);
      const B = F.getContext("2d");
      if (!B) throw new Error("Could not get canvas context");
      let V = 0;
      const j = () => {
        (V = (V + 1) % 360),
          (B.fillStyle = "hsl(".concat(V, ", 100%, 50%)")),
          B.fillRect(0, 0, F.width, F.height),
          requestAnimationFrame(j);
      };
      j();
      const W = F.captureStream(30).getVideoTracks()[0],
        G = (yield this.room.localParticipant.publishTrack(W, {
          simulcast: !1,
          degradationPreference: "maintain-resolution",
          videoEncoding: { maxBitrate: 2e6 },
        })).track,
        Q = {
          protocol: U,
          packetsLost: 0,
          packetsSent: 0,
          qualityLimitationDurations: {},
          rttTotal: 0,
          jitterTotal: 0,
          bitrateTotal: 0,
          count: 0,
        },
        z = setInterval(
          () =>
            __awaiter$1(this, void 0, void 0, function* () {
              const H = yield G.getRTCStatsReport();
              H == null ||
                H.forEach((Y) => {
                  Y.type === "outbound-rtp"
                    ? ((Q.packetsSent = Y.packetsSent),
                      (Q.qualityLimitationDurations =
                        Y.qualityLimitationDurations),
                      (Q.bitrateTotal += Y.targetBitrate),
                      Q.count++)
                    : Y.type === "remote-inbound-rtp" &&
                      ((Q.packetsLost = Y.packetsLost),
                      (Q.rttTotal += Y.roundTripTime),
                      (Q.jitterTotal += Y.jitter));
                });
            }),
          1e3
        );
      return (
        yield new Promise((H) => setTimeout(H, TEST_DURATION)),
        clearInterval(z),
        W.stop(),
        F.remove(),
        yield this.disconnect(),
        Q
      );
    });
  }
}
class PublishAudioCheck extends Checker {
  get description() {
    return "Can publish audio";
  }
  perform() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      const F = yield this.connect(),
        B = yield createLocalAudioTrack();
      if (yield detectSilence(B, 1e3))
        throw new Error("unable to detect audio from microphone");
      this.appendMessage("detected audio from microphone"),
        F.localParticipant.publishTrack(B),
        yield new Promise((W) => setTimeout(W, 3e3));
      const j = yield (U = B.sender) === null || U === void 0
        ? void 0
        : U.getStats();
      if (!j) throw new Error("Could not get RTCStats");
      let $ = 0;
      if (
        (j.forEach((W) => {
          W.type === "outbound-rtp" &&
            (W.kind === "audio" || (!W.kind && W.mediaType === "audio")) &&
            ($ = W.packetsSent);
        }),
        $ === 0)
      )
        throw new Error("Could not determine packets are sent");
      this.appendMessage("published ".concat($, " audio packets"));
    });
  }
}
class PublishVideoCheck extends Checker {
  get description() {
    return "Can publish video";
  }
  perform() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      const F = yield this.connect(),
        B = yield createLocalVideoTrack();
      yield this.checkForVideo(B.mediaStreamTrack),
        F.localParticipant.publishTrack(B),
        yield new Promise(($) => setTimeout($, 5e3));
      const V = yield (U = B.sender) === null || U === void 0
        ? void 0
        : U.getStats();
      if (!V) throw new Error("Could not get RTCStats");
      let j = 0;
      if (
        (V.forEach(($) => {
          $.type === "outbound-rtp" &&
            ($.kind === "video" || (!$.kind && $.mediaType === "video")) &&
            (j += $.packetsSent);
        }),
        j === 0)
      )
        throw new Error("Could not determine packets are sent");
      this.appendMessage("published ".concat(j, " video packets"));
    });
  }
  checkForVideo(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const F = new MediaStream();
      F.addTrack(U.clone());
      const B = document.createElement("video");
      (B.srcObject = F),
        (B.muted = !0),
        yield new Promise((V) => {
          (B.onplay = () => {
            setTimeout(() => {
              var j, $, W, K;
              const G = document.createElement("canvas"),
                Q = U.getSettings(),
                z =
                  ($ =
                    (j = Q.width) !== null && j !== void 0
                      ? j
                      : B.videoWidth) !== null && $ !== void 0
                    ? $
                    : 1280,
                H =
                  (K =
                    (W = Q.height) !== null && W !== void 0
                      ? W
                      : B.videoHeight) !== null && K !== void 0
                    ? K
                    : 720;
              (G.width = z), (G.height = H);
              const Y = G.getContext("2d");
              Y.drawImage(B, 0, 0);
              const Z = Y.getImageData(0, 0, G.width, G.height).data;
              let ie = !0;
              for (let ee = 0; ee < Z.length; ee += 4)
                if (Z[ee] !== 0 || Z[ee + 1] !== 0 || Z[ee + 2] !== 0) {
                  ie = !1;
                  break;
                }
              ie
                ? this.appendError(
                    "camera appears to be producing only black frames"
                  )
                : this.appendMessage("received video frames"),
                V();
            }, 1e3);
          }),
            B.play();
        }),
        B.remove();
    });
  }
}
class ReconnectCheck extends Checker {
  get description() {
    return "Resuming connection after interruption";
  }
  perform() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U;
      const F = yield this.connect();
      let B = !1,
        V = !1,
        j;
      const $ = new Promise((G) => {
          setTimeout(G, 5e3), (j = G);
        }),
        W = () => {
          B = !0;
        };
      F.on(RoomEvent.SignalReconnecting, W)
        .on(RoomEvent.Reconnecting, W)
        .on(RoomEvent.Reconnected, () => {
          (V = !0), j(!0);
        }),
        (U = F.engine.client.ws) === null || U === void 0 || U.close();
      const K = F.engine.client.onClose;
      if ((K && K(""), yield $, B)) {
        if (!V || F.state !== ConnectionState.Connected)
          throw (
            (this.appendWarning(
              "reconnection is only possible in Redis-based configurations"
            ),
            new Error("Not able to reconnect"))
          );
      } else throw new Error("Did not attempt to reconnect");
    });
  }
}
class TURNCheck extends Checker {
  get description() {
    return "Can connect via TURN";
  }
  perform() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U, F;
      const B = new SignalClient(),
        V = yield B.join(this.url, this.token, {
          autoSubscribe: !0,
          maxRetries: 0,
          e2eeEnabled: !1,
          websocketTimeout: 15e3,
        });
      let j = !1,
        $ = !1,
        W = !1;
      for (let K of V.iceServers)
        for (let G of K.urls)
          G.startsWith("turn:")
            ? (($ = !0), (W = !0))
            : G.startsWith("turns:") && (($ = !0), (W = !0), (j = !0)),
            G.startsWith("stun:") && (W = !0);
      W
        ? $ &&
          !j &&
          this.appendWarning(
            "TURN is configured server side, but TURN/TLS is unavailable."
          )
        : this.appendWarning("No STUN servers configured on server side."),
        yield B.close(),
        (!(
          (F =
            (U = this.connectOptions) === null || U === void 0
              ? void 0
              : U.rtcConfig) === null || F === void 0
        ) &&
          F.iceServers) ||
        $
          ? yield this.room.connect(this.url, this.token, {
              rtcConfig: { iceTransportPolicy: "relay" },
            })
          : (this.appendWarning("No TURN servers configured."),
            this.skip(),
            yield new Promise((K) => setTimeout(K, 0)));
    });
  }
}
class WebRTCCheck extends Checker {
  get description() {
    return "Establishing WebRTC connection";
  }
  perform() {
    return __awaiter$1(this, void 0, void 0, function* () {
      let U = !1,
        F = !1;
      this.room.on(RoomEvent.SignalConnected, () => {
        const B = this.room.engine.client.onTrickle;
        (this.room.engine.client.onTrickle = (V, j) => {
          if (V.candidate) {
            const $ = new RTCIceCandidate(V);
            let W = ""
              .concat($.protocol, " ")
              .concat($.address, ":")
              .concat($.port, " ")
              .concat($.type);
            $.address &&
              (isIPPrivate($.address)
                ? (W += " (private)")
                : $.protocol === "tcp" && $.tcpType === "passive"
                ? ((U = !0), (W += " (passive)"))
                : $.protocol === "udp" && (F = !0)),
              this.appendMessage(W);
          }
          B && B(V, j);
        }),
          this.room.engine.pcManager &&
            (this.room.engine.pcManager.subscriber.onIceCandidateError = (
              V
            ) => {
              V instanceof RTCPeerConnectionIceErrorEvent &&
                this.appendWarning(
                  "error with ICE candidate: "
                    .concat(V.errorCode, " ")
                    .concat(V.errorText, " ")
                    .concat(V.url)
                );
            });
      });
      try {
        yield this.connect(), livekitLogger.info("now the room is connected");
      } catch (B) {
        throw (
          (this.appendWarning(
            "ports need to be open on firewall in order to connect."
          ),
          B)
        );
      }
      U || this.appendWarning("Server is not configured for ICE/TCP"),
        F ||
          this.appendWarning(
            "No public IPv4 UDP candidates were found. Your server is likely not configured correctly"
          );
    });
  }
}
function isIPPrivate(q) {
  const U = q.split(".");
  if (U.length === 4) {
    if (U[0] === "10") return !0;
    if (U[0] === "192" && U[1] === "168") return !0;
    if (U[0] === "172") {
      const F = parseInt(U[1], 10);
      if (F >= 16 && F <= 31) return !0;
    }
  }
  return !1;
}
class WebSocketCheck extends Checker {
  get description() {
    return "Connecting to signal connection via WebSocket";
  }
  perform() {
    return __awaiter$1(this, void 0, void 0, function* () {
      var U, F, B;
      (this.url.startsWith("ws:") || this.url.startsWith("http:")) &&
        this.appendWarning(
          "Server is insecure, clients may block connections to it"
        );
      let V = new SignalClient();
      const j = yield V.join(this.url, this.token, {
        autoSubscribe: !0,
        maxRetries: 0,
        e2eeEnabled: !1,
        websocketTimeout: 15e3,
      });
      this.appendMessage(
        "Connected to server, version ".concat(j.serverVersion, ".")
      ),
        ((U = j.serverInfo) === null || U === void 0 ? void 0 : U.edition) ===
          ServerInfo_Edition.Cloud &&
          !((F = j.serverInfo) === null || F === void 0) &&
          F.region &&
          this.appendMessage(
            "LiveKit Cloud: ".concat(
              (B = j.serverInfo) === null || B === void 0 ? void 0 : B.region
            )
          ),
        yield V.close();
    });
  }
}
class ConnectionCheck extends eventsExports.EventEmitter {
  constructor(U, F) {
    let B = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    super(),
      (this.options = {}),
      (this.checkResults = new Map()),
      (this.url = U),
      (this.token = F),
      (this.options = B);
  }
  getNextCheckId() {
    const U = this.checkResults.size;
    return (
      this.checkResults.set(U, {
        logs: [],
        status: CheckStatus.IDLE,
        name: "",
        description: "",
      }),
      U
    );
  }
  updateCheck(U, F) {
    this.checkResults.set(U, F), this.emit("checkUpdate", U, F);
  }
  isSuccess() {
    return Array.from(this.checkResults.values()).every(
      (U) => U.status !== CheckStatus.FAILED
    );
  }
  getResults() {
    return Array.from(this.checkResults.values());
  }
  createAndRunCheck(U) {
    return __awaiter$1(this, void 0, void 0, function* () {
      const F = this.getNextCheckId(),
        B = new U(this.url, this.token, this.options),
        V = ($) => {
          this.updateCheck(F, $);
        };
      B.on("update", V);
      const j = yield B.run();
      return B.off("update", V), j;
    });
  }
  checkWebsocket() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.createAndRunCheck(WebSocketCheck);
    });
  }
  checkWebRTC() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.createAndRunCheck(WebRTCCheck);
    });
  }
  checkTURN() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.createAndRunCheck(TURNCheck);
    });
  }
  checkReconnect() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.createAndRunCheck(ReconnectCheck);
    });
  }
  checkPublishAudio() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.createAndRunCheck(PublishAudioCheck);
    });
  }
  checkPublishVideo() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.createAndRunCheck(PublishVideoCheck);
    });
  }
  checkConnectionProtocol() {
    return __awaiter$1(this, void 0, void 0, function* () {
      const U = yield this.createAndRunCheck(ConnectionProtocolCheck);
      if (U.data && "protocol" in U.data) {
        const F = U.data;
        this.options.protocol = F.protocol;
      }
      return U;
    });
  }
  checkCloudRegion() {
    return __awaiter$1(this, void 0, void 0, function* () {
      return this.createAndRunCheck(CloudRegionCheck);
    });
  }
}
var commonjsGlobal =
  typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
    ? window
    : typeof global < "u"
    ? global
    : typeof self < "u"
    ? self
    : {};
function getDefaultExportFromCjs(q) {
  return q && q.__esModule && Object.prototype.hasOwnProperty.call(q, "default")
    ? q.default
    : q;
}
var src = { exports: {} },
  indexLight = { exports: {} },
  indexMinimal = {},
  minimal = {},
  aspromise,
  hasRequiredAspromise;
function requireAspromise() {
  if (hasRequiredAspromise) return aspromise;
  (hasRequiredAspromise = 1), (aspromise = q);
  function q(U, F) {
    for (
      var B = new Array(arguments.length - 1), V = 0, j = 2, $ = !0;
      j < arguments.length;

    )
      B[V++] = arguments[j++];
    return new Promise(function (K, G) {
      B[V] = function (z) {
        if ($)
          if ((($ = !1), z)) G(z);
          else {
            for (var H = new Array(arguments.length - 1), Y = 0; Y < H.length; )
              H[Y++] = arguments[Y];
            K.apply(null, H);
          }
      };
      try {
        U.apply(F || null, B);
      } catch (Q) {
        $ && (($ = !1), G(Q));
      }
    });
  }
  return aspromise;
}
var base64 = {},
  hasRequiredBase64;
function requireBase64() {
  return (
    hasRequiredBase64 ||
      ((hasRequiredBase64 = 1),
      (function (q) {
        var U = q;
        U.length = function (W) {
          var K = W.length;
          if (!K) return 0;
          for (var G = 0; --K % 4 > 1 && W.charAt(K) === "="; ) ++G;
          return Math.ceil(W.length * 3) / 4 - G;
        };
        for (var F = new Array(64), B = new Array(123), V = 0; V < 64; )
          B[
            (F[V] =
              V < 26
                ? V + 65
                : V < 52
                ? V + 71
                : V < 62
                ? V - 4
                : (V - 59) | 43)
          ] = V++;
        U.encode = function (W, K, G) {
          for (var Q = null, z = [], H = 0, Y = 0, X; K < G; ) {
            var Z = W[K++];
            switch (Y) {
              case 0:
                (z[H++] = F[Z >> 2]), (X = (Z & 3) << 4), (Y = 1);
                break;
              case 1:
                (z[H++] = F[X | (Z >> 4)]), (X = (Z & 15) << 2), (Y = 2);
                break;
              case 2:
                (z[H++] = F[X | (Z >> 6)]), (z[H++] = F[Z & 63]), (Y = 0);
                break;
            }
            H > 8191 &&
              ((Q || (Q = [])).push(String.fromCharCode.apply(String, z)),
              (H = 0));
          }
          return (
            Y && ((z[H++] = F[X]), (z[H++] = 61), Y === 1 && (z[H++] = 61)),
            Q
              ? (H && Q.push(String.fromCharCode.apply(String, z.slice(0, H))),
                Q.join(""))
              : String.fromCharCode.apply(String, z.slice(0, H))
          );
        };
        var j = "invalid encoding";
        (U.decode = function (W, K, G) {
          for (var Q = G, z = 0, H, Y = 0; Y < W.length; ) {
            var X = W.charCodeAt(Y++);
            if (X === 61 && z > 1) break;
            if ((X = B[X]) === void 0) throw Error(j);
            switch (z) {
              case 0:
                (H = X), (z = 1);
                break;
              case 1:
                (K[G++] = (H << 2) | ((X & 48) >> 4)), (H = X), (z = 2);
                break;
              case 2:
                (K[G++] = ((H & 15) << 4) | ((X & 60) >> 2)), (H = X), (z = 3);
                break;
              case 3:
                (K[G++] = ((H & 3) << 6) | X), (z = 0);
                break;
            }
          }
          if (z === 1) throw Error(j);
          return G - Q;
        }),
          (U.test = function (W) {
            return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
              W
            );
          });
      })(base64)),
    base64
  );
}
var eventemitter, hasRequiredEventemitter;
function requireEventemitter() {
  if (hasRequiredEventemitter) return eventemitter;
  (hasRequiredEventemitter = 1), (eventemitter = q);
  function q() {
    this._listeners = {};
  }
  return (
    (q.prototype.on = function (F, B, V) {
      return (
        (this._listeners[F] || (this._listeners[F] = [])).push({
          fn: B,
          ctx: V || this,
        }),
        this
      );
    }),
    (q.prototype.off = function (F, B) {
      if (F === void 0) this._listeners = {};
      else if (B === void 0) this._listeners[F] = [];
      else
        for (var V = this._listeners[F], j = 0; j < V.length; )
          V[j].fn === B ? V.splice(j, 1) : ++j;
      return this;
    }),
    (q.prototype.emit = function (F) {
      var B = this._listeners[F];
      if (B) {
        for (var V = [], j = 1; j < arguments.length; ) V.push(arguments[j++]);
        for (j = 0; j < B.length; ) B[j].fn.apply(B[j++].ctx, V);
      }
      return this;
    }),
    eventemitter
  );
}
var float, hasRequiredFloat;
function requireFloat() {
  if (hasRequiredFloat) return float;
  (hasRequiredFloat = 1), (float = q(q));
  function q(j) {
    return (
      typeof Float32Array < "u"
        ? (function () {
            var $ = new Float32Array([-0]),
              W = new Uint8Array($.buffer),
              K = W[3] === 128;
            function G(Y, X, Z) {
              ($[0] = Y),
                (X[Z] = W[0]),
                (X[Z + 1] = W[1]),
                (X[Z + 2] = W[2]),
                (X[Z + 3] = W[3]);
            }
            function Q(Y, X, Z) {
              ($[0] = Y),
                (X[Z] = W[3]),
                (X[Z + 1] = W[2]),
                (X[Z + 2] = W[1]),
                (X[Z + 3] = W[0]);
            }
            (j.writeFloatLE = K ? G : Q), (j.writeFloatBE = K ? Q : G);
            function z(Y, X) {
              return (
                (W[0] = Y[X]),
                (W[1] = Y[X + 1]),
                (W[2] = Y[X + 2]),
                (W[3] = Y[X + 3]),
                $[0]
              );
            }
            function H(Y, X) {
              return (
                (W[3] = Y[X]),
                (W[2] = Y[X + 1]),
                (W[1] = Y[X + 2]),
                (W[0] = Y[X + 3]),
                $[0]
              );
            }
            (j.readFloatLE = K ? z : H), (j.readFloatBE = K ? H : z);
          })()
        : (function () {
            function $(K, G, Q, z) {
              var H = G < 0 ? 1 : 0;
              if ((H && (G = -G), G === 0)) K(1 / G > 0 ? 0 : 2147483648, Q, z);
              else if (isNaN(G)) K(2143289344, Q, z);
              else if (G > 34028234663852886e22)
                K(((H << 31) | 2139095040) >>> 0, Q, z);
              else if (G < 11754943508222875e-54)
                K(
                  ((H << 31) | Math.round(G / 1401298464324817e-60)) >>> 0,
                  Q,
                  z
                );
              else {
                var Y = Math.floor(Math.log(G) / Math.LN2),
                  X = Math.round(G * Math.pow(2, -Y) * 8388608) & 8388607;
                K(((H << 31) | ((Y + 127) << 23) | X) >>> 0, Q, z);
              }
            }
            (j.writeFloatLE = $.bind(null, U)),
              (j.writeFloatBE = $.bind(null, F));
            function W(K, G, Q) {
              var z = K(G, Q),
                H = (z >> 31) * 2 + 1,
                Y = (z >>> 23) & 255,
                X = z & 8388607;
              return Y === 255
                ? X
                  ? NaN
                  : H * (1 / 0)
                : Y === 0
                ? H * 1401298464324817e-60 * X
                : H * Math.pow(2, Y - 150) * (X + 8388608);
            }
            (j.readFloatLE = W.bind(null, B)),
              (j.readFloatBE = W.bind(null, V));
          })(),
      typeof Float64Array < "u"
        ? (function () {
            var $ = new Float64Array([-0]),
              W = new Uint8Array($.buffer),
              K = W[7] === 128;
            function G(Y, X, Z) {
              ($[0] = Y),
                (X[Z] = W[0]),
                (X[Z + 1] = W[1]),
                (X[Z + 2] = W[2]),
                (X[Z + 3] = W[3]),
                (X[Z + 4] = W[4]),
                (X[Z + 5] = W[5]),
                (X[Z + 6] = W[6]),
                (X[Z + 7] = W[7]);
            }
            function Q(Y, X, Z) {
              ($[0] = Y),
                (X[Z] = W[7]),
                (X[Z + 1] = W[6]),
                (X[Z + 2] = W[5]),
                (X[Z + 3] = W[4]),
                (X[Z + 4] = W[3]),
                (X[Z + 5] = W[2]),
                (X[Z + 6] = W[1]),
                (X[Z + 7] = W[0]);
            }
            (j.writeDoubleLE = K ? G : Q), (j.writeDoubleBE = K ? Q : G);
            function z(Y, X) {
              return (
                (W[0] = Y[X]),
                (W[1] = Y[X + 1]),
                (W[2] = Y[X + 2]),
                (W[3] = Y[X + 3]),
                (W[4] = Y[X + 4]),
                (W[5] = Y[X + 5]),
                (W[6] = Y[X + 6]),
                (W[7] = Y[X + 7]),
                $[0]
              );
            }
            function H(Y, X) {
              return (
                (W[7] = Y[X]),
                (W[6] = Y[X + 1]),
                (W[5] = Y[X + 2]),
                (W[4] = Y[X + 3]),
                (W[3] = Y[X + 4]),
                (W[2] = Y[X + 5]),
                (W[1] = Y[X + 6]),
                (W[0] = Y[X + 7]),
                $[0]
              );
            }
            (j.readDoubleLE = K ? z : H), (j.readDoubleBE = K ? H : z);
          })()
        : (function () {
            function $(K, G, Q, z, H, Y) {
              var X = z < 0 ? 1 : 0;
              if ((X && (z = -z), z === 0))
                K(0, H, Y + G), K(1 / z > 0 ? 0 : 2147483648, H, Y + Q);
              else if (isNaN(z)) K(0, H, Y + G), K(2146959360, H, Y + Q);
              else if (z > 17976931348623157e292)
                K(0, H, Y + G), K(((X << 31) | 2146435072) >>> 0, H, Y + Q);
              else {
                var Z;
                if (z < 22250738585072014e-324)
                  (Z = z / 5e-324),
                    K(Z >>> 0, H, Y + G),
                    K(((X << 31) | (Z / 4294967296)) >>> 0, H, Y + Q);
                else {
                  var ie = Math.floor(Math.log(z) / Math.LN2);
                  ie === 1024 && (ie = 1023),
                    (Z = z * Math.pow(2, -ie)),
                    K((Z * 4503599627370496) >>> 0, H, Y + G),
                    K(
                      ((X << 31) |
                        ((ie + 1023) << 20) |
                        ((Z * 1048576) & 1048575)) >>>
                        0,
                      H,
                      Y + Q
                    );
                }
              }
            }
            (j.writeDoubleLE = $.bind(null, U, 0, 4)),
              (j.writeDoubleBE = $.bind(null, F, 4, 0));
            function W(K, G, Q, z, H) {
              var Y = K(z, H + G),
                X = K(z, H + Q),
                Z = (X >> 31) * 2 + 1,
                ie = (X >>> 20) & 2047,
                ee = 4294967296 * (X & 1048575) + Y;
              return ie === 2047
                ? ee
                  ? NaN
                  : Z * (1 / 0)
                : ie === 0
                ? Z * 5e-324 * ee
                : Z * Math.pow(2, ie - 1075) * (ee + 4503599627370496);
            }
            (j.readDoubleLE = W.bind(null, B, 0, 4)),
              (j.readDoubleBE = W.bind(null, V, 4, 0));
          })(),
      j
    );
  }
  function U(j, $, W) {
    ($[W] = j & 255),
      ($[W + 1] = (j >>> 8) & 255),
      ($[W + 2] = (j >>> 16) & 255),
      ($[W + 3] = j >>> 24);
  }
  function F(j, $, W) {
    ($[W] = j >>> 24),
      ($[W + 1] = (j >>> 16) & 255),
      ($[W + 2] = (j >>> 8) & 255),
      ($[W + 3] = j & 255);
  }
  function B(j, $) {
    return (j[$] | (j[$ + 1] << 8) | (j[$ + 2] << 16) | (j[$ + 3] << 24)) >>> 0;
  }
  function V(j, $) {
    return ((j[$] << 24) | (j[$ + 1] << 16) | (j[$ + 2] << 8) | j[$ + 3]) >>> 0;
  }
  return float;
}
var inquire_1, hasRequiredInquire;
function requireInquire() {
  if (hasRequiredInquire) return inquire_1;
  (hasRequiredInquire = 1), (inquire_1 = inquire);
  function inquire(moduleName) {
    try {
      var mod = eval("quire".replace(/^/, "re"))(moduleName);
      if (mod && (mod.length || Object.keys(mod).length)) return mod;
    } catch (q) {}
    return null;
  }
  return inquire_1;
}
var utf8 = {},
  hasRequiredUtf8;
function requireUtf8() {
  return (
    hasRequiredUtf8 ||
      ((hasRequiredUtf8 = 1),
      (function (q) {
        var U = q;
        (U.length = function (B) {
          for (var V = 0, j = 0, $ = 0; $ < B.length; ++$)
            (j = B.charCodeAt($)),
              j < 128
                ? (V += 1)
                : j < 2048
                ? (V += 2)
                : (j & 64512) === 55296 &&
                  (B.charCodeAt($ + 1) & 64512) === 56320
                ? (++$, (V += 4))
                : (V += 3);
          return V;
        }),
          (U.read = function (B, V, j) {
            var $ = j - V;
            if ($ < 1) return "";
            for (var W = null, K = [], G = 0, Q; V < j; )
              (Q = B[V++]),
                Q < 128
                  ? (K[G++] = Q)
                  : Q > 191 && Q < 224
                  ? (K[G++] = ((Q & 31) << 6) | (B[V++] & 63))
                  : Q > 239 && Q < 365
                  ? ((Q =
                      (((Q & 7) << 18) |
                        ((B[V++] & 63) << 12) |
                        ((B[V++] & 63) << 6) |
                        (B[V++] & 63)) -
                      65536),
                    (K[G++] = 55296 + (Q >> 10)),
                    (K[G++] = 56320 + (Q & 1023)))
                  : (K[G++] =
                      ((Q & 15) << 12) | ((B[V++] & 63) << 6) | (B[V++] & 63)),
                G > 8191 &&
                  ((W || (W = [])).push(String.fromCharCode.apply(String, K)),
                  (G = 0));
            return W
              ? (G && W.push(String.fromCharCode.apply(String, K.slice(0, G))),
                W.join(""))
              : String.fromCharCode.apply(String, K.slice(0, G));
          }),
          (U.write = function (B, V, j) {
            for (var $ = j, W, K, G = 0; G < B.length; ++G)
              (W = B.charCodeAt(G)),
                W < 128
                  ? (V[j++] = W)
                  : W < 2048
                  ? ((V[j++] = (W >> 6) | 192), (V[j++] = (W & 63) | 128))
                  : (W & 64512) === 55296 &&
                    ((K = B.charCodeAt(G + 1)) & 64512) === 56320
                  ? ((W = 65536 + ((W & 1023) << 10) + (K & 1023)),
                    ++G,
                    (V[j++] = (W >> 18) | 240),
                    (V[j++] = ((W >> 12) & 63) | 128),
                    (V[j++] = ((W >> 6) & 63) | 128),
                    (V[j++] = (W & 63) | 128))
                  : ((V[j++] = (W >> 12) | 224),
                    (V[j++] = ((W >> 6) & 63) | 128),
                    (V[j++] = (W & 63) | 128));
            return j - $;
          });
      })(utf8)),
    utf8
  );
}
var pool_1, hasRequiredPool;
function requirePool() {
  if (hasRequiredPool) return pool_1;
  (hasRequiredPool = 1), (pool_1 = q);
  function q(U, F, B) {
    var V = B || 8192,
      j = V >>> 1,
      $ = null,
      W = V;
    return function (G) {
      if (G < 1 || G > j) return U(G);
      W + G > V && (($ = U(V)), (W = 0));
      var Q = F.call($, W, (W += G));
      return W & 7 && (W = (W | 7) + 1), Q;
    };
  }
  return pool_1;
}
var longbits, hasRequiredLongbits;
function requireLongbits() {
  if (hasRequiredLongbits) return longbits;
  (hasRequiredLongbits = 1), (longbits = U);
  var q = requireMinimal();
  function U(j, $) {
    (this.lo = j >>> 0), (this.hi = $ >>> 0);
  }
  var F = (U.zero = new U(0, 0));
  (F.toNumber = function () {
    return 0;
  }),
    (F.zzEncode = F.zzDecode =
      function () {
        return this;
      }),
    (F.length = function () {
      return 1;
    });
  var B = (U.zeroHash = "\0\0\0\0\0\0\0\0");
  (U.fromNumber = function ($) {
    if ($ === 0) return F;
    var W = $ < 0;
    W && ($ = -$);
    var K = $ >>> 0,
      G = (($ - K) / 4294967296) >>> 0;
    return (
      W &&
        ((G = ~G >>> 0),
        (K = ~K >>> 0),
        ++K > 4294967295 && ((K = 0), ++G > 4294967295 && (G = 0))),
      new U(K, G)
    );
  }),
    (U.from = function ($) {
      if (typeof $ == "number") return U.fromNumber($);
      if (q.isString($))
        if (q.Long) $ = q.Long.fromString($);
        else return U.fromNumber(parseInt($, 10));
      return $.low || $.high ? new U($.low >>> 0, $.high >>> 0) : F;
    }),
    (U.prototype.toNumber = function ($) {
      if (!$ && this.hi >>> 31) {
        var W = (~this.lo + 1) >>> 0,
          K = ~this.hi >>> 0;
        return W || (K = (K + 1) >>> 0), -(W + K * 4294967296);
      }
      return this.lo + this.hi * 4294967296;
    }),
    (U.prototype.toLong = function ($) {
      return q.Long
        ? new q.Long(this.lo | 0, this.hi | 0, !!$)
        : { low: this.lo | 0, high: this.hi | 0, unsigned: !!$ };
    });
  var V = String.prototype.charCodeAt;
  return (
    (U.fromHash = function ($) {
      return $ === B
        ? F
        : new U(
            (V.call($, 0) |
              (V.call($, 1) << 8) |
              (V.call($, 2) << 16) |
              (V.call($, 3) << 24)) >>>
              0,
            (V.call($, 4) |
              (V.call($, 5) << 8) |
              (V.call($, 6) << 16) |
              (V.call($, 7) << 24)) >>>
              0
          );
    }),
    (U.prototype.toHash = function () {
      return String.fromCharCode(
        this.lo & 255,
        (this.lo >>> 8) & 255,
        (this.lo >>> 16) & 255,
        this.lo >>> 24,
        this.hi & 255,
        (this.hi >>> 8) & 255,
        (this.hi >>> 16) & 255,
        this.hi >>> 24
      );
    }),
    (U.prototype.zzEncode = function () {
      var $ = this.hi >> 31;
      return (
        (this.hi = (((this.hi << 1) | (this.lo >>> 31)) ^ $) >>> 0),
        (this.lo = ((this.lo << 1) ^ $) >>> 0),
        this
      );
    }),
    (U.prototype.zzDecode = function () {
      var $ = -(this.lo & 1);
      return (
        (this.lo = (((this.lo >>> 1) | (this.hi << 31)) ^ $) >>> 0),
        (this.hi = ((this.hi >>> 1) ^ $) >>> 0),
        this
      );
    }),
    (U.prototype.length = function () {
      var $ = this.lo,
        W = ((this.lo >>> 28) | (this.hi << 4)) >>> 0,
        K = this.hi >>> 24;
      return K === 0
        ? W === 0
          ? $ < 16384
            ? $ < 128
              ? 1
              : 2
            : $ < 2097152
            ? 3
            : 4
          : W < 16384
          ? W < 128
            ? 5
            : 6
          : W < 2097152
          ? 7
          : 8
        : K < 128
        ? 9
        : 10;
    }),
    longbits
  );
}
var hasRequiredMinimal;
function requireMinimal() {
  return (
    hasRequiredMinimal ||
      ((hasRequiredMinimal = 1),
      (function (q) {
        var U = q;
        (U.asPromise = requireAspromise()),
          (U.base64 = requireBase64()),
          (U.EventEmitter = requireEventemitter()),
          (U.float = requireFloat()),
          (U.inquire = requireInquire()),
          (U.utf8 = requireUtf8()),
          (U.pool = requirePool()),
          (U.LongBits = requireLongbits()),
          (U.isNode = !!(
            typeof commonjsGlobal < "u" &&
            commonjsGlobal &&
            commonjsGlobal.process &&
            commonjsGlobal.process.versions &&
            commonjsGlobal.process.versions.node
          )),
          (U.global =
            (U.isNode && commonjsGlobal) ||
            (typeof window < "u" && window) ||
            (typeof self < "u" && self) ||
            minimal),
          (U.emptyArray = Object.freeze ? Object.freeze([]) : []),
          (U.emptyObject = Object.freeze ? Object.freeze({}) : {}),
          (U.isInteger =
            Number.isInteger ||
            function (j) {
              return typeof j == "number" && isFinite(j) && Math.floor(j) === j;
            }),
          (U.isString = function (j) {
            return typeof j == "string" || j instanceof String;
          }),
          (U.isObject = function (j) {
            return j && typeof j == "object";
          }),
          (U.isset = U.isSet =
            function (j, $) {
              var W = j[$];
              return W != null && j.hasOwnProperty($)
                ? typeof W != "object" ||
                    (Array.isArray(W) ? W.length : Object.keys(W).length) > 0
                : !1;
            }),
          (U.Buffer = (function () {
            try {
              var V = U.inquire("buffer").Buffer;
              return V.prototype.utf8Write ? V : null;
            } catch {
              return null;
            }
          })()),
          (U._Buffer_from = null),
          (U._Buffer_allocUnsafe = null),
          (U.newBuffer = function (j) {
            return typeof j == "number"
              ? U.Buffer
                ? U._Buffer_allocUnsafe(j)
                : new U.Array(j)
              : U.Buffer
              ? U._Buffer_from(j)
              : typeof Uint8Array > "u"
              ? j
              : new Uint8Array(j);
          }),
          (U.Array = typeof Uint8Array < "u" ? Uint8Array : Array),
          (U.Long =
            (U.global.dcodeIO && U.global.dcodeIO.Long) ||
            U.global.Long ||
            U.inquire("long")),
          (U.key2Re = /^true|false|0|1$/),
          (U.key32Re = /^-?(?:0|[1-9][0-9]*)$/),
          (U.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/),
          (U.longToHash = function (j) {
            return j ? U.LongBits.from(j).toHash() : U.LongBits.zeroHash;
          }),
          (U.longFromHash = function (j, $) {
            var W = U.LongBits.fromHash(j);
            return U.Long ? U.Long.fromBits(W.lo, W.hi, $) : W.toNumber(!!$);
          });
        function F(V, j, $) {
          for (var W = Object.keys(j), K = 0; K < W.length; ++K)
            (V[W[K]] === void 0 || !$) && (V[W[K]] = j[W[K]]);
          return V;
        }
        (U.merge = F),
          (U.lcFirst = function (j) {
            return j.charAt(0).toLowerCase() + j.substring(1);
          });
        function B(V) {
          function j($, W) {
            if (!(this instanceof j)) return new j($, W);
            Object.defineProperty(this, "message", {
              get: function () {
                return $;
              },
            }),
              Error.captureStackTrace
                ? Error.captureStackTrace(this, j)
                : Object.defineProperty(this, "stack", {
                    value: new Error().stack || "",
                  }),
              W && F(this, W);
          }
          return (
            (j.prototype = Object.create(Error.prototype, {
              constructor: {
                value: j,
                writable: !0,
                enumerable: !1,
                configurable: !0,
              },
              name: {
                get: function () {
                  return V;
                },
                set: void 0,
                enumerable: !1,
                configurable: !0,
              },
              toString: {
                value: function () {
                  return this.name + ": " + this.message;
                },
                writable: !0,
                enumerable: !1,
                configurable: !0,
              },
            })),
            j
          );
        }
        (U.newError = B),
          (U.ProtocolError = B("ProtocolError")),
          (U.oneOfGetter = function (j) {
            for (var $ = {}, W = 0; W < j.length; ++W) $[j[W]] = 1;
            return function () {
              for (var K = Object.keys(this), G = K.length - 1; G > -1; --G)
                if (
                  $[K[G]] === 1 &&
                  this[K[G]] !== void 0 &&
                  this[K[G]] !== null
                )
                  return K[G];
            };
          }),
          (U.oneOfSetter = function (j) {
            return function ($) {
              for (var W = 0; W < j.length; ++W)
                j[W] !== $ && delete this[j[W]];
            };
          }),
          (U.toJSONOptions = {
            longs: String,
            enums: String,
            bytes: String,
            json: !0,
          }),
          (U._configure = function () {
            var V = U.Buffer;
            if (!V) {
              U._Buffer_from = U._Buffer_allocUnsafe = null;
              return;
            }
            (U._Buffer_from =
              (V.from !== Uint8Array.from && V.from) ||
              function ($, W) {
                return new V($, W);
              }),
              (U._Buffer_allocUnsafe =
                V.allocUnsafe ||
                function ($) {
                  return new V($);
                });
          });
      })(minimal)),
    minimal
  );
}
var writer, hasRequiredWriter;
function requireWriter() {
  if (hasRequiredWriter) return writer;
  (hasRequiredWriter = 1), (writer = K);
  var q = requireMinimal(),
    U,
    F = q.LongBits,
    B = q.base64,
    V = q.utf8;
  function j(ie, ee, te) {
    (this.fn = ie), (this.len = ee), (this.next = void 0), (this.val = te);
  }
  function $() {}
  function W(ie) {
    (this.head = ie.head),
      (this.tail = ie.tail),
      (this.len = ie.len),
      (this.next = ie.states);
  }
  function K() {
    (this.len = 0),
      (this.head = new j($, 0, 0)),
      (this.tail = this.head),
      (this.states = null);
  }
  var G = function () {
    return q.Buffer
      ? function () {
          return (K.create = function () {
            return new U();
          })();
        }
      : function () {
          return new K();
        };
  };
  (K.create = G()),
    (K.alloc = function (ee) {
      return new q.Array(ee);
    }),
    q.Array !== Array &&
      (K.alloc = q.pool(K.alloc, q.Array.prototype.subarray)),
    (K.prototype._push = function (ee, te, re) {
      return (
        (this.tail = this.tail.next = new j(ee, te, re)), (this.len += te), this
      );
    });
  function Q(ie, ee, te) {
    ee[te] = ie & 255;
  }
  function z(ie, ee, te) {
    for (; ie > 127; ) (ee[te++] = (ie & 127) | 128), (ie >>>= 7);
    ee[te] = ie;
  }
  function H(ie, ee) {
    (this.len = ie), (this.next = void 0), (this.val = ee);
  }
  (H.prototype = Object.create(j.prototype)),
    (H.prototype.fn = z),
    (K.prototype.uint32 = function (ee) {
      return (
        (this.len += (this.tail = this.tail.next =
          new H(
            (ee = ee >>> 0) < 128
              ? 1
              : ee < 16384
              ? 2
              : ee < 2097152
              ? 3
              : ee < 268435456
              ? 4
              : 5,
            ee
          )).len),
        this
      );
    }),
    (K.prototype.int32 = function (ee) {
      return ee < 0 ? this._push(Y, 10, F.fromNumber(ee)) : this.uint32(ee);
    }),
    (K.prototype.sint32 = function (ee) {
      return this.uint32(((ee << 1) ^ (ee >> 31)) >>> 0);
    });
  function Y(ie, ee, te) {
    for (; ie.hi; )
      (ee[te++] = (ie.lo & 127) | 128),
        (ie.lo = ((ie.lo >>> 7) | (ie.hi << 25)) >>> 0),
        (ie.hi >>>= 7);
    for (; ie.lo > 127; )
      (ee[te++] = (ie.lo & 127) | 128), (ie.lo = ie.lo >>> 7);
    ee[te++] = ie.lo;
  }
  (K.prototype.uint64 = function (ee) {
    var te = F.from(ee);
    return this._push(Y, te.length(), te);
  }),
    (K.prototype.int64 = K.prototype.uint64),
    (K.prototype.sint64 = function (ee) {
      var te = F.from(ee).zzEncode();
      return this._push(Y, te.length(), te);
    }),
    (K.prototype.bool = function (ee) {
      return this._push(Q, 1, ee ? 1 : 0);
    });
  function X(ie, ee, te) {
    (ee[te] = ie & 255),
      (ee[te + 1] = (ie >>> 8) & 255),
      (ee[te + 2] = (ie >>> 16) & 255),
      (ee[te + 3] = ie >>> 24);
  }
  (K.prototype.fixed32 = function (ee) {
    return this._push(X, 4, ee >>> 0);
  }),
    (K.prototype.sfixed32 = K.prototype.fixed32),
    (K.prototype.fixed64 = function (ee) {
      var te = F.from(ee);
      return this._push(X, 4, te.lo)._push(X, 4, te.hi);
    }),
    (K.prototype.sfixed64 = K.prototype.fixed64),
    (K.prototype.float = function (ee) {
      return this._push(q.float.writeFloatLE, 4, ee);
    }),
    (K.prototype.double = function (ee) {
      return this._push(q.float.writeDoubleLE, 8, ee);
    });
  var Z = q.Array.prototype.set
    ? function (ee, te, re) {
        te.set(ee, re);
      }
    : function (ee, te, re) {
        for (var ne = 0; ne < ee.length; ++ne) te[re + ne] = ee[ne];
      };
  return (
    (K.prototype.bytes = function (ee) {
      var te = ee.length >>> 0;
      if (!te) return this._push(Q, 1, 0);
      if (q.isString(ee)) {
        var re = K.alloc((te = B.length(ee)));
        B.decode(ee, re, 0), (ee = re);
      }
      return this.uint32(te)._push(Z, te, ee);
    }),
    (K.prototype.string = function (ee) {
      var te = V.length(ee);
      return te ? this.uint32(te)._push(V.write, te, ee) : this._push(Q, 1, 0);
    }),
    (K.prototype.fork = function () {
      return (
        (this.states = new W(this)),
        (this.head = this.tail = new j($, 0, 0)),
        (this.len = 0),
        this
      );
    }),
    (K.prototype.reset = function () {
      return (
        this.states
          ? ((this.head = this.states.head),
            (this.tail = this.states.tail),
            (this.len = this.states.len),
            (this.states = this.states.next))
          : ((this.head = this.tail = new j($, 0, 0)), (this.len = 0)),
        this
      );
    }),
    (K.prototype.ldelim = function () {
      var ee = this.head,
        te = this.tail,
        re = this.len;
      return (
        this.reset().uint32(re),
        re && ((this.tail.next = ee.next), (this.tail = te), (this.len += re)),
        this
      );
    }),
    (K.prototype.finish = function () {
      for (
        var ee = this.head.next, te = this.constructor.alloc(this.len), re = 0;
        ee;

      )
        ee.fn(ee.val, te, re), (re += ee.len), (ee = ee.next);
      return te;
    }),
    (K._configure = function (ie) {
      (U = ie), (K.create = G()), U._configure();
    }),
    writer
  );
}
var writer_buffer, hasRequiredWriter_buffer;
function requireWriter_buffer() {
  if (hasRequiredWriter_buffer) return writer_buffer;
  (hasRequiredWriter_buffer = 1), (writer_buffer = F);
  var q = requireWriter();
  (F.prototype = Object.create(q.prototype)).constructor = F;
  var U = requireMinimal();
  function F() {
    q.call(this);
  }
  (F._configure = function () {
    (F.alloc = U._Buffer_allocUnsafe),
      (F.writeBytesBuffer =
        U.Buffer &&
        U.Buffer.prototype instanceof Uint8Array &&
        U.Buffer.prototype.set.name === "set"
          ? function (j, $, W) {
              $.set(j, W);
            }
          : function (j, $, W) {
              if (j.copy) j.copy($, W, 0, j.length);
              else for (var K = 0; K < j.length; ) $[W++] = j[K++];
            });
  }),
    (F.prototype.bytes = function (j) {
      U.isString(j) && (j = U._Buffer_from(j, "base64"));
      var $ = j.length >>> 0;
      return this.uint32($), $ && this._push(F.writeBytesBuffer, $, j), this;
    });
  function B(V, j, $) {
    V.length < 40
      ? U.utf8.write(V, j, $)
      : j.utf8Write
      ? j.utf8Write(V, $)
      : j.write(V, $);
  }
  return (
    (F.prototype.string = function (j) {
      var $ = U.Buffer.byteLength(j);
      return this.uint32($), $ && this._push(B, $, j), this;
    }),
    F._configure(),
    writer_buffer
  );
}
var reader, hasRequiredReader;
function requireReader() {
  if (hasRequiredReader) return reader;
  (hasRequiredReader = 1), (reader = j);
  var q = requireMinimal(),
    U,
    F = q.LongBits,
    B = q.utf8;
  function V(z, H) {
    return RangeError(
      "index out of range: " + z.pos + " + " + (H || 1) + " > " + z.len
    );
  }
  function j(z) {
    (this.buf = z), (this.pos = 0), (this.len = z.length);
  }
  var $ =
      typeof Uint8Array < "u"
        ? function (H) {
            if (H instanceof Uint8Array || Array.isArray(H)) return new j(H);
            throw Error("illegal buffer");
          }
        : function (H) {
            if (Array.isArray(H)) return new j(H);
            throw Error("illegal buffer");
          },
    W = function () {
      return q.Buffer
        ? function (Y) {
            return (j.create = function (Z) {
              return q.Buffer.isBuffer(Z) ? new U(Z) : $(Z);
            })(Y);
          }
        : $;
    };
  (j.create = W()),
    (j.prototype._slice =
      q.Array.prototype.subarray || q.Array.prototype.slice),
    (j.prototype.uint32 = (function () {
      var H = 4294967295;
      return function () {
        if (
          ((H = (this.buf[this.pos] & 127) >>> 0),
          this.buf[this.pos++] < 128 ||
            ((H = (H | ((this.buf[this.pos] & 127) << 7)) >>> 0),
            this.buf[this.pos++] < 128) ||
            ((H = (H | ((this.buf[this.pos] & 127) << 14)) >>> 0),
            this.buf[this.pos++] < 128) ||
            ((H = (H | ((this.buf[this.pos] & 127) << 21)) >>> 0),
            this.buf[this.pos++] < 128) ||
            ((H = (H | ((this.buf[this.pos] & 15) << 28)) >>> 0),
            this.buf[this.pos++] < 128))
        )
          return H;
        if ((this.pos += 5) > this.len)
          throw ((this.pos = this.len), V(this, 10));
        return H;
      };
    })()),
    (j.prototype.int32 = function () {
      return this.uint32() | 0;
    }),
    (j.prototype.sint32 = function () {
      var H = this.uint32();
      return ((H >>> 1) ^ -(H & 1)) | 0;
    });
  function K() {
    var z = new F(0, 0),
      H = 0;
    if (this.len - this.pos > 4) {
      for (; H < 4; ++H)
        if (
          ((z.lo = (z.lo | ((this.buf[this.pos] & 127) << (H * 7))) >>> 0),
          this.buf[this.pos++] < 128)
        )
          return z;
      if (
        ((z.lo = (z.lo | ((this.buf[this.pos] & 127) << 28)) >>> 0),
        (z.hi = (z.hi | ((this.buf[this.pos] & 127) >> 4)) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return z;
      H = 0;
    } else {
      for (; H < 3; ++H) {
        if (this.pos >= this.len) throw V(this);
        if (
          ((z.lo = (z.lo | ((this.buf[this.pos] & 127) << (H * 7))) >>> 0),
          this.buf[this.pos++] < 128)
        )
          return z;
      }
      return (
        (z.lo = (z.lo | ((this.buf[this.pos++] & 127) << (H * 7))) >>> 0), z
      );
    }
    if (this.len - this.pos > 4) {
      for (; H < 5; ++H)
        if (
          ((z.hi = (z.hi | ((this.buf[this.pos] & 127) << (H * 7 + 3))) >>> 0),
          this.buf[this.pos++] < 128)
        )
          return z;
    } else
      for (; H < 5; ++H) {
        if (this.pos >= this.len) throw V(this);
        if (
          ((z.hi = (z.hi | ((this.buf[this.pos] & 127) << (H * 7 + 3))) >>> 0),
          this.buf[this.pos++] < 128)
        )
          return z;
      }
    throw Error("invalid varint encoding");
  }
  j.prototype.bool = function () {
    return this.uint32() !== 0;
  };
  function G(z, H) {
    return (
      (z[H - 4] | (z[H - 3] << 8) | (z[H - 2] << 16) | (z[H - 1] << 24)) >>> 0
    );
  }
  (j.prototype.fixed32 = function () {
    if (this.pos + 4 > this.len) throw V(this, 4);
    return G(this.buf, (this.pos += 4));
  }),
    (j.prototype.sfixed32 = function () {
      if (this.pos + 4 > this.len) throw V(this, 4);
      return G(this.buf, (this.pos += 4)) | 0;
    });
  function Q() {
    if (this.pos + 8 > this.len) throw V(this, 8);
    return new F(G(this.buf, (this.pos += 4)), G(this.buf, (this.pos += 4)));
  }
  return (
    (j.prototype.float = function () {
      if (this.pos + 4 > this.len) throw V(this, 4);
      var H = q.float.readFloatLE(this.buf, this.pos);
      return (this.pos += 4), H;
    }),
    (j.prototype.double = function () {
      if (this.pos + 8 > this.len) throw V(this, 4);
      var H = q.float.readDoubleLE(this.buf, this.pos);
      return (this.pos += 8), H;
    }),
    (j.prototype.bytes = function () {
      var H = this.uint32(),
        Y = this.pos,
        X = this.pos + H;
      if (X > this.len) throw V(this, H);
      if (((this.pos += H), Array.isArray(this.buf)))
        return this.buf.slice(Y, X);
      if (Y === X) {
        var Z = q.Buffer;
        return Z ? Z.alloc(0) : new this.buf.constructor(0);
      }
      return this._slice.call(this.buf, Y, X);
    }),
    (j.prototype.string = function () {
      var H = this.bytes();
      return B.read(H, 0, H.length);
    }),
    (j.prototype.skip = function (H) {
      if (typeof H == "number") {
        if (this.pos + H > this.len) throw V(this, H);
        this.pos += H;
      } else
        do if (this.pos >= this.len) throw V(this);
        while (this.buf[this.pos++] & 128);
      return this;
    }),
    (j.prototype.skipType = function (z) {
      switch (z) {
        case 0:
          this.skip();
          break;
        case 1:
          this.skip(8);
          break;
        case 2:
          this.skip(this.uint32());
          break;
        case 3:
          for (; (z = this.uint32() & 7) !== 4; ) this.skipType(z);
          break;
        case 5:
          this.skip(4);
          break;
        default:
          throw Error("invalid wire type " + z + " at offset " + this.pos);
      }
      return this;
    }),
    (j._configure = function (z) {
      (U = z), (j.create = W()), U._configure();
      var H = q.Long ? "toLong" : "toNumber";
      q.merge(j.prototype, {
        int64: function () {
          return K.call(this)[H](!1);
        },
        uint64: function () {
          return K.call(this)[H](!0);
        },
        sint64: function () {
          return K.call(this).zzDecode()[H](!1);
        },
        fixed64: function () {
          return Q.call(this)[H](!0);
        },
        sfixed64: function () {
          return Q.call(this)[H](!1);
        },
      });
    }),
    reader
  );
}
var reader_buffer, hasRequiredReader_buffer;
function requireReader_buffer() {
  if (hasRequiredReader_buffer) return reader_buffer;
  (hasRequiredReader_buffer = 1), (reader_buffer = F);
  var q = requireReader();
  (F.prototype = Object.create(q.prototype)).constructor = F;
  var U = requireMinimal();
  function F(B) {
    q.call(this, B);
  }
  return (
    (F._configure = function () {
      U.Buffer && (F.prototype._slice = U.Buffer.prototype.slice);
    }),
    (F.prototype.string = function () {
      var V = this.uint32();
      return this.buf.utf8Slice
        ? this.buf.utf8Slice(
            this.pos,
            (this.pos = Math.min(this.pos + V, this.len))
          )
        : this.buf.toString(
            "utf-8",
            this.pos,
            (this.pos = Math.min(this.pos + V, this.len))
          );
    }),
    F._configure(),
    reader_buffer
  );
}
var rpc = {},
  service$1,
  hasRequiredService$1;
function requireService$1() {
  if (hasRequiredService$1) return service$1;
  (hasRequiredService$1 = 1), (service$1 = U);
  var q = requireMinimal();
  (U.prototype = Object.create(q.EventEmitter.prototype)).constructor = U;
  function U(F, B, V) {
    if (typeof F != "function") throw TypeError("rpcImpl must be a function");
    q.EventEmitter.call(this),
      (this.rpcImpl = F),
      (this.requestDelimited = !!B),
      (this.responseDelimited = !!V);
  }
  return (
    (U.prototype.rpcCall = function F(B, V, j, $, W) {
      if (!$) throw TypeError("request must be specified");
      var K = this;
      if (!W) return q.asPromise(F, K, B, V, j, $);
      if (!K.rpcImpl) {
        setTimeout(function () {
          W(Error("already ended"));
        }, 0);
        return;
      }
      try {
        return K.rpcImpl(
          B,
          V[K.requestDelimited ? "encodeDelimited" : "encode"]($).finish(),
          function (Q, z) {
            if (Q) return K.emit("error", Q, B), W(Q);
            if (z === null) {
              K.end(!0);
              return;
            }
            if (!(z instanceof j))
              try {
                z = j[K.responseDelimited ? "decodeDelimited" : "decode"](z);
              } catch (H) {
                return K.emit("error", H, B), W(H);
              }
            return K.emit("data", z, B), W(null, z);
          }
        );
      } catch (G) {
        K.emit("error", G, B),
          setTimeout(function () {
            W(G);
          }, 0);
        return;
      }
    }),
    (U.prototype.end = function (B) {
      return (
        this.rpcImpl &&
          (B || this.rpcImpl(null, null, null),
          (this.rpcImpl = null),
          this.emit("end").off()),
        this
      );
    }),
    service$1
  );
}
var hasRequiredRpc;
function requireRpc() {
  return (
    hasRequiredRpc ||
      ((hasRequiredRpc = 1),
      (function (q) {
        var U = q;
        U.Service = requireService$1();
      })(rpc)),
    rpc
  );
}
var roots, hasRequiredRoots;
function requireRoots() {
  return hasRequiredRoots || ((hasRequiredRoots = 1), (roots = {})), roots;
}
var hasRequiredIndexMinimal;
function requireIndexMinimal() {
  return (
    hasRequiredIndexMinimal ||
      ((hasRequiredIndexMinimal = 1),
      (function (q) {
        var U = q;
        (U.build = "minimal"),
          (U.Writer = requireWriter()),
          (U.BufferWriter = requireWriter_buffer()),
          (U.Reader = requireReader()),
          (U.BufferReader = requireReader_buffer()),
          (U.util = requireMinimal()),
          (U.rpc = requireRpc()),
          (U.roots = requireRoots()),
          (U.configure = F);
        function F() {
          U.util._configure(),
            U.Writer._configure(U.BufferWriter),
            U.Reader._configure(U.BufferReader);
        }
        F();
      })(indexMinimal)),
    indexMinimal
  );
}
var types = {},
  util = { exports: {} },
  codegen_1,
  hasRequiredCodegen;
function requireCodegen() {
  if (hasRequiredCodegen) return codegen_1;
  (hasRequiredCodegen = 1), (codegen_1 = q);
  function q(U, F) {
    typeof U == "string" && ((F = U), (U = void 0));
    var B = [];
    function V($) {
      if (typeof $ != "string") {
        var W = j();
        if (
          (q.verbose && console.log("codegen: " + W), (W = "return " + W), $)
        ) {
          for (
            var K = Object.keys($),
              G = new Array(K.length + 1),
              Q = new Array(K.length),
              z = 0;
            z < K.length;

          )
            (G[z] = K[z]), (Q[z] = $[K[z++]]);
          return (G[z] = W), Function.apply(null, G).apply(null, Q);
        }
        return Function(W)();
      }
      for (var H = new Array(arguments.length - 1), Y = 0; Y < H.length; )
        H[Y] = arguments[++Y];
      if (
        ((Y = 0),
        ($ = $.replace(/%([%dfijs])/g, function (Z, ie) {
          var ee = H[Y++];
          switch (ie) {
            case "d":
            case "f":
              return String(Number(ee));
            case "i":
              return String(Math.floor(ee));
            case "j":
              return JSON.stringify(ee);
            case "s":
              return String(ee);
          }
          return "%";
        })),
        Y !== H.length)
      )
        throw Error("parameter count mismatch");
      return B.push($), V;
    }
    function j($) {
      return (
        "function " +
        ($ || F || "") +
        "(" +
        ((U && U.join(",")) || "") +
        `){
  ` +
        B.join(`
  `) +
        `
}`
      );
    }
    return (V.toString = j), V;
  }
  return (q.verbose = !1), codegen_1;
}
var fetch_1, hasRequiredFetch;
function requireFetch() {
  if (hasRequiredFetch) return fetch_1;
  (hasRequiredFetch = 1), (fetch_1 = B);
  var q = requireAspromise(),
    U = requireInquire(),
    F = U("fs");
  function B(V, j, $) {
    return (
      typeof j == "function" ? (($ = j), (j = {})) : j || (j = {}),
      $
        ? !j.xhr && F && F.readFile
          ? F.readFile(V, function (K, G) {
              return K && typeof XMLHttpRequest < "u"
                ? B.xhr(V, j, $)
                : K
                ? $(K)
                : $(null, j.binary ? G : G.toString("utf8"));
            })
          : B.xhr(V, j, $)
        : q(B, this, V, j)
    );
  }
  return (
    (B.xhr = function (j, $, W) {
      var K = new XMLHttpRequest();
      (K.onreadystatechange = function () {
        if (K.readyState === 4) {
          if (K.status !== 0 && K.status !== 200)
            return W(Error("status " + K.status));
          if ($.binary) {
            var Q = K.response;
            if (!Q) {
              Q = [];
              for (var z = 0; z < K.responseText.length; ++z)
                Q.push(K.responseText.charCodeAt(z) & 255);
            }
            return W(null, typeof Uint8Array < "u" ? new Uint8Array(Q) : Q);
          }
          return W(null, K.responseText);
        }
      }),
        $.binary &&
          ("overrideMimeType" in K &&
            K.overrideMimeType("text/plain; charset=x-user-defined"),
          (K.responseType = "arraybuffer")),
        K.open("GET", j),
        K.send();
    }),
    fetch_1
  );
}
var path = {},
  hasRequiredPath;
function requirePath() {
  return (
    hasRequiredPath ||
      ((hasRequiredPath = 1),
      (function (q) {
        var U = q,
          F = (U.isAbsolute = function (j) {
            return /^(?:\/|\w+:)/.test(j);
          }),
          B = (U.normalize = function (j) {
            j = j.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
            var $ = j.split("/"),
              W = F(j),
              K = "";
            W && (K = $.shift() + "/");
            for (var G = 0; G < $.length; )
              $[G] === ".."
                ? G > 0 && $[G - 1] !== ".."
                  ? $.splice(--G, 2)
                  : W
                  ? $.splice(G, 1)
                  : ++G
                : $[G] === "."
                ? $.splice(G, 1)
                : ++G;
            return K + $.join("/");
          });
        U.resolve = function (j, $, W) {
          return (
            W || ($ = B($)),
            F($)
              ? $
              : (W || (j = B(j)),
                (j = j.replace(/(?:\/|^)[^/]+$/, "")).length
                  ? B(j + "/" + $)
                  : $)
          );
        };
      })(path)),
    path
  );
}
var namespace, hasRequiredNamespace;
function requireNamespace() {
  if (hasRequiredNamespace) return namespace;
  (hasRequiredNamespace = 1), (namespace = K);
  var q = requireObject();
  ((K.prototype = Object.create(q.prototype)).constructor = K).className =
    "Namespace";
  var U = requireField(),
    F = requireUtil(),
    B = requireOneof(),
    V,
    j,
    $;
  K.fromJSON = function (z, H) {
    return new K(z, H.options).addJSON(H.nested);
  };
  function W(Q, z) {
    if (Q && Q.length) {
      for (var H = {}, Y = 0; Y < Q.length; ++Y) H[Q[Y].name] = Q[Y].toJSON(z);
      return H;
    }
  }
  (K.arrayToJSON = W),
    (K.isReservedId = function (z, H) {
      if (z) {
        for (var Y = 0; Y < z.length; ++Y)
          if (typeof z[Y] != "string" && z[Y][0] <= H && z[Y][1] > H) return !0;
      }
      return !1;
    }),
    (K.isReservedName = function (z, H) {
      if (z) {
        for (var Y = 0; Y < z.length; ++Y) if (z[Y] === H) return !0;
      }
      return !1;
    });
  function K(Q, z) {
    q.call(this, Q, z), (this.nested = void 0), (this._nestedArray = null);
  }
  function G(Q) {
    return (Q._nestedArray = null), Q;
  }
  return (
    Object.defineProperty(K.prototype, "nestedArray", {
      get: function () {
        return (
          this._nestedArray || (this._nestedArray = F.toArray(this.nested))
        );
      },
    }),
    (K.prototype.toJSON = function (z) {
      return F.toObject([
        "options",
        this.options,
        "nested",
        W(this.nestedArray, z),
      ]);
    }),
    (K.prototype.addJSON = function (z) {
      var H = this;
      if (z)
        for (var Y = Object.keys(z), X = 0, Z; X < Y.length; ++X)
          (Z = z[Y[X]]),
            H.add(
              (Z.fields !== void 0
                ? V.fromJSON
                : Z.values !== void 0
                ? $.fromJSON
                : Z.methods !== void 0
                ? j.fromJSON
                : Z.id !== void 0
                ? U.fromJSON
                : K.fromJSON)(Y[X], Z)
            );
      return this;
    }),
    (K.prototype.get = function (z) {
      return (this.nested && this.nested[z]) || null;
    }),
    (K.prototype.getEnum = function (z) {
      if (this.nested && this.nested[z] instanceof $)
        return this.nested[z].values;
      throw Error("no such enum: " + z);
    }),
    (K.prototype.add = function (z) {
      if (
        !(
          (z instanceof U && z.extend !== void 0) ||
          z instanceof V ||
          z instanceof B ||
          z instanceof $ ||
          z instanceof j ||
          z instanceof K
        )
      )
        throw TypeError("object must be a valid nested object");
      if (!this.nested) this.nested = {};
      else {
        var H = this.get(z.name);
        if (H)
          if (
            H instanceof K &&
            z instanceof K &&
            !(H instanceof V || H instanceof j)
          ) {
            for (var Y = H.nestedArray, X = 0; X < Y.length; ++X) z.add(Y[X]);
            this.remove(H),
              this.nested || (this.nested = {}),
              z.setOptions(H.options, !0);
          } else throw Error("duplicate name '" + z.name + "' in " + this);
      }
      return (
        (this.nested[z.name] = z),
        this instanceof V ||
          this instanceof j ||
          this instanceof $ ||
          this instanceof U ||
          z._edition ||
          (z._edition = z._defaultEdition),
        z.onAdd(this),
        G(this)
      );
    }),
    (K.prototype.remove = function (z) {
      if (!(z instanceof q))
        throw TypeError("object must be a ReflectionObject");
      if (z.parent !== this) throw Error(z + " is not a member of " + this);
      return (
        delete this.nested[z.name],
        Object.keys(this.nested).length || (this.nested = void 0),
        z.onRemove(this),
        G(this)
      );
    }),
    (K.prototype.define = function (z, H) {
      if (F.isString(z)) z = z.split(".");
      else if (!Array.isArray(z)) throw TypeError("illegal path");
      if (z && z.length && z[0] === "") throw Error("path must be relative");
      for (var Y = this; z.length > 0; ) {
        var X = z.shift();
        if (Y.nested && Y.nested[X]) {
          if (((Y = Y.nested[X]), !(Y instanceof K)))
            throw Error("path conflicts with non-namespace objects");
        } else Y.add((Y = new K(X)));
      }
      return H && Y.addJSON(H), Y;
    }),
    (K.prototype.resolveAll = function () {
      var z = this.nestedArray,
        H = 0;
      for (this.resolve(); H < z.length; )
        z[H] instanceof K ? z[H++].resolveAll() : z[H++].resolve();
      return this;
    }),
    (K.prototype._resolveFeaturesRecursive = function (z) {
      return (
        (z = this._edition || z),
        q.prototype._resolveFeaturesRecursive.call(this, z),
        this.nestedArray.forEach((H) => {
          H._resolveFeaturesRecursive(z);
        }),
        this
      );
    }),
    (K.prototype.lookup = function (z, H, Y) {
      if (
        (typeof H == "boolean"
          ? ((Y = H), (H = void 0))
          : H && !Array.isArray(H) && (H = [H]),
        F.isString(z) && z.length)
      ) {
        if (z === ".") return this.root;
        z = z.split(".");
      } else if (!z.length) return this;
      if (z[0] === "") return this.root.lookup(z.slice(1), H);
      var X = this.get(z[0]);
      if (X) {
        if (z.length === 1) {
          if (!H || H.indexOf(X.constructor) > -1) return X;
        } else if (X instanceof K && (X = X.lookup(z.slice(1), H, !0)))
          return X;
      } else
        for (var Z = 0; Z < this.nestedArray.length; ++Z)
          if (
            this._nestedArray[Z] instanceof K &&
            (X = this._nestedArray[Z].lookup(z, H, !0))
          )
            return X;
      return this.parent === null || Y ? null : this.parent.lookup(z, H);
    }),
    (K.prototype.lookupType = function (z) {
      var H = this.lookup(z, [V]);
      if (!H) throw Error("no such type: " + z);
      return H;
    }),
    (K.prototype.lookupEnum = function (z) {
      var H = this.lookup(z, [$]);
      if (!H) throw Error("no such Enum '" + z + "' in " + this);
      return H;
    }),
    (K.prototype.lookupTypeOrEnum = function (z) {
      var H = this.lookup(z, [V, $]);
      if (!H) throw Error("no such Type or Enum '" + z + "' in " + this);
      return H;
    }),
    (K.prototype.lookupService = function (z) {
      var H = this.lookup(z, [j]);
      if (!H) throw Error("no such Service '" + z + "' in " + this);
      return H;
    }),
    (K._configure = function (Q, z, H) {
      (V = Q), (j = z), ($ = H);
    }),
    namespace
  );
}
var mapfield, hasRequiredMapfield;
function requireMapfield() {
  if (hasRequiredMapfield) return mapfield;
  (hasRequiredMapfield = 1), (mapfield = B);
  var q = requireField();
  ((B.prototype = Object.create(q.prototype)).constructor = B).className =
    "MapField";
  var U = requireTypes(),
    F = requireUtil();
  function B(V, j, $, W, K, G) {
    if ((q.call(this, V, j, W, void 0, void 0, K, G), !F.isString($)))
      throw TypeError("keyType must be a string");
    (this.keyType = $), (this.resolvedKeyType = null), (this.map = !0);
  }
  return (
    (B.fromJSON = function (j, $) {
      return new B(j, $.id, $.keyType, $.type, $.options, $.comment);
    }),
    (B.prototype.toJSON = function (j) {
      var $ = j ? !!j.keepComments : !1;
      return F.toObject([
        "keyType",
        this.keyType,
        "type",
        this.type,
        "id",
        this.id,
        "extend",
        this.extend,
        "options",
        this.options,
        "comment",
        $ ? this.comment : void 0,
      ]);
    }),
    (B.prototype.resolve = function () {
      if (this.resolved) return this;
      if (U.mapKey[this.keyType] === void 0)
        throw Error("invalid key type: " + this.keyType);
      return q.prototype.resolve.call(this);
    }),
    (B.d = function (j, $, W) {
      return (
        typeof W == "function"
          ? (W = F.decorateType(W).name)
          : W && typeof W == "object" && (W = F.decorateEnum(W).name),
        function (G, Q) {
          F.decorateType(G.constructor).add(new B(Q, j, $, W));
        }
      );
    }),
    mapfield
  );
}
var method, hasRequiredMethod;
function requireMethod() {
  if (hasRequiredMethod) return method;
  (hasRequiredMethod = 1), (method = F);
  var q = requireObject();
  ((F.prototype = Object.create(q.prototype)).constructor = F).className =
    "Method";
  var U = requireUtil();
  function F(B, V, j, $, W, K, G, Q, z) {
    if (
      (U.isObject(W)
        ? ((G = W), (W = K = void 0))
        : U.isObject(K) && ((G = K), (K = void 0)),
      !(V === void 0 || U.isString(V)))
    )
      throw TypeError("type must be a string");
    if (!U.isString(j)) throw TypeError("requestType must be a string");
    if (!U.isString($)) throw TypeError("responseType must be a string");
    q.call(this, B, G),
      (this.type = V || "rpc"),
      (this.requestType = j),
      (this.requestStream = W ? !0 : void 0),
      (this.responseType = $),
      (this.responseStream = K ? !0 : void 0),
      (this.resolvedRequestType = null),
      (this.resolvedResponseType = null),
      (this.comment = Q),
      (this.parsedOptions = z);
  }
  return (
    (F.fromJSON = function (V, j) {
      return new F(
        V,
        j.type,
        j.requestType,
        j.responseType,
        j.requestStream,
        j.responseStream,
        j.options,
        j.comment,
        j.parsedOptions
      );
    }),
    (F.prototype.toJSON = function (V) {
      var j = V ? !!V.keepComments : !1;
      return U.toObject([
        "type",
        (this.type !== "rpc" && this.type) || void 0,
        "requestType",
        this.requestType,
        "requestStream",
        this.requestStream,
        "responseType",
        this.responseType,
        "responseStream",
        this.responseStream,
        "options",
        this.options,
        "comment",
        j ? this.comment : void 0,
        "parsedOptions",
        this.parsedOptions,
      ]);
    }),
    (F.prototype.resolve = function () {
      return this.resolved
        ? this
        : ((this.resolvedRequestType = this.parent.lookupType(
            this.requestType
          )),
          (this.resolvedResponseType = this.parent.lookupType(
            this.responseType
          )),
          q.prototype.resolve.call(this));
    }),
    method
  );
}
var service, hasRequiredService;
function requireService() {
  if (hasRequiredService) return service;
  (hasRequiredService = 1), (service = V);
  var q = requireNamespace();
  ((V.prototype = Object.create(q.prototype)).constructor = V).className =
    "Service";
  var U = requireMethod(),
    F = requireUtil(),
    B = requireRpc();
  function V($, W) {
    q.call(this, $, W), (this.methods = {}), (this._methodsArray = null);
  }
  (V.fromJSON = function (W, K) {
    var G = new V(W, K.options);
    if (K.methods)
      for (var Q = Object.keys(K.methods), z = 0; z < Q.length; ++z)
        G.add(U.fromJSON(Q[z], K.methods[Q[z]]));
    return (
      K.nested && G.addJSON(K.nested),
      K.edition && (G._edition = K.edition),
      (G.comment = K.comment),
      (G._defaultEdition = "proto3"),
      G
    );
  }),
    (V.prototype.toJSON = function (W) {
      var K = q.prototype.toJSON.call(this, W),
        G = W ? !!W.keepComments : !1;
      return F.toObject([
        "edition",
        this._editionToJSON(),
        "options",
        (K && K.options) || void 0,
        "methods",
        q.arrayToJSON(this.methodsArray, W) || {},
        "nested",
        (K && K.nested) || void 0,
        "comment",
        G ? this.comment : void 0,
      ]);
    }),
    Object.defineProperty(V.prototype, "methodsArray", {
      get: function () {
        return (
          this._methodsArray || (this._methodsArray = F.toArray(this.methods))
        );
      },
    });
  function j($) {
    return ($._methodsArray = null), $;
  }
  return (
    (V.prototype.get = function (W) {
      return this.methods[W] || q.prototype.get.call(this, W);
    }),
    (V.prototype.resolveAll = function () {
      q.prototype.resolve.call(this);
      for (var W = this.methodsArray, K = 0; K < W.length; ++K) W[K].resolve();
      return this;
    }),
    (V.prototype._resolveFeaturesRecursive = function (W) {
      return (
        (W = this._edition || W),
        q.prototype._resolveFeaturesRecursive.call(this, W),
        this.methodsArray.forEach((K) => {
          K._resolveFeaturesRecursive(W);
        }),
        this
      );
    }),
    (V.prototype.add = function (W) {
      if (this.get(W.name))
        throw Error("duplicate name '" + W.name + "' in " + this);
      return W instanceof U
        ? ((this.methods[W.name] = W), (W.parent = this), j(this))
        : q.prototype.add.call(this, W);
    }),
    (V.prototype.remove = function (W) {
      if (W instanceof U) {
        if (this.methods[W.name] !== W)
          throw Error(W + " is not a member of " + this);
        return delete this.methods[W.name], (W.parent = null), j(this);
      }
      return q.prototype.remove.call(this, W);
    }),
    (V.prototype.create = function (W, K, G) {
      for (
        var Q = new B.Service(W, K, G), z = 0, H;
        z < this.methodsArray.length;
        ++z
      ) {
        var Y = F.lcFirst((H = this._methodsArray[z]).resolve().name).replace(
          /[^$\w_]/g,
          ""
        );
        Q[Y] = F.codegen(
          ["r", "c"],
          F.isReserved(Y) ? Y + "_" : Y
        )("return this.rpcCall(m,q,s,r,c)")({
          m: H,
          q: H.resolvedRequestType.ctor,
          s: H.resolvedResponseType.ctor,
        });
      }
      return Q;
    }),
    service
  );
}
var message, hasRequiredMessage;
function requireMessage() {
  if (hasRequiredMessage) return message;
  (hasRequiredMessage = 1), (message = U);
  var q = requireMinimal();
  function U(F) {
    if (F)
      for (var B = Object.keys(F), V = 0; V < B.length; ++V)
        this[B[V]] = F[B[V]];
  }
  return (
    (U.create = function (B) {
      return this.$type.create(B);
    }),
    (U.encode = function (B, V) {
      return this.$type.encode(B, V);
    }),
    (U.encodeDelimited = function (B, V) {
      return this.$type.encodeDelimited(B, V);
    }),
    (U.decode = function (B) {
      return this.$type.decode(B);
    }),
    (U.decodeDelimited = function (B) {
      return this.$type.decodeDelimited(B);
    }),
    (U.verify = function (B) {
      return this.$type.verify(B);
    }),
    (U.fromObject = function (B) {
      return this.$type.fromObject(B);
    }),
    (U.toObject = function (B, V) {
      return this.$type.toObject(B, V);
    }),
    (U.prototype.toJSON = function () {
      return this.$type.toObject(this, q.toJSONOptions);
    }),
    message
  );
}
var decoder_1, hasRequiredDecoder;
function requireDecoder() {
  if (hasRequiredDecoder) return decoder_1;
  (hasRequiredDecoder = 1), (decoder_1 = V);
  var q = require_enum(),
    U = requireTypes(),
    F = requireUtil();
  function B(j) {
    return "missing required '" + j.name + "'";
  }
  function V(j) {
    for (
      var $ = F.codegen(
          ["r", "l", "e"],
          j.name + "$decode"
        )("if(!(r instanceof Reader))")("r=Reader.create(r)")(
          "var c=l===undefined?r.len:r.pos+l,m=new this.ctor" +
            (j.fieldsArray.filter(function (H) {
              return H.map;
            }).length
              ? ",k,value"
              : "")
        )("while(r.pos<c){")("var t=r.uint32()")("if(t===e)")("break")(
          "switch(t>>>3){"
        ),
        W = 0;
      W < j.fieldsArray.length;
      ++W
    ) {
      var K = j._fieldsArray[W].resolve(),
        G = K.resolvedType instanceof q ? "int32" : K.type,
        Q = "m" + F.safeProp(K.name);
      $("case %i: {", K.id),
        K.map
          ? ($("if(%s===util.emptyObject)", Q)("%s={}", Q)(
              "var c2 = r.uint32()+r.pos"
            ),
            U.defaults[K.keyType] !== void 0
              ? $("k=%j", U.defaults[K.keyType])
              : $("k=null"),
            U.defaults[G] !== void 0
              ? $("value=%j", U.defaults[G])
              : $("value=null"),
            $("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")(
              "case 1: k=r.%s(); break",
              K.keyType
            )("case 2:"),
            U.basic[G] === void 0
              ? $("value=types[%i].decode(r,r.uint32())", W)
              : $("value=r.%s()", G),
            $("break")("default:")("r.skipType(tag2&7)")("break")("}")("}"),
            U.long[K.keyType] !== void 0
              ? $('%s[typeof k==="object"?util.longToHash(k):k]=value', Q)
              : $("%s[k]=value", Q))
          : K.repeated
          ? ($("if(!(%s&&%s.length))", Q, Q)("%s=[]", Q),
            U.packed[G] !== void 0 &&
              $("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")(
                "%s.push(r.%s())",
                Q,
                G
              )("}else"),
            U.basic[G] === void 0
              ? $(
                  K.delimited
                    ? "%s.push(types[%i].decode(r,undefined,((t&~7)|4)))"
                    : "%s.push(types[%i].decode(r,r.uint32()))",
                  Q,
                  W
                )
              : $("%s.push(r.%s())", Q, G))
          : U.basic[G] === void 0
          ? $(
              K.delimited
                ? "%s=types[%i].decode(r,undefined,((t&~7)|4))"
                : "%s=types[%i].decode(r,r.uint32())",
              Q,
              W
            )
          : $("%s=r.%s()", Q, G),
        $("break")("}");
    }
    for (
      $("default:")("r.skipType(t&7)")("break")("}")("}"), W = 0;
      W < j._fieldsArray.length;
      ++W
    ) {
      var z = j._fieldsArray[W];
      z.required &&
        $("if(!m.hasOwnProperty(%j))", z.name)(
          "throw util.ProtocolError(%j,{instance:m})",
          B(z)
        );
    }
    return $("return m");
  }
  return decoder_1;
}
var verifier_1, hasRequiredVerifier;
function requireVerifier() {
  if (hasRequiredVerifier) return verifier_1;
  (hasRequiredVerifier = 1), (verifier_1 = j);
  var q = require_enum(),
    U = requireUtil();
  function F($, W) {
    return (
      $.name +
      ": " +
      W +
      ($.repeated && W !== "array"
        ? "[]"
        : $.map && W !== "object"
        ? "{k:" + $.keyType + "}"
        : "") +
      " expected"
    );
  }
  function B($, W, K, G) {
    if (W.resolvedType)
      if (W.resolvedType instanceof q) {
        $("switch(%s){", G)("default:")("return%j", F(W, "enum value"));
        for (
          var Q = Object.keys(W.resolvedType.values), z = 0;
          z < Q.length;
          ++z
        )
          $("case %i:", W.resolvedType.values[Q[z]]);
        $("break")("}");
      } else
        $("{")("var e=types[%i].verify(%s);", K, G)("if(e)")(
          "return%j+e",
          W.name + "."
        )("}");
    else
      switch (W.type) {
        case "int32":
        case "uint32":
        case "sint32":
        case "fixed32":
        case "sfixed32":
          $("if(!util.isInteger(%s))", G)("return%j", F(W, "integer"));
          break;
        case "int64":
        case "uint64":
        case "sint64":
        case "fixed64":
        case "sfixed64":
          $(
            "if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))",
            G,
            G,
            G,
            G
          )("return%j", F(W, "integer|Long"));
          break;
        case "float":
        case "double":
          $('if(typeof %s!=="number")', G)("return%j", F(W, "number"));
          break;
        case "bool":
          $('if(typeof %s!=="boolean")', G)("return%j", F(W, "boolean"));
          break;
        case "string":
          $("if(!util.isString(%s))", G)("return%j", F(W, "string"));
          break;
        case "bytes":
          $(
            'if(!(%s&&typeof %s.length==="number"||util.isString(%s)))',
            G,
            G,
            G
          )("return%j", F(W, "buffer"));
          break;
      }
    return $;
  }
  function V($, W, K) {
    switch (W.keyType) {
      case "int32":
      case "uint32":
      case "sint32":
      case "fixed32":
      case "sfixed32":
        $("if(!util.key32Re.test(%s))", K)("return%j", F(W, "integer key"));
        break;
      case "int64":
      case "uint64":
      case "sint64":
      case "fixed64":
      case "sfixed64":
        $("if(!util.key64Re.test(%s))", K)(
          "return%j",
          F(W, "integer|Long key")
        );
        break;
      case "bool":
        $("if(!util.key2Re.test(%s))", K)("return%j", F(W, "boolean key"));
        break;
    }
    return $;
  }
  function j($) {
    var W = U.codegen(
        ["m"],
        $.name + "$verify"
      )('if(typeof m!=="object"||m===null)')("return%j", "object expected"),
      K = $.oneofsArray,
      G = {};
    K.length && W("var p={}");
    for (var Q = 0; Q < $.fieldsArray.length; ++Q) {
      var z = $._fieldsArray[Q].resolve(),
        H = "m" + U.safeProp(z.name);
      if (
        (z.optional && W("if(%s!=null&&m.hasOwnProperty(%j)){", H, z.name),
        z.map)
      )
        W("if(!util.isObject(%s))", H)("return%j", F(z, "object"))(
          "var k=Object.keys(%s)",
          H
        )("for(var i=0;i<k.length;++i){"),
          V(W, z, "k[i]"),
          B(W, z, Q, H + "[k[i]]")("}");
      else if (z.repeated)
        W("if(!Array.isArray(%s))", H)("return%j", F(z, "array"))(
          "for(var i=0;i<%s.length;++i){",
          H
        ),
          B(W, z, Q, H + "[i]")("}");
      else {
        if (z.partOf) {
          var Y = U.safeProp(z.partOf.name);
          G[z.partOf.name] === 1 &&
            W("if(p%s===1)", Y)(
              "return%j",
              z.partOf.name + ": multiple values"
            ),
            (G[z.partOf.name] = 1),
            W("p%s=1", Y);
        }
        B(W, z, Q, H);
      }
      z.optional && W("}");
    }
    return W("return null");
  }
  return verifier_1;
}
var converter = {},
  hasRequiredConverter;
function requireConverter() {
  return (
    hasRequiredConverter ||
      ((hasRequiredConverter = 1),
      (function (q) {
        var U = q,
          F = require_enum(),
          B = requireUtil();
        function V($, W, K, G) {
          var Q = !1;
          if (W.resolvedType)
            if (W.resolvedType instanceof F) {
              $("switch(d%s){", G);
              for (
                var z = W.resolvedType.values, H = Object.keys(z), Y = 0;
                Y < H.length;
                ++Y
              )
                z[H[Y]] === W.typeDefault &&
                  !Q &&
                  ($("default:")(
                    'if(typeof(d%s)==="number"){m%s=d%s;break}',
                    G,
                    G,
                    G
                  ),
                  W.repeated || $("break"),
                  (Q = !0)),
                  $("case%j:", H[Y])("case %i:", z[H[Y]])("m%s=%j", G, z[H[Y]])(
                    "break"
                  );
              $("}");
            } else
              $('if(typeof d%s!=="object")', G)(
                "throw TypeError(%j)",
                W.fullName + ": object expected"
              )("m%s=types[%i].fromObject(d%s)", G, K, G);
          else {
            var X = !1;
            switch (W.type) {
              case "double":
              case "float":
                $("m%s=Number(d%s)", G, G);
                break;
              case "uint32":
              case "fixed32":
                $("m%s=d%s>>>0", G, G);
                break;
              case "int32":
              case "sint32":
              case "sfixed32":
                $("m%s=d%s|0", G, G);
                break;
              case "uint64":
                X = !0;
              case "int64":
              case "sint64":
              case "fixed64":
              case "sfixed64":
                $("if(util.Long)")(
                  "(m%s=util.Long.fromValue(d%s)).unsigned=%j",
                  G,
                  G,
                  X
                )('else if(typeof d%s==="string")', G)(
                  "m%s=parseInt(d%s,10)",
                  G,
                  G
                )('else if(typeof d%s==="number")', G)(
                  "m%s=d%s",
                  G,
                  G
                )('else if(typeof d%s==="object")', G)(
                  "m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)",
                  G,
                  G,
                  G,
                  X ? "true" : ""
                );
                break;
              case "bytes":
                $('if(typeof d%s==="string")', G)(
                  "util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)",
                  G,
                  G,
                  G
                )("else if(d%s.length >= 0)", G)("m%s=d%s", G, G);
                break;
              case "string":
                $("m%s=String(d%s)", G, G);
                break;
              case "bool":
                $("m%s=Boolean(d%s)", G, G);
                break;
            }
          }
          return $;
        }
        U.fromObject = function (W) {
          var K = W.fieldsArray,
            G = B.codegen(
              ["d"],
              W.name + "$fromObject"
            )("if(d instanceof this.ctor)")("return d");
          if (!K.length) return G("return new this.ctor");
          G("var m=new this.ctor");
          for (var Q = 0; Q < K.length; ++Q) {
            var z = K[Q].resolve(),
              H = B.safeProp(z.name);
            z.map
              ? (G("if(d%s){", H)('if(typeof d%s!=="object")', H)(
                  "throw TypeError(%j)",
                  z.fullName + ": object expected"
                )("m%s={}", H)(
                  "for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){",
                  H
                ),
                V(G, z, Q, H + "[ks[i]]")("}")("}"))
              : z.repeated
              ? (G("if(d%s){", H)("if(!Array.isArray(d%s))", H)(
                  "throw TypeError(%j)",
                  z.fullName + ": array expected"
                )("m%s=[]", H)("for(var i=0;i<d%s.length;++i){", H),
                V(G, z, Q, H + "[i]")("}")("}"))
              : (z.resolvedType instanceof F || G("if(d%s!=null){", H),
                V(G, z, Q, H),
                z.resolvedType instanceof F || G("}"));
          }
          return G("return m");
        };
        function j($, W, K, G) {
          if (W.resolvedType)
            W.resolvedType instanceof F
              ? $(
                  "d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s",
                  G,
                  K,
                  G,
                  G,
                  K,
                  G,
                  G
                )
              : $("d%s=types[%i].toObject(m%s,o)", G, K, G);
          else {
            var Q = !1;
            switch (W.type) {
              case "double":
              case "float":
                $("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", G, G, G, G);
                break;
              case "uint64":
                Q = !0;
              case "int64":
              case "sint64":
              case "fixed64":
              case "sfixed64":
                $('if(typeof m%s==="number")', G)(
                  "d%s=o.longs===String?String(m%s):m%s",
                  G,
                  G,
                  G
                )("else")(
                  "d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s",
                  G,
                  G,
                  G,
                  G,
                  Q ? "true" : "",
                  G
                );
                break;
              case "bytes":
                $(
                  "d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s",
                  G,
                  G,
                  G,
                  G,
                  G
                );
                break;
              default:
                $("d%s=m%s", G, G);
                break;
            }
          }
          return $;
        }
        U.toObject = function (W) {
          var K = W.fieldsArray.slice().sort(B.compareFieldsById);
          if (!K.length) return B.codegen()("return {}");
          for (
            var G = B.codegen(["m", "o"], W.name + "$toObject")("if(!o)")(
                "o={}"
              )("var d={}"),
              Q = [],
              z = [],
              H = [],
              Y = 0;
            Y < K.length;
            ++Y
          )
            K[Y].partOf ||
              (K[Y].resolve().repeated ? Q : K[Y].map ? z : H).push(K[Y]);
          if (Q.length) {
            for (G("if(o.arrays||o.defaults){"), Y = 0; Y < Q.length; ++Y)
              G("d%s=[]", B.safeProp(Q[Y].name));
            G("}");
          }
          if (z.length) {
            for (G("if(o.objects||o.defaults){"), Y = 0; Y < z.length; ++Y)
              G("d%s={}", B.safeProp(z[Y].name));
            G("}");
          }
          if (H.length) {
            for (G("if(o.defaults){"), Y = 0; Y < H.length; ++Y) {
              var X = H[Y],
                Z = B.safeProp(X.name);
              if (X.resolvedType instanceof F)
                G(
                  "d%s=o.enums===String?%j:%j",
                  Z,
                  X.resolvedType.valuesById[X.typeDefault],
                  X.typeDefault
                );
              else if (X.long)
                G("if(util.Long){")(
                  "var n=new util.Long(%i,%i,%j)",
                  X.typeDefault.low,
                  X.typeDefault.high,
                  X.typeDefault.unsigned
                )(
                  "d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n",
                  Z
                )("}else")(
                  "d%s=o.longs===String?%j:%i",
                  Z,
                  X.typeDefault.toString(),
                  X.typeDefault.toNumber()
                );
              else if (X.bytes) {
                var ie =
                  "[" +
                  Array.prototype.slice.call(X.typeDefault).join(",") +
                  "]";
                G(
                  "if(o.bytes===String)d%s=%j",
                  Z,
                  String.fromCharCode.apply(String, X.typeDefault)
                )("else{")("d%s=%s", Z, ie)(
                  "if(o.bytes!==Array)d%s=util.newBuffer(d%s)",
                  Z,
                  Z
                )("}");
              } else G("d%s=%j", Z, X.typeDefault);
            }
            G("}");
          }
          var ee = !1;
          for (Y = 0; Y < K.length; ++Y) {
            var X = K[Y],
              te = W._fieldsArray.indexOf(X),
              Z = B.safeProp(X.name);
            X.map
              ? (ee || ((ee = !0), G("var ks2")),
                G("if(m%s&&(ks2=Object.keys(m%s)).length){", Z, Z)("d%s={}", Z)(
                  "for(var j=0;j<ks2.length;++j){"
                ),
                j(G, X, te, Z + "[ks2[j]]")("}"))
              : X.repeated
              ? (G("if(m%s&&m%s.length){", Z, Z)("d%s=[]", Z)(
                  "for(var j=0;j<m%s.length;++j){",
                  Z
                ),
                j(G, X, te, Z + "[j]")("}"))
              : (G("if(m%s!=null&&m.hasOwnProperty(%j)){", Z, X.name),
                j(G, X, te, Z),
                X.partOf &&
                  G("if(o.oneofs)")(
                    "d%s=%j",
                    B.safeProp(X.partOf.name),
                    X.name
                  )),
              G("}");
          }
          return G("return d");
        };
      })(converter)),
    converter
  );
}
var wrappers = {},
  hasRequiredWrappers;
function requireWrappers() {
  return (
    hasRequiredWrappers ||
      ((hasRequiredWrappers = 1),
      (function (q) {
        var U = q,
          F = requireMessage();
        U[".google.protobuf.Any"] = {
          fromObject: function (B) {
            if (B && B["@type"]) {
              var V = B["@type"].substring(B["@type"].lastIndexOf("/") + 1),
                j = this.lookup(V);
              if (j) {
                var $ =
                  B["@type"].charAt(0) === "."
                    ? B["@type"].slice(1)
                    : B["@type"];
                return (
                  $.indexOf("/") === -1 && ($ = "/" + $),
                  this.create({
                    type_url: $,
                    value: j.encode(j.fromObject(B)).finish(),
                  })
                );
              }
            }
            return this.fromObject(B);
          },
          toObject: function (B, V) {
            var j = "type.googleapis.com/",
              $ = "",
              W = "";
            if (V && V.json && B.type_url && B.value) {
              (W = B.type_url.substring(B.type_url.lastIndexOf("/") + 1)),
                ($ = B.type_url.substring(0, B.type_url.lastIndexOf("/") + 1));
              var K = this.lookup(W);
              K && (B = K.decode(B.value));
            }
            if (!(B instanceof this.ctor) && B instanceof F) {
              var G = B.$type.toObject(B, V),
                Q =
                  B.$type.fullName[0] === "."
                    ? B.$type.fullName.slice(1)
                    : B.$type.fullName;
              return $ === "" && ($ = j), (W = $ + Q), (G["@type"] = W), G;
            }
            return this.toObject(B, V);
          },
        };
      })(wrappers)),
    wrappers
  );
}
var type, hasRequiredType;
function requireType() {
  if (hasRequiredType) return type;
  (hasRequiredType = 1), (type = Z);
  var q = requireNamespace();
  ((Z.prototype = Object.create(q.prototype)).constructor = Z).className =
    "Type";
  var U = require_enum(),
    F = requireOneof(),
    B = requireField(),
    V = requireMapfield(),
    j = requireService(),
    $ = requireMessage(),
    W = requireReader(),
    K = requireWriter(),
    G = requireUtil(),
    Q = requireEncoder(),
    z = requireDecoder(),
    H = requireVerifier(),
    Y = requireConverter(),
    X = requireWrappers();
  function Z(ee, te) {
    q.call(this, ee, te),
      (this.fields = {}),
      (this.oneofs = void 0),
      (this.extensions = void 0),
      (this.reserved = void 0),
      (this.group = void 0),
      (this._fieldsById = null),
      (this._fieldsArray = null),
      (this._oneofsArray = null),
      (this._ctor = null);
  }
  Object.defineProperties(Z.prototype, {
    fieldsById: {
      get: function () {
        if (this._fieldsById) return this._fieldsById;
        this._fieldsById = {};
        for (var ee = Object.keys(this.fields), te = 0; te < ee.length; ++te) {
          var re = this.fields[ee[te]],
            ne = re.id;
          if (this._fieldsById[ne])
            throw Error("duplicate id " + ne + " in " + this);
          this._fieldsById[ne] = re;
        }
        return this._fieldsById;
      },
    },
    fieldsArray: {
      get: function () {
        return (
          this._fieldsArray || (this._fieldsArray = G.toArray(this.fields))
        );
      },
    },
    oneofsArray: {
      get: function () {
        return (
          this._oneofsArray || (this._oneofsArray = G.toArray(this.oneofs))
        );
      },
    },
    ctor: {
      get: function () {
        return this._ctor || (this.ctor = Z.generateConstructor(this)());
      },
      set: function (ee) {
        var te = ee.prototype;
        te instanceof $ ||
          (((ee.prototype = new $()).constructor = ee),
          G.merge(ee.prototype, te)),
          (ee.$type = ee.prototype.$type = this),
          G.merge(ee, $, !0),
          (this._ctor = ee);
        for (var re = 0; re < this.fieldsArray.length; ++re)
          this._fieldsArray[re].resolve();
        var ne = {};
        for (re = 0; re < this.oneofsArray.length; ++re)
          ne[this._oneofsArray[re].resolve().name] = {
            get: G.oneOfGetter(this._oneofsArray[re].oneof),
            set: G.oneOfSetter(this._oneofsArray[re].oneof),
          };
        re && Object.defineProperties(ee.prototype, ne);
      },
    },
  }),
    (Z.generateConstructor = function (te) {
      for (
        var re = G.codegen(["p"], te.name), ne = 0, se;
        ne < te.fieldsArray.length;
        ++ne
      )
        (se = te._fieldsArray[ne]).map
          ? re("this%s={}", G.safeProp(se.name))
          : se.repeated && re("this%s=[]", G.safeProp(se.name));
      return re(
        "if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)"
      )("this[ks[i]]=p[ks[i]]");
    });
  function ie(ee) {
    return (
      (ee._fieldsById = ee._fieldsArray = ee._oneofsArray = null),
      delete ee.encode,
      delete ee.decode,
      delete ee.verify,
      ee
    );
  }
  return (
    (Z.fromJSON = function (te, re) {
      var ne = new Z(te, re.options);
      (ne.extensions = re.extensions), (ne.reserved = re.reserved);
      for (var se = Object.keys(re.fields), oe = 0; oe < se.length; ++oe)
        ne.add(
          (typeof re.fields[se[oe]].keyType < "u" ? V.fromJSON : B.fromJSON)(
            se[oe],
            re.fields[se[oe]]
          )
        );
      if (re.oneofs)
        for (se = Object.keys(re.oneofs), oe = 0; oe < se.length; ++oe)
          ne.add(F.fromJSON(se[oe], re.oneofs[se[oe]]));
      if (re.nested)
        for (se = Object.keys(re.nested), oe = 0; oe < se.length; ++oe) {
          var le = re.nested[se[oe]];
          ne.add(
            (le.id !== void 0
              ? B.fromJSON
              : le.fields !== void 0
              ? Z.fromJSON
              : le.values !== void 0
              ? U.fromJSON
              : le.methods !== void 0
              ? j.fromJSON
              : q.fromJSON)(se[oe], le)
          );
        }
      return (
        re.extensions &&
          re.extensions.length &&
          (ne.extensions = re.extensions),
        re.reserved && re.reserved.length && (ne.reserved = re.reserved),
        re.group && (ne.group = !0),
        re.comment && (ne.comment = re.comment),
        re.edition && (ne._edition = re.edition),
        (ne._defaultEdition = "proto3"),
        ne
      );
    }),
    (Z.prototype.toJSON = function (te) {
      var re = q.prototype.toJSON.call(this, te),
        ne = te ? !!te.keepComments : !1;
      return G.toObject([
        "edition",
        this._editionToJSON(),
        "options",
        (re && re.options) || void 0,
        "oneofs",
        q.arrayToJSON(this.oneofsArray, te),
        "fields",
        q.arrayToJSON(
          this.fieldsArray.filter(function (se) {
            return !se.declaringField;
          }),
          te
        ) || {},
        "extensions",
        this.extensions && this.extensions.length ? this.extensions : void 0,
        "reserved",
        this.reserved && this.reserved.length ? this.reserved : void 0,
        "group",
        this.group || void 0,
        "nested",
        (re && re.nested) || void 0,
        "comment",
        ne ? this.comment : void 0,
      ]);
    }),
    (Z.prototype.resolveAll = function () {
      q.prototype.resolveAll.call(this);
      var te = this.oneofsArray;
      for (ne = 0; ne < te.length; ) te[ne++].resolve();
      for (var re = this.fieldsArray, ne = 0; ne < re.length; )
        re[ne++].resolve();
      return this;
    }),
    (Z.prototype._resolveFeaturesRecursive = function (te) {
      return (
        (te = this._edition || te),
        q.prototype._resolveFeaturesRecursive.call(this, te),
        this.oneofsArray.forEach((re) => {
          re._resolveFeatures(te);
        }),
        this.fieldsArray.forEach((re) => {
          re._resolveFeatures(te);
        }),
        this
      );
    }),
    (Z.prototype.get = function (te) {
      return (
        this.fields[te] ||
        (this.oneofs && this.oneofs[te]) ||
        (this.nested && this.nested[te]) ||
        null
      );
    }),
    (Z.prototype.add = function (te) {
      if (this.get(te.name))
        throw Error("duplicate name '" + te.name + "' in " + this);
      if (te instanceof B && te.extend === void 0) {
        if (this._fieldsById ? this._fieldsById[te.id] : this.fieldsById[te.id])
          throw Error("duplicate id " + te.id + " in " + this);
        if (this.isReservedId(te.id))
          throw Error("id " + te.id + " is reserved in " + this);
        if (this.isReservedName(te.name))
          throw Error("name '" + te.name + "' is reserved in " + this);
        return (
          te.parent && te.parent.remove(te),
          (this.fields[te.name] = te),
          (te.message = this),
          te.onAdd(this),
          ie(this)
        );
      }
      return te instanceof F
        ? (this.oneofs || (this.oneofs = {}),
          (this.oneofs[te.name] = te),
          te.onAdd(this),
          ie(this))
        : q.prototype.add.call(this, te);
    }),
    (Z.prototype.remove = function (te) {
      if (te instanceof B && te.extend === void 0) {
        if (!this.fields || this.fields[te.name] !== te)
          throw Error(te + " is not a member of " + this);
        return (
          delete this.fields[te.name],
          (te.parent = null),
          te.onRemove(this),
          ie(this)
        );
      }
      if (te instanceof F) {
        if (!this.oneofs || this.oneofs[te.name] !== te)
          throw Error(te + " is not a member of " + this);
        return (
          delete this.oneofs[te.name],
          (te.parent = null),
          te.onRemove(this),
          ie(this)
        );
      }
      return q.prototype.remove.call(this, te);
    }),
    (Z.prototype.isReservedId = function (te) {
      return q.isReservedId(this.reserved, te);
    }),
    (Z.prototype.isReservedName = function (te) {
      return q.isReservedName(this.reserved, te);
    }),
    (Z.prototype.create = function (te) {
      return new this.ctor(te);
    }),
    (Z.prototype.setup = function () {
      for (
        var te = this.fullName, re = [], ne = 0;
        ne < this.fieldsArray.length;
        ++ne
      )
        re.push(this._fieldsArray[ne].resolve().resolvedType);
      (this.encode = Q(this)({ Writer: K, types: re, util: G })),
        (this.decode = z(this)({ Reader: W, types: re, util: G })),
        (this.verify = H(this)({ types: re, util: G })),
        (this.fromObject = Y.fromObject(this)({ types: re, util: G })),
        (this.toObject = Y.toObject(this)({ types: re, util: G }));
      var se = X[te];
      if (se) {
        var oe = Object.create(this);
        (oe.fromObject = this.fromObject),
          (this.fromObject = se.fromObject.bind(oe)),
          (oe.toObject = this.toObject),
          (this.toObject = se.toObject.bind(oe));
      }
      return this;
    }),
    (Z.prototype.encode = function (te, re) {
      return this.setup().encode(te, re);
    }),
    (Z.prototype.encodeDelimited = function (te, re) {
      return this.encode(te, re && re.len ? re.fork() : re).ldelim();
    }),
    (Z.prototype.decode = function (te, re) {
      return this.setup().decode(te, re);
    }),
    (Z.prototype.decodeDelimited = function (te) {
      return (
        te instanceof W || (te = W.create(te)), this.decode(te, te.uint32())
      );
    }),
    (Z.prototype.verify = function (te) {
      return this.setup().verify(te);
    }),
    (Z.prototype.fromObject = function (te) {
      return this.setup().fromObject(te);
    }),
    (Z.prototype.toObject = function (te, re) {
      return this.setup().toObject(te, re);
    }),
    (Z.d = function (te) {
      return function (ne) {
        G.decorateType(ne, te);
      };
    }),
    type
  );
}
var root, hasRequiredRoot;
function requireRoot() {
  if (hasRequiredRoot) return root;
  (hasRequiredRoot = 1), (root = K);
  var q = requireNamespace();
  ((K.prototype = Object.create(q.prototype)).constructor = K).className =
    "Root";
  var U = requireField(),
    F = require_enum(),
    B = requireOneof(),
    V = requireUtil(),
    j,
    $,
    W;
  function K(H) {
    q.call(this, "", H),
      (this.deferred = []),
      (this.files = []),
      (this._edition = "proto2");
  }
  (K.fromJSON = function (Y, X) {
    return (
      X || (X = new K()),
      Y.options && X.setOptions(Y.options),
      X.addJSON(Y.nested).resolveAll()
    );
  }),
    (K.prototype.resolvePath = V.path.resolve),
    (K.prototype.fetch = V.fetch);
  function G() {}
  (K.prototype.load = function H(Y, X, Z) {
    typeof X == "function" && ((Z = X), (X = void 0));
    var ie = this;
    if (!Z) return V.asPromise(H, ie, Y, X);
    var ee = Z === G;
    function te(pe, he) {
      if (Z) {
        if (ee) throw pe;
        var ue = Z;
        (Z = null), he && he.resolveAll(), ue(pe, he);
      }
    }
    function re(pe) {
      var he = pe.lastIndexOf("google/protobuf/");
      if (he > -1) {
        var ue = pe.substring(he);
        if (ue in W) return ue;
      }
      return null;
    }
    function ne(pe, he) {
      try {
        if (
          (V.isString(he) && he.charAt(0) === "{" && (he = JSON.parse(he)),
          !V.isString(he))
        )
          ie.setOptions(he.options).addJSON(he.nested);
        else {
          $.filename = pe;
          var ue = $(he, ie, X),
            Te,
            we = 0;
          if (ue.imports)
            for (; we < ue.imports.length; ++we)
              (Te = re(ue.imports[we]) || ie.resolvePath(pe, ue.imports[we])) &&
                se(Te);
          if (ue.weakImports)
            for (we = 0; we < ue.weakImports.length; ++we)
              (Te =
                re(ue.weakImports[we]) ||
                ie.resolvePath(pe, ue.weakImports[we])) && se(Te, !0);
        }
      } catch (me) {
        te(me);
      }
      !ee && !oe && te(null, ie);
    }
    function se(pe, he) {
      if (((pe = re(pe) || pe), !(ie.files.indexOf(pe) > -1))) {
        if ((ie.files.push(pe), pe in W)) {
          ee
            ? ne(pe, W[pe])
            : (++oe,
              setTimeout(function () {
                --oe, ne(pe, W[pe]);
              }));
          return;
        }
        if (ee) {
          var ue;
          try {
            ue = V.fs.readFileSync(pe).toString("utf8");
          } catch (Te) {
            he || te(Te);
            return;
          }
          ne(pe, ue);
        } else
          ++oe,
            ie.fetch(pe, function (Te, we) {
              if ((--oe, !!Z)) {
                if (Te) {
                  he ? oe || te(null, ie) : te(Te);
                  return;
                }
                ne(pe, we);
              }
            });
      }
    }
    var oe = 0;
    V.isString(Y) && (Y = [Y]);
    for (var le = 0, fe; le < Y.length; ++le)
      (fe = ie.resolvePath("", Y[le])) && se(fe);
    return ie.resolveAll(), ee || oe || te(null, ie), ie;
  }),
    (K.prototype.loadSync = function (Y, X) {
      if (!V.isNode) throw Error("not supported");
      return this.load(Y, X, G);
    }),
    (K.prototype.resolveAll = function () {
      if (this.deferred.length)
        throw Error(
          "unresolvable extensions: " +
            this.deferred
              .map(function (Y) {
                return "'extend " + Y.extend + "' in " + Y.parent.fullName;
              })
              .join(", ")
        );
      return q.prototype.resolveAll.call(this);
    });
  var Q = /^[A-Z]/;
  function z(H, Y) {
    var X = Y.parent.lookup(Y.extend);
    if (X) {
      var Z = new U(Y.fullName, Y.id, Y.type, Y.rule, void 0, Y.options);
      return (
        X.get(Z.name) ||
          ((Z.declaringField = Y), (Y.extensionField = Z), X.add(Z)),
        !0
      );
    }
    return !1;
  }
  return (
    (K.prototype._handleAdd = function (Y) {
      if (Y instanceof U)
        Y.extend !== void 0 &&
          !Y.extensionField &&
          (z(this, Y) || this.deferred.push(Y));
      else if (Y instanceof F) Q.test(Y.name) && (Y.parent[Y.name] = Y.values);
      else if (!(Y instanceof B)) {
        if (Y instanceof j)
          for (var X = 0; X < this.deferred.length; )
            z(this, this.deferred[X]) ? this.deferred.splice(X, 1) : ++X;
        for (var Z = 0; Z < Y.nestedArray.length; ++Z)
          this._handleAdd(Y._nestedArray[Z]);
        Q.test(Y.name) && (Y.parent[Y.name] = Y);
      }
    }),
    (K.prototype._handleRemove = function (Y) {
      if (Y instanceof U) {
        if (Y.extend !== void 0)
          if (Y.extensionField)
            Y.extensionField.parent.remove(Y.extensionField),
              (Y.extensionField = null);
          else {
            var X = this.deferred.indexOf(Y);
            X > -1 && this.deferred.splice(X, 1);
          }
      } else if (Y instanceof F) Q.test(Y.name) && delete Y.parent[Y.name];
      else if (Y instanceof q) {
        for (var Z = 0; Z < Y.nestedArray.length; ++Z)
          this._handleRemove(Y._nestedArray[Z]);
        Q.test(Y.name) && delete Y.parent[Y.name];
      }
    }),
    (K._configure = function (H, Y, X) {
      (j = H), ($ = Y), (W = X);
    }),
    root
  );
}
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util.exports;
  hasRequiredUtil = 1;
  var q = (util.exports = requireMinimal()),
    U = requireRoots(),
    F,
    B;
  (q.codegen = requireCodegen()),
    (q.fetch = requireFetch()),
    (q.path = requirePath()),
    (q.fs = q.inquire("fs")),
    (q.toArray = function (G) {
      if (G) {
        for (
          var Q = Object.keys(G), z = new Array(Q.length), H = 0;
          H < Q.length;

        )
          z[H] = G[Q[H++]];
        return z;
      }
      return [];
    }),
    (q.toObject = function (G) {
      for (var Q = {}, z = 0; z < G.length; ) {
        var H = G[z++],
          Y = G[z++];
        Y !== void 0 && (Q[H] = Y);
      }
      return Q;
    });
  var V = /\\/g,
    j = /"/g;
  (q.isReserved = function (G) {
    return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(
      G
    );
  }),
    (q.safeProp = function (G) {
      return !/^[$\w_]+$/.test(G) || q.isReserved(G)
        ? '["' + G.replace(V, "\\\\").replace(j, '\\"') + '"]'
        : "." + G;
    }),
    (q.ucFirst = function (G) {
      return G.charAt(0).toUpperCase() + G.substring(1);
    });
  var $ = /_([a-z])/g;
  (q.camelCase = function (G) {
    return (
      G.substring(0, 1) +
      G.substring(1).replace($, function (Q, z) {
        return z.toUpperCase();
      })
    );
  }),
    (q.compareFieldsById = function (G, Q) {
      return G.id - Q.id;
    }),
    (q.decorateType = function (G, Q) {
      if (G.$type)
        return (
          Q &&
            G.$type.name !== Q &&
            (q.decorateRoot.remove(G.$type),
            (G.$type.name = Q),
            q.decorateRoot.add(G.$type)),
          G.$type
        );
      F || (F = requireType());
      var z = new F(Q || G.name);
      return (
        q.decorateRoot.add(z),
        (z.ctor = G),
        Object.defineProperty(G, "$type", { value: z, enumerable: !1 }),
        Object.defineProperty(G.prototype, "$type", {
          value: z,
          enumerable: !1,
        }),
        z
      );
    });
  var W = 0;
  return (
    (q.decorateEnum = function (G) {
      if (G.$type) return G.$type;
      B || (B = require_enum());
      var Q = new B("Enum" + W++, G);
      return (
        q.decorateRoot.add(Q),
        Object.defineProperty(G, "$type", { value: Q, enumerable: !1 }),
        Q
      );
    }),
    (q.setProperty = function (G, Q, z, H) {
      function Y(X, Z, ie) {
        var ee = Z.shift();
        if (ee === "__proto__" || ee === "prototype") return X;
        if (Z.length > 0) X[ee] = Y(X[ee] || {}, Z, ie);
        else {
          var te = X[ee];
          if (te && H) return X;
          te && (ie = [].concat(te).concat(ie)), (X[ee] = ie);
        }
        return X;
      }
      if (typeof G != "object") throw TypeError("dst must be an object");
      if (!Q) throw TypeError("path must be specified");
      return (Q = Q.split(".")), Y(G, Q, z);
    }),
    Object.defineProperty(q, "decorateRoot", {
      get: function () {
        return U.decorated || (U.decorated = new (requireRoot())());
      },
    }),
    util.exports
  );
}
var hasRequiredTypes;
function requireTypes() {
  return (
    hasRequiredTypes ||
      ((hasRequiredTypes = 1),
      (function (q) {
        var U = q,
          F = requireUtil(),
          B = [
            "double",
            "float",
            "int32",
            "uint32",
            "sint32",
            "fixed32",
            "sfixed32",
            "int64",
            "uint64",
            "sint64",
            "fixed64",
            "sfixed64",
            "bool",
            "string",
            "bytes",
          ];
        function V(j, $) {
          var W = 0,
            K = {};
          for ($ |= 0; W < j.length; ) K[B[W + $]] = j[W++];
          return K;
        }
        (U.basic = V([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2, 2])),
          (U.defaults = V([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            !1,
            "",
            F.emptyArray,
            null,
          ])),
          (U.long = V([0, 0, 0, 1, 1], 7)),
          (U.mapKey = V([0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2], 2)),
          (U.packed = V([1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0]));
      })(types)),
    types
  );
}
var field, hasRequiredField;
function requireField() {
  if (hasRequiredField) return field;
  (hasRequiredField = 1), (field = $);
  var q = requireObject();
  (($.prototype = Object.create(q.prototype)).constructor = $).className =
    "Field";
  var U = require_enum(),
    F = requireTypes(),
    B = requireUtil(),
    V,
    j = /^required|optional|repeated$/;
  $.fromJSON = function (K, G) {
    var Q = new $(K, G.id, G.type, G.rule, G.extend, G.options, G.comment);
    return (
      G.edition && (Q._edition = G.edition), (Q._defaultEdition = "proto3"), Q
    );
  };
  function $(W, K, G, Q, z, H, Y) {
    if (
      (B.isObject(Q)
        ? ((Y = z), (H = Q), (Q = z = void 0))
        : B.isObject(z) && ((Y = H), (H = z), (z = void 0)),
      q.call(this, W, H),
      !B.isInteger(K) || K < 0)
    )
      throw TypeError("id must be a non-negative integer");
    if (!B.isString(G)) throw TypeError("type must be a string");
    if (Q !== void 0 && !j.test((Q = Q.toString().toLowerCase())))
      throw TypeError("rule must be a string rule");
    if (z !== void 0 && !B.isString(z))
      throw TypeError("extend must be a string");
    Q === "proto3_optional" && (Q = "optional"),
      (this.rule = Q && Q !== "optional" ? Q : void 0),
      (this.type = G),
      (this.id = K),
      (this.extend = z || void 0),
      (this.repeated = Q === "repeated"),
      (this.map = !1),
      (this.message = null),
      (this.partOf = null),
      (this.typeDefault = null),
      (this.defaultValue = null),
      (this.long = B.Long ? F.long[G] !== void 0 : !1),
      (this.bytes = G === "bytes"),
      (this.resolvedType = null),
      (this.extensionField = null),
      (this.declaringField = null),
      (this.comment = Y);
  }
  return (
    Object.defineProperty($.prototype, "required", {
      get: function () {
        return this._features.field_presence === "LEGACY_REQUIRED";
      },
    }),
    Object.defineProperty($.prototype, "optional", {
      get: function () {
        return !this.required;
      },
    }),
    Object.defineProperty($.prototype, "delimited", {
      get: function () {
        return (
          this.resolvedType instanceof V &&
          this._features.message_encoding === "DELIMITED"
        );
      },
    }),
    Object.defineProperty($.prototype, "packed", {
      get: function () {
        return this._features.repeated_field_encoding === "PACKED";
      },
    }),
    Object.defineProperty($.prototype, "hasPresence", {
      get: function () {
        return this.repeated || this.map
          ? !1
          : this.partOf ||
              this.declaringField ||
              this.extensionField ||
              this._features.field_presence !== "IMPLICIT";
      },
    }),
    ($.prototype.setOption = function (K, G, Q) {
      return q.prototype.setOption.call(this, K, G, Q);
    }),
    ($.prototype.toJSON = function (K) {
      var G = K ? !!K.keepComments : !1;
      return B.toObject([
        "edition",
        this._editionToJSON(),
        "rule",
        (this.rule !== "optional" && this.rule) || void 0,
        "type",
        this.type,
        "id",
        this.id,
        "extend",
        this.extend,
        "options",
        this.options,
        "comment",
        G ? this.comment : void 0,
      ]);
    }),
    ($.prototype.resolve = function () {
      if (this.resolved) return this;
      if (
        ((this.typeDefault = F.defaults[this.type]) === void 0
          ? ((this.resolvedType = (
              this.declaringField ? this.declaringField.parent : this.parent
            ).lookupTypeOrEnum(this.type)),
            this.resolvedType instanceof V
              ? (this.typeDefault = null)
              : (this.typeDefault =
                  this.resolvedType.values[
                    Object.keys(this.resolvedType.values)[0]
                  ]))
          : this.options &&
            this.options.proto3_optional &&
            (this.typeDefault = null),
        this.options &&
          this.options.default != null &&
          ((this.typeDefault = this.options.default),
          this.resolvedType instanceof U &&
            typeof this.typeDefault == "string" &&
            (this.typeDefault = this.resolvedType.values[this.typeDefault])),
        this.options &&
          (this.options.packed !== void 0 &&
            this.resolvedType &&
            !(this.resolvedType instanceof U) &&
            delete this.options.packed,
          Object.keys(this.options).length || (this.options = void 0)),
        this.long)
      )
        (this.typeDefault = B.Long.fromNumber(
          this.typeDefault,
          this.type.charAt(0) === "u"
        )),
          Object.freeze && Object.freeze(this.typeDefault);
      else if (this.bytes && typeof this.typeDefault == "string") {
        var K;
        B.base64.test(this.typeDefault)
          ? B.base64.decode(
              this.typeDefault,
              (K = B.newBuffer(B.base64.length(this.typeDefault))),
              0
            )
          : B.utf8.write(
              this.typeDefault,
              (K = B.newBuffer(B.utf8.length(this.typeDefault))),
              0
            ),
          (this.typeDefault = K);
      }
      return (
        this.map
          ? (this.defaultValue = B.emptyObject)
          : this.repeated
          ? (this.defaultValue = B.emptyArray)
          : (this.defaultValue = this.typeDefault),
        this.parent instanceof V &&
          (this.parent.ctor.prototype[this.name] = this.defaultValue),
        q.prototype.resolve.call(this)
      );
    }),
    ($.prototype._inferLegacyProtoFeatures = function (K) {
      if (K !== "proto2" && K !== "proto3") return {};
      var G = {};
      return (
        this.resolve(),
        this.rule === "required" && (G.field_presence = "LEGACY_REQUIRED"),
        this.resolvedType instanceof V &&
          this.resolvedType.group &&
          (G.message_encoding = "DELIMITED"),
        this.getOption("packed") === !0
          ? (G.repeated_field_encoding = "PACKED")
          : this.getOption("packed") === !1 &&
            (G.repeated_field_encoding = "EXPANDED"),
        G
      );
    }),
    ($.prototype._resolveFeatures = function (K) {
      return q.prototype._resolveFeatures.call(this, this._edition || K);
    }),
    ($.d = function (K, G, Q, z) {
      return (
        typeof G == "function"
          ? (G = B.decorateType(G).name)
          : G && typeof G == "object" && (G = B.decorateEnum(G).name),
        function (Y, X) {
          B.decorateType(Y.constructor).add(new $(X, K, G, Q, { default: z }));
        }
      );
    }),
    ($._configure = function (K) {
      V = K;
    }),
    field
  );
}
var oneof, hasRequiredOneof;
function requireOneof() {
  if (hasRequiredOneof) return oneof;
  (hasRequiredOneof = 1), (oneof = B);
  var q = requireObject();
  ((B.prototype = Object.create(q.prototype)).constructor = B).className =
    "OneOf";
  var U = requireField(),
    F = requireUtil();
  function B(j, $, W, K) {
    if (
      (Array.isArray($) || ((W = $), ($ = void 0)),
      q.call(this, j, W),
      !($ === void 0 || Array.isArray($)))
    )
      throw TypeError("fieldNames must be an Array");
    (this.oneof = $ || []), (this.fieldsArray = []), (this.comment = K);
  }
  (B.fromJSON = function ($, W) {
    return new B($, W.oneof, W.options, W.comment);
  }),
    (B.prototype.toJSON = function ($) {
      var W = $ ? !!$.keepComments : !1;
      return F.toObject([
        "options",
        this.options,
        "oneof",
        this.oneof,
        "comment",
        W ? this.comment : void 0,
      ]);
    });
  function V(j) {
    if (j.parent)
      for (var $ = 0; $ < j.fieldsArray.length; ++$)
        j.fieldsArray[$].parent || j.parent.add(j.fieldsArray[$]);
  }
  return (
    (B.prototype.add = function ($) {
      if (!($ instanceof U)) throw TypeError("field must be a Field");
      return (
        $.parent && $.parent !== this.parent && $.parent.remove($),
        this.oneof.push($.name),
        this.fieldsArray.push($),
        ($.partOf = this),
        V(this),
        this
      );
    }),
    (B.prototype.remove = function ($) {
      if (!($ instanceof U)) throw TypeError("field must be a Field");
      var W = this.fieldsArray.indexOf($);
      if (W < 0) throw Error($ + " is not a member of " + this);
      return (
        this.fieldsArray.splice(W, 1),
        (W = this.oneof.indexOf($.name)),
        W > -1 && this.oneof.splice(W, 1),
        ($.partOf = null),
        this
      );
    }),
    (B.prototype.onAdd = function ($) {
      q.prototype.onAdd.call(this, $);
      for (var W = this, K = 0; K < this.oneof.length; ++K) {
        var G = $.get(this.oneof[K]);
        G && !G.partOf && ((G.partOf = W), W.fieldsArray.push(G));
      }
      V(this);
    }),
    (B.prototype.onRemove = function ($) {
      for (var W = 0, K; W < this.fieldsArray.length; ++W)
        (K = this.fieldsArray[W]).parent && K.parent.remove(K);
      q.prototype.onRemove.call(this, $);
    }),
    Object.defineProperty(B.prototype, "isProto3Optional", {
      get: function () {
        if (this.fieldsArray == null || this.fieldsArray.length !== 1)
          return !1;
        var j = this.fieldsArray[0];
        return j.options != null && j.options.proto3_optional === !0;
      },
    }),
    (B.d = function () {
      for (var $ = new Array(arguments.length), W = 0; W < arguments.length; )
        $[W] = arguments[W++];
      return function (G, Q) {
        F.decorateType(G.constructor).add(new B(Q, $)),
          Object.defineProperty(G, Q, {
            get: F.oneOfGetter($),
            set: F.oneOfSetter($),
          });
      };
    }),
    oneof
  );
}
var object, hasRequiredObject;
function requireObject() {
  if (hasRequiredObject) return object;
  (hasRequiredObject = 1), (object = $), ($.className = "ReflectionObject");
  const q = requireOneof();
  var U = requireUtil(),
    F,
    B = {
      enum_type: "OPEN",
      field_presence: "EXPLICIT",
      json_format: "ALLOW",
      message_encoding: "LENGTH_PREFIXED",
      repeated_field_encoding: "PACKED",
      utf8_validation: "VERIFY",
    },
    V = {
      enum_type: "CLOSED",
      field_presence: "EXPLICIT",
      json_format: "LEGACY_BEST_EFFORT",
      message_encoding: "LENGTH_PREFIXED",
      repeated_field_encoding: "EXPANDED",
      utf8_validation: "NONE",
    },
    j = {
      enum_type: "OPEN",
      field_presence: "IMPLICIT",
      json_format: "ALLOW",
      message_encoding: "LENGTH_PREFIXED",
      repeated_field_encoding: "PACKED",
      utf8_validation: "VERIFY",
    };
  function $(W, K) {
    if (!U.isString(W)) throw TypeError("name must be a string");
    if (K && !U.isObject(K)) throw TypeError("options must be an object");
    (this.options = K),
      (this.parsedOptions = null),
      (this.name = W),
      (this._edition = null),
      (this._defaultEdition = "proto2"),
      (this._features = {}),
      (this.parent = null),
      (this.resolved = !1),
      (this.comment = null),
      (this.filename = null);
  }
  return (
    Object.defineProperties($.prototype, {
      root: {
        get: function () {
          for (var W = this; W.parent !== null; ) W = W.parent;
          return W;
        },
      },
      fullName: {
        get: function () {
          for (var W = [this.name], K = this.parent; K; )
            W.unshift(K.name), (K = K.parent);
          return W.join(".");
        },
      },
    }),
    ($.prototype.toJSON = function () {
      throw Error();
    }),
    ($.prototype.onAdd = function (K) {
      this.parent && this.parent !== K && this.parent.remove(this),
        (this.parent = K),
        (this.resolved = !1);
      var G = K.root;
      G instanceof F && G._handleAdd(this);
    }),
    ($.prototype.onRemove = function (K) {
      var G = K.root;
      G instanceof F && G._handleRemove(this),
        (this.parent = null),
        (this.resolved = !1);
    }),
    ($.prototype.resolve = function () {
      return this.resolved
        ? this
        : (this instanceof F &&
            (this._resolveFeaturesRecursive(this._edition),
            (this.resolved = !0)),
          this);
    }),
    ($.prototype._resolveFeaturesRecursive = function (K) {
      return this._resolveFeatures(this._edition || K);
    }),
    ($.prototype._resolveFeatures = function (K) {
      var G = {};
      if (!K) throw new Error("Unknown edition for " + this.fullName);
      var Q = Object.assign(
        this.options ? Object.assign({}, this.options.features) : {},
        this._inferLegacyProtoFeatures(K)
      );
      if (this._edition) {
        if (K === "proto2") G = Object.assign({}, V);
        else if (K === "proto3") G = Object.assign({}, j);
        else if (K === "2023") G = Object.assign({}, B);
        else throw new Error("Unknown edition: " + K);
        this._features = Object.assign(G, Q || {});
        return;
      }
      if (this.partOf instanceof q) {
        var z = Object.assign({}, this.partOf._features);
        this._features = Object.assign(z, Q || {});
      } else if (!this.declaringField)
        if (this.parent) {
          var H = Object.assign({}, this.parent._features);
          this._features = Object.assign(H, Q || {});
        } else throw new Error("Unable to find a parent for " + this.fullName);
      this.extensionField && (this.extensionField._features = this._features);
    }),
    ($.prototype._inferLegacyProtoFeatures = function () {
      return {};
    }),
    ($.prototype.getOption = function (K) {
      if (this.options) return this.options[K];
    }),
    ($.prototype.setOption = function (K, G, Q) {
      return (
        this.options || (this.options = {}),
        /^features\./.test(K)
          ? U.setProperty(this.options, K, G, Q)
          : (!Q || this.options[K] === void 0) &&
            (this.getOption(K) !== G && (this.resolved = !1),
            (this.options[K] = G)),
        this
      );
    }),
    ($.prototype.setParsedOption = function (K, G, Q) {
      this.parsedOptions || (this.parsedOptions = []);
      var z = this.parsedOptions;
      if (Q) {
        var H = z.find(function (Z) {
          return Object.prototype.hasOwnProperty.call(Z, K);
        });
        if (H) {
          var Y = H[K];
          U.setProperty(Y, Q, G);
        } else (H = {}), (H[K] = U.setProperty({}, Q, G)), z.push(H);
      } else {
        var X = {};
        (X[K] = G), z.push(X);
      }
      return this;
    }),
    ($.prototype.setOptions = function (K, G) {
      if (K)
        for (var Q = Object.keys(K), z = 0; z < Q.length; ++z)
          this.setOption(Q[z], K[Q[z]], G);
      return this;
    }),
    ($.prototype.toString = function () {
      var K = this.constructor.className,
        G = this.fullName;
      return G.length ? K + " " + G : K;
    }),
    ($.prototype._editionToJSON = function () {
      if (!(!this._edition || this._edition === "proto3")) return this._edition;
    }),
    ($._configure = function (W) {
      F = W;
    }),
    object
  );
}
var _enum, hasRequired_enum;
function require_enum() {
  if (hasRequired_enum) return _enum;
  (hasRequired_enum = 1), (_enum = B);
  var q = requireObject();
  ((B.prototype = Object.create(q.prototype)).constructor = B).className =
    "Enum";
  var U = requireNamespace(),
    F = requireUtil();
  function B(V, j, $, W, K, G) {
    if ((q.call(this, V, $), j && typeof j != "object"))
      throw TypeError("values must be an object");
    if (
      ((this.valuesById = {}),
      (this.values = Object.create(this.valuesById)),
      (this.comment = W),
      (this.comments = K || {}),
      (this.valuesOptions = G),
      (this._valuesFeatures = {}),
      (this.reserved = void 0),
      j)
    )
      for (var Q = Object.keys(j), z = 0; z < Q.length; ++z)
        typeof j[Q[z]] == "number" &&
          (this.valuesById[(this.values[Q[z]] = j[Q[z]])] = Q[z]);
  }
  return (
    (B.prototype._resolveFeatures = function (j) {
      return (
        (j = this._edition || j),
        q.prototype._resolveFeatures.call(this, j),
        Object.keys(this.values).forEach(($) => {
          var W = Object.assign({}, this._features);
          this._valuesFeatures[$] = Object.assign(
            W,
            this.valuesOptions &&
              this.valuesOptions[$] &&
              this.valuesOptions[$].features
          );
        }),
        this
      );
    }),
    (B.fromJSON = function (j, $) {
      var W = new B(j, $.values, $.options, $.comment, $.comments);
      return (
        (W.reserved = $.reserved),
        $.edition && (W._edition = $.edition),
        (W._defaultEdition = "proto3"),
        W
      );
    }),
    (B.prototype.toJSON = function (j) {
      var $ = j ? !!j.keepComments : !1;
      return F.toObject([
        "edition",
        this._editionToJSON(),
        "options",
        this.options,
        "valuesOptions",
        this.valuesOptions,
        "values",
        this.values,
        "reserved",
        this.reserved && this.reserved.length ? this.reserved : void 0,
        "comment",
        $ ? this.comment : void 0,
        "comments",
        $ ? this.comments : void 0,
      ]);
    }),
    (B.prototype.add = function (j, $, W, K) {
      if (!F.isString(j)) throw TypeError("name must be a string");
      if (!F.isInteger($)) throw TypeError("id must be an integer");
      if (this.values[j] !== void 0)
        throw Error("duplicate name '" + j + "' in " + this);
      if (this.isReservedId($))
        throw Error("id " + $ + " is reserved in " + this);
      if (this.isReservedName(j))
        throw Error("name '" + j + "' is reserved in " + this);
      if (this.valuesById[$] !== void 0) {
        if (!(this.options && this.options.allow_alias))
          throw Error("duplicate id " + $ + " in " + this);
        this.values[j] = $;
      } else this.valuesById[(this.values[j] = $)] = j;
      return (
        K &&
          (this.valuesOptions === void 0 && (this.valuesOptions = {}),
          (this.valuesOptions[j] = K || null)),
        (this.comments[j] = W || null),
        this
      );
    }),
    (B.prototype.remove = function (j) {
      if (!F.isString(j)) throw TypeError("name must be a string");
      var $ = this.values[j];
      if ($ == null) throw Error("name '" + j + "' does not exist in " + this);
      return (
        delete this.valuesById[$],
        delete this.values[j],
        delete this.comments[j],
        this.valuesOptions && delete this.valuesOptions[j],
        this
      );
    }),
    (B.prototype.isReservedId = function (j) {
      return U.isReservedId(this.reserved, j);
    }),
    (B.prototype.isReservedName = function (j) {
      return U.isReservedName(this.reserved, j);
    }),
    _enum
  );
}
var encoder_1, hasRequiredEncoder;
function requireEncoder() {
  if (hasRequiredEncoder) return encoder_1;
  (hasRequiredEncoder = 1), (encoder_1 = V);
  var q = require_enum(),
    U = requireTypes(),
    F = requireUtil();
  function B(j, $, W, K) {
    return $.delimited
      ? j(
          "types[%i].encode(%s,w.uint32(%i)).uint32(%i)",
          W,
          K,
          (($.id << 3) | 3) >>> 0,
          (($.id << 3) | 4) >>> 0
        )
      : j(
          "types[%i].encode(%s,w.uint32(%i).fork()).ldelim()",
          W,
          K,
          (($.id << 3) | 2) >>> 0
        );
  }
  function V(j) {
    for (
      var $ = F.codegen(["m", "w"], j.name + "$encode")("if(!w)")(
          "w=Writer.create()"
        ),
        W,
        K,
        G = j.fieldsArray.slice().sort(F.compareFieldsById),
        W = 0;
      W < G.length;
      ++W
    ) {
      var Q = G[W].resolve(),
        z = j._fieldsArray.indexOf(Q),
        H = Q.resolvedType instanceof q ? "int32" : Q.type,
        Y = U.basic[H];
      (K = "m" + F.safeProp(Q.name)),
        Q.map
          ? ($(
              "if(%s!=null&&Object.hasOwnProperty.call(m,%j)){",
              K,
              Q.name
            )("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", K)(
              "w.uint32(%i).fork().uint32(%i).%s(ks[i])",
              ((Q.id << 3) | 2) >>> 0,
              8 | U.mapKey[Q.keyType],
              Q.keyType
            ),
            Y === void 0
              ? $(
                  "types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()",
                  z,
                  K
                )
              : $(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | Y, H, K),
            $("}")("}"))
          : Q.repeated
          ? ($("if(%s!=null&&%s.length){", K, K),
            Q.packed && U.packed[H] !== void 0
              ? $("w.uint32(%i).fork()", ((Q.id << 3) | 2) >>> 0)(
                  "for(var i=0;i<%s.length;++i)",
                  K
                )(
                  "w.%s(%s[i])",
                  H,
                  K
                )("w.ldelim()")
              : ($("for(var i=0;i<%s.length;++i)", K),
                Y === void 0
                  ? B($, Q, z, K + "[i]")
                  : $("w.uint32(%i).%s(%s[i])", ((Q.id << 3) | Y) >>> 0, H, K)),
            $("}"))
          : (Q.optional &&
              $("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", K, Q.name),
            Y === void 0
              ? B($, Q, z, K)
              : $("w.uint32(%i).%s(%s)", ((Q.id << 3) | Y) >>> 0, H, K));
    }
    return $("return w");
  }
  return encoder_1;
}
var hasRequiredIndexLight;
function requireIndexLight() {
  if (hasRequiredIndexLight) return indexLight.exports;
  hasRequiredIndexLight = 1;
  var q = (indexLight.exports = requireIndexMinimal());
  q.build = "light";
  function U(B, V, j) {
    return (
      typeof V == "function"
        ? ((j = V), (V = new q.Root()))
        : V || (V = new q.Root()),
      V.load(B, j)
    );
  }
  q.load = U;
  function F(B, V) {
    return V || (V = new q.Root()), V.loadSync(B);
  }
  return (
    (q.loadSync = F),
    (q.encoder = requireEncoder()),
    (q.decoder = requireDecoder()),
    (q.verifier = requireVerifier()),
    (q.converter = requireConverter()),
    (q.ReflectionObject = requireObject()),
    (q.Namespace = requireNamespace()),
    (q.Root = requireRoot()),
    (q.Enum = require_enum()),
    (q.Type = requireType()),
    (q.Field = requireField()),
    (q.OneOf = requireOneof()),
    (q.MapField = requireMapfield()),
    (q.Service = requireService()),
    (q.Method = requireMethod()),
    (q.Message = requireMessage()),
    (q.wrappers = requireWrappers()),
    (q.types = requireTypes()),
    (q.util = requireUtil()),
    q.ReflectionObject._configure(q.Root),
    q.Namespace._configure(q.Type, q.Service, q.Enum),
    q.Root._configure(q.Type),
    q.Field._configure(q.Type),
    indexLight.exports
  );
}
var tokenize_1, hasRequiredTokenize;
function requireTokenize() {
  if (hasRequiredTokenize) return tokenize_1;
  (hasRequiredTokenize = 1), (tokenize_1 = Q);
  var q = /[\s{}=;:[\],'"()<>]/g,
    U = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,
    F = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,
    B = /^ *[*/]+ */,
    V = /^\s*\*?\/*/,
    j = /\n/g,
    $ = /\s/,
    W = /\\(.?)/g,
    K = {
      0: "\0",
      r: "\r",
      n: `
`,
      t: "	",
    };
  function G(z) {
    return z.replace(W, function (H, Y) {
      switch (Y) {
        case "\\":
        case "":
          return Y;
        default:
          return K[Y] || "";
      }
    });
  }
  Q.unescape = G;
  function Q(z, H) {
    z = z.toString();
    var Y = 0,
      X = z.length,
      Z = 1,
      ie = 0,
      ee = {},
      te = [],
      re = null;
    function ne(ye) {
      return Error("illegal " + ye + " (line " + Z + ")");
    }
    function se() {
      var ye = re === "'" ? F : U;
      ye.lastIndex = Y - 1;
      var Ce = ye.exec(z);
      if (!Ce) throw ne("string");
      return (Y = ye.lastIndex), ue(re), (re = null), G(Ce[1]);
    }
    function oe(ye) {
      return z.charAt(ye);
    }
    function le(ye, Ce, Ee) {
      var Oe = { type: z.charAt(ye++), lineEmpty: !1, leading: Ee },
        Le;
      H ? (Le = 2) : (Le = 3);
      var _e = ye - Le,
        Ae;
      do
        if (
          --_e < 0 ||
          (Ae = z.charAt(_e)) ===
            `
`
        ) {
          Oe.lineEmpty = !0;
          break;
        }
      while (Ae === " " || Ae === "	");
      for (var Ue = z.substring(ye, Ce).split(j), Fe = 0; Fe < Ue.length; ++Fe)
        Ue[Fe] = Ue[Fe].replace(H ? V : B, "").trim();
      (Oe.text = Ue.join(
        `
`
      ).trim()),
        (ee[Z] = Oe),
        (ie = Z);
    }
    function fe(ye) {
      var Ce = pe(ye),
        Ee = z.substring(ye, Ce),
        Oe = /^\s*\/\//.test(Ee);
      return Oe;
    }
    function pe(ye) {
      for (
        var Ce = ye;
        Ce < X &&
        oe(Ce) !==
          `
`;

      )
        Ce++;
      return Ce;
    }
    function he() {
      if (te.length > 0) return te.shift();
      if (re) return se();
      var ye,
        Ce,
        Ee,
        Oe,
        Le,
        _e = Y === 0;
      do {
        if (Y === X) return null;
        for (ye = !1; $.test((Ee = oe(Y))); )
          if (
            (Ee ===
              `
` && ((_e = !0), ++Z),
            ++Y === X)
          )
            return null;
        if (oe(Y) === "/") {
          if (++Y === X) throw ne("comment");
          if (oe(Y) === "/")
            if (H) {
              if (((Oe = Y), (Le = !1), fe(Y - 1))) {
                Le = !0;
                do if (((Y = pe(Y)), Y === X || (Y++, !_e))) break;
                while (fe(Y));
              } else Y = Math.min(X, pe(Y) + 1);
              Le && (le(Oe, Y, _e), (_e = !0)), Z++, (ye = !0);
            } else {
              for (
                Le = oe((Oe = Y + 1)) === "/";
                oe(++Y) !==
                `
`;

              )
                if (Y === X) return null;
              ++Y, Le && (le(Oe, Y - 1, _e), (_e = !0)), ++Z, (ye = !0);
            }
          else if ((Ee = oe(Y)) === "*") {
            (Oe = Y + 1), (Le = H || oe(Oe) === "*");
            do {
              if (
                (Ee ===
                  `
` && ++Z,
                ++Y === X)
              )
                throw ne("comment");
              (Ce = Ee), (Ee = oe(Y));
            } while (Ce !== "*" || Ee !== "/");
            ++Y, Le && (le(Oe, Y - 2, _e), (_e = !0)), (ye = !0);
          } else return "/";
        }
      } while (ye);
      var Ae = Y;
      q.lastIndex = 0;
      var Ue = q.test(oe(Ae++));
      if (!Ue) for (; Ae < X && !q.test(oe(Ae)); ) ++Ae;
      var Fe = z.substring(Y, (Y = Ae));
      return (Fe === '"' || Fe === "'") && (re = Fe), Fe;
    }
    function ue(ye) {
      te.push(ye);
    }
    function Te() {
      if (!te.length) {
        var ye = he();
        if (ye === null) return null;
        ue(ye);
      }
      return te[0];
    }
    function we(ye, Ce) {
      var Ee = Te(),
        Oe = Ee === ye;
      if (Oe) return he(), !0;
      if (!Ce) throw ne("token '" + Ee + "', '" + ye + "' expected");
      return !1;
    }
    function me(ye) {
      var Ce = null,
        Ee;
      return (
        ye === void 0
          ? ((Ee = ee[Z - 1]),
            delete ee[Z - 1],
            Ee &&
              (H || Ee.type === "*" || Ee.lineEmpty) &&
              (Ce = Ee.leading ? Ee.text : null))
          : (ie < ye && Te(),
            (Ee = ee[ye]),
            delete ee[ye],
            Ee &&
              !Ee.lineEmpty &&
              (H || Ee.type === "/") &&
              (Ce = Ee.leading ? null : Ee.text)),
        Ce
      );
    }
    return Object.defineProperty(
      { next: he, peek: Te, push: ue, skip: we, cmnt: me },
      "line",
      {
        get: function () {
          return Z;
        },
      }
    );
  }
  return tokenize_1;
}
var parse_1, hasRequiredParse;
function requireParse() {
  if (hasRequiredParse) return parse_1;
  (hasRequiredParse = 1),
    (parse_1 = se),
    (se.filename = null),
    (se.defaults = { keepCase: !1 });
  var q = requireTokenize(),
    U = requireRoot(),
    F = requireType(),
    B = requireField(),
    V = requireMapfield(),
    j = requireOneof(),
    $ = require_enum(),
    W = requireService(),
    K = requireMethod(),
    G = requireObject(),
    Q = requireTypes(),
    z = requireUtil(),
    H = /^[1-9][0-9]*$/,
    Y = /^-?[1-9][0-9]*$/,
    X = /^0[x][0-9a-fA-F]+$/,
    Z = /^-?0[x][0-9a-fA-F]+$/,
    ie = /^0[0-7]+$/,
    ee = /^-?0[0-7]+$/,
    te = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/,
    re = /^[a-zA-Z_][a-zA-Z_0-9]*$/,
    ne = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/;
  function se(oe, le, fe) {
    le instanceof U || ((fe = le), (le = new U())), fe || (fe = se.defaults);
    var pe = fe.preferTrailingComment || !1,
      he = q(oe, fe.alternateCommentMode || !1),
      ue = he.next,
      Te = he.push,
      we = he.peek,
      me = he.skip,
      ye = he.cmnt,
      Ce = !0,
      Ee,
      Oe,
      Le,
      _e = "proto2",
      Ae = le,
      Ue = [],
      Fe = {},
      vt = fe.keepCase
        ? function (ce) {
            return ce;
          }
        : z.camelCase;
    function Pt() {
      Ue.forEach((ce) => {
        (ce._edition = _e),
          Object.keys(Fe).forEach((ae) => {
            ce.getOption(ae) === void 0 && ce.setOption(ae, Fe[ae], !0);
          });
      });
    }
    function ke(ce, ae, de) {
      var ge = se.filename;
      return (
        de || (se.filename = null),
        Error(
          "illegal " +
            (ae || "token") +
            " '" +
            ce +
            "' (" +
            (ge ? ge + ", " : "") +
            "line " +
            he.line +
            ")"
        )
      );
    }
    function Ye() {
      var ce = [],
        ae;
      do {
        if ((ae = ue()) !== '"' && ae !== "'") throw ke(ae);
        ce.push(ue()), me(ae), (ae = we());
      } while (ae === '"' || ae === "'");
      return ce.join("");
    }
    function yt(ce) {
      var ae = ue();
      switch (ae) {
        case "'":
        case '"':
          return Te(ae), Ye();
        case "true":
        case "TRUE":
          return !0;
        case "false":
        case "FALSE":
          return !1;
      }
      try {
        return It(ae, !0);
      } catch {
        if (ne.test(ae)) return ae;
        throw ke(ae, "value");
      }
    }
    function Tt(ce, ae) {
      var de, ge;
      do
        if (ae && ((de = we()) === '"' || de === "'")) {
          var ve = Ye();
          if ((ce.push(ve), _e >= 2023)) throw ke(ve, "id");
        } else
          try {
            ce.push([(ge = Je(ue())), me("to", !0) ? Je(ue()) : ge]);
          } catch (Re) {
            if (ae && ne.test(de) && _e >= 2023) ce.push(de);
            else throw Re;
          }
      while (me(",", !0));
      var Se = { options: void 0 };
      (Se.setOption = function (Re, Ne) {
        this.options === void 0 && (this.options = {}), (this.options[Re] = Ne);
      }),
        qe(
          Se,
          function (Ne) {
            if (Ne === "option") Ve(Se, Ne), me(";");
            else throw ke(Ne);
          },
          function () {
            ft(Se);
          }
        );
    }
    function It(ce, ae) {
      var de = 1;
      switch (
        (ce.charAt(0) === "-" && ((de = -1), (ce = ce.substring(1))), ce)
      ) {
        case "inf":
        case "INF":
        case "Inf":
          return de * (1 / 0);
        case "nan":
        case "NAN":
        case "Nan":
        case "NaN":
          return NaN;
        case "0":
          return 0;
      }
      if (H.test(ce)) return de * parseInt(ce, 10);
      if (X.test(ce)) return de * parseInt(ce, 16);
      if (ie.test(ce)) return de * parseInt(ce, 8);
      if (te.test(ce)) return de * parseFloat(ce);
      throw ke(ce, "number", ae);
    }
    function Je(ce, ae) {
      switch (ce) {
        case "max":
        case "MAX":
        case "Max":
          return 536870911;
        case "0":
          return 0;
      }
      if (!ae && ce.charAt(0) === "-") throw ke(ce, "id");
      if (Y.test(ce)) return parseInt(ce, 10);
      if (Z.test(ce)) return parseInt(ce, 16);
      if (ee.test(ce)) return parseInt(ce, 8);
      throw ke(ce, "id");
    }
    function Ot() {
      if (Ee !== void 0) throw ke("package");
      if (((Ee = ue()), !ne.test(Ee))) throw ke(Ee, "name");
      (Ae = Ae.define(Ee)), me(";");
    }
    function At() {
      var ce = we(),
        ae;
      switch (ce) {
        case "weak":
          (ae = Le || (Le = [])), ue();
          break;
        case "public":
          ue();
        default:
          ae = Oe || (Oe = []);
          break;
      }
      (ce = Ye()), me(";"), ae.push(ce);
    }
    function Dt() {
      if ((me("="), (_e = Ye()), _e < 2023)) throw ke(_e, "syntax");
      me(";");
    }
    function Lt() {
      if ((me("="), (_e = Ye()), !["2023"].includes(_e)))
        throw ke(_e, "edition");
      me(";");
    }
    function kt(ce, ae) {
      switch (ae) {
        case "option":
          return Ve(ce, ae), me(";"), !0;
        case "message":
          return Ct(ce, ae), !0;
        case "enum":
          return Et(ce, ae), !0;
        case "service":
          return Bt(ce, ae), !0;
        case "extend":
          return Vt(ce, ae), !0;
      }
      return !1;
    }
    function qe(ce, ae, de) {
      var ge = he.line;
      if (
        (ce &&
          (typeof ce.comment != "string" && (ce.comment = ye()),
          (ce.filename = se.filename)),
        me("{", !0))
      ) {
        for (var ve; (ve = ue()) !== "}"; ) ae(ve);
        me(";", !0);
      } else
        de && de(),
          me(";"),
          ce &&
            (typeof ce.comment != "string" || pe) &&
            (ce.comment = ye(ge) || ce.comment);
    }
    function Ct(ce, ae) {
      if (!re.test((ae = ue()))) throw ke(ae, "type name");
      var de = new F(ae);
      qe(de, function (ve) {
        if (!kt(de, ve))
          switch (ve) {
            case "map":
              Nt(de);
              break;
            case "required":
              if (_e !== "proto2") throw ke(ve);
            case "repeated":
              Be(de, ve);
              break;
            case "optional":
              if (_e === "proto3") Be(de, "proto3_optional");
              else {
                if (_e !== "proto2") throw ke(ve);
                Be(de, "optional");
              }
              break;
            case "oneof":
              Mt(de, ve);
              break;
            case "extensions":
              Tt(de.extensions || (de.extensions = []));
              break;
            case "reserved":
              Tt(de.reserved || (de.reserved = []), !0);
              break;
            default:
              if (_e === "proto2" || !ne.test(ve)) throw ke(ve);
              Te(ve), Be(de, "optional");
              break;
          }
      }),
        ce.add(de),
        ce === Ae && Ue.push(de);
    }
    function Be(ce, ae, de) {
      var ge = ue();
      if (ge === "group") {
        xt(ce, ae);
        return;
      }
      for (; ge.endsWith(".") || we().startsWith("."); ) ge += ue();
      if (!ne.test(ge)) throw ke(ge, "type");
      var ve = ue();
      if (!re.test(ve)) throw ke(ve, "name");
      (ve = vt(ve)), me("=");
      var Se = new B(ve, Je(ue()), ge, ae, de);
      if (
        (qe(
          Se,
          function (Me) {
            if (Me === "option") Ve(Se, Me), me(";");
            else throw ke(Me);
          },
          function () {
            ft(Se);
          }
        ),
        ae === "proto3_optional")
      ) {
        var Re = new j("_" + ve);
        Se.setOption("proto3_optional", !0), Re.add(Se), ce.add(Re);
      } else ce.add(Se);
      ce === Ae && Ue.push(Se);
    }
    function xt(ce, ae) {
      if (_e >= 2023) throw ke("group");
      var de = ue();
      if (!re.test(de)) throw ke(de, "name");
      var ge = z.lcFirst(de);
      de === ge && (de = z.ucFirst(de)), me("=");
      var ve = Je(ue()),
        Se = new F(de);
      Se.group = !0;
      var Re = new B(ge, ve, de, ae);
      (Re.filename = se.filename),
        qe(Se, function (Me) {
          switch (Me) {
            case "option":
              Ve(Se, Me), me(";");
              break;
            case "required":
            case "repeated":
              Be(Se, Me);
              break;
            case "optional":
              _e === "proto3" ? Be(Se, "proto3_optional") : Be(Se, "optional");
              break;
            case "message":
              Ct(Se, Me);
              break;
            case "enum":
              Et(Se, Me);
              break;
            default:
              throw ke(Me);
          }
        }),
        ce.add(Se).add(Re);
    }
    function Nt(ce) {
      me("<");
      var ae = ue();
      if (Q.mapKey[ae] === void 0) throw ke(ae, "type");
      me(",");
      var de = ue();
      if (!ne.test(de)) throw ke(de, "type");
      me(">");
      var ge = ue();
      if (!re.test(ge)) throw ke(ge, "name");
      me("=");
      var ve = new V(vt(ge), Je(ue()), ae, de);
      qe(
        ve,
        function (Re) {
          if (Re === "option") Ve(ve, Re), me(";");
          else throw ke(Re);
        },
        function () {
          ft(ve);
        }
      ),
        ce.add(ve);
    }
    function Mt(ce, ae) {
      if (!re.test((ae = ue()))) throw ke(ae, "name");
      var de = new j(vt(ae));
      qe(de, function (ve) {
        ve === "option" ? (Ve(de, ve), me(";")) : (Te(ve), Be(de, "optional"));
      }),
        ce.add(de);
    }
    function Et(ce, ae) {
      if (!re.test((ae = ue()))) throw ke(ae, "name");
      var de = new $(ae);
      qe(de, function (ve) {
        switch (ve) {
          case "option":
            Ve(de, ve), me(";");
            break;
          case "reserved":
            Tt(de.reserved || (de.reserved = []), !0),
              de.reserved === void 0 && (de.reserved = []);
            break;
          default:
            Ut(de, ve);
        }
      }),
        ce.add(de),
        ce === Ae && Ue.push(de);
    }
    function Ut(ce, ae) {
      if (!re.test(ae)) throw ke(ae, "name");
      me("=");
      var de = Je(ue(), !0),
        ge = { options: void 0 };
      (ge.getOption = function (ve) {
        return this.options[ve];
      }),
        (ge.setOption = function (ve, Se) {
          G.prototype.setOption.call(ge, ve, Se);
        }),
        (ge.setParsedOption = function () {}),
        qe(
          ge,
          function (Se) {
            if (Se === "option") Ve(ge, Se), me(";");
            else throw ke(Se);
          },
          function () {
            ft(ge);
          }
        ),
        ce.add(ae, de, ge.comment, ge.parsedOptions || ge.options);
    }
    function Ve(ce, ae) {
      var de,
        ge,
        ve = !0;
      for (ae === "option" && (ae = ue()); ae !== "="; ) {
        if (ae === "(") {
          var Se = ue();
          me(")"), (ae = "(" + Se + ")");
        }
        if (ve) {
          if (((ve = !1), ae.includes(".") && !ae.includes("("))) {
            var Re = ae.split(".");
            (de = Re[0] + "."), (ae = Re[1]);
            continue;
          }
          de = ae;
        } else ge = ge ? (ge += ae) : ae;
        ae = ue();
      }
      var Ne = ge ? de.concat(ge) : de,
        Me = _t(ce, Ne);
      (ge = ge && ge[0] === "." ? ge.slice(1) : ge),
        (de = de && de[de.length - 1] === "." ? de.slice(0, -1) : de),
        Ft(ce, de, Me, ge);
    }
    function _t(ce, ae) {
      if (me("{", !0)) {
        for (var de = {}; !me("}", !0); ) {
          if (!re.test((xe = ue()))) throw ke(xe, "name");
          if (xe === null) throw ke(xe, "end of input");
          var ge,
            ve = xe;
          if ((me(":", !0), we() === "{")) ge = _t(ce, ae + "." + xe);
          else if (we() === "[") {
            ge = [];
            var Se;
            if (me("[", !0)) {
              do (Se = yt()), ge.push(Se);
              while (me(",", !0));
              me("]"), typeof Se < "u" && bt(ce, ae + "." + xe, Se);
            }
          } else (ge = yt()), bt(ce, ae + "." + xe, ge);
          var Re = de[ve];
          Re && (ge = [].concat(Re).concat(ge)),
            (de[ve] = ge),
            me(",", !0),
            me(";", !0);
        }
        return de;
      }
      var Ne = yt();
      return bt(ce, ae, Ne), Ne;
    }
    function bt(ce, ae, de) {
      if (Ae === ce && /^features\./.test(ae)) {
        Fe[ae] = de;
        return;
      }
      ce.setOption && ce.setOption(ae, de);
    }
    function Ft(ce, ae, de, ge) {
      ce.setParsedOption && ce.setParsedOption(ae, de, ge);
    }
    function ft(ce) {
      if (me("[", !0)) {
        do Ve(ce, "option");
        while (me(",", !0));
        me("]");
      }
      return ce;
    }
    function Bt(ce, ae) {
      if (!re.test((ae = ue()))) throw ke(ae, "service name");
      var de = new W(ae);
      qe(de, function (ve) {
        if (!kt(de, ve))
          if (ve === "rpc") qt(de, ve);
          else throw ke(ve);
      }),
        ce.add(de),
        ce === Ae && Ue.push(de);
    }
    function qt(ce, ae) {
      var de = ye(),
        ge = ae;
      if (!re.test((ae = ue()))) throw ke(ae, "name");
      var ve = ae,
        Se,
        Re,
        Ne,
        Me;
      if (
        (me("("),
        me("stream", !0) && (Re = !0),
        !ne.test((ae = ue())) ||
          ((Se = ae),
          me(")"),
          me("returns"),
          me("("),
          me("stream", !0) && (Me = !0),
          !ne.test((ae = ue()))))
      )
        throw ke(ae);
      (Ne = ae), me(")");
      var mt = new K(ve, ge, Se, Ne, Re, Me);
      (mt.comment = de),
        qe(mt, function (St) {
          if (St === "option") Ve(mt, St), me(";");
          else throw ke(St);
        }),
        ce.add(mt);
    }
    function Vt(ce, ae) {
      if (!ne.test((ae = ue()))) throw ke(ae, "reference");
      var de = ae;
      qe(null, function (ve) {
        switch (ve) {
          case "required":
          case "repeated":
            Be(ce, ve, de);
            break;
          case "optional":
            _e === "proto3"
              ? Be(ce, "proto3_optional", de)
              : Be(ce, "optional", de);
            break;
          default:
            if (_e === "proto2" || !ne.test(ve)) throw ke(ve);
            Te(ve), Be(ce, "optional", de);
            break;
        }
      });
    }
    for (var xe; (xe = ue()) !== null; )
      switch (xe) {
        case "package":
          if (!Ce) throw ke(xe);
          Ot();
          break;
        case "import":
          if (!Ce) throw ke(xe);
          At();
          break;
        case "syntax":
          if (!Ce) throw ke(xe);
          Dt();
          break;
        case "edition":
          if (!Ce) throw ke(xe);
          Lt();
          break;
        case "option":
          Ve(Ae, xe), me(";", !0);
          break;
        default:
          if (kt(Ae, xe)) {
            Ce = !1;
            continue;
          }
          throw ke(xe);
      }
    return (
      Pt(),
      (se.filename = null),
      { package: Ee, imports: Oe, weakImports: Le, root: le }
    );
  }
  return parse_1;
}
var common_1, hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common_1;
  (hasRequiredCommon = 1), (common_1 = U);
  var q = /\/|\./;
  function U(B, V) {
    q.test(B) ||
      ((B = "google/protobuf/" + B + ".proto"),
      (V = { nested: { google: { nested: { protobuf: { nested: V } } } } })),
      (U[B] = V);
  }
  U("any", {
    Any: {
      fields: {
        type_url: { type: "string", id: 1 },
        value: { type: "bytes", id: 2 },
      },
    },
  });
  var F;
  return (
    U("duration", {
      Duration: (F = {
        fields: {
          seconds: { type: "int64", id: 1 },
          nanos: { type: "int32", id: 2 },
        },
      }),
    }),
    U("timestamp", { Timestamp: F }),
    U("empty", { Empty: { fields: {} } }),
    U("struct", {
      Struct: {
        fields: { fields: { keyType: "string", type: "Value", id: 1 } },
      },
      Value: {
        oneofs: {
          kind: {
            oneof: [
              "nullValue",
              "numberValue",
              "stringValue",
              "boolValue",
              "structValue",
              "listValue",
            ],
          },
        },
        fields: {
          nullValue: { type: "NullValue", id: 1 },
          numberValue: { type: "double", id: 2 },
          stringValue: { type: "string", id: 3 },
          boolValue: { type: "bool", id: 4 },
          structValue: { type: "Struct", id: 5 },
          listValue: { type: "ListValue", id: 6 },
        },
      },
      NullValue: { values: { NULL_VALUE: 0 } },
      ListValue: {
        fields: { values: { rule: "repeated", type: "Value", id: 1 } },
      },
    }),
    U("wrappers", {
      DoubleValue: { fields: { value: { type: "double", id: 1 } } },
      FloatValue: { fields: { value: { type: "float", id: 1 } } },
      Int64Value: { fields: { value: { type: "int64", id: 1 } } },
      UInt64Value: { fields: { value: { type: "uint64", id: 1 } } },
      Int32Value: { fields: { value: { type: "int32", id: 1 } } },
      UInt32Value: { fields: { value: { type: "uint32", id: 1 } } },
      BoolValue: { fields: { value: { type: "bool", id: 1 } } },
      StringValue: { fields: { value: { type: "string", id: 1 } } },
      BytesValue: { fields: { value: { type: "bytes", id: 1 } } },
    }),
    U("field_mask", {
      FieldMask: {
        fields: { paths: { rule: "repeated", type: "string", id: 1 } },
      },
    }),
    (U.get = function (V) {
      return U[V] || null;
    }),
    common_1
  );
}
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src.exports;
  hasRequiredSrc = 1;
  var q = (src.exports = requireIndexLight());
  return (
    (q.build = "full"),
    (q.tokenize = requireTokenize()),
    (q.parse = requireParse()),
    (q.common = requireCommon()),
    q.Root._configure(q.Type, q.parse, q.common),
    src.exports
  );
}
var protobufjs, hasRequiredProtobufjs;
function requireProtobufjs() {
  return (
    hasRequiredProtobufjs ||
      ((hasRequiredProtobufjs = 1), (protobufjs = requireSrc())),
    protobufjs
  );
}
var protobufjsExports = requireProtobufjs();
const protobuf = getDefaultExportFromCjs(protobufjsExports);
var extendStatics = function (q, U) {
  return (
    (extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (F, B) {
          F.__proto__ = B;
        }) ||
      function (F, B) {
        for (var V in B)
          Object.prototype.hasOwnProperty.call(B, V) && (F[V] = B[V]);
      }),
    extendStatics(q, U)
  );
};
function __extends(q, U) {
  if (typeof U != "function" && U !== null)
    throw new TypeError(
      "Class extends value " + String(U) + " is not a constructor or null"
    );
  extendStatics(q, U);
  function F() {
    this.constructor = q;
  }
  q.prototype =
    U === null ? Object.create(U) : ((F.prototype = U.prototype), new F());
}
var __assign = function () {
  return (
    (__assign =
      Object.assign ||
      function (U) {
        for (var F, B = 1, V = arguments.length; B < V; B++) {
          F = arguments[B];
          for (var j in F)
            Object.prototype.hasOwnProperty.call(F, j) && (U[j] = F[j]);
        }
        return U;
      }),
    __assign.apply(this, arguments)
  );
};
function __awaiter(q, U, F, B) {
  function V(j) {
    return j instanceof F
      ? j
      : new F(function ($) {
          $(j);
        });
  }
  return new (F || (F = Promise))(function (j, $) {
    function W(Q) {
      try {
        G(B.next(Q));
      } catch (z) {
        $(z);
      }
    }
    function K(Q) {
      try {
        G(B.throw(Q));
      } catch (z) {
        $(z);
      }
    }
    function G(Q) {
      Q.done ? j(Q.value) : V(Q.value).then(W, K);
    }
    G((B = B.apply(q, U || [])).next());
  });
}
function __generator(q, U) {
  var F = {
      label: 0,
      sent: function () {
        if (j[0] & 1) throw j[1];
        return j[1];
      },
      trys: [],
      ops: [],
    },
    B,
    V,
    j,
    $;
  return (
    ($ = { next: W(0), throw: W(1), return: W(2) }),
    typeof Symbol == "function" &&
      ($[Symbol.iterator] = function () {
        return this;
      }),
    $
  );
  function W(G) {
    return function (Q) {
      return K([G, Q]);
    };
  }
  function K(G) {
    if (B) throw new TypeError("Generator is already executing.");
    for (; $ && (($ = 0), G[0] && (F = 0)), F; )
      try {
        if (
          ((B = 1),
          V &&
            (j =
              G[0] & 2
                ? V.return
                : G[0]
                ? V.throw || ((j = V.return) && j.call(V), 0)
                : V.next) &&
            !(j = j.call(V, G[1])).done)
        )
          return j;
        switch (((V = 0), j && (G = [G[0] & 2, j.value]), G[0])) {
          case 0:
          case 1:
            j = G;
            break;
          case 4:
            return F.label++, { value: G[1], done: !1 };
          case 5:
            F.label++, (V = G[1]), (G = [0]);
            continue;
          case 7:
            (G = F.ops.pop()), F.trys.pop();
            continue;
          default:
            if (
              ((j = F.trys),
              !(j = j.length > 0 && j[j.length - 1]) &&
                (G[0] === 6 || G[0] === 2))
            ) {
              F = 0;
              continue;
            }
            if (G[0] === 3 && (!j || (G[1] > j[0] && G[1] < j[3]))) {
              F.label = G[1];
              break;
            }
            if (G[0] === 6 && F.label < j[1]) {
              (F.label = j[1]), (j = G);
              break;
            }
            if (j && F.label < j[2]) {
              (F.label = j[2]), F.ops.push(G);
              break;
            }
            j[2] && F.ops.pop(), F.trys.pop();
            continue;
        }
        G = U.call(q, F);
      } catch (Q) {
        (G = [6, Q]), (V = 0);
      } finally {
        B = j = 0;
      }
    if (G[0] & 5) throw G[1];
    return { value: G[0] ? G[1] : void 0, done: !0 };
  }
}
typeof SuppressedError == "function" && SuppressedError;
var options = { syntax: "proto3" },
  nested = {
    pipecat: {
      nested: {
        TextFrame: {
          fields: {
            id: { type: "uint64", id: 1 },
            name: { type: "string", id: 2 },
            text: { type: "string", id: 3 },
          },
        },
        AudioRawFrame: {
          fields: {
            id: { type: "uint64", id: 1 },
            name: { type: "string", id: 2 },
            audio: { type: "bytes", id: 3 },
            sampleRate: { type: "uint32", id: 4 },
            numChannels: { type: "uint32", id: 5 },
          },
        },
        TranscriptionFrame: {
          fields: {
            id: { type: "uint64", id: 1 },
            name: { type: "string", id: 2 },
            text: { type: "string", id: 3 },
            userId: { type: "string", id: 4 },
            timestamp: { type: "string", id: 5 },
          },
        },
        Frame: {
          oneofs: { frame: { oneof: ["text", "audio", "transcription"] } },
          fields: {
            text: { type: "TextFrame", id: 1 },
            audio: { type: "AudioRawFrame", id: 2 },
            transcription: { type: "TranscriptionFrame", id: 3 },
          },
        },
      },
    },
  },
  jsonDescriptor = { options, nested },
  ConnectionQuality;
(function (q) {
  (q.UNKNOWN = "UNKNOWN"), (q.GOOD = "GOOD"), (q.BAD = "BAD");
})(ConnectionQuality || (ConnectionQuality = {}));
var AbstractConnectionQualityIndicator = (function () {
  function q(U) {
    (this._connectionQuality = ConnectionQuality.UNKNOWN),
      (this.onConnectionQualityChanged = U);
  }
  return (
    Object.defineProperty(q.prototype, "connectionQuality", {
      get: function () {
        return this._connectionQuality;
      },
      enumerable: !1,
      configurable: !0,
    }),
    (q.prototype.handleStatsChanged = function () {
      var U = this.calculateConnectionQuality();
      U !== this._connectionQuality &&
        ((this._connectionQuality = U), this.onConnectionQualityChanged(U));
    }),
    (q.prototype.start = function (U) {
      this.stop(!0), this._start(U);
    }),
    (q.prototype.stop = function (U) {
      U === void 0 && (U = !1),
        this._stop(),
        (this._connectionQuality = ConnectionQuality.UNKNOWN),
        U || this.onConnectionQualityChanged(ConnectionQuality.UNKNOWN);
    }),
    q
  );
})();
function QualityIndicatorMixer() {
  for (var q = [], U = 0; U < arguments.length; U++) q[U] = arguments[U];
  var F = (function (B) {
    __extends(V, B);
    function V(j) {
      var $ = B.call(this, j) || this;
      return (
        ($.childTrackers = q.map(function (W) {
          var K = W.getParams,
            G = W.TrackerClass;
          return {
            tracker: new G(function () {
              return $.handleStatsChanged();
            }),
            getParams: K,
          };
        })),
        $
      );
    }
    return (
      (V.prototype.calculateConnectionQuality = function () {
        var j = this.childTrackers.map(function ($) {
          var W = $.tracker;
          return W.connectionQuality;
        });
        return j.some(function ($) {
          return $ === ConnectionQuality.BAD;
        })
          ? ConnectionQuality.BAD
          : j.every(function ($) {
              return $ === ConnectionQuality.UNKNOWN;
            })
          ? ConnectionQuality.UNKNOWN
          : ConnectionQuality.GOOD;
      }),
      (V.prototype._start = function (j) {
        this.childTrackers.forEach(function ($) {
          var W = $.tracker,
            K = $.getParams;
          return W.start(K(j));
        });
      }),
      (V.prototype._stop = function () {
        this.childTrackers.forEach(function (j) {
          var $ = j.tracker;
          return $.stop(!0);
        });
      }),
      V
    );
  })(AbstractConnectionQualityIndicator);
  return F;
}
var LiveKitConnectionQualityIndicator = (function (q) {
    __extends(U, q);
    function U() {
      var F = (q !== null && q.apply(this, arguments)) || this;
      return (
        (F.room = null),
        (F.liveKitConnectionQuality = ConnectionQuality$2.Unknown),
        (F.liveKitConnectionState = null),
        (F.handleConnectionQualityChanged = function (B) {
          (F.liveKitConnectionQuality = B), F.handleStatsChanged();
        }),
        (F.handleConnectionStateChanged = function (B) {
          (F.liveKitConnectionState = B), F.handleStatsChanged();
        }),
        F
      );
    }
    return (
      (U.prototype._start = function (F) {
        (this.room = F),
          this.room.localParticipant.on(
            ParticipantEvent.ConnectionQualityChanged,
            this.handleConnectionQualityChanged
          ),
          this.room.on(
            RoomEvent.ConnectionStateChanged,
            this.handleConnectionStateChanged
          );
      }),
      (U.prototype._stop = function () {
        this.room &&
          (this.room.localParticipant.off(
            RoomEvent.ConnectionQualityChanged,
            this.handleConnectionQualityChanged
          ),
          this.room.off(
            RoomEvent.ConnectionStateChanged,
            this.handleConnectionStateChanged
          ));
      }),
      (U.prototype.calculateConnectionQuality = function () {
        return [ConnectionQuality$2.Lost, ConnectionQuality$2.Poor].includes(
          this.liveKitConnectionQuality
        ) ||
          (this.liveKitConnectionState &&
            [
              ConnectionState.Disconnected,
              ConnectionState.Reconnecting,
              ConnectionState.SignalReconnecting,
            ].includes(this.liveKitConnectionState))
          ? ConnectionQuality.BAD
          : ConnectionQuality.GOOD;
      }),
      U
    );
  })(AbstractConnectionQualityIndicator),
  t,
  e,
  s,
  n;
function r() {}
function o() {
  o.init.call(this);
}
function i(q) {
  return q._maxListeners === void 0 ? o.defaultMaxListeners : q._maxListeners;
}
function a(q, U, F) {
  if (U) q.call(F);
  else for (var B = q.length, V = m(q, B), j = 0; j < B; ++j) V[j].call(F);
}
function c(q, U, F, B) {
  if (U) q.call(F, B);
  else for (var V = q.length, j = m(q, V), $ = 0; $ < V; ++$) j[$].call(F, B);
}
function d(q, U, F, B, V) {
  if (U) q.call(F, B, V);
  else
    for (var j = q.length, $ = m(q, j), W = 0; W < j; ++W) $[W].call(F, B, V);
}
function u(q, U, F, B, V, j) {
  if (U) q.call(F, B, V, j);
  else
    for (var $ = q.length, W = m(q, $), K = 0; K < $; ++K)
      W[K].call(F, B, V, j);
}
function h(q, U, F, B) {
  if (U) q.apply(F, B);
  else for (var V = q.length, j = m(q, V), $ = 0; $ < V; ++$) j[$].apply(F, B);
}
function l(q, U, F, B) {
  var V, j, $, W;
  if (typeof F != "function")
    throw new TypeError('"listener" argument must be a function');
  if (
    ((j = q._events)
      ? (j.newListener &&
          (q.emit("newListener", U, F.listener ? F.listener : F),
          (j = q._events)),
        ($ = j[U]))
      : ((j = q._events = new r()), (q._eventsCount = 0)),
    $)
  ) {
    if (
      (typeof $ == "function"
        ? ($ = j[U] = B ? [F, $] : [$, F])
        : B
        ? $.unshift(F)
        : $.push(F),
      !$.warned && (V = i(q)) && V > 0 && $.length > V)
    ) {
      $.warned = !0;
      var K = new Error(
        "Possible EventEmitter memory leak detected. " +
          $.length +
          " " +
          U +
          " listeners added. Use emitter.setMaxListeners() to increase limit"
      );
      (K.name = "MaxListenersExceededWarning"),
        (K.emitter = q),
        (K.type = U),
        (K.count = $.length),
        (W = K),
        typeof console.warn == "function" ? console.warn(W) : console.log(W);
    }
  } else ($ = j[U] = F), ++q._eventsCount;
  return q;
}
function p(q, U, F) {
  var B = !1;
  function V() {
    q.removeListener(U, V), B || ((B = !0), F.apply(q, arguments));
  }
  return (V.listener = F), V;
}
function f(q) {
  var U = this._events;
  if (U) {
    var F = U[q];
    if (typeof F == "function") return 1;
    if (F) return F.length;
  }
  return 0;
}
function m(q, U) {
  for (var F = new Array(U); U--; ) F[U] = q[U];
  return F;
}
(r.prototype = Object.create(null)),
  (o.EventEmitter = o),
  (o.usingDomains = !1),
  (o.prototype.domain = void 0),
  (o.prototype._events = void 0),
  (o.prototype._maxListeners = void 0),
  (o.defaultMaxListeners = 10),
  (o.init = function () {
    (this.domain = null),
      o.usingDomains && (void 0).active,
      (this._events && this._events !== Object.getPrototypeOf(this)._events) ||
        ((this._events = new r()), (this._eventsCount = 0)),
      (this._maxListeners = this._maxListeners || void 0);
  }),
  (o.prototype.setMaxListeners = function (q) {
    if (typeof q != "number" || q < 0 || isNaN(q))
      throw new TypeError('"n" argument must be a positive number');
    return (this._maxListeners = q), this;
  }),
  (o.prototype.getMaxListeners = function () {
    return i(this);
  }),
  (o.prototype.emit = function (q) {
    var U,
      F,
      B,
      V,
      j,
      $,
      W,
      K = q === "error";
    if (($ = this._events)) K = K && $.error == null;
    else if (!K) return !1;
    if (((W = this.domain), K)) {
      if (((U = arguments[1]), !W)) {
        if (U instanceof Error) throw U;
        var G = new Error('Uncaught, unspecified "error" event. (' + U + ")");
        throw ((G.context = U), G);
      }
      return (
        U || (U = new Error('Uncaught, unspecified "error" event')),
        (U.domainEmitter = this),
        (U.domain = W),
        (U.domainThrown = !1),
        W.emit("error", U),
        !1
      );
    }
    if (!(F = $[q])) return !1;
    var Q = typeof F == "function";
    switch ((B = arguments.length)) {
      case 1:
        a(F, Q, this);
        break;
      case 2:
        c(F, Q, this, arguments[1]);
        break;
      case 3:
        d(F, Q, this, arguments[1], arguments[2]);
        break;
      case 4:
        u(F, Q, this, arguments[1], arguments[2], arguments[3]);
        break;
      default:
        for (V = new Array(B - 1), j = 1; j < B; j++) V[j - 1] = arguments[j];
        h(F, Q, this, V);
    }
    return !0;
  }),
  (o.prototype.addListener = function (q, U) {
    return l(this, q, U, !1);
  }),
  (o.prototype.on = o.prototype.addListener),
  (o.prototype.prependListener = function (q, U) {
    return l(this, q, U, !0);
  }),
  (o.prototype.once = function (q, U) {
    if (typeof U != "function")
      throw new TypeError('"listener" argument must be a function');
    return this.on(q, p(this, q, U)), this;
  }),
  (o.prototype.prependOnceListener = function (q, U) {
    if (typeof U != "function")
      throw new TypeError('"listener" argument must be a function');
    return this.prependListener(q, p(this, q, U)), this;
  }),
  (o.prototype.removeListener = function (q, U) {
    var F, B, V, j, $;
    if (typeof U != "function")
      throw new TypeError('"listener" argument must be a function');
    if (!(B = this._events)) return this;
    if (!(F = B[q])) return this;
    if (F === U || (F.listener && F.listener === U))
      --this._eventsCount == 0
        ? (this._events = new r())
        : (delete B[q],
          B.removeListener && this.emit("removeListener", q, F.listener || U));
    else if (typeof F != "function") {
      for (V = -1, j = F.length; j-- > 0; )
        if (F[j] === U || (F[j].listener && F[j].listener === U)) {
          ($ = F[j].listener), (V = j);
          break;
        }
      if (V < 0) return this;
      if (F.length === 1) {
        if (((F[0] = void 0), --this._eventsCount == 0))
          return (this._events = new r()), this;
        delete B[q];
      } else
        (function (W, K) {
          for (var G = K, Q = G + 1, z = W.length; Q < z; G += 1, Q += 1)
            W[G] = W[Q];
          W.pop();
        })(F, V);
      B.removeListener && this.emit("removeListener", q, $ || U);
    }
    return this;
  }),
  (o.prototype.off = function (q, U) {
    return this.removeListener(q, U);
  }),
  (o.prototype.removeAllListeners = function (q) {
    var U, F;
    if (!(F = this._events)) return this;
    if (!F.removeListener)
      return (
        arguments.length === 0
          ? ((this._events = new r()), (this._eventsCount = 0))
          : F[q] &&
            (--this._eventsCount == 0 ? (this._events = new r()) : delete F[q]),
        this
      );
    if (arguments.length === 0) {
      for (var B, V = Object.keys(F), j = 0; j < V.length; ++j)
        (B = V[j]) !== "removeListener" && this.removeAllListeners(B);
      return (
        this.removeAllListeners("removeListener"),
        (this._events = new r()),
        (this._eventsCount = 0),
        this
      );
    }
    if (typeof (U = F[q]) == "function") this.removeListener(q, U);
    else if (U)
      do this.removeListener(q, U[U.length - 1]);
      while (U[0]);
    return this;
  }),
  (o.prototype.listeners = function (q) {
    var U,
      F = this._events;
    return F && (U = F[q])
      ? typeof U == "function"
        ? [U.listener || U]
        : (function (B) {
            for (var V = new Array(B.length), j = 0; j < V.length; ++j)
              V[j] = B[j].listener || B[j];
            return V;
          })(U)
      : [];
  }),
  (o.listenerCount = function (q, U) {
    return typeof q.listenerCount == "function"
      ? q.listenerCount(U)
      : f.call(q, U);
  }),
  (o.prototype.listenerCount = f),
  (o.prototype.eventNames = function () {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  });
class g extends o {}
(function (q) {
  (q.Issue = "issue"),
    (q.NetworkScoresUpdated = "network-scores-updated"),
    (q.StatsParsingFinished = "stats-parsing-finished");
})(t || (t = {})),
  (function (q) {
    (q.Network = "network"),
      (q.CPU = "cpu"),
      (q.Server = "server"),
      (q.Stream = "stream");
  })(e || (e = {})),
  (function (q) {
    (q.OutboundNetworkQuality = "outbound-network-quality"),
      (q.InboundNetworkQuality = "inbound-network-quality"),
      (q.OutboundNetworkMediaLatency = "outbound-network-media-latency"),
      (q.InboundNetworkMediaLatency = "inbound-network-media-latency"),
      (q.NetworkMediaSyncFailure = "network-media-sync-failure"),
      (q.OutboundNetworkThroughput = "outbound-network-throughput"),
      (q.InboundNetworkThroughput = "inbound-network-throughput"),
      (q.EncoderCPUThrottling = "encoder-cpu-throttling"),
      (q.DecoderCPUThrottling = "decoder-cpu-throttling"),
      (q.ServerIssue = "server-issue"),
      (q.UnknownVideoDecoderIssue = "unknown-video-decoder"),
      (q.LowInboundMOS = "low-inbound-mean-opinion-score"),
      (q.LowOutboundMOS = "low-outbound-mean-opinion-score"),
      (q.FrozenVideoTrack = "frozen-video-track"),
      (q.MissingVideoStreamData = "missing-video-stream-data"),
      (q.MissingAudioStreamData = "missing-audio-stream-data");
  })(s || (s = {})),
  (function (q) {
    (q[(q.BAD = 2.1)] = "BAD"),
      (q[(q.POOR = 2.6)] = "POOR"),
      (q[(q.FAIR = 3.1)] = "FAIR"),
      (q[(q.GOOD = 3.8)] = "GOOD"),
      (q[(q.EXCELLENT = 4.3)] = "EXCELLENT");
  })(n || (n = {}));
const Qe = class Qe extends o {
  constructor(F) {
    super();
    De(this, "isStopped", !1);
    De(this, "reportTimer");
    De(this, "getStatsInterval");
    De(this, "compositeStatsParser");
    (this.compositeStatsParser = F.compositeStatsParser),
      (this.getStatsInterval = F.getStatsInterval ?? 1e4);
  }
  get isRunning() {
    return !!this.reportTimer && !this.isStopped;
  }
  startReporting() {
    if (this.reportTimer) return;
    const F = () =>
      setTimeout(() => {
        this.isStopped
          ? (this.reportTimer = void 0)
          : this.parseReports().finally(() => {
              this.reportTimer = F();
            });
      }, this.getStatsInterval);
    (this.isStopped = !1), (this.reportTimer = F());
  }
  stopReporting() {
    (this.isStopped = !0),
      this.reportTimer &&
        (clearTimeout(this.reportTimer), (this.reportTimer = void 0));
  }
  async parseReports() {
    const F = Date.now(),
      B = await this.compositeStatsParser.parse(),
      V = Date.now() - F;
    this.emit(Qe.STATS_REPORTS_PARSED, { timeTaken: V, reportItems: B }),
      B.forEach((j) => {
        this.emit(Qe.STATS_REPORT_READY_EVENT, j);
      });
  }
};
De(Qe, "STATS_REPORT_READY_EVENT", "stats-report-ready"),
  De(Qe, "STATS_REPORTS_PARSED", "stats-reports-parsed");
let S = Qe;
const v = (() => {
  const q = new Map();
  return (U) => {
    const { taskId: F, delayMs: B, maxJitterMs: V, callback: j } = U,
      $ = Math.ceil(Math.random() * (V || 0)),
      W = q.get(F);
    W && clearTimeout(W);
    const K = setTimeout(() => {
      j(), q.delete(F);
    }, B + $);
    q.set(F, K);
  };
})();
var Ke;
class k {
  constructor() {
    Pe(this, Ke, {});
  }
  calculate(U) {
    const {
        connection: { id: F },
      } = U,
      { mos: B, stats: V } = this.calculateOutboundScore(U) || {},
      { mos: j, stats: $ } = this.calculateInboundScore(U) || {};
    return (
      (be(this, Ke)[F] = U),
      v({ taskId: F, delayMs: 35e3, callback: () => delete be(this, Ke)[F] }),
      {
        outbound: B,
        inbound: j,
        connectionId: F,
        statsSamples: { inboundStatsSample: $, outboundStatsSample: V },
      }
    );
  }
  calculateOutboundScore(U) {
    var X, Z, ie, ee;
    const F = [
      ...(((X = U.remote) == null ? void 0 : X.audio.inbound) || []),
      ...(((Z = U.remote) == null ? void 0 : Z.video.inbound) || []),
    ];
    if (!F.length) return;
    const B = be(this, Ke)[U.connection.id];
    if (!B) return;
    const V = [
        ...(((ie = B.remote) == null ? void 0 : ie.audio.inbound) || []),
        ...(((ee = B.remote) == null ? void 0 : ee.video.inbound) || []),
      ],
      { packetsSent: j } = U.connection,
      $ = B.connection.packetsSent,
      W = F.reduce(
        (te, re) => {
          const ne = V.find((se) => se.ssrc === re.ssrc);
          return {
            sumJitter: te.sumJitter + re.jitter,
            packetsLost: te.packetsLost + re.packetsLost,
            lastPacketsLost:
              te.lastPacketsLost +
              ((ne == null ? void 0 : ne.packetsLost) || 0),
          };
        },
        { sumJitter: 0, packetsLost: 0, lastPacketsLost: 0 }
      ),
      K = 1e3 * U.connection.currentRoundTripTime || 0,
      { sumJitter: G } = W,
      Q = G / F.length,
      z = j - $,
      H = W.packetsLost - W.lastPacketsLost,
      Y = z && H ? Math.round((100 * H) / (z + H)) : 0;
    return {
      mos: this.calculateMOS({ avgJitter: Q, rtt: K, packetsLoss: Y }),
      stats: { avgJitter: Q, rtt: K, packetsLoss: Y },
    };
  }
  calculateInboundScore(U) {
    var X, Z, ie, ee;
    const F = [
      ...((X = U.audio) == null ? void 0 : X.inbound),
      ...((Z = U.video) == null ? void 0 : Z.inbound),
    ];
    if (!F.length) return;
    const B = be(this, Ke)[U.connection.id];
    if (!B) return;
    const V = [
        ...((ie = B.video) == null ? void 0 : ie.inbound),
        ...((ee = B.audio) == null ? void 0 : ee.inbound),
      ],
      { packetsReceived: j } = U.connection,
      $ = B.connection.packetsReceived,
      W = F.reduce(
        (te, re) => {
          const ne = V.find((se) => se.ssrc === re.ssrc);
          return {
            sumJitter: te.sumJitter + re.jitter,
            packetsLost: te.packetsLost + re.packetsLost,
            lastPacketsLost:
              te.lastPacketsLost +
              ((ne == null ? void 0 : ne.packetsLost) || 0),
          };
        },
        { sumJitter: 0, packetsLost: 0, lastPacketsLost: 0 }
      ),
      K = 1e3 * U.connection.currentRoundTripTime || 0,
      { sumJitter: G } = W,
      Q = G / F.length,
      z = j - $,
      H = W.packetsLost - W.lastPacketsLost,
      Y = z && H ? Math.round((100 * H) / (z + H)) : 0;
    return {
      mos: this.calculateMOS({ avgJitter: Q, rtt: K, packetsLoss: Y }),
      stats: { avgJitter: Q, rtt: K, packetsLoss: Y },
    };
  }
  calculateMOS({ avgJitter: U, rtt: F, packetsLoss: B }) {
    const V = F + 2 * U + 10;
    let j = V < 160 ? 93.2 - V / 40 : 93.2 - V / 120 - 10;
    return (j -= 2.5 * B), 1 + 0.035 * j + 7e-6 * j * (j - 60) * (100 - j);
  }
}
Ke = new WeakMap();
var $e, Xe, Ze;
class y {
  constructor(U = {}) {
    Pe(this, $e, new Map());
    Pe(this, Xe);
    Pe(this, Ze);
    Ie(this, Xe, U.statsCleanupTtlMs ?? 35e3),
      Ie(this, Ze, U.maxParsedStatsStorageSize ?? 5);
  }
  detect(U, F) {
    const B = {
        ...U,
        networkScores: {
          ...F,
          statsSamples: (F == null ? void 0 : F.statsSamples) || {},
        },
      },
      V = this.performDetection(B);
    return (
      this.setLastProcessedStats(U.connection.id, B),
      this.performPrevStatsCleanup({ connectionId: U.connection.id }),
      V
    );
  }
  performPrevStatsCleanup(U) {
    const { connectionId: F, cleanupCallback: B } = U;
    be(this, $e).has(F) &&
      v({
        taskId: F,
        delayMs: be(this, Xe),
        callback: () => {
          this.deleteLastProcessedStats(F), typeof B == "function" && B();
        },
      });
  }
  setLastProcessedStats(U, F) {
    if (!U || F.connection.id !== U) return;
    const B = be(this, $e).get(U) ?? [];
    B.push(F), B.length > be(this, Ze) && B.shift(), be(this, $e).set(U, B);
  }
  getLastProcessedStats(U) {
    const F = be(this, $e).get(U);
    return F == null ? void 0 : F[F.length - 1];
  }
  getAllLastProcessedStats(U) {
    return be(this, $e).get(U) ?? [];
  }
  deleteLastProcessedStats(U) {
    be(this, $e).delete(U);
  }
}
($e = new WeakMap()), (Xe = new WeakMap()), (Ze = new WeakMap());
var et;
class w extends y {
  constructor(F = {}) {
    super(F);
    Pe(this, et);
    Ie(this, et, F.availableOutgoingBitrateThreshold ?? 1e5);
  }
  performDetection(F) {
    const B = [],
      { availableOutgoingBitrate: V } = F.connection;
    if (V === void 0) return B;
    const j = F.audio.outbound.reduce((K, G) => K + G.targetBitrate, 0),
      $ = F.video.outbound.reduce((K, G) => K + G.bitrate, 0);
    if (!j && !$) return B;
    const W = {
      availableOutgoingBitrate: V,
      videoStreamsTotalBitrate: $,
      audioStreamsTotalTargetBitrate: j,
    };
    return (
      (j > V || ($ > 0 && V < be(this, et))) &&
        B.push({
          statsSample: W,
          type: e.Network,
          reason: s.OutboundNetworkThroughput,
        }),
      B
    );
  }
}
et = new WeakMap();
var tt, it, nt, rt;
class b extends y {
  constructor(F = {}) {
    super();
    Pe(this, tt);
    Pe(this, it);
    Pe(this, nt);
    Pe(this, rt);
    Ie(this, tt, F.highPacketLossThresholdPct ?? 5),
      Ie(this, it, F.highJitterThreshold ?? 200),
      Ie(this, nt, F.highJitterBufferDelayThresholdMs ?? 500),
      Ie(this, rt, F.highRttThresholdMs ?? 250);
  }
  performDetection(F) {
    return this.processData(F);
  }
  processData(F) {
    var he, ue, Te, we;
    const B = [],
      V = [
        ...((he = F.audio) == null ? void 0 : he.inbound),
        ...((ue = F.video) == null ? void 0 : ue.inbound),
      ];
    if (!V.length) return B;
    const j = this.getLastProcessedStats(F.connection.id);
    if (!j) return B;
    const $ = [
        ...((Te = j.video) == null ? void 0 : Te.inbound),
        ...((we = j.audio) == null ? void 0 : we.inbound),
      ],
      { packetsReceived: W } = F.connection,
      K = j.connection.packetsReceived,
      G = V.reduce(
        (me, ye) => {
          const Ce = $.find((Ue) => Ue.ssrc === ye.ssrc),
            Ee = (Ce == null ? void 0 : Ce.jitterBufferDelay) || 0,
            Oe = (Ce == null ? void 0 : Ce.jitterBufferEmittedCount) || 0,
            Le = ye.jitterBufferDelay - Ee,
            _e = ye.jitterBufferEmittedCount - Oe,
            Ae = Le && _e ? (1e3 * Le) / _e : 0;
          return {
            sumJitter: me.sumJitter + ye.jitter,
            sumJitterBufferDelayMs: me.sumJitterBufferDelayMs + Ae,
            packetsLost: me.packetsLost + ye.packetsLost,
            lastPacketsLost:
              me.lastPacketsLost +
              ((Ce == null ? void 0 : Ce.packetsLost) || 0),
          };
        },
        {
          sumJitter: 0,
          sumJitterBufferDelayMs: 0,
          packetsLost: 0,
          lastPacketsLost: 0,
        }
      ),
      Q = 1e3 * F.connection.currentRoundTripTime || 0,
      { sumJitter: z, sumJitterBufferDelayMs: H } = G,
      Y = z / V.length,
      X = H / V.length,
      Z = W - K,
      ie = G.packetsLost - G.lastPacketsLost,
      ee = Z && ie ? Math.round((100 * ie) / (Z + ie)) : 0,
      te = ee > be(this, tt),
      re = Y >= be(this, it),
      ne = Q >= be(this, rt),
      se = X > be(this, nt),
      oe = ne && !re && !te,
      le = te && re,
      fe = re && se,
      pe = { rtt: Q, packetLossPct: ee, avgJitter: Y, avgJitterBufferDelay: X };
    return (
      (re || te) &&
        B.push({
          statsSample: pe,
          type: e.Network,
          reason: s.InboundNetworkQuality,
          iceCandidate: F.connection.local.id,
        }),
      oe &&
        B.push({
          statsSample: pe,
          type: e.Server,
          reason: s.ServerIssue,
          iceCandidate: F.connection.remote.id,
        }),
      le &&
        B.push({
          statsSample: pe,
          type: e.Network,
          reason: s.InboundNetworkMediaLatency,
          iceCandidate: F.connection.local.id,
        }),
      fe &&
        B.push({
          statsSample: pe,
          type: e.Network,
          reason: s.NetworkMediaSyncFailure,
          iceCandidate: F.connection.local.id,
        }),
      B
    );
  }
}
(tt = new WeakMap()),
  (it = new WeakMap()),
  (nt = new WeakMap()),
  (rt = new WeakMap());
var st;
class P extends y {
  constructor(F = {}) {
    super();
    Pe(this, st);
    Ie(this, st, F.correctedSamplesThresholdPct ?? 5);
  }
  performDetection(F) {
    return this.processData(F);
  }
  processData(F) {
    var $;
    const B = F.audio.inbound,
      V = [],
      j =
        ($ = this.getLastProcessedStats(F.connection.id)) == null
          ? void 0
          : $.audio.inbound;
    return (
      j &&
        B.forEach((W) => {
          const K = j.find((Z) => Z.ssrc === W.ssrc);
          if (!K) return;
          const G =
              W.track.insertedSamplesForDeceleration +
              W.track.removedSamplesForAcceleration,
            Q =
              K.track.insertedSamplesForDeceleration +
              K.track.removedSamplesForAcceleration;
          if (G === Q) return;
          const z = W.track.totalSamplesReceived - K.track.totalSamplesReceived,
            H = G - Q,
            Y = Math.round((100 * H) / z),
            X = { correctedSamplesPct: Y };
          Y > be(this, st) &&
            V.push({
              statsSample: X,
              type: e.Network,
              reason: s.NetworkMediaSyncFailure,
              ssrc: W.ssrc,
            });
        }),
      V
    );
  }
}
st = new WeakMap();
var ot, at;
class T extends y {
  constructor(F = {}) {
    super();
    Pe(this, ot);
    Pe(this, at);
    Ie(this, ot, F.highPacketLossThresholdPct ?? 5),
      Ie(this, at, F.highJitterThreshold ?? 200);
  }
  performDetection(F) {
    return this.processData(F);
  }
  processData(F) {
    var ne, se, oe, le;
    const B = [],
      V = [
        ...(((ne = F.remote) == null ? void 0 : ne.audio.inbound) || []),
        ...(((se = F.remote) == null ? void 0 : se.video.inbound) || []),
      ];
    if (!V.length) return B;
    const j = this.getLastProcessedStats(F.connection.id);
    if (!j) return B;
    const $ = [
        ...(((oe = j.remote) == null ? void 0 : oe.audio.inbound) || []),
        ...(((le = j.remote) == null ? void 0 : le.video.inbound) || []),
      ],
      { packetsSent: W } = F.connection,
      K = j.connection.packetsSent,
      G = V.reduce(
        (fe, pe) => {
          const he = $.find((ue) => ue.ssrc === pe.ssrc);
          return {
            sumJitter: fe.sumJitter + pe.jitter,
            packetsLost: fe.packetsLost + pe.packetsLost,
            lastPacketsLost:
              fe.lastPacketsLost +
              ((he == null ? void 0 : he.packetsLost) || 0),
          };
        },
        { sumJitter: 0, packetsLost: 0, lastPacketsLost: 0 }
      ),
      Q = 1e3 * F.connection.currentRoundTripTime || 0,
      { sumJitter: z } = G,
      H = z / V.length,
      Y = W - K,
      X = G.packetsLost - G.lastPacketsLost,
      Z = Y && X ? Math.round((100 * X) / (Y + X)) : 0,
      ie = Z > be(this, ot),
      ee = H >= be(this, at),
      te = (!ie && ee) || ee || ie,
      re = { rtt: Q, avgJitter: H, packetLossPct: Z };
    return (
      ie &&
        ee &&
        B.push({
          statsSample: re,
          type: e.Network,
          reason: s.OutboundNetworkMediaLatency,
          iceCandidate: F.connection.local.id,
        }),
      te &&
        B.push({
          statsSample: re,
          type: e.Network,
          reason: s.OutboundNetworkQuality,
          iceCandidate: F.connection.local.id,
        }),
      B
    );
  }
}
(ot = new WeakMap()), (at = new WeakMap());
class L extends y {
  performDetection(U) {
    return this.processData(U);
  }
  processData(U) {
    var j;
    const F = U.video.outbound.filter(
        ($) => $.qualityLimitationReason !== "none"
      ),
      B = [],
      V =
        (j = this.getLastProcessedStats(U.connection.id)) == null
          ? void 0
          : j.video.outbound;
    return (
      V &&
        F.forEach(($) => {
          const W = V.find((G) => G.ssrc === $.ssrc);
          if (!W) return;
          const K = { qualityLimitationReason: $.qualityLimitationReason };
          $.framesSent > W.framesSent ||
            ($.qualityLimitationReason === "cpu" &&
              B.push({
                statsSample: K,
                type: e.CPU,
                reason: s.EncoderCPUThrottling,
                ssrc: $.ssrc,
              }),
            $.qualityLimitationReason === "bandwidth" &&
              B.push({
                statsSample: K,
                type: e.Network,
                reason: s.OutboundNetworkThroughput,
                ssrc: $.ssrc,
              }));
        }),
      B
    );
  }
}
var Ge;
class D extends y {
  constructor() {
    super(...arguments);
    De(this, "UNKNOWN_DECODER", "unknown");
    Pe(this, Ge, {});
  }
  performDetection(F) {
    return this.processData(F);
  }
  performPrevStatsCleanup(F) {
    const { connectionId: B, cleanupCallback: V } = F;
    super.performPrevStatsCleanup({
      ...F,
      cleanupCallback: () => {
        delete be(this, Ge)[B], typeof V == "function" && V();
      },
    });
  }
  processData(F) {
    var $;
    const B = [],
      { id: V } = F.connection,
      j =
        ($ = this.getLastProcessedStats(V)) == null ? void 0 : $.video.inbound;
    return (
      F.video.inbound.forEach((W) => {
        const { decoderImplementation: K, ssrc: G } = W;
        if (j == null ? void 0 : j.find((z) => z.ssrc === G))
          if (K === this.UNKNOWN_DECODER) {
            if (!this.hadLastDecoderWithIssue(V, G)) {
              this.setLastDecoderWithIssue(V, G, this.UNKNOWN_DECODER);
              const z = { mimeType: W.mimeType, decoderImplementation: K };
              B.push({
                ssrc: G,
                statsSample: z,
                type: e.Stream,
                reason: s.UnknownVideoDecoderIssue,
                trackIdentifier: W.track.trackIdentifier,
              });
            }
          } else this.setLastDecoderWithIssue(V, G, void 0);
      }),
      B
    );
  }
  setLastDecoderWithIssue(F, B, V) {
    const j = be(this, Ge)[F] ?? {};
    V === void 0 ? delete j[B] : (j[B] = V), (be(this, Ge)[F] = j);
  }
  hadLastDecoderWithIssue(F, B) {
    const V = be(this, Ge)[F];
    return (V && V[B]) === this.UNKNOWN_DECODER;
  }
}
Ge = new WeakMap();
const C = (q) => q.reduce((U, F) => U + F, 0) / q.length,
  R = (q, U, F = 30) => {
    var V, j, $, W, K;
    const B = [];
    for (let G = 1; G < U.length - 1; G += 1) {
      const Q =
        (j = (V = U[G]) == null ? void 0 : V.video) == null
          ? void 0
          : j.inbound.find((X) => X.ssrc === q);
      if (!Q) continue;
      const z =
        (K =
          (W = ($ = U[G - 1]) == null ? void 0 : $.video) == null
            ? void 0
            : W.inbound) == null
          ? void 0
          : K.find((X) => X.ssrc === q);
      if (!Q || !z) continue;
      const H = Q.timestamp - z.timestamp,
        Y = Q.framesDecoded - z.framesDecoded;
      if (Y > 0) {
        const X = H / Y;
        B.push(X);
      }
    }
    return B.length <= 1
      ? !1
      : ((G) => {
          const Q = ((z, H) =>
            H.reduce((Y, X) => Y + (X - z) ** 2, 0) / H.length)(C(G), G);
          return Math.sqrt(Q);
        })(B) > F;
  },
  M = (q, U) => {
    for (let F = 1; F < U.length; F += 1) {
      const B = U[F].video.inbound.find((W) => W.ssrc === q);
      if (!B) continue;
      const V = U[F - 1].video.inbound.find((W) => W.ssrc === q),
        j = B.frameWidth !== (V == null ? void 0 : V.frameWidth),
        $ = B.frameHeight !== (V == null ? void 0 : V.frameHeight);
      if (j || $) return !0;
    }
    return !1;
  };
var ct, dt, ut;
class I extends y {
  constructor(F = {}) {
    super();
    Pe(this, ct);
    Pe(this, dt);
    Pe(this, ut);
    Ie(this, ct, F.avgFreezeDurationThresholdMs ?? 1e3),
      Ie(this, dt, F.frozenDurationThresholdPct ?? 30),
      Ie(this, ut, F.minMosQuality ?? n.BAD);
  }
  performDetection(F) {
    const B = F.networkScores.inbound;
    return B !== void 0 && B <= be(this, ut) ? [] : this.processData(F);
  }
  processData(F) {
    const B = [],
      V = this.getAllLastProcessedStats(F.connection.id);
    if (V.length === 0) return [];
    const j = F.video.inbound
      .map(($) => {
        const W = V[V.length - 1].video.inbound.find((H) => H.ssrc === $.ssrc);
        if (!W || M($.ssrc, [V[V.length - 1], F]) || R($.ssrc, V)) return;
        const K = $.freezeCount - (W.freezeCount ?? 0),
          G = 1e3 * ($.totalFreezesDuration - (W.totalFreezesDuration ?? 0)),
          Q = K > 0 ? G / K : 0,
          z = (G / ($.timestamp - W.timestamp)) * 100;
        return z > be(this, dt) || Q > be(this, ct)
          ? { ssrc: $.ssrc, avgFreezeDurationMs: Q, frozenDurationPct: z }
          : void 0;
      })
      .filter(($) => $ !== void 0);
    return (
      j.length > 0 &&
        (B.push({
          type: e.Stream,
          reason: s.FrozenVideoTrack,
          statsSample: { ssrcs: j.map(($) => $.ssrc) },
        }),
        this.deleteLastProcessedStats(F.connection.id)),
      B
    );
  }
}
(ct = new WeakMap()), (dt = new WeakMap()), (ut = new WeakMap());
var lt, ht, pt;
class E extends y {
  constructor(F = {}) {
    super(F);
    Pe(this, lt);
    Pe(this, ht);
    Pe(this, pt);
    Ie(this, lt, F.volatilityThreshold ?? 8),
      Ie(this, ht, F.affectedStreamsPercentThreshold ?? 30),
      Ie(this, pt, F.minMosQuality ?? n.BAD);
  }
  performDetection(F) {
    return [...this.getAllLastProcessedStats(F.connection.id), F].find(
      (B) =>
        B.networkScores.inbound !== void 0 &&
        B.networkScores.inbound <= be(this, pt)
    )
      ? []
      : this.processData(F);
  }
  processData(F) {
    const B = [],
      V = [...this.getAllLastProcessedStats(F.connection.id), F],
      j = F.video.inbound
        .map((W) => {
          if (V.length < 5 || M(W.ssrc, V)) return;
          const K = [];
          for (let Q = 0; Q < V.length - 1; Q += 1) {
            const z = V[Q].video.inbound.find((H) => H.ssrc === W.ssrc);
            (z == null ? void 0 : z.framesPerSecond) !== void 0 &&
              K.push(z.framesPerSecond);
          }
          if (K.length < 5 || R(W.ssrc, V)) return;
          const G = ((Q) => {
            if (Q.length === 0)
              throw new Error("Cannot calculate volatility for empty array");
            const z = C(Q);
            return (
              ((Q.reduce((H, Y) => H + Math.abs(Y - z), 0) / Q.length) * 100) /
              z
            );
          })(K);
          return G > be(this, lt)
            ? { ssrc: W.ssrc, allFps: K, volatility: G }
            : void 0;
        })
        .filter((W) => !!W);
    if (j.length === 0) return B;
    const $ = j.length / (F.video.inbound.length / 100);
    return (
      $ > be(this, ht) &&
        (B.push({
          type: e.CPU,
          reason: s.DecoderCPUThrottling,
          statsSample: { affectedStreamsPercent: $, throtthedStreams: j },
        }),
        this.deleteLastProcessedStats(F.connection.id)),
      B
    );
  }
}
(lt = new WeakMap()), (ht = new WeakMap()), (pt = new WeakMap());
const N = (q) =>
    q.iceConnectionState === "closed" || q.connectionState === "closed",
  _ = (q, U, F) =>
    8 *
    ((B, V, j) => {
      if (!V) return 0;
      const $ = B[j],
        W = V[j];
      if ($ == null || W == null) return 0;
      const K = Math.floor(B.timestamp) - Math.floor(V.timestamp);
      return K === 0 ? 0 : ((Number($) - Number(W)) / K) * 1e3;
    })(q, U, F);
class A {
  constructor(U) {
    De(this, "connections", []);
    De(this, "statsParser");
    this.statsParser = U.statsParser;
  }
  listConnections() {
    return [...this.connections];
  }
  addPeerConnection(U) {
    this.connections.push({
      id: U.id ?? String(Date.now() + Math.random().toString(32)),
      pc: U.pc,
    });
  }
  removePeerConnection(U) {
    const F = this.connections.findIndex(({ pc: B }) => B === U.pc);
    F >= 0 && this.removeConnectionsByIndexes([F]);
  }
  async parse() {
    const U = [],
      F = this.connections.map(async (B, V) => {
        if (!N(B.pc)) return this.statsParser.parse(B);
        U.unshift(V);
      });
    return (
      U.length && this.removeConnectionsByIndexes(U),
      (await Promise.all(F)).filter((B) => B !== void 0)
    );
  }
  removeConnectionsByIndexes(U) {
    U.forEach((F) => {
      this.connections.splice(F, 1);
    });
  }
}
class O {
  constructor(U) {
    De(this, "prevStats", new Map());
    De(
      this,
      "allowedReportTypes",
      new Set([
        "candidate-pair",
        "inbound-rtp",
        "outbound-rtp",
        "remote-outbound-rtp",
        "remote-inbound-rtp",
        "track",
        "transport",
      ])
    );
    De(this, "ignoreSSRCList");
    De(this, "logger");
    (this.ignoreSSRCList = U.ignoreSSRCList ?? []), (this.logger = U.logger);
  }
  get previouslyParsedStatsConnectionsIds() {
    return [...this.prevStats.keys()];
  }
  async parse(U) {
    if (!N(U.pc)) return this.getConnectionStats(U);
    this.logger.debug("Skip stats parsing. Connection is closed.", {
      connection: U,
    });
  }
  async getConnectionStats(U) {
    const { pc: F, id: B } = U;
    try {
      const V = Date.now(),
        j = F.getReceivers().filter((G) => {
          var Q;
          return (Q = G.track) == null ? void 0 : Q.enabled;
        }),
        $ = F.getSenders().filter((G) => {
          var Q;
          return (Q = G.track) == null ? void 0 : Q.enabled;
        }),
        W = await Promise.all(j.map((G) => G.getStats())),
        K = await Promise.all($.map((G) => G.getStats()));
      return {
        id: B,
        stats: this.mapReportsStats([...W, ...K], U),
        timeTaken: Date.now() - V,
      };
    } catch (V) {
      return void this.logger.error("Failed to get stats for PC", {
        id: B,
        pc: F,
        error: V,
      });
    }
  }
  mapReportsStats(U, F) {
    const B = {
      audio: { inbound: [], outbound: [] },
      video: { inbound: [], outbound: [] },
      connection: {},
      remote: {
        video: { inbound: [], outbound: [] },
        audio: { inbound: [], outbound: [] },
      },
    };
    U.forEach(($) => {
      $.forEach((W) => {
        this.allowedReportTypes.has(W.type) &&
          this.updateMappedStatsWithReportItemData(W, B, $);
      });
    });
    const { id: V } = F,
      j = this.prevStats.get(V);
    return (
      j && this.propagateStatsWithRateValues(B, j.stats),
      this.prevStats.set(V, { stats: B, ts: Date.now() }),
      v({ taskId: V, delayMs: 35e3, callback: () => this.prevStats.delete(V) }),
      B
    );
  }
  updateMappedStatsWithReportItemData(U, F, B) {
    const V = U.type;
    if (V === "candidate-pair" && U.state === "succeeded" && U.nominated)
      return void (F.connection = this.prepareConnectionStats(U, B));
    const j = this.getMediaType(U);
    if (!j) return;
    const $ = U.ssrc;
    if (!$ || !this.ignoreSSRCList.includes($))
      if (V !== "outbound-rtp")
        if (V !== "inbound-rtp")
          V !== "remote-outbound-rtp"
            ? V === "remote-inbound-rtp" &&
              (this.mapConnectionStatsIfNecessary(F, U, B),
              F.remote[j].inbound.push({ ...U }))
            : F.remote[j].outbound.push({ ...U });
        else {
          const W = B.get(U.trackId) || B.get(U.mediaSourceId) || {};
          this.mapConnectionStatsIfNecessary(F, U, B);
          const K = { ...U, track: { ...W } };
          F[j].inbound.push(K);
        }
      else {
        const W = B.get(U.trackId) || B.get(U.mediaSourceId) || {},
          K = { ...U, track: { ...W } };
        F[j].outbound.push(K);
      }
  }
  getMediaType(U) {
    const F = U.mediaType || U.kind;
    if (!["audio", "video"].includes(F)) {
      const { id: B } = U;
      return B
        ? String(B).includes("Video")
          ? "video"
          : String(B).includes("Audio")
          ? "audio"
          : void 0
        : void 0;
    }
    return F;
  }
  propagateStatsWithRateValues(U, F) {
    U.audio.inbound.forEach((B) => {
      const V = F.audio.inbound.find(({ id: j }) => j === B.id);
      (B.bitrate = _(B, V, "bytesReceived")),
        (B.packetRate = _(B, V, "packetsReceived"));
    }),
      U.audio.outbound.forEach((B) => {
        const V = F.audio.outbound.find(({ id: j }) => j === B.id);
        (B.bitrate = _(B, V, "bytesSent")),
          (B.packetRate = _(B, V, "packetsSent"));
      }),
      U.video.inbound.forEach((B) => {
        const V = F.video.inbound.find(({ id: j }) => j === B.id);
        (B.bitrate = _(B, V, "bytesReceived")),
          (B.packetRate = _(B, V, "packetsReceived"));
      }),
      U.video.outbound.forEach((B) => {
        const V = F.video.outbound.find(({ id: j }) => j === B.id);
        (B.bitrate = _(B, V, "bytesSent")),
          (B.packetRate = _(B, V, "packetsSent"));
      });
  }
  mapConnectionStatsIfNecessary(U, F, B) {
    if (U.connection.id || !F.transportId) return;
    const V = B.get(F.transportId);
    if (V && V.selectedCandidatePairId) {
      const j = B.get(V.selectedCandidatePairId);
      U.connection = this.prepareConnectionStats(j, B);
    }
  }
  prepareConnectionStats(U, F) {
    if (!U || !F) return {};
    const B = { ...U };
    if (B.remoteCandidateId) {
      const V = F.get(B.remoteCandidateId);
      B.remote = { ...V };
    }
    if (B.localCandidateId) {
      const V = F.get(B.localCandidateId);
      B.local = { ...V };
    }
    return B;
  }
}
var We, ze, He;
const gt = class gt extends y {
  constructor(F = {}) {
    super();
    Pe(this, We, new Map());
    Pe(this, ze);
    Pe(this, He);
    Ie(this, ze, F.timeoutMs ?? 15e3), Ie(this, He, F.steps ?? 3);
  }
  performDetection(F) {
    return this.processData(F);
  }
  processData(F) {
    const B = [],
      V = [...this.getAllLastProcessedStats(F.connection.id), F];
    if (V.length < be(this, He)) return B;
    const j = V.slice(-be(this, He)),
      $ = j.map((K) => K.video.inbound),
      W = j.map((K) => K.audio.inbound);
    return (
      B.push(...this.detectMissingData(W, e.Stream, s.MissingAudioStreamData)),
      B.push(...this.detectMissingData($, e.Stream, s.MissingVideoStreamData)),
      new Set(be(this, We).keys()).forEach((K) => {
        const G = be(this, We).get(K);
        G && Date.now() - G > be(this, ze) && this.removeMarkedIssue(K);
      }),
      B
    );
  }
  detectMissingData(F, B, V) {
    const j = [],
      $ = F.pop(),
      W = gt.mapStatsByTrackId(F);
    return (
      $.forEach((K) => {
        const G = K.track.trackIdentifier,
          Q = W.get(G);
        if (
          !Array.isArray(Q) ||
          Q.length === 0 ||
          K.track.detached ||
          K.track.ended
        )
          return;
        if (!gt.isAllBytesReceivedDidntChange(K.bytesReceived, Q))
          return void this.removeMarkedIssue(G);
        if (!this.markIssue(G)) return;
        const z = { bytesReceived: K.bytesReceived };
        j.push({ type: B, reason: V, statsSample: z, trackIdentifier: G });
      }),
      j
    );
  }
  static mapStatsByTrackId(F) {
    const B = new Map();
    return (
      F.forEach((V) => {
        V.forEach((j) => {
          const $ = B.get(j.track.trackIdentifier) || [];
          $.push(j), B.set(j.track.trackIdentifier, $);
        });
      }),
      B
    );
  }
  static isAllBytesReceivedDidntChange(F, B) {
    for (let V = 0; V < B.length; V += 1)
      if (B[V].bytesReceived !== F) return !1;
    return !0;
  }
  markIssue(F) {
    const B = Date.now(),
      V = be(this, We).get(F);
    return (!V || B - V > be(this, ze)) && (be(this, We).set(F, B), !0);
  }
  removeMarkedIssue(F) {
    be(this, We).delete(F);
  }
};
(We = new WeakMap()), (ze = new WeakMap()), (He = new WeakMap());
let J = gt;
var je;
class x {
  constructor(U) {
    De(this, "eventEmitter");
    Pe(this, je, !1);
    De(this, "detectors", []);
    De(this, "networkScoresCalculator");
    De(this, "statsReporter");
    De(this, "compositeStatsParser");
    De(this, "logger");
    De(this, "autoAddPeerConnections");
    (this.logger = U.logger ?? {
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    }),
      (this.eventEmitter = U.issueEmitter ?? new g()),
      U.onIssues && this.eventEmitter.on(t.Issue, U.onIssues),
      U.onNetworkScoresUpdated &&
        this.eventEmitter.on(t.NetworkScoresUpdated, U.onNetworkScoresUpdated),
      (this.detectors = U.detectors ?? [
        new L(),
        new b(),
        new T(),
        new P(),
        new w(),
        new D(),
        new I(),
        new E(),
        new J(),
      ]),
      (this.networkScoresCalculator = U.networkScoresCalculator ?? new k()),
      (this.compositeStatsParser =
        U.compositeStatsParser ??
        new A({
          statsParser: new O({
            ignoreSSRCList: U.ignoreSSRCList,
            logger: this.logger,
          }),
        })),
      (this.statsReporter =
        U.statsReporter ??
        new S({
          compositeStatsParser: this.compositeStatsParser,
          getStatsInterval: U.getStatsInterval ?? 5e3,
        })),
      (window.wid = this),
      (this.autoAddPeerConnections = U.autoAddPeerConnections ?? !0),
      this.autoAddPeerConnections && this.wrapRTCPeerConnection(),
      this.statsReporter.on(S.STATS_REPORT_READY_EVENT, (F) => {
        const B = this.calculateNetworkScores(F.stats);
        this.detectIssues({ data: F.stats }, B);
      }),
      this.statsReporter.on(S.STATS_REPORTS_PARSED, (F) => {
        const B = { timeTaken: F.timeTaken, ts: Date.now() };
        U.onStats && U.onStats(F.reportItems),
          this.eventEmitter.emit(t.StatsParsingFinished, B);
      });
  }
  watchNewPeerConnections() {
    if (!this.autoAddPeerConnections)
      throw new Error(
        "Auto add peer connections was disabled in the constructor."
      );
    be(this, je)
      ? this.logger.warn(
          "WebRTCIssueDetector is already started. Skip processing"
        )
      : (this.logger.info("Start watching peer connections"),
        Ie(this, je, !0),
        this.statsReporter.startReporting());
  }
  stopWatchingNewPeerConnections() {
    be(this, je)
      ? (this.logger.info("Stop watching peer connections"),
        Ie(this, je, !1),
        this.statsReporter.stopReporting())
      : this.logger.warn(
          "WebRTCIssueDetector is already stopped. Skip processing"
        );
  }
  handleNewPeerConnection(U, F) {
    be(this, je) || !this.autoAddPeerConnections
      ? (be(this, je) ||
          this.autoAddPeerConnections !== !1 ||
          (this.logger.info("Starting stats reporting for new peer connection"),
          Ie(this, je, !0),
          this.statsReporter.startReporting()),
        this.logger.debug("Handling new peer connection", U),
        this.compositeStatsParser.addPeerConnection({ pc: U, id: F }))
      : this.logger.debug(
          "Skip handling new peer connection. Detector is not running",
          U
        );
  }
  emitIssues(U) {
    this.eventEmitter.emit(t.Issue, U);
  }
  detectIssues({ data: U }, F) {
    const B = this.detectors.reduce((V, j) => [...V, ...j.detect(U, F)], []);
    B.length > 0 && this.emitIssues(B);
  }
  calculateNetworkScores(U) {
    const F = this.networkScoresCalculator.calculate(U);
    return this.eventEmitter.emit(t.NetworkScoresUpdated, F), F;
  }
  wrapRTCPeerConnection() {
    if (!window.RTCPeerConnection)
      return void this.logger.warn(
        "No RTCPeerConnection found in browser window. Skipping"
      );
    const U = window.RTCPeerConnection,
      F = (V) => this.handleNewPeerConnection(V);
    function B(V) {
      const j = new U(V);
      return F(j), j;
    }
    (B.prototype = U.prototype), (window.RTCPeerConnection = B);
  }
}
je = new WeakMap();
var WebRTCConnectionQualityIndicator = (function (q) {
    __extends(U, q);
    function U() {
      var F = (q !== null && q.apply(this, arguments)) || this;
      return (F.issueDetector = null), (F.mosScores = null), F;
    }
    return (
      (U.prototype._start = function (F) {
        var B = this;
        (this.issueDetector = new x({
          autoAddPeerConnections: !1,
          getStatsInterval: 3e3,
          onNetworkScoresUpdated: function (V) {
            (B.mosScores = V), B.handleStatsChanged();
          },
        })),
          this.issueDetector.handleNewPeerConnection(F);
      }),
      (U.prototype._stop = function () {
        this.issueDetector &&
          (this.issueDetector.stopWatchingNewPeerConnections(),
          (this.issueDetector = null)),
          (this.mosScores = null);
      }),
      (U.prototype.calculateConnectionQuality = function () {
        return !this.mosScores ||
          (this.mosScores.inbound && this.mosScores.outbound)
          ? ConnectionQuality.UNKNOWN
          : (this.mosScores.inbound && this.mosScores.inbound < 3) ||
            (this.mosScores.outbound && this.mosScores.outbound < 3)
          ? ConnectionQuality.BAD
          : ConnectionQuality.GOOD;
      }),
      U
    );
  })(AbstractConnectionQualityIndicator),
  VoiceChatState;
(function (q) {
  (q.INACTIVE = "inactive"),
    (q.STARTING = "starting"),
    (q.ACTIVE = "started"),
    (q.STOPPING = "stopping");
})(VoiceChatState || (VoiceChatState = {}));
var AbstractVoiceChat = (function () {
    function q() {}
    return q;
  })(),
  AbstractVoiceChatImplementation = (function (q) {
    __extends(U, q);
    function U() {
      var F = (q !== null && q.apply(this, arguments)) || this;
      return (F._isMuted = !0), (F.state = VoiceChatState.INACTIVE), F;
    }
    return (
      Object.defineProperty(U.prototype, "isMuted", {
        get: function () {
          return this._isMuted;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(U.prototype, "isVoiceChatting", {
        get: function () {
          return this.state !== VoiceChatState.INACTIVE;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (U.prototype.startVoiceChat = function (F) {
        return __awaiter(this, void 0, void 0, function () {
          var B;
          return __generator(this, function (V) {
            switch (V.label) {
              case 0:
                return this.state === VoiceChatState.INACTIVE
                  ? [3, 2]
                  : [4, this.stopVoiceChat()];
              case 1:
                V.sent(), (V.label = 2);
              case 2:
                return (
                  V.trys.push([2, 4, , 6]),
                  (this.state = VoiceChatState.STARTING),
                  [4, this._startVoiceChat(F)]
                );
              case 3:
                return V.sent(), (this.state = VoiceChatState.ACTIVE), [3, 6];
              case 4:
                return (B = V.sent()), [4, this.stopVoiceChat()];
              case 5:
                throw (V.sent(), B);
              case 6:
                return [2];
            }
          });
        });
      }),
      (U.prototype.stopVoiceChat = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (F) {
            switch (F.label) {
              case 0:
                return this.state === VoiceChatState.INACTIVE
                  ? [2]
                  : ((this.state = VoiceChatState.STOPPING),
                    [4, this._stopVoiceChat()]);
              case 1:
                return (
                  F.sent(),
                  (this._isMuted = !0),
                  (this.state = VoiceChatState.INACTIVE),
                  [2]
                );
            }
          });
        });
      }),
      (U.prototype._mute = function () {}),
      (U.prototype._unmute = function () {}),
      (U.prototype.mute = function () {
        this.isVoiceChatting && (this._mute(), (this._isMuted = !0));
      }),
      (U.prototype.unmute = function () {
        this.isVoiceChatting && (this._unmute(), (this._isMuted = !1));
      }),
      U
    );
  })(AbstractVoiceChat);
function sleep(q) {
  return new Promise(function (U) {
    return setTimeout(U, q);
  });
}
function convertFloat32ToS16PCM(q) {
  for (var U = new Int16Array(q.length), F = 0; F < q.length; F++) {
    var B = Math.max(-1, Math.min(1, q[F]));
    U[F] = B < 0 ? B * 32768 : B * 32767;
  }
  return U;
}
var LivekitVoiceChat = (function (q) {
    __extends(U, q);
    function U() {
      var F = (q !== null && q.apply(this, arguments)) || this;
      return (F.room = null), (F.track = null), F;
    }
    return (
      (U.prototype._startVoiceChat = function (F) {
        return __awaiter(this, void 0, void 0, function () {
          var B, V;
          return __generator(this, function (j) {
            switch (j.label) {
              case 0:
                return (
                  (this.room = F.room),
                  (B = this),
                  [
                    4,
                    createLocalAudioTrack({
                      echoCancellation: !0,
                      noiseSuppression: !0,
                      autoGainControl: !0,
                    }),
                  ]
                );
              case 1:
                return (
                  (B.track = j.sent()),
                  [4, this.room.localParticipant.publishTrack(this.track)]
                );
              case 2:
                return (
                  j.sent(),
                  !((V = F.config) === null || V === void 0) && V.defaultMuted
                    ? this.mute()
                    : this.unmute(),
                  [4, sleep(4e3)]
                );
              case 3:
                return j.sent(), [2];
            }
          });
        });
      }),
      (U.prototype._stopVoiceChat = function () {
        return __awaiter(this, void 0, void 0, function () {
          var F;
          return __generator(this, function (B) {
            return (
              !((F = this.room) === null || F === void 0) &&
                F.localParticipant &&
                this.room.localParticipant
                  .getTrackPublications()
                  .forEach(function (V) {
                    V.track &&
                      V.track.kind === Track.Kind.Audio &&
                      V.track.stop();
                  }),
              this.track && (this.track.stop(), (this.track = null)),
              [2]
            );
          });
        });
      }),
      (U.prototype._mute = function () {
        this.track && !this.track.isMuted && this.track.mute();
      }),
      (U.prototype._unmute = function () {
        this.track && this.track.isMuted && this.track.unmute();
      }),
      U
    );
  })(AbstractVoiceChatImplementation),
  WebSocketVoiceChat = (function (q) {
    __extends(U, q);
    function U() {
      var F = (q !== null && q.apply(this, arguments)) || this;
      return (
        (F.audioContext = null),
        (F.webSocket = null),
        (F.scriptProcessor = null),
        (F.mediaStreamAudioSource = null),
        (F.mediaDevicesStream = null),
        (F.audioRawFrame = null),
        F
      );
    }
    return (
      (U.prototype._startVoiceChat = function (F) {
        return __awaiter(this, void 0, void 0, function () {
          var B,
            V = this,
            j,
            $,
            W,
            K;
          return __generator(this, function (G) {
            switch (G.label) {
              case 0:
                if (
                  !navigator.mediaDevices ||
                  !navigator.mediaDevices.getUserMedia
                )
                  throw new Error(
                    "Cannot start voice chat without media devices"
                  );
                return (
                  (this.webSocket = F.webSocket),
                  (this.audioRawFrame = F.audioRawFrame),
                  (this.audioContext = new window.AudioContext({
                    latencyHint: "interactive",
                    sampleRate: 16e3,
                  })),
                  (!((j = F.config) === null || j === void 0) &&
                    j.defaultMuted) ||
                    this.unmute(),
                  [
                    4,
                    navigator.mediaDevices.getUserMedia({
                      audio: {
                        sampleRate: 16e3,
                        channelCount: 1,
                        autoGainControl: !0,
                        echoCancellation: !0,
                        noiseSuppression: !0,
                      },
                    }),
                  ]
                );
              case 1:
                return (
                  (B = G.sent()),
                  (this.mediaDevicesStream = B),
                  (this.mediaStreamAudioSource =
                    ($ = this.audioContext) === null || $ === void 0
                      ? void 0
                      : $.createMediaStreamSource(B)),
                  (this.scriptProcessor =
                    (W = this.audioContext) === null || W === void 0
                      ? void 0
                      : W.createScriptProcessor(512, 1, 1)),
                  this.mediaStreamAudioSource.connect(this.scriptProcessor),
                  this.scriptProcessor.connect(
                    (K = this.audioContext) === null || K === void 0
                      ? void 0
                      : K.destination
                  ),
                  (this.scriptProcessor.onaudioprocess = function (Q) {
                    var z;
                    if (!(!V.webSocket || !V.audioRawFrame)) {
                      var H;
                      V.isMuted
                        ? (H = new Float32Array(512))
                        : (H = Q.inputBuffer.getChannelData(0));
                      var Y = convertFloat32ToS16PCM(H),
                        X = new Uint8Array(Y.buffer),
                        Z = V.audioRawFrame.create({
                          audio: {
                            audio: Array.from(X),
                            sampleRate: 16e3,
                            numChannels: 1,
                          },
                        }),
                        ie = new Uint8Array(V.audioRawFrame.encode(Z).finish());
                      (z = V.webSocket) === null || z === void 0 || z.send(ie);
                    }
                  }),
                  [4, sleep(2e3)]
                );
              case 2:
                return G.sent(), [2];
            }
          });
        });
      }),
      (U.prototype._stopVoiceChat = function () {
        return __awaiter(this, void 0, void 0, function () {
          var F, B;
          return __generator(this, function (V) {
            return (
              this.audioContext && (this.audioContext = null),
              this.scriptProcessor &&
                (this.scriptProcessor.disconnect(),
                (this.scriptProcessor = null)),
              this.mediaStreamAudioSource &&
                (this.mediaStreamAudioSource.disconnect(),
                (this.mediaStreamAudioSource = null)),
              this.mediaDevicesStream &&
                ((B =
                  (F = this.mediaDevicesStream) === null || F === void 0
                    ? void 0
                    : F.getTracks()) === null ||
                  B === void 0 ||
                  B.forEach(function (j) {
                    return j.stop();
                  }),
                (this.mediaDevicesStream = null)),
              [2]
            );
          });
        });
      }),
      U
    );
  })(AbstractVoiceChatImplementation),
  VoiceChatTransport;
(function (q) {
  (q.LIVEKIT = "livekit"), (q.WEBSOCKET = "websocket");
})(VoiceChatTransport || (VoiceChatTransport = {}));
var VoiceChatFactory = (function (q) {
    __extends(U, q);
    function U(F) {
      var B = F.voiceChatInstance,
        V = F.initialConfig,
        j = q.call(this) || this;
      return (j.initialConfig = V), (j.voiceChat = B), j;
    }
    return (
      Object.defineProperty(U.prototype, "isMuted", {
        get: function () {
          return this.voiceChat.isMuted;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(U.prototype, "isVoiceChatting", {
        get: function () {
          return this.voiceChat.isVoiceChatting;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (U.prototype.startVoiceChat = function (F) {
        return __awaiter(this, arguments, void 0, function (B) {
          var V = B.config;
          return __generator(this, function (j) {
            switch (j.label) {
              case 0:
                return [
                  4,
                  this.voiceChat.startVoiceChat(
                    __assign(__assign({}, this.initialConfig), { config: V })
                  ),
                ];
              case 1:
                return j.sent(), [2];
            }
          });
        });
      }),
      (U.prototype.stopVoiceChat = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (F) {
            switch (F.label) {
              case 0:
                return [4, this.voiceChat.stopVoiceChat()];
              case 1:
                return F.sent(), [2];
            }
          });
        });
      }),
      (U.prototype.mute = function () {
        this.voiceChat.mute();
      }),
      (U.prototype.unmute = function () {
        this.voiceChat.unmute();
      }),
      (U.createLiveKitVoiceChat = function (F) {
        return new this({
          voiceChatInstance: new LivekitVoiceChat(),
          initialConfig: F,
        });
      }),
      (U.createWebSocketVoiceChat = function (F) {
        return new this({
          voiceChatInstance: new WebSocketVoiceChat(),
          initialConfig: F,
        });
      }),
      U
    );
  })(AbstractVoiceChat),
  AvatarQuality;
(function (q) {
  (q.Low = "low"), (q.Medium = "medium"), (q.High = "high");
})(AvatarQuality || (AvatarQuality = {}));
var VoiceEmotion;
(function (q) {
  (q.EXCITED = "excited"),
    (q.SERIOUS = "serious"),
    (q.FRIENDLY = "friendly"),
    (q.SOOTHING = "soothing"),
    (q.BROADCASTER = "broadcaster");
})(VoiceEmotion || (VoiceEmotion = {}));
var ElevenLabsModel;
(function (q) {
  (q.eleven_flash_v2_5 = "eleven_flash_v2_5"),
    (q.eleven_multilingual_v2 = "eleven_multilingual_v2");
})(ElevenLabsModel || (ElevenLabsModel = {}));
var STTProvider;
(function (q) {
  (q.DEEPGRAM = "deepgram"), (q.GLADIA = "gladia");
})(STTProvider || (STTProvider = {}));
var TaskType;
(function (q) {
  (q.TALK = "talk"), (q.REPEAT = "repeat");
})(TaskType || (TaskType = {}));
var TaskMode;
(function (q) {
  (q.SYNC = "sync"), (q.ASYNC = "async");
})(TaskMode || (TaskMode = {}));
var StreamingEvents;
(function (q) {
  (q.AVATAR_START_TALKING = "avatar_start_talking"),
    (q.AVATAR_STOP_TALKING = "avatar_stop_talking"),
    (q.AVATAR_TALKING_MESSAGE = "avatar_talking_message"),
    (q.AVATAR_END_MESSAGE = "avatar_end_message"),
    (q.USER_TALKING_MESSAGE = "user_talking_message"),
    (q.USER_END_MESSAGE = "user_end_message"),
    (q.USER_START = "user_start"),
    (q.USER_STOP = "user_stop"),
    (q.USER_SILENCE = "user_silence"),
    (q.STREAM_READY = "stream_ready"),
    (q.STREAM_DISCONNECTED = "stream_disconnected"),
    (q.CONNECTION_QUALITY_CHANGED = "connection_quality_changed");
})(StreamingEvents || (StreamingEvents = {}));
var APIError = (function (q) {
    __extends(U, q);
    function U(F, B, V) {
      var j = q.call(this, F) || this;
      return (j.name = "APIError"), (j.status = B), (j.responseText = V), j;
    }
    return U;
  })(Error),
  ConnectionQualityIndicatorClass = QualityIndicatorMixer(
    {
      TrackerClass: LiveKitConnectionQualityIndicator,
      getParams: function (q) {
        return q;
      },
    },
    {
      TrackerClass: WebRTCConnectionQualityIndicator,
      getParams: function (q) {
        var U;
        return (
          (U = q.engine.pcManager) === null || U === void 0
            ? void 0
            : U.subscriber
        )._pc;
      },
    }
  ),
  StreamingAvatar = (function () {
    function q(U) {
      var F = U.token,
        B = U.basePath,
        V = B === void 0 ? "https://api.heygen.com" : B,
        j = this;
      (this.room = null),
        (this.mediaStream = null),
        (this.eventTarget = new EventTarget()),
        (this.webSocket = null),
        (this.sessionId = null),
        (this.voiceChat = null),
        (this.isLiveKitTransport = !1),
        (this.token = F),
        (this.basePath = V),
        (this.connectionQualityIndicator = new ConnectionQualityIndicatorClass(
          function ($) {
            return j.emit(StreamingEvents.CONNECTION_QUALITY_CHANGED, $);
          }
        ));
    }
    return (
      Object.defineProperty(q.prototype, "connectionQuality", {
        get: function () {
          return this.connectionQualityIndicator.connectionQuality;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(q.prototype, "isInputAudioMuted", {
        get: function () {
          var U, F;
          return (F =
            (U = this.voiceChat) === null || U === void 0
              ? void 0
              : U.isMuted) !== null && F !== void 0
            ? F
            : !0;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (q.prototype.muteInputAudio = function () {
        var U;
        (U = this.voiceChat) === null || U === void 0 || U.mute();
      }),
      (q.prototype.unmuteInputAudio = function () {
        var U;
        (U = this.voiceChat) === null || U === void 0 || U.unmute();
      }),
      (q.prototype.createStartAvatar = function (U) {
        return __awaiter(this, void 0, void 0, function () {
          var F;
          return __generator(this, function (B) {
            switch (B.label) {
              case 0:
                return [4, this.newSession(U)];
              case 1:
                return (F = B.sent()), [2, this.startAvatar(U, F)];
            }
          });
        });
      }),
      (q.prototype.startAvatar = function (U, F) {
        return __awaiter(this, void 0, void 0, function () {
          var B,
            V,
            j = this;
          return __generator(this, function ($) {
            switch ($.label) {
              case 0:
                (this.sessionId = F.session_id),
                  (this.isLiveKitTransport =
                    U.voiceChatTransport === VoiceChatTransport.LIVEKIT),
                  (B = new Room({
                    adaptiveStream: !0,
                    dynacast: !0,
                    videoCaptureDefaults: {
                      resolution: VideoPresets.h720.resolution,
                    },
                  })),
                  (this.room = B),
                  (this.mediaStream = null),
                  B.on(RoomEvent.DataReceived, function (W) {
                    var K = null;
                    try {
                      var G = new TextDecoder().decode(W);
                      K = JSON.parse(G);
                    } catch (Q) {
                      console.error(Q);
                    }
                    K && j.emit(K.type, K);
                  }),
                  (V = new MediaStream()),
                  B.on(RoomEvent.TrackSubscribed, function (W) {
                    if (W.kind === "video" || W.kind === "audio") {
                      V.addTrack(W.mediaStreamTrack);
                      var K = V.getVideoTracks().length > 0,
                        G = V.getAudioTracks().length > 0;
                      K &&
                        G &&
                        !j.mediaStream &&
                        ((j.mediaStream = V),
                        j.emit(StreamingEvents.STREAM_READY, j.mediaStream));
                    }
                  }),
                  B.on(RoomEvent.TrackUnsubscribed, function (W) {
                    var K = W.mediaStreamTrack;
                    K && V.removeTrack(K);
                  }),
                  B.on(RoomEvent.Disconnected, function (W) {
                    j.emit(StreamingEvents.STREAM_DISCONNECTED, W);
                  }),
                  ($.label = 1);
              case 1:
                return (
                  $.trys.push([1, 3, , 4]),
                  [4, B.prepareConnection(F.url, F.access_token)]
                );
              case 2:
                return $.sent(), [3, 4];
              case 3:
                return $.sent(), [3, 4];
              case 4:
                return [4, this.startSession()];
              case 5:
                return $.sent(), [4, B.connect(F.url, F.access_token)];
              case 6:
                return (
                  $.sent(),
                  [
                    4,
                    this.connectWebSocket({
                      useSilencePrompt: !!U.useSilencePrompt,
                    }),
                  ]
                );
              case 7:
                return (
                  $.sent(),
                  this.initVoiceChat(
                    U.voiceChatTransport || VoiceChatTransport.WEBSOCKET
                  ),
                  this.connectionQualityIndicator.start(B),
                  [2, F]
                );
            }
          });
        });
      }),
      (q.prototype.startVoiceChat = function () {
        return __awaiter(this, arguments, void 0, function (U) {
          var F,
            B = U === void 0 ? {} : U,
            V = B.isInputAudioMuted;
          return __generator(this, function (j) {
            switch (j.label) {
              case 0:
                return [
                  4,
                  (F = this.voiceChat) === null || F === void 0
                    ? void 0
                    : F.startVoiceChat({ config: { defaultMuted: V } }),
                ];
              case 1:
                return j.sent(), [2];
            }
          });
        });
      }),
      (q.prototype.closeVoiceChat = function () {
        return __awaiter(this, void 0, void 0, function () {
          var U;
          return __generator(this, function (F) {
            switch (F.label) {
              case 0:
                return [
                  4,
                  (U = this.voiceChat) === null || U === void 0
                    ? void 0
                    : U.stopVoiceChat(),
                ];
              case 1:
                return F.sent(), [2];
            }
          });
        });
      }),
      (q.prototype.newSession = function (U) {
        return __awaiter(this, void 0, void 0, function () {
          var F, B, V, j, $;
          return __generator(this, function (W) {
            return [
              2,
              this.request("/v1/streaming.new", {
                avatar_name: U.avatarName,
                quality: U.quality,
                knowledge_base_id: U.knowledgeId,
                knowledge_base: U.knowledgeBase,
                voice: {
                  voice_id:
                    (F = U.voice) === null || F === void 0 ? void 0 : F.voiceId,
                  rate:
                    (B = U.voice) === null || B === void 0 ? void 0 : B.rate,
                  emotion:
                    (V = U.voice) === null || V === void 0 ? void 0 : V.emotion,
                  elevenlabs_settings: __assign(
                    __assign(
                      {},
                      (j = U == null ? void 0 : U.voice) === null ||
                        j === void 0
                        ? void 0
                        : j.elevenlabsSettings
                    ),
                    {
                      model_id:
                        ($ = U.voice) === null || $ === void 0
                          ? void 0
                          : $.model,
                    }
                  ),
                },
                language: U.language,
                version: "v2",
                video_encoding: "H264",
                source: "sdk",
                disable_idle_timeout: U.disableIdleTimeout,
                stt_settings: U.sttSettings,
                ia_is_livekit_transport:
                  U.voiceChatTransport === VoiceChatTransport.LIVEKIT,
                silence_response: U.useSilencePrompt,
                activity_idle_timeout: U.activityIdleTimeout,
              }),
            ];
          });
        });
      }),
      (q.prototype.startSession = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (U) {
            return [
              2,
              this.request("/v1/streaming.start", {
                session_id: this.sessionId,
              }),
            ];
          });
        });
      }),
      (q.prototype.speak = function (U) {
        return __awaiter(this, void 0, void 0, function () {
          var F, B;
          return __generator(this, function (V) {
            if (
              ((F = U.taskType || U.task_type || TaskType.TALK),
              (B = U.taskMode || TaskMode.ASYNC),
              F === TaskType.TALK && B === TaskMode.ASYNC)
            ) {
              if (this.isLiveKitTransport && this.room)
                return this.sendLivekitMessage(U.text), [2];
              if (
                !this.isLiveKitTransport &&
                this.webSocket &&
                this.audioRawFrame
              )
                return this.sendWebsocketMessage(U.text), [2];
            }
            return [
              2,
              this.request("/v1/streaming.task", {
                text: U.text,
                session_id: this.sessionId,
                task_mode: U.taskMode,
                task_type: U.taskType,
              }),
            ];
          });
        });
      }),
      (q.prototype.startListening = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (U) {
            return [
              2,
              this.request("/v1/streaming.start_listening", {
                session_id: this.sessionId,
              }),
            ];
          });
        });
      }),
      (q.prototype.stopListening = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (U) {
            return [
              2,
              this.request("/v1/streaming.stop_listening", {
                session_id: this.sessionId,
              }),
            ];
          });
        });
      }),
      (q.prototype.interrupt = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (U) {
            return [
              2,
              this.request("/v1/streaming.interrupt", {
                session_id: this.sessionId,
              }),
            ];
          });
        });
      }),
      (q.prototype.stopAvatar = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (U) {
            return (
              this.closeVoiceChat(),
              this.connectionQualityIndicator.stop(),
              (this.voiceChat = null),
              this.webSocket &&
                (this.webSocket.close(), (this.webSocket = null)),
              [
                2,
                this.request("/v1/streaming.stop", {
                  session_id: this.sessionId,
                }),
              ]
            );
          });
        });
      }),
      (q.prototype.keepAlive = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (U) {
            return [
              2,
              this.request("/v1/streaming.keep_alive", {
                session_id: this.sessionId,
              }),
            ];
          });
        });
      }),
      (q.prototype.on = function (U, F) {
        return this.eventTarget.addEventListener(U, F), this;
      }),
      (q.prototype.off = function (U, F) {
        return this.eventTarget.removeEventListener(U, F), this;
      }),
      (q.prototype.sendLivekitMessage = function (U) {
        return __awaiter(this, void 0, void 0, function () {
          var F;
          return __generator(this, function (B) {
            return this.room
              ? ((F = new TextEncoder().encode(JSON.stringify(U))),
                this.room.localParticipant.publishData(F, { reliable: !0 }),
                [2])
              : [2];
          });
        });
      }),
      (q.prototype.sendWebsocketMessage = function (U) {
        return __awaiter(this, void 0, void 0, function () {
          var F, B, V, j;
          return __generator(this, function ($) {
            return !this.webSocket || !this.audioRawFrame
              ? [2]
              : ((F =
                  (V = this.audioRawFrame) === null || V === void 0
                    ? void 0
                    : V.create({ text: { text: U } })),
                (B = new Uint8Array(
                  (j = this.audioRawFrame) === null || j === void 0
                    ? void 0
                    : j.encode(F).finish()
                )),
                this.webSocket.send(B),
                [2]);
          });
        });
      }),
      (q.prototype.initVoiceChat = function (U) {
        if (U === VoiceChatTransport.WEBSOCKET) {
          if (
            (this.loadAudioRawFrame(), !this.audioRawFrame || !this.webSocket)
          )
            return;
          this.voiceChat = VoiceChatFactory.createWebSocketVoiceChat({
            webSocket: this.webSocket,
            audioRawFrame: this.audioRawFrame,
          });
        } else {
          if (!this.room) return;
          this.voiceChat = VoiceChatFactory.createLiveKitVoiceChat({
            room: this.room,
          });
        }
      }),
      (q.prototype.request = function (U, F, B) {
        return __awaiter(this, void 0, void 0, function () {
          var V, j, $, W;
          return __generator(this, function (K) {
            switch (K.label) {
              case 0:
                return (
                  K.trys.push([0, 5, , 6]),
                  [
                    4,
                    fetch(this.getRequestUrl(U), {
                      method: "POST",
                      headers: {
                        Authorization: "Bearer ".concat(this.token),
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(F),
                    }),
                  ]
                );
              case 1:
                return (V = K.sent()), V.ok ? [3, 3] : [4, V.text()];
              case 2:
                throw (
                  ((j = K.sent()),
                  new APIError(
                    "API request failed with status ".concat(V.status),
                    V.status,
                    j
                  ))
                );
              case 3:
                return [4, V.json()];
              case 4:
                return ($ = K.sent()), [2, $.data];
              case 5:
                throw ((W = K.sent()), W);
              case 6:
                return [2];
            }
          });
        });
      }),
      (q.prototype.emit = function (U, F) {
        var B = new CustomEvent(U, { detail: F });
        this.eventTarget.dispatchEvent(B);
      }),
      (q.prototype.getRequestUrl = function (U) {
        return "".concat(this.basePath).concat(U);
      }),
      (q.prototype.connectWebSocket = function (U) {
        return __awaiter(this, void 0, void 0, function () {
          var F,
            B = this;
          return __generator(this, function (V) {
            return (
              (F = "wss://"
                .concat(
                  new URL(this.basePath).hostname,
                  "/v1/ws/streaming.chat?session_id="
                )
                .concat(this.sessionId, "&session_token=")
                .concat(this.token)
                .concat(
                  this.isLiveKitTransport ? "&arch_version=v2" : "",
                  "&silence_response="
                )
                .concat(U.useSilencePrompt)),
              (this.webSocket = new WebSocket(F)),
              this.webSocket.addEventListener("message", function (j) {
                var $ = null;
                try {
                  $ = JSON.parse(j.data);
                } catch (W) {
                  console.error(W);
                  return;
                }
                $ && B.emit($.event_type, $);
              }),
              this.webSocket.addEventListener("close", function (j) {
                B.webSocket = null;
              }),
              [
                2,
                new Promise(function (j, $) {
                  var W, K;
                  (W = B.webSocket) === null ||
                    W === void 0 ||
                    W.addEventListener("error", function (G) {
                      (B.webSocket = null), $(G);
                    }),
                    (K = B.webSocket) === null ||
                      K === void 0 ||
                      K.addEventListener("open", function () {
                        j(!0);
                      });
                }),
              ]
            );
          });
        });
      }),
      (q.prototype.loadAudioRawFrame = function () {
        return __awaiter(this, void 0, void 0, function () {
          var U;
          return __generator(this, function (F) {
            return (
              this.audioRawFrame ||
                ((U = protobuf.Root.fromJSON(jsonDescriptor)),
                (this.audioRawFrame =
                  U == null ? void 0 : U.lookupType("pipecat.Frame"))),
              [2]
            );
          });
        });
      }),
      q
    );
  })();
const PLUGIN_OPTIONS = window.PLUGIN_OPTIONS,
  videoElement = document.getElementById("avatarVideo"),
  startButton = document.getElementById("startSession"),
  endButton = document.getElementById("endSession"),
  interruptTask = document.getElementById("interruptTask"),
  micToggle = document.getElementById("micToggler"),
  cameraToggle = document.getElementById("cameraToggler"),
  micIcon = document.getElementById("micIcon"),
  switchInteractionMode = document.getElementById("switchInteractionMode"),
  speakButton = document.getElementById("speakButton"),
  userInput = document.getElementById("userInput"),
  chatBoxContainer = document.getElementById("chatBox"),
  avatarContainer = document.querySelector(".avatarContainer"),
  avatarError = document.getElementById("avatarError"),
  ajaxURL = document.getElementById("ajaxURL"),
  heygenNonce = document.getElementById("avatar_studio_nonce"),
  avatar_studio_nonce = heygenNonce
    ? heygenNonce == null
      ? void 0
      : heygenNonce.value
    : "",
  ajaxurl = ajaxURL ? (ajaxURL == null ? void 0 : ajaxURL.value) : "",
  chatOnly = startButton.getAttribute("chatOnly") === "1",
  videoEnable = startButton.getAttribute("videoEnable") === "1",
  transcriptContainer = document.getElementById("transcriptContainer"),
  voiceTranscript = document.getElementById("voiceTranscript"),
  exportTranscriptToPDFButton = document.getElementById(
    "exportTranscriptToPDF"
  ),
  sendTranscriptToEmailButton = document.getElementById(
    "sendTranscriptToEmail"
  ),
  overlayQuestionContainer = document.getElementById("overlayQuestion"),
  overlayQuestionSubmitButton = document.getElementById(
    "overlayQuestionSubmit"
  ),
  closeOverlayQuestionButton = document.getElementById("closeOverlayQuestion"),
  countdownElement = document.getElementById("streamingCountdown");
let avatar = null,
  sessionData = null,
  tokenCall = 0,
  userTalkingText = "",
  avatarTalkingText = "",
  countdownTimer = null,
  questionnaires = [];
function closeOverlayQuestion() {
  return (
    overlayQuestionContainer.classList.remove("show"),
    overlayQuestionContainer.removeAttribute("data-question-title"),
    overlayQuestionContainer.removeAttribute("data-question-type"),
    overlayQuestionContainer.removeAttribute("data-question_id"),
    questionnaires.shift(),
    !0
  );
}
function getTimeLimitSeconds(q) {
  const U = Number(q);
  if (Number.isFinite(U) && U > 0) return U * 60;
}
async function overlayQuestionSubmit() {
  const q = overlayQuestionContainer.getAttribute("data-question-title"),
    U = overlayQuestionContainer.getAttribute("data-question-type");
  let F = [];
  if (U === "checkbox")
    document
      .querySelectorAll('input[name="questionOption"]:checked')
      .forEach((V) => {
        F.push(V.value);
      });
  else if (U === "radio") {
    const B = document.querySelector('input[name="questionOption"]:checked');
    B && F.push(B.value);
  }
  return (
    avatar &&
      (await avatar.speak({ text: `${q} and user answer is ${F.join(",")}` })),
    ""
  );
}
async function getAvatarQuestionnaires() {
  const q = document.getElementById("avatar_studio_id");
  let U = q ? q.value : "0";
  if (!U || isNaN(parseInt(String(U)))) {
    console.warn("No Avatar Studio ID found");
    return;
  }
  return "";
}
async function fetchAccessToken() {
  return (
    tokenCall++,
    ajaxurl
      ? await fetch(ajaxurl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            action: "avanew_as_avatar_studio_heygenToken",
            nonce: avatar_studio_nonce,
          }),
        })
          .then((q) => q.json())
          .then(async (q) => {
            var U;
            if (
              q.success &&
              ((U = q == null ? void 0 : q.data) == null ? void 0 : U.token) !=
                ""
            )
              return q.data.token;
            if (tokenCall <= 5) return await fetchAccessToken();
          })
          .catch(
            (q) => (
              avatarContainer.classList.contains("loading") &&
                avatarContainer.classList.remove("loading"),
              console.error("There was an error!", q),
              ""
            )
          )
      : ""
  );
}
async function initializeAvatarSession() {
  (tokenCall = 0),
    avatarError &&
      ((avatarError.style.marginTop = "0px"), (avatarError.innerHTML = "")),
    avatarContainer.classList.contains("loading") ||
      avatarContainer.classList.add("loading"),
    getAvatarQuestionnaires();
  const q = await fetchAccessToken();
  if (q && q != "") {
    fetch(ajaxurl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "avanew_as_insert_avatar_studio_user",
        provider: "heygen",
        token: q,
      }),
    }),
      (avatar = new StreamingAvatar({ token: q })),
      avatar.on(StreamingEvents.AVATAR_START_TALKING, ($) => {
        console.log("Avatar started talking", $),
          avatarContainer.classList.contains("loading") &&
            avatarContainer.classList.remove("loading");
      }),
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, ($) => {
        console.log("Avatar stopped talking", $);
      }),
      avatar.on(StreamingEvents.STREAM_READY, handleStreamReady),
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, handleStreamDisconnected),
      avatar.on(StreamingEvents.USER_START, ($) => {
        console.log(">>>>> User started talking:", $),
          (userTalkingText = ""),
          chatBoxContainer.classList.contains("talking") ||
            chatBoxContainer.classList.add("talking");
      }),
      avatar.on(StreamingEvents.USER_STOP, ($) => {
        console.log(">>>>> User stopped talking:", $),
          chatBoxContainer.classList.contains("talking") &&
            chatBoxContainer.classList.remove("talking");
      }),
      avatar.on(StreamingEvents.USER_SILENCE, () => {
        console.log("User is silent");
      }),
      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, ($) => {
        var K;
        const W =
          ((K = $ == null ? void 0 : $.detail) == null ? void 0 : K.message) ??
          "";
        (userTalkingText += ` ${W}`),
          createParagraphElement("user"),
          addTextToTranscript(W, "user", !1),
          console.log("🗣️ USER_TALKING_MESSAGE:", W, $.timeStamp);
      }),
      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, ($) => {
        var K;
        const W =
          ((K = $ == null ? void 0 : $.detail) == null ? void 0 : K.message) ??
          "";
        avatarTalkingText += ` ${W}`;
      }),
      avatar.on(StreamingEvents.USER_END_MESSAGE, ($) => {
        let W = userTalkingText.trim();
        console.log("USER_END_MESSAGE", $, W), (userTalkingText = "");
      }),
      avatar.on(StreamingEvents.AVATAR_END_MESSAGE, ($) => {
        const W = avatarTalkingText.trim();
        console.log("AVATAR_END_MESSAGE", $, W),
          W.length > 0 &&
            (createParagraphElement("avatar"),
            addTextToTranscript(W, "avatar", !1),
            (avatarTalkingText = ""));
      });
    var U = startButton.getAttribute("aid"),
      F = startButton.getAttribute("kid"),
      B = startButton.getAttribute("language"),
      V = startButton.getAttribute("opening_text");
    (V = V && V != "" ? V : "Hello, how can I help you?"),
      (U = U || "Ann_Therapist_public"),
      (F = F || ""),
      (B = B && B != "null" ? B : "en");
    let j = VoiceEmotion.EXCITED;
    PLUGIN_OPTIONS != null &&
      PLUGIN_OPTIONS.voice_emotion &&
      ((PLUGIN_OPTIONS == null ? void 0 : PLUGIN_OPTIONS.voice_emotion) ==
      "excited"
        ? (j = VoiceEmotion.EXCITED)
        : (PLUGIN_OPTIONS == null ? void 0 : PLUGIN_OPTIONS.voice_emotion) ==
          "serious"
        ? (j = VoiceEmotion.SERIOUS)
        : (PLUGIN_OPTIONS == null ? void 0 : PLUGIN_OPTIONS.voice_emotion) ==
          "friendly"
        ? (j = VoiceEmotion.FRIENDLY)
        : (PLUGIN_OPTIONS == null ? void 0 : PLUGIN_OPTIONS.voice_emotion) ==
          "soothing"
        ? (j = VoiceEmotion.SOOTHING)
        : (PLUGIN_OPTIONS == null ? void 0 : PLUGIN_OPTIONS.voice_emotion) ==
            "broadcaster" && (j = VoiceEmotion.BROADCASTER)),
      (sessionData = await avatar.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: U,
        knowledgeId: F,
        voice: { rate: 1.5, emotion: j },
        language: B,
        sttSettings: { provider: STTProvider.DEEPGRAM, confidence: 0.55 },
        useSilencePrompt: !1,
        disableIdleTimeout: !0,
        activityIdleTimeout: 180,
      })),
      (voiceTranscript.innerHTML = ""),
      (exportTranscriptToPDFButton.style.display = "none"),
      (sendTranscriptToEmailButton.style.display = "none"),
      console.log("Session data:", sessionData);
    try {
      chatOnly
        ? (chatBoxContainer.classList.add("text_mode"),
          chatBoxContainer.classList.add("showTranscript"),
          transcriptContainer.style.setProperty("display", "block"),
          (switchInteractionMode.style.display = "none"))
        : (navigator.mediaDevices
            .getUserMedia({ audio: !0 })
            .then(($) => {
              console.log("Microphone access granted.", $);
            })
            .catch(($) => {
              console.error("Permission denied or error:", $);
            }),
          await avatar.startVoiceChat({ isInputAudioMuted: !1 }),
          await avatar.speak({ text: V, task_type: TaskType.REPEAT }),
          chatBoxContainer.classList.remove("text_mode"),
          chatBoxContainer.classList.add("voice_mode"),
          micIcon &&
            (micIcon.className =
              avatar != null && avatar.isInputAudioMuted
                ? "fa-solid fa-microphone-slash"
                : "fa-solid fa-microphone"),
          micToggle && (micToggle.style.display = "block"),
          cameraToggle && videoEnable && (cameraToggle.style.display = "none"));
    } catch {
      setTimeout(function () {
        toggleInteractionMode(), avatarError && (avatarError.innerHTML = "");
      }, 1e3),
        avatarError &&
          (avatarError.innerHTML =
            '<span style="padding:10px; ">Voice mode isn’t allowed now, so we’ll switch to text mode instead! </span>');
    }
    startCountDown(
      getTimeLimitSeconds(
        PLUGIN_OPTIONS == null ? void 0 : PLUGIN_OPTIONS.time_limit
      )
    ),
      chatBoxContainer.classList.contains("avatarSessionStarted") ||
        chatBoxContainer.classList.add("avatarSessionStarted"),
      avatarContainer.classList.contains("loading") &&
        avatarContainer.classList.remove("loading"),
      avatarContainer.classList.contains("streamReady") ||
        avatarContainer.classList.add("streamReady");
  } else
    avatarError &&
      ((avatarError.style.marginTop = "70px"),
      (avatarError.innerHTML =
        '<span style="padding:10px; line-height: 26px; ">No Token Found, Please reload this page and Try again.</span>'),
      avatarContainer.classList.contains("loading") &&
        avatarContainer.classList.remove("loading"));
}
function handleStreamReady(q) {
  console.log(">>>>> Stream ready:", q),
    q.detail && videoElement
      ? ((videoElement.srcObject = q.detail),
        (videoElement.onloadedmetadata = () => {
          videoElement.play().catch(console.error);
        }))
      : console.error("Stream is not available");
}
function handleStreamDisconnected() {
  console.log("Stream disconnected"),
    videoElement && (videoElement.srcObject = null),
    avatarError &&
      ((avatarError.style.marginTop = "0px"), (avatarError.innerHTML = "")),
    countdownTimer !== null &&
      (clearInterval(countdownTimer),
      (countdownElement.textContent = "Session ended"),
      (countdownElement.style.color = "red"),
      countdownElement.classList.contains("session_expired") &&
        countdownElement.classList.remove("session_expired"),
      countdownElement.classList.contains("session_ended") ||
        countdownElement.classList.add("session_ended")),
    chatBoxContainer.classList.contains("avatarSessionStarted") &&
      chatBoxContainer.classList.remove("avatarSessionStarted"),
    chatBoxContainer.classList.contains("showTranscript") &&
      chatBoxContainer.classList.remove("showTranscript"),
    avatarContainer.classList.contains("streamReady") &&
      avatarContainer.classList.remove("streamReady"),
    avatarContainer.classList.contains("loading") &&
      avatarContainer.classList.remove("loading"),
    chatBoxContainer.classList.contains("talking") &&
      chatBoxContainer.classList.remove("talking"),
    chatBoxContainer.classList.remove("voice_mode"),
    chatBoxContainer.classList.remove("text_mode");
}
async function terminateAvatarSession() {
  !avatar ||
    !sessionData ||
    (await avatar.stopAvatar(),
    (videoElement.srcObject = null),
    (avatar = null),
    avatarError && (avatarError.innerHTML = ""),
    countdownTimer !== null &&
      (clearInterval(countdownTimer),
      (countdownElement.textContent = "Session ended"),
      (countdownElement.style.color = "red"),
      countdownElement.classList.contains("session_expired") &&
        countdownElement.classList.remove("session_expired"),
      countdownElement.classList.contains("session_ended") ||
        countdownElement.classList.add("session_ended")),
    chatBoxContainer.classList.contains("avatarSessionStarted") &&
      chatBoxContainer.classList.remove("avatarSessionStarted"),
    chatBoxContainer.classList.contains("showTranscript") &&
      chatBoxContainer.classList.remove("showTranscript"),
    avatarContainer.classList.contains("streamReady") &&
      avatarContainer.classList.remove("streamReady"),
    avatarContainer.classList.contains("loading") &&
      avatarContainer.classList.remove("loading"),
    chatBoxContainer.classList.contains("talking") &&
      chatBoxContainer.classList.remove("talking"),
    chatBoxContainer.classList.remove("voice_mode"),
    chatBoxContainer.classList.remove("text_mode"));
}
async function handleInterrupt() {
  avatar && (await avatar.interrupt());
}
function handleMuteAudio() {
  avatar &&
    micToggle &&
    (avatar.isInputAudioMuted
      ? avatar.unmuteInputAudio()
      : avatar.muteInputAudio(),
    micIcon &&
      (micIcon.className =
        avatar != null && avatar.isInputAudioMuted
          ? "fa-solid fa-microphone-slash"
          : "fa-solid fa-microphone"),
    (micToggle.style.display = "block"));
}
async function handleSpeak() {
  avatar &&
    userInput.value &&
    (await avatar.speak({ text: userInput.value, task_type: TaskType.TALK }),
    (userInput.value = ""));
}
function createParagraphElement(q) {
  var j;
  let U = `${q} transcript`;
  const F = voiceTranscript.querySelectorAll(".transcript");
  let B = F[F.length - 1];
  if (
    B &&
    B.className == U &&
    ((j = B == null ? void 0 : B.textContent) == null ? void 0 : j.trim()) == ""
  )
    return;
  let V = document.createElement("p");
  (V.className = U),
    (V.style.margin = "0px"),
    (V.style.padding = "5px 10px"),
    (V.style.borderRadius = "5px"),
    (V.style.backgroundColor = q == "avatar" ? "#f0f0f0" : "#d0f0c0"),
    (V.style.color = q == "avatar" ? "#000" : "#333"),
    (V.style.fontSize = "14px"),
    (V.style.lineHeight = "1.5"),
    (V.style.whiteSpace = "pre-wrap"),
    (V.style.wordBreak = "break-word"),
    (V.style.marginBottom = "5px"),
    voiceTranscript.appendChild(V);
}
function addTextToTranscript(
  q,
  U = "avatar",
  F = !1,
  B = new Date().toISOString()
) {
  if (transcriptContainer) {
    window.getComputedStyle(exportTranscriptToPDFButton).display === "none" &&
      (exportTranscriptToPDFButton.style.display = "inline"),
      window.getComputedStyle(sendTranscriptToEmailButton).display === "none" &&
        (sendTranscriptToEmailButton.style.display = "inline");
    const V = voiceTranscript.querySelectorAll(`.${U}.transcript`);
    let j = V.length ? V[V.length - 1] : null;
    j ||
      (createParagraphElement(U),
      (j = voiceTranscript.querySelectorAll(`.${U}.transcript`)[0])),
      j.setAttribute("data-timestamp", B),
      j &&
        (F
          ? (j.textContent += ` ${q}`)
          : (!j.textContent ||
              (j == null ? void 0 : j.textContent.trim()) != q.trim()) &&
            (j.textContent = `${q}`));
  }
}
async function toggleInteractionMode() {
  if (
    (chatBoxContainer.classList.contains("text_mode")
      ? "text_mode"
      : "voice_mode") === "voice_mode"
  )
    chatBoxContainer.classList.remove("voice_mode"),
      chatBoxContainer.classList.add("text_mode"),
      chatBoxContainer.classList.add("showTranscript"),
      transcriptContainer.style.setProperty("display", "block"),
      avatar == null || avatar.muteInputAudio(),
      avatar == null || avatar.closeVoiceChat(),
      avatar &&
        micToggle &&
        (micIcon &&
          (micIcon.className =
            avatar != null && avatar.isInputAudioMuted
              ? "fa-solid fa-microphone-slash"
              : "fa-solid fa-microphone"),
        (micToggle.style.display = "block"));
  else {
    chatBoxContainer.classList.remove("text_mode"),
      chatBoxContainer.classList.add("voice_mode");
    try {
      await (avatar == null
        ? void 0
        : avatar.startVoiceChat({ isInputAudioMuted: !1 })),
        avatar == null || avatar.unmuteInputAudio(),
        avatar &&
          micToggle &&
          (micIcon &&
            (micIcon.className =
              avatar != null && avatar.isInputAudioMuted
                ? "fa-solid fa-microphone-slash"
                : "fa-solid fa-microphone"),
          (micToggle.style.display = "block"));
    } catch {
      setTimeout(function () {
        toggleInteractionMode(), avatarError && (avatarError.innerHTML = "");
      }, 1e3),
        avatarError &&
          (avatarError.innerHTML =
            '<span style="padding:10px; ">Voice mode isn’t allowed now, so we’ll switch to text mode instead! </span>');
    }
  }
}
function startCountDown(q = 300) {
  (countdownElement.style.display = "block"),
    q || (q = 300),
    countdownElement.classList.contains("session_ended") &&
      countdownElement.classList.remove("session_ended"),
    countdownElement.classList.contains("session_expired") &&
      countdownElement.classList.remove("session_expired");
  const U = Date.now();
  countdownTimer = setInterval(() => {
    const F = Date.now(),
      B = Math.floor((F - U) / 1e3),
      V = q - B;
    if (V <= 0) {
      (countdownElement.textContent = "Session expired!"),
        (countdownElement.style.color = "red"),
        countdownElement.classList.contains("session_ended") &&
          countdownElement.classList.remove("session_ended"),
        countdownElement.classList.contains("session_expired") ||
          countdownElement.classList.add("session_expired"),
        countdownTimer !== null &&
          (clearInterval(countdownTimer), (countdownTimer = null)),
        terminateAvatarSession();
      return;
    }
    if (questionnaires.length) {
      let W = questionnaires[0];
      isNaN(parseInt(W == null ? void 0 : W.renderOn)) ||
        parseInt(W == null ? void 0 : W.renderOn);
    }
    const j = Math.floor(V / 60),
      $ = V % 60;
    countdownElement.textContent = `${j}:${$.toString().padStart(2, "0")}`;
  }, 1e3);
}
startButton && startButton.addEventListener("click", initializeAvatarSession);
endButton && endButton.addEventListener("click", terminateAvatarSession);
interruptTask && interruptTask.addEventListener("click", handleInterrupt);
micToggle && micToggle.addEventListener("click", handleMuteAudio);
speakButton && speakButton.addEventListener("click", handleSpeak);
switchInteractionMode &&
  !chatOnly &&
  switchInteractionMode.addEventListener("click", toggleInteractionMode);
overlayQuestionSubmitButton &&
  overlayQuestionSubmitButton.addEventListener("click", overlayQuestionSubmit);
closeOverlayQuestionButton &&
  closeOverlayQuestionButton.addEventListener("click", closeOverlayQuestion);
userInput &&
  userInput.addEventListener("keydown", function (q) {
    q.key === "Enter" && handleSpeak();
  });
