// Raymarched ASCII objects for the Orbit panel. Each scene is a set of SDF parts
// plus a material (albedo) function. Ported from `orbit-shapes.js`.
import { startObject } from "./object";

export const PARAM = ["globe", "torus", "cube", "knot", "mobius", "helix"];
export const POOL = ["arya", "yuki", "miso", "misa", "headphones", "vinyl", "planet", "heart", "buddy", "globe", "torus", "knot", "mobius", "helix"];
export const RARE = ["allcats", "license"];
export const LABELS: Record<string, string> = {
  arya: "arya · tuxedo", yuki: "yuki · tabby cardigan", miso: "miso · chonky loaf", misa: "misa · calico, asleep",
  headphones: "headphones", vinyl: "vinyl · 33⅓ rpm",
  planet: "ringed planet", heart: "<3", buddy: "glow buddy", globe: "globe", torus: "donut",
  knot: "trefoil knot", mobius: "möbius strip", helix: "double helix",
  allcats: "★ rare · all four cats", license: "★ rare · hunter license",
};
export function pickShape(avoid: string | null) {
  const r = (a: string[]) => a[(Math.random() * a.length) | 0];
  let s = "", n = 0;
  do { s = Math.random() < 1 / 12 ? r(RARE) : r(POOL); } while (s === avoid && n++ < 20);
  return s;
}

// ---- sdf primitives ----
const hyp = Math.hypot, mx = Math.max, mn = Math.min, ab = Math.abs;
const L3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z);
const sph = (x, y, z, r) => L3(x, y, z) - r;
const box = (x, y, z, a, b, c, r = 0) => { const qx = ab(x) - a + r, qy = ab(y) - b + r, qz = ab(z) - c + r; return L3(mx(qx, 0), mx(qy, 0), mx(qz, 0)) + mn(mx(qx, qy, qz), 0) - r; };
const ell = (x, y, z, a, b, c) => { const k0 = L3(x / a, y / b, z / c), k1 = L3(x / (a * a), y / (b * b), z / (c * c)); return k1 ? k0 * (k0 - 1) / k1 : -mn(a, b, c); };
const cap = (x, y, z, ax, ay, az, bx, by, bz, r) => { const px = x - ax, py = y - ay, pz = z - az, ex = bx - ax, ey = by - ay, ez = bz - az; const h = mx(0, mn(1, (px * ex + py * ey + pz * ez) / (ex * ex + ey * ey + ez * ez))); return L3(px - ex * h, py - ey * h, pz - ez * h) - r; };
const cylY = (x, y, z, r, h) => { const dx = hyp(x, z) - r, dy = ab(y) - h; return mn(mx(dx, dy), 0) + hyp(mx(dx, 0), mx(dy, 0)); };
const smin = (a, b, k) => { const h = mx(k - ab(a - b), 0) / k; return mn(a, b) - h * h * k * .25; };
function pyr(px, py, pz, h) {
  const m2 = h * h + .25; px = ab(px); pz = ab(pz); if (pz > px) { const t = px; px = pz; pz = t; } px -= .5; pz -= .5;
  const qx = pz, qy = h * py - .5 * px, qz = h * px + .5 * py, s = mx(-qx, 0), t = mx(0, mn(1, (qy - .5 * pz) / (m2 + .25)));
  const a = m2 * (qx + s) * (qx + s) + qy * qy, b = m2 * (qx + .5 * t) * (qx + .5 * t) + (qy - m2 * t) * (qy - m2 * t);
  const d2 = mn(qy, -qx * m2 - qy * .5) > 0 ? 0 : mn(a, b);
  return Math.sqrt((d2 + qz * qz) / m2) * Math.sign(mx(qz, -py));
}
const pyrS = (x, y, z, s, h, zs = 1) => pyr(x / s, y / s, z / (s * zs), h) * s * mn(1, zs);
function heart2(px, py) { px = ab(px); if (py + px > 1) return hyp(px - .25, py - .75) - Math.SQRT2 / 4; const a = px * px + (py - 1) * (py - 1), m = .5 * mx(px + py, 0), b = (px - m) * (px - m) + (py - m) * (py - m); return Math.sqrt(mn(a, b)) * Math.sign(px - py); }
const hs = (x, y, z) => { let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1440662683); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const sm = t => t * t * (3 - 2 * t), lp = (a, b, t) => a + (b - a) * t;
function noise(x, y, z) { const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = sm(x - xi), yf = sm(y - yi), zf = sm(z - zi), c = (a, b, d) => hs(xi + a, yi + b, zi + d); return lp(lp(lp(c(0, 0, 0), c(1, 0, 0), xf), lp(c(0, 1, 0), c(1, 1, 0), xf), yf), lp(lp(c(0, 0, 1), c(1, 0, 1), xf), lp(c(0, 1, 1), c(1, 1, 1), xf), yf), zf); }

// ---- part builders ----
const S = (cx, cy, cz, r, t, h?) => ({ f: (x, y, z) => sph(x - cx, y - cy, z - cz, r), t, h });
const E = (cx, cy, cz, a, b, c, t, h?) => ({ f: (x, y, z) => ell(x - cx, y - cy, z - cz, a, b, c), t, h });
const C = (ax, ay, az, bx, by, bz, r, t, h?) => ({ f: (x, y, z) => cap(x, y, z, ax, ay, az, bx, by, bz, r), t, h });
const B = (cx, cy, cz, a, b, c, r, t, h?) => ({ f: (x, y, z) => box(x - cx, y - cy, z - cz, a, b, c, r), t, h });
const F = (f, t, h?) => ({ f, t, h });
function parts(list, mat, k = .05, extra = {}) {
  const n = list.length;
  return { ...extra,
    d(x, y, z, T) { let d = 1e9; for (let i = 0; i < n; i++) { const p = list[i], v = p.f(x, y, z, T); d = p.h ? mn(d, v) : smin(d, v, k); } return d; },
    m(x, y, z, T) { let b = 1e9, tag = null; for (let i = 0; i < n; i++) { const v = list[i].f(x, y, z, T); if (v < b) { b = v; tag = list[i].t; } } return mat(tag, x, y, z, T); } };
}
function group(items, extra = {}) {
  const loc = (it, x, y, z) => [(x - it[2]) / it[1], (y - it[3]) / it[1], (z - it[4]) / it[1]];
  return { ...extra,
    d(x, y, z, T) { let d = 1e9; for (const it of items) { const s = it[1], qx = x - it[2], qy = y - it[3], qz = z - it[4], bd = L3(qx, qy, qz) - s * 1.0; if (bd > .05) { d = mn(d, bd); continue; } d = mn(d, it[0].d(qx / s, qy / s, qz / s, T) * s); } return d; },
    m(x, y, z, T) { let b = 1e9, bi = items[0]; for (const it of items) { const q = loc(it, x, y, z), v = it[0].d(q[0], q[1], q[2], T) * it[1]; if (v < b) { b = v; bi = it; } } const q = loc(bi, x, y, z); return bi[0].m(q[0], q[1], q[2], T); } };
}

// ---- cats (front faces -z) ----
function head(hx, hy, hz, r, eyes = true) {
  const p = [S(hx, hy, hz, r, "head"), E(hx, hy - .32 * r, hz - .72 * r, .46 * r, .32 * r, .34 * r, "muzzle"),
    F((x, y, z) => pyrS(x - (hx - .55 * r), y - (hy + .55 * r), z - hz, .62 * r, 1.15, .45), "earL"),
    F((x, y, z) => pyrS(x - (hx + .55 * r), y - (hy + .55 * r), z - hz, .62 * r, 1.15, .45), "earR"),
    S(hx, hy - .2 * r, hz - 1.0 * r, .09 * r, "nose", true)];
  if (eyes) p.push(S(hx - .37 * r, hy + .08 * r, hz - .82 * r, .14 * r, "eye", true), S(hx + .37 * r, hy + .08 * r, hz - .82 * r, .14 * r, "eye", true));
  else p.push(C(hx - .5 * r, hy + .02 * r, hz - .86 * r, hx - .2 * r, hy - .02 * r, hz - .93 * r, .05 * r, "lid", true), C(hx + .5 * r, hy + .02 * r, hz - .86 * r, hx + .2 * r, hy - .02 * r, hz - .93 * r, .05 * r, "lid", true));
  return p;
}
const ARYA_H = [0, .36, -.1, .27], YUKI_H = [0, .28, -.55, .24], MISO_H = [0, .06, -.46, .3], MISA_H = [-.28, -.3, -.34, .25];
const arya = parts([
  E(0, -.2, .05, .32, .42, .3, "body"), E(0, -.14, -.16, .22, .3, .18, "chest"),
  E(-.22, -.45, .12, .16, .2, .26, "body"), E(.22, -.45, .12, .16, .2, .26, "body"),
  C(-.11, -.2, -.2, -.11, -.62, -.24, .075, "leg"), C(.11, -.2, -.2, .11, -.62, -.24, .075, "leg"),
  S(-.11, -.63, -.29, .085, "paw"), S(.11, -.63, -.29, .085, "paw"), S(-.24, -.63, -.05, .08, "paw"), S(.24, -.63, -.05, .08, "paw"),
  C(.25, -.63, .22, .4, -.62, -.04, .06, "tail"), C(.4, -.62, -.04, .24, -.62, -.32, .055, "tail"),
  ...head(...(ARYA_H as [number, number, number, number]))], (t, x, y, z) => t === "eye" ? 1.5 : t === "chest" || t === "paw" ? 1.05 : t === "leg" && y < -.48 ? 1.05 : t === "nose" ? .6 : .38, .06);
const yuki = parts([
  E(0, -.02, .08, .25, .25, .52, "body"), E(0, .02, -.32, .2, .22, .2, "body"),
  C(-.12, -.05, -.32, -.12, -.58, -.34, .07, "leg"), C(.12, -.05, -.32, .12, -.58, -.34, .07, "leg"),
  C(-.13, -.05, .42, -.13, -.58, .44, .075, "leg"), C(.13, -.05, .42, .13, -.58, .44, .075, "leg"),
  S(-.12, -.6, -.37, .08, "paw"), S(.12, -.6, -.37, .08, "paw"), S(-.13, -.6, .41, .08, "paw"), S(.13, -.6, .41, .08, "paw"),
  C(0, .08, .55, 0, .45, .78, .06, "tail"), C(0, .45, .78, .08, .66, .66, .055, "tail"),
  ...head(...(YUKI_H as [number, number, number, number]))], (t, x, y, z) => {
    if (t === "eye") return 1.5; if (t === "paw") return 1.05; if (t === "nose") return .6;
    if (t === "leg") return y < -.4 ? 1.05 : (Math.sin(y * 34) > .2 ? .32 : .7);
    if (t === "body" || t === "tail") return Math.sin(z * 26 + Math.sin(y * 9) * 1.6) > .25 ? .3 : .72;
    if (t === "head") { const hy = YUKI_H[1]; if (ab(y - hy - .03) < .065 && z < -.6) return .28; if (y > hy + .1 && Math.sin(x * 46) > .3) return .32; return .7; }
    if (t === "muzzle") return .95; return .65; }, .06);
const miso = parts([
  E(0, -.3, .05, .55, .33, .62, "body"), S(-.15, -.58, -.6, .09, "body"), S(.15, -.58, -.6, .09, "body"),
  C(.5, -.55, .45, .52, -.55, -.2, .07, "tail"), C(.52, -.55, -.2, .35, -.56, -.48, .065, "tail"),
  ...head(...(MISO_H as [number, number, number, number]))], (t) => t === "eye" ? 1.6 : t === "nose" ? .5 : .36, .12);
