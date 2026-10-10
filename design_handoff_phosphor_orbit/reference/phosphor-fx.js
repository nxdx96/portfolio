// Phosphor hybrid helpers: generative ASCII fields, text decrypt, HUD stats.
export const FKEYS = { F1: "help", F2: "about", F3: "resume", F4: "projects", F5: "contact", F10: "clear" };
export const PALETTE = { cmd: "#e6ffec", out: "#c4ffd2", dim: "#3fb168", err: "#ffd36a", link: "#9dffb0", h: "#4af07a" };
export const BOOT = ["NADA-OS BIOS v2.0.0  (C) 2026 N. IBRAHIM", "CPU: Brain @ 3.4 GHz ............ OK", "Memory test: 640K ................ OK", "Phosphor field generator ......... OK", "Mounting /home/nada/portfolio .... OK", "Detecting repositories: github.com/nxdx96", "Function keys F1-F10 ............. MAPPED", "Loading PORTFOLIO.SYS ............ OK", ""];
export const BANNER = ["NADA-OS TERMINAL v2.0.0", "Type HELP, or press F1-F5 on your keyboard.", ""];
export const HELP_EXTRA = ["", "  keys: F1 help · F2 about · F3 resume · F4 projects · F5 contact · F10 clear · ESC close"];

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$*+=<>/\\[]{}";
const jit = i => (Math.imul(i + 1, 2654435761) >>> 0) % 1000 / 1000;
export function scramble(s, p) {
  if (s == null || p >= 1) return s;
  s = String(s); let o = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]; if (ch === " " || ch === "\n") { o += ch; continue; }
    o += (i / Math.max(1, s.length)) * .6 + jit(i) * .4 < p ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
  }
  return o;
}
const SKIP = new Set(["href", "url", "langColor", "homepage", "resumeUrl", "idx", "stars", "forks"]);
export function decryptDeep(v, p, k) {
  if (p >= 1) return v;
  if (typeof v === "string") return SKIP.has(k) ? v : scramble(v, p);
  if (Array.isArray(v)) return v.map(x => decryptDeep(x, p, k));
  if (v && typeof v === "object") { const o = {}; for (const key in v) o[key] = decryptDeep(v[key], p, key); return o; }
  return v;
}
export function ramp(c, key, ms, from = 0) {
  c.__ramps = c.__ramps || {}; cancelAnimationFrame(c.__ramps[key]);
  const t0 = performance.now();
  const step = t => { const p = Math.min(1, from + (1 - from) * Math.max(0, t - t0) / ms); c.setState({ [key]: p }); if (p < 1) c.__ramps[key] = requestAnimationFrame(step); };
  c.__ramps[key] = requestAnimationFrame(step);
}
export function stopRamps(c) { for (const k in c.__ramps || {}) cancelAnimationFrame(c.__ramps[k]); }

export function hudStats(st, repos) {
  const c = {}; (repos || []).forEach(r => { if (r.lang && r.lang !== "—") c[r.lang] = (c[r.lang] || 0) + 1; });
  const tot = Object.values(c).reduce((a, b) => a + b, 0) || 1;
  const langs = Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name, n]) => { const k = Math.max(1, Math.round(n / tot * 12)); return { name, n, bar: "#".repeat(k) + "-".repeat(12 - k) }; });
  return { langs, gen: st ? st.gen : 0, pop: st ? st.pop : 0, fps: st ? st.fps : 0, fieldHint: st && st.type === "life" ? "move cursor to seed cells" : "move cursor to disturb field" };
}

// ---- noise ----
const hs = (x, y, z) => { let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1440662683); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const sm = t => t * t * (3 - 2 * t);
const lp = (a, b, t) => a + (b - a) * t;
function noise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = sm(x - xi), yf = sm(y - yi), zf = sm(z - zi);
  const c = (dx, dy, dz) => hs(xi + dx, yi + dy, zi + dz);
  return lp(lp(lp(c(0, 0, 0), c(1, 0, 0), xf), lp(c(0, 1, 0), c(1, 1, 0), xf), yf), lp(lp(c(0, 0, 1), c(1, 0, 1), xf), lp(c(0, 1, 1), c(1, 1, 1), xf), yf), zf);
}

