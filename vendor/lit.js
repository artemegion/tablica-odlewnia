/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = window, i = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s = Symbol(), e = new WeakMap; class n { constructor(t, i, e) { if (this._$cssResult$ = !0, e !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead."); this.cssText = t, this.t = i } get styleSheet() { let t = this.i; const s = this.t; if (i && void 0 === t) { const i = void 0 !== s && 1 === s.length; i && (t = e.get(s)), void 0 === t && ((this.i = t = new CSSStyleSheet).replaceSync(this.cssText), i && e.set(s, t)) } return t } toString() { return this.cssText } } const o = t => new n("string" == typeof t ? t : t + "", void 0, s), r = (t, ...i) => { const e = 1 === t.length ? t[0] : i.reduce(((i, s, e) => i + (t => { if (!0 === t._$cssResult$) return t.cssText; if ("number" == typeof t) return t; throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.") })(s) + t[e + 1]), t[0]); return new n(e, t, s) }, l = (s, e) => { i ? s.adoptedStyleSheets = e.map((t => t instanceof CSSStyleSheet ? t : t.styleSheet)) : e.forEach((i => { const e = document.createElement("style"), n = t.litNonce; void 0 !== n && e.setAttribute("nonce", n), e.textContent = i.cssText, s.appendChild(e) })) }, h = i ? t => t : t => t instanceof CSSStyleSheet ? (t => { let i = ""; for (const s of t.cssRules) i += s.cssText; return o(i) })(t) : t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */; var u; const c = window, a = c.trustedTypes, d = a ? a.emptyScript : "", v = c.reactiveElementPolyfillSupport, f = { toAttribute(t, i) { switch (i) { case Boolean: t = t ? d : null; break; case Object: case Array: t = null == t ? t : JSON.stringify(t) }return t }, fromAttribute(t, i) { let s = t; switch (i) { case Boolean: s = null !== t; break; case Number: s = null === t ? null : Number(t); break; case Object: case Array: try { s = JSON.parse(t) } catch (t) { s = null } }return s } }, p = (t, i) => i !== t && (i == i || t == t), y = { attribute: !0, type: String, converter: f, reflect: !1, hasChanged: p }; class b extends HTMLElement { constructor() { super(), this.o = new Map, this.isUpdatePending = !1, this.hasUpdated = !1, this.l = null, this.u() } static addInitializer(t) { var i; this.finalize(), (null !== (i = this.v) && void 0 !== i ? i : this.v = []).push(t) } static get observedAttributes() { this.finalize(); const t = []; return this.elementProperties.forEach(((i, s) => { const e = this.p(s, i); void 0 !== e && (this.m.set(e, s), t.push(e)) })), t } static createProperty(t, i = y) { if (i.state && (i.attribute = !1), this.finalize(), this.elementProperties.set(t, i), !i.noAccessor && !this.prototype.hasOwnProperty(t)) { const s = "symbol" == typeof t ? Symbol() : "__" + t, e = this.getPropertyDescriptor(t, s, i); void 0 !== e && Object.defineProperty(this.prototype, t, e) } } static getPropertyDescriptor(t, i, s) { return { get() { return this[i] }, set(e) { const n = this[t]; this[i] = e, this.requestUpdate(t, n, s) }, configurable: !0, enumerable: !0 } } static getPropertyOptions(t) { return this.elementProperties.get(t) || y } static finalize() { if (this.hasOwnProperty("finalized")) return !1; this.finalized = !0; const t = Object.getPrototypeOf(this); if (t.finalize(), void 0 !== t.v && (this.v = [...t.v]), this.elementProperties = new Map(t.elementProperties), this.m = new Map, this.hasOwnProperty("properties")) { const t = this.properties, i = [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)]; for (const s of i) this.createProperty(s, t[s]) } return this.elementStyles = this.finalizeStyles(this.styles), !0 } static finalizeStyles(t) { const i = []; if (Array.isArray(t)) { const s = new Set(t.flat(1 / 0).reverse()); for (const t of s) i.unshift(h(t)) } else void 0 !== t && i.push(h(t)); return i } static p(t, i) { const s = i.attribute; return !1 === s ? void 0 : "string" == typeof s ? s : "string" == typeof t ? t.toLowerCase() : void 0 } u() { var t; this._ = new Promise((t => this.enableUpdating = t)), this._$AL = new Map, this.g(), this.requestUpdate(), null === (t = this.constructor.v) || void 0 === t || t.forEach((t => t(this))) } addController(t) { var i, s; (null !== (i = this.S) && void 0 !== i ? i : this.S = []).push(t), void 0 !== this.renderRoot && this.isConnected && (null === (s = t.hostConnected) || void 0 === s || s.call(t)) } removeController(t) { var i; null === (i = this.S) || void 0 === i || i.splice(this.S.indexOf(t) >>> 0, 1) } g() { this.constructor.elementProperties.forEach(((t, i) => { this.hasOwnProperty(i) && (this.o.set(i, this[i]), delete this[i]) })) } createRenderRoot() { var t; const i = null !== (t = this.shadowRoot) && void 0 !== t ? t : this.attachShadow(this.constructor.shadowRootOptions); return l(i, this.constructor.elementStyles), i } connectedCallback() { var t; void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), null === (t = this.S) || void 0 === t || t.forEach((t => { var i; return null === (i = t.hostConnected) || void 0 === i ? void 0 : i.call(t) })) } enableUpdating(t) { } disconnectedCallback() { var t; null === (t = this.S) || void 0 === t || t.forEach((t => { var i; return null === (i = t.hostDisconnected) || void 0 === i ? void 0 : i.call(t) })) } attributeChangedCallback(t, i, s) { this._$AK(t, s) } $(t, i, s = y) { var e; const n = this.constructor.p(t, s); if (void 0 !== n && !0 === s.reflect) { const o = (void 0 !== (null === (e = s.converter) || void 0 === e ? void 0 : e.toAttribute) ? s.converter : f).toAttribute(i, s.type); this.l = t, null == o ? this.removeAttribute(n) : this.setAttribute(n, o), this.l = null } } _$AK(t, i) { var s; const e = this.constructor, n = e.m.get(t); if (void 0 !== n && this.l !== n) { const t = e.getPropertyOptions(n), o = "function" == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== (null === (s = t.converter) || void 0 === s ? void 0 : s.fromAttribute) ? t.converter : f; this.l = n, this[n] = o.fromAttribute(i, t.type), this.l = null } } requestUpdate(t, i, s) { let e = !0; void 0 !== t && (((s = s || this.constructor.getPropertyOptions(t)).hasChanged || p)(this[t], i) ? (this._$AL.has(t) || this._$AL.set(t, i), !0 === s.reflect && this.l !== t && (void 0 === this.C && (this.C = new Map), this.C.set(t, s))) : e = !1), !this.isUpdatePending && e && (this._ = this.T()) } async T() { this.isUpdatePending = !0; try { await this._ } catch (t) { Promise.reject(t) } const t = this.scheduleUpdate(); return null != t && await t, !this.isUpdatePending } scheduleUpdate() { return this.performUpdate() } performUpdate() { var t; if (!this.isUpdatePending) return; this.hasUpdated, this.o && (this.o.forEach(((t, i) => this[i] = t)), this.o = void 0); let i = !1; const s = this._$AL; try { i = this.shouldUpdate(s), i ? (this.willUpdate(s), null === (t = this.S) || void 0 === t || t.forEach((t => { var i; return null === (i = t.hostUpdate) || void 0 === i ? void 0 : i.call(t) })), this.update(s)) : this.P() } catch (t) { throw i = !1, this.P(), t } i && this._$AE(s) } willUpdate(t) { } _$AE(t) { var i; null === (i = this.S) || void 0 === i || i.forEach((t => { var i; return null === (i = t.hostUpdated) || void 0 === i ? void 0 : i.call(t) })), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t) } P() { this._$AL = new Map, this.isUpdatePending = !1 } get updateComplete() { return this.getUpdateComplete() } getUpdateComplete() { return this._ } shouldUpdate(t) { return !0 } update(t) { void 0 !== this.C && (this.C.forEach(((t, i) => this.$(i, this[i], t))), this.C = void 0), this.P() } updated(t) { } firstUpdated(t) { } }
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var m; b.finalized = !0, b.elementProperties = new Map, b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, null == v || v({ ReactiveElement: b }), (null !== (u = c.reactiveElementVersions) && void 0 !== u ? u : c.reactiveElementVersions = []).push("1.6.1"); const g = window, w = g.trustedTypes, _ = w ? w.createPolicy("lit-html", { createHTML: t => t }) : void 0, $ = `lit$${(Math.random() + "").slice(9)}$`, S = "?" + $, T = `<${S}>`, x = document, E = (t = "") => x.createComment(t), C = t => null === t || "object" != typeof t && "function" != typeof t, A = Array.isArray, k = t => A(t) || "function" == typeof (null == t ? void 0 : t[Symbol.iterator]), M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, P = /-->/g, U = />/g, V = RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)", "g"), R = /'/g, N = /"/g, O = /^(?:script|style|textarea|title)$/i, L = t => (i, ...s) => ({ _$litType$: t, strings: i, values: s }), j = L(1), z = L(2), H = Symbol.for("lit-noChange"), I = Symbol.for("lit-nothing"), B = new WeakMap, D = x.createTreeWalker(x, 129, null, !1), W = (t, i) => { const s = t.length - 1, e = []; let n, o = 2 === i ? "<svg>" : "", r = M; for (let i = 0; i < s; i++) { const s = t[i]; let l, h, u = -1, c = 0; for (; c < s.length && (r.lastIndex = c, h = r.exec(s), null !== h);)c = r.lastIndex, r === M ? "!--" === h[1] ? r = P : void 0 !== h[1] ? r = U : void 0 !== h[2] ? (O.test(h[2]) && (n = RegExp("</" + h[2], "g")), r = V) : void 0 !== h[3] && (r = V) : r === V ? ">" === h[0] ? (r = null != n ? n : M, u = -1) : void 0 === h[1] ? u = -2 : (u = r.lastIndex - h[2].length, l = h[1], r = void 0 === h[3] ? V : '"' === h[3] ? N : R) : r === N || r === R ? r = V : r === P || r === U ? r = M : (r = V, n = void 0); const a = r === V && t[i + 1].startsWith("/>") ? " " : ""; o += r === M ? s + T : u >= 0 ? (e.push(l), s.slice(0, u) + "$lit$" + s.slice(u) + $ + a) : s + $ + (-2 === u ? (e.push(void 0), i) : a) } const l = o + (t[s] || "<?>") + (2 === i ? "</svg>" : ""); if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array"); return [void 0 !== _ ? _.createHTML(l) : l, e] }; class Z { constructor({ strings: t, _$litType$: i }, s) { let e; this.parts = []; let n = 0, o = 0; const r = t.length - 1, l = this.parts, [h, u] = W(t, i); if (this.el = Z.createElement(h, s), D.currentNode = this.el.content, 2 === i) { const t = this.el.content, i = t.firstChild; i.remove(), t.append(...i.childNodes) } for (; null !== (e = D.nextNode()) && l.length < r;) { if (1 === e.nodeType) { if (e.hasAttributes()) { const t = []; for (const i of e.getAttributeNames()) if (i.endsWith("$lit$") || i.startsWith($)) { const s = u[o++]; if (t.push(i), void 0 !== s) { const t = e.getAttribute(s.toLowerCase() + "$lit$").split($), i = /([.?@])?(.*)/.exec(s); l.push({ type: 1, index: n, name: i[2], strings: t, ctor: "." === i[1] ? K : "?" === i[1] ? Q : "@" === i[1] ? X : J }) } else l.push({ type: 6, index: n }) } for (const i of t) e.removeAttribute(i) } if (O.test(e.tagName)) { const t = e.textContent.split($), i = t.length - 1; if (i > 0) { e.textContent = w ? w.emptyScript : ""; for (let s = 0; s < i; s++)e.append(t[s], E()), D.nextNode(), l.push({ type: 2, index: ++n }); e.append(t[i], E()) } } } else if (8 === e.nodeType) if (e.data === S) l.push({ type: 2, index: n }); else { let t = -1; for (; -1 !== (t = e.data.indexOf($, t + 1));)l.push({ type: 7, index: n }), t += $.length - 1 } n++ } } static createElement(t, i) { const s = x.createElement("template"); return s.innerHTML = t, s } } function q(t, i, s = t, e) { var n, o, r, l; if (i === H) return i; let h = void 0 !== e ? null === (n = s.A) || void 0 === n ? void 0 : n[e] : s.k; const u = C(i) ? void 0 : i._$litDirective$; return (null == h ? void 0 : h.constructor) !== u && (null === (o = null == h ? void 0 : h._$AO) || void 0 === o || o.call(h, !1), void 0 === u ? h = void 0 : (h = new u(t), h._$AT(t, s, e)), void 0 !== e ? (null !== (r = (l = s).A) && void 0 !== r ? r : l.A = [])[e] = h : s.k = h), void 0 !== h && (i = q(t, h._$AS(t, i.values), h, e)), i } class F { constructor(t, i) { this.M = [], this._$AN = void 0, this._$AD = t, this._$AM = i } get parentNode() { return this._$AM.parentNode } get _$AU() { return this._$AM._$AU } U(t) { var i; const { el: { content: s }, parts: e } = this._$AD, n = (null !== (i = null == t ? void 0 : t.creationScope) && void 0 !== i ? i : x).importNode(s, !0); D.currentNode = n; let o = D.nextNode(), r = 0, l = 0, h = e[0]; for (; void 0 !== h;) { if (r === h.index) { let i; 2 === h.type ? i = new G(o, o.nextSibling, this, t) : 1 === h.type ? i = new h.ctor(o, h.name, h.strings, this, t) : 6 === h.type && (i = new tt(o, this, t)), this.M.push(i), h = e[++l] } r !== (null == h ? void 0 : h.index) && (o = D.nextNode(), r++) } return n } N(t) { let i = 0; for (const s of this.M) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++ } } class G { constructor(t, i, s, e) { var n; this.type = 2, this._$AH = I, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this.R = null === (n = null == e ? void 0 : e.isConnected) || void 0 === n || n } get _$AU() { var t, i; return null !== (i = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) && void 0 !== i ? i : this.R } get parentNode() { let t = this._$AA.parentNode; const i = this._$AM; return void 0 !== i && 11 === t.nodeType && (t = i.parentNode), t } get startNode() { return this._$AA } get endNode() { return this._$AB } _$AI(t, i = this) { t = q(this, t, i), C(t) ? t === I || null == t || "" === t ? (this._$AH !== I && this._$AR(), this._$AH = I) : t !== this._$AH && t !== H && this.O(t) : void 0 !== t._$litType$ ? this.V(t) : void 0 !== t.nodeType ? this.j(t) : k(t) ? this.L(t) : this.O(t) } I(t, i = this._$AB) { return this._$AA.parentNode.insertBefore(t, i) } j(t) { this._$AH !== t && (this._$AR(), this._$AH = this.I(t)) } O(t) { this._$AH !== I && C(this._$AH) ? this._$AA.nextSibling.data = t : this.j(x.createTextNode(t)), this._$AH = t } V(t) { var i; const { values: s, _$litType$: e } = t, n = "number" == typeof e ? this._$AC(t) : (void 0 === e.el && (e.el = Z.createElement(e.h, this.options)), e); if ((null === (i = this._$AH) || void 0 === i ? void 0 : i._$AD) === n) this._$AH.N(s); else { const t = new F(n, this), i = t.U(this.options); t.N(s), this.j(i), this._$AH = t } } _$AC(t) { let i = B.get(t.strings); return void 0 === i && B.set(t.strings, i = new Z(t)), i } L(t) { A(this._$AH) || (this._$AH = [], this._$AR()); const i = this._$AH; let s, e = 0; for (const n of t) e === i.length ? i.push(s = new G(this.I(E()), this.I(E()), this, this.options)) : s = i[e], s._$AI(n), e++; e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e) } _$AR(t = this._$AA.nextSibling, i) { var s; for (null === (s = this._$AP) || void 0 === s || s.call(this, !1, !0, i); t && t !== this._$AB;) { const i = t.nextSibling; t.remove(), t = i } } setConnected(t) { var i; void 0 === this._$AM && (this.R = t, null === (i = this._$AP) || void 0 === i || i.call(this, t)) } } class J { constructor(t, i, s, e, n) { this.type = 1, this._$AH = I, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = n, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String), this.strings = s) : this._$AH = I } get tagName() { return this.element.tagName } get _$AU() { return this._$AM._$AU } _$AI(t, i = this, s, e) { const n = this.strings; let o = !1; if (void 0 === n) t = q(this, t, i, 0), o = !C(t) || t !== this._$AH && t !== H, o && (this._$AH = t); else { const e = t; let r, l; for (t = n[0], r = 0; r < n.length - 1; r++)l = q(this, e[s + r], i, r), l === H && (l = this._$AH[r]), o || (o = !C(l) || l !== this._$AH[r]), l === I ? t = I : t !== I && (t += (null != l ? l : "") + n[r + 1]), this._$AH[r] = l } o && !e && this.H(t) } H(t) { t === I ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t ? t : "") } } class K extends J { constructor() { super(...arguments), this.type = 3 } H(t) { this.element[this.name] = t === I ? void 0 : t } } const Y = w ? w.emptyScript : ""; class Q extends J { constructor() { super(...arguments), this.type = 4 } H(t) { t && t !== I ? this.element.setAttribute(this.name, Y) : this.element.removeAttribute(this.name) } } class X extends J { constructor(t, i, s, e, n) { super(t, i, s, e, n), this.type = 5 } _$AI(t, i = this) { var s; if ((t = null !== (s = q(this, t, i, 0)) && void 0 !== s ? s : I) === H) return; const e = this._$AH, n = t === I && e !== I || t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive, o = t !== I && (e === I || n); n && this.element.removeEventListener(this.name, this, e), o && this.element.addEventListener(this.name, this, t), this._$AH = t } handleEvent(t) { var i, s; "function" == typeof this._$AH ? this._$AH.call(null !== (s = null === (i = this.options) || void 0 === i ? void 0 : i.host) && void 0 !== s ? s : this.element, t) : this._$AH.handleEvent(t) } } class tt { constructor(t, i, s) { this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s } get _$AU() { return this._$AM._$AU } _$AI(t) { q(this, t) } } const it = { B: "$lit$", D: $, q: S, J: 1, W, Z: F, F: k, G: q, K: G, X: J, Y: Q, tt: X, it: K, st: tt }, st = g.litHtmlPolyfillSupport; null == st || st(Z, G), (null !== (m = g.litHtmlVersions) && void 0 !== m ? m : g.litHtmlVersions = []).push("2.6.1"); const et = (t, i, s) => { var e, n; const o = null !== (e = null == s ? void 0 : s.renderBefore) && void 0 !== e ? e : i; let r = o._$litPart$; if (void 0 === r) { const t = null !== (n = null == s ? void 0 : s.renderBefore) && void 0 !== n ? n : null; o._$litPart$ = r = new G(i.insertBefore(E(), t), t, void 0, null != s ? s : {}) } return r._$AI(t), r };
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var nt, ot; const rt = b; class lt extends b { constructor() { super(...arguments), this.renderOptions = { host: this }, this.et = void 0 } createRenderRoot() { var t, i; const s = super.createRenderRoot(); return null !== (t = (i = this.renderOptions).renderBefore) && void 0 !== t || (i.renderBefore = s.firstChild), s } update(t) { const i = this.render(); this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this.et = et(i, this.renderRoot, this.renderOptions) } connectedCallback() { var t; super.connectedCallback(), null === (t = this.et) || void 0 === t || t.setConnected(!0) } disconnectedCallback() { var t; super.disconnectedCallback(), null === (t = this.et) || void 0 === t || t.setConnected(!1) } render() { return H } } lt.finalized = !0, lt._$litElement$ = !0, null === (nt = globalThis.litElementHydrateSupport) || void 0 === nt || nt.call(globalThis, { LitElement: lt }); const ht = globalThis.litElementPolyfillSupport; null == ht || ht({ LitElement: lt }); const ut = { _$AK: (t, i, s) => { t._$AK(i, s) }, _$AL: t => t._$AL }; (null !== (ot = globalThis.litElementVersions) && void 0 !== ot ? ot : globalThis.litElementVersions = []).push("3.2.2");
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct = !1, { K: at } = it, dt = t => null === t || "object" != typeof t && "function" != typeof t, vt = { HTML: 1, SVG: 2 }, ft = (t, i) => void 0 === i ? void 0 !== (null == t ? void 0 : t._$litType$) : (null == t ? void 0 : t._$litType$) === i, pt = t => void 0 !== (null == t ? void 0 : t._$litDirective$), yt = t => null == t ? void 0 : t._$litDirective$, bt = t => void 0 === t.strings, mt = () => document.createComment(""), gt = (t, i, s) => { var e; const n = t._$AA.parentNode, o = void 0 === i ? t._$AB : i._$AA; if (void 0 === s) { const i = n.insertBefore(mt(), o), e = n.insertBefore(mt(), o); s = new at(i, e, t, t.options) } else { const i = s._$AB.nextSibling, r = s._$AM, l = r !== t; if (l) { let i; null === (e = s._$AQ) || void 0 === e || e.call(s, t), s._$AM = t, void 0 !== s._$AP && (i = t._$AU) !== r._$AU && s._$AP(i) } if (i !== o || l) { let t = s._$AA; for (; t !== i;) { const i = t.nextSibling; n.insertBefore(t, o), t = i } } } return s }, wt = (t, i, s = t) => (t._$AI(i, s), t), _t = {}, $t = (t, i = _t) => t._$AH = i, St = t => t._$AH, Tt = t => { var i; null === (i = t._$AP) || void 0 === i || i.call(t, !1, !0); let s = t._$AA; const e = t._$AB.nextSibling; for (; s !== e;) { const t = s.nextSibling; s.remove(), s = t } }, xt = t => { t._$AR() }, Et = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, Ct = t => (...i) => ({ _$litDirective$: t, values: i }); class At { constructor(t) { } get _$AU() { return this._$AM._$AU } _$AT(t, i, s) { this.nt = t, this._$AM = i, this.ot = s } _$AS(t, i) { return this.update(t, i) } update(t, i) { return this.render(...i) } }
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt = (t, i) => { var s, e; const n = t._$AN; if (void 0 === n) return !1; for (const t of n) null === (e = (s = t)._$AO) || void 0 === e || e.call(s, i, !1), kt(t, i); return !0 }, Mt = t => { let i, s; do { if (void 0 === (i = t._$AM)) break; s = i._$AN, s.delete(t), t = i } while (0 === (null == s ? void 0 : s.size)) }, Pt = t => { for (let i; i = t._$AM; t = i) { let s = i._$AN; if (void 0 === s) i._$AN = s = new Set; else if (s.has(t)) break; s.add(t), Rt(i) } }; function Ut(t) { void 0 !== this._$AN ? (Mt(this), this._$AM = t, Pt(this)) : this._$AM = t } function Vt(t, i = !1, s = 0) { const e = this._$AH, n = this._$AN; if (void 0 !== n && 0 !== n.size) if (i) if (Array.isArray(e)) for (let t = s; t < e.length; t++)kt(e[t], !1), Mt(e[t]); else null != e && (kt(e, !1), Mt(e)); else kt(this, t) } const Rt = t => { var i, s, e, n; 2 == t.type && (null !== (i = (e = t)._$AP) && void 0 !== i || (e._$AP = Vt), null !== (s = (n = t)._$AQ) && void 0 !== s || (n._$AQ = Ut)) }; class Nt extends At { constructor() { super(...arguments), this._$AN = void 0 } _$AT(t, i, s) { super._$AT(t, i, s), Pt(this), this.isConnected = t._$AU } _$AO(t, i = !0) { var s, e; t !== this.isConnected && (this.isConnected = t, t ? null === (s = this.reconnected) || void 0 === s || s.call(this) : null === (e = this.disconnected) || void 0 === e || e.call(this)), i && (kt(this, t), Mt(this)) } setValue(t) { if (bt(this.nt)) this.nt._$AI(t, this); else { const i = [...this.nt._$AH]; i[this.ot] = t, this.nt._$AI(i, this, 0) } } disconnected() { } reconnected() { } }
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Ot { constructor(t) { this.rt = t } disconnect() { this.rt = void 0 } reconnect(t) { this.rt = t } deref() { return this.rt } } class Lt { constructor() { this.lt = void 0, this.ht = void 0 } get() { return this.lt } pause() { var t; null !== (t = this.lt) && void 0 !== t || (this.lt = new Promise((t => this.ht = t))) } resume() { var t; null === (t = this.ht) || void 0 === t || t.call(this), this.lt = this.ht = void 0 } }
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class jt extends Nt { constructor() { super(...arguments), this.ut = new Ot(this), this.ct = new Lt } render(t, i) { return H } update(t, [i, s]) { if (this.isConnected || this.disconnected(), i === this.dt) return; this.dt = i; let e = 0; const { ut: n, ct: o } = this; return (async (t, i) => { for await (const s of t) if (!1 === await i(s)) return })(i, (async t => { for (; o.get();)await o.get(); const r = n.deref(); if (void 0 !== r) { if (r.dt !== i) return !1; void 0 !== s && (t = s(t, e)), r.commitValue(t, e), e++ } return !0 })), H } commitValue(t, i) { this.setValue(t) } disconnected() { this.ut.disconnect(), this.ct.pause() } reconnected() { this.ut.reconnect(this), this.ct.resume() } } const zt = Ct(jt), Ht = Ct(
    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    class extends jt { constructor(t) { if (super(t), 2 !== t.type) throw Error("asyncAppend can only be used in child expressions") } update(t, i) { return this.et = t, super.update(t, i) } commitValue(t, i) { 0 === i && xt(this.et); const s = gt(this.et); wt(s, t) } }), It = Ct(
        /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        class extends At { constructor(t) { super(t), this.vt = new WeakMap } render(t) { return [t] } update(t, [i]) { if (ft(this.ft) && (!ft(i) || this.ft.strings !== i.strings)) { const i = St(t).pop(); let s = this.vt.get(this.ft.strings); if (void 0 === s) { const t = document.createDocumentFragment(); s = et(I, t), s.setConnected(!1), this.vt.set(this.ft.strings, s) } $t(s, [i]), gt(s, void 0, i) } if (ft(i)) { if (!ft(this.ft) || this.ft.strings !== i.strings) { const s = this.vt.get(i.strings); if (void 0 !== s) { const i = St(s).pop(); xt(t), gt(t, void 0, i), $t(t, [i]) } } this.ft = i } else this.ft = void 0; return this.render(i) } }), Bt = (t, i, s) => { for (const s of i) if (s[0] === t) return (0, s[1])(); return null == s ? void 0 : s() }, Dt = Ct(
            /**
             * @license
             * Copyright 2018 Google LLC
             * SPDX-License-Identifier: BSD-3-Clause
             */
            class extends At { constructor(t) { var i; if (super(t), 1 !== t.type || "class" !== t.name || (null === (i = t.strings) || void 0 === i ? void 0 : i.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.") } render(t) { return " " + Object.keys(t).filter((i => t[i])).join(" ") + " " } update(t, [i]) { var s, e; if (void 0 === this.yt) { this.yt = new Set, void 0 !== t.strings && (this.bt = new Set(t.strings.join(" ").split(/\s/).filter((t => "" !== t)))); for (const t in i) i[t] && !(null === (s = this.bt) || void 0 === s ? void 0 : s.has(t)) && this.yt.add(t); return this.render(i) } const n = t.element.classList; this.yt.forEach((t => { t in i || (n.remove(t), this.yt.delete(t)) })); for (const t in i) { const s = !!i[t]; s === this.yt.has(t) || (null === (e = this.bt) || void 0 === e ? void 0 : e.has(t)) || (s ? (n.add(t), this.yt.add(t)) : (n.remove(t), this.yt.delete(t))) } return H } }), Wt = {}, Zt = Ct(class extends At { constructor() { super(...arguments), this.gt = Wt } render(t, i) { return i() } update(t, [i, s]) { if (Array.isArray(i)) { if (Array.isArray(this.gt) && this.gt.length === i.length && i.every(((t, i) => t === this.gt[i]))) return H } else if (this.gt === i) return H; return this.gt = Array.isArray(i) ? Array.from(i) : i, this.render(i, s) } }), qt = t => null != t ? t : I
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */; function* Ft(t, i) { const s = "function" == typeof i; if (void 0 !== t) { let e = -1; for (const n of t) e > -1 && (yield s ? i(e) : i), e++, yield n } }
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Gt = Ct(class extends At { constructor() { super(...arguments), this.key = I } render(t, i) { return this.key = t, i } update(t, [i, s]) { return i !== this.key && ($t(t), this.key = i), s } }), Jt = Ct(
                /**
                 * @license
                 * Copyright 2020 Google LLC
                 * SPDX-License-Identifier: BSD-3-Clause
                 */
                class extends At { constructor(t) { if (super(t), 3 !== t.type && 1 !== t.type && 4 !== t.type) throw Error("The `live` directive is not allowed on child or event bindings"); if (!bt(t)) throw Error("`live` bindings can only contain a single expression") } render(t) { return t } update(t, [i]) { if (i === H || i === I) return i; const s = t.element, e = t.name; if (3 === t.type) { if (i === s[e]) return H } else if (4 === t.type) { if (!!i === s.hasAttribute(e)) return H } else if (1 === t.type && s.getAttribute(e) === i + "") return H; return $t(t), i } });
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function* Kt(t, i) { if (void 0 !== t) { let s = 0; for (const e of t) yield i(e, s++) } }
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function* Yt(t, i, s = 1) { const e = void 0 === i ? 0 : t; null != i || (i = t); for (let t = e; s > 0 ? t < i : i < t; t += s)yield t }
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Qt = () => new Xt; class Xt { } const ti = new WeakMap, ii = Ct(class extends Nt { render(t) { return I } update(t, [i]) { var s; const e = i !== this.rt; return e && void 0 !== this.rt && this.wt(void 0), (e || this._t !== this.$t) && (this.rt = i, this.St = null === (s = t.options) || void 0 === s ? void 0 : s.host, this.wt(this.$t = t.element)), I } wt(t) { var i; if ("function" == typeof this.rt) { const s = null !== (i = this.St) && void 0 !== i ? i : globalThis; let e = ti.get(s); void 0 === e && (e = new WeakMap, ti.set(s, e)), void 0 !== e.get(this.rt) && this.rt.call(this.St, void 0), e.set(this.rt, t), void 0 !== t && this.rt.call(this.St, t) } else this.rt.value = t } get _t() { var t, i, s; return "function" == typeof this.rt ? null === (i = ti.get(null !== (t = this.St) && void 0 !== t ? t : globalThis)) || void 0 === i ? void 0 : i.get(this.rt) : null === (s = this.rt) || void 0 === s ? void 0 : s.value } disconnected() { this._t === this.$t && this.wt(void 0) } reconnected() { this.wt(this.$t) } }), si = (t, i, s) => { const e = new Map; for (let n = i; n <= s; n++)e.set(t[n], n); return e }, ei = Ct(class extends At { constructor(t) { if (super(t), 2 !== t.type) throw Error("repeat() can only be used in text expressions") } Tt(t, i, s) { let e; void 0 === s ? s = i : void 0 !== i && (e = i); const n = [], o = []; let r = 0; for (const i of t) n[r] = e ? e(i, r) : r, o[r] = s(i, r), r++; return { values: o, keys: n } } render(t, i, s) { return this.Tt(t, i, s).values } update(t, [i, s, e]) { var n; const o = St(t), { values: r, keys: l } = this.Tt(i, s, e); if (!Array.isArray(o)) return this.xt = l, r; const h = null !== (n = this.xt) && void 0 !== n ? n : this.xt = [], u = []; let c, a, d = 0, v = o.length - 1, f = 0, p = r.length - 1; for (; d <= v && f <= p;)if (null === o[d]) d++; else if (null === o[v]) v--; else if (h[d] === l[f]) u[f] = wt(o[d], r[f]), d++, f++; else if (h[v] === l[p]) u[p] = wt(o[v], r[p]), v--, p--; else if (h[d] === l[p]) u[p] = wt(o[d], r[p]), gt(t, u[p + 1], o[d]), d++, p--; else if (h[v] === l[f]) u[f] = wt(o[v], r[f]), gt(t, o[d], o[v]), v--, f++; else if (void 0 === c && (c = si(l, f, p), a = si(h, d, v)), c.has(h[d])) if (c.has(h[v])) { const i = a.get(l[f]), s = void 0 !== i ? o[i] : null; if (null === s) { const i = gt(t, o[d]); wt(i, r[f]), u[f] = i } else u[f] = wt(s, r[f]), gt(t, o[d], s), o[i] = null; f++ } else Tt(o[v]), v--; else Tt(o[d]), d++; for (; f <= p;) { const i = gt(t, u[p + 1]); wt(i, r[f]), u[f++] = i } for (; d <= v;) { const t = o[d++]; null !== t && Tt(t) } return this.xt = l, $t(t, u), H } }), ni = Ct(
    /**
     * @license
     * Copyright 2018 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    class extends At { constructor(t) { var i; if (super(t), 1 !== t.type || "style" !== t.name || (null === (i = t.strings) || void 0 === i ? void 0 : i.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.") } render(t) { return Object.keys(t).reduce(((i, s) => { const e = t[s]; return null == e ? i : i + `${s = s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${e};` }), "") } update(t, [i]) { const { style: s } = t.element; if (void 0 === this.Et) { this.Et = new Set; for (const t in i) this.Et.add(t); return this.render(i) } this.Et.forEach((t => { null == i[t] && (this.Et.delete(t), t.includes("-") ? s.removeProperty(t) : s[t] = "") })); for (const t in i) { const e = i[t]; null != e && (this.Et.add(t), t.includes("-") ? s.setProperty(t, e) : s[t] = e) } return H } }), oi = Ct(
        /**
         * @license
         * Copyright 2020 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        class extends At { constructor(t) { if (super(t), 2 !== t.type) throw Error("templateContent can only be used in child bindings") } render(t) { return this.Ct === t ? H : (this.Ct = t, document.importNode(t.content, !0)) } }); class ri extends At { constructor(t) { if (super(t), this.ft = I, 2 !== t.type) throw Error(this.constructor.directiveName + "() can only be used in child bindings") } render(t) { if (t === I || null == t) return this.At = void 0, this.ft = t; if (t === H) return t; if ("string" != typeof t) throw Error(this.constructor.directiveName + "() called with a non-string value"); if (t === this.ft) return this.At; this.ft = t; const i = [t]; return i.raw = i, this.At = { _$litType$: this.constructor.resultType, strings: i, values: [] } } } ri.directiveName = "unsafeHTML", ri.resultType = 1; const li = Ct(ri);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class hi extends ri { } hi.directiveName = "unsafeSVG", hi.resultType = 2; const ui = Ct(hi), ci = t => !dt(t) && "function" == typeof t.then;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ai extends Nt { constructor() { super(...arguments), this.kt = 1073741823, this.Mt = [], this.ut = new Ot(this), this.ct = new Lt } render(...t) { var i; return null !== (i = t.find((t => !ci(t)))) && void 0 !== i ? i : H } update(t, i) { const s = this.Mt; let e = s.length; this.Mt = i; const n = this.ut, o = this.ct; this.isConnected || this.disconnected(); for (let t = 0; t < i.length && !(t > this.kt); t++) { const r = i[t]; if (!ci(r)) return this.kt = t, r; t < e && r === s[t] || (this.kt = 1073741823, e = 0, Promise.resolve(r).then((async t => { for (; o.get();)await o.get(); const i = n.deref(); if (void 0 !== i) { const s = i.Mt.indexOf(r); s > -1 && s < i.kt && (i.kt = s, i.setValue(t)) } }))) } return H } disconnected() { this.ut.disconnect(), this.ct.pause() } reconnected() { this.ut.reconnect(this), this.ct.resume() } } const di = Ct(ai);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function vi(t, i, s) { return t ? i() : null == s ? void 0 : s() }
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const fi = Symbol.for(""), pi = t => { if ((null == t ? void 0 : t.r) === fi) return null == t ? void 0 : t._$litStatic$ }, yi = t => ({ _$litStatic$: t, r: fi }), bi = (t, ...i) => ({ _$litStatic$: i.reduce(((i, s, e) => i + (t => { if (void 0 !== t._$litStatic$) return t._$litStatic$; throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`) })(s) + t[e + 1]), t[0]), r: fi }), mi = new Map, gi = t => (i, ...s) => { const e = s.length; let n, o; const r = [], l = []; let h, u = 0, c = !1; for (; u < e;) { for (h = i[u]; u < e && void 0 !== (o = s[u], n = pi(o));)h += n + i[++u], c = !0; l.push(o), r.push(h), u++ } if (u === e && r.push(i[e]), c) { const t = r.join("$$lit$$"); void 0 === (i = mi.get(t)) && (r.raw = r, mi.set(t, i = r)), s = l } return t(i, ...s) }, wi = gi(j), _i = gi(z);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
window.litDisableBundleWarning || console.warn("Lit has been loaded from a bundle that combines all core features into a single file. To reduce transfer size and parsing cost, consider using the `lit` npm package directly in your project."); export { Nt as AsyncDirective, jt as AsyncReplaceDirective, n as CSSResult, At as Directive, lt as LitElement, Et as PartType, b as ReactiveElement, vt as TemplateResultType, ri as UnsafeHTMLDirective, ai as UntilDirective, rt as UpdatingElement, ut as _$LE, it as _$LH, l as adoptStyles, Ht as asyncAppend, zt as asyncReplace, It as cache, Bt as choose, Dt as classMap, xt as clearPart, Qt as createRef, r as css, f as defaultConverter, Ct as directive, St as getCommittedValue, h as getCompatibleStyle, yt as getDirectiveClass, Zt as guard, j as html, qt as ifDefined, gt as insertPart, pt as isDirectiveResult, dt as isPrimitive, ct as isServer, bt as isSingleExpression, ft as isTemplateResult, Ft as join, Gt as keyed, bi as literal, Jt as live, Kt as map, H as noChange, p as notEqual, I as nothing, Yt as range, ii as ref, Tt as removePart, et as render, ei as repeat, wt as setChildPartValue, $t as setCommittedValue, wi as staticHtml, _i as staticSvg, ni as styleMap, i as supportsAdoptingStyleSheets, z as svg, oi as templateContent, o as unsafeCSS, li as unsafeHTML, ui as unsafeSVG, yi as unsafeStatic, di as until, vi as when, gi as withStatic };
//# sourceMappingURL=lit-all.min.js.map