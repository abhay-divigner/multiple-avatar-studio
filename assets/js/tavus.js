function Et(i, e) {
  for (var t = 0; t < e.length; t++) {
    const r = e[t];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const n in r)
        if (n !== "default" && !(n in i)) {
          const s = Object.getOwnPropertyDescriptor(r, n);
          s &&
            Object.defineProperty(
              i,
              n,
              s.get ? s : { enumerable: !0, get: () => r[n] }
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(i, Symbol.toStringTag, { value: "Module" })
  );
}
(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) r(n);
  new MutationObserver((n) => {
    for (const s of n)
      if (s.type === "childList")
        for (const o of s.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && r(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(n) {
    const s = {};
    return (
      n.integrity && (s.integrity = n.integrity),
      n.referrerPolicy && (s.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === "use-credentials"
        ? (s.credentials = "include")
        : n.crossOrigin === "anonymous"
        ? (s.credentials = "omit")
        : (s.credentials = "same-origin"),
      s
    );
  }
  function r(n) {
    if (n.ep) return;
    n.ep = !0;
    const s = t(n);
    fetch(n.href, s);
  }
})();
class x extends Error {
  constructor(e) {
    super(e), (this.__dgError = !0), (this.name = "DeepgramError");
  }
}
function S(i) {
  return typeof i == "object" && i !== null && "__dgError" in i;
}
class St extends x {
  constructor(e, t) {
    super(e), (this.name = "DeepgramApiError"), (this.status = t);
  }
  toJSON() {
    return { name: this.name, message: this.message, status: this.status };
  }
}
class Se extends x {
  constructor(e, t) {
    super(e), (this.name = "DeepgramUnknownError"), (this.originalError = t);
  }
}
class K extends x {
  constructor() {
    super(
      "You are attempting to use an old format for a newer SDK version. Read more here: https://dpgr.am/js-v3"
    ),
      (this.name = "DeepgramVersionError");
  }
}
class jt extends x {
  constructor(e, t = {}) {
    super(e),
      (this.name = "DeepgramWebSocketError"),
      (this.originalEvent = t.originalEvent),
      (this.statusCode = t.statusCode),
      (this.requestId = t.requestId),
      (this.responseHeaders = t.responseHeaders),
      (this.url = t.url),
      (this.readyState = t.readyState);
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      requestId: this.requestId,
      responseHeaders: this.responseHeaders,
      url: this.url,
      readyState: this.readyState,
      originalEvent: this.originalEvent
        ? {
            type: this.originalEvent.type,
            timeStamp: this.originalEvent.timeStamp,
          }
        : void 0,
    };
  }
}
var fe =
  typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
    ? window
    : typeof global < "u"
    ? global
    : typeof self < "u"
    ? self
    : {};
function ct(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default")
    ? i.default
    : i;
}
var pe = { exports: {} },
  We;
function kt() {
  if (We) return pe.exports;
  We = 1;
  var i = typeof Reflect == "object" ? Reflect : null,
    e =
      i && typeof i.apply == "function"
        ? i.apply
        : function (l, p, w) {
            return Function.prototype.apply.call(l, p, w);
          },
    t;
  i && typeof i.ownKeys == "function"
    ? (t = i.ownKeys)
    : Object.getOwnPropertySymbols
    ? (t = function (l) {
        return Object.getOwnPropertyNames(l).concat(
          Object.getOwnPropertySymbols(l)
        );
      })
    : (t = function (l) {
        return Object.getOwnPropertyNames(l);
      });
  function r(u) {
    console && console.warn && console.warn(u);
  }
  var n =
    Number.isNaN ||
    function (l) {
      return l !== l;
    };
  function s() {
    s.init.call(this);
  }
  (pe.exports = s),
    (pe.exports.once = m),
    (s.EventEmitter = s),
    (s.prototype._events = void 0),
    (s.prototype._eventsCount = 0),
    (s.prototype._maxListeners = void 0);
  var o = 10;
  function c(u) {
    if (typeof u != "function")
      throw new TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof u
      );
  }
  Object.defineProperty(s, "defaultMaxListeners", {
    enumerable: !0,
    get: function () {
      return o;
    },
    set: function (u) {
      if (typeof u != "number" || u < 0 || n(u))
        throw new RangeError(
          'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
            u +
            "."
        );
      o = u;
    },
  }),
    (s.init = function () {
      (this._events === void 0 ||
        this._events === Object.getPrototypeOf(this)._events) &&
        ((this._events = Object.create(null)), (this._eventsCount = 0)),
        (this._maxListeners = this._maxListeners || void 0);
    }),
    (s.prototype.setMaxListeners = function (l) {
      if (typeof l != "number" || l < 0 || n(l))
        throw new RangeError(
          'The value of "n" is out of range. It must be a non-negative number. Received ' +
            l +
            "."
        );
      return (this._maxListeners = l), this;
    });
  function f(u) {
    return u._maxListeners === void 0 ? s.defaultMaxListeners : u._maxListeners;
  }
  (s.prototype.getMaxListeners = function () {
    return f(this);
  }),
    (s.prototype.emit = function (l) {
      for (var p = [], w = 1; w < arguments.length; w++) p.push(arguments[w]);
      var _ = l === "error",
        O = this._events;
      if (O !== void 0) _ = _ && O.error === void 0;
      else if (!_) return !1;
      if (_) {
        var k;
        if ((p.length > 0 && (k = p[0]), k instanceof Error)) throw k;
        var H = new Error(
          "Unhandled error." + (k ? " (" + k.message + ")" : "")
        );
        throw ((H.context = k), H);
      }
      var D = O[l];
      if (D === void 0) return !1;
      if (typeof D == "function") e(D, this, p);
      else
        for (var de = D.length, ce = T(D, de), w = 0; w < de; ++w)
          e(ce[w], this, p);
      return !0;
    });
  function y(u, l, p, w) {
    var _, O, k;
    if (
      (c(p),
      (O = u._events),
      O === void 0
        ? ((O = u._events = Object.create(null)), (u._eventsCount = 0))
        : (O.newListener !== void 0 &&
            (u.emit("newListener", l, p.listener ? p.listener : p),
            (O = u._events)),
          (k = O[l])),
      k === void 0)
    )
      (k = O[l] = p), ++u._eventsCount;
    else if (
      (typeof k == "function"
        ? (k = O[l] = w ? [p, k] : [k, p])
        : w
        ? k.unshift(p)
        : k.push(p),
      (_ = f(u)),
      _ > 0 && k.length > _ && !k.warned)
    ) {
      k.warned = !0;
      var H = new Error(
        "Possible EventEmitter memory leak detected. " +
          k.length +
          " " +
          String(l) +
          " listeners added. Use emitter.setMaxListeners() to increase limit"
      );
      (H.name = "MaxListenersExceededWarning"),
        (H.emitter = u),
        (H.type = l),
        (H.count = k.length),
        r(H);
    }
    return u;
  }
  (s.prototype.addListener = function (l, p) {
    return y(this, l, p, !1);
  }),
    (s.prototype.on = s.prototype.addListener),
    (s.prototype.prependListener = function (l, p) {
      return y(this, l, p, !0);
    });
  function d() {
    if (!this.fired)
      return (
        this.target.removeListener(this.type, this.wrapFn),
        (this.fired = !0),
        arguments.length === 0
          ? this.listener.call(this.target)
          : this.listener.apply(this.target, arguments)
      );
  }
  function g(u, l, p) {
    var w = { fired: !1, wrapFn: void 0, target: u, type: l, listener: p },
      _ = d.bind(w);
    return (_.listener = p), (w.wrapFn = _), _;
  }
  (s.prototype.once = function (l, p) {
    return c(p), this.on(l, g(this, l, p)), this;
  }),
    (s.prototype.prependOnceListener = function (l, p) {
      return c(p), this.prependListener(l, g(this, l, p)), this;
    }),
    (s.prototype.removeListener = function (l, p) {
      var w, _, O, k, H;
      if ((c(p), (_ = this._events), _ === void 0)) return this;
      if (((w = _[l]), w === void 0)) return this;
      if (w === p || w.listener === p)
        --this._eventsCount === 0
          ? (this._events = Object.create(null))
          : (delete _[l],
            _.removeListener &&
              this.emit("removeListener", l, w.listener || p));
      else if (typeof w != "function") {
        for (O = -1, k = w.length - 1; k >= 0; k--)
          if (w[k] === p || w[k].listener === p) {
            (H = w[k].listener), (O = k);
            break;
          }
        if (O < 0) return this;
        O === 0 ? w.shift() : E(w, O),
          w.length === 1 && (_[l] = w[0]),
          _.removeListener !== void 0 && this.emit("removeListener", l, H || p);
      }
      return this;
    }),
    (s.prototype.off = s.prototype.removeListener),
    (s.prototype.removeAllListeners = function (l) {
      var p, w, _;
      if (((w = this._events), w === void 0)) return this;
      if (w.removeListener === void 0)
        return (
          arguments.length === 0
            ? ((this._events = Object.create(null)), (this._eventsCount = 0))
            : w[l] !== void 0 &&
              (--this._eventsCount === 0
                ? (this._events = Object.create(null))
                : delete w[l]),
          this
        );
      if (arguments.length === 0) {
        var O = Object.keys(w),
          k;
        for (_ = 0; _ < O.length; ++_)
          (k = O[_]), k !== "removeListener" && this.removeAllListeners(k);
        return (
          this.removeAllListeners("removeListener"),
          (this._events = Object.create(null)),
          (this._eventsCount = 0),
          this
        );
      }
      if (((p = w[l]), typeof p == "function")) this.removeListener(l, p);
      else if (p !== void 0)
        for (_ = p.length - 1; _ >= 0; _--) this.removeListener(l, p[_]);
      return this;
    });
  function v(u, l, p) {
    var w = u._events;
    if (w === void 0) return [];
    var _ = w[l];
    return _ === void 0
      ? []
      : typeof _ == "function"
      ? p
        ? [_.listener || _]
        : [_]
      : p
      ? N(_)
      : T(_, _.length);
  }
  (s.prototype.listeners = function (l) {
    return v(this, l, !0);
  }),
    (s.prototype.rawListeners = function (l) {
      return v(this, l, !1);
    }),
    (s.listenerCount = function (u, l) {
      return typeof u.listenerCount == "function"
        ? u.listenerCount(l)
        : A.call(u, l);
    }),
    (s.prototype.listenerCount = A);
  function A(u) {
    var l = this._events;
    if (l !== void 0) {
      var p = l[u];
      if (typeof p == "function") return 1;
      if (p !== void 0) return p.length;
    }
    return 0;
  }
  s.prototype.eventNames = function () {
    return this._eventsCount > 0 ? t(this._events) : [];
  };
  function T(u, l) {
    for (var p = new Array(l), w = 0; w < l; ++w) p[w] = u[w];
    return p;
  }
  function E(u, l) {
    for (; l + 1 < u.length; l++) u[l] = u[l + 1];
    u.pop();
  }
  function N(u) {
    for (var l = new Array(u.length), p = 0; p < l.length; ++p)
      l[p] = u[p].listener || u[p];
    return l;
  }
  function m(u, l) {
    return new Promise(function (p, w) {
      function _(k) {
        u.removeListener(l, O), w(k);
      }
      function O() {
        typeof u.removeListener == "function" && u.removeListener("error", _),
          p([].slice.call(arguments));
      }
      C(u, l, O, { once: !0 }), l !== "error" && b(u, _, { once: !0 });
    });
  }
  function b(u, l, p) {
    typeof u.on == "function" && C(u, "error", l, p);
  }
  function C(u, l, p, w) {
    if (typeof u.on == "function") w.once ? u.once(l, p) : u.on(l, p);
    else if (typeof u.addEventListener == "function")
      u.addEventListener(l, function _(O) {
        w.once && u.removeEventListener(l, _), p(O);
      });
    else
      throw new TypeError(
        'The "emitter" argument must be of type EventEmitter. Received type ' +
          typeof u
      );
  }
  return pe.exports;
}
var Ot = kt(),
  ye = { exports: {} },
  ze;
function Ut() {
  return (
    ze ||
      ((ze = 1),
      (function (i, e) {
        var t =
            (typeof globalThis < "u" && globalThis) ||
            (typeof self < "u" && self) ||
            (typeof fe < "u" && fe),
          r = (function () {
            function s() {
              (this.fetch = !1), (this.DOMException = t.DOMException);
            }
            return (s.prototype = t), new s();
          })();
        (function (s) {
          (function (o) {
            var c =
                (typeof s < "u" && s) ||
                (typeof self < "u" && self) ||
                (typeof fe < "u" && fe) ||
                {},
              f = {
                searchParams: "URLSearchParams" in c,
                iterable: "Symbol" in c && "iterator" in Symbol,
                blob:
                  "FileReader" in c &&
                  "Blob" in c &&
                  (function () {
                    try {
                      return new Blob(), !0;
                    } catch {
                      return !1;
                    }
                  })(),
                formData: "FormData" in c,
                arrayBuffer: "ArrayBuffer" in c,
              };
            function y(a) {
              return a && DataView.prototype.isPrototypeOf(a);
            }
            if (f.arrayBuffer)
              var d = [
                  "[object Int8Array]",
                  "[object Uint8Array]",
                  "[object Uint8ClampedArray]",
                  "[object Int16Array]",
                  "[object Uint16Array]",
                  "[object Int32Array]",
                  "[object Uint32Array]",
                  "[object Float32Array]",
                  "[object Float64Array]",
                ],
                g =
                  ArrayBuffer.isView ||
                  function (a) {
                    return (
                      a && d.indexOf(Object.prototype.toString.call(a)) > -1
                    );
                  };
            function v(a) {
              if (
                (typeof a != "string" && (a = String(a)),
                /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(a) || a === "")
              )
                throw new TypeError(
                  'Invalid character in header field name: "' + a + '"'
                );
              return a.toLowerCase();
            }
            function A(a) {
              return typeof a != "string" && (a = String(a)), a;
            }
            function T(a) {
              var h = {
                next: function () {
                  var j = a.shift();
                  return { done: j === void 0, value: j };
                },
              };
              return (
                f.iterable &&
                  (h[Symbol.iterator] = function () {
                    return h;
                  }),
                h
              );
            }
            function E(a) {
              (this.map = {}),
                a instanceof E
                  ? a.forEach(function (h, j) {
                      this.append(j, h);
                    }, this)
                  : Array.isArray(a)
                  ? a.forEach(function (h) {
                      if (h.length != 2)
                        throw new TypeError(
                          "Headers constructor: expected name/value pair to be length 2, found" +
                            h.length
                        );
                      this.append(h[0], h[1]);
                    }, this)
                  : a &&
                    Object.getOwnPropertyNames(a).forEach(function (h) {
                      this.append(h, a[h]);
                    }, this);
            }
            (E.prototype.append = function (a, h) {
              (a = v(a)), (h = A(h));
              var j = this.map[a];
              this.map[a] = j ? j + ", " + h : h;
            }),
              (E.prototype.delete = function (a) {
                delete this.map[v(a)];
              }),
              (E.prototype.get = function (a) {
                return (a = v(a)), this.has(a) ? this.map[a] : null;
              }),
              (E.prototype.has = function (a) {
                return this.map.hasOwnProperty(v(a));
              }),
              (E.prototype.set = function (a, h) {
                this.map[v(a)] = A(h);
              }),
              (E.prototype.forEach = function (a, h) {
                for (var j in this.map)
                  this.map.hasOwnProperty(j) && a.call(h, this.map[j], j, this);
              }),
              (E.prototype.keys = function () {
                var a = [];
                return (
                  this.forEach(function (h, j) {
                    a.push(j);
                  }),
                  T(a)
                );
              }),
              (E.prototype.values = function () {
                var a = [];
                return (
                  this.forEach(function (h) {
                    a.push(h);
                  }),
                  T(a)
                );
              }),
              (E.prototype.entries = function () {
                var a = [];
                return (
                  this.forEach(function (h, j) {
                    a.push([j, h]);
                  }),
                  T(a)
                );
              }),
              f.iterable &&
                (E.prototype[Symbol.iterator] = E.prototype.entries);
            function N(a) {
              if (!a._noBody) {
                if (a.bodyUsed)
                  return Promise.reject(new TypeError("Already read"));
                a.bodyUsed = !0;
              }
            }
            function m(a) {
              return new Promise(function (h, j) {
                (a.onload = function () {
                  h(a.result);
                }),
                  (a.onerror = function () {
                    j(a.error);
                  });
              });
            }
            function b(a) {
              var h = new FileReader(),
                j = m(h);
              return h.readAsArrayBuffer(a), j;
            }
            function C(a) {
              var h = new FileReader(),
                j = m(h),
                I = /charset=([A-Za-z0-9_-]+)/.exec(a.type),
                L = I ? I[1] : "utf-8";
              return h.readAsText(a, L), j;
            }
            function u(a) {
              for (
                var h = new Uint8Array(a), j = new Array(h.length), I = 0;
                I < h.length;
                I++
              )
                j[I] = String.fromCharCode(h[I]);
              return j.join("");
            }
            function l(a) {
              if (a.slice) return a.slice(0);
              var h = new Uint8Array(a.byteLength);
              return h.set(new Uint8Array(a)), h.buffer;
            }
            function p() {
              return (
                (this.bodyUsed = !1),
                (this._initBody = function (a) {
                  (this.bodyUsed = this.bodyUsed),
                    (this._bodyInit = a),
                    a
                      ? typeof a == "string"
                        ? (this._bodyText = a)
                        : f.blob && Blob.prototype.isPrototypeOf(a)
                        ? (this._bodyBlob = a)
                        : f.formData && FormData.prototype.isPrototypeOf(a)
                        ? (this._bodyFormData = a)
                        : f.searchParams &&
                          URLSearchParams.prototype.isPrototypeOf(a)
                        ? (this._bodyText = a.toString())
                        : f.arrayBuffer && f.blob && y(a)
                        ? ((this._bodyArrayBuffer = l(a.buffer)),
                          (this._bodyInit = new Blob([this._bodyArrayBuffer])))
                        : f.arrayBuffer &&
                          (ArrayBuffer.prototype.isPrototypeOf(a) || g(a))
                        ? (this._bodyArrayBuffer = l(a))
                        : (this._bodyText = a =
                            Object.prototype.toString.call(a))
                      : ((this._noBody = !0), (this._bodyText = "")),
                    this.headers.get("content-type") ||
                      (typeof a == "string"
                        ? this.headers.set(
                            "content-type",
                            "text/plain;charset=UTF-8"
                          )
                        : this._bodyBlob && this._bodyBlob.type
                        ? this.headers.set("content-type", this._bodyBlob.type)
                        : f.searchParams &&
                          URLSearchParams.prototype.isPrototypeOf(a) &&
                          this.headers.set(
                            "content-type",
                            "application/x-www-form-urlencoded;charset=UTF-8"
                          ));
                }),
                f.blob &&
                  (this.blob = function () {
                    var a = N(this);
                    if (a) return a;
                    if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
                    if (this._bodyArrayBuffer)
                      return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                    if (this._bodyFormData)
                      throw new Error("could not read FormData body as blob");
                    return Promise.resolve(new Blob([this._bodyText]));
                  }),
                (this.arrayBuffer = function () {
                  if (this._bodyArrayBuffer) {
                    var a = N(this);
                    return (
                      a ||
                      (ArrayBuffer.isView(this._bodyArrayBuffer)
                        ? Promise.resolve(
                            this._bodyArrayBuffer.buffer.slice(
                              this._bodyArrayBuffer.byteOffset,
                              this._bodyArrayBuffer.byteOffset +
                                this._bodyArrayBuffer.byteLength
                            )
                          )
                        : Promise.resolve(this._bodyArrayBuffer))
                    );
                  } else {
                    if (f.blob) return this.blob().then(b);
                    throw new Error("could not read as ArrayBuffer");
                  }
                }),
                (this.text = function () {
                  var a = N(this);
                  if (a) return a;
                  if (this._bodyBlob) return C(this._bodyBlob);
                  if (this._bodyArrayBuffer)
                    return Promise.resolve(u(this._bodyArrayBuffer));
                  if (this._bodyFormData)
                    throw new Error("could not read FormData body as text");
                  return Promise.resolve(this._bodyText);
                }),
                f.formData &&
                  (this.formData = function () {
                    return this.text().then(k);
                  }),
                (this.json = function () {
                  return this.text().then(JSON.parse);
                }),
                this
              );
            }
            var w = [
              "CONNECT",
              "DELETE",
              "GET",
              "HEAD",
              "OPTIONS",
              "PATCH",
              "POST",
              "PUT",
              "TRACE",
            ];
            function _(a) {
              var h = a.toUpperCase();
              return w.indexOf(h) > -1 ? h : a;
            }
            function O(a, h) {
              if (!(this instanceof O))
                throw new TypeError(
                  'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
                );
              h = h || {};
              var j = h.body;
              if (a instanceof O) {
                if (a.bodyUsed) throw new TypeError("Already read");
                (this.url = a.url),
                  (this.credentials = a.credentials),
                  h.headers || (this.headers = new E(a.headers)),
                  (this.method = a.method),
                  (this.mode = a.mode),
                  (this.signal = a.signal),
                  !j &&
                    a._bodyInit != null &&
                    ((j = a._bodyInit), (a.bodyUsed = !0));
              } else this.url = String(a);
              if (
                ((this.credentials =
                  h.credentials || this.credentials || "same-origin"),
                (h.headers || !this.headers) &&
                  (this.headers = new E(h.headers)),
                (this.method = _(h.method || this.method || "GET")),
                (this.mode = h.mode || this.mode || null),
                (this.signal =
                  h.signal ||
                  this.signal ||
                  (function () {
                    if ("AbortController" in c) {
                      var U = new AbortController();
                      return U.signal;
                    }
                  })()),
                (this.referrer = null),
                (this.method === "GET" || this.method === "HEAD") && j)
              )
                throw new TypeError(
                  "Body not allowed for GET or HEAD requests"
                );
              if (
                (this._initBody(j),
                (this.method === "GET" || this.method === "HEAD") &&
                  (h.cache === "no-store" || h.cache === "no-cache"))
              ) {
                var I = /([?&])_=[^&]*/;
                if (I.test(this.url))
                  this.url = this.url.replace(I, "$1_=" + new Date().getTime());
                else {
                  var L = /\?/;
                  this.url +=
                    (L.test(this.url) ? "&" : "?") +
                    "_=" +
                    new Date().getTime();
                }
              }
            }
            O.prototype.clone = function () {
              return new O(this, { body: this._bodyInit });
            };
            function k(a) {
              var h = new FormData();
              return (
                a
                  .trim()
                  .split("&")
                  .forEach(function (j) {
                    if (j) {
                      var I = j.split("="),
                        L = I.shift().replace(/\+/g, " "),
                        U = I.join("=").replace(/\+/g, " ");
                      h.append(decodeURIComponent(L), decodeURIComponent(U));
                    }
                  }),
                h
              );
            }
            function H(a) {
              var h = new E(),
                j = a.replace(/\r?\n[\t ]+/g, " ");
              return (
                j
                  .split("\r")
                  .map(function (I) {
                    return I.indexOf(`
`) === 0
                      ? I.substr(1, I.length)
                      : I;
                  })
                  .forEach(function (I) {
                    var L = I.split(":"),
                      U = L.shift().trim();
                    if (U) {
                      var he = L.join(":").trim();
                      try {
                        h.append(U, he);
                      } catch (Ie) {
                        console.warn("Response " + Ie.message);
                      }
                    }
                  }),
                h
              );
            }
            p.call(O.prototype);
            function D(a, h) {
              if (!(this instanceof D))
                throw new TypeError(
                  'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
                );
              if (
                (h || (h = {}),
                (this.type = "default"),
                (this.status = h.status === void 0 ? 200 : h.status),
                this.status < 200 || this.status > 599)
              )
                throw new RangeError(
                  "Failed to construct 'Response': The status provided (0) is outside the range [200, 599]."
                );
              (this.ok = this.status >= 200 && this.status < 300),
                (this.statusText =
                  h.statusText === void 0 ? "" : "" + h.statusText),
                (this.headers = new E(h.headers)),
                (this.url = h.url || ""),
                this._initBody(a);
            }
            p.call(D.prototype),
              (D.prototype.clone = function () {
                return new D(this._bodyInit, {
                  status: this.status,
                  statusText: this.statusText,
                  headers: new E(this.headers),
                  url: this.url,
                });
              }),
              (D.error = function () {
                var a = new D(null, { status: 200, statusText: "" });
                return (a.ok = !1), (a.status = 0), (a.type = "error"), a;
              });
            var de = [301, 302, 303, 307, 308];
            (D.redirect = function (a, h) {
              if (de.indexOf(h) === -1)
                throw new RangeError("Invalid status code");
              return new D(null, { status: h, headers: { location: a } });
            }),
              (o.DOMException = c.DOMException);
            try {
              new o.DOMException();
            } catch {
              (o.DOMException = function (h, j) {
                (this.message = h), (this.name = j);
                var I = Error(h);
                this.stack = I.stack;
              }),
                (o.DOMException.prototype = Object.create(Error.prototype)),
                (o.DOMException.prototype.constructor = o.DOMException);
            }
            function ce(a, h) {
              return new Promise(function (j, I) {
                var L = new O(a, h);
                if (L.signal && L.signal.aborted)
                  return I(new o.DOMException("Aborted", "AbortError"));
                var U = new XMLHttpRequest();
                function he() {
                  U.abort();
                }
                (U.onload = function () {
                  var P = {
                    statusText: U.statusText,
                    headers: H(U.getAllResponseHeaders() || ""),
                  };
                  L.url.indexOf("file://") === 0 &&
                  (U.status < 200 || U.status > 599)
                    ? (P.status = 200)
                    : (P.status = U.status),
                    (P.url =
                      "responseURL" in U
                        ? U.responseURL
                        : P.headers.get("X-Request-URL"));
                  var X = "response" in U ? U.response : U.responseText;
                  setTimeout(function () {
                    j(new D(X, P));
                  }, 0);
                }),
                  (U.onerror = function () {
                    setTimeout(function () {
                      I(new TypeError("Network request failed"));
                    }, 0);
                  }),
                  (U.ontimeout = function () {
                    setTimeout(function () {
                      I(new TypeError("Network request timed out"));
                    }, 0);
                  }),
                  (U.onabort = function () {
                    setTimeout(function () {
                      I(new o.DOMException("Aborted", "AbortError"));
                    }, 0);
                  });
                function Ie(P) {
                  try {
                    return P === "" && c.location.href ? c.location.href : P;
                  } catch {
                    return P;
                  }
                }
                if (
                  (U.open(L.method, Ie(L.url), !0),
                  L.credentials === "include"
                    ? (U.withCredentials = !0)
                    : L.credentials === "omit" && (U.withCredentials = !1),
                  "responseType" in U &&
                    (f.blob
                      ? (U.responseType = "blob")
                      : f.arrayBuffer && (U.responseType = "arraybuffer")),
                  h &&
                    typeof h.headers == "object" &&
                    !(
                      h.headers instanceof E ||
                      (c.Headers && h.headers instanceof c.Headers)
                    ))
                ) {
                  var Je = [];
                  Object.getOwnPropertyNames(h.headers).forEach(function (P) {
                    Je.push(v(P)), U.setRequestHeader(P, A(h.headers[P]));
                  }),
                    L.headers.forEach(function (P, X) {
                      Je.indexOf(X) === -1 && U.setRequestHeader(X, P);
                    });
                } else
                  L.headers.forEach(function (P, X) {
                    U.setRequestHeader(X, P);
                  });
                L.signal &&
                  (L.signal.addEventListener("abort", he),
                  (U.onreadystatechange = function () {
                    U.readyState === 4 &&
                      L.signal.removeEventListener("abort", he);
                  })),
                  U.send(typeof L._bodyInit > "u" ? null : L._bodyInit);
              });
            }
            return (
              (ce.polyfill = !0),
              c.fetch ||
                ((c.fetch = ce),
                (c.Headers = E),
                (c.Request = O),
                (c.Response = D)),
              (o.Headers = E),
              (o.Request = O),
              (o.Response = D),
              (o.fetch = ce),
              Object.defineProperty(o, "__esModule", { value: !0 }),
              o
            );
          })({});
        })(r),
          (r.fetch.ponyfill = !0),
          delete r.fetch.polyfill;
        var n = t.fetch ? t : r;
        (e = n.fetch),
          (e.default = n.fetch),
          (e.fetch = n.fetch),
          (e.Headers = n.Headers),
          (e.Request = n.Request),
          (e.Response = n.Response),
          (i.exports = e);
      })(ye, ye.exports)),
    ye.exports
  );
}
var Fe = Ut();
const lt = ct(Fe),
  Ct = Et({ __proto__: null, default: lt }, [Fe]);
var Te, Ke;
function At() {
  if (Ke) return Te;
  Ke = 1;
  var i = function (b) {
    return e(b) && !t(b);
  };
  function e(m) {
    return !!m && typeof m == "object";
  }
  function t(m) {
    var b = Object.prototype.toString.call(m);
    return b === "[object RegExp]" || b === "[object Date]" || s(m);
  }
  var r = typeof Symbol == "function" && Symbol.for,
    n = r ? Symbol.for("react.element") : 60103;
  function s(m) {
    return m.$$typeof === n;
  }
  function o(m) {
    return Array.isArray(m) ? [] : {};
  }
  function c(m, b) {
    return b.clone !== !1 && b.isMergeableObject(m) ? E(o(m), m, b) : m;
  }
  function f(m, b, C) {
    return m.concat(b).map(function (u) {
      return c(u, C);
    });
  }
  function y(m, b) {
    if (!b.customMerge) return E;
    var C = b.customMerge(m);
    return typeof C == "function" ? C : E;
  }
  function d(m) {
    return Object.getOwnPropertySymbols
      ? Object.getOwnPropertySymbols(m).filter(function (b) {
          return Object.propertyIsEnumerable.call(m, b);
        })
      : [];
  }
  function g(m) {
    return Object.keys(m).concat(d(m));
  }
  function v(m, b) {
    try {
      return b in m;
    } catch {
      return !1;
    }
  }
  function A(m, b) {
    return (
      v(m, b) &&
      !(
        Object.hasOwnProperty.call(m, b) &&
        Object.propertyIsEnumerable.call(m, b)
      )
    );
  }
  function T(m, b, C) {
    var u = {};
    return (
      C.isMergeableObject(m) &&
        g(m).forEach(function (l) {
          u[l] = c(m[l], C);
        }),
      g(b).forEach(function (l) {
        A(m, l) ||
          (v(m, l) && C.isMergeableObject(b[l])
            ? (u[l] = y(l, C)(m[l], b[l], C))
            : (u[l] = c(b[l], C)));
      }),
      u
    );
  }
  function E(m, b, C) {
    (C = C || {}),
      (C.arrayMerge = C.arrayMerge || f),
      (C.isMergeableObject = C.isMergeableObject || i),
      (C.cloneUnlessOtherwiseSpecified = c);
    var u = Array.isArray(b),
      l = Array.isArray(m),
      p = u === l;
    return p ? (u ? C.arrayMerge(m, b, C) : T(m, b, C)) : c(b, C);
  }
  E.all = function (b, C) {
    if (!Array.isArray(b)) throw new Error("first argument should be an array");
    return b.reduce(function (u, l) {
      return E(u, l, C);
    }, {});
  };
  var N = E;
  return (Te = N), Te;
}
var It = At();
const ae = ct(It),
  ut =
    typeof process < "u" && process.versions && process.versions.node
      ? process.versions.node
      : "unknown",
  dt =
    typeof process < "u" && process.versions && process.versions.bun
      ? process.versions.bun
      : "unknown",
  ht =
    typeof window < "u" && window.navigator && window.navigator.userAgent
      ? window.navigator.userAgent
      : "unknown",
  Ae = () => ht !== "unknown",
  Tt = () => ut !== "unknown",
  ft = () => dt !== "unknown";
function Ge(i = {}, e = {}) {
  return ae(e, i);
}
function Rt(i, e) {
  Object.keys(e).forEach((t) => {
    Array.isArray(e[t])
      ? e[t].forEach((n) => {
          i.append(t, String(n));
        })
      : i.append(t, String(e[t]));
  });
}
const Mt = () => (typeof Headers > "u" ? Fe.Headers : Headers),
  je = (i) => !!(i && i.url),
  xe = (i) => !!(i && i.text),
  Xe = (i) => !!(xt(i) || Lt(i)),
  Lt = (i) => i != null && Buffer.isBuffer(i),
  xt = (i) =>
    i == null || Ae()
      ? !1
      : typeof i == "object" &&
        typeof i.pipe == "function" &&
        typeof i.read == "function" &&
        typeof i._readableState == "object",
  qt = (i) => ((t) => t.toLowerCase().replace(/^http/, "ws"))(i),
  Dt = (i) => {
    var e, t, r, n, s, o;
    const c = {};
    return (
      i._experimentalCustomFetch &&
        (c.global = { fetch: { client: i._experimentalCustomFetch } }),
      (i = ae(i, c)),
      !((e = i.restProxy) === null || e === void 0) &&
        e.url &&
        (c.global = {
          fetch: {
            options: {
              proxy: {
                url:
                  (t = i.restProxy) === null || t === void 0 ? void 0 : t.url,
              },
            },
          },
        }),
      (i = ae(i, c)),
      !((r = i.global) === null || r === void 0) &&
        r.url &&
        (c.global = {
          fetch: { options: { url: i.global.url } },
          websocket: { options: { url: i.global.url } },
        }),
      (i = ae(i, c)),
      !((n = i.global) === null || n === void 0) &&
        n.headers &&
        (c.global = {
          fetch: {
            options: {
              headers:
                (s = i.global) === null || s === void 0 ? void 0 : s.headers,
            },
          },
          websocket: {
            options: {
              _nodeOnlyHeaders:
                (o = i.global) === null || o === void 0 ? void 0 : o.headers,
            },
          },
        }),
      (i = ae(i, c)),
      i
    );
  },
  Ye = "4.11.2",
  Pt = () =>
    Tt()
      ? `node/${ut}`
      : ft()
      ? `bun/${dt}`
      : Ae()
      ? `javascript ${ht}`
      : "unknown",
  ke = {
    "Content-Type": "application/json",
    "X-Client-Info": `@deepgram/sdk; ${Ae() ? "browser" : "server"}; v${Ye}`,
    "User-Agent": `@deepgram/sdk/${Ye} ${Pt()}`,
  },
  Oe = "https://api.deepgram.com",
  pt = "wss://agent.deepgram.com",
  Bt = {
    fetch: { options: { url: Oe, headers: ke } },
    websocket: { options: { url: qt(Oe), _nodeOnlyHeaders: ke } },
  },
  Nt = {
    fetch: { options: { url: Oe, headers: ke } },
    websocket: { options: { url: pt, _nodeOnlyHeaders: ke } },
  },
  Ft = { global: Bt, agent: Nt };
var re;
(function (i) {
  (i[(i.connecting = 0)] = "connecting"),
    (i[(i.open = 1)] = "open"),
    (i[(i.closing = 2)] = "closing"),
    (i[(i.closed = 3)] = "closed");
})(re || (re = {}));
var te;
(function (i) {
  (i.Connecting = "connecting"),
    (i.Open = "open"),
    (i.Closing = "closing"),
    (i.Closed = "closed");
})(te || (te = {}));
var Qe = {};
const yt = () => {};
class ue extends Ot.EventEmitter {
  constructor(e) {
    if (
      (super(),
      (this.factory = void 0),
      (this.key = void 0),
      (this.accessToken = void 0),
      (this.namespace = "global"),
      (this.version = "v1"),
      (this.baseUrl = Oe),
      (this.logger = yt),
      typeof e.accessToken == "function"
        ? ((this.factory = e.accessToken), (this.accessToken = this.factory()))
        : (this.accessToken = e.accessToken),
      typeof e.key == "function"
        ? ((this.factory = e.key), (this.key = this.factory()))
        : (this.key = e.key),
      !this.key &&
        !this.accessToken &&
        ((this.accessToken = Qe.DEEPGRAM_ACCESS_TOKEN),
        this.accessToken || (this.key = Qe.DEEPGRAM_API_KEY)),
      !this.key && !this.accessToken)
    )
      throw new x("A deepgram API key or access token is required.");
    (e = Dt(e)), (this.options = Ge(e, Ft));
  }
  v(e = "v1") {
    return (this.version = e), this;
  }
  get namespaceOptions() {
    const e = Ge(this.options[this.namespace], this.options.global);
    return Object.assign(Object.assign({}, e), { key: this.key });
  }
  getRequestUrl(e, t = { version: this.version }, r) {
    (t.version = this.version),
      (e = e.replace(/:(\w+)/g, function (s, o) {
        return t[o];
      }));
    const n = new URL(e, this.baseUrl);
    return r && Rt(n.searchParams, r), n;
  }
  log(e, t, r) {
    this.logger(e, t, r);
  }
}
const $t = "modulepreload",
  Ht = function (i) {
    return "/" + i;
  },
  Ze = {},
  qe = function (e, t, r) {
    let n = Promise.resolve();
    if (t && t.length > 0) {
      let f = function (y) {
        return Promise.all(
          y.map((d) =>
            Promise.resolve(d).then(
              (g) => ({ status: "fulfilled", value: g }),
              (g) => ({ status: "rejected", reason: g })
            )
          )
        );
      };
      document.getElementsByTagName("link");
      const o = document.querySelector("meta[property=csp-nonce]"),
        c = o?.nonce || o?.getAttribute("nonce");
      n = f(
        t.map((y) => {
          if (((y = Ht(y)), y in Ze)) return;
          Ze[y] = !0;
          const d = y.endsWith(".css"),
            g = d ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${y}"]${g}`)) return;
          const v = document.createElement("link");
          if (
            ((v.rel = d ? "stylesheet" : $t),
            d || (v.as = "script"),
            (v.crossOrigin = ""),
            (v.href = y),
            c && v.setAttribute("nonce", c),
            document.head.appendChild(v),
            d)
          )
            return new Promise((A, T) => {
              v.addEventListener("load", A),
                v.addEventListener("error", () =>
                  T(new Error(`Unable to preload CSS for ${y}`))
                );
            });
        })
      );
    }
    function s(o) {
      const c = new Event("vite:preloadError", { cancelable: !0 });
      if (((c.payload = o), window.dispatchEvent(c), !c.defaultPrevented))
        throw o;
    }
    return n.then((o) => {
      for (const c of o || []) c.status === "rejected" && s(c.reason);
      return e().catch(s);
    });
  };
var Vt = function (i, e, t, r) {
  function n(s) {
    return s instanceof t
      ? s
      : new t(function (o) {
          o(s);
        });
  }
  return new (t || (t = Promise))(function (s, o) {
    function c(d) {
      try {
        y(r.next(d));
      } catch (g) {
        o(g);
      }
    }
    function f(d) {
      try {
        y(r.throw(d));
      } catch (g) {
        o(g);
      }
    }
    function y(d) {
      d.done ? s(d.value) : n(d.value).then(c, f);
    }
    y((r = r.apply(i, e || [])).next());
  });
};
const Jt = typeof WebSocket < "u";
class $e extends ue {
  constructor(e) {
    super(e), (this.conn = null), (this.sendBuffer = []), (this.reconnect = yt);
    const {
      key: t,
      websocket: { options: r, client: n },
    } = this.namespaceOptions;
    this.proxy ? (this.baseUrl = r.proxy.url) : (this.baseUrl = r.url),
      n ? (this.transport = n) : (this.transport = null),
      r._nodeOnlyHeaders
        ? (this.headers = r._nodeOnlyHeaders)
        : (this.headers = {}),
      "Authorization" in this.headers ||
        (this.accessToken
          ? (this.headers.Authorization = `Bearer ${this.accessToken}`)
          : (this.headers.Authorization = `Token ${t}`));
  }
  connect(e, t) {
    if (this.conn) return;
    this.reconnect = (o = e) => {
      this.connect(o, t);
    };
    const r = this.getRequestUrl(t, {}, e),
      n = this.accessToken,
      s = this.key;
    if (!n && !s)
      throw new Error(
        "No key or access token provided for WebSocket connection."
      );
    if (this.transport) {
      (this.conn = new this.transport(r, void 0, { headers: this.headers })),
        this.setupConnection();
      return;
    }
    if (ft()) {
      qe(async () => {
        const { default: o } = await import("./browser-BbK9lZvn.js").then(
          (c) => c.b
        );
        return { default: o };
      }, []).then(({ default: o }) => {
        (this.conn = new o(r, { headers: this.headers })),
          console.log("Using WS package"),
          this.setupConnection();
      });
      return;
    }
    if (Jt) {
      (this.conn = new WebSocket(r, n ? ["bearer", n] : ["token", s])),
        this.setupConnection();
      return;
    }
    (this.conn = new Wt(r, void 0, {
      close: () => {
        this.conn = null;
      },
    })),
      qe(async () => {
        const { default: o } = await import("./browser-BbK9lZvn.js").then(
          (c) => c.b
        );
        return { default: o };
      }, []).then(({ default: o }) => {
        (this.conn = new o(r, void 0, { headers: this.headers })),
          this.setupConnection();
      });
  }
  disconnect(e, t) {
    this.conn &&
      ((this.conn.onclose = function () {}),
      e ? this.conn.close(e, t ?? "") : this.conn.close(),
      (this.conn = null));
  }
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case re.connecting:
        return te.Connecting;
      case re.open:
        return te.Open;
      case re.closing:
        return te.Closing;
      default:
        return te.Closed;
    }
  }
  getReadyState() {
    var e, t;
    return (t =
      (e = this.conn) === null || e === void 0 ? void 0 : e.readyState) !==
      null && t !== void 0
      ? t
      : re.closed;
  }
  isConnected() {
    return this.connectionState() === te.Open;
  }
  send(e) {
    const t = () =>
      Vt(this, void 0, void 0, function* () {
        var r;
        if (e instanceof Blob) {
          if (e.size === 0) {
            this.log("warn", "skipping `send` for zero-byte blob", e);
            return;
          }
          e = yield e.arrayBuffer();
        }
        if (typeof e != "string" && !e?.byteLength) {
          this.log("warn", "skipping `send` for zero-byte payload", e);
          return;
        }
        (r = this.conn) === null || r === void 0 || r.send(e);
      });
    this.isConnected() ? t() : this.sendBuffer.push(t);
  }
  get proxy() {
    var e;
    return (
      this.key === "proxy" &&
      !!(
        !(
          (e = this.namespaceOptions.websocket.options.proxy) === null ||
          e === void 0
        ) && e.url
      )
    );
  }
  extractErrorInformation(e, t) {
    var r;
    const n = {};
    if (
      (t &&
        ((n.readyState = t.readyState),
        (n.url =
          typeof t.url == "string"
            ? t.url
            : (r = t.url) === null || r === void 0
            ? void 0
            : r.toString())),
      t && typeof t == "object")
    ) {
      const s = t;
      if (
        s._req &&
        s._req.res &&
        ((n.statusCode = s._req.res.statusCode), s._req.res.headers)
      ) {
        n.responseHeaders = Object.assign({}, s._req.res.headers);
        const o =
          s._req.res.headers["dg-request-id"] ||
          s._req.res.headers["x-dg-request-id"];
        o && (n.requestId = o);
      }
      if (e && "target" in e && e.target) {
        const o = e.target;
        o.url && (n.url = o.url),
          o.readyState !== void 0 && (n.readyState = o.readyState);
      }
    }
    return n;
  }
  createEnhancedError(e, t) {
    const r = new jt(
      e.message || "WebSocket connection error",
      Object.assign({ originalEvent: e }, t)
    );
    return Object.assign(Object.assign({}, e), {
      error: r,
      statusCode: t.statusCode,
      requestId: t.requestId,
      responseHeaders: t.responseHeaders,
      url: t.url,
      readyState: t.readyState,
      message: this.buildEnhancedErrorMessage(e, t),
    });
  }
  buildEnhancedErrorMessage(e, t) {
    let r = e.message || "WebSocket connection error";
    const n = [];
    if (
      (t.statusCode && n.push(`Status: ${t.statusCode}`),
      t.requestId && n.push(`Request ID: ${t.requestId}`),
      t.readyState !== void 0)
    ) {
      const o =
        ["CONNECTING", "OPEN", "CLOSING", "CLOSED"][t.readyState] ||
        `Unknown(${t.readyState})`;
      n.push(`Ready State: ${o}`);
    }
    return (
      t.url && n.push(`URL: ${t.url}`),
      n.length > 0 && (r += ` (${n.join(", ")})`),
      r
    );
  }
  setupConnectionEvents(e) {
    this.conn &&
      ((this.conn.onopen = () => {
        this.emit(e.Open, this);
      }),
      (this.conn.onclose = (t) => {
        this.emit(e.Close, t);
      }),
      (this.conn.onerror = (t) => {
        const r = this.extractErrorInformation(t, this.conn || void 0),
          n = this.createEnhancedError(t, r);
        this.emit(e.Error, n);
      }));
  }
}
class Wt {
  constructor(e, t, r) {
    (this.binaryType = "arraybuffer"),
      (this.onclose = () => {}),
      (this.onerror = () => {}),
      (this.onmessage = () => {}),
      (this.onopen = () => {}),
      (this.readyState = re.connecting),
      (this.send = () => {}),
      (this.url = null),
      (this.url = e.toString()),
      (this.close = r.close);
  }
}
var gt = function (i, e, t, r) {
  function n(s) {
    return s instanceof t
      ? s
      : new t(function (o) {
          o(s);
        });
  }
  return new (t || (t = Promise))(function (s, o) {
    function c(d) {
      try {
        y(r.next(d));
      } catch (g) {
        o(g);
      }
    }
    function f(d) {
      try {
        y(r.throw(d));
      } catch (g) {
        o(g);
      }
    }
    function y(d) {
      d.done ? s(d.value) : n(d.value).then(c, f);
    }
    y((r = r.apply(i, e || [])).next());
  });
};
const zt = (i) => {
    let e;
    return (
      i ? (e = i) : typeof fetch > "u" ? (e = lt) : (e = fetch),
      (...t) => e(...t)
    );
  },
  Kt = ({ apiKey: i, customFetch: e, accessToken: t }) => {
    const r = zt(e),
      n = Mt();
    return (s, o) =>
      gt(void 0, void 0, void 0, function* () {
        const c = new n(o?.headers);
        return (
          c.has("Authorization") ||
            c.set("Authorization", t ? `Bearer ${t}` : `Token ${i}`),
          r(s, Object.assign(Object.assign({}, o), { headers: c }))
        );
      });
  },
  Gt = () =>
    gt(void 0, void 0, void 0, function* () {
      return typeof Response > "u"
        ? (yield qe(() => Promise.resolve().then(() => Ct), void 0)).Response
        : Response;
    });