// ---- block font for masks ----
const FONT = {
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #"], A: [" ### ", "#   #", "#####", "#   #", "#   #"],
  D: ["#### ", "#   #", "#   #", "#   #", "#### "], I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
  B: ["#### ", "#   #", "#### ", "#   #", "#### "], R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  H: ["#   #", "#   #", "#####", "#   #", "#   #"], M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
  " ": ["   ", "   ", "   ", "   ", "   "],
};
const glyph = ch => FONT[ch] || FONT[" "];
const lineW = l => [...l].reduce((s, ch) => s + glyph(ch)[0].length + 1, 0) - 1;
function buildMask(text, cols, rows, cw, chh, box) {
  box = box || { x: .04, y: .1, w: .92, h: .42 };
  const bx = Math.floor(box.x * cols), by = Math.floor(box.y * rows), bw = Math.floor(box.w * cols), bh = Math.floor(box.h * rows);
  let best = null;
  for (const lines of [[text], text.split(" ")]) for (const sx of [6, 5, 4, 3, 2, 1]) {
    const sy = Math.max(1, Math.round(sx * cw / chh));
    const W = Math.max(...lines.map(lineW)) * sx, H = (lines.length * 6 - 1) * sy;
    if (W <= bw && H <= bh) { const score = sx * 10 - lines.length; if (!best || score > best.score) best = { lines, sx, sy, score }; break; }
  }
  if (!best) return null;
  const m = new Uint8Array(cols * rows), { lines, sx, sy } = best;
  const oy = by + Math.floor((bh - (lines.length * 6 - 1) * sy) / 2);
  lines.forEach((l, li) => {
    const ox = bx + Math.floor((bw - lineW(l) * sx) / 2); let px = 0;
    for (const ch of l) { const g = glyph(ch);
      for (let r = 0; r < 5; r++) for (let c = 0; c < g[r].length; c++) if (g[r][c] === "#")
        for (let yy = 0; yy < sy; yy++) for (let xx = 0; xx < sx; xx++) { const X = ox + (px + c) * sx + xx, Y = oy + (li * 6 + r) * sy + yy; if (X >= 0 && X < cols && Y >= 0 && Y < rows) m[Y * cols + X] = 1; }
      px += g[0].length + 1; }
  });
  return m;
}

function grow(m, cols, rows, r) {
  const o = new Uint8Array(m.length);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (m[y * cols + x])
    for (let dy = -r; dy <= r; dy++) for (let dx = -r * 2; dx <= r * 2; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && X < cols && Y >= 0 && Y < rows) o[Y * cols + X] = 1; }
  return o;
}
// ---- 3D ASCII object (torus / globe), drag to spin ----
export function startObject(pre, o = {}) {
  if (!pre) return { stop() {}, set() {} };
  let shape = o.shape || "globe", cols = 0, rows = 0, cw = 6.6, chh = 12, raf = 0, last = 0, dead = false, ro = null;
  let A = -.45, B = 0, vA = 0, vB = .5, drag = null, t0 = performance.now();
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LUM = ".,-~:;=!*#$@", GRID = "-=+*#%@";
  const tumble = () => shape !== "globe" && shape !== "helix";
  const NYC = [40.71 * Math.PI / 180, -74.0 * Math.PI / 180];
  function measure() {
    const s = document.createElement("div"); s.textContent = "MMMMMMMMMM"; s.style.cssText = "position:absolute;visibility:hidden;white-space:pre;display:block;left:0;top:0"; pre.appendChild(s);
    const r = s.getBoundingClientRect(); s.remove(); cw = r.width / 10 || 6.6; chh = r.height || 12;
    const b = pre.getBoundingClientRect(); cols = Math.max(1, Math.floor(b.width / cw)); rows = Math.max(1, Math.floor(b.height / chh));
    if (reduce) render(0);
  }
  function render(t) {
    if (!cols) return;
    const N = cols * rows, out = new Array(N).fill(" "), zb = new Float32Array(N), asp = chh / cw;
    const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B);
    const put = (x, y, z, ch) => { const ooz = 1 / z; const xp = (cols / 2 + K * ooz * x) | 0, yp = (rows / 2 - K * ooz * y / asp) | 0; if (xp < 0 || xp >= cols || yp < 0 || yp >= rows) return; const i = yp * cols + xp; if (ooz > zb[i]) { zb[i] = ooz; out[i] = ch; } };
    const span = Math.min(cols, rows * asp);
    let K;
    if (shape === "torus") {
      const R1 = 1, R2 = 2, K2 = 5; K = span * K2 * 3 / (8 * (R1 + R2)) * .9;
      for (let th = 0; th < 6.283; th += .06) { const ct = Math.cos(th), st = Math.sin(th);
        for (let ph = 0; ph < 6.283; ph += .018) { const cp = Math.cos(ph), sp = Math.sin(ph);
          const cx = R2 + R1 * ct, cy = R1 * st;
          const x = cx * (cB * cp + sA * sB * sp) - cy * cA * sB, y = cx * (sB * cp - sA * cB * sp) + cy * cA * cB, z = K2 + cA * cx * sp + cy * sA;
          const L = cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp);
          if (L > 0) put(x, y, z, LUM[Math.min(11, (L * 8) | 0)]); } }
    } else if (shape !== "globe") {
      const K2 = 3.2; K = span * K2 * .5;
      const rot = (x, y, z) => { const x1 = x * cB - z * sB, z1 = x * sB + z * cB; return [x1, y * cA - z1 * sA, y * sA + z1 * cA]; };
      const plot = (p, n, two, ch) => { const q = rot(p[0], p[1], p[2]); const m = rot(n[0], n[1], n[2]); let L = -.45 * m[0] + .55 * m[1] - .7 * m[2]; if (two) L = Math.abs(L); put(q[0], q[1], K2 + q[2], ch || LUM[Math.max(0, Math.min(11, (L * 11.5) | 0))]); };
      const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
      const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const tube = (c, u0, u1, du, r, nv) => { for (let u = u0; u < u1; u += du) { const p = c(u), T = nrm(c(u + .001).map((x, i) => x - p[i])); let N = cross(T, [0, 0, 1]); if (Math.hypot(...N) < .1) N = cross(T, [1, 0, 0]); N = nrm(N); const Bn = cross(T, N);
        for (let k = 0; k < nv; k++) { const v = k / nv * 6.283, cv = Math.cos(v), sv = Math.sin(v), n = [N[0] * cv + Bn[0] * sv, N[1] * cv + Bn[1] * sv, N[2] * cv + Bn[2] * sv]; plot([p[0] + r * n[0], p[1] + r * n[1], p[2] + r * n[2]], n); } } };
      if (shape === "cube") {
        const S = .62, st = 2 / 44;
        for (let f = 0; f < 6; f++) { const ax = f >> 1, sg = f & 1 ? 1 : -1;
          for (let a = -1; a <= 1.0001; a += st) for (let b = -1; b <= 1.0001; b += st) {
            const p = [0, 0, 0], n = [0, 0, 0]; p[ax] = sg * S; n[ax] = sg; p[(ax + 1) % 3] = a * S; p[(ax + 2) % 3] = b * S;
            plot(p, n, false, Math.abs(a) > .96 || Math.abs(b) > .96 ? "#" : null); } }
      } else if (shape === "knot") {
        tube(u => [(Math.sin(u) + 2 * Math.sin(2 * u)) / 3.2, (Math.cos(u) - 2 * Math.cos(2 * u)) / 3.2, -Math.sin(3 * u) / 3.2], 0, 6.283, .008, .17, 22);
      } else if (shape === "mobius") {
        const P = (u, v) => { const w = 1 + v / 2 * Math.cos(u / 2); return [w * Math.cos(u) * .66, v / 2 * Math.sin(u / 2) * .66, w * Math.sin(u) * .66]; };
        for (let u = 0; u < 6.283; u += .012) for (let v = -1; v <= 1; v += .045) { const p = P(u, v), pu = P(u + .001, v), pv = P(u, v + .001); const n = nrm(cross(pu.map((x, i) => x - p[i]), pv.map((x, i) => x - p[i])));
          plot(p, n, true, Math.abs(v) > .95 ? "@" : null); }
      } else if (shape === "helix") {
        const R = .42, H = .1, T0 = -7.5, T1 = 7.5;
        tube(t => [R * Math.cos(t), t * H, R * Math.sin(t)], T0, T1, .02, .08, 12);
        tube(t => [R * Math.cos(t + Math.PI), t * H, R * Math.sin(t + Math.PI)], T0, T1, .02, .08, 12);
        for (let t = T0 + .3; t < T1; t += .55) for (let k = -1; k <= 1; k += .04) { const c = Math.cos(t), s = Math.sin(t); plot([R * c * k, t * H, R * s * k], [0, 0, -1], true, Math.abs(k) < .5 ? "=" : "-"); }
      }
    } else {
      const K2 = 3.2; K = span * K2 * .42;
      const blink = ((t * 2) | 0) % 2 === 0, d = Math.PI / 180;
      for (let la = -88; la <= 88; la += 1.2) { const lr = la * d, cl = Math.cos(lr), sl = Math.sin(lr);
        for (let lo = -180; lo < 180; lo += 1.2) { const or = lo * d;
          let x = cl * Math.cos(or), y = sl, z = cl * Math.sin(or);
          const x1 = x * cB - z * sB, z1 = x * sB + z * cB; const y2 = y * cA - z1 * sA, z2 = y * sA + z1 * cA;
          if (z2 > .05) continue;
          const L = Math.max(0, -.45 * x1 + .55 * y2 - .7 * z2);
          const onGrid = Math.abs(((la + 90) % 15)) < 1.2 || Math.abs(((lo + 180) % 15)) < 1.2;
          const near = Math.abs(lr - NYC[0]) < 2.4 * d && Math.abs(or - NYC[1]) < 2.4 * d;
          const ch = near ? (blink ? "@" : "O") : onGrid ? GRID[Math.min(GRID.length - 1, (L * GRID.length) | 0)] : (L > .75 ? "." : " ");
          if (ch !== " " || onGrid) put(x1, y2, K2 + z2, ch); } }
    }
    let str = ""; for (let y = 0; y < rows; y++) { str += out.slice(y * cols, y * cols + cols).join(""); if (y < rows - 1) str += "\n"; }
    pre.textContent = str;
  }
  function loop(t) { if (dead) return; raf = requestAnimationFrame(loop); if (t - last < 45) return; const dt = Math.min(.1, (t - last) / 1000); last = t;
    if (!drag) { vB += ((tumble() ? .8 : .45) - vB) * .03; vA += ((tumble() ? .5 : 0) - vA) * .03; A += vA * dt; B += vB * dt; if (!tumble()) A += ((shape === "helix" ? -.2 : -.45) - A) * .02; }
    render((t - t0) / 1000); }
  const down = e => { drag = { x: e.clientX, y: e.clientY, t: performance.now() }; pre.setPointerCapture && pre.setPointerCapture(e.pointerId); };
  const move = e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y, now = performance.now(), dt = Math.max(16, now - drag.t) / 1000; B += dx * .012; A += dy * .012; vB = dx * .012 / dt; vA = dy * .012 / dt; drag = { x: e.clientX, y: e.clientY, t: now }; if (reduce) render(0); };
  const up = () => { drag = null; };
  pre.addEventListener("pointerdown", down); pre.addEventListener("pointermove", move); pre.addEventListener("pointerup", up); pre.addEventListener("pointercancel", up);
  if (window.ResizeObserver) { ro = new ResizeObserver(measure); ro.observe(pre); }
  measure(); document.fonts && document.fonts.ready.then(() => !dead && measure());
  if (!reduce) raf = requestAnimationFrame(loop);
  return { set(p) { if (p.shape) shape = p.shape; if (reduce) render(0); }, stop() { dead = true; cancelAnimationFrame(raf); ro && ro.disconnect(); pre.removeEventListener("pointerdown", down); pre.removeEventListener("pointermove", move); pre.removeEventListener("pointerup", up); pre.removeEventListener("pointercancel", up); } };
}

// ---- field ----
// types: topo (contour lines), flow (noise density), plasma (sine interference), life (Conway, cursor seeds cells)
export function startField(pre, o = {}) {
  if (!pre) return { stop() {}, set() {}, stats: () => null };
  const hiPre = o.hiPre || null;
  let type = o.type || "topo", cols = 0, rows = 0, cw = 7, chh = 16, raf = 0, last = 0, mask = null, halo = null, grid = null, age = null;
  let gen = 0, tick = 0, pop = 0, mx = -999, my = -999, frames = 0, fpsT = 0, fps = 0, root = null, ro = null, dead = false;
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LO = " .:-=+*#", HI = "##%%@@";
  const setOp = i => { pre.style.opacity = String(i); };
  setOp(o.intensity ?? .35);
  function seed() { const N = cols * rows; grid = new Uint8Array(N); age = new Float32Array(N); for (let i = 0; i < N; i++) grid[i] = Math.random() < .2 ? 1 : 0; gen = 0; }
  function soup(cx, cy, r, p) { for (let y = -r; y <= r; y++) for (let x = -r * 2; x <= r * 2; x++) { const X = (cx + x + cols) % cols, Y = (cy + y + rows) % rows; if (Math.random() < p) grid[Y * cols + X] = 1; } }
  function step() {
    const N = cols * rows, n = new Uint8Array(N); pop = 0;
    for (let y = 0; y < rows; y++) {
      const yu = ((y - 1 + rows) % rows) * cols, yc = y * cols, yd = ((y + 1) % rows) * cols;
      for (let x = 0; x < cols; x++) {
        const xl = (x - 1 + cols) % cols, xr = (x + 1) % cols;
        const k = grid[yu + xl] + grid[yu + x] + grid[yu + xr] + grid[yc + xl] + grid[yc + xr] + grid[yd + xl] + grid[yd + x] + grid[yd + xr];
        const a = k === 3 || (k === 2 && grid[yc + x]) ? 1 : 0; n[yc + x] = a; pop += a;
      }
    }
    if (mask) for (let i = 0; i < N; i++) if (mask[i]) n[i] = 1;
    grid = n; gen++;
    if (pop < N * .035) for (let k = 0; k < 6; k++) soup((Math.random() * cols) | 0, (Math.random() * rows) | 0, 5, .4);
  }
  function measure() {
    const s = document.createElement("div"); s.textContent = "MMMMMMMMMM"; s.style.cssText = "position:absolute;visibility:hidden;white-space:pre;display:block;left:0;top:0"; pre.appendChild(s);
    const r = s.getBoundingClientRect(); s.remove(); cw = r.width / 10 || 7; chh = r.height || 16;
    const b = pre.getBoundingClientRect(); const nc = Math.max(1, Math.ceil(b.width / cw)), nr = Math.max(1, Math.ceil(b.height / chh));
    if (nc !== cols || nr !== rows) { cols = nc; rows = nr; mask = o.mask ? buildMask(o.mask, cols, rows, cw, chh, o.maskBox) : null; halo = mask ? grow(mask, cols, rows, 2) : null; seed(); if (!mask && hiPre) hiPre.textContent = ""; }
    if (reduce) render(0);
  }
  function render(z) {
    if (!cols) return;
    tick++;
    if (type === "life") { if (mx > -900) soup(mx | 0, my | 0, 1, .3); step(); }
    const lo = [], hi = hiPre && mask ? [] : null, cx = cols / 2, cy = rows / 2, mOn = mx > -900;
    for (let y = 0; y < rows; y++) {
      let a = "", h = "";
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x; let v, b = 0;
        if (mOn) { const dx = x - mx, dy = (y - my) * 2.2; b = Math.exp(-(dx * dx + dy * dy) / 90); }
        if (type === "life") { if (grid[i]) age[i] = 1; else age[i] *= .78; v = age[i]; }
        else if (type === "topo") { const n = noise(x * .045, y * .1, z * .1) * .65 + noise(x * .1 + 40, y * .22, z * .18) * .35 + b * .22; const f = Math.abs((n * 10) % 1 - .5) * 2; v = f > .8 ? .4 + (f - .8) * 3 : 0; }
        else if (type === "flow") { const n = noise(x * .05 + z * .25, y * .11, z * .12) * .6 + noise(x * .12, y * .25 - z * .35, z * .25) * .4 + b * .45; v = Math.pow(n, 2.6) * 1.9; }
        else { const s = Math.sin(x * .085 + z) + Math.sin(y * .19 - z * .8) + Math.sin((x * .5 + y) * .075 + z * .6) + Math.sin(Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy) * 4.8) * .12 - z * 1.3); v = Math.pow((s + 4) / 8 + b * .35, 2.4); }
        v = v < 0 ? 0 : v > 1 ? 1 : v;
        if (mask && mask[i]) { a += " "; if (hi) h += HI[Math.min(HI.length - 1, (v * HI.length) | 0)]; }
        else { if (halo && halo[i]) v *= .25; a += LO[(v * (LO.length - 1) + .5) | 0]; if (hi) h += " "; }
      }
      lo.push(a); if (hi) hi.push(h);
    }
    pre.textContent = lo.join("\n"); if (hi) hiPre.textContent = hi.join("\n");
    frames++; const now = performance.now(); if (now - fpsT > 1000) { fps = fpsT ? Math.round(frames * 1000 / (now - fpsT)) : 0; frames = 0; fpsT = now; }
  }
  function loop(t) { if (dead) return; raf = requestAnimationFrame(loop); if (t - last < (type === "life" ? 100 : 50)) return; last = t; render(t / 1000); }
  const onMove = e => { const r = pre.getBoundingClientRect(); mx = (e.clientX - r.left) / cw; my = (e.clientY - r.top) / chh; };
  const onLeave = () => { mx = my = -999; };
  let tries = 0;
  const hook = () => { if (dead) return; root = typeof o.root === "function" ? o.root() : o.root; if (!root) { if (tries++ < 40) setTimeout(hook, 50); return; } root.addEventListener("pointermove", onMove); root.addEventListener("pointerleave", onLeave); };
  hook();
  if (window.ResizeObserver) { ro = new ResizeObserver(() => measure()); ro.observe(pre); }
  measure();
  document.fonts && document.fonts.ready.then(() => { if (!dead) { cols = 0; measure(); } });
  if (!reduce) raf = requestAnimationFrame(loop);
  return {
    set(p) { if (p.type && p.type !== type) { type = p.type; seed(); } if (p.intensity != null) setOp(p.intensity); if (reduce) render(0); },
    stats: () => ({ type, gen: type === "life" ? gen : tick, pop, fps }),
    stop() { dead = true; cancelAnimationFrame(raf); ro && ro.disconnect(); if (root) { root.removeEventListener("pointermove", onMove); root.removeEventListener("pointerleave", onLeave); } },
  };
}