const misa = parts([
  E(0, -.42, .08, .58, .26, .5, "body"),
  C(.45, -.55, .3, .42, -.58, -.28, .07, "tail"), C(.42, -.58, -.28, .06, -.6, -.52, .065, "tail"), C(.06, -.6, -.52, -.12, -.6, -.5, .06, "tail"),
  S(-.12, -.6, -.5, .08, "paw"), S(-.36, -.6, -.5, .08, "paw"),
  ...head(...(MISA_H as [number, number, number, number]), false)], (t, x, y, z) => {
    if (t === "lid") return 1.2; if (t === "paw") return 1.05; if (t === "nose") return .6;
    if (t === "head" || t === "muzzle") return x < MISA_H[0] ? .26 : .8;
    if (t === "earL") return .26; if (t === "earR") return .8;
    const n = noise(x * 3.4 + 7, y * 3.4, z * 3.4); return n > .6 ? .26 : n < .4 ? .82 : .55; }, .07);

// ---- things she loves ----
const headphones = parts([
  F((x, y, z) => mx(hyp(hyp(x, y - .05) - .6, z) - .06, -(y + .02)), "band"),
  C(-.6, .04, 0, -.64, -.06, 0, .05, "band"), C(.6, .04, 0, .64, -.06, 0, .05, "band"),
  F((x, y, z) => cylY(y + .22, x + .64, z, .27, .09) - .02, "cup"), F((x, y, z) => cylY(y + .22, x - .64, z, .27, .09) - .02, "cup"),
  F((x, y, z) => hyp(hyp(y + .22, z) - .19, x + .5) - .075, "cushion"), F((x, y, z) => hyp(hyp(y + .22, z) - .19, x - .5) - .075, "cushion"),
], (t, x, y, z) => t === "cup" ? (Math.sin(hyp(y + .22, z) * 44) > .5 ? 1.05 : .7) : t === "cushion" ? .35 + .15 * noise(x * 20, y * 20, z * 20) : .75, .03, { fit: 1.1, tilt: -.15 });
const vinyl = parts([
  F((x, y, z) => mx(cylY(x, y, z, .95, .012), .03 - hyp(x, z)), "disc"),
  F((x, y, z) => mx(cylY(x, y, z, .32, .02), .03 - hyp(x, z)), "label"),
], (t, x, y, z, T) => { const r = hyp(x, z); if (t === "label") { const a = Math.atan2(z, x) + T * 3.5; return Math.sin(a) > .55 && r > .1 ? .35 : 1.0; } const a = Math.atan2(z, x) + T * 3.5; return .32 + .28 * (Math.sin(r * 170) > 0 ? 1 : 0) + .3 * mx(0, Math.cos(a * 2)) * (r > .4 ? 1 : 0); }, .005, { fit: 1.3, tilt: -.62, spin: .35, step: .8 });
const ringTilt = (y, z) => { const c = Math.cos(.42), s = Math.sin(.42); return [y * c - z * s, y * s + z * c]; };
const planet = parts([
  S(0, 0, 0, .5, "planet"),
  F((x, y, z) => { const q = ringTilt(y, z); return mx(ab(hyp(x, q[1]) - .82) - .17, ab(q[0]) - .008); }, "ring"),
  F((x, y, z, T) => sph(x - Math.cos(T * .8) * 1.02, y - .25, z - Math.sin(T * .8) * 1.02, .07), "moon", true),
], (t, x, y, z) => { if (t === "ring") { const q = ringTilt(y, z), r = hyp(x, q[1]); return r > .76 && r < .79 ? .15 : Math.sin(r * 90) > -.2 ? .9 : .4; } if (t === "moon") return .9; return .42 + .4 * (Math.sin(y * 22 + 2.2 * noise(x * 3, y * 3, z * 3)) > 0 ? 1 : 0); }, .01, { fit: 1.35, tilt: -.2, step: .8, R: 1.15 });
const heart = parts([F((x, y, z, T) => {
  const s = .95 * (1 + .07 * Math.pow(mx(0, Math.sin(T * 5.5)), 6)), d2 = heart2(x / s, y / s + .55) * s, h = .07 + .24 * Math.sqrt(mn(1, mx(0, -d2 * 3)));
  return (mx(d2, ab(z) - h) - .02) * .8; }, "h")], (t, x, y) => .85 + .25 * (Math.sin((x + y) * 18) > .85 ? 1 : 0), .01, { tilt: -.1 });
const buddy = parts([
  S(0, .32, 0, .3, "s"), E(0, -.2, .08, .22, .3, .2, "s"),
  C(-.1, -.48, .12, -.1, -.14, -.26, .1, "s"), C(.1, -.48, .12, .1, -.14, -.26, .1, "s"),
  C(-.2, .02, 0, -.12, -.16, -.36, .065, "s"), C(.2, .02, 0, .12, -.16, -.36, .065, "s"),
  S(-.05, -.15, -.38, .07, "s"), S(.05, -.15, -.38, .07, "s"),
  S(-.1, -.58, -.12, .09, "s"), S(.1, -.58, -.12, .09, "s"),
], (t, x, y, z, T) => 1.0 + .25 * Math.sin(T * 2), .07, { tilt: -.15, emit: .35 });

// ---- rare ----
const allcats = group([[arya, .52, -.5, -.25, -.32], [yuki, .52, .48, -.25, -.28], [miso, .52, -.42, -.25, .4], [misa, .52, .4, -.25, .42]], { fit: 1.12, tilt: -.6, spin: .4, iters: 120, R: 1.3 });
const seg2 = (px, py, ax, ay, bx, by) => { const ex = bx - ax, ey = by - ay, h = mx(0, mn(1, ((px - ax) * ex + (py - ay) * ey) / (ex * ex + ey * ey))); return hyp(px - ax - ex * h, py - ay - ey * h); };
function licenseTex(x, y) {
  const W = .82, BLK = .08, BLUE = .5, INK = .08;
  if (ab(x) > .455 || ab(y) > .735) return W;                       // white outer border
  if (y > .02) {                                                      // black top section
    if (ab(x) < .36 && ab(y - .44) < .2) {                            // white emblem panel
      const lx = x / .3, ly = (y - .44) / .17;
      if (ab(lx) / .3 + ab(ly) / .8 < 1) return 1.6;               // red diamond (glows)
      const thick = mn(seg2(lx, ly, -.62, .92, .46, -.92), seg2(lx, ly, .62, .92, -.46, -.92));
      const thin = mn(seg2(lx, ly, -.98, .92, -.5, -.1), seg2(lx, ly, .98, .92, .5, -.1), seg2(lx, ly, -.98, -.92, -.62, -.3), seg2(lx, ly, .98, -.92, .62, -.3));
      const serif = (ab(ly) > .86 && ab(ly) < .98) && (ab(lx) > .5 && ab(lx) < 1.08);
      return thick < .2 || thin < .1 || serif ? INK : W;
    }
    if (y > -.002 && y < .2 && ab(x) < .43) { const c = Math.floor((x + .5) * 95); return hs(c, 7, 3) > .42 ? INK : W; } // barcode
    return BLK;
  }
  if (ab(x) < .4 && y < -.07 && y > -.2) {                           // name box
    if (ab(x) > .385 || y > -.085 || y < -.185) return INK;
    const c = Math.floor((x + .5) * 34), sub = Math.floor((x + .5) * 102) % 3, row = Math.floor((-y - .07) * 60);
    return ab(x) < .33 && row >= 1 && row <= 5 && hs(c, row, sub) > .55 ? INK : W;
  }
  const r = Math.floor((-y - .25) / .105);                           // glyph text rows
  if (r >= 0 && r < 4 && ab(x) < .41) { const fy = (-y - .25) / .105 - r; if (fy > .06 && fy < .5) { const c = Math.floor((x + .5) * 36), sub = Math.floor((x + .5) * 108) % 3; return hs(c, r, 11) > .22 && sub !== 2 && hs(c, Math.floor(fy * 4), sub) > .3 ? INK : BLUE; } }
  return BLUE;
}
const license = parts([B(0, 0, 0, .5, .78, .025, .04, "card")], (t, x, y, z) => ab(z) < .018 ? .7 : licenseTex(z < 0 ? x : -x, y), .01, { tilt: 0, spin: .7, fit: .82, flat: true });
const SCENES: Record<string, Scene> = { arya, yuki, miso, misa, headphones, vinyl, planet, heart, buddy, allcats, license };

