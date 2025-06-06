var e = Object.defineProperty,
  t = (t, n, i) =>
    ((t, n, i) =>
      n in t
        ? e(t, n, { enumerable: !0, configurable: !0, writable: !0, value: i })
        : (t[n] = i))(t, "symbol" != typeof n ? n + "" : n, i);
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */
const {
  entries: n,
  setPrototypeOf: i,
  isFrozen: o,
  getPrototypeOf: r,
  getOwnPropertyDescriptor: s,
} = Object;
let { freeze: a, seal: l, create: c } = Object,
  { apply: m, construct: d } = "undefined" != typeof Reflect && Reflect;
a ||
  (a = function (e) {
    return e;
  }),
  l ||
    (l = function (e) {
      return e;
    }),
  m ||
    (m = function (e, t, n) {
      return e.apply(t, n);
    }),
  d ||
    (d = function (e, t) {
      return new e(...t);
    });
const p = C(Array.prototype.forEach),
  u = C(Array.prototype.lastIndexOf),
  h = C(Array.prototype.pop),
  g = C(Array.prototype.push),
  f = C(Array.prototype.splice),
  v = C(String.prototype.toLowerCase),
  w = C(String.prototype.toString),
  y = C(String.prototype.match),
  T = C(String.prototype.replace),
  _ = C(String.prototype.indexOf),
  A = C(String.prototype.trim),
  E = C(Object.prototype.hasOwnProperty),
  b = C(RegExp.prototype.test),
  $ =
    ((S = TypeError),
    function () {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
        t[n] = arguments[n];
      return d(S, t);
    });
