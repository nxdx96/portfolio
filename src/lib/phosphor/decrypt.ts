// Text decrypt effect + ramp hook, ported from `phosphor-fx.js`.
import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$*+=<>/\\[]{}";
const jit = (i: number) => (Math.imul(i + 1, 2654435761) >>> 0) % 1000 / 1000;

export function scramble(s: string | null | undefined, p: number): string {
  if (s == null || p >= 1) return s as string;
  s = String(s);
  let o = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === " " || ch === "\n") { o += ch; continue; }
    o += (i / Math.max(1, s.length)) * .6 + jit(i) * .4 < p ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
  }
  return o;
}

const SKIP = new Set(["href", "url", "langColor", "homepage", "resumeUrl", "idx", "stars", "forks"]);
export function decryptDeep<T>(v: T, p: number, k?: string): T {
  if (p >= 1) return v;
  if (typeof v === "string") return (SKIP.has(k as string) ? v : scramble(v, p)) as T;
  if (Array.isArray(v)) return v.map((x) => decryptDeep(x, p, k)) as T;
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const key in v) o[key] = decryptDeep((v as Record<string, unknown>)[key], p, key);
    return o as T;
  }
  return v;
}

// React port of `ramp()`: returns the current 0..1 value and a trigger to start
// a ramp from `from` to 1 over `ms` milliseconds (requestAnimationFrame driven).
export function useRamp(): [number, (ms: number, from?: number) => void] {
  const [val, setVal] = useState(0);
  const raf = useRef(0);
  const start = useCallback((ms: number, from = 0) => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, from + (1 - from) * Math.max(0, t - t0) / ms);
      setVal(p);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return [val, start];
}

export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}