interface Scene {
  d(x: number, y: number, z: number, T: number): number;
  m(x: number, y: number, z: number, T: number): number;
  fit?: number; tilt?: number; spin?: number; step?: number; R?: number; iters?: number; emit?: number; flat?: boolean; tumble?: boolean;
}

function startSDF(pre: HTMLElement, o: { shape: string }) {
  const sc = SCENES[o.shape];
  let cols = 0, rows = 0, cw = 6.6, chh = 12, raf = 0, last = 0, dead = false, ro: ResizeObserver | null = null, cost = 30, drag: { x: number; y: number; t: number } | null = null;
  let A = sc.tilt ?? -.3, Bv = -.55, vA = 0, vB = .5;
  const t0 = performance.now(), RAMP = " .,-~:;=!*#$@", NR = RAMP.length - 1;
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function measure() {
    const s = document.createElement("div"); s.textContent = "MMMMMMMMMM"; s.style.cssText = "position:absolute;visibility:hidden;white-space:pre;display:block;left:0;top:0"; pre.appendChild(s);
    const r = s.getBoundingClientRect(); s.remove(); cw = r.width / 10 || 6.6; chh = r.height || 12;
    const b = pre.getBoundingClientRect(); cols = Math.max(1, Math.floor(b.width / cw)); rows = Math.max(1, Math.floor(b.height / chh));
    if (reduce) render(0);
  }
  function render(T: number) {
    if (!cols) return; const st = performance.now();
    const asp = chh / cw, span = mn(cols, rows * asp) / 2, f = .32 * (sc.fit || 1), R = sc.R || 1.2, stp = sc.step || .9, emit = sc.emit || 0;
    const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(Bv), sB = Math.sin(Bv);
    const inv = (x, y, z, out) => { const y1 = y * cA + z * sA, z1 = -y * sA + z * cA; out[0] = x * cB + z1 * sB; out[1] = y1; out[2] = -x * sB + z1 * cB; };
    const O = [0, 0, 0], Lt = [0, 0, 0], D = [0, 0, 0]; inv(0, 0, -3, O); inv(-.5, .65, -.6, Lt);
    const ll = L3(Lt[0], Lt[1], Lt[2]); Lt[0] /= ll; Lt[1] /= ll; Lt[2] /= ll;
    const oo = O[0] * O[0] + O[1] * O[1] + O[2] * O[2] - R * R, e = .005, out: string[] = [];
    for (let y = 0; y < rows; y++) {
      let line = "";
      for (let x = 0; x < cols; x++) {
        const u = (x + .5 - cols / 2) / span, v = -(y + .5 - rows / 2) * asp / span;
        inv(u * f, v * f, 1, D); const dl = L3(D[0], D[1], D[2]), dx = D[0] / dl, dy = D[1] / dl, dz = D[2] / dl;
        const b = O[0] * dx + O[1] * dy + O[2] * dz, disc = b * b - oo;
        if (disc < 0) { line += " "; continue; }
        const sq = Math.sqrt(disc), tm = -b + sq; let t = -b - sq, hit = false, px = 0, py = 0, pz = 0;
        for (let i = 0, IT = sc.iters || 64; i < IT; i++) { px = O[0] + dx * t; py = O[1] + dy * t; pz = O[2] + dz * t; const d = sc.d(px, py, pz, T); if (d < .004) { hit = true; break; } t += d * stp; if (t > tm) break; }
        if (!hit) { line += " "; continue; }
        const a1 = sc.d(px + e, py - e, pz - e, T), a2 = sc.d(px - e, py - e, pz + e, T), a3 = sc.d(px - e, py + e, pz - e, T), a4 = sc.d(px + e, py + e, pz + e, T);
        let nx = a1 - a2 - a3 + a4, ny = -a1 - a2 + a3 + a4, nz = -a1 + a2 - a3 + a4; const nl = L3(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
        const ndl = mx(0, nx * Lt[0] + ny * Lt[1] + nz * Lt[2]), rim = 1 - ab(nx * dx + ny * dy + nz * dz);
        const alb = sc.m(px, py, pz, T), lum = sc.flat ? alb * .92 + ndl * .12 : (.22 + 1.0 * ndl) * alb + rim * rim * .25 + emit;
        line += RAMP[mx(1, mn(NR, (lum * NR + .5) | 0))];
      }
      out.push(line);
    }
    pre.textContent = out.join("\n"); cost = performance.now() - st;
  }
  function loop(t: number) {
    if (dead) return; raf = requestAnimationFrame(loop); if (t - last < mx(55, cost * 1.8)) return;
    const dt = mn(.12, (t - last) / 1000); last = t;
    if (!drag) { vB += ((sc.spin ?? .55) - vB) * .03; vA += ((sc.tumble ? .45 : 0) - vA) * .03; Bv += vB * dt; A += vA * dt; if (!sc.tumble) A += ((sc.tilt ?? -.3) - A) * .03; }
    render((t - t0) / 1000);
  }
  const down = (e: PointerEvent) => { drag = { x: e.clientX, y: e.clientY, t: performance.now() }; if (pre.setPointerCapture) pre.setPointerCapture(e.pointerId); };
  const move = (e: PointerEvent) => { if (!drag) return; const ddx = e.clientX - drag.x, ddy = e.clientY - drag.y, now = performance.now(), dt = mx(16, now - drag.t) / 1000; Bv += ddx * .012; A += ddy * .012; vB = ddx * .012 / dt; vA = ddy * .012 / dt; drag = { x: e.clientX, y: e.clientY, t: now }; if (reduce) render(0); };
  const up = () => { drag = null; };
  pre.addEventListener("pointerdown", down); pre.addEventListener("pointermove", move); pre.addEventListener("pointerup", up); pre.addEventListener("pointercancel", up);
  if (window.ResizeObserver) { ro = new ResizeObserver(measure); ro.observe(pre); }
  measure(); if (document.fonts) document.fonts.ready.then(() => { if (!dead) measure(); });
  if (!reduce) raf = requestAnimationFrame(loop);
  return { stop() { dead = true; cancelAnimationFrame(raf); if (ro) ro.disconnect(); pre.removeEventListener("pointerdown", down); pre.removeEventListener("pointermove", move); pre.removeEventListener("pointerup", up); pre.removeEventListener("pointercancel", up); } };
}

export interface OrbitHandle {
  set(p: { shape?: string }): void;
  stop(): void;
}
export function startOrbit(pre: HTMLElement | null, o: { shape?: string } = {}): OrbitHandle {
  if (!pre) return { set() {}, stop() {} };
  let cur: { stop(): void } | null = null, shape: string | null = null;
  const apply = (s?: string) => { if (!s || s === shape) return; shape = s; if (cur) cur.stop(); cur = SCENES[s] ? startSDF(pre, { shape: s }) : startObject(pre, { shape: s }); };
  apply(o.shape);
  return { set(p) { apply(p.shape); }, stop() { if (cur) cur.stop(); } };
}