var S;
function C(e) {
  return function (t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (
      var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), o = 1;
      o < n;
      o++
    )
      i[o - 1] = arguments[o];
    return m(e, t, i);
  };
}
function N(e, t) {
  let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : v;
  i && i(e, null);
  let r = t.length;
  for (; r--; ) {
    let i = t[r];
    if ("string" == typeof i) {
      const e = n(i);
      e !== i && (o(t) || (t[r] = e), (i = e));
    }
    e[i] = !0;
  }
  return e;
}
function x(e) {
  for (let t = 0; t < e.length; t++) {
    E(e, t) || (e[t] = null);
  }
  return e;
}
function k(e) {
  const t = c(null);
  for (const [i, o] of n(e)) {
    E(e, i) &&
      (Array.isArray(o)
        ? (t[i] = x(o))
        : o && "object" == typeof o && o.constructor === Object
          ? (t[i] = k(o))
          : (t[i] = o));
  }
  return t;
}
function M(e, t) {
  for (; null !== e; ) {
    const n = s(e, t);
    if (n) {
      if (n.get) return C(n.get);
      if ("function" == typeof n.value) return C(n.value);
    }
    e = r(e);
  }
  return function () {
    return null;
  };
}
const L = a([
    "a",
    "abbr",
    "acronym",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "bdi",
    "bdo",
    "big",
    "blink",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "content",
    "data",
    "datalist",
    "dd",
    "decorator",
    "del",
    "details",
    "dfn",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "element",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "menuitem",
    "meter",
    "nav",
    "nobr",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "section",
    "select",
    "shadow",
    "small",
    "source",
    "spacer",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "track",
    "tt",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
  ]),
  I = a([
    "svg",
    "a",
    "altglyph",
    "altglyphdef",
    "altglyphitem",
    "animatecolor",
    "animatemotion",
    "animatetransform",
    "circle",
    "clippath",
    "defs",
    "desc",
    "ellipse",
    "filter",
    "font",
    "g",
    "glyph",
    "glyphref",
    "hkern",
    "image",
    "line",
    "lineargradient",
    "marker",
    "mask",
    "metadata",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialgradient",
    "rect",
    "stop",
    "style",
    "switch",
    "symbol",
    "text",
    "textpath",
    "title",
    "tref",
    "tspan",
    "view",
    "vkern",
  ]),
  R = a([
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
  ]),
  D = a([
    "animate",
    "color-profile",
    "cursor",
    "discard",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "foreignobject",
    "hatch",
    "hatchpath",
    "mesh",
    "meshgradient",
    "meshpatch",
    "meshrow",
    "missing-glyph",
    "script",
    "set",
    "solidcolor",
    "unknown",
    "use",
  ]),
  H = a([
    "math",
    "menclose",
    "merror",
    "mfenced",
    "mfrac",
    "mglyph",
    "mi",
    "mlabeledtr",
    "mmultiscripts",
    "mn",
    "mo",
    "mover",
    "mpadded",
    "mphantom",
    "mroot",
    "mrow",
    "ms",
    "mspace",
    "msqrt",
    "mstyle",
    "msub",
    "msup",
    "msubsup",
    "mtable",
    "mtd",
    "mtext",
    "mtr",
    "munder",
    "munderover",
    "mprescripts",
  ]),
  O = a([
    "maction",
    "maligngroup",
    "malignmark",
    "mlongdiv",
    "mscarries",
    "mscarry",
    "msgroup",
    "mstack",
    "msline",
    "msrow",
    "semantics",
    "annotation",
    "annotation-xml",
    "mprescripts",
    "none",
  ]),
  P = a(["#text"]),
  F = a([
    "accept",
    "action",
    "align",
    "alt",
    "autocapitalize",
    "autocomplete",
    "autopictureinpicture",
    "autoplay",
    "background",
    "bgcolor",
    "border",
    "capture",
    "cellpadding",
    "cellspacing",
    "checked",
    "cite",
    "class",
    "clear",
    "color",
    "cols",
    "colspan",
    "controls",
    "controlslist",
    "coords",
    "crossorigin",
    "datetime",
    "decoding",
    "default",
    "dir",
    "disabled",
    "disablepictureinpicture",
    "disableremoteplayback",
    "download",
    "draggable",
    "enctype",
    "enterkeyhint",
    "face",
    "for",
    "headers",
    "height",
    "hidden",
    "high",
    "href",
    "hreflang",
    "id",
    "inputmode",
    "integrity",
    "ismap",
    "kind",
    "label",
    "lang",
    "list",
    "loading",
    "loop",
    "low",
    "max",
    "maxlength",
    "media",
    "method",
    "min",
    "minlength",
    "multiple",
    "muted",
    "name",
    "nonce",
    "noshade",
    "novalidate",
    "nowrap",
    "open",
    "optimum",
    "pattern",
    "placeholder",
    "playsinline",
    "popover",
    "popovertarget",
    "popovertargetaction",
    "poster",
    "preload",
    "pubdate",
    "radiogroup",
    "readonly",
    "rel",
    "required",
    "rev",
    "reversed",
    "role",
    "rows",
    "rowspan",
    "spellcheck",
    "scope",
    "selected",
    "shape",
    "size",
    "sizes",
    "span",
    "srclang",
    "start",
    "src",
    "srcset",
    "step",
    "style",
    "summary",
    "tabindex",
    "title",
    "translate",
    "type",
    "usemap",
    "valign",
    "value",
    "width",
    "wrap",
    "xmlns",
    "slot",
  ]),
  U = a([
    "accent-height",
    "accumulate",
    "additive",
    "alignment-baseline",
    "amplitude",
    "ascent",
    "attributename",
    "attributetype",
    "azimuth",
    "basefrequency",
    "baseline-shift",
    "begin",
    "bias",
    "by",
    "class",
    "clip",
    "clippathunits",
    "clip-path",
    "clip-rule",
    "color",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "cx",
    "cy",
    "d",
    "dx",
    "dy",
    "diffuseconstant",
    "direction",
    "display",
    "divisor",
    "dur",
    "edgemode",
    "elevation",
    "end",
    "exponent",
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "filterunits",
    "flood-color",
    "flood-opacity",
    "font-family",
    "font-size",
    "font-size-adjust",
    "font-stretch",
    "font-style",
    "font-variant",
    "font-weight",
    "fx",
    "fy",
    "g1",
    "g2",
    "glyph-name",
    "glyphref",
    "gradientunits",
    "gradienttransform",
    "height",
    "href",
    "id",
    "image-rendering",
    "in",
    "in2",
    "intercept",
    "k",
    "k1",
    "k2",
    "k3",
    "k4",
    "kerning",
    "keypoints",
    "keysplines",
    "keytimes",
    "lang",
    "lengthadjust",
    "letter-spacing",
    "kernelmatrix",
    "kernelunitlength",
    "lighting-color",
    "local",
    "marker-end",
    "marker-mid",
    "marker-start",
    "markerheight",
    "markerunits",
    "markerwidth",
    "maskcontentunits",
    "maskunits",
    "max",
    "mask",
    "media",
    "method",
    "mode",
    "min",
    "name",
    "numoctaves",
    "offset",
    "operator",
    "opacity",
    "order",
    "orient",
    "orientation",
    "origin",
    "overflow",
    "paint-order",
    "path",
    "pathlength",
    "patterncontentunits",
    "patterntransform",
    "patternunits",
    "points",
    "preservealpha",
    "preserveaspectratio",
    "primitiveunits",
    "r",
    "rx",
    "ry",
    "radius",
    "refx",
    "refy",
    "repeatcount",
    "repeatdur",
    "restart",
    "result",
    "rotate",
    "scale",
    "seed",
    "shape-rendering",
    "slope",
    "specularconstant",
    "specularexponent",
    "spreadmethod",
    "startoffset",
    "stddeviation",
    "stitchtiles",
    "stop-color",
    "stop-opacity",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke",
    "stroke-width",
    "style",
    "surfacescale",
    "systemlanguage",
    "tabindex",
    "tablevalues",
    "targetx",
    "targety",
    "transform",
    "transform-origin",
    "text-anchor",
    "text-decoration",
    "text-rendering",
    "textlength",
    "type",
    "u1",
    "u2",
    "unicode",
    "values",
    "viewbox",
    "visibility",
    "version",
    "vert-adv-y",
    "vert-origin-x",
    "vert-origin-y",
    "width",
    "word-spacing",
    "wrap",
    "writing-mode",
    "xchannelselector",
    "ychannelselector",
    "x",
    "x1",
    "x2",
    "xmlns",
    "y",
    "y1",
    "y2",
    "z",
    "zoomandpan",
  ]),
  B = a([
    "accent",
    "accentunder",
    "align",
    "bevelled",
    "close",
    "columnsalign",
    "columnlines",
    "columnspan",
    "denomalign",
    "depth",
    "dir",
    "display",
    "displaystyle",
    "encoding",
    "fence",
    "frame",
    "height",
    "href",
    "id",
    "largeop",
    "length",
    "linethickness",
    "lspace",
    "lquote",
    "mathbackground",
    "mathcolor",
    "mathsize",
    "mathvariant",
    "maxsize",
    "minsize",
    "movablelimits",
    "notation",
    "numalign",
    "open",
    "rowalign",
    "rowlines",
    "rowspacing",
    "rowspan",
    "rspace",
    "rquote",
    "scriptlevel",
    "scriptminsize",
    "scriptsizemultiplier",
    "selection",
    "separator",
    "separators",
    "stretchy",
    "subscriptshift",
    "supscriptshift",
    "symmetric",
    "voffset",
    "width",
    "xmlns",
  ]),
  z = a(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]),
  G = l(/\{\{[\w\W]*|[\w\W]*\}\}/gm),
  W = l(/<%[\w\W]*|[\w\W]*%>/gm),
  X = l(/\$\{[\w\W]*/gm),
  j = l(/^data-[\-\w.\u00B7-\uFFFF]+$/),
  Y = l(/^aria-[\-\w]+$/),
  q = l(
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  ),
  V = l(/^(?:\w+script|data):/i),
  K = l(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),
  J = l(/^html$/i),
  Z = l(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Q = Object.freeze({
  __proto__: null,
  ARIA_ATTR: Y,
  ATTR_WHITESPACE: K,
  CUSTOM_ELEMENT: Z,
  DATA_ATTR: j,
  DOCTYPE_NAME: J,
  ERB_EXPR: W,
  IS_ALLOWED_URI: q,
  IS_SCRIPT_OR_DATA: V,
  MUSTACHE_EXPR: G,
  TMPLIT_EXPR: X,
});
const ee = 1,
  te = 3,
  ne = 7,
  ie = 8,
  oe = 9;
var re = (function e() {
    let t =
      arguments.length > 0 && void 0 !== arguments[0]
        ? arguments[0]
        : "undefined" == typeof window
          ? null
          : window;
    const i = t => e(t);
    if (
      ((i.version = "3.2.6"),
      (i.removed = []),
      !t || !t.document || t.document.nodeType !== oe || !t.Element)
    )
      return (i.isSupported = !1), i;
    let { document: o } = t;
    const r = o,
      s = r.currentScript,
      {
        DocumentFragment: l,
        HTMLTemplateElement: m,
        Node: d,
        Element: S,
        NodeFilter: C,
        NamedNodeMap: x = t.NamedNodeMap || t.MozNamedAttrMap,
        HTMLFormElement: G,
        DOMParser: W,
        trustedTypes: X,
      } = t,
      j = S.prototype,
      Y = M(j, "cloneNode"),
      V = M(j, "remove"),
      K = M(j, "nextSibling"),
      Z = M(j, "childNodes"),
      re = M(j, "parentNode");
    if ("function" == typeof m) {
      const e = o.createElement("template");
      e.content && e.content.ownerDocument && (o = e.content.ownerDocument);
    }
    let se,
      ae = "";
    const {
        implementation: le,
        createNodeIterator: ce,
        createDocumentFragment: me,
        getElementsByTagName: de,
      } = o,
      { importNode: pe } = r;
    let ue = {
      afterSanitizeAttributes: [],
      afterSanitizeElements: [],
      afterSanitizeShadowDOM: [],
      beforeSanitizeAttributes: [],
      beforeSanitizeElements: [],
      beforeSanitizeShadowDOM: [],
      uponSanitizeAttribute: [],
      uponSanitizeElement: [],
      uponSanitizeShadowNode: [],
    };
    i.isSupported =
      "function" == typeof n &&
      "function" == typeof re &&
      le &&
      void 0 !== le.createHTMLDocument;
    const {
      MUSTACHE_EXPR: he,
      ERB_EXPR: ge,
      TMPLIT_EXPR: fe,
      DATA_ATTR: ve,
      ARIA_ATTR: we,
      IS_SCRIPT_OR_DATA: ye,
      ATTR_WHITESPACE: Te,
      CUSTOM_ELEMENT: _e,
    } = Q;
    let { IS_ALLOWED_URI: Ae } = Q,
      Ee = null;
    const be = N({}, [...L, ...I, ...R, ...H, ...P]);
    let $e = null;
    const Se = N({}, [...F, ...U, ...B, ...z]);
    let Ce = Object.seal(
        c(null, {
          tagNameCheck: {
            writable: !0,
            configurable: !1,
            enumerable: !0,
            value: null,
          },
          attributeNameCheck: {
            writable: !0,
            configurable: !1,
            enumerable: !0,
            value: null,
          },
          allowCustomizedBuiltInElements: {
            writable: !0,
            configurable: !1,
            enumerable: !0,
            value: !1,
          },
        })
      ),
      Ne = null,
      xe = null,
      ke = !0,
      Me = !0,
      Le = !1,
      Ie = !0,
      Re = !1,
      De = !0,
      He = !1,
      Oe = !1,
      Pe = !1,
      Fe = !1,
      Ue = !1,
      Be = !1,
      ze = !0,
      Ge = !1,
      We = !0,
      Xe = !1,
      je = {},
      Ye = null;
    const qe = N({}, [
      "annotation-xml",
      "audio",
      "colgroup",
      "desc",
      "foreignobject",
      "head",
      "iframe",
      "math",
      "mi",
      "mn",
      "mo",
      "ms",
      "mtext",
      "noembed",
      "noframes",
      "noscript",
      "plaintext",
      "script",
      "style",
      "svg",
      "template",
      "thead",
      "title",
      "video",
      "xmp",
    ]);
    let Ve = null;
    const Ke = N({}, ["audio", "video", "img", "source", "image", "track"]);
    let Je = null;
    const Ze = N({}, [
        "alt",
        "class",
        "for",
        "id",
        "label",
        "name",
        "pattern",
        "placeholder",
        "role",
        "summary",
        "title",
        "value",
        "style",
        "xmlns",
      ]),
      Qe = "http://www.w3.org/1998/Math/MathML",
      et = "http://www.w3.org/2000/svg",
      tt = "http://www.w3.org/1999/xhtml";
    let nt = tt,
      it = !1,
      ot = null;
    const rt = N({}, [Qe, et, tt], w);
    let st = N({}, ["mi", "mo", "mn", "ms", "mtext"]),
      at = N({}, ["annotation-xml"]);
    const lt = N({}, ["title", "style", "font", "a", "script"]);
    let ct = null;
    const mt = ["application/xhtml+xml", "text/html"];
    let dt = null,
      pt = null;
    const ut = o.createElement("form"),
      ht = function (e) {
        return e instanceof RegExp || e instanceof Function;
      },
      gt = function () {
        let e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        if (!pt || pt !== e) {
          if (
            ((e && "object" == typeof e) || (e = {}),
            (e = k(e)),
            (ct =
              -1 === mt.indexOf(e.PARSER_MEDIA_TYPE)
                ? "text/html"
                : e.PARSER_MEDIA_TYPE),
            (dt = "application/xhtml+xml" === ct ? w : v),
            (Ee = E(e, "ALLOWED_TAGS") ? N({}, e.ALLOWED_TAGS, dt) : be),
            ($e = E(e, "ALLOWED_ATTR") ? N({}, e.ALLOWED_ATTR, dt) : Se),
            (ot = E(e, "ALLOWED_NAMESPACES")
              ? N({}, e.ALLOWED_NAMESPACES, w)
              : rt),
            (Je = E(e, "ADD_URI_SAFE_ATTR")
              ? N(k(Ze), e.ADD_URI_SAFE_ATTR, dt)
              : Ze),
            (Ve = E(e, "ADD_DATA_URI_TAGS")
              ? N(k(Ke), e.ADD_DATA_URI_TAGS, dt)
              : Ke),
            (Ye = E(e, "FORBID_CONTENTS") ? N({}, e.FORBID_CONTENTS, dt) : qe),
            (Ne = E(e, "FORBID_TAGS") ? N({}, e.FORBID_TAGS, dt) : k({})),
            (xe = E(e, "FORBID_ATTR") ? N({}, e.FORBID_ATTR, dt) : k({})),
            (je = !!E(e, "USE_PROFILES") && e.USE_PROFILES),
            (ke = !1 !== e.ALLOW_ARIA_ATTR),
            (Me = !1 !== e.ALLOW_DATA_ATTR),
            (Le = e.ALLOW_UNKNOWN_PROTOCOLS || !1),
            (Ie = !1 !== e.ALLOW_SELF_CLOSE_IN_ATTR),
            (Re = e.SAFE_FOR_TEMPLATES || !1),
            (De = !1 !== e.SAFE_FOR_XML),
            (He = e.WHOLE_DOCUMENT || !1),
            (Fe = e.RETURN_DOM || !1),
            (Ue = e.RETURN_DOM_FRAGMENT || !1),
            (Be = e.RETURN_TRUSTED_TYPE || !1),
            (Pe = e.FORCE_BODY || !1),
            (ze = !1 !== e.SANITIZE_DOM),
            (Ge = e.SANITIZE_NAMED_PROPS || !1),
            (We = !1 !== e.KEEP_CONTENT),
            (Xe = e.IN_PLACE || !1),
            (Ae = e.ALLOWED_URI_REGEXP || q),
            (nt = e.NAMESPACE || tt),
            (st = e.MATHML_TEXT_INTEGRATION_POINTS || st),
            (at = e.HTML_INTEGRATION_POINTS || at),
            (Ce = e.CUSTOM_ELEMENT_HANDLING || {}),
            e.CUSTOM_ELEMENT_HANDLING &&
              ht(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck) &&
              (Ce.tagNameCheck = e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),
            e.CUSTOM_ELEMENT_HANDLING &&
              ht(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) &&
              (Ce.attributeNameCheck =
                e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),
            e.CUSTOM_ELEMENT_HANDLING &&
              "boolean" ==
                typeof e.CUSTOM_ELEMENT_HANDLING
                  .allowCustomizedBuiltInElements &&
              (Ce.allowCustomizedBuiltInElements =
                e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),
            Re && (Me = !1),
            Ue && (Fe = !0),
            je &&
              ((Ee = N({}, P)),
              ($e = []),
              !0 === je.html && (N(Ee, L), N($e, F)),
              !0 === je.svg && (N(Ee, I), N($e, U), N($e, z)),
              !0 === je.svgFilters && (N(Ee, R), N($e, U), N($e, z)),
              !0 === je.mathMl && (N(Ee, H), N($e, B), N($e, z))),
            e.ADD_TAGS && (Ee === be && (Ee = k(Ee)), N(Ee, e.ADD_TAGS, dt)),
            e.ADD_ATTR && ($e === Se && ($e = k($e)), N($e, e.ADD_ATTR, dt)),
            e.ADD_URI_SAFE_ATTR && N(Je, e.ADD_URI_SAFE_ATTR, dt),
            e.FORBID_CONTENTS &&
              (Ye === qe && (Ye = k(Ye)), N(Ye, e.FORBID_CONTENTS, dt)),
            We && (Ee["#text"] = !0),
            He && N(Ee, ["html", "head", "body"]),
            Ee.table && (N(Ee, ["tbody"]), delete Ne.tbody),
            e.TRUSTED_TYPES_POLICY)
          ) {
            if ("function" != typeof e.TRUSTED_TYPES_POLICY.createHTML)
              throw $(
                'TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.'
              );
            if ("function" != typeof e.TRUSTED_TYPES_POLICY.createScriptURL)
              throw $(
                'TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.'
              );
            (se = e.TRUSTED_TYPES_POLICY), (ae = se.createHTML(""));
          } else
            void 0 === se &&
              (se = (function (e, t) {
                if ("object" != typeof e || "function" != typeof e.createPolicy)
                  return null;
                let n = null;
                const i = "data-tt-policy-suffix";
                t && t.hasAttribute(i) && (n = t.getAttribute(i));
                const o = "dompurify" + (n ? "#" + n : "");
                try {
                  return e.createPolicy(o, {
                    createHTML: e => e,
                    createScriptURL: e => e,
                  });
                } catch (e) {
                  return (
                    console.warn(
                      "TrustedTypes policy " + o + " could not be created."
                    ),
                    null
                  );
                }
              })(X, s)),
              null !== se && "string" == typeof ae && (ae = se.createHTML(""));
          a && a(e), (pt = e);
        }
      },
      ft = N({}, [...I, ...R, ...D]),
      vt = N({}, [...H, ...O]),
      wt = function (e) {
        g(i.removed, { element: e });
        try {
          re(e).removeChild(e);
        } catch (t) {
          V(e);
        }
      },
      yt = function (e, t) {
        try {
          g(i.removed, { attribute: t.getAttributeNode(e), from: t });
        } catch (e) {
          g(i.removed, { attribute: null, from: t });
        }
        if ((t.removeAttribute(e), "is" === e))
          if (Fe || Ue)
            try {
              wt(t);
            } catch (e) {}
          else
            try {
              t.setAttribute(e, "");
            } catch (e) {}
      },
      Tt = function (e) {
        let t = null,
          n = null;
        if (Pe) e = "<remove></remove>" + e;
        else {
          const t = y(e, /^[\r\n\t ]+/);
          n = t && t[0];
        }
        "application/xhtml+xml" === ct &&
          nt === tt &&
          (e =
            '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' +
            e +
            "</body></html>");
        const i = se ? se.createHTML(e) : e;
        if (nt === tt)
          try {
            t = new W().parseFromString(i, ct);
          } catch (e) {}
        if (!t || !t.documentElement) {
          t = le.createDocument(nt, "template", null);
          try {
            t.documentElement.innerHTML = it ? ae : i;
          } catch (e) {}
        }
        const r = t.body || t.documentElement;
        return (
          e &&
            n &&
            r.insertBefore(o.createTextNode(n), r.childNodes[0] || null),
          nt === tt
            ? de.call(t, He ? "html" : "body")[0]
            : He
              ? t.documentElement
              : r
        );
      },
      _t = function (e) {
        return ce.call(
          e.ownerDocument || e,
          e,
          C.SHOW_ELEMENT |
            C.SHOW_COMMENT |
            C.SHOW_TEXT |
            C.SHOW_PROCESSING_INSTRUCTION |
            C.SHOW_CDATA_SECTION,
          null
        );
      },
      At = function (e) {
        return (
          e instanceof G &&
          ("string" != typeof e.nodeName ||
            "string" != typeof e.textContent ||
            "function" != typeof e.removeChild ||
            !(e.attributes instanceof x) ||
            "function" != typeof e.removeAttribute ||
            "function" != typeof e.setAttribute ||
            "string" != typeof e.namespaceURI ||
            "function" != typeof e.insertBefore ||
            "function" != typeof e.hasChildNodes)
        );
      },
      Et = function (e) {
        return "function" == typeof d && e instanceof d;
      };
    function bt(e, t, n) {
      p(e, e => {
        e.call(i, t, n, pt);
      });
    }
    const $t = function (e) {
        let t = null;
        if ((bt(ue.beforeSanitizeElements, e, null), At(e))) return wt(e), !0;
        const n = dt(e.nodeName);
        if (
          (bt(ue.uponSanitizeElement, e, { tagName: n, allowedTags: Ee }),
          De &&
            e.hasChildNodes() &&
            !Et(e.firstElementChild) &&
            b(/<[/\w!]/g, e.innerHTML) &&
            b(/<[/\w!]/g, e.textContent))
        )
          return wt(e), !0;
        if (e.nodeType === ne) return wt(e), !0;
        if (De && e.nodeType === ie && b(/<[/\w]/g, e.data)) return wt(e), !0;
        if (!Ee[n] || Ne[n]) {
          if (!Ne[n] && Ct(n)) {
            if (Ce.tagNameCheck instanceof RegExp && b(Ce.tagNameCheck, n))
              return !1;
            if (Ce.tagNameCheck instanceof Function && Ce.tagNameCheck(n))
              return !1;
          }
          if (We && !Ye[n]) {
            const t = re(e) || e.parentNode,
              n = Z(e) || e.childNodes;
            if (n && t) {
              for (let i = n.length - 1; i >= 0; --i) {
                const o = Y(n[i], !0);
                (o.__removalCount = (e.__removalCount || 0) + 1),
                  t.insertBefore(o, K(e));
              }
            }
          }
          return wt(e), !0;
        }
        return e instanceof S &&
          !(function (e) {
            let t = re(e);
            (t && t.tagName) || (t = { namespaceURI: nt, tagName: "template" });
            const n = v(e.tagName),
              i = v(t.tagName);
            return (
              !!ot[e.namespaceURI] &&
              (e.namespaceURI === et
                ? t.namespaceURI === tt
                  ? "svg" === n
                  : t.namespaceURI === Qe
                    ? "svg" === n && ("annotation-xml" === i || st[i])
                    : Boolean(ft[n])
                : e.namespaceURI === Qe
                  ? t.namespaceURI === tt
                    ? "math" === n
                    : t.namespaceURI === et
                      ? "math" === n && at[i]
                      : Boolean(vt[n])
                  : e.namespaceURI === tt
                    ? !(t.namespaceURI === et && !at[i]) &&
                      !(t.namespaceURI === Qe && !st[i]) &&
                      !vt[n] &&
                      (lt[n] || !ft[n])
                    : !("application/xhtml+xml" !== ct || !ot[e.namespaceURI]))
            );
          })(e)
          ? (wt(e), !0)
          : ("noscript" !== n && "noembed" !== n && "noframes" !== n) ||
              !b(/<\/no(script|embed|frames)/i, e.innerHTML)
            ? (Re &&
                e.nodeType === te &&
                ((t = e.textContent),
                p([he, ge, fe], e => {
                  t = T(t, e, " ");
                }),
                e.textContent !== t &&
                  (g(i.removed, { element: e.cloneNode() }),
                  (e.textContent = t))),
              bt(ue.afterSanitizeElements, e, null),
              !1)
            : (wt(e), !0);
      },
      St = function (e, t, n) {
        if (ze && ("id" === t || "name" === t) && (n in o || n in ut))
          return !1;
        if (Me && !xe[t] && b(ve, t));
        else if (ke && b(we, t));
        else if (!$e[t] || xe[t]) {
          if (
            !(
              (Ct(e) &&
                ((Ce.tagNameCheck instanceof RegExp && b(Ce.tagNameCheck, e)) ||
                  (Ce.tagNameCheck instanceof Function &&
                    Ce.tagNameCheck(e))) &&
                ((Ce.attributeNameCheck instanceof RegExp &&
                  b(Ce.attributeNameCheck, t)) ||
                  (Ce.attributeNameCheck instanceof Function &&
                    Ce.attributeNameCheck(t)))) ||
              ("is" === t &&
                Ce.allowCustomizedBuiltInElements &&
                ((Ce.tagNameCheck instanceof RegExp && b(Ce.tagNameCheck, n)) ||
                  (Ce.tagNameCheck instanceof Function && Ce.tagNameCheck(n))))
            )
          )
            return !1;
        } else if (Je[t]);
        else if (b(Ae, T(n, Te, "")));
        else if (
          ("src" !== t && "xlink:href" !== t && "href" !== t) ||
          "script" === e ||
          0 !== _(n, "data:") ||
          !Ve[e]
        ) {
          if (Le && !b(ye, T(n, Te, "")));
          else if (n) return !1;
        } else;
        return !0;
      },
      Ct = function (e) {
        return "annotation-xml" !== e && y(e, _e);
      },
      Nt = function (e) {
        bt(ue.beforeSanitizeAttributes, e, null);
        const { attributes: t } = e;
        if (!t || At(e)) return;
        const n = {
          attrName: "",
          attrValue: "",
          keepAttr: !0,
          allowedAttributes: $e,
          forceKeepAttr: void 0,
        };
        let o = t.length;
        for (; o--; ) {
          const r = t[o],
            { name: s, namespaceURI: a, value: l } = r,
            c = dt(s),
            m = l;
          let d = "value" === s ? m : A(m);
          if (
            ((n.attrName = c),
            (n.attrValue = d),
            (n.keepAttr = !0),
            (n.forceKeepAttr = void 0),
            bt(ue.uponSanitizeAttribute, e, n),
            (d = n.attrValue),
            !Ge ||
              ("id" !== c && "name" !== c) ||
              (yt(s, e), (d = "user-content-" + d)),
            De && b(/((--!?|])>)|<\/(style|title)/i, d))
          ) {
            yt(s, e);
            continue;
          }
          if (n.forceKeepAttr) continue;
          if (!n.keepAttr) {
            yt(s, e);
            continue;
          }
          if (!Ie && b(/\/>/i, d)) {
            yt(s, e);
            continue;
          }
          Re &&
            p([he, ge, fe], e => {
              d = T(d, e, " ");
            });
          const u = dt(e.nodeName);
          if (St(u, c, d)) {
            if (
              se &&
              "object" == typeof X &&
              "function" == typeof X.getAttributeType
            )
              if (a);
              else
                switch (X.getAttributeType(u, c)) {
                  case "TrustedHTML":
                    d = se.createHTML(d);
                    break;
                  case "TrustedScriptURL":
                    d = se.createScriptURL(d);
                }
            if (d !== m)
              try {
                a ? e.setAttributeNS(a, s, d) : e.setAttribute(s, d),
                  At(e) ? wt(e) : h(i.removed);
              } catch (t) {
                yt(s, e);
              }
          } else yt(s, e);
        }
        bt(ue.afterSanitizeAttributes, e, null);
      },
      xt = function e(t) {
        let n = null;
        const i = _t(t);
        for (bt(ue.beforeSanitizeShadowDOM, t, null); (n = i.nextNode()); )
          bt(ue.uponSanitizeShadowNode, n, null),
            $t(n),
            Nt(n),
            n.content instanceof l && e(n.content);
        bt(ue.afterSanitizeShadowDOM, t, null);
      };
    return (
      (i.sanitize = function (e) {
        let t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = null,
          o = null,
          s = null,
          a = null;
        if (
          ((it = !e), it && (e = "\x3c!--\x3e"), "string" != typeof e && !Et(e))
        ) {
          if ("function" != typeof e.toString)
            throw $("toString is not a function");
          if ("string" != typeof (e = e.toString()))
            throw $("dirty is not a string, aborting");
        }
        if (!i.isSupported) return e;
        if (
          (Oe || gt(t), (i.removed = []), "string" == typeof e && (Xe = !1), Xe)
        ) {
          if (e.nodeName) {
            const t = dt(e.nodeName);
            if (!Ee[t] || Ne[t])
              throw $(
                "root node is forbidden and cannot be sanitized in-place"
              );
          }
        } else if (e instanceof d)
          (n = Tt("\x3c!----\x3e")),
            (o = n.ownerDocument.importNode(e, !0)),
            (o.nodeType === ee && "BODY" === o.nodeName) ||
            "HTML" === o.nodeName
              ? (n = o)
              : n.appendChild(o);
        else {
          if (!Fe && !Re && !He && -1 === e.indexOf("<"))
            return se && Be ? se.createHTML(e) : e;
          if (((n = Tt(e)), !n)) return Fe ? null : Be ? ae : "";
        }
        n && Pe && wt(n.firstChild);
        const c = _t(Xe ? e : n);
        for (; (s = c.nextNode()); )
          $t(s), Nt(s), s.content instanceof l && xt(s.content);
        if (Xe) return e;
        if (Fe) {
          if (Ue)
            for (a = me.call(n.ownerDocument); n.firstChild; )
              a.appendChild(n.firstChild);
          else a = n;
          return (
            ($e.shadowroot || $e.shadowrootmode) && (a = pe.call(r, a, !0)), a
          );
        }
        let m = He ? n.outerHTML : n.innerHTML;
        return (
          He &&
            Ee["!doctype"] &&
            n.ownerDocument &&
            n.ownerDocument.doctype &&
            n.ownerDocument.doctype.name &&
            b(J, n.ownerDocument.doctype.name) &&
            (m = "<!DOCTYPE " + n.ownerDocument.doctype.name + ">\n" + m),
          Re &&
            p([he, ge, fe], e => {
              m = T(m, e, " ");
            }),
          se && Be ? se.createHTML(m) : m
        );
      }),
      (i.setConfig = function () {
        gt(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}),
          (Oe = !0);
      }),
      (i.clearConfig = function () {
        (pt = null), (Oe = !1);
      }),
      (i.isValidAttribute = function (e, t, n) {
        pt || gt({});
        const i = dt(e),
          o = dt(t);
        return St(i, o, n);
      }),
      (i.addHook = function (e, t) {
        "function" == typeof t && g(ue[e], t);
      }),
      (i.removeHook = function (e, t) {
        if (void 0 !== t) {
          const n = u(ue[e], t);
          return -1 === n ? void 0 : f(ue[e], n, 1)[0];
        }
        return h(ue[e]);
      }),
      (i.removeHooks = function (e) {
        ue[e] = [];
      }),
      (i.removeAllHooks = function () {
        ue = {
          afterSanitizeAttributes: [],
          afterSanitizeElements: [],
          afterSanitizeShadowDOM: [],
          beforeSanitizeAttributes: [],
          beforeSanitizeElements: [],
          beforeSanitizeShadowDOM: [],
          uponSanitizeAttribute: [],
          uponSanitizeElement: [],
          uponSanitizeShadowNode: [],
        };
      }),
      i
    );
  })(),
  se = {
    "": ["<em>", "</em>"],
    _: ["<strong>", "</strong>"],
    "*": ["<strong>", "</strong>"],
    "~": ["<s>", "</s>"],
    "\n": ["<br />"],
    " ": ["<br />"],
    "-": ["<hr />"],
  };
function ae(e) {
  return e.replace(RegExp("^" + (e.match(/^(\t| )+/) || "")[0], "gm"), "");
}
function le(e) {
  return (e + "")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function ce(e, t) {
  var n,
    i,
    o,
    r,
    s,
    a =
      /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)/gm,
    l = [],
    c = "",
    m = t || {},
    d = 0;
  function p(e) {
    var t = se[e[1] || ""],
      n = l[l.length - 1] == e;
    return t ? (t[1] ? (n ? l.pop() : l.push(e), t[0 | n]) : t[0]) : e;
  }
  function u() {
    for (var e = ""; l.length; ) e += p(l[l.length - 1]);
    return e;
  }
  for (
    e = e
      .replace(/^\[(.+?)\]:\s*(.+)$/gm, function (e, t, n) {
        return (m[t.toLowerCase()] = n), "";
      })
      .replace(/^\n+|\n+$/g, "");
    (o = a.exec(e));

  )
    (i = e.substring(d, o.index)),
      (d = a.lastIndex),
      (n = o[0]),
      i.match(/[^\\](\\\\)*\\$/) ||
        ((s = o[3] || o[4])
          ? (n =
              '<pre class="code ' +
              (o[4] ? "poetry" : o[2].toLowerCase()) +
              '"><code' +
              (o[2] ? ' class="language-' + o[2].toLowerCase() + '"' : "") +
              ">" +
              ae(le(s).replace(/^\n+|\n+$/g, "")) +
              "</code></pre>")
          : (s = o[6])
            ? (s.match(/\./) && (o[5] = o[5].replace(/^\d+/gm, "")),
              (r = ce(ae(o[5].replace(/^\s*[>*+.-]/gm, "")))),
              ">" == s
                ? (s = "blockquote")
                : ((s = s.match(/\./) ? "ol" : "ul"),
                  (r = r.replace(/^(.*)(\n|$)/gm, "<li>$1</li>"))),
              (n = "<" + s + ">" + r + "</" + s + ">"))
            : o[8]
              ? (n = '<img src="' + le(o[8]) + '" alt="' + le(o[7]) + '">')
              : o[10]
                ? ((c = c.replace(
                    "<a>",
                    '<a href="' + le(o[11] || m[i.toLowerCase()]) + '">'
                  )),
                  (n = u() + "</a>"))
                : o[9]
                  ? (n = "<a>")
                  : o[12] || o[14]
                    ? (n =
                        "<" +
                        (s =
                          "h" + (o[14] ? o[14].length : o[13] > "=" ? 1 : 2)) +
                        ">" +
                        ce(o[12] || o[15], m) +
                        "</" +
                        s +
                        ">")
                    : o[16]
                      ? (n = "<code>" + le(o[16]) + "</code>")
                      : (o[17] || o[1]) && (n = p(o[17] || "--"))),
      (c += i),
      (c += n);
  return (c + e.substring(d) + u()).replace(/^\n+|\n+$/g, "");
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const me = globalThis,
  de = me.trustedTypes,
  pe = de ? de.createPolicy("lit-html", { createHTML: e => e }) : void 0,
  ue = "$lit$",
  he = `lit$${Math.random().toFixed(9).slice(2)}$`,
  ge = "?" + he,
  fe = `<${ge}>`,
  ve = document,
  we = () => ve.createComment(""),
  ye = e => null === e || ("object" != typeof e && "function" != typeof e),
  Te = Array.isArray,
  _e = "[ \t\n\f\r]",
  Ae = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  Ee = /-->/g,
  be = />/g,
  $e = RegExp(
    `>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,
    "g"
  ),
  Se = /'/g,
  Ce = /"/g,
  Ne = /^(?:script|style|textarea|title)$/i,
  xe = ((Re = 1), (e, ...t) => ({ _$litType$: Re, strings: e, values: t })),
  ke = Symbol.for("lit-noChange"),
  Me = Symbol.for("lit-nothing"),
  Le = new WeakMap(),
  Ie = ve.createTreeWalker(ve, 129);
var Re;
function De(e, t) {
  if (!Te(e) || !e.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== pe ? pe.createHTML(t) : t;
}
class He {
  constructor({ strings: e, _$litType$: t }, n) {
    let i;
    this.parts = [];
    let o = 0,
      r = 0;
    const s = e.length - 1,
      a = this.parts,
      [l, c] = ((e, t) => {
        const n = e.length - 1,
          i = [];
        let o,
          r = 2 === t ? "<svg>" : 3 === t ? "<math>" : "",
          s = Ae;
        for (let t = 0; t < n; t++) {
          const n = e[t];
          let a,
            l,
            c = -1,
            m = 0;
          for (
            ;
            m < n.length && ((s.lastIndex = m), (l = s.exec(n)), null !== l);

          )
            (m = s.lastIndex),
              s === Ae
                ? "!--" === l[1]
                  ? (s = Ee)
                  : void 0 !== l[1]
                    ? (s = be)
                    : void 0 !== l[2]
                      ? (Ne.test(l[2]) && (o = RegExp("</" + l[2], "g")),
                        (s = $e))
                      : void 0 !== l[3] && (s = $e)
                : s === $e
                  ? ">" === l[0]
                    ? ((s = o ?? Ae), (c = -1))
                    : void 0 === l[1]
                      ? (c = -2)
                      : ((c = s.lastIndex - l[2].length),
                        (a = l[1]),
                        (s = void 0 === l[3] ? $e : '"' === l[3] ? Ce : Se))
                  : s === Ce || s === Se
                    ? (s = $e)
                    : s === Ee || s === be
                      ? (s = Ae)
                      : ((s = $e), (o = void 0));
          const d = s === $e && e[t + 1].startsWith("/>") ? " " : "";
          r +=
            s === Ae
              ? n + fe
              : c >= 0
                ? (i.push(a), n.slice(0, c) + ue + n.slice(c) + he + d)
                : n + he + (-2 === c ? t : d);
        }
        return [
          De(
            e,
            r +
              (e[n] || "<?>") +
              (2 === t ? "</svg>" : 3 === t ? "</math>" : "")
          ),
          i,
        ];
      })(e, t);
    if (
      ((this.el = He.createElement(l, n)),
      (Ie.currentNode = this.el.content),
      2 === t || 3 === t)
    ) {
      const e = this.el.content.firstChild;
      e.replaceWith(...e.childNodes);
    }
    for (; null !== (i = Ie.nextNode()) && a.length < s; ) {
      if (1 === i.nodeType) {
        if (i.hasAttributes())
          for (const e of i.getAttributeNames())
            if (e.endsWith(ue)) {
              const t = c[r++],
                n = i.getAttribute(e).split(he),
                s = /([.?@])?(.*)/.exec(t);
              a.push({
                type: 1,
                index: o,
                name: s[2],
                strings: n,
                ctor:
                  "." === s[1]
                    ? Be
                    : "?" === s[1]
                      ? ze
                      : "@" === s[1]
                        ? Ge
                        : Ue,
              }),
                i.removeAttribute(e);
            } else
              e.startsWith(he) &&
                (a.push({ type: 6, index: o }), i.removeAttribute(e));
        if (Ne.test(i.tagName)) {
          const e = i.textContent.split(he),
            t = e.length - 1;
          if (t > 0) {
            i.textContent = de ? de.emptyScript : "";
            for (let n = 0; n < t; n++)
              i.append(e[n], we()),
                Ie.nextNode(),
                a.push({ type: 2, index: ++o });
            i.append(e[t], we());
          }
        }
      } else if (8 === i.nodeType)
        if (i.data === ge) a.push({ type: 2, index: o });
        else {
          let e = -1;
          for (; -1 !== (e = i.data.indexOf(he, e + 1)); )
            a.push({ type: 7, index: o }), (e += he.length - 1);
        }
      o++;
    }
  }
  static createElement(e, t) {
    const n = ve.createElement("template");
    return (n.innerHTML = e), n;
  }
}
function Oe(e, t, n = e, i) {
  var o, r;
  if (t === ke) return t;
  let s = void 0 !== i ? (null == (o = n._$Co) ? void 0 : o[i]) : n._$Cl;
  const a = ye(t) ? void 0 : t._$litDirective$;
  return (
    (null == s ? void 0 : s.constructor) !== a &&
      (null == (r = null == s ? void 0 : s._$AO) || r.call(s, !1),
      void 0 === a ? (s = void 0) : ((s = new a(e)), s._$AT(e, n, i)),
      void 0 !== i ? ((n._$Co ?? (n._$Co = []))[i] = s) : (n._$Cl = s)),
    void 0 !== s && (t = Oe(e, s._$AS(e, t.values), s, i)),
    t
  );
}
class Pe {
  constructor(e, t) {
    (this._$AV = []), (this._$AN = void 0), (this._$AD = e), (this._$AM = t);
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const {
        el: { content: t },
        parts: n,
      } = this._$AD,
      i = ((null == e ? void 0 : e.creationScope) ?? ve).importNode(t, !0);
    Ie.currentNode = i;
    let o = Ie.nextNode(),
      r = 0,
      s = 0,
      a = n[0];
    for (; void 0 !== a; ) {
      if (r === a.index) {
        let t;
        2 === a.type
          ? (t = new Fe(o, o.nextSibling, this, e))
          : 1 === a.type
            ? (t = new a.ctor(o, a.name, a.strings, this, e))
            : 6 === a.type && (t = new We(o, this, e)),
          this._$AV.push(t),
          (a = n[++s]);
      }
      r !== (null == a ? void 0 : a.index) && ((o = Ie.nextNode()), r++);
    }
    return (Ie.currentNode = ve), i;
  }
  p(e) {
    let t = 0;
    for (const n of this._$AV)
      void 0 !== n &&
        (void 0 !== n.strings
          ? (n._$AI(e, n, t), (t += n.strings.length - 2))
          : n._$AI(e[t])),
        t++;
  }
}
class Fe {
  get _$AU() {
    var e;
    return (null == (e = this._$AM) ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, n, i) {
    (this.type = 2),
      (this._$AH = Me),
      (this._$AN = void 0),
      (this._$AA = e),
      (this._$AB = t),
      (this._$AM = n),
      (this.options = i),
      (this._$Cv = (null == i ? void 0 : i.isConnected) ?? !0);
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return (
      void 0 !== t &&
        11 === (null == e ? void 0 : e.nodeType) &&
        (e = t.parentNode),
      e
    );
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    (e = Oe(this, e, t)),
      ye(e)
        ? e === Me || null == e || "" === e
          ? (this._$AH !== Me && this._$AR(), (this._$AH = Me))
          : e !== this._$AH && e !== ke && this._(e)
        : void 0 !== e._$litType$
          ? this.$(e)
          : void 0 !== e.nodeType
            ? this.T(e)
            : (e =>
                  Te(e) ||
                  "function" ==
                    typeof (null == e ? void 0 : e[Symbol.iterator]))(e)
              ? this.k(e)
              : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), (this._$AH = this.O(e)));
  }
  _(e) {
    this._$AH !== Me && ye(this._$AH)
      ? (this._$AA.nextSibling.data = e)
      : this.T(ve.createTextNode(e)),
      (this._$AH = e);
  }
  $(e) {
    var t;
    const { values: n, _$litType$: i } = e,
      o =
        "number" == typeof i
          ? this._$AC(e)
          : (void 0 === i.el &&
              (i.el = He.createElement(De(i.h, i.h[0]), this.options)),
            i);
    if ((null == (t = this._$AH) ? void 0 : t._$AD) === o) this._$AH.p(n);
    else {
      const e = new Pe(o, this),
        t = e.u(this.options);
      e.p(n), this.T(t), (this._$AH = e);
    }
  }
  _$AC(e) {
    let t = Le.get(e.strings);
    return void 0 === t && Le.set(e.strings, (t = new He(e))), t;
  }
  k(e) {
    Te(this._$AH) || ((this._$AH = []), this._$AR());
    const t = this._$AH;
    let n,
      i = 0;
    for (const o of e)
      i === t.length
        ? t.push((n = new Fe(this.O(we()), this.O(we()), this, this.options)))
        : (n = t[i]),
        n._$AI(o),
        i++;
    i < t.length && (this._$AR(n && n._$AB.nextSibling, i), (t.length = i));
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var n;
    for (
      null == (n = this._$AP) || n.call(this, !1, !0, t);
      e && e !== this._$AB;

    ) {
      const t = e.nextSibling;
      e.remove(), (e = t);
    }
  }
  setConnected(e) {
    var t;
    void 0 === this._$AM &&
      ((this._$Cv = e), null == (t = this._$AP) || t.call(this, e));
  }
}
class Ue {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, n, i, o) {
    (this.type = 1),
      (this._$AH = Me),
      (this._$AN = void 0),
      (this.element = e),
      (this.name = t),
      (this._$AM = i),
      (this.options = o),
      n.length > 2 || "" !== n[0] || "" !== n[1]
        ? ((this._$AH = Array(n.length - 1).fill(new String())),
          (this.strings = n))
        : (this._$AH = Me);
  }
  _$AI(e, t = this, n, i) {
    const o = this.strings;
    let r = !1;
    if (void 0 === o)
      (e = Oe(this, e, t, 0)),
        (r = !ye(e) || (e !== this._$AH && e !== ke)),
        r && (this._$AH = e);
    else {
      const i = e;
      let s, a;
      for (e = o[0], s = 0; s < o.length - 1; s++)
        (a = Oe(this, i[n + s], t, s)),
          a === ke && (a = this._$AH[s]),
          r || (r = !ye(a) || a !== this._$AH[s]),
          a === Me ? (e = Me) : e !== Me && (e += (a ?? "") + o[s + 1]),
          (this._$AH[s] = a);
    }
    r && !i && this.j(e);
  }
  j(e) {
    e === Me
      ? this.element.removeAttribute(this.name)
      : this.element.setAttribute(this.name, e ?? "");
  }
}
class Be extends Ue {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  j(e) {
    this.element[this.name] = e === Me ? void 0 : e;
  }
}
class ze extends Ue {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== Me);
  }
}
class Ge extends Ue {
  constructor(e, t, n, i, o) {
    super(e, t, n, i, o), (this.type = 5);
  }
  _$AI(e, t = this) {
    if ((e = Oe(this, e, t, 0) ?? Me) === ke) return;
    const n = this._$AH,
      i =
        (e === Me && n !== Me) ||
        e.capture !== n.capture ||
        e.once !== n.once ||
        e.passive !== n.passive,
      o = e !== Me && (n === Me || i);
    i && this.element.removeEventListener(this.name, this, n),
      o && this.element.addEventListener(this.name, this, e),
      (this._$AH = e);
  }
  handleEvent(e) {
    var t;
    "function" == typeof this._$AH
      ? this._$AH.call(
          (null == (t = this.options) ? void 0 : t.host) ?? this.element,
          e
        )
      : this._$AH.handleEvent(e);
  }
}
class We {
  constructor(e, t, n) {
    (this.element = e),
      (this.type = 6),
      (this._$AN = void 0),
      (this._$AM = t),
      (this.options = n);
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Oe(this, e);
  }
}
const Xe = me.litHtmlPolyfillSupport;
null == Xe || Xe(He, Fe),
  (me.litHtmlVersions ?? (me.litHtmlVersions = [])).push("3.3.0");
const je = (e, t, n) => {
    const i = t;
    let o = i._$litPart$;
    if (void 0 === o) {
      const e = null;
      i._$litPart$ = o = new Fe(t.insertBefore(we(), e), e, void 0, {});
    }
    return o._$AI(e), o;
  },
  Ye = 2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ class qe {
  constructor(e) {}
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, n) {
    (this._$Ct = e), (this._$AM = t), (this._$Ci = n);
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ class Ve extends qe {
  constructor(e) {
    if ((super(e), (this.it = Me), e.type !== Ye))
      throw Error(
        this.constructor.directiveName + "() can only be used in child bindings"
      );
  }
  render(e) {
    if (e === Me || null == e) return (this._t = void 0), (this.it = e);
    if (e === ke) return e;
    if ("string" != typeof e)
      throw Error(
        this.constructor.directiveName + "() called with a non-string value"
      );
    if (e === this.it) return this._t;
    this.it = e;
    const t = [e];
    return (
      (t.raw = t),
      (this._t = {
        _$litType$: this.constructor.resultType,
        strings: t,
        values: [],
      })
    );
  }
}
(Ve.directiveName = "unsafeHTML"), (Ve.resultType = 1);
const Ke = (
    e =>
    (...t) => ({ _$litDirective$: e, values: t })
  )(Ve),
  Je = {
    anonymous: "Anonymous",
    replyTo: "Reply to",
    edit: "Edit",
    delete: "Delete",
    reply: "Reply",
    replyingTo: "Replying to: ",
    modified: "Modified on",
    cancelReply: "Cancel",
    editing: "Editing: ",
    cancelEdit: "Cancel",
    updateComment: "Update",
    submitComment: "Submit",
    namePlaceholder: "Name (optional)",
    messagePlaceholder: "Your comment...\nSupports Markdown syntax",
    loading: "Loading...",
    confirmDelete: "Are you sure you want to delete this comment?",
    editFailed: "Failed to edit comment. Permission may have expired.",
    submitFailed: "Failed to submit comment.",
    deleteFailed: "Failed to delete comment. Permission may have expired.",
    nameTooLong: "Name is too long",
    messageTooLong: "Message is too long",
    write: "Write",
    preview: "Preview",
    emptyPreview: "Nothing to preview",
    markdownHelp: "Help",
    commentSystemTitle: "Comments",
    commentSystemDesc:
      'This is a simple comment system. You can post your opinions or respond to other comments. Click "Preview" to see how your comment looks before posting.',
    commentTimeLimit:
      "After posting a comment, you can edit or delete it within two minutes, as long as you don't leave or refresh the page.",
    markdownSyntax: "Syntax",
    markdownBasicSupport:
      "Basic Markdown syntax is supported. HTML is not supported.",
    markdownLinkExample: "[Link](https://www.example.com)",
    markdownImageExample: "![Image](https://www.example.com/sample.jpg)",
    markdownItalicExample: "*Italic* or _Italic_",
    markdownBoldExample: "**Bold** or __Bold__",
    markdownListExample: "- List item",
    markdownOrderedListExample: "1. Ordered list item",
    markdownInlineCodeExample: "`Inline code`",
    markdownCodeBlockExample: "```\nCode block\n```",
  },
  Ze = {
    anonymous: "匿名",
    replyTo: "回覆給",
    edit: "編輯",
    delete: "刪除",
    reply: "回覆",
    modified: "修改於",
    replyingTo: "回覆給：",
    cancelReply: "取消",
    editing: "編輯中：",
    cancelEdit: "取消",
    updateComment: "更新",
    submitComment: "發送",
    namePlaceholder: "暱稱 (選填)",
    messagePlaceholder: "留言內容...\n支援 Markdown 語法",
    loading: "載入中...",
    confirmDelete: "確定要刪除此留言嗎?",
    editFailed: "編輯留言失敗，可能權限已過期",
    submitFailed: "發送留言失敗",
    deleteFailed: "刪除留言失敗，可能權限已過期",
    nameTooLong: "暱稱過長",
    messageTooLong: "留言內容過長",
    write: "編輯",
    preview: "預覽",
    emptyPreview: "沒有內容可供預覽",
    markdownHelp: "說明",
    commentSystemTitle: "留言",
    commentSystemDesc:
      "這是一個簡單的留言系統，你可以發表意見或回應其他留言。發佈前可點擊「預覽」查看留言樣式。",
    commentTimeLimit:
      "發佈留言後，在不離開或重新整理頁面的情況下，你可以編輯或刪除兩分鐘內的留言。",
    markdownSyntax: "語法",
    markdownBasicSupport: "支援基本 Markdown 語法，不支援 HTML。",
    markdownLinkExample: "[連結](https://www.example.com)",
    markdownImageExample: "![圖片](https://www.example.com/sample.jpg)",
    markdownItalicExample: "*斜體* 或 _斜體_",
    markdownBoldExample: "**粗體** 或 __粗體__",
    markdownListExample: "- 清單",
    markdownOrderedListExample: "1. 編號清單",
    markdownInlineCodeExample: "`行內程式碼`",
    markdownCodeBlockExample: "```\n程式碼區塊\n```",
  };
function Qe(e = "wtc-app", t = {}) {
  const n = new tt(e, t);
  return n.renderApp(), n;
}
const et = class e {
  constructor(e, n = {}) {
    t(this, "elementId"),
      t(this, "post"),
      t(this, "apiUrl"),
      t(this, "apiService"),
      t(this, "i18n"),
      t(this, "commentMap", {}),
      t(this, "comments", []),
      t(this, "currentReplyTo", null),
      t(this, "previewText", ""),
      t(this, "previewName", ""),
      t(this, "editingComment", null),
      t(this, "activeTab", "write"),
      t(this, "showMarkdownHelp", !1),
      t(this, "DompurifyConfig", {
        ALLOWED_TAGS: [
          "a",
          "b",
          "i",
          "em",
          "strong",
          "s",
          "p",
          "ul",
          "ol",
          "li",
          "code",
          "pre",
          "blockquote",
          "h6",
          "hr",
          "br",
          "img",
        ],
        ALLOWED_ATTR: ["href", "src", "alt"],
        ALLOW_DATA_ATTR: !1,
        ALLOW_ARIA_ATTR: !1,
      }),
      (this.elementId = e),
      (this.post = n.post || "/blog/my-post"),
      (this.apiUrl = n.apiUrl || "http://localhost:8787/"),
      (this.apiService = (e => {
        const t = new Map(),
          n = (e, n, i) => {
            t.set(e, { timestamp: n, token: i });
            const o = btoa(JSON.stringify({ timestamp: n }));
            sessionStorage.setItem(`comment_auth_${e}`, o);
          },
          i = e => {
            const n = t.get(e);
            return n ? { id: e, ...n } : null;
          },
          o = e => {
            t.delete(e), sessionStorage.removeItem(`comment_auth_${e}`);
          };
        return {
          getComments: async t => {
            const n = new URL("/api/comments", e);
            n.searchParams.append("post", t);
            const i = await fetch(n);
            return await i.json();
          },
          addComment: async (t, i, o, r) => {
            try {
              const s = new URL("/api/comments", e);
              s.searchParams.append("post", t);
              const a = document.querySelector('input[name="website"]'),
                l = a ? a.value : "",
                c = await fetch(s, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: i,
                    msg: o,
                    replyTo: r,
                    website: l,
                  }),
                });
              if (c.ok) {
                const e = await c.json();
                return n(e.id, e.timestamp, e.token), e.id;
              }
              return null;
            } catch (e) {
              return null;
            }
          },
          updateComment: async (t, n, o, r) => {
            const s = i(n);
            if (!s) return !1;
            try {
              const n = new URL("/api/comments", e);
              return (
                n.searchParams.append("post", t),
                (
                  await fetch(n, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: s.id,
                      timestamp: s.timestamp,
                      token: s.token,
                      name: o,
                      msg: r,
                    }),
                  })
                ).ok
              );
            } catch (e) {
              return !1;
            }
          },
          deleteComment: async (t, n) => {
            const r = i(n);
            if (!r) return !1;
            try {
              const i = new URL("/api/comments", e);
              return (
                i.searchParams.append("post", t),
                !!(
                  await fetch(i, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: r.id,
                      timestamp: r.timestamp,
                      token: r.token,
                    }),
                  })
                ).ok && (o(n), !0)
              );
            } catch (e) {
              return !1;
            }
          },
          saveAuthInfo: n,
          getAuthInfo: i,
          removeAuthInfo: o,
          canEditComment: e => !!i(e),
        };
      })(this.apiUrl));
    let i = Je;
    n.language &&
      (i =
        "string" == typeof n.language
          ? "zh-Hant" === n.language
            ? Ze
            : Je
          : n.language),
      (this.i18n = ((e = Je) => {
        let t = e;
        return {
          t: e => t[e],
          setLanguage: e => {
            t = e;
          },
          getLanguage: () => t,
        };
      })(i)),
      this.setupDOMPurify();
  }
  setupDOMPurify() {
    re.addHook("afterSanitizeAttributes", e => {
      "A" === e.tagName &&
        (e.setAttribute("rel", "noopener noreferrer"),
        e.setAttribute("target", "_blank")),
        "IMG" === e.tagName && e.setAttribute("loading", "lazy");
    }),
      re.addHook("uponSanitizeAttribute", (e, t) => {
        if ("href" === t.attrName || "src" === t.attrName)
          try {
            const e = new URL(t.attrValue || "");
            "http:" !== e.protocol &&
              "https:" !== e.protocol &&
              (t.keepAttr = !1);
          } catch (e) {
            t.keepAttr = !1;
          }
      });
  }
  renderMarkdown(e) {
    return Ke(re.sanitize(ce(e || ""), this.DompurifyConfig));
  }
  formatDate(e) {
    const t = new Date(e),
      n = t.getFullYear(),
      i = String(t.getMonth() + 1).padStart(2, "0"),
      o = String(t.getDate()).padStart(2, "0");
    let r = t.getHours();
    const s = String(t.getMinutes()).padStart(2, "0"),
      a = r >= 12 ? "PM" : "AM";
    (r %= 12), 0 === r && (r = 12);
    return `${n}/${i}/${o} ${String(r).padStart(2, "0")}:${s} ${a}`;
  }
  getDisplayName(e) {
    const t = (null == e ? void 0 : e.name)
      ? re.sanitize(e.name, { ALLOWED_TAGS: [] })
      : void 0;
    return t || this.i18n.t("anonymous");
  }
  canEditComment(e) {
    return this.apiService.canEditComment(e);
  }
  saveMyCommentId(t) {
    try {
      const n = this.getMyCommentIds();
      n.includes(t) ||
        (n.push(t), localStorage.setItem(e.MY_COMMENTS_KEY, JSON.stringify(n)));
    } catch (e) {
      console.warn("Failed to save comment ID to localStorage:", e);
    }
  }
  getMyCommentIds() {
    try {
      const t = localStorage.getItem(e.MY_COMMENTS_KEY);
      return t ? JSON.parse(t) : [];
    } catch (e) {
      return (
        console.warn("Failed to get comment IDs from localStorage:", e), []
      );
    }
  }
  isMyComment(e) {
    return this.getMyCommentIds().includes(e);
  }
  async loadComments() {
    return await this.apiService.getComments(this.post);
  }
  renderForm() {
    const e = this.createFormTemplate(),
      t = document.getElementById("comment-form-container");
    t && (je(e, t), this.restoreFormInputs());
  }
  restoreFormInputs() {
    if (this.previewName) {
      const t = document.querySelector('#comment-form input[name="name"]');
      if (t) {
        (t.value = this.previewName),
          this.updateCharCount("name", this.previewName.length);
        const n = document.getElementById("name-char-count");
        n &&
          (this.previewName.length > e.MAX_NAME_LENGTH
            ? n.classList.add("over-limit")
            : n.classList.remove("over-limit"));
      }
    }
    if (this.previewText) {
      const t = document.querySelector(
        '#comment-form textarea[name="message"]'
      );
      if (t) {
        (t.value = this.previewText),
          this.updateCharCount("message", this.previewText.length);
        const n = document.getElementById("message-char-count");
        n &&
          (this.previewText.length > e.MAX_MESSAGE_LENGTH
            ? n.classList.add("over-limit")
            : n.classList.remove("over-limit"));
      }
    }
  }
  createPreviewTemplate() {
    const e = Date.now(),
      t = this.previewName;
    return xe`
      <div class="comment-box preview-mode">
        <div id="preview">
          ${
            this.previewText
              ? xe`
                <div class="preview-comment">
                  <div class="comment-header">
                    <span class="comment-name">${t || this.i18n.t("anonymous")}</span>
                    <span class="comment-time">${this.formatDate(e)}</span>
                    ${
                      this.currentReplyTo &&
                      this.commentMap[this.currentReplyTo]
                        ? xe`<span class="reply-to">
                          ${this.i18n.t("replyTo")}
                          <span>${this.getDisplayName(this.commentMap[this.currentReplyTo])}</span>
                        </span>`
                        : ""
                    }
                  </div>
                  <div class="comment-content">${this.renderMarkdown(this.previewText)}</div>
                </div>
              `
              : xe`<div class="empty-preview">${this.i18n.t("emptyPreview")}</div>`
          }
        </div>
        <div class="comment-footer wtc-flex wtc-gap-xs">
          <span style="flex: 1;"></span>
          <div class="wtc-flex wtc-gap-xs">
            <button
              type="button"
              class="help-btn wtc-clickable wtc-reset-button"
              title="${this.i18n.t("markdownHelp")}"
              @click=${() => this.toggleMarkdownHelp()}
            >
              ?
            </button>
            <button
              type="button"
              class="preview-btn wtc-clickable wtc-transition wtc-transparent-bg active wtc-reset-button"
              @click=${() => this.switchTab("write")}
            >
              ${this.i18n.t("write")}
            </button>
            <button
              type="button"
              class="submit-btn wtc-clickable wtc-transition wtc-reset-button"
              @click=${() => this.handlePreviewSubmit()}
            >
              ${this.editingComment ? this.i18n.t("updateComment") : this.i18n.t("submitComment")}
            </button>
          </div>
        </div>
      </div>

      <div id="markdown-help-modal"></div>
    `;
  }
  renderPreview() {
    if ("preview" === this.activeTab) {
      const e = this.createPreviewTemplate(),
        t = document.getElementById("comment-form-container");
      t && je(e, t);
    } else this.renderForm();
  }
  switchTab(e) {
    (this.activeTab = e),
      "preview" === e
        ? (this.saveCurrentFormInputs(), this.renderPreview())
        : this.renderForm();
  }
  saveCurrentFormInputs() {
    const e = document.querySelector('#comment-form input[name="name"]');
    e && (this.previewName = e.value);
  }
  async renderCommentsList() {
    0 === this.comments.length &&
      ((this.comments = await this.loadComments()), this.buildCommentMap());
    const e = this.createCommentsTemplate(),
      t = document.getElementById("comments-container");
    t && je(e, t);
  }
  buildCommentMap() {
    (this.commentMap = {}),
      this.comments.forEach(e => {
        this.commentMap[e.id] = e;
      });
  }
  createCommentsTemplate() {
    return xe` <div id="comments">${this.processComments(this.comments)}</div> `;
  }
  setReplyTo(e) {
    this.editingComment &&
      ((this.editingComment = null),
      (this.previewText = ""),
      (this.previewName = "")),
      (this.currentReplyTo = e),
      this.renderForm();
    const t = document.querySelector("#comment-form-container");
    t && t.scrollIntoView({ behavior: "smooth" });
  }
  cancelReply() {
    (this.currentReplyTo = null), this.renderForm();
  }
  handleInputChange(t) {
    const n = t.target;
    (this.previewText = n.value),
      this.updateCharCount("message", n.value.length);
    const i = document.getElementById("message-char-count");
    i &&
      (n.value.length > e.MAX_MESSAGE_LENGTH
        ? i.classList.add("over-limit")
        : i.classList.remove("over-limit")),
      "preview" === this.activeTab && this.renderPreview();
  }
  handleNameInputChange(t) {
    const n = t.target;
    (this.previewName = n.value), this.updateCharCount("name", n.value.length);
    const i = document.getElementById("name-char-count");
    i &&
      (n.value.length > e.MAX_NAME_LENGTH
        ? i.classList.add("over-limit")
        : i.classList.remove("over-limit"));
  }
  updateCharCount(e, t) {
    const n = document.getElementById(`${e}-char-count`);
    n && (n.textContent = t.toString());
  }
  createCommentItemTemplate(e, t = !1, n = null, i = null, o = null) {
    const r = this.getCommentCssClasses(t),
      s = this.canEditComment(e.id);
    return xe`
      <div class="${r.item}" ${t ? `data-id="${e.id}"` : ""}>
        ${this.createCommentHeader(e, r, n, s)}
        ${this.createCommentContent(e, r.content)}
        ${this.createCommentActions(e)}
        ${this.createRepliesSection(t, i, o)}
      </div>
    `;
  }
  getCommentCssClasses(e) {
    const t = e ? "comment" : "reply";
    return {
      item: t,
      header: `${t}-header wtc-flex wtc-flex-wrap`,
      name: `${t}-name`,
      time: `${t}-time`,
      content: `${t}-content`,
    };
  }
  createCommentHeader(e, t, n, i) {
    const o = this.isMyComment(e.id);
    return xe`
      <div class="${t.header}">
        <span class="${t.name}" title="${e.id}">
          ${this.getDisplayName(e)}
          ${o ? xe`<span class="my-comment-badge">Me</span>` : ""}
        </span>
        <span
          class="${t.time}"
          title="${e.modDate ? this.formatDate(e.pubDate) : void 0}"
        >
          ${e.modDate ? this.i18n.t("modified") + " " + this.formatDate(e.modDate) : this.formatDate(e.pubDate)}
        </span>
        ${this.createReplyToIndicator(n, e.replyTo)}
        ${this.createCommentControls(i, e)}
      </div>
    `;
  }
  createReplyToIndicator(e, t) {
    return e
      ? xe`<span class="reply-to">
          ${this.i18n.t("replyTo")}
          <span title="${t ?? ""}">${e}</span>
        </span>`
      : "";
  }
  createCommentControls(e, t) {
    return e
      ? xe`<span class="comment-controls wtc-flex wtc-gap-xs">
          <button
            class="edit-button wtc-clickable wtc-transition wtc-transparent-bg wtc-reset-button"
            @click=${() => this.handleEdit(t)}
          >
            ${this.i18n.t("edit")}
          </button>
          <button
            class="delete-button wtc-clickable wtc-transition wtc-transparent-bg wtc-reset-button"
            @click=${() => this.handleDelete(t.id)}
          >
            ${this.i18n.t("delete")}
          </button>
        </span>`
      : "";
  }
  createCommentContent(e, t) {
    return xe`<div class="${t}">${this.renderMarkdown(e.msg)}</div>`;
  }
  createCommentActions(e) {
    return xe`
      <button
        class="reply-button wtc-clickable wtc-transition wtc-transparent-bg wtc-reset-button"
        @click=${() => this.setReplyTo(e.id)}
      >
        ${this.i18n.t("reply")}
      </button>
    `;
  }
  createRepliesSection(e, t, n) {
    return e
      ? xe`<div class="replies">
      ${
        t
          ? t.map(e => {
              const t = e.replyTo && n ? n[e.replyTo] : void 0,
                i = t ? this.getDisplayName(t) : "";
              return this.createCommentItemTemplate(e, !1, i);
            })
          : ""
      }
    </div>`
      : "";
  }
  createCommentTemplate(e, t, n) {
    return this.createCommentItemTemplate(e, !0, null, t, n);
  }
  processComments(e) {
    const t = e.filter(e => !e.replyTo),
      n = {};
    e.forEach(e => {
      e.replyTo && (n[e.replyTo] || (n[e.replyTo] = []), n[e.replyTo].push(e));
    });
    return t.map(e => {
      const t = (e => {
        const t = [],
          i = [...(n[e] || [])];
        for (; i.length > 0; ) {
          const e = i.shift();
          if (e) {
            t.push(e);
            const o = n[e.id] || [];
            i.push(...o);
          }
        }
        return t;
      })(e.id);
      return this.createCommentTemplate(e, t, this.commentMap);
    });
  }
  async handleSubmit(t) {
    t.preventDefault();
    const n = new FormData(t.target),
      i = n.get("name"),
      o = n.get("message");
    if (i && i.length > e.MAX_NAME_LENGTH)
      return void alert(
        `${this.i18n.t("nameTooLong")} (${i.length}/${e.MAX_NAME_LENGTH})`
      );
    if (o.length > e.MAX_MESSAGE_LENGTH)
      return void alert(
        `${this.i18n.t("messageTooLong")} (${o.length}/${e.MAX_MESSAGE_LENGTH})`
      );
    (await this.processSubmission(i, o)) &&
      (this.resetFormState(),
      (this.comments.length = 0),
      await this.renderCommentsList());
  }
  async processSubmission(e, t) {
    if (this.editingComment) {
      const n = await this.apiService.updateComment(
        this.post,
        this.editingComment.id,
        e,
        t
      );
      return n || alert(this.i18n.t("editFailed")), n;
    }
    {
      const n = await this.apiService.addComment(
        this.post,
        e,
        t,
        this.currentReplyTo
      );
      return n
        ? (this.saveMyCommentId(n), !0)
        : (alert(this.i18n.t("submitFailed")), !1);
    }
  }
  resetFormState() {
    const e = document.querySelector("#comment-form");
    e && e.reset(),
      (this.previewText = ""),
      (this.previewName = ""),
      (this.editingComment = null),
      (this.currentReplyTo = null),
      this.updateCharCount("message", 0),
      this.updateCharCount("name", 0);
    const t = document.getElementById("name-char-count"),
      n = document.getElementById("message-char-count");
    t && t.classList.remove("over-limit"),
      n && n.classList.remove("over-limit"),
      this.renderForm(),
      this.renderPreview();
  }
  async handlePreviewSubmit() {
    if (this.previewName && this.previewName.length > e.MAX_NAME_LENGTH)
      return void alert(
        `${this.i18n.t("nameTooLong")} (${this.previewName.length}/${e.MAX_NAME_LENGTH})`
      );
    if (this.previewText.length > e.MAX_MESSAGE_LENGTH)
      return void alert(
        `${this.i18n.t("messageTooLong")} (${this.previewText.length}/${e.MAX_MESSAGE_LENGTH})`
      );
    (await this.processSubmission(this.previewName, this.previewText)) &&
      (this.resetPreviewState(),
      (this.comments.length = 0),
      await this.renderCommentsList());
  }
  resetPreviewState() {
    (this.previewText = ""),
      (this.previewName = ""),
      (this.editingComment = null),
      (this.currentReplyTo = null),
      this.switchTab("write");
    const e = document.querySelector("#comment-form");
    e && e.reset(),
      this.updateCharCount("message", 0),
      this.updateCharCount("name", 0);
    const t = document.getElementById("name-char-count"),
      n = document.getElementById("message-char-count");
    t && t.classList.remove("over-limit"),
      n && n.classList.remove("over-limit");
  }
  async handleDelete(e) {
    if (!confirm(this.i18n.t("confirmDelete"))) return;
    (await this.apiService.deleteComment(this.post, e))
      ? ((this.comments.length = 0), await this.renderCommentsList())
      : alert(this.i18n.t("deleteFailed"));
  }
  handleEdit(e) {
    this.clearReplyState(),
      this.setEditingState(e),
      this.populateFormWithComment(e),
      this.scrollToForm();
  }
  clearReplyState() {
    this.currentReplyTo && (this.currentReplyTo = null);
  }
  setEditingState(e) {
    (this.editingComment = e),
      (this.previewText = e.msg || ""),
      (this.previewName = e.name || "");
  }
  populateFormWithComment(t) {
    const n = document.querySelector('#comment-form input[name="name"]'),
      i = document.querySelector('#comment-form textarea[name="message"]');
    if (n) {
      (n.value = t.name || ""),
        (this.previewName = t.name || ""),
        this.updateCharCount("name", (t.name || "").length);
      const i = document.getElementById("name-char-count");
      i &&
        ((t.name || "").length > e.MAX_NAME_LENGTH
          ? i.classList.add("over-limit")
          : i.classList.remove("over-limit"));
    }
    if (i) {
      (i.value = t.msg || ""),
        (this.previewText = t.msg || ""),
        this.updateCharCount("message", (t.msg || "").length);
      const n = document.getElementById("message-char-count");
      n &&
        ((t.msg || "").length > e.MAX_MESSAGE_LENGTH
          ? n.classList.add("over-limit")
          : n.classList.remove("over-limit"));
    }
    this.renderForm(), this.renderPreview();
  }
  scrollToForm() {
    const e = document.querySelector("#comment-form-container");
    e && e.scrollIntoView({ behavior: "smooth" });
  }
  cancelEdit() {
    (this.editingComment = null),
      this.clearFormAndPreview(),
      this.renderForm(),
      this.renderPreview();
  }
  clearFormAndPreview() {
    const e = document.querySelector("#comment-form");
    e && e.reset(),
      (this.previewText = ""),
      (this.previewName = ""),
      this.updateCharCount("message", 0),
      this.updateCharCount("name", 0);
    const t = document.getElementById("name-char-count"),
      n = document.getElementById("message-char-count");
    t && t.classList.remove("over-limit"),
      n && n.classList.remove("over-limit");
  }
  toggleMarkdownHelp() {
    (this.showMarkdownHelp = !this.showMarkdownHelp), this.renderMarkdownHelp();
  }
  renderMarkdownHelp() {
    const e = document.getElementById("markdown-help-modal");
    e &&
      (this.showMarkdownHelp ? this.showHelpModal(e) : this.hideHelpModal(e));
  }
  showHelpModal(e) {
    je(this.createMarkdownHelpTemplate(), e), e.classList.add("active");
  }
  hideHelpModal(e) {
    je(xe``, e), e.classList.remove("active");
  }
  createMarkdownHelpTemplate() {
    return xe`
      <div class="markdown-help-container wtc-flex">
        <div
          class="markdown-help-backdrop wtc-clickable"
          @click=${() => this.toggleMarkdownHelp()}
        ></div>
        <div class="markdown-help-content">
          <button
            class="markdown-help-close wtc-clickable wtc-reset-button"
            @click=${() => this.toggleMarkdownHelp()}
          >
            ×
          </button>
          <h4>${this.i18n.t("commentSystemTitle")}</h4>
          <p>${this.i18n.t("commentSystemDesc")}</p>
          <p>${this.i18n.t("commentTimeLimit")}</p>
          <p>
            Powered by&nbsp;<a
              href="https://github.com/ziteh/wonton-comment"
              target="_blank"
              rel="noopener noreferrer"
              >Wonton</a
            >
          </p>
          <h4>${this.i18n.t("markdownSyntax")}</h4>
          <p>${this.i18n.t("markdownBasicSupport")}</p>
          <div class="markdown-examples">
            <code>
              <pre>
${this.i18n.t("markdownLinkExample")}

${this.i18n.t("markdownImageExample")}

${this.i18n.t("markdownItalicExample")}

${this.i18n.t("markdownBoldExample")}

${this.i18n.t("markdownListExample")}

${this.i18n.t("markdownOrderedListExample")}

${this.i18n.t("markdownInlineCodeExample")}

${this.i18n.t("markdownCodeBlockExample")}</pre
              >
            </code>
          </div>
        </div>
      </div>
    `;
  }
  createFormTemplate() {
    return xe`
      <div class="comment-box">${this.createFormContent()}</div>
      ${this.createStatusIndicators()}
      <div id="markdown-help-modal"></div>
    `;
  }
  createFormContent() {
    return xe`
      <div id="form-content" class="${"write" === this.activeTab ? "active" : ""}">
        <form
          id="comment-form"
          class="wtc-reset-form"
          @submit=${e => this.handleSubmit(e)}
        >
          <div class="honeypot-field">
            <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
          </div>
          ${this.createTextareaSection()} ${this.createFormFooter()}
        </form>
      </div>
    `;
  }
  createTextareaSection() {
    return xe`
      <div class="comment-input">
        <textarea
          name="message"
          placeholder="${this.i18n.t("messagePlaceholder")}"
          maxlength="${e.MAX_MESSAGE_LENGTH}"
          required
          @input=${e => this.handleInputChange(e)}
        ></textarea>
        <div class="char-count">
          <span id="message-char-count">0</span>/${e.MAX_MESSAGE_LENGTH}
        </div>
      </div>
    `;
  }
  createFormFooter() {
    return xe`
      <div class="comment-footer wtc-flex wtc-flex-wrap wtc-gap-xs">
        <div class="name-input-container">
          <input
            type="text"
            name="name"
            placeholder="${this.i18n.t("namePlaceholder")}"
            maxlength="${e.MAX_NAME_LENGTH}"
            @input=${e => this.handleNameInputChange(e)}
          />
        </div>
        <div class="wtc-flex wtc-gap-xs">${this.createFormButtons()}</div>
      </div>
    `;
  }
  createFormButtons() {
    return xe`
      <button
        type="button"
        class="help-btn wtc-clickable wtc-reset-button"
        title="${this.i18n.t("markdownHelp")}"
        @click=${() => this.toggleMarkdownHelp()}
      >
        ?
      </button>
      <button
        type="button"
        class="preview-btn wtc-clickable wtc-transition wtc-transparent-bg wtc-reset-button ${"preview" === this.activeTab ? "active" : ""}"
        @click=${() => this.switchTab("preview" === this.activeTab ? "write" : "preview")}
      >
        ${"preview" === this.activeTab ? this.i18n.t("write") : this.i18n.t("preview")}
      </button>
      <button type="submit" class="submit-btn wtc-clickable wtc-transition wtc-reset-button">
        ${this.editingComment ? this.i18n.t("updateComment") : this.i18n.t("submitComment")}
      </button>
    `;
  }
  createStatusIndicators() {
    const e = this.createReplyIndicator(),
      t = this.createEditIndicator();
    return e || t ? xe`${e}${t}` : "";
  }
  createReplyIndicator() {
    return this.currentReplyTo && this.commentMap[this.currentReplyTo]
      ? xe`<div class="info wtc-flex wtc-gap-md">
          ${this.i18n.t("replyingTo")}
          ${this.getDisplayName(this.commentMap[this.currentReplyTo])}<button
            type="button"
            class="cancel-link wtc-clickable wtc-transition wtc-reset-button"
            @click=${() => this.cancelReply()}
          >
            ${this.i18n.t("cancelReply")}
          </button>
        </div>`
      : "";
  }
  createEditIndicator() {
    return this.editingComment
      ? xe`<div class="info wtc-flex wtc-gap-md">
          ${this.i18n.t("editing")} ${this.editingComment.id}<button
            type="button"
            class="cancel-link wtc-clickable wtc-transition wtc-reset-button"
            @click=${() => this.cancelEdit()}
          >
            ${this.i18n.t("cancelEdit")}
          </button>
        </div>`
      : "";
  }
  async renderApp() {
    const e = xe`
      <div class="wtc-container">
        <div id="comment-form-container"></div>
        <div id="comments-container"></div>
      </div>
    `,
      t = document.getElementById(this.elementId);
    t &&
      (je(e, t),
      this.renderForm(),
      await this.renderCommentsList(),
      this.renderMarkdownHelp());
  }
  async refresh() {
    (this.comments = []), await this.renderCommentsList();
  }
};
t(et, "MAX_NAME_LENGTH", 25),
  t(et, "MAX_MESSAGE_LENGTH", 1e3),
  t(et, "MY_COMMENTS_KEY", "wtc_my_comments");
let tt = et;
export { Qe as default, Qe as initWontonComment };
//# sourceMappingURL=wonton-comment.es.js.map
