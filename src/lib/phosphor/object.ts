// Parametric 3D ASCII objects (torus / globe / knot / mobius / helix / cube),
// drag to spin. Ported from `phosphor-fx.js` `startObject`.

export interface ObjectHandle {
  set(p: { shape?: string }): void;
  stop(): void;
}

export function startObject(pre: HTMLElement | null, o: { shape?: string } = {}): ObjectHandle {
  if (!pre) return { stop() {}, set() {} };
  let shape = o.shape || "globe", cols = 0, rows = 0, cw = 6.6, chh = 12, raf = 0, last = 0, dead = false;
  let ro: ResizeObserver | null = null;
  let A = -.45, B = 0, vA = 0, vB = .5, drag: { x: number; y: number; t: number } | null = null;
  const t0 = performance.now();
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
  function render(t: number) {
    if (!cols) return;
    const N = cols * rows, out = new Array(N).fill(" "), zb = new Float32Array(N), asp = chh / cw;
    const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B);
    let K = 0;
    const put = (x: number, y: number, z: number, ch: string) => { const ooz = 1 / z; const xp = (cols / 2 + K * ooz * x) | 0, yp = (rows / 2 - K * ooz * y / asp) | 0; if (xp < 0 || xp >= cols || yp < 0 || yp >= rows) return; const i = yp * cols + xp; if (ooz > zb[i]) { zb[i] = ooz; out[i] = ch; } };
    const span = Math.min(cols, rows * asp);
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
      const rot = (x: number, y: number, z: number) => { const x1 = x * cB - z * sB, z1 = x * sB + z * cB; return [x1, y * cA - z1 * sA, y * sA + z1 * cA]; };
      const plot = (p: number[], n: number[], two?: boolean, ch?: string) => { const q = rot(p[0], p[1], p[2]); const m = rot(n[0], n[1], n[2]); let L = -.45 * m[0] + .55 * m[1] - .7 * m[2]; if (two) L = Math.abs(L); put(q[0], q[1], K2 + q[2], ch || LUM[Math.max(0, Math.min(11, (L * 11.5) | 0))]); };
      const nrm = (v: number[]) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
      const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const tube = (c: (u: number) => number[], u0: number, u1: number, du: number, r: number, nv: number) => { for (let u = u0; u < u1; u += du) { const p = c(u), T = nrm(c(u + .001).map((x, i) => x - p[i])); let Nv = cross(T, [0, 0, 1]); if (Math.hypot(Nv[0], Nv[1], Nv[2]) < .1) Nv = cross(T, [1, 0, 0]); Nv = nrm(Nv); const Bn = cross(T, Nv);
        for (let k = 0; k < nv; k++) { const v = k / nv * 6.283, cv = Math.cos(v), sv = Math.sin(v), n = [Nv[0] * cv + Bn[0] * sv, Nv[1] * cv + Bn[1] * sv, Nv[2] * cv + Bn[2] * sv]; plot([p[0] + r * n[0], p[1] + r * n[1], p[2] + r * n[2]], n); } } };
      if (shape === "cube") {
        const Sc = .62, st = 2 / 44;
        for (let f = 0; f < 6; f++) { const ax = f >> 1, sg = f & 1 ? 1 : -1;
          for (let a = -1; a <= 1.0001; a += st) for (let b = -1; b <= 1.0001; b += st) {
            const p = [0, 0, 0], n = [0, 0, 0]; p[ax] = sg * Sc; n[ax] = sg; p[(ax + 1) % 3] = a * Sc; p[(ax + 2) % 3] = b * Sc;
            plot(p, n, false, Math.abs(a) > .96 || Math.abs(b) > .96 ? "#" : undefined); } }
      } else if (shape === "knot") {
        tube(u => [(Math.sin(u) + 2 * Math.sin(2 * u)) / 3.2, (Math.cos(u) - 2 * Math.cos(2 * u)) / 3.2, -Math.sin(3 * u) / 3.2], 0, 6.283, .008, .17, 22);
      } else if (shape === "mobius") {
        const P = (u: number, v: number) => { const w = 1 + v / 2 * Math.cos(u / 2); return [w * Math.cos(u) * .66, v / 2 * Math.sin(u / 2) * .66, w * Math.sin(u) * .66]; };
        for (let u = 0; u < 6.283; u += .012) for (let v = -1; v <= 1; v += .045) { const p = P(u, v), pu = P(u + .001, v), pv = P(u, v + .001); const n = nrm(cross(pu.map((x, i) => x - p[i]), pv.map((x, i) => x - p[i])));
          plot(p, n, true, Math.abs(v) > .95 ? "@" : undefined); }
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
          const x = cl * Math.cos(or), y = sl, z = cl * Math.sin(or);
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
  function loop(t: number) { if (dead) return; raf = requestAnimationFrame(loop); if (t - last < 45) return; const dt = Math.min(.1, (t - last) / 1000); last = t;
    if (!drag) { vB += ((tumble() ? .8 : .45) - vB) * .03; vA += ((tumble() ? .5 : 0) - vA) * .03; A += vA * dt; B += vB * dt; if (!tumble()) A += ((shape === "helix" ? -.2 : -.45) - A) * .02; }
    render((t - t0) / 1000); }
  const down = (e: PointerEvent) => { drag = { x: e.clientX, y: e.clientY, t: performance.now() }; if (pre.setPointerCapture) pre.setPointerCapture(e.pointerId); };
  const move = (e: PointerEvent) => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y, now = performance.now(), dt = Math.max(16, now - drag.t) / 1000; B += dx * .012; A += dy * .012; vB = dx * .012 / dt; vA = dy * .012 / dt; drag = { x: e.clientX, y: e.clientY, t: now }; if (reduce) render(0); };
  const up = () => { drag = null; };
  pre.addEventListener("pointerdown", down); pre.addEventListener("pointermove", move); pre.addEventListener("pointerup", up); pre.addEventListener("pointercancel", up);
  if (window.ResizeObserver) { ro = new ResizeObserver(measure); ro.observe(pre); }
  measure(); if (document.fonts) document.fonts.ready.then(() => { if (!dead) measure(); });
  if (!reduce) raf = requestAnimationFrame(loop);
  return { set(p) { if (p.shape) shape = p.shape; if (reduce) render(0); }, stop() { dead = true; cancelAnimationFrame(raf); if (ro) ro.disconnect(); pre.removeEventListener("pointerdown", down); pre.removeEventListener("pointermove", move); pre.removeEventListener("pointerup", up); pre.removeEventListener("pointercancel", up); } };
}
