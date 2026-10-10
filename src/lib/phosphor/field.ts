// Generative ASCII fields (topo / flow / plasma / life), ported from `phosphor-fx.js`.

// ---- noise ----
const hs = (x: number, y: number, z: number) => { let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1440662683); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const sm = (t: number) => t * t * (3 - 2 * t);
const lp = (a: number, b: number, t: number) => a + (b - a) * t;
function noise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = sm(x - xi), yf = sm(y - yi), zf = sm(z - zi);
  const c = (dx: number, dy: number, dz: number) => hs(xi + dx, yi + dy, zi + dz);
  return lp(lp(lp(c(0, 0, 0), c(1, 0, 0), xf), lp(c(0, 1, 0), c(1, 1, 0), xf), yf), lp(lp(c(0, 0, 1), c(1, 0, 1), xf), lp(c(0, 1, 1), c(1, 1, 1), xf), yf), zf);
}

// ---- block font for masks ----
const FONT: Record<string, string[]> = {
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #"], A: [" ### ", "#   #", "#####", "#   #", "#   #"],
  D: ["#### ", "#   #", "#   #", "#   #", "#### "], I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
  B: ["#### ", "#   #", "#### ", "#   #", "#### "], R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  H: ["#   #", "#   #", "#####", "#   #", "#   #"], M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
  " ": ["   ", "   ", "   ", "   ", "   "],
};
const glyph = (ch: string) => FONT[ch] || FONT[" "];
const lineW = (l: string) => [...l].reduce((s, ch) => s + glyph(ch)[0].length + 1, 0) - 1;
function buildMask(text: string, cols: number, rows: number, cw: number, chh: number, box?: { x: number; y: number; w: number; h: number }) {
  box = box || { x: .04, y: .1, w: .92, h: .42 };
  const bx = Math.floor(box.x * cols), by = Math.floor(box.y * rows), bw = Math.floor(box.w * cols), bh = Math.floor(box.h * rows);
  let best: { lines: string[]; sx: number; sy: number; score: number } | null = null;
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

function grow(m: Uint8Array, cols: number, rows: number, r: number) {
  const o = new Uint8Array(m.length);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (m[y * cols + x])
    for (let dy = -r; dy <= r; dy++) for (let dx = -r * 2; dx <= r * 2; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && X < cols && Y >= 0 && Y < rows) o[Y * cols + X] = 1; }
  return o;
}

export interface FieldOpts {
  hiPre?: HTMLElement | null;
  type?: string;
  intensity?: number;
  root?: (() => HTMLElement | null) | HTMLElement | null;
  mask?: string | null;
  maskBox?: { x: number; y: number; w: number; h: number };
}
export interface FieldHandle {
  set(p: { type?: string; intensity?: number }): void;
  stats(): { type: string; gen: number; pop: number; fps: number } | null;
  stop(): void;
}

// types: topo (contour lines), flow (noise density), plasma (sine interference), life (Conway, cursor seeds cells)
export function startField(pre: HTMLElement | null, o: FieldOpts = {}): FieldHandle {
  if (!pre) return { stop() {}, set() {}, stats: () => null };
  const hiPre = o.hiPre || null;
  let type = o.type || "topo", cols = 0, rows = 0, cw = 7, chh = 16, raf = 0, last = 0;
  let mask: Uint8Array | null = null, halo: Uint8Array | null = null, grid: Uint8Array = new Uint8Array(0), age: Float32Array = new Float32Array(0);
  let gen = 0, tick = 0, pop = 0, mx = -999, my = -999, frames = 0, fpsT = 0, fps = 0, root: HTMLElement | null = null, ro: ResizeObserver | null = null, dead = false;
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LO = " .:-=+*#", HI = "##%%@@";
  const setOp = (i: number) => { pre.style.opacity = String(i); };
  setOp(o.intensity ?? .35);
  function seed() { const N = cols * rows; grid = new Uint8Array(N); age = new Float32Array(N); for (let i = 0; i < N; i++) grid[i] = Math.random() < .2 ? 1 : 0; gen = 0; }
  function soup(cx: number, cy: number, r: number, p: number) { for (let y = -r; y <= r; y++) for (let x = -r * 2; x <= r * 2; x++) { const X = (cx + x + cols) % cols, Y = (cy + y + rows) % rows; if (Math.random() < p) grid[Y * cols + X] = 1; } }
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
  function render(z: number) {
    if (!cols) return;
    tick++;
    if (type === "life") { if (mx > -900) soup(mx | 0, my | 0, 1, .3); step(); }
    const lo: string[] = [], hi: string[] | null = hiPre && mask ? [] : null, cx = cols / 2, cy = rows / 2, mOn = mx > -900;
    for (let y = 0; y < rows; y++) {
      let a = "", h = "";
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x; let v: number, b = 0;
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
    pre.textContent = lo.join("\n"); if (hi && hiPre) hiPre.textContent = hi.join("\n");
    frames++; const now = performance.now(); if (now - fpsT > 1000) { fps = fpsT ? Math.round(frames * 1000 / (now - fpsT)) : 0; frames = 0; fpsT = now; }
  }
  function loop(t: number) { if (dead) return; raf = requestAnimationFrame(loop); if (t - last < (type === "life" ? 100 : 50)) return; last = t; render(t / 1000); }
  const onMove = (e: PointerEvent) => { const r = pre.getBoundingClientRect(); mx = (e.clientX - r.left) / cw; my = (e.clientY - r.top) / chh; };
  const onLeave = () => { mx = my = -999; };
  let tries = 0;
  const hook = () => { if (dead) return; root = typeof o.root === "function" ? o.root() : (o.root as HTMLElement | null); if (!root) { if (tries++ < 40) setTimeout(hook, 50); return; } root.addEventListener("pointermove", onMove); root.addEventListener("pointerleave", onLeave); };
  hook();
  if (window.ResizeObserver) { ro = new ResizeObserver(() => measure()); ro.observe(pre); }
  measure();
  if (document.fonts) document.fonts.ready.then(() => { if (!dead) { cols = 0; measure(); } });
  if (!reduce) raf = requestAnimationFrame(loop);
  return {
    set(p) { if (p.type && p.type !== type) { type = p.type; seed(); } if (p.intensity != null) setOp(p.intensity); if (reduce) render(0); },
    stats: () => ({ type, gen: type === "life" ? gen : tick, pop, fps }),
    stop() { dead = true; cancelAnimationFrame(raf); if (ro) ro.disconnect(); if (root) { root.removeEventListener("pointermove", onMove); root.removeEventListener("pointerleave", onLeave); } },
  };
}