var Y = function (i, e, t, r) {
  function n(s) {
    return s instanceof t
      ? s
      : new t(function (o) {
          o(s);
        });
  }
  return new (t || (t = Promise))(function (s, o) {
    function c(d) {
      try {
        y(r.next(d));
      } catch (g) {
        o(g);
      }
    }
    function f(d) {
      try {
        y(r.throw(d));
      } catch (g) {
        o(g);
      }
    }
    function y(d) {
      d.done ? s(d.value) : n(d.value).then(c, f);
    }
    y((r = r.apply(i, e || [])).next());
  });
};
class se extends ue {
  constructor(e) {
    if ((super(e), Ae() && !this.proxy))
      throw new x(
        "Due to CORS we are unable to support REST-based API calls to our API from the browser. Please consider using a proxy: https://dpgr.am/js-proxy for more information."
      );
    const { accessToken: t, key: r, fetch: n } = this;
    (this.fetch = Kt({ accessToken: t, apiKey: r, customFetch: n })),
      this.proxy
        ? (this.baseUrl = this.namespaceOptions.fetch.options.proxy.url)
        : (this.baseUrl = this.namespaceOptions.fetch.options.url);
  }
  _getErrorMessage(e) {
    return (
      e.msg || e.message || e.error_description || e.error || JSON.stringify(e)
    );
  }
  _handleError(e, t) {
    return Y(this, void 0, void 0, function* () {
      const r = yield Gt();
      e instanceof r
        ? e
            .json()
            .then((n) => {
              t(new St(this._getErrorMessage(n), e.status || 500));
            })
            .catch((n) => {
              t(new Se(this._getErrorMessage(n), n));
            })
        : t(new Se(this._getErrorMessage(e), e));
    });
  }
  _getRequestOptions(e, t, r) {
    let n = { method: e };
    return (
      e === "GET" || e === "DELETE"
        ? (n = Object.assign(Object.assign({}, n), t))
        : (n = Object.assign(Object.assign({ duplex: "half", body: t }, n), r)),
      ae(this.namespaceOptions.fetch.options, n, { clone: !1 })
    );
  }
  _handleRequest(e, t, r, n) {
    return Y(this, void 0, void 0, function* () {
      return new Promise((s, o) => {
        const c = this.fetch;
        c(t, this._getRequestOptions(e, r, n))
          .then((f) => {
            if (!f.ok) throw f;
            s(f);
          })
          .catch((f) => this._handleError(f, o));
      });
    });
  }
  get(e, t) {
    return Y(this, void 0, void 0, function* () {
      return this._handleRequest("GET", e, t);
    });
  }
  post(e, t, r) {
    return Y(this, void 0, void 0, function* () {
      return this._handleRequest("POST", e, t, r);
    });
  }
  put(e, t, r) {
    return Y(this, void 0, void 0, function* () {
      return this._handleRequest("PUT", e, t, r);
    });
  }
  patch(e, t, r) {
    return Y(this, void 0, void 0, function* () {
      return this._handleRequest("PATCH", e, t, r);
    });
  }
  delete(e, t) {
    return Y(this, void 0, void 0, function* () {
      return this._handleRequest("DELETE", e, t);
    });
  }
  get proxy() {
    var e;
    return (
      this.key === "proxy" &&
      !!(
        !(
          (e = this.namespaceOptions.fetch.options.proxy) === null ||
          e === void 0
        ) && e.url
      )
    );
  }
}
var W;
(function (i) {
  (i.Open = "Open"),
    (i.Close = "Close"),
    (i.Error = "Error"),
    (i.Audio = "Audio"),
    (i.Welcome = "Welcome"),
    (i.SettingsApplied = "SettingsApplied"),
    (i.ConversationText = "ConversationText"),
    (i.UserStartedSpeaking = "UserStartedSpeaking"),
    (i.AgentThinking = "AgentThinking"),
    (i.FunctionCallRequest = "FunctionCallRequest"),
    (i.AgentStartedSpeaking = "AgentStartedSpeaking"),
    (i.AgentAudioDone = "AgentAudioDone"),
    (i.InjectionRefused = "InjectionRefused"),
    (i.PromptUpdated = "PromptUpdated"),
    (i.SpeakUpdated = "SpeakUpdated"),
    (i.Unhandled = "Unhandled");
})(W || (W = {}));
class Xt extends $e {
  constructor(e, t = "/:version/agent/converse") {
    var r, n, s, o;
    super(e),
      (this.namespace = "agent"),
      (this.baseUrl =
        (o =
          (s =
            (n =
              (r = e.agent) === null || r === void 0 ? void 0 : r.websocket) ===
              null || n === void 0
              ? void 0
              : n.options) === null || s === void 0
            ? void 0
            : s.url) !== null && o !== void 0
          ? o
          : pt),
      this.connect({}, t);
  }
  setupConnection() {
    this.setupConnectionEvents({
      Open: W.Open,
      Close: W.Close,
      Error: W.Error,
    }),
      this.conn &&
        (this.conn.onmessage = (e) => {
          this.handleMessage(e);
        });
  }
  handleMessage(e) {
    var t, r, n, s, o, c;
    if (typeof e.data == "string")
      try {
        const f = JSON.parse(e.data);
        this.handleTextMessage(f);
      } catch (f) {
        this.emit(W.Error, {
          event: e,
          data:
            ((t = e.data) === null || t === void 0
              ? void 0
              : t.toString().substring(0, 200)) +
            (((r = e.data) === null || r === void 0
              ? void 0
              : r.toString().length) > 200
              ? "..."
              : ""),
          message: "Unable to parse `data` as JSON.",
          error: f,
          url: (n = this.conn) === null || n === void 0 ? void 0 : n.url,
          readyState:
            (s = this.conn) === null || s === void 0 ? void 0 : s.readyState,
        });
      }
    else
      e.data instanceof Blob
        ? e.data.arrayBuffer().then((f) => {
            this.handleBinaryMessage(Buffer.from(f));
          })
        : e.data instanceof ArrayBuffer
        ? this.handleBinaryMessage(Buffer.from(e.data))
        : Buffer.isBuffer(e.data)
        ? this.handleBinaryMessage(e.data)
        : (console.log("Received unknown data type", e.data),
          this.emit(W.Error, {
            event: e,
            message: "Received unknown data type.",
            url: (o = this.conn) === null || o === void 0 ? void 0 : o.url,
            readyState:
              (c = this.conn) === null || c === void 0 ? void 0 : c.readyState,
            dataType: typeof e.data,
          }));
  }
  handleBinaryMessage(e) {
    this.emit(W.Audio, e);
  }
  handleTextMessage(e) {
    e.type in W ? this.emit(e.type, e) : this.emit(W.Unhandled, e);
  }
  configure(e) {
    const t = JSON.stringify(Object.assign({ type: "Settings" }, e));
    this.send(t);
  }
  updatePrompt(e) {
    this.send(JSON.stringify({ type: "UpdatePrompt", prompt: e }));
  }
  updateSpeak(e) {
    this.send(JSON.stringify({ type: "UpdateSpeak", speak: e }));
  }
  injectAgentMessage(e) {
    this.send(JSON.stringify({ type: "InjectAgentMessage", content: e }));
  }
  injectUserMessage(e) {
    this.send(JSON.stringify({ type: "InjectUserMessage", content: e }));
  }
  functionCallResponse(e) {
    this.send(
      JSON.stringify(Object.assign({ type: "FunctionCallResponse" }, e))
    );
  }
  keepAlive() {
    this.send(JSON.stringify({ type: "KeepAlive" }));
  }
}
var Yt = function (i, e, t, r) {
  function n(s) {
    return s instanceof t
      ? s
      : new t(function (o) {
          o(s);
        });
  }
  return new (t || (t = Promise))(function (s, o) {
    function c(d) {
      try {
        y(r.next(d));
      } catch (g) {
        o(g);
      }
    }
    function f(d) {
      try {
        y(r.throw(d));
      } catch (g) {
        o(g);
      }
    }
    function y(d) {
      d.done ? s(d.value) : n(d.value).then(c, f);
    }
    y((r = r.apply(i, e || [])).next());
  });
};
class Qt extends se {
  constructor() {
    super(...arguments), (this.namespace = "auth");
  }
  grantToken(e = {}, t = ":version/auth/grant") {
    return Yt(this, void 0, void 0, function* () {
      try {
        const r = this.getRequestUrl(t),
          n = JSON.stringify(e);
        return {
          result: yield this.post(r, n, {
            headers: { "Content-Type": "application/json" },
          }).then((o) => o.json()),
          error: null,
        };
      } catch (r) {
        if (S(r)) return { result: null, error: r };
        throw r;
      }
    });
  }
}
var q;
(function (i) {
  (i.Open = "open"),
    (i.Close = "close"),
    (i.Error = "error"),
    (i.Transcript = "Results"),
    (i.Metadata = "Metadata"),
    (i.UtteranceEnd = "UtteranceEnd"),
    (i.SpeechStarted = "SpeechStarted"),
    (i.Unhandled = "Unhandled");
})(q || (q = {}));
var $;
(function (i) {
  (i.Open = "Open"),
    (i.Close = "Close"),
    (i.Error = "Error"),
    (i.Metadata = "Metadata"),
    (i.Flushed = "Flushed"),
    (i.Warning = "Warning"),
    (i.Audio = "Audio"),
    (i.Unhandled = "Unhandled");
})($ || ($ = {}));
class Zt extends $e {
  constructor(e, t = {}, r = ":version/listen") {
    var n, s;
    if (
      (super(e),
      (this.namespace = "listen"),
      !((n = t.keyterm) === null || n === void 0) &&
        n.length &&
        !(!((s = t.model) === null || s === void 0) && s.startsWith("nova-3")))
    )
      throw new x("Keyterms are only supported with the Nova 3 models.");
    this.connect(t, r);
  }
  setupConnection() {
    this.setupConnectionEvents({
      Open: q.Open,
      Close: q.Close,
      Error: q.Error,
    }),
      this.conn &&
        (this.conn.onmessage = (e) => {
          var t, r, n, s;
          try {
            const o = JSON.parse(e.data.toString());
            o.type === q.Metadata
              ? this.emit(q.Metadata, o)
              : o.type === q.Transcript
              ? this.emit(q.Transcript, o)
              : o.type === q.UtteranceEnd
              ? this.emit(q.UtteranceEnd, o)
              : o.type === q.SpeechStarted
              ? this.emit(q.SpeechStarted, o)
              : this.emit(q.Unhandled, o);
          } catch (o) {
            this.emit(q.Error, {
              event: e,
              message: "Unable to parse `data` as JSON.",
              error: o,
              url: (t = this.conn) === null || t === void 0 ? void 0 : t.url,
              readyState:
                (r = this.conn) === null || r === void 0
                  ? void 0
                  : r.readyState,
              data:
                ((n = e.data) === null || n === void 0
                  ? void 0
                  : n.toString().substring(0, 200)) +
                (((s = e.data) === null || s === void 0
                  ? void 0
                  : s.toString().length) > 200
                  ? "..."
                  : ""),
            });
          }
        });
  }
  configure(e) {
    this.send(JSON.stringify({ type: "Configure", processors: e }));
  }
  keepAlive() {
    this.send(JSON.stringify({ type: "KeepAlive" }));
  }
  finalize() {
    this.send(JSON.stringify({ type: "Finalize" }));
  }
  finish() {
    this.requestClose();
  }
  requestClose() {
    this.send(JSON.stringify({ type: "CloseStream" }));
  }
}
var ge = function (i, e, t, r) {
  function n(s) {
    return s instanceof t
      ? s
      : new t(function (o) {
          o(s);
        });
  }
  return new (t || (t = Promise))(function (s, o) {
    function c(d) {
      try {
        y(r.next(d));
      } catch (g) {
        o(g);
      }
    }
    function f(d) {
      try {
        y(r.throw(d));
      } catch (g) {
        o(g);
      }
    }
    function y(d) {
      d.done ? s(d.value) : n(d.value).then(c, f);
    }
    y((r = r.apply(i, e || [])).next());
  });
};
class er extends se {
  constructor() {
    super(...arguments), (this.namespace = "listen");
  }
  transcribeUrl(e, t, r = ":version/listen") {
    var n, s;
    return ge(this, void 0, void 0, function* () {
      try {
        let o;
        if (je(e)) o = JSON.stringify(e);
        else throw new x("Unknown transcription source type");
        if (t !== void 0 && "callback" in t)
          throw new x(
            "Callback cannot be provided as an option to a synchronous transcription. Use `transcribeUrlCallback` or `transcribeFileCallback` instead."
          );
        if (
          !((n = t?.keyterm) === null || n === void 0) &&
          n.length &&
          !(!((s = t.model) === null || s === void 0) && s.startsWith("nova-3"))
        )
          throw new x("Keyterms are only supported with the Nova 3 models.");
        const c = this.getRequestUrl(r, {}, Object.assign({}, t));
        return {
          result: yield this.post(c, o).then((y) => y.json()),
          error: null,
        };
      } catch (o) {
        if (S(o)) return { result: null, error: o };
        throw o;
      }
    });
  }
  transcribeFile(e, t, r = ":version/listen") {
    return ge(this, void 0, void 0, function* () {
      try {
        let n;
        if (Xe(e)) n = e;
        else throw new x("Unknown transcription source type");
        if (t !== void 0 && "callback" in t)
          throw new x(
            "Callback cannot be provided as an option to a synchronous transcription. Use `transcribeUrlCallback` or `transcribeFileCallback` instead."
          );
        const s = this.getRequestUrl(r, {}, Object.assign({}, t));
        return {
          result: yield this.post(s, n, {
            headers: { "Content-Type": "deepgram/audio+video" },
          }).then((c) => c.json()),
          error: null,
        };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  transcribeUrlCallback(e, t, r, n = ":version/listen") {
    return ge(this, void 0, void 0, function* () {
      try {
        let s;
        if (je(e)) s = JSON.stringify(e);
        else throw new x("Unknown transcription source type");
        const o = this.getRequestUrl(
          n,
          {},
          Object.assign(Object.assign({}, r), { callback: t.toString() })
        );
        return {
          result: yield this.post(o, s).then((f) => f.json()),
          error: null,
        };
      } catch (s) {
        if (S(s)) return { result: null, error: s };
        throw s;
      }
    });
  }
  transcribeFileCallback(e, t, r, n = ":version/listen") {
    return ge(this, void 0, void 0, function* () {
      try {
        let s;
        if (Xe(e)) s = e;
        else throw new x("Unknown transcription source type");
        const o = this.getRequestUrl(
          n,
          {},
          Object.assign(Object.assign({}, r), { callback: t.toString() })
        );
        return {
          result: yield this.post(o, s, {
            headers: { "Content-Type": "deepgram/audio+video" },
          }).then((f) => f.json()),
          error: null,
        };
      } catch (s) {
        if (S(s)) return { result: null, error: s };
        throw s;
      }
    });
  }
}
class tr extends ue {
  constructor() {
    super(...arguments), (this.namespace = "listen");
  }
  get prerecorded() {
    return new er(this.options);
  }
  live(e = {}, t = ":version/listen") {
    return new Zt(this.options, e, t);
  }
}
var R = function (i, e, t, r) {
  function n(s) {
    return s instanceof t
      ? s
      : new t(function (o) {
          o(s);
        });
  }
  return new (t || (t = Promise))(function (s, o) {
    function c(d) {
      try {
        y(r.next(d));
      } catch (g) {
        o(g);
      }
    }
    function f(d) {
      try {
        y(r.throw(d));
      } catch (g) {
        o(g);
      }
    }
    function y(d) {
      d.done ? s(d.value) : n(d.value).then(c, f);
    }
    y((r = r.apply(i, e || [])).next());
  });
};
class rr extends se {
  constructor() {
    super(...arguments), (this.namespace = "manage");
  }
  getTokenDetails(e = ":version/auth/token") {
    return R(this, void 0, void 0, function* () {
      try {
        const t = this.getRequestUrl(e);
        return { result: yield this.get(t).then((n) => n.json()), error: null };
      } catch (t) {
        if (S(t)) return { result: null, error: t };
        throw t;
      }
    });
  }
  getProjects(e = ":version/projects") {
    return R(this, void 0, void 0, function* () {
      try {
        const t = this.getRequestUrl(e);
        return { result: yield this.get(t).then((n) => n.json()), error: null };
      } catch (t) {
        if (S(t)) return { result: null, error: t };
        throw t;
      }
    });
  }
  getProject(e, t = ":version/projects/:projectId") {
    return R(this, void 0, void 0, function* () {
      try {
        const r = this.getRequestUrl(t, { projectId: e });
        return { result: yield this.get(r).then((s) => s.json()), error: null };
      } catch (r) {
        if (S(r)) return { result: null, error: r };
        throw r;
      }
    });
  }
  updateProject(e, t, r = ":version/projects/:projectId") {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e }, t),
          s = JSON.stringify(t);
        return {
          result: yield this.patch(n, s).then((c) => c.json()),
          error: null,
        };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  deleteProject(e, t = ":version/projects/:projectId") {
    return R(this, void 0, void 0, function* () {
      try {
        const r = this.getRequestUrl(t, { projectId: e });
        return yield this.delete(r), { error: null };
      } catch (r) {
        if (S(r)) return { error: r };
        throw r;
      }
    });
  }
  getProjectKeys(e, t = ":version/projects/:projectId/keys") {
    return R(this, void 0, void 0, function* () {
      try {
        const r = this.getRequestUrl(t, { projectId: e });
        return { result: yield this.get(r).then((s) => s.json()), error: null };
      } catch (r) {
        if (S(r)) return { result: null, error: r };
        throw r;
      }
    });
  }
  getProjectKey(e, t, r = ":version/projects/:projectId/keys/:keyId") {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e, keyId: t });
        return { result: yield this.get(n).then((o) => o.json()), error: null };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  createProjectKey(e, t, r = ":version/projects/:projectId/keys") {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e }, t),
          s = JSON.stringify(t);
        return {
          result: yield this.post(n, s).then((c) => c.json()),
          error: null,
        };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  deleteProjectKey(e, t, r = ":version/projects/:projectId/keys/:keyId") {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e, keyId: t });
        return yield this.delete(n), { error: null };
      } catch (n) {
        if (S(n)) return { error: n };
        throw n;
      }
    });
  }
  getProjectMembers(e, t = ":version/projects/:projectId/members") {
    return R(this, void 0, void 0, function* () {
      try {
        const r = this.getRequestUrl(t, { projectId: e });
        return { result: yield this.get(r).then((s) => s.json()), error: null };
      } catch (r) {
        if (S(r)) return { result: null, error: r };
        throw r;
      }
    });
  }
  removeProjectMember(
    e,
    t,
    r = ":version/projects/:projectId/members/:memberId"
  ) {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e, memberId: t });
        return yield this.delete(n), { error: null };
      } catch (n) {
        if (S(n)) return { error: n };
        throw n;
      }
    });
  }
  getProjectMemberScopes(
    e,
    t,
    r = ":version/projects/:projectId/members/:memberId/scopes"
  ) {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e, memberId: t });
        return { result: yield this.get(n).then((o) => o.json()), error: null };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  updateProjectMemberScope(
    e,
    t,
    r,
    n = ":version/projects/:projectId/members/:memberId/scopes"
  ) {
    return R(this, void 0, void 0, function* () {
      try {
        const s = this.getRequestUrl(n, { projectId: e, memberId: t }, r),
          o = JSON.stringify(r);
        return {
          result: yield this.put(s, o).then((f) => f.json()),
          error: null,
        };
      } catch (s) {
        if (S(s)) return { result: null, error: s };
        throw s;
      }
    });
  }
  getProjectInvites(e, t = ":version/projects/:projectId/invites") {
    return R(this, void 0, void 0, function* () {
      try {
        const r = this.getRequestUrl(t, { projectId: e });
        return { result: yield this.get(r).then((s) => s.json()), error: null };
      } catch (r) {
        if (S(r)) return { result: null, error: r };
        throw r;
      }
    });
  }
  sendProjectInvite(e, t, r = ":version/projects/:projectId/invites") {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e }, t),
          s = JSON.stringify(t);
        return {
          result: yield this.post(n, s).then((c) => c.json()),
          error: null,
        };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  deleteProjectInvite(e, t, r = ":version/projects/:projectId/invites/:email") {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e, email: t });
        return yield this.delete(n), { error: null };
      } catch (n) {
        if (S(n)) return { error: n };
        throw n;
      }
    });
  }
  leaveProject(e, t = ":version/projects/:projectId/leave") {
    return R(this, void 0, void 0, function* () {
      try {
        const r = this.getRequestUrl(t, { projectId: e });
        return {
          result: yield this.delete(r).then((s) => s.json()),
          error: null,
        };
      } catch (r) {
        if (S(r)) return { result: null, error: r };
        throw r;
      }
    });
  }
  getProjectUsageRequests(e, t, r = ":version/projects/:projectId/requests") {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e }, t);
        return { result: yield this.get(n).then((o) => o.json()), error: null };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  getProjectUsageRequest(
    e,
    t,
    r = ":version/projects/:projectId/requests/:requestId"
  ) {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e, requestId: t });
        return { result: yield this.get(n).then((o) => o.json()), error: null };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  getProjectUsageSummary(e, t, r = ":version/projects/:projectId/usage") {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e }, t);
        return { result: yield this.get(n).then((o) => o.json()), error: null };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  getProjectUsageFields(e, t, r = ":version/projects/:projectId/usage/fields") {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e }, t);
        return { result: yield this.get(n).then((o) => o.json()), error: null };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  getProjectBalances(e, t = ":version/projects/:projectId/balances") {
    return R(this, void 0, void 0, function* () {
      try {
        const r = this.getRequestUrl(t, { projectId: e });
        return { result: yield this.get(r).then((s) => s.json()), error: null };
      } catch (r) {
        if (S(r)) return { result: null, error: r };
        throw r;
      }
    });
  }
  getProjectBalance(
    e,
    t,
    r = ":version/projects/:projectId/balances/:balanceId"
  ) {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e, balanceId: t });
        return { result: yield this.get(n).then((o) => o.json()), error: null };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  getAllModels(e, t = {}, r = ":version/projects/:projectId/models") {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e }, t);
        return { result: yield this.get(n).then((o) => o.json()), error: null };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  getModel(e, t, r = ":version/projects/:projectId/models/:modelId") {
    return R(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e, modelId: t });
        return { result: yield this.get(n).then((o) => o.json()), error: null };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
}
var et = function (i, e, t, r) {
  function n(s) {
    return s instanceof t
      ? s
      : new t(function (o) {
          o(s);
        });
  }
  return new (t || (t = Promise))(function (s, o) {
    function c(d) {
      try {
        y(r.next(d));
      } catch (g) {
        o(g);
      }
    }
    function f(d) {
      try {
        y(r.throw(d));
      } catch (g) {
        o(g);
      }
    }
    function y(d) {
      d.done ? s(d.value) : n(d.value).then(c, f);
    }
    y((r = r.apply(i, e || [])).next());
  });
};
class nr extends se {
  constructor() {
    super(...arguments), (this.namespace = "models");
  }
  getAll(e = ":version/models", t = {}) {
    return et(this, void 0, void 0, function* () {
      try {
        const r = this.getRequestUrl(e, {}, t);
        return { result: yield this.get(r).then((s) => s.json()), error: null };
      } catch (r) {
        if (S(r)) return { result: null, error: r };
        throw r;
      }
    });
  }
  getModel(e, t = ":version/models/:modelId") {
    return et(this, void 0, void 0, function* () {
      try {
        const r = this.getRequestUrl(t, { modelId: e });
        return { result: yield this.get(r).then((s) => s.json()), error: null };
      } catch (r) {
        if (S(r)) return { result: null, error: r };
        throw r;
      }
    });
  }
}
var ve = function (i, e, t, r) {
  function n(s) {
    return s instanceof t
      ? s
      : new t(function (o) {
          o(s);
        });
  }
  return new (t || (t = Promise))(function (s, o) {
    function c(d) {
      try {
        y(r.next(d));
      } catch (g) {
        o(g);
      }
    }
    function f(d) {
      try {
        y(r.throw(d));
      } catch (g) {
        o(g);
      }
    }
    function y(d) {
      d.done ? s(d.value) : n(d.value).then(c, f);
    }
    y((r = r.apply(i, e || [])).next());
  });
};
class sr extends se {
  constructor() {
    super(...arguments), (this.namespace = "read");
  }
  analyzeUrl(e, t, r = ":version/read") {
    return ve(this, void 0, void 0, function* () {
      try {
        let n;
        if (je(e)) n = JSON.stringify(e);
        else throw new x("Unknown source type");
        if (t !== void 0 && "callback" in t)
          throw new x(
            "Callback cannot be provided as an option to a synchronous transcription. Use `analyzeUrlCallback` or `analyzeTextCallback` instead."
          );
        const s = this.getRequestUrl(r, {}, Object.assign({}, t));
        return {
          result: yield this.post(s, n).then((c) => c.json()),
          error: null,
        };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  analyzeText(e, t, r = ":version/read") {
    return ve(this, void 0, void 0, function* () {
      try {
        let n;
        if (xe(e)) n = JSON.stringify(e);
        else throw new x("Unknown source type");
        if (t !== void 0 && "callback" in t)
          throw new x(
            "Callback cannot be provided as an option to a synchronous requests. Use `analyzeUrlCallback` or `analyzeTextCallback` instead."
          );
        const s = this.getRequestUrl(r, {}, Object.assign({}, t));
        return {
          result: yield this.post(s, n).then((c) => c.json()),
          error: null,
        };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  analyzeUrlCallback(e, t, r, n = ":version/read") {
    return ve(this, void 0, void 0, function* () {
      try {
        let s;
        if (je(e)) s = JSON.stringify(e);
        else throw new x("Unknown source type");
        const o = this.getRequestUrl(
          n,
          {},
          Object.assign(Object.assign({}, r), { callback: t.toString() })
        );
        return {
          result: yield this.post(o, s).then((f) => f.json()),
          error: null,
        };
      } catch (s) {
        if (S(s)) return { result: null, error: s };
        throw s;
      }
    });
  }
  analyzeTextCallback(e, t, r, n = ":version/read") {
    return ve(this, void 0, void 0, function* () {
      try {
        let s;
        if (xe(e)) s = JSON.stringify(e);
        else throw new x("Unknown source type");
        const o = this.getRequestUrl(
          n,
          {},
          Object.assign(Object.assign({}, r), { callback: t.toString() })
        );
        return {
          result: yield this.post(o, s, {
            headers: { "Content-Type": "deepgram/audio+video" },
          }).then((f) => f.json()),
          error: null,
        };
      } catch (s) {
        if (S(s)) return { result: null, error: s };
        throw s;
      }
    });
  }
}
var me = function (i, e, t, r) {
  function n(s) {
    return s instanceof t
      ? s
      : new t(function (o) {
          o(s);
        });
  }
  return new (t || (t = Promise))(function (s, o) {
    function c(d) {
      try {
        y(r.next(d));
      } catch (g) {
        o(g);
      }
    }
    function f(d) {
      try {
        y(r.throw(d));
      } catch (g) {
        o(g);
      }
    }
    function y(d) {
      d.done ? s(d.value) : n(d.value).then(c, f);
    }
    y((r = r.apply(i, e || [])).next());
  });
};
class ir extends se {
  constructor() {
    super(...arguments), (this.namespace = "selfhosted");
  }
  listCredentials(
    e,
    t = ":version/projects/:projectId/onprem/distribution/credentials"
  ) {
    return me(this, void 0, void 0, function* () {
      try {
        const r = this.getRequestUrl(t, { projectId: e });
        return { result: yield this.get(r).then((s) => s.json()), error: null };
      } catch (r) {
        if (S(r)) return { result: null, error: r };
        throw r;
      }
    });
  }
  getCredentials(
    e,
    t,
    r = ":version/projects/:projectId/onprem/distribution/credentials/:credentialsId"
  ) {
    return me(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e, credentialsId: t });
        return { result: yield this.get(n).then((o) => o.json()), error: null };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  createCredentials(
    e,
    t,
    r = ":version/projects/:projectId/onprem/distribution/credentials"
  ) {
    return me(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e }),
          s = JSON.stringify(t);
        return {
          result: yield this.post(n, s).then((c) => c.json()),
          error: null,
        };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
  deleteCredentials(
    e,
    t,
    r = ":version/projects/:projectId/onprem/distribution/credentials/:credentialsId"
  ) {
    return me(this, void 0, void 0, function* () {
      try {
        const n = this.getRequestUrl(r, { projectId: e, credentialsId: t });
        return {
          result: yield this.delete(n).then((o) => o.json()),
          error: null,
        };
      } catch (n) {
        if (S(n)) return { result: null, error: n };
        throw n;
      }
    });
  }
}
class or extends $e {
  constructor(e, t = {}, r = ":version/speak") {
    super(e), (this.namespace = "speak"), this.connect(t, r);
  }
  setupConnection() {
    this.setupConnectionEvents({
      Open: $.Open,
      Close: $.Close,
      Error: $.Error,
    }),
      this.conn &&
        (this.conn.onmessage = (e) => {
          this.handleMessage(e);
        });
  }
  handleTextMessage(e) {
    e.type === $.Metadata
      ? this.emit($.Metadata, e)
      : e.type === $.Flushed
      ? this.emit($.Flushed, e)
      : e.type === $.Warning
      ? this.emit($.Warning, e)
      : this.emit($.Unhandled, e);
  }
  handleBinaryMessage(e) {
    this.emit($.Audio, e);
  }
  sendText(e) {
    this.send(JSON.stringify({ type: "Speak", text: e }));
  }
  flush() {
    this.send(JSON.stringify({ type: "Flush" }));
  }
  clear() {
    this.send(JSON.stringify({ type: "Clear" }));
  }
  requestClose() {
    this.send(JSON.stringify({ type: "Close" }));
  }
  handleMessage(e) {
    var t, r, n, s, o, c;
    if (typeof e.data == "string")
      try {
        const f = JSON.parse(e.data);
        this.handleTextMessage(f);
      } catch (f) {
        this.emit($.Error, {
          event: e,
          message: "Unable to parse `data` as JSON.",
          error: f,
          url: (t = this.conn) === null || t === void 0 ? void 0 : t.url,
          readyState:
            (r = this.conn) === null || r === void 0 ? void 0 : r.readyState,
          data:
            ((n = e.data) === null || n === void 0
              ? void 0
              : n.toString().substring(0, 200)) +
            (((s = e.data) === null || s === void 0
              ? void 0
              : s.toString().length) > 200
              ? "..."
              : ""),
        });
      }
    else
      e.data instanceof Blob
        ? e.data.arrayBuffer().then((f) => {
            this.handleBinaryMessage(Buffer.from(f));
          })
        : e.data instanceof ArrayBuffer
        ? this.handleBinaryMessage(Buffer.from(e.data))
        : Buffer.isBuffer(e.data)
        ? this.handleBinaryMessage(e.data)
        : (console.log("Received unknown data type", e.data),
          this.emit($.Error, {
            event: e,
            message: "Received unknown data type.",
            url: (o = this.conn) === null || o === void 0 ? void 0 : o.url,
            readyState:
              (c = this.conn) === null || c === void 0 ? void 0 : c.readyState,
            dataType: typeof e.data,
          }));
  }
}
var Re = function (i, e, t, r) {
  function n(s) {
    return s instanceof t
      ? s
      : new t(function (o) {
          o(s);
        });
  }
  return new (t || (t = Promise))(function (s, o) {
    function c(d) {
      try {
        y(r.next(d));
      } catch (g) {
        o(g);
      }
    }
    function f(d) {
      try {
        y(r.throw(d));
      } catch (g) {
        o(g);
      }
    }
    function y(d) {
      d.done ? s(d.value) : n(d.value).then(c, f);
    }
    y((r = r.apply(i, e || [])).next());
  });
};
class ar extends se {
  constructor() {
    super(...arguments), (this.namespace = "speak");
  }
  request(e, t, r = ":version/speak") {
    return Re(this, void 0, void 0, function* () {
      let n;
      if (xe(e)) n = JSON.stringify(e);
      else throw new x("Unknown transcription source type");
      const s = this.getRequestUrl(
        r,
        {},
        Object.assign({ model: "aura-2-thalia-en" }, t)
      );
      return (
        (this.result = yield this.post(s, n, {
          headers: { Accept: "audio/*", "Content-Type": "application/json" },
        })),
        this
      );
    });
  }
  getStream() {
    return Re(this, void 0, void 0, function* () {
      if (!this.result)
        throw new Se("Tried to get stream before making request", "");
      return this.result.body;
    });
  }
  getHeaders() {
    return Re(this, void 0, void 0, function* () {
      if (!this.result)
        throw new Se("Tried to get headers before making request", "");
      return this.result.headers;
    });
  }
}
class cr extends ue {
  constructor() {
    super(...arguments), (this.namespace = "speak");
  }
  request(e, t, r = ":version/speak") {
    return new ar(this.options).request(e, t, r);
  }
  live(e = {}, t = ":version/speak") {
    return new or(this.options, e, t);
  }
}
class lr extends ue {
  get auth() {
    return new Qt(this.options);
  }
  get listen() {
    return new tr(this.options);
  }
  get manage() {
    return new rr(this.options);
  }
  get models() {
    return new nr(this.options);
  }
  get onprem() {
    return this.selfhosted;
  }
  get selfhosted() {
    return new ir(this.options);
  }
  get read() {
    return new sr(this.options);
  }
  get speak() {
    return new cr(this.options);
  }
  agent(e = "/:version/agent/converse") {
    return new Xt(this.options, e);
  }
  get transcription() {
    throw new K();
  }
  get projects() {
    throw new K();
  }
  get keys() {
    throw new K();
  }
  get members() {
    throw new K();
  }
  get scopes() {
    throw new K();
  }
  get invitation() {
    throw new K();
  }
  get usage() {
    throw new K();
  }
  get billing() {
    throw new K();
  }
}
function ur(i, e) {
  let t = {};
  return (
    typeof i == "string" || typeof i == "function"
      ? (t.key = i)
      : typeof i == "object" && (t = i),
    new lr(t)
  );
}
const He = async (i, e = "") => {
    !e ||
      !e.trim() ||
      i.sendAppMessage(
        {
          message_type: "conversation",
          event_type: "conversation.echo",
          conversation_id: i.conversationId,
          properties: { text: e, modality: "text" },
        },
        "*"
      );
  },
  vt = async (i) => {
    const e = {
      message_type: "conversation",
      event_type: "conversation.interrupt",
      conversation_id: i.conversationId,
      properties: {},
    };
    await i.sendAppMessage(e, "*");
  },
  dr = async (i, e) => {
    try {
      await i.daily.sendAppMessage(
        {
          message_type: "conversation",
          event_type: "conversation.respond",
          conversation_id: i.conversationId,
          properties: { text: e },
        },
        "*"
      );
    } catch (t) {
      console.error("Error while sending text to the avatar", { cause: t });
    }
  },
  tt = {
    STOP: "conversation.user.stopped_speaking",
    START: "conversation.user.started_speaking",
  },
  ne = { PRODUCTION: "production", DEVELOPMENT: "development" },
  G = ne.PRODUCTION,
  mt = "",
  wt = "",
  bt = "";
let M = { current: null },
  J = { current: null };
const Q = document.getElementById("avatarVideo"),
  V = document.getElementById("userVideo"),
  ie = document.querySelector(".avatarContainer"),
  F = document.getElementById("startSession"),
  we = document.getElementById("endSession"),
  ee = document.getElementById("micToggler"),
  oe = document.getElementById("cameraToggler"),
  Ue = document.getElementById("switchInteractionMode"),
  Me = document.getElementById("input-container"),
  le = document.getElementById("userInput"),
  De = document.getElementById("send-btn"),
  rt = document.getElementById("streamingCountdown"),
  Pe = F.getAttribute("chatOnly") === "1",
  hr = F.getAttribute("videoEnable") === "1";
F.getAttribute("timer");
const Le = document.getElementById("avatar_studio_nonce");
let Be;
Le && Le.value ? (Be = Le.value) : (Be = "");
const be = document.getElementsByClassName("language-switcher")[0],
  B = document.getElementById("chatBox"),
  nt = document.querySelector("#listeningIcon"),
  fr = document.getElementById("chatBox-close"),
  Ne = document.querySelector("#transcriptContainer"),
  st = document.querySelector("#voiceTranscript");
document.querySelector("#exportTranscriptToPDF");
let it = document.getElementById("ajaxURL");
const Ce = it ? it?.value : "";
let _e = null,
  Ee = null,
  Z = null;
const pr = () => {
  if (!G.trim()) {
    console.warn("Please specify the Project mode");
    return;
  }
  let i, e, t, r, n, s, o;
  return (
    (e = Ve()),
    (i = F.getAttribute("timer") || 5),
    (n = F.getAttribute("deepgram_key")),
    (t = F.getAttribute("opening_text") || ""),
    (s = F.getAttribute("custom_rag_enable") === "true"),
    {
      timer: i,
      language: e,
      openingText: t,
      customRagUrl: r,
      notifications: o,
      deepgramApiKey: n,
      customRagEnabled: s,
      mode: G,
      tavusApiKey: mt,
      replicaId: bt,
      personaId: wt,
    }
  );
};
let z = pr();
class yr {
  constructor() {
    (this.apiKey = mt),
      (this.personaId = wt),
      (this.replicaId = bt),
      (this.deepgramConnectionActive = !1),
      (this.daily = null),
      (this.transcript = []),
      (this.showChatBox = !1),
      (this.isConnected = !1),
      (this.isConnecting = !1),
      (this.isMicMuted = !1),
      (this.isCameraMuted = !1),
      (this.showTranscript = !1),
      (this.conversationUrl = null),
      (this.conversationId = null),
      (this.isUserSpeaking = !1),
      (this.deepgramToken = ""),
      (this.keepAliveInterval = null),
      (this.speechRecognition = null),
      (this.isListening = !1),
      (this.speechRecognitionSupported =
        "webkitSpeechRecognition" in window || "SpeechRecognition" in window),
      (this.lastProcessedMessageId = null),
      (this.avatarMessagePollingInterval = null),
      (this.timerSeconds = z.timer * 60),
      (this.remainingSeconds = 0),
      (this.timerInterval = null),
      this.initializeButtons(),
      this.updateUIState();
  }
  async checkForNewAvatarMessages() {
    if (this.conversationId)
      try {
        const e = await fetch(
          `https://tavusapi.com/v2/conversations/${this.conversationId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": this.apiKey,
            },
          }
        );
        if (e.ok) {
          const t = await e.json();
          t.messages &&
            t.messages.length > 0 &&
            (t.messages
              .filter((n) =>
                this.lastProcessedMessageId
                  ? n.id > this.lastProcessedMessageId && n.role === "assistant"
                  : n.role === "assistant"
              )
              .forEach((n) => {
                n.content &&
                  (console.log("🤖 AVATAR SPEAKING:", n.content),
                  console.log(
                    `🤖 AVATAR [${new Date().toLocaleTimeString()}]:`,
                    n.content
                  ));
              }),
            t.messages.length > 0 &&
              (this.lastProcessedMessageId = Math.max(
                ...t.messages.map((n) => n.id || 0)
              )));
        }
      } catch (e) {
        console.error("Error checking for avatar messages:", e);
      }
  }
  startTimer(e = 30) {
    this.endTimer(), (this.remainingSeconds = e), this.updateTimerDisplay();
    const t = new Map();
    z.notifications.forEach((r) => {
      const n = e - r.time;
      n >= 0 && t.set(n, r);
    }),
      (this.timerInterval = setInterval(() => {
        if (
          (this.remainingSeconds--,
          this.updateTimerDisplay(),
          t.has(this.remainingSeconds))
        ) {
          const r = t.get(this.remainingSeconds);
          console.log("🔔 Notification Triggered:", {
            message: r.message,
            type: r.type,
            timeTriggered: this.remainingSeconds,
          }),
            vr(r.message, r.type),
            t.delete(this.remainingSeconds);
        }
        this.remainingSeconds <= 0 &&
          (this.endTimer(),
          this.endConversation(),
          this.updateStatus("⏰ Timer ended – conversation time is up!"));
      }, 1e3));
  }
  endTimer() {
    this.timerInterval &&
      (clearInterval(this.timerInterval), (this.timerInterval = null));
  }
  resetTimer() {
    this.endTimer(),
      (this.remainingSeconds = this.timerSeconds),
      this.updateTimerDisplay();
  }
  updateTimerDisplay() {
    if (!rt) return;
    const e = Math.floor(this.remainingSeconds / 60),
      t = this.remainingSeconds % 60;
    rt.textContent = `${e}:${t.toString().padStart(2, "0")}`;
  }
  initializeButtons() {
    F && F.addEventListener("click", () => this.startConversation()),
      we && we.addEventListener("click", () => this.endConversation()),
      ee && ee.addEventListener("click", () => this.toggleMicrophone()),
      oe && oe.addEventListener("click", () => this.toggleCamera());
  }
  updateUIState() {
    ie &&
      (this.isConnecting
        ? (ie.classList.add("loading"),
          ie.classList.remove("streamReady"),
          B.classList.remove(
            "avatarSessionStarted",
            "text_mode",
            "voice_mode",
            "talking"
          ),
          F && (F.disabled = !0),
          be && be.classList.add("hide"))
        : this.isConnected
        ? (ie.classList.remove("loading"),
          ie.classList.add("streamReady"),
          B.classList.add("avatarSessionStarted"),
          Pe
            ? (B.classList.remove("voice_mode"),
              B.classList.add("text_mode"),
              B.classList.add("showTranscript"),
              Ne.style.setProperty("display", "block"),
              (Ue.style.display = "none"))
            : (B.classList.remove("text_mode"),
              B.classList.add("voice_mode"),
              (Ue.style.display = "block")),
          F && (F.disabled = !1),
          this.updateMicButtonState(),
          this.updateCameraButtonState())
        : (ie.classList.remove("loading", "streamReady"),
          B.classList.remove(
            "avatarSessionStarted",
            "text_mode",
            "voice_mode",
            "talking"
          ),
          F && (F.disabled = !1)),
      we && (we.disabled = !this.isConnected));
  }
  appendMessage(e, t) {
    const r = e === "user" ? "right" : "left",
      n = [...this.transcript];
    (this.transcript = [...n, { role: e, speech: t }]),
      st.insertAdjacentHTML(
        "beforeend",
        `<div class="chat-message transcript ${e} ${r}">
        <p>${t}</p>
      </div>`
      );
  }
  updateMicButtonState() {
    const e = document.getElementById("micIcon");
    e &&
      (e.className = this.isMicMuted
        ? "fa-solid fa-microphone-slash"
        : "fa-solid fa-microphone"),
      ee && (ee.style.display = "flex");
  }
  updateCameraButtonState() {
    const e = document.getElementById("cameraIcon");
    e &&
      (e.className = this.isCameraMuted
        ? "fa-solid fa-video-slash"
        : "fa-solid fa-video"),
      V &&
        (this.isCameraMuted
          ? V.classList.add("hide")
          : V.classList.remove("hide")),
      oe && (oe.style.display = "flex");
  }
  async createConversation() {
    try {
      let e;
      if (
        (G === ne.DEVELOPMENT || (G === ne.PRODUCTION && (e = await gr())),
        !e.ok)
      ) {
        const r = await e.json();
        throw new Error(r.error || "Failed to create conversation");
      }
      const t = await e.json();
      return (
        (this.transcript = []),
        (st.innerHTML = ""),
        (this.conversationUrl = t.conversation_url),
        (this.conversationId = t.conversation_id),
        (this.deepgramToken = t.deepgram_token),
        (z.notifications = t.toast_messages),
        console.log("Conversation created:", t),
        fetch(Ce, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            action: "insert_avatar_studio_user",
            provider: "tavus",
            token: t.conversation_id,
          }),
        }),
        t
      );
    } catch (e) {
      throw (
        (console.error("Error creating conversation:", e),
        this.updateStatus(`Error: ${e.message}`, !0),
        e)
      );
    }
  }
  async getFrontCameraDeviceId() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: !0, audio: !0 });
      const t = (await navigator.mediaDevices.enumerateDevices()).filter(
        (n) => n.kind === "videoinput"
      );
      console.log(
        "📹 Available cameras:",
        t.map((n) => ({ id: n.deviceId, label: n.label }))
      );
      let r = t.find((n) => n.label.toLowerCase().includes("front"));
      return (
        r || (r = t.find((n) => n.label.toLowerCase().includes("user"))),
        !r && t.length > 1 && (r = t[1]),
        !r && t.length > 0 && (r = t[0]),
        r
          ? (console.log("✅ Selected front camera:", r.label, r.deviceId),
            r.deviceId)
          : null
      );
    } catch (e) {
      return console.error("❌ Error getting camera devices:", e), null;
    }
  }
  async startConversation() {
    try {
      (this.isConnecting = !0),
        this.updateUIState(),
        await this.createConversation(),
        (this.daily = DailyIframe.createCallObject({
          showLeaveButton: !1,
          showFullscreenButton: !1,
        })),
        this.setupEventListeners();
      const e = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
        t = /Android/i.test(navigator.userAgent);
      if (e)
        if ((console.log("📱 Mobile detected → setting up front camera"), t)) {
          console.log("🤖 Android detected - using enhanced camera selection");
          const r = await this.getFrontCameraDeviceId();
          r
            ? (await this.daily.setInputDevicesAsync({
                videoDeviceId: r,
                audioDeviceId: "default",
              }),
              console.log("✅ Android front camera set with device ID:", r))
            : (await this.daily.setInputDevicesAsync({
                videoDeviceId: { facingMode: "user" },
                audioDeviceId: "default",
              }),
              console.log("✅ Android front camera set with facingMode"));
        } else
          await this.daily.setInputDevicesAsync({
            videoDeviceId: { facingMode: "user" },
            audioDeviceId: "default",
          }),
            console.log("✅ iOS front camera set");
      else
        console.log("💻 Desktop detected → using default devices"),
          await this.daily.setInputDevicesAsync({
            videoDeviceId: "default",
            audioDeviceId: "default",
          });
      if (
        (await this.daily.join({
          url: this.conversationUrl,
          userName: "User",
          startVideoOff: !1,
          startAudioOff: !1,
        }),
        (this.transcript = []),
        console.log("✅ Joined conversation"),
        console.log(),
        z.customRagEnabled)
      ) {
        let r = "";
        this.daily.setLocalAudio(!1),
          G === ne.DEVELOPMENT ||
            (G === ne.PRODUCTION && (r = this.deepgramToken)),
          await mr(this, r);
      }
      this.updateStatus("🔄 Waiting for avatar to join...");
    } catch (e) {
      console.error("Error starting conversation:", e),
        this.updateStatus(`Error: ${e.message}`, !0),
        (this.isConnecting = !1),
        this.updateUIState();
    }
  }
  async cleanupDeepgramConnection() {
    try {
      M.current &&
        (M.current.state === "recording" &&
          (M.current.stop(), console.log("🛑 Media recorder stopped")),
        (M.current = null)),
        J.current &&
          (J.current.finish(),
          (J.current = null),
          console.log("🔌 Deepgram connection closed")),
        (await navigator.mediaDevices.getUserMedia({ audio: !0 }))
          .getTracks()
          .forEach((t) => {
            t.stop(), console.log(`🎙️ Audio track stopped: ${t.kind}`);
          }),
        console.log("✅ Deepgram cleanup completed successfully");
    } catch (e) {
      console.error("❌ Error during Deepgram cleanup:", e);
    }
  }
  async endConversation() {
    try {
      if (
        (this.endTimer(),
        this.resetTimer(),
        z.customRagEnabled &&
          (await this.cleanupDeepgramConnection(),
          this.keepAliveInterval &&
            (clearInterval(this.keepAliveInterval),
            (this.keepAliveInterval = null),
            console.log("💓 Keep-alive cleared")),
          z.customRagEnabled))
      ) {
        if (J.current)
          try {
            J.current.finish(), (J.current = null);
          } catch (e) {
            console.error("Error closing Deepgram connection:", e);
          }
        if (M.current)
          try {
            M.current.stream &&
              M.current.stream.getTracks().forEach((e) => {
                e.stop();
              }),
              (M.current.state === "recording" ||
                M.current.state === "paused") &&
                M.current.stop(),
              (M.current = null);
          } catch (e) {
            console.error("Error stopping recorder:", e);
          }
      }
      this.daily &&
        (await this.daily.leave(), this.daily.destroy(), (this.daily = null)),
        (this.isConnected = !1),
        (this.isConnecting = !1),
        (this.isMicMuted = !1),
        (this.isCameraMuted = !1),
        (this.conversationUrl = null),
        (this.conversationId = null),
        (this.lastProcessedMessageId = null),
        this.updateUIState(),
        this.updateStatus("Conversation ended. Ready to start a new one."),
        Q && (Q.srcObject = null),
        V && ((V.srcObject = null), V.classList.add("hide")),
        (_e = null),
        (Ee = null),
        (Z = null),
        ee && (ee.style.display = "none"),
        oe && (oe.style.display = "none"),
        this.endTimer(),
        be && be.classList.remove("hide");
    } catch (e) {
      console.error("Error ending conversation:", e),
        this.updateStatus(`Error ending conversation: ${e.message}`, !0);
    }
  }
  async toggleMicrophone() {
    this.daily &&
      ((this.isMicMuted = !this.isMicMuted),
      this.isMicMuted && nt && nt.classList.add("hide"),
      z.customRagEnabled
        ? this.isMicMuted
          ? (M.current?.stream &&
              M.current.stream.getAudioTracks().forEach((e) => {
                e.enabled = !1;
              }),
            console.log(
              "🔇 Microphone muted - Deepgram connection stays ACTIVE"
            ))
          : (M.current?.stream &&
              M.current.stream.getAudioTracks().forEach((e) => {
                e.enabled = !0;
              }),
            M.current?.state === "paused" && M.current.resume(),
            console.log("🔊 Microphone unmuted - Deepgram receiving audio"))
        : await this.daily.setLocalAudio(!this.isMicMuted),
      this.updateMicButtonState(),
      this.updateStatus(
        `🎤 Microphone ${this.isMicMuted ? "muted" : "unmuted"}`
      ));
  }
  async toggleCamera() {
    this.daily &&
      ((this.isCameraMuted = !this.isCameraMuted),
      await this.daily.setLocalVideo(!this.isCameraMuted),
      console.log(
        "📹 Camera toggled - Deepgram unaffected (audio-only service)"
      ),
      this.updateCameraButtonState(),
      this.updateStatus(
        `📹 Camera ${this.isCameraMuted ? "turned off" : "turned on"}`
      ));
  }
  async setupUserVideo() {
    try {
      const t = this.daily.participants().local;
      t &&
        t.video &&
        ((Z = t.video.track),
        this.handleUserVideoTrack(Z),
        console.log("✅ User video track setup:", {
          enabled: Z?.enabled,
          muted: Z?.muted,
          readyState: Z?.readyState,
        }));
    } catch (e) {
      console.error("Error setting up user video:", e);
    }
  }
  handleUserVideoTrack(e) {
    if (V && e) {
      const t = new MediaStream([e]);
      (V.srcObject = t),
        (V.muted = !0),
        (V.onloadedmetadata = () => V.play().catch(console.error)),
        console.log("User video track setup complete");
    }
  }
  setupEventListeners() {
    this.daily.on("joined-meeting", async () => {
      (this.isConnected = !0),
        (this.isConnecting = !1),
        this.updateUIState(),
        this.updateStatus("🔄 Waiting for avatar to join...");
      try {
        Pe ||
          (await this.daily.setLocalAudio(!0),
          hr && (await this.daily.setLocalVideo(!0)));
        const t = this.daily.participants().local?.video;
        console.log("📹 Camera status after join:", {
          hasVideo: !!t,
          videoState: t?.state,
          trackEnabled: t?.track?.enabled,
        });
      } catch (e) {
        console.warn("Could not verify media immediately:", e);
      }
      this.setupUserVideo();
    }),
      this.daily.on("participant-joined", async (e) => {
        const t = e.participant;
        !t.local &&
          t.user_id.includes("tavus-replica") &&
          (this.startTimer(this.timerSeconds),
          V && V.classList.remove("hide"),
          this.updateStatus("🤖 Avatar joined the conversation!"),
          console.log("🤖 Avatar joined - checking video feed availability"),
          await He(this.daily, z.openingText));
      }),
      this.daily.on("participant-updated", (e) => {
        const t = e.participant;
        !t.local &&
          t.user_name.includes("Replica") &&
          this.handleAvatarVideoTrack(t),
          t.local &&
            t.video &&
            console.log("📹 Local video updated:", {
              state: t.video.state,
              hasTrack: !!t.video.track,
            });
      }),
      this.daily.on("track-started", (e) => {
        const { participant: t, track: r } = e;
        !t.local && r.kind === "video" && (Ee = r),
          !t.local &&
            r.kind === "audio" &&
            ((_e = r), this.setupAvatarAudioAnalysis(r)),
          Ee && _e && this.handleAvatarVideoTrack(Ee, _e),
          t.local &&
            r.kind === "video" &&
            ((Z = r),
            this.handleUserVideoTrack(r),
            console.log("✅ Local video track started successfully"));
      }),
      this.daily.on("app-message", async (e) => {
        if (
          (e?.data?.event_type === tt.START
            ? (B.classList.add("talking"), (this.isUserSpeaking = !0))
            : e?.data?.event_type === tt.STOP &&
              ((this.isUserSpeaking = !1), B.classList.remove("talking")),
          e?.data?.message_type === "conversation" &&
            e?.data?.properties &&
            e?.data?.properties?.role)
        ) {
          const { role: t, speech: r } = e?.data?.properties;
          r && this.appendMessage(t, r);
        }
      }),
      this.daily.on("participant-left", (e) => {
        e.participant.user_name.includes("Replica") &&
          this.updateStatus("🤖 Avatar left the conversation");
      }),
      this.daily.on("error", (e) => {
        console.error("Daily error:", e),
          this.updateStatus(`Error: ${e.message}`, !0),
          (this.isConnected = !1),
          (this.isConnecting = !1),
          this.updateUIState();
      });
  }
  setupAvatarAudioAnalysis(e) {
    try {
      const t = new (window.AudioContext || window.webkitAudioContext)();
      t.state === "suspended" && t.resume().catch(console.error);
      const r = new MediaStream([e]),
        n = t.createMediaStreamSource(r),
        s = t.createAnalyser();
      (s.fftSize = 256), n.connect(s);
      const o = s.frequencyBinCount,
        c = new Uint8Array(o);
      let f = !1,
        y = null;
      const d = 30,
        g = 300,
        v = () => {
          s.getByteFrequencyData(c);
          const A = c.reduce((T, E) => T + E, 0) / o;
          if (A > d && !f) (f = !0), (y = Date.now());
          else if (A <= d && f) {
            const T = Date.now() - y;
            T > g && console.log(`🤖 AVATAR AUDIO: Finished speaking (${T}ms)`),
              (f = !1),
              (y = null);
          }
          this.isConnected && requestAnimationFrame(v);
        };
      v();
    } catch (t) {
      console.error("Error setting up avatar audio analysis:", t);
    }
  }
  handleAvatarVideoTrack(e, t) {
    if (Q && e) {
      const r = new MediaStream([e, t]);
      (Q.srcObject = r),
        (Q.muted = !1),
        (Q.onloadedmetadata = () => Q.play().catch(console.error)),
        this.updateStatus("🤖 Avatar is ready! You can start talking.");
    }
  }
  updateStatus(e, t = !1) {
    console.log(`Status: ${e}`), t && console.error(`Error: ${e}`);
  }
  toggleTranscriptBox() {
    this.showTranscript = !this.showTranscript;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const i = new yr();
  le.addEventListener("input", (t) => {
    De.disabled = !t.target.value.trim();
  });
  const e = async () => {
    let t = B.classList.contains("text_mode") ? "text_mode" : "voice_mode";
    if (!i.daily) return;
    t === "voice_mode"
      ? (B.classList.remove("voice_mode"),
        B.classList.add("text_mode"),
        B.classList.add("showTranscript"),
        Ne.style.setProperty("display", "block"))
      : (B.classList.remove("text_mode"), B.classList.add("voice_mode"));
    const r = !!B.classList.contains("voice_mode");
    (i.isMicMuted = !r),
      console.log({ isMicMuted: i.isMicMuted }),
      (i.isCameraMuted = !r),
      (ee.disabled = !r),
      z.customRagEnabled
        ? i.isMicMuted
          ? (M.current?.state === "recording" &&
              (M.current.pause(),
              console.log("⏸️  Recorder paused - Switched to TEXT MODE")),
            i.keepAliveInterval && clearInterval(i.keepAliveInterval),
            (i.keepAliveInterval = setInterval(() => {
              try {
                J.current?.getReadyState?.() === 1 &&
                  (J.current.send(JSON.stringify({ type: "KeepAlive" })),
                  console.log("💓 Keep-alive sent (Text Mode)"));
              } catch (n) {
                console.error("❌ Error sending keep-alive:", n);
              }
            }, 2e3)))
          : (M.current?.state === "paused" &&
              (M.current.resume(),
              console.log("▶️  Recorder resumed - Switched to VOICE MODE")),
            i.keepAliveInterval &&
              (clearInterval(i.keepAliveInterval),
              (i.keepAliveInterval = null),
              console.log(
                "💓 Keep-alive stopped - Audio data sustaining connection"
              )))
        : await i.daily.setLocalAudio(r),
      i.updateMicButtonState(),
      i.updateCameraButtonState(),
      i.updateStatus(`🎤 Microphone ${i.isMicMuted ? "muted" : "unmuted"}`),
      (i.showChatBox = !r),
      Ne && (i.showTranscript = !0),
      Me && (Me.classList.toggle("show", !r), Me.classList.toggle("hide", r));
  };
  Ue && !Pe && Ue.addEventListener("click", async () => await e()),
    le.addEventListener("keydown", async (t) => {
      t.key === "Enter" && (await ot(i));
    }),
    De.addEventListener("click", async () => await ot(i)),
    fr.addEventListener("click", () => i.endConversation());
});
async function ot(i) {
  try {
    const e = le.value.trim();
    if (!e) return;
    let t = e;
    if ((await vt(i.daily), z.customRagEnabled)) {
      le.value = "";
      const r = await _t(t, i);
      await He(i?.daily, r);
    } else (le.value = ""), await dr(i, t);
    (t = ""), (De.disabled = !0);
  } catch (e) {
    console.error("Error while working with the sending message", { cause: e });
  }
}
async function gr() {
  return Ce
    ? await fetch(Ce, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "avatar_studio_tavusConversation",
          language: Ve(),
          page_id: pageId ? pageId.value : 0,
          avatar_studio_id: avatarStudioId ? avatarStudioId.value : 0,
        }),
      })
        .then((i) => i)
        .catch(
          (i) => (
            console.error(
              "There was an error while creating converstioan on PRODUCTION!",
              i
            ),
            null
          )
        )
    : null;
}
function Ve() {
  let i = F.getAttribute("language");
  return (
    (i = i && i != "null" ? i : "en"),
    { es: "Spanish", fr: "French", en: "English" }[i] || "English"
  );
}
function vr(i, e = "info") {
  const t = document.getElementById("notification-container"),
    r = document.createElement("div");
  (r.className = `notification ${e}`),
    (r.innerHTML = `
      <span>${i}</span>
      <span class="close-btn">&times;</span>
  `),
    t.appendChild(r),
    setTimeout(() => r.classList.add("show"), 50),
    setTimeout(() => at(r), 5e3),
    r.querySelector(".close-btn").addEventListener("click", () => {
      at(r);
    });
}
function at(i) {
  i.classList.remove("show"), setTimeout(() => i.remove(), 400);
}
const mr = async (i, e = "") => {
    console.log({ manager: i });
    try {
      let t = function (v) {
          if (v === y) return;
          y = v;
          const A = n(v);
          A && ((o = o ? `${o} ${A}` : A), (o = o.trim()));
        },
        r = function () {
          const v = o.trim();
          if (v && v !== f) {
            const A = s(v);
            (f = A),
              (o = ""),
              (y = ""),
              console.log("📝 User finished speaking:", A);
          }
        },
        n = function (v) {
          if (!o) return v;
          const A = v.toLowerCase(),
            T = o.toLowerCase();
          if (T.includes(A)) return "";
          const E = T.split(/\s+/),
            N = A.split(/\s+/),
            m = v.split(/\s+/);
          let b = 0;
          const C = Math.min(E.length, N.length, 10);
          for (let u = 1; u <= C; u++) {
            const l = E.slice(-u).join(" "),
              p = N.slice(0, u).join(" ");
            l === p && (b = u);
          }
          return b > 0 ? m.slice(b).join(" ") : v;
        },
        s = function (v) {
          const T = v
              .replace(/\s+/g, " ")
              .trim()
              .split(/[.!?]+/)
              .filter((m) => m.trim()),
            E = [],
            N = new Set();
          for (const m of T) {
            const b = m.trim().toLowerCase();
            b && !N.has(b) && (N.add(b), E.push(m.trim()));
          }
          return E.join(". ") + (E.length > 0 ? "." : "");
        };
      if (!e) {
        console.error("No token received from backend");
        return;
      }
      if (typeof e != "string" || e.length === 0) {
        console.error("Invalid token format or empty token");
        return;
      }
      let o = "",
        c = null,
        f = "",
        y = "";
      const g = ur({ accessToken: e }).listen.live({
        model: "nova-3",
        interim_results: !0,
        language: "multi",
        endpointing: 1500,
        utterance_end_ms: 1500,
        punctuate: !0,
        smart_format: !0,
      });
      (J.current = g),
        g.on(q.Open, () => {
          console.log("🔗 Deepgram connected successfully"),
            navigator.mediaDevices
              .getUserMedia({ audio: !0 })
              .then((v) => {
                const A = new MediaRecorder(v);
                (M.current = A),
                  A.addEventListener("dataavailable", (T) => {
                    J.current?.getReadyState?.() === 1 &&
                      J.current.send(T.data);
                  }),
                  A.start(250),
                  console.log("🎙️ Recording started");
              })
              .catch((v) => {
                console.error("❌ getUserMedia error:", v),
                  v.name === "NotAllowedError"
                    ? console.error("Microphone permission denied")
                    : v.name === "NotFoundError" &&
                      console.error("No microphone device found");
              }),
            i.keepAliveInterval && clearInterval(i.keepAliveInterval),
            (i.keepAliveInterval = setInterval(() => {
              try {
                J.current?.getReadyState?.() === 1
                  ? (J.current.send(JSON.stringify({ type: "KeepAlive" })),
                    console.log("💓 Keep-alive sent to Deepgram"))
                  : console.warn("⚠️  Connection not ready for keep-alive");
              } catch (v) {
                console.error("❌ Error sending keep-alive:", v);
              }
            }, 3e3));
        }),
        g.on(q.Transcript, async (v) => {
          try {
            const T = v.channel.alternatives?.[0];
            if (!T || T.confidence < 0.8) return;
            const E = T.transcript?.trim(),
              N = v.is_final;
            if (!E) return;
            if (
              (N ||
                (vt(i.daily), console.log("🎤 User speaking (interim):", E)),
              N)
            ) {
              const m = await _t(E, i);
              await He(i.daily, m), t(E);
            }
          } catch (A) {
            console.error("Error processing transcript:", A);
          }
        }),
        g.on(q.UtteranceEnd, () => {
          console.log("🟡 Natural speech pause detected"),
            c && clearTimeout(c),
            (c = setTimeout(() => {
              r(), (c = null);
            }, 500));
        }),
        g.on(q.Error, (v) => {
          console.error("❌ Deepgram error:", {
            message: v.message,
            statusCode: v.statusCode,
            requestId: v.requestId,
            url: v.url,
          }),
            v.statusCode === 401 || v.message?.includes("401")
              ? console.error(
                  "🔐 Authentication failed - token may be invalid or expired"
                )
              : v.statusCode === 403
              ? console.error(
                  "🚫 Permission denied - check Deepgram API key scopes"
                )
              : v.message?.includes("WebSocket") &&
                console.error(
                  "🌐 WebSocket connection failed - check network and token"
                );
        }),
        g.on(q.Close, () => {
          console.log("🔌 Deepgram connection closed"),
            i.keepAliveInterval &&
              (clearInterval(i.keepAliveInterval),
              (i.keepAliveInterval = null),
              console.log("💓 Keep-alive stopped")),
            M.current?.state === "recording" && M.current.stop();
        });
    } catch (t) {
      console.error("❌ Failed to initialize Deepgram:", t),
        console.error(
          "Please check your Deepgram API key and network connection"
        );
    }
  },
  _t = async (i, e) => {
    if (!(!i || !i.trim())) {
      e.appendMessage("user", i);
      try {
        let t, r;
        if (G !== ne.DEVELOPMENT) {
          if (G === ne.PRODUCTION) {
            let n = document.getElementById("avatarStudioId");
            (t = await fetch(Ce, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                query: i,
                action: "askQuestion",
                language: Ve(),
                sessionID: e.conversationId,
                nonce: Be,
                avatarID: n ? n.value : 0,
              }),
            })),
              (r = (await t.json())?.data?.response || "");
          }
        }
        return e.appendMessage("replica", r), r || "";
      } catch (t) {
        return console.error("Error:", t), "";
      }
    }
  };
export { ct as g };
