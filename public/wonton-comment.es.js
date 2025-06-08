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
  getPrototypeOf: a,
  getOwnPropertyDescriptor: r,
} = Object;
let { freeze: s, seal: l, create: c } = Object,
  { apply: m, construct: d } = "undefined" != typeof Reflect && Reflect;
s ||
  (s = function (e) {
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
const u = $(Array.prototype.forEach),
  p = $(Array.prototype.lastIndexOf),
  h = $(Array.prototype.pop),
  g = $(Array.prototype.push),
  f = $(Array.prototype.splice),
  y = $(String.prototype.toLowerCase),
  v = $(String.prototype.toString),
  w = $(String.prototype.match),
  A = $(String.prototype.replace),
  b = $(String.prototype.indexOf),
  T = $(String.prototype.trim),
  _ = $(Object.prototype.hasOwnProperty),
  S = $(RegExp.prototype.test),
  C =
    ((E = TypeError),
    function () {
      for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
        t[n] = arguments[n];
      return d(E, t);
    });
var E;
function $(e) {
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
  let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : y;
  i && i(e, null);
  let a = t.length;
  for (; a--; ) {
    let i = t[a];
    if ("string" == typeof i) {
      const e = n(i);
      e !== i && (o(t) || (t[a] = e), (i = e));
    }
    e[i] = !0;
  }
  return e;
}
function k(e) {
  for (let t = 0; t < e.length; t++) {
    _(e, t) || (e[t] = null);
  }
  return e;
}
function M(e) {
  const t = c(null);
  for (const [i, o] of n(e)) {
    _(e, i) &&
      (Array.isArray(o)
        ? (t[i] = k(o))
        : o && "object" == typeof o && o.constructor === Object
          ? (t[i] = M(o))
          : (t[i] = o));
  }
  return t;
}
function L(e, t) {
  for (; null !== e; ) {
    const n = r(e, t);
    if (n) {
      if (n.get) return $(n.get);
      if ("function" == typeof n.value) return $(n.value);
    }
    e = a(e);
  }
  return function () {
    return null;
  };
}
const x = s([
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
  R = s([
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
  P = s([
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
  I = s([
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
  D = s([
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
  H = s([
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
  O = s(["#text"]),
  B = s([
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
  F = s([
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
  G = s([
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
  U = s(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]),
  z = l(/\{\{[\w\W]*|[\w\W]*\}\}/gm),
  W = l(/<%[\w\W]*|[\w\W]*%>/gm),
  j = l(/\$\{[\w\W]*/gm),
  q = l(/^data-[\-\w.\u00B7-\uFFFF]+$/),
  Y = l(/^aria-[\-\w]+$/),
  X = l(
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  ),
  V = l(/^(?:\w+script|data):/i),
  J = l(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),
  K = l(/^html$/i),
  Z = l(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Q = Object.freeze({
  __proto__: null,
  ARIA_ATTR: Y,
  ATTR_WHITESPACE: J,
  CUSTOM_ELEMENT: Z,
  DATA_ATTR: q,
  DOCTYPE_NAME: K,
  ERB_EXPR: W,
  IS_ALLOWED_URI: X,
  IS_SCRIPT_OR_DATA: V,
  MUSTACHE_EXPR: z,
  TMPLIT_EXPR: j,
});
const ee = 1,
  te = 3,
  ne = 7,
  ie = 8,
  oe = 9;
var ae = (function e() {
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
    const a = o,
      r = a.currentScript,
      {
        DocumentFragment: l,
        HTMLTemplateElement: m,
        Node: d,
        Element: E,
        NodeFilter: $,
        NamedNodeMap: k = t.NamedNodeMap || t.MozNamedAttrMap,
        HTMLFormElement: z,
        DOMParser: W,
        trustedTypes: j,
      } = t,
      q = E.prototype,
      Y = L(q, "cloneNode"),
      V = L(q, "remove"),
      J = L(q, "nextSibling"),
      Z = L(q, "childNodes"),
      ae = L(q, "parentNode");
    if ("function" == typeof m) {
      const e = o.createElement("template");
      e.content && e.content.ownerDocument && (o = e.content.ownerDocument);
    }
    let re,
      se = "";
    const {
        implementation: le,
        createNodeIterator: ce,
        createDocumentFragment: me,
        getElementsByTagName: de,
      } = o,
      { importNode: ue } = a;
    let pe = {
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
      "function" == typeof ae &&
      le &&
      void 0 !== le.createHTMLDocument;
    const {
      MUSTACHE_EXPR: he,
      ERB_EXPR: ge,
      TMPLIT_EXPR: fe,
      DATA_ATTR: ye,
      ARIA_ATTR: ve,
      IS_SCRIPT_OR_DATA: we,
      ATTR_WHITESPACE: Ae,
      CUSTOM_ELEMENT: be,
    } = Q;
    let { IS_ALLOWED_URI: Te } = Q,
      _e = null;
    const Se = N({}, [...x, ...R, ...P, ...D, ...O]);
    let Ce = null;
    const Ee = N({}, [...B, ...F, ...G, ...U]);
    let $e = Object.seal(
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
      ke = null,
      Me = !0,
      Le = !0,
      xe = !1,
      Re = !0,
      Pe = !1,
      Ie = !0,
      De = !1,
      He = !1,
      Oe = !1,
      Be = !1,
      Fe = !1,
      Ge = !1,
      Ue = !0,
      ze = !1,
      We = !0,
      je = !1,
      qe = {},
      Ye = null;
    const Xe = N({}, [
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
    const Je = N({}, ["audio", "video", "img", "source", "image", "track"]);
    let Ke = null;
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
    const at = N({}, [Qe, et, tt], v);
    let rt = N({}, ["mi", "mo", "mn", "ms", "mtext"]),
      st = N({}, ["annotation-xml"]);
    const lt = N({}, ["title", "style", "font", "a", "script"]);
    let ct = null;
    const mt = ["application/xhtml+xml", "text/html"];
    let dt = null,
      ut = null;
    const pt = o.createElement("form"),
      ht = function (e) {
        return e instanceof RegExp || e instanceof Function;
      },
      gt = function () {
        let e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        if (!ut || ut !== e) {
          if (
            ((e && "object" == typeof e) || (e = {}),
            (e = M(e)),
            (ct =
              -1 === mt.indexOf(e.PARSER_MEDIA_TYPE)
                ? "text/html"
                : e.PARSER_MEDIA_TYPE),
            (dt = "application/xhtml+xml" === ct ? v : y),
            (_e = _(e, "ALLOWED_TAGS") ? N({}, e.ALLOWED_TAGS, dt) : Se),
            (Ce = _(e, "ALLOWED_ATTR") ? N({}, e.ALLOWED_ATTR, dt) : Ee),
            (ot = _(e, "ALLOWED_NAMESPACES")
              ? N({}, e.ALLOWED_NAMESPACES, v)
              : at),
            (Ke = _(e, "ADD_URI_SAFE_ATTR")
              ? N(M(Ze), e.ADD_URI_SAFE_ATTR, dt)
              : Ze),
            (Ve = _(e, "ADD_DATA_URI_TAGS")
              ? N(M(Je), e.ADD_DATA_URI_TAGS, dt)
              : Je),
            (Ye = _(e, "FORBID_CONTENTS") ? N({}, e.FORBID_CONTENTS, dt) : Xe),
            (Ne = _(e, "FORBID_TAGS") ? N({}, e.FORBID_TAGS, dt) : M({})),
            (ke = _(e, "FORBID_ATTR") ? N({}, e.FORBID_ATTR, dt) : M({})),
            (qe = !!_(e, "USE_PROFILES") && e.USE_PROFILES),
            (Me = !1 !== e.ALLOW_ARIA_ATTR),
            (Le = !1 !== e.ALLOW_DATA_ATTR),
            (xe = e.ALLOW_UNKNOWN_PROTOCOLS || !1),
            (Re = !1 !== e.ALLOW_SELF_CLOSE_IN_ATTR),
            (Pe = e.SAFE_FOR_TEMPLATES || !1),
            (Ie = !1 !== e.SAFE_FOR_XML),
            (De = e.WHOLE_DOCUMENT || !1),
            (Be = e.RETURN_DOM || !1),
            (Fe = e.RETURN_DOM_FRAGMENT || !1),
            (Ge = e.RETURN_TRUSTED_TYPE || !1),
            (Oe = e.FORCE_BODY || !1),
            (Ue = !1 !== e.SANITIZE_DOM),
            (ze = e.SANITIZE_NAMED_PROPS || !1),
            (We = !1 !== e.KEEP_CONTENT),
            (je = e.IN_PLACE || !1),
            (Te = e.ALLOWED_URI_REGEXP || X),
            (nt = e.NAMESPACE || tt),
            (rt = e.MATHML_TEXT_INTEGRATION_POINTS || rt),
            (st = e.HTML_INTEGRATION_POINTS || st),
            ($e = e.CUSTOM_ELEMENT_HANDLING || {}),
            e.CUSTOM_ELEMENT_HANDLING &&
              ht(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck) &&
              ($e.tagNameCheck = e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),
            e.CUSTOM_ELEMENT_HANDLING &&
              ht(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) &&
              ($e.attributeNameCheck =
                e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),
            e.CUSTOM_ELEMENT_HANDLING &&
              "boolean" ==
                typeof e.CUSTOM_ELEMENT_HANDLING
                  .allowCustomizedBuiltInElements &&
              ($e.allowCustomizedBuiltInElements =
                e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),
            Pe && (Le = !1),
            Fe && (Be = !0),
            qe &&
              ((_e = N({}, O)),
              (Ce = []),
              !0 === qe.html && (N(_e, x), N(Ce, B)),
              !0 === qe.svg && (N(_e, R), N(Ce, F), N(Ce, U)),
              !0 === qe.svgFilters && (N(_e, P), N(Ce, F), N(Ce, U)),
              !0 === qe.mathMl && (N(_e, D), N(Ce, G), N(Ce, U))),
            e.ADD_TAGS && (_e === Se && (_e = M(_e)), N(_e, e.ADD_TAGS, dt)),
            e.ADD_ATTR && (Ce === Ee && (Ce = M(Ce)), N(Ce, e.ADD_ATTR, dt)),
            e.ADD_URI_SAFE_ATTR && N(Ke, e.ADD_URI_SAFE_ATTR, dt),
            e.FORBID_CONTENTS &&
              (Ye === Xe && (Ye = M(Ye)), N(Ye, e.FORBID_CONTENTS, dt)),
            We && (_e["#text"] = !0),
            De && N(_e, ["html", "head", "body"]),
            _e.table && (N(_e, ["tbody"]), delete Ne.tbody),
            e.TRUSTED_TYPES_POLICY)
          ) {
            if ("function" != typeof e.TRUSTED_TYPES_POLICY.createHTML)
              throw C(
                'TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.'
              );
            if ("function" != typeof e.TRUSTED_TYPES_POLICY.createScriptURL)
              throw C(
                'TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.'
              );
            (re = e.TRUSTED_TYPES_POLICY), (se = re.createHTML(""));
          } else
            void 0 === re &&
              (re = (function (e, t) {
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
              })(j, r)),
              null !== re && "string" == typeof se && (se = re.createHTML(""));
          s && s(e), (ut = e);
        }
      },
      ft = N({}, [...R, ...P, ...I]),
      yt = N({}, [...D, ...H]),
      vt = function (e) {
        g(i.removed, { element: e });
        try {
          ae(e).removeChild(e);
        } catch (t) {
          V(e);
        }
      },
      wt = function (e, t) {
        try {
          g(i.removed, { attribute: t.getAttributeNode(e), from: t });
        } catch (e) {
          g(i.removed, { attribute: null, from: t });
        }
        if ((t.removeAttribute(e), "is" === e))
          if (Be || Fe)
            try {
              vt(t);
            } catch (e) {}
          else
            try {
              t.setAttribute(e, "");
            } catch (e) {}
      },
      At = function (e) {
        let t = null,
          n = null;
        if (Oe) e = "<remove></remove>" + e;
        else {
          const t = w(e, /^[\r\n\t ]+/);
          n = t && t[0];
        }
        "application/xhtml+xml" === ct &&
          nt === tt &&
          (e =
            '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' +
            e +
            "</body></html>");
        const i = re ? re.createHTML(e) : e;
        if (nt === tt)
          try {
            t = new W().parseFromString(i, ct);
          } catch (e) {}
        if (!t || !t.documentElement) {
          t = le.createDocument(nt, "template", null);
          try {
            t.documentElement.innerHTML = it ? se : i;
          } catch (e) {}
        }
        const a = t.body || t.documentElement;
        return (
          e &&
            n &&
            a.insertBefore(o.createTextNode(n), a.childNodes[0] || null),
          nt === tt
            ? de.call(t, De ? "html" : "body")[0]
            : De
              ? t.documentElement
              : a
        );
      },
      bt = function (e) {
        return ce.call(
          e.ownerDocument || e,
          e,
          $.SHOW_ELEMENT |
            $.SHOW_COMMENT |
            $.SHOW_TEXT |
            $.SHOW_PROCESSING_INSTRUCTION |
            $.SHOW_CDATA_SECTION,
          null
        );
      },
      Tt = function (e) {
        return (
          e instanceof z &&
          ("string" != typeof e.nodeName ||
            "string" != typeof e.textContent ||
            "function" != typeof e.removeChild ||
            !(e.attributes instanceof k) ||
            "function" != typeof e.removeAttribute ||
            "function" != typeof e.setAttribute ||
            "string" != typeof e.namespaceURI ||
            "function" != typeof e.insertBefore ||
            "function" != typeof e.hasChildNodes)
        );
      },
      _t = function (e) {
        return "function" == typeof d && e instanceof d;
      };
    function St(e, t, n) {
      u(e, e => {
        e.call(i, t, n, ut);
      });
    }
    const Ct = function (e) {
        let t = null;
        if ((St(pe.beforeSanitizeElements, e, null), Tt(e))) return vt(e), !0;
        const n = dt(e.nodeName);
        if (
          (St(pe.uponSanitizeElement, e, { tagName: n, allowedTags: _e }),
          Ie &&
            e.hasChildNodes() &&
            !_t(e.firstElementChild) &&
            S(/<[/\w!]/g, e.innerHTML) &&
            S(/<[/\w!]/g, e.textContent))
        )
          return vt(e), !0;
        if (e.nodeType === ne) return vt(e), !0;
        if (Ie && e.nodeType === ie && S(/<[/\w]/g, e.data)) return vt(e), !0;
        if (!_e[n] || Ne[n]) {
          if (!Ne[n] && $t(n)) {
            if ($e.tagNameCheck instanceof RegExp && S($e.tagNameCheck, n))
              return !1;
            if ($e.tagNameCheck instanceof Function && $e.tagNameCheck(n))
              return !1;
          }
          if (We && !Ye[n]) {
            const t = ae(e) || e.parentNode,
              n = Z(e) || e.childNodes;
            if (n && t) {
              for (let i = n.length - 1; i >= 0; --i) {
                const o = Y(n[i], !0);
                (o.__removalCount = (e.__removalCount || 0) + 1),
                  t.insertBefore(o, J(e));
              }
            }
          }
          return vt(e), !0;
        }
        return e instanceof E &&
          !(function (e) {
            let t = ae(e);
            (t && t.tagName) || (t = { namespaceURI: nt, tagName: "template" });
            const n = y(e.tagName),
              i = y(t.tagName);
            return (
              !!ot[e.namespaceURI] &&
              (e.namespaceURI === et
                ? t.namespaceURI === tt
                  ? "svg" === n
                  : t.namespaceURI === Qe
                    ? "svg" === n && ("annotation-xml" === i || rt[i])
                    : Boolean(ft[n])
                : e.namespaceURI === Qe
                  ? t.namespaceURI === tt
                    ? "math" === n
                    : t.namespaceURI === et
                      ? "math" === n && st[i]
                      : Boolean(yt[n])
                  : e.namespaceURI === tt
                    ? !(t.namespaceURI === et && !st[i]) &&
                      !(t.namespaceURI === Qe && !rt[i]) &&
                      !yt[n] &&
                      (lt[n] || !ft[n])
                    : !("application/xhtml+xml" !== ct || !ot[e.namespaceURI]))
            );
          })(e)
          ? (vt(e), !0)
          : ("noscript" !== n && "noembed" !== n && "noframes" !== n) ||
              !S(/<\/no(script|embed|frames)/i, e.innerHTML)
            ? (Pe &&
                e.nodeType === te &&
                ((t = e.textContent),
                u([he, ge, fe], e => {
                  t = A(t, e, " ");
                }),
                e.textContent !== t &&
                  (g(i.removed, { element: e.cloneNode() }),
                  (e.textContent = t))),
              St(pe.afterSanitizeElements, e, null),
              !1)
            : (vt(e), !0);
      },
      Et = function (e, t, n) {
        if (Ue && ("id" === t || "name" === t) && (n in o || n in pt))
          return !1;
        if (Le && !ke[t] && S(ye, t));
        else if (Me && S(ve, t));
        else if (!Ce[t] || ke[t]) {
          if (
            !(
              ($t(e) &&
                (($e.tagNameCheck instanceof RegExp && S($e.tagNameCheck, e)) ||
                  ($e.tagNameCheck instanceof Function &&
                    $e.tagNameCheck(e))) &&
                (($e.attributeNameCheck instanceof RegExp &&
                  S($e.attributeNameCheck, t)) ||
                  ($e.attributeNameCheck instanceof Function &&
                    $e.attributeNameCheck(t)))) ||
              ("is" === t &&
                $e.allowCustomizedBuiltInElements &&
                (($e.tagNameCheck instanceof RegExp && S($e.tagNameCheck, n)) ||
                  ($e.tagNameCheck instanceof Function && $e.tagNameCheck(n))))
            )
          )
            return !1;
        } else if (Ke[t]);
        else if (S(Te, A(n, Ae, "")));
        else if (
          ("src" !== t && "xlink:href" !== t && "href" !== t) ||
          "script" === e ||
          0 !== b(n, "data:") ||
          !Ve[e]
        ) {
          if (xe && !S(we, A(n, Ae, "")));
          else if (n) return !1;
        } else;
        return !0;
      },
      $t = function (e) {
        return "annotation-xml" !== e && w(e, be);
      },
      Nt = function (e) {
        St(pe.beforeSanitizeAttributes, e, null);
        const { attributes: t } = e;
        if (!t || Tt(e)) return;
        const n = {
          attrName: "",
          attrValue: "",
          keepAttr: !0,
          allowedAttributes: Ce,
          forceKeepAttr: void 0,
        };
        let o = t.length;
        for (; o--; ) {
          const a = t[o],
            { name: r, namespaceURI: s, value: l } = a,
            c = dt(r),
            m = l;
          let d = "value" === r ? m : T(m);
          if (
            ((n.attrName = c),
            (n.attrValue = d),
            (n.keepAttr = !0),
            (n.forceKeepAttr = void 0),
            St(pe.uponSanitizeAttribute, e, n),
            (d = n.attrValue),
            !ze ||
              ("id" !== c && "name" !== c) ||
              (wt(r, e), (d = "user-content-" + d)),
            Ie && S(/((--!?|])>)|<\/(style|title)/i, d))
          ) {
            wt(r, e);
            continue;
          }
          if (n.forceKeepAttr) continue;
          if (!n.keepAttr) {
            wt(r, e);
            continue;
          }
          if (!Re && S(/\/>/i, d)) {
            wt(r, e);
            continue;
          }
          Pe &&
            u([he, ge, fe], e => {
              d = A(d, e, " ");
            });
          const p = dt(e.nodeName);
          if (Et(p, c, d)) {
            if (
              re &&
              "object" == typeof j &&
              "function" == typeof j.getAttributeType
            )
              if (s);
              else
                switch (j.getAttributeType(p, c)) {
                  case "TrustedHTML":
                    d = re.createHTML(d);
                    break;
                  case "TrustedScriptURL":
                    d = re.createScriptURL(d);
                }
            if (d !== m)
              try {
                s ? e.setAttributeNS(s, r, d) : e.setAttribute(r, d),
                  Tt(e) ? vt(e) : h(i.removed);
              } catch (t) {
                wt(r, e);
              }
          } else wt(r, e);
        }
        St(pe.afterSanitizeAttributes, e, null);
      },
      kt = function e(t) {
        let n = null;
        const i = bt(t);
        for (St(pe.beforeSanitizeShadowDOM, t, null); (n = i.nextNode()); )
          St(pe.uponSanitizeShadowNode, n, null),
            Ct(n),
            Nt(n),
            n.content instanceof l && e(n.content);
        St(pe.afterSanitizeShadowDOM, t, null);
      };
    return (
      (i.sanitize = function (e) {
        let t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = null,
          o = null,
          r = null,
          s = null;
        if (
          ((it = !e), it && (e = "\x3c!--\x3e"), "string" != typeof e && !_t(e))
        ) {
          if ("function" != typeof e.toString)
            throw C("toString is not a function");
          if ("string" != typeof (e = e.toString()))
            throw C("dirty is not a string, aborting");
        }
        if (!i.isSupported) return e;
        if (
          (He || gt(t), (i.removed = []), "string" == typeof e && (je = !1), je)
        ) {
          if (e.nodeName) {
            const t = dt(e.nodeName);
            if (!_e[t] || Ne[t])
              throw C(
                "root node is forbidden and cannot be sanitized in-place"
              );
          }
        } else if (e instanceof d)
          (n = At("\x3c!----\x3e")),
            (o = n.ownerDocument.importNode(e, !0)),
            (o.nodeType === ee && "BODY" === o.nodeName) ||
            "HTML" === o.nodeName
              ? (n = o)
              : n.appendChild(o);
        else {
          if (!Be && !Pe && !De && -1 === e.indexOf("<"))
            return re && Ge ? re.createHTML(e) : e;
          if (((n = At(e)), !n)) return Be ? null : Ge ? se : "";
        }
        n && Oe && vt(n.firstChild);
        const c = bt(je ? e : n);
        for (; (r = c.nextNode()); )
          Ct(r), Nt(r), r.content instanceof l && kt(r.content);
        if (je) return e;
        if (Be) {
          if (Fe)
            for (s = me.call(n.ownerDocument); n.firstChild; )
              s.appendChild(n.firstChild);
          else s = n;
          return (
            (Ce.shadowroot || Ce.shadowrootmode) && (s = ue.call(a, s, !0)), s
          );
        }
        let m = De ? n.outerHTML : n.innerHTML;
        return (
          De &&
            _e["!doctype"] &&
            n.ownerDocument &&
            n.ownerDocument.doctype &&
            n.ownerDocument.doctype.name &&
            S(K, n.ownerDocument.doctype.name) &&
            (m = "<!DOCTYPE " + n.ownerDocument.doctype.name + ">\n" + m),
          Pe &&
            u([he, ge, fe], e => {
              m = A(m, e, " ");
            }),
          re && Ge ? re.createHTML(m) : m
        );
      }),
      (i.setConfig = function () {
        gt(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}),
          (He = !0);
      }),
      (i.clearConfig = function () {
        (ut = null), (He = !1);
      }),
      (i.isValidAttribute = function (e, t, n) {
        ut || gt({});
        const i = dt(e),
          o = dt(t);
        return Et(i, o, n);
      }),
      (i.addHook = function (e, t) {
        "function" == typeof t && g(pe[e], t);
      }),
      (i.removeHook = function (e, t) {
        if (void 0 !== t) {
          const n = p(pe[e], t);
          return -1 === n ? void 0 : f(pe[e], n, 1)[0];
        }
        return h(pe[e]);
      }),
      (i.removeHooks = function (e) {
        pe[e] = [];
      }),
      (i.removeAllHooks = function () {
        pe = {
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
  re = {
    "": ["<em>", "</em>"],
    _: ["<strong>", "</strong>"],
    "*": ["<strong>", "</strong>"],
    "~": ["<s>", "</s>"],
    "\n": ["<br />"],
    " ": ["<br />"],
    "-": ["<hr />"],
  };
function se(e) {
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
    a,
    r,
    s =
      /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)/gm,
    l = [],
    c = "",
    m = t || {},
    d = 0;
  function u(e) {
    var t = re[e[1] || ""],
      n = l[l.length - 1] == e;
    return t ? (t[1] ? (n ? l.pop() : l.push(e), t[0 | n]) : t[0]) : e;
  }
  function p() {
    for (var e = ""; l.length; ) e += u(l[l.length - 1]);
    return e;
  }
  for (
    e = e
      .replace(/^\[(.+?)\]:\s*(.+)$/gm, function (e, t, n) {
        return (m[t.toLowerCase()] = n), "";
      })
      .replace(/^\n+|\n+$/g, "");
    (o = s.exec(e));

  )
    (i = e.substring(d, o.index)),
      (d = s.lastIndex),
      (n = o[0]),
      i.match(/[^\\](\\\\)*\\$/) ||
        ((r = o[3] || o[4])
          ? (n =
              '<pre class="code ' +
              (o[4] ? "poetry" : o[2].toLowerCase()) +
              '"><code' +
              (o[2] ? ' class="language-' + o[2].toLowerCase() + '"' : "") +
              ">" +
              se(le(r).replace(/^\n+|\n+$/g, "")) +
              "</code></pre>")
          : (r = o[6])
            ? (r.match(/\./) && (o[5] = o[5].replace(/^\d+/gm, "")),
              (a = ce(se(o[5].replace(/^\s*[>*+.-]/gm, "")))),
              ">" == r
                ? (r = "blockquote")
                : ((r = r.match(/\./) ? "ol" : "ul"),
                  (a = a.replace(/^(.*)(\n|$)/gm, "<li>$1</li>"))),
              (n = "<" + r + ">" + a + "</" + r + ">"))
            : o[8]
              ? (n = '<img src="' + le(o[8]) + '" alt="' + le(o[7]) + '">')
              : o[10]
                ? ((c = c.replace(
                    "<a>",
                    '<a href="' + le(o[11] || m[i.toLowerCase()]) + '">'
                  )),
                  (n = p() + "</a>"))
                : o[9]
                  ? (n = "<a>")
                  : o[12] || o[14]
                    ? (n =
                        "<" +
                        (r =
                          "h" + (o[14] ? o[14].length : o[13] > "=" ? 1 : 2)) +
                        ">" +
                        ce(o[12] || o[15], m) +
                        "</" +
                        r +
                        ">")
                    : o[16]
                      ? (n = "<code>" + le(o[16]) + "</code>")
                      : (o[17] || o[1]) && (n = u(o[17] || "--"))),
      (c += i),
      (c += n);
  return (c + e.substring(d) + p()).replace(/^\n+|\n+$/g, "");
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const me = globalThis,
  de = me.trustedTypes,
  ue = de ? de.createPolicy("lit-html", { createHTML: e => e }) : void 0,
  pe = "$lit$",
  he = `lit$${Math.random().toFixed(9).slice(2)}$`,
  ge = "?" + he,
  fe = `<${ge}>`,
  ye = document,
  ve = () => ye.createComment(""),
  we = e => null === e || ("object" != typeof e && "function" != typeof e),
  Ae = Array.isArray,
  be = "[ \t\n\f\r]",
  Te = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  _e = /-->/g,
  Se = />/g,
  Ce = RegExp(
    `>|${be}(?:([^\\s"'>=/]+)(${be}*=${be}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,
    "g"
  ),
  Ee = /'/g,
  $e = /"/g,
  Ne = /^(?:script|style|textarea|title)$/i,
  ke = ((Pe = 1), (e, ...t) => ({ _$litType$: Pe, strings: e, values: t })),
  Me = Symbol.for("lit-noChange"),
  Le = Symbol.for("lit-nothing"),
  xe = new WeakMap(),
  Re = ye.createTreeWalker(ye, 129);
var Pe;
function Ie(e, t) {
  if (!Ae(e) || !e.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== ue ? ue.createHTML(t) : t;
}
class De {
  constructor({ strings: e, _$litType$: t }, n) {
    let i;
    this.parts = [];
    let o = 0,
      a = 0;
    const r = e.length - 1,
      s = this.parts,
      [l, c] = ((e, t) => {
        const n = e.length - 1,
          i = [];
        let o,
          a = 2 === t ? "<svg>" : 3 === t ? "<math>" : "",
          r = Te;
        for (let t = 0; t < n; t++) {
          const n = e[t];
          let s,
            l,
            c = -1,
            m = 0;
          for (
            ;
            m < n.length && ((r.lastIndex = m), (l = r.exec(n)), null !== l);

          )
            (m = r.lastIndex),
              r === Te
                ? "!--" === l[1]
                  ? (r = _e)
                  : void 0 !== l[1]
                    ? (r = Se)
                    : void 0 !== l[2]
                      ? (Ne.test(l[2]) && (o = RegExp("</" + l[2], "g")),
                        (r = Ce))
                      : void 0 !== l[3] && (r = Ce)
                : r === Ce
                  ? ">" === l[0]
                    ? ((r = o ?? Te), (c = -1))
                    : void 0 === l[1]
                      ? (c = -2)
                      : ((c = r.lastIndex - l[2].length),
                        (s = l[1]),
                        (r = void 0 === l[3] ? Ce : '"' === l[3] ? $e : Ee))
                  : r === $e || r === Ee
                    ? (r = Ce)
                    : r === _e || r === Se
                      ? (r = Te)
                      : ((r = Ce), (o = void 0));
          const d = r === Ce && e[t + 1].startsWith("/>") ? " " : "";
          a +=
            r === Te
              ? n + fe
              : c >= 0
                ? (i.push(s), n.slice(0, c) + pe + n.slice(c) + he + d)
                : n + he + (-2 === c ? t : d);
        }
        return [
          Ie(
            e,
            a +
              (e[n] || "<?>") +
              (2 === t ? "</svg>" : 3 === t ? "</math>" : "")
          ),
          i,
        ];
      })(e, t);
    if (
      ((this.el = De.createElement(l, n)),
      (Re.currentNode = this.el.content),
      2 === t || 3 === t)
    ) {
      const e = this.el.content.firstChild;
      e.replaceWith(...e.childNodes);
    }
    for (; null !== (i = Re.nextNode()) && s.length < r; ) {
      if (1 === i.nodeType) {
        if (i.hasAttributes())
          for (const e of i.getAttributeNames())
            if (e.endsWith(pe)) {
              const t = c[a++],
                n = i.getAttribute(e).split(he),
                r = /([.?@])?(.*)/.exec(t);
              s.push({
                type: 1,
                index: o,
                name: r[2],
                strings: n,
                ctor:
                  "." === r[1]
                    ? Ge
                    : "?" === r[1]
                      ? Ue
                      : "@" === r[1]
                        ? ze
                        : Fe,
              }),
                i.removeAttribute(e);
            } else
              e.startsWith(he) &&
                (s.push({ type: 6, index: o }), i.removeAttribute(e));
        if (Ne.test(i.tagName)) {
          const e = i.textContent.split(he),
            t = e.length - 1;
          if (t > 0) {
            i.textContent = de ? de.emptyScript : "";
            for (let n = 0; n < t; n++)
              i.append(e[n], ve()),
                Re.nextNode(),
                s.push({ type: 2, index: ++o });
            i.append(e[t], ve());
          }
        }
      } else if (8 === i.nodeType)
        if (i.data === ge) s.push({ type: 2, index: o });
        else {
          let e = -1;
          for (; -1 !== (e = i.data.indexOf(he, e + 1)); )
            s.push({ type: 7, index: o }), (e += he.length - 1);
        }
      o++;
    }
  }
  static createElement(e, t) {
    const n = ye.createElement("template");
    return (n.innerHTML = e), n;
  }
}
function He(e, t, n = e, i) {
  var o, a;
  if (t === Me) return t;
  let r = void 0 !== i ? (null == (o = n._$Co) ? void 0 : o[i]) : n._$Cl;
  const s = we(t) ? void 0 : t._$litDirective$;
  return (
    (null == r ? void 0 : r.constructor) !== s &&
      (null == (a = null == r ? void 0 : r._$AO) || a.call(r, !1),
      void 0 === s ? (r = void 0) : ((r = new s(e)), r._$AT(e, n, i)),
      void 0 !== i ? ((n._$Co ?? (n._$Co = []))[i] = r) : (n._$Cl = r)),
    void 0 !== r && (t = He(e, r._$AS(e, t.values), r, i)),
    t
  );
}
class Oe {
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
      i = ((null == e ? void 0 : e.creationScope) ?? ye).importNode(t, !0);
    Re.currentNode = i;
    let o = Re.nextNode(),
      a = 0,
      r = 0,
      s = n[0];
    for (; void 0 !== s; ) {
      if (a === s.index) {
        let t;
        2 === s.type
          ? (t = new Be(o, o.nextSibling, this, e))
          : 1 === s.type
            ? (t = new s.ctor(o, s.name, s.strings, this, e))
            : 6 === s.type && (t = new We(o, this, e)),
          this._$AV.push(t),
          (s = n[++r]);
      }
      a !== (null == s ? void 0 : s.index) && ((o = Re.nextNode()), a++);
    }
    return (Re.currentNode = ye), i;
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
class Be {
  get _$AU() {
    var e;
    return (null == (e = this._$AM) ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, n, i) {
    (this.type = 2),
      (this._$AH = Le),
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
    (e = He(this, e, t)),
      we(e)
        ? e === Le || null == e || "" === e
          ? (this._$AH !== Le && this._$AR(), (this._$AH = Le))
          : e !== this._$AH && e !== Me && this._(e)
        : void 0 !== e._$litType$
          ? this.$(e)
          : void 0 !== e.nodeType
            ? this.T(e)
            : (e =>
                  Ae(e) ||
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
    this._$AH !== Le && we(this._$AH)
      ? (this._$AA.nextSibling.data = e)
      : this.T(ye.createTextNode(e)),
      (this._$AH = e);
  }
  $(e) {
    var t;
    const { values: n, _$litType$: i } = e,
      o =
        "number" == typeof i
          ? this._$AC(e)
          : (void 0 === i.el &&
              (i.el = De.createElement(Ie(i.h, i.h[0]), this.options)),
            i);
    if ((null == (t = this._$AH) ? void 0 : t._$AD) === o) this._$AH.p(n);
    else {
      const e = new Oe(o, this),
        t = e.u(this.options);
      e.p(n), this.T(t), (this._$AH = e);
    }
  }
  _$AC(e) {
    let t = xe.get(e.strings);
    return void 0 === t && xe.set(e.strings, (t = new De(e))), t;
  }
  k(e) {
    Ae(this._$AH) || ((this._$AH = []), this._$AR());
    const t = this._$AH;
    let n,
      i = 0;
    for (const o of e)
      i === t.length
        ? t.push((n = new Be(this.O(ve()), this.O(ve()), this, this.options)))
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
class Fe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, n, i, o) {
    (this.type = 1),
      (this._$AH = Le),
      (this._$AN = void 0),
      (this.element = e),
      (this.name = t),
      (this._$AM = i),
      (this.options = o),
      n.length > 2 || "" !== n[0] || "" !== n[1]
        ? ((this._$AH = Array(n.length - 1).fill(new String())),
          (this.strings = n))
        : (this._$AH = Le);
  }
  _$AI(e, t = this, n, i) {
    const o = this.strings;
    let a = !1;
    if (void 0 === o)
      (e = He(this, e, t, 0)),
        (a = !we(e) || (e !== this._$AH && e !== Me)),
        a && (this._$AH = e);
    else {
      const i = e;
      let r, s;
      for (e = o[0], r = 0; r < o.length - 1; r++)
        (s = He(this, i[n + r], t, r)),
          s === Me && (s = this._$AH[r]),
          a || (a = !we(s) || s !== this._$AH[r]),
          s === Le ? (e = Le) : e !== Le && (e += (s ?? "") + o[r + 1]),
          (this._$AH[r] = s);
    }
    a && !i && this.j(e);
  }
  j(e) {
    e === Le
      ? this.element.removeAttribute(this.name)
      : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ge extends Fe {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  j(e) {
    this.element[this.name] = e === Le ? void 0 : e;
  }
}
class Ue extends Fe {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== Le);
  }
}
class ze extends Fe {
  constructor(e, t, n, i, o) {
    super(e, t, n, i, o), (this.type = 5);
  }
  _$AI(e, t = this) {
    if ((e = He(this, e, t, 0) ?? Le) === Me) return;
    const n = this._$AH,
      i =
        (e === Le && n !== Le) ||
        e.capture !== n.capture ||
        e.once !== n.once ||
        e.passive !== n.passive,
      o = e !== Le && (n === Le || i);
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
    He(this, e);
  }
}
const je = me.litHtmlPolyfillSupport;
null == je || je(De, Be),
  (me.litHtmlVersions ?? (me.litHtmlVersions = [])).push("3.3.0");
const qe = (e, t, n) => {
    const i = t;
    let o = i._$litPart$;
    if (void 0 === o) {
      const e = null;
      i._$litPart$ = o = new Be(t.insertBefore(ve(), e), e, void 0, {});
    }
    return o._$AI(e), o;
  },
  Ye = 2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ class Xe {
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
 */ class Ve extends Xe {
  constructor(e) {
    if ((super(e), (this.it = Le), e.type !== Ye))
      throw Error(
        this.constructor.directiveName + "() can only be used in child bindings"
      );
  }
  render(e) {
    if (e === Le || null == e) return (this._t = void 0), (this.it = e);
    if (e === Me) return e;
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
const Je = (
    e =>
    (...t) => ({ _$litDirective$: e, values: t })
  )(Ve),
  Ke = {
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
    pseudonymNotice:
      "Will be converted to a unique pseudonym, longer names help avoid impersonation",
    editingPseudonymNotice: "Cannot be changed when editing",
    author: "Author",
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
    namePlaceholder: "名稱 (選填)",
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
    pseudonymNotice: "名稱將被轉換為化名，使用較長的名稱有助於避免被冒充",
    editingPseudonymNotice: "編輯時無法更改",
    author: "作者",
  },
  Qe = [
    "Brilliant",
    "Elegant",
    "Majestic",
    "Serene",
    "Vibrant",
    "Graceful",
    "Radiant",
    "Mystical",
    "Noble",
    "Charming",
    "Delicate",
    "Gentle",
    "Luminous",
    "Peaceful",
    "Quick",
    "Resilient",
    "Sparkling",
    "Tranquil",
    "Vivid",
    "Wise",
    "Brave",
    "Creative",
    "Dynamic",
    "Enigmatic",
    "Fantastic",
    "Golden",
    "Harmonious",
    "Inspiring",
    "Joyful",
    "Keen",
    "Lively",
    "Magnificent",
    "Natural",
    "Optimistic",
    "Precious",
    "Quiet",
    "Remarkable",
    "Stunning",
    "Thoughtful",
    "Uplifting",
    "Wonderful",
    "Adventurous",
    "Balanced",
    "Confident",
    "Determined",
    "Energetic",
    "Fearless",
    "Gracious",
    "Innovative",
    "Jubilant",
    "Kind",
    "Loyal",
    "Marvelous",
    "Amazing",
    "Bright",
    "Cheerful",
    "Curious",
    "Excited",
    "Fresh",
    "Happy",
    "Intelligent",
    "Jovial",
    "Lovely",
    "Merry",
    "Nimble",
    "Pleasant",
    "Resourceful",
    "Spirited",
    "Talented",
    "Versatile",
    "Warm",
    "Youthful",
    "Active",
    "Agile",
    "Alert",
    "Artistic",
    "Athletic",
    "Authentic",
    "Blissful",
    "Buoyant",
    "Calm",
    "Capable",
    "Caring",
    "Clever",
    "Compassionate",
    "Cool",
    "Courageous",
    "Dazzling",
    "Dedicated",
    "Diligent",
    "Earnest",
    "Efficient",
    "Enthusiastic",
    "Exceptional",
    "Expressive",
    "Fabulous",
    "Faithful",
    "Focused",
    "Friendly",
    "Generous",
    "Gifted",
    "Glorious",
    "Helpful",
    "Honest",
    "Hopeful",
    "Humorous",
    "Independent",
    "Inventive",
    "Lighthearted",
    "Lucky",
    "Mindful",
    "Modest",
    "Motivating",
    "Nurturing",
    "Original",
    "Outgoing",
    "Patient",
    "Playful",
    "Polite",
    "Positive",
    "Proud",
    "Pure",
    "Reliable",
    "Responsible",
    "Sincere",
    "Smart",
    "Smooth",
    "Sociable",
    "Spontaneous",
    "Successful",
    "Sweet",
    "Tender",
    "Trusting",
    "Understanding",
    "Unique",
    "Valuable",
    "Virtuous",
    "Wholesome",
    "Witty",
  ],
  et = [
    "Falcon",
    "Phoenix",
    "Dragon",
    "Eagle",
    "Tiger",
    "Lion",
    "Wolf",
    "Bear",
    "Deer",
    "Fox",
    "Hawk",
    "Raven",
    "Swan",
    "Dove",
    "Owl",
    "Butterfly",
    "Rose",
    "Lily",
    "Orchid",
    "Jasmine",
    "Cedar",
    "Oak",
    "Pine",
    "Willow",
    "Maple",
    "Mountain",
    "River",
    "Ocean",
    "Moon",
    "Sun",
    "Cloud",
    "Thunder",
    "Rainbow",
    "Diamond",
    "Ruby",
    "Emerald",
    "Sapphire",
    "Pearl",
    "Crystal",
    "Gold",
    "Silver",
    "Amber",
    "Flame",
    "Breeze",
    "Storm",
    "Mist",
    "Dawn",
    "Dusk",
    "Aurora",
    "Comet",
    "Galaxy",
    "Nebula",
    "Shield",
    "Crown",
    "Gem",
    "Prism",
    "Panda",
    "Koala",
    "Giraffe",
    "Zebra",
    "Leopard",
    "Cheetah",
    "Otter",
    "Dolphin",
    "Whale",
    "Penguin",
    "Rabbit",
    "Squirrel",
    "Hedgehog",
    "Badger",
    "Moose",
    "Camel",
    "Horse",
    "Donkey",
    "Sheep",
    "Goat",
    "Cow",
    "Chicken",
    "Duck",
    "Goose",
    "Turkey",
    "Peacock",
    "Parrot",
    "Canary",
    "Finch",
    "Sparrow",
    "Crane",
    "Stork",
    "Flamingo",
    "Pelican",
    "Shrimp",
    "Crab",
    "Lobster",
    "Octopus",
    "Squid",
    "Walrus",
    "Mole",
    "Ferret",
    "Hamster",
    "Chinchilla",
    "GuineaPig",
    "Lemur",
    "Tapir",
    "Buffalo",
    "Bison",
    "Yak",
    "Ibex",
    "Gazelle",
    "Porcupine",
    "Armadillo",
    "Sloth",
    "Opossum",
    "Platypus",
    "Wombat",
    "Kangaroo",
    "Wallaby",
    "Emu",
    "Cassowary",
    "Orangutan",
    "Gibbon",
    "Chimpanzee",
    "Baboon",
    "Macaque",
    "Lynx",
    "Puma",
    "Jaguar",
    "Cougar",
    "Bobcat",
    "Ocelot",
    "RedPanda",
    "Raccoon",
    "Weasel",
    "Stoat",
    "Ermine",
    "Wolverine",
    "Marten",
    "Jay",
    "Magpie",
    "Rook",
    "Swallow",
    "Swift",
    "Cuckoo",
    "Coot",
    "Grebe",
    "Heron",
    "Egret",
    "Ibis",
    "Gull",
    "Tern",
    "Salmon",
    "Trout",
    "Bass",
    "Cod",
    "Tuna",
    "Ray",
    "Carp",
    "Perch",
    "Catfish",
    "Eel",
    "Pike",
    "Snapper",
    "Bream",
    "Tilapia",
    "Goby",
    "Mullet",
    "Loach",
    "Bamboo",
    "Cactus",
    "Fern",
    "Moss",
    "Palm",
    "Birch",
    "Aspen",
    "Beech",
    "Hazel",
    "Elm",
    "Poplar",
    "Magnolia",
    "Azalea",
    "Gardenia",
    "Hibiscus",
    "Wisteria",
    "Dahlia",
    "Peony",
    "Marigold",
    "Sunflower",
    "Daisy",
    "Violet",
    "Pansy",
    "Begonia",
    "Petunia",
    "Zinnia",
    "Cosmos",
    "Aster",
    "Bluebell",
    "Foxglove",
    "Primrose",
    "Buttercup",
    "Clover",
    "Heather",
    "Lavender",
    "Basil",
    "Rosemary",
    "Thyme",
    "Sage",
    "Parsley",
    "Dill",
    "Fennel",
    "Chive",
    "Oregano",
    "Lotus",
    "Taro",
    "Mushroom",
    "Truffle",
    "Morel",
    "Shiitake",
    "Moth",
    "Dragonfly",
    "Bee",
    "Ant",
    "Termite",
    "Beetle",
    "Ladybug",
    "Firefly",
    "Cicada",
    "Grasshopper",
    "Cricket",
    "Katydid",
    "Locust",
    "Mantis",
    "Earwig",
    "Silverfish",
    "Mayfly",
    "Stonefly",
    "Aphid",
    "Whitefly",
    "Apple",
    "Banana",
    "Orange",
    "Lemon",
    "Lime",
    "Grape",
    "Cherry",
    "Peach",
    "Plum",
    "Pear",
    "Mango",
    "Papaya",
    "Pineapple",
    "Guava",
    "Lychee",
    "Longan",
    "Rambutan",
    "Coconut",
    "Date",
    "Fig",
    "Gooseberry",
    "Blackberry",
    "Blueberry",
    "Raspberry",
    "Strawberry",
    "Cranberry",
    "Currant",
    "Melon",
    "Pumpkin",
    "Squash",
    "Zucchini",
    "Bread",
    "Bagel",
    "Baguette",
    "Croissant",
    "Pretzel",
    "Bun",
    "Roll",
    "Muffin",
    "Cake",
    "Pie",
    "Tart",
    "Cookie",
    "Biscuit",
    "Doughnut",
    "Pancake",
    "Waffle",
    "Crepe",
    "Sandwich",
    "Burger",
    "Pizza",
    "Pasta",
    "Spaghetti",
    "Macaroni",
    "Lasagna",
    "Ravioli",
    "Noodle",
    "Ramen",
    "Udon",
    "Soba",
    "Pho",
    "Dumpling",
    "Wonton",
    "Bao",
    "Sushi",
    "Tempura",
    "Rice",
    "Soup",
    "Stew",
    "Curry",
    "Grill",
    "Roast",
    "Fry",
    "Steam",
    "Boil",
    "Jam",
    "Honey",
    "Butter",
    "Cheese",
    "Cream",
    "Custard",
    "Pudding",
    "IceCream",
    "Sorbet",
    "Milk",
    "Juice",
    "Tea",
    "Coffee",
    "Cocoa",
    "Candy",
    "Mint",
    "Gum",
    "Book",
    "Pen",
    "Pencil",
    "Eraser",
    "Ruler",
    "Scissors",
    "Glue",
    "Paper",
    "Notebook",
    "Bag",
    "Wallet",
    "Key",
    "Lock",
    "Watch",
    "Lamp",
    "Mirror",
    "Brush",
    "Comb",
    "Towel",
    "Soap",
    "Cup",
    "Mug",
    "Bottle",
    "Glass",
    "Plate",
    "Bowl",
    "Spoon",
    "Fork",
    "Tray",
    "Box",
    "Can",
    "Jar",
    "Bin",
    "Pan",
    "Pot",
    "Kettle",
    "Oven",
    "Fan",
    "Phone",
    "Tablet",
    "Laptop",
    "Keyboard",
    "Camera",
    "Radio",
    "TV",
    "Charger",
    "Cable",
    "Plug",
    "Adapter",
    "Battery",
    "Umbrella",
    "Hat",
    "Cap",
    "Scarf",
    "Glove",
    "Sock",
    "Shoe",
    "Boot",
    "Belt",
    "Coat",
    "Jacket",
    "Shirt",
    "Pants",
    "Shorts",
    "Skirt",
    "Dress",
    "Suit",
    "Tie",
    "Mask",
    "Apron",
    "Blanket",
    "Pillow",
    "Chair",
    "Table",
    "Desk",
    "Shelf",
    "Drawer",
    "Cabinet",
    "Door",
    "Window",
    "Wall",
    "Floor",
    "Roof",
    "Stair",
    "Road",
    "Park",
    "Garden",
    "Fence",
    "Gate",
    "Mailbox",
    "Sign",
    "Poster",
    "Flag",
    "Balloon",
    "Kite",
    "Toy",
    "Puzzle",
    "Game",
    "Dice",
    "Card",
    "Coin",
    "Medal",
    "Trophy",
    "Badge",
    "Sticker",
    "Patch",
    "Pin",
    "Ring",
    "Necklace",
    "Bracelet",
    "Earring",
    "Charm",
    "Pendant",
    "Chain",
    "Clip",
    "Hook",
    "Button",
    "Zip",
    "String",
    "Rope",
    "Wire",
    "Band",
    "Tape",
    "Ribbon",
    "Thread",
    "Needle",
    "Thimble",
    "Wrench",
    "Pliers",
    "Level",
    "Map",
    "Globe",
    "Chart",
    "Graph",
    "List",
    "Note",
    "Memo",
    "Label",
    "Tag",
    "Ticket",
    "Pass",
    "Receipt",
    "Bill",
    "Form",
    "Report",
    "File",
    "Folder",
    "Envelope",
    "Stamp",
    "Seal",
    "Circle",
    "Oval",
    "Square",
    "Star",
    "Heart",
    "Arrow",
    "Dot",
    "Line",
    "Wave",
    "Curve",
    "Point",
    "Edge",
    "Corner",
    "Block",
    "Brick",
    "Tile",
    "Panel",
    "Board",
    "Beam",
    "Pole",
    "Rod",
    "Bar",
    "Tube",
    "Pipe",
    "Valve",
    "Tap",
    "Pump",
    "Motor",
    "Gear",
    "Wheel",
    "Axle",
    "Spring",
    "Lever",
    "Handle",
    "Knob",
    "Switch",
    "Dial",
    "Latch",
    "Bolt",
    "Hinge",
    "Frame",
    "Base",
    "Stand",
    "Holder",
    "Mount",
    "Elastic",
    "Rubber",
    "Plastic",
    "Metal",
    "Wood",
    "Stone",
    "Clay",
    "Sand",
    "Soil",
    "Mud",
    "Dust",
    "Salt",
    "Sugar",
    "Oil",
    "Vinegar",
    "Sauce",
    "Paste",
    "Syrup",
    "Fudge",
    "Toffee",
    "Marshmallow",
    "Nougat",
    "Lollipop",
    "Popsicle",
    "Slush",
    "Jellybean",
  ];
async function tt(e) {
  const t = (e || "").trim();
  if (0 === t.length) return { pseudonym: "", hash: "" };
  const n = await (async function (e) {
      const t = new TextEncoder().encode(e),
        n = await crypto.subtle.digest("SHA-256", t);
      return Array.from(new Uint8Array(n))
        .map(e => e.toString(16).padStart(2, "0"))
        .join("");
    })(t),
    { adjective: i, noun: o } = (function (e) {
      const t = parseInt(e.substring(0, 8), 16) % Qe.length,
        n = parseInt(e.substring(8, 16), 16) % et.length;
      return { adjective: Qe[t], noun: et[n] };
    })(n);
  return { pseudonym: `${i} ${o}`, hash: n };
}
function nt(e = "wtc-app", t = {}) {
  const n = new ot(e, t);
  return n.renderApp(), n;
}
const it = class e {
  constructor(e, n = {}) {
    t(this, "elementId"),
      t(this, "post"),
      t(this, "apiUrl"),
      t(this, "authorName"),
      t(this, "apiService"),
      t(this, "i18n"),
      t(this, "commentMap", {}),
      t(this, "comments", []),
      t(this, "currentReplyTo", null),
      t(this, "previewText", ""),
      t(this, "previewName", ""),
      t(this, "previewPseudonym", ""),
      t(this, "editingComment", null),
      t(this, "activeTab", "write"),
      t(this, "showMarkdownHelp", !1),
      t(this, "showAdminLogin", !1),
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
      (this.authorName = n.authorName),
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
          addComment: async (t, i, o, a, r) => {
            try {
              const s = new URL("/api/comments", e);
              s.searchParams.append("post", t);
              const l = document.querySelector('input[name="website"]'),
                c = l ? l.value : "",
                m = await fetch(s, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    pseudonym: i,
                    nameHash: o,
                    msg: a,
                    replyTo: r,
                    website: c,
                  }),
                });
              if (m.ok) {
                const e = await m.json();
                return n(e.id, e.timestamp, e.token), e.id;
              }
              return null;
            } catch (e) {
              return null;
            }
          },
          updateComment: async (t, n, o, a, r) => {
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
                      pseudonym: o,
                      nameHash: a,
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
            const a = i(n);
            if (!a) return !1;
            try {
              const i = new URL("/api/comments", e);
              return (
                i.searchParams.append("post", t),
                !!(
                  await fetch(i, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: a.id,
                      timestamp: a.timestamp,
                      token: a.token,
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
    let i = Ke;
    n.language &&
      (i =
        "string" == typeof n.language
          ? "zh-Hant" === n.language
            ? Ze
            : Ke
          : n.language),
      (this.i18n = ((e = Ke) => {
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
    ae.addHook("afterSanitizeAttributes", e => {
      "A" === e.tagName &&
        (e.setAttribute("rel", "noopener noreferrer"),
        e.setAttribute("target", "_blank")),
        "IMG" === e.tagName && e.setAttribute("loading", "lazy");
    }),
      ae.addHook("uponSanitizeAttribute", (e, t) => {
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
    return Je(ae.sanitize(ce(e || ""), this.DompurifyConfig));
  }
  formatDate(e) {
    const t = new Date(e),
      n = t.getFullYear(),
      i = String(t.getMonth() + 1).padStart(2, "0"),
      o = String(t.getDate()).padStart(2, "0");
    let a = t.getHours();
    const r = String(t.getMinutes()).padStart(2, "0"),
      s = a >= 12 ? "PM" : "AM";
    (a %= 12), 0 === a && (a = 12);
    return `${n}/${i}/${o} ${String(a).padStart(2, "0")}:${r} ${s}`;
  }
  getDisplayName(e) {
    if ((null == e ? void 0 : e.isAdmin) && this.authorName)
      return ae.sanitize(this.authorName, { ALLOWED_TAGS: [] });
    const t = (null == e ? void 0 : e.pseudonym)
      ? ae.sanitize(e.pseudonym, { ALLOWED_TAGS: [] })
      : void 0;
    return t || this.i18n.t("anonymous");
  }
  canEditComment(e) {
    return this.apiService.canEditComment(e);
  }
  saveMyNameHash(t) {
    try {
      const n = this.getMyNameHashes();
      t &&
        !n.includes(t) &&
        (n.push(t),
        localStorage.setItem(e.MY_NAME_HASHES_KEY, JSON.stringify(n)));
    } catch (e) {
      console.warn("Failed to save name hash to localStorage:", e);
    }
  }
  getMyNameHashes() {
    try {
      const t = localStorage.getItem(e.MY_NAME_HASHES_KEY);
      return t ? JSON.parse(t) : [];
    } catch (e) {
      return (
        console.warn("Failed to get name hashes from localStorage:", e), []
      );
    }
  }
  isMyComment(e) {
    return !!e.nameHash && this.getMyNameHashes().includes(e.nameHash);
  }
  async loadComments() {
    return await this.apiService.getComments(this.post);
  }
  renderForm() {
    const e = this.createFormTemplate(),
      t = document.getElementById("comment-form-container");
    t && (qe(e, t), this.restoreFormInputs());
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
      t = this.previewPseudonym;
    return ke`
      <div class="comment-box preview-mode">
        <div id="preview">
          ${
            this.previewText
              ? ke`
                <div class="preview-comment">
                  <div class="comment-header">
                    <span class="comment-name">${t || this.i18n.t("anonymous")}</span>
                    <span class="comment-time">${this.formatDate(e)}</span>
                    ${
                      this.currentReplyTo &&
                      this.commentMap[this.currentReplyTo]
                        ? ke`<span class="reply-to">
                          ${this.i18n.t("replyTo")}
                          <span>${this.getDisplayName(this.commentMap[this.currentReplyTo])}</span>
                        </span>`
                        : ""
                    }
                  </div>
                  <div class="comment-content">${this.renderMarkdown(this.previewText)}</div>
                </div>
              `
              : ke`<div class="empty-preview">${this.i18n.t("emptyPreview")}</div>`
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
      t && qe(e, t);
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
    t && qe(e, t);
  }
  buildCommentMap() {
    (this.commentMap = {}),
      this.comments.forEach(e => {
        this.commentMap[e.id] = e;
      });
  }
  createCommentsTemplate() {
    return ke` <div id="comments">${this.processComments(this.comments)}</div> `;
  }
  setReplyTo(e) {
    this.editingComment &&
      ((this.editingComment = null),
      (this.previewText = ""),
      (this.previewName = ""),
      (this.previewPseudonym = "")),
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
  async handleNameInputChange(t) {
    const n = t.target;
    if (((this.previewName = n.value), n.value.trim()))
      try {
        const { pseudonym: e } = await tt(n.value);
        this.previewPseudonym = e;
      } catch (e) {
        console.warn("Failed to generate pseudonym:", e),
          (this.previewPseudonym = "");
      }
    else this.previewPseudonym = "";
    this.updateCharCount("name", n.value.length);
    const i = document.getElementById("name-char-count");
    i &&
      (n.value.length > e.MAX_NAME_LENGTH
        ? i.classList.add("over-limit")
        : i.classList.remove("over-limit")),
      "preview" === this.activeTab && this.renderPreview();
  }
  updateCharCount(e, t) {
    const n = document.getElementById(`${e}-char-count`);
    n && (n.textContent = t.toString());
  }
  createCommentItemTemplate(e, t = !1, n = null, i = null, o = null) {
    const a = this.getCommentCssClasses(t),
      r = this.canEditComment(e.id);
    return ke`
      <div class="${a.item}" ${t ? `data-id="${e.id}"` : ""}>
        ${this.createCommentHeader(e, a, n, r)}
        ${this.createCommentContent(e, a.content)}
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
    const o = this.isMyComment(e),
      a = e.isAdmin;
    return ke`
      <div class="${t.header}">
        <span class="${t.name}" title="${e.id}">
          ${this.getDisplayName(e)}
          ${a ? ke`<span class="author-badge">${this.i18n.t("author")}</span>` : o ? ke`<span class="my-comment-badge">Me</span>` : ""}
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
      ? ke`<span class="reply-to">
          ${this.i18n.t("replyTo")}
          <span title="${t ?? ""}">${e}</span>
        </span>`
      : "";
  }
  createCommentControls(e, t) {
    return e
      ? ke`<span class="comment-controls wtc-flex wtc-gap-xs">
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
    return ke`<div class="${t}">${this.renderMarkdown(e.msg)}</div>`;
  }
  createCommentActions(e) {
    return ke`
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
      ? ke`<div class="replies">
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
    let a, r;
    if (this.editingComment)
      (a = this.editingComment.pseudonym || ""),
        (r = this.editingComment.nameHash || "");
    else {
      const { pseudonym: e, hash: t } = await tt(i || "");
      (a = e), (r = t);
    }
    (await this.processSubmission(a, r, o)) &&
      (this.resetFormState(),
      (this.comments.length = 0),
      await this.renderCommentsList());
  }
  async processSubmission(e, t, n) {
    if (this.editingComment) {
      const e = await this.apiService.updateComment(
        this.post,
        this.editingComment.id,
        this.editingComment.pseudonym || "",
        this.editingComment.nameHash || "",
        n
      );
      return e || alert(this.i18n.t("editFailed")), e;
    }
    return (await this.apiService.addComment(
      this.post,
      e,
      t,
      n,
      this.currentReplyTo
    ))
      ? (this.saveMyNameHash(t), !0)
      : (alert(this.i18n.t("submitFailed")), !1);
  }
  resetFormState() {
    const e = document.querySelector("#comment-form");
    e && e.reset(),
      (this.previewText = ""),
      (this.previewName = ""),
      (this.previewPseudonym = ""),
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
    let t, n;
    if (this.editingComment)
      (t = this.editingComment.pseudonym || ""),
        (n = this.editingComment.nameHash || "");
    else {
      const e = await tt(this.previewName);
      (t = e.pseudonym), (n = e.hash);
    }
    (await this.processSubmission(t, n, this.previewText)) &&
      (this.resetPreviewState(),
      (this.comments.length = 0),
      await this.renderCommentsList());
  }
  resetPreviewState() {
    (this.previewText = ""),
      (this.previewName = ""),
      (this.previewPseudonym = ""),
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
      (this.previewName = e.pseudonym || ""),
      (this.previewPseudonym = e.pseudonym || "");
  }
  populateFormWithComment(t) {
    const n = document.querySelector('#comment-form input[name="name"]'),
      i = document.querySelector('#comment-form textarea[name="message"]');
    if (n) {
      (n.value = t.pseudonym || ""),
        (this.previewName = t.pseudonym || ""),
        (this.previewPseudonym = t.pseudonym || ""),
        this.updateCharCount("name", (t.pseudonym || "").length);
      const i = document.getElementById("name-char-count");
      i &&
        ((t.pseudonym || "").length > e.MAX_NAME_LENGTH
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
      (this.previewPseudonym = ""),
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
    qe(this.createMarkdownHelpTemplate(), e), e.classList.add("active");
  }
  hideHelpModal(e) {
    qe(ke``, e), e.classList.remove("active");
  }
  createMarkdownHelpTemplate() {
    return ke`
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
    return ke`
      ${this.createFormContent()} ${this.createStatusIndicators()}
      <div id="markdown-help-modal"></div>
      <div id="admin-login-modal"></div>
    `;
  }
  createFormContent() {
    return ke`
      <div class="comment-box">
        <div id="form-content" class="${"write" === this.activeTab ? "active" : ""}">
          <form
            id="comment-form"
            class="wtc-reset-form"
            @submit=${e => this.handleSubmit(e)}
          >
            <div class="honeypot-field">
              <input
                type="text"
                name="website"
                tabindex="-1"
                autocomplete="off"
                aria-hidden="true"
              />
            </div>
            ${this.createTextareaSection()} ${this.createFormFooter()}
          </form>
        </div>
      </div>
    `;
  }
  createTextareaSection() {
    return ke`
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
    return ke`
      <div class="comment-footer wtc-flex wtc-flex-wrap wtc-gap-xs">
        <div class="name-input-container">
          <input
            type="text"
            name="name"
            autocomplete="name"
            placeholder="${this.i18n.t("namePlaceholder")}"
            maxlength="${e.MAX_NAME_LENGTH}"
            ?disabled=${null !== this.editingComment}
            @input=${e => this.handleNameInputChange(e)}
          />
          <div class="pseudonym-notice" style="font-size: 0.8em; color: #666; margin-top: 4px;">
            ${this.editingComment ? this.i18n.t("editingPseudonymNotice") : this.i18n.t("pseudonymNotice")}
          </div>
        </div>
        <div class="wtc-flex wtc-gap-xs">${this.createFormButtons()}</div>
      </div>
    `;
  }
  createFormButtons() {
    return ke`
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
  createAdminButton() {
    return ke`
      <button
        type="button"
        class="admin-btn wtc-clickable wtc-reset-button"
        title="Admin"
        @click=${() => this.showAdminModal()}
      >
        ⚙
      </button>
    `;
  }
  showAdminModal() {
    (this.showAdminLogin = !0), this.renderAdminLogin();
  }
  hideAdminModal() {
    (this.showAdminLogin = !1), this.renderAdminLogin();
  }
  renderAdminLogin() {
    const e = this.showAdminLogin ? this.createAdminLoginTemplate() : ke``,
      t = document.getElementById("admin-login-modal");
    t && qe(e, t);
  }
  createAdminLoginTemplate() {
    return ke`
      <div class="admin-modal-backdrop wtc-clickable" @click=${() => this.hideAdminModal()}>
        <div class="admin-modal-content" @click=${e => e.stopPropagation()}>
          <button
            class="admin-modal-close wtc-clickable wtc-reset-button"
            @click=${() => this.hideAdminModal()}
          >
            ×
          </button>
          <h3>Admin Login</h3>
          <form @submit=${e => this.handleAdminLogin(e)}>
            <div class="admin-form-group">
              <label for="admin-username">Username:</label>
              <input type="text" id="admin-username" name="username" required autocomplete="off" />
            </div>
            <div class="admin-form-group">
              <label for="admin-password">Password:</label>
              <input
                type="password"
                id="admin-password"
                name="password"
                required
                autocomplete="off"
              />
            </div>
            <button type="submit" class="admin-login-btn wtc-clickable wtc-reset-button">
              Login
            </button>
          </form>
        </div>
      </div>
    `;
  }
  async handleAdminLogin(e) {
    e.preventDefault();
    const t = new FormData(e.target),
      n = t.get("username"),
      i = t.get("password");
    try {
      const e = await fetch(`${this.apiUrl}admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: n, password: i }),
      });
      if (e.ok) {
        const t = await e.text();
        console.log("Admin login result:", t),
          alert("Admin login successful!"),
          this.hideAdminModal();
      } else alert("Admin login failed!");
    } catch (e) {
      console.error("Admin login error:", e), alert("Admin login error!");
    }
  }
  createStatusIndicators() {
    const e = this.createReplyIndicator(),
      t = this.createEditIndicator();
    return e || t ? ke`${e}${t}` : "";
  }
  createReplyIndicator() {
    return this.currentReplyTo && this.commentMap[this.currentReplyTo]
      ? ke`<div class="info wtc-flex wtc-gap-md">
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
      ? ke`<div class="info wtc-flex wtc-gap-md">
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
    const e = ke`
      <div class="wtc-container">
        <div class="comment-box-container">
          <div id="comment-form-container" class="form-content"></div>
          <!-- <div class="admin-btn-wrapper">${this.createAdminButton()}</div> -->
        </div>
        <div id="comments-container"></div>
      </div>
    `,
      t = document.getElementById(this.elementId);
    t &&
      (qe(e, t),
      this.renderForm(),
      await this.renderCommentsList(),
      this.renderMarkdownHelp());
  }
  async refresh() {
    (this.comments = []), await this.renderCommentsList();
  }
};
t(it, "MAX_NAME_LENGTH", 25),
  t(it, "MAX_MESSAGE_LENGTH", 1e3),
  t(it, "MY_NAME_HASHES_KEY", "wtc_my_name_hashes");
let ot = it;
export { nt as default, nt as initWontonComment };
//# sourceMappingURL=wonton-comment.es.js.map
