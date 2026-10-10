// Phosphor Orbit terminal portfolio — full-viewport CRT home page.
import { CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTerminal } from "@/lib/terminal/useTerminal";
import { PROFILE } from "@/lib/terminal/profile";
import { startField, FieldHandle } from "@/lib/phosphor/field";
import { startOrbit, OrbitHandle, LABELS, pickShape } from "@/lib/phosphor/orbit";
import { decryptDeep, scramble, useRamp, usePrefersReducedMotion } from "@/lib/phosphor/decrypt";
import HudBar from "./HudBar";
import Hero from "./Hero";
import TerminalWindow from "./TerminalWindow";
import OrbitPanel from "./OrbitPanel";
import FKeyBar from "./FKeyBar";
import Panel, { PanelData } from "./Panel";
import Scanlines from "./Scanlines";

const FIELDS = ["plasma", "topo", "flow", "life"];
const INTENSITY: Record<string, number> = { plasma: .5, topo: .55, flow: .5, life: .35 };
const autoIntensity = (f: string) => INTENSITY[f] ?? .45;

interface Pick { field: string; shape: string; }
function newPick(prevShape: string | null): Pick {
  const r = (a: string[]) => a[(Math.random() * a.length) | 0];
  let last = "";
  try { last = localStorage.getItem("phosphor-orbit-last") || ""; } catch { /* ignore */ }
  const lastField = last.split("|")[0], lastShape = prevShape || last.split("|")[1] || null;
  let field = "", n = 0;
  do { field = r(FIELDS); } while (field === lastField && n++ < 20);
  const shape = pickShape(lastShape);
  try { localStorage.setItem("phosphor-orbit-last", field + "|" + shape); } catch { /* ignore */ }
  return { field, shape };
}

const rootStyle: CSSProperties = {
  position: "fixed", inset: 0, overflow: "hidden",
  background: "radial-gradient(ellipse at 50% 40%,#071a0c 0%,#030a04 65%,#010301 100%)",
  color: "#c4ffd2", fontFamily: "'IBM Plex Mono',ui-monospace,monospace", fontSize: "calc(14 * var(--phos-unit))", lineHeight: 1.6,
  letterSpacing: "normal",
  display: "flex", flexDirection: "column", containerType: "inline-size", cursor: "text",
  textShadow: "0 0 calc(4 * var(--phos-unit)) rgba(74,240,122,.3)",
};
const fieldStyle: CSSProperties = {
  position: "absolute", inset: 0, margin: 0, overflow: "hidden", pointerEvents: "none",
  fontFamily: "'IBM Plex Mono',monospace", fontSize: "calc(12 * var(--phos-unit))", lineHeight: "calc(16 * var(--phos-unit))", color: "#4af07a",
  textShadow: "0 0 calc(6 * var(--phos-unit)) rgba(74,240,122,.6)", userSelect: "none",
};
const mainRow: CSSProperties = {
  position: "relative", flex: 1, minHeight: 0, display: "flex", gap: "clamp(10px,2cqw,calc(20 * var(--phos-unit)))",
  padding: "0 clamp(10px,3cqw,calc(32 * var(--phos-unit))) clamp(10px,1.5cqw,calc(16 * var(--phos-unit)))",
};
const leftCol: CSSProperties = { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "clamp(8px,1.2cqw,calc(14 * var(--phos-unit)))" };

export default function PhosphorPortfolio() {
  const t = useTerminal();
  const { rootRef, inputRef, scrollRef, compact, panel } = t;

  const fieldPreRef = useRef<HTMLPreElement>(null);
  const objPreRef = useRef<HTMLPreElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLHeadingElement>(null);
  const fieldRef = useRef<FieldHandle | null>(null);
  const orbitRef = useRef<OrbitHandle | null>(null);

  const [pick, setPick] = useState<Pick>(() => newPick(null));
  const reroll = useCallback(() => setPick(p => newPick(p.shape)), []);

  const reduce = usePrefersReducedMotion();
  const [now, setNow] = useState(() => Date.now());
  const [nameDp, startName] = useRamp();
  const [dpVal, startDp] = useRamp();

  // 1s clock for the orbit panel time.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // ASCII field: create once, then update type/intensity when the pick changes.
  useEffect(() => {
    const el = fieldPreRef.current;
    if (!el) return;
    const f = startField(el, { root: () => rootRef.current, type: pick.field, intensity: autoIntensity(pick.field) });
    fieldRef.current = f;
    return () => f.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    fieldRef.current?.set({ type: pick.field, intensity: autoIntensity(pick.field) });
  }, [pick.field]);

  // Orbit object: desktop only; recreate on shape change, tear down when hidden.
  useEffect(() => {
    if (compact) {
      if (orbitRef.current) { orbitRef.current.stop(); orbitRef.current = null; }
      return;
    }
    const el = objPreRef.current;
    if (!el) return;
    if (!orbitRef.current) orbitRef.current = startOrbit(el, { shape: pick.shape });
    else orbitRef.current.set({ shape: pick.shape });
  }, [compact, pick.shape]);
  useEffect(() => () => { if (orbitRef.current) orbitRef.current.stop(); }, []);

  // Fit the hero name: binary search a font size so the block fits its wrapper
  // and the h1 never overflows its own width.
  const fit = useCallback(() => {
    const w = wrapRef.current, h = heroRef.current;
    if (!w || !h) return;
    const blk = h.parentElement as HTMLElement;
    // The mockup's 230px ceiling is at a 2551 CSS-pixel desktop viewport.
    // Fit within that responsive ceiling rather than magnifying the name at zoom.
    const unit = parseFloat(getComputedStyle(rootRef.current!).fontSize) / 14;
    let lo = 28, hi = 230 * unit;
    for (let k = 0; k < 9; k++) {
      const m = (lo + hi) / 2;
      h.style.fontSize = m + "px";
      if (blk.offsetHeight <= w.clientHeight && h.scrollWidth <= h.clientWidth + 1) lo = m; else hi = m;
    }
    h.style.fontSize = Math.floor(lo) + "px";
  }, [rootRef]);
  useLayoutEffect(() => { fit(); }, [fit, compact, t.booted]);
  useEffect(() => {
    if (document.fonts) document.fonts.ready.then(fit);
    let ro: ResizeObserver | null = null;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => fit());
      if (wrapRef.current) ro.observe(wrapRef.current);
    }
    return () => { if (ro) ro.disconnect(); };
  }, [fit]);

  // Hero decrypt on boot, plus the periodic "glitch" re-scramble.
  // Under reduced motion the name is simply shown revealed (no ramp).
  const bootedRef = useRef(false);
  useEffect(() => {
    if (reduce) return;
    if (t.booted && !bootedRef.current) { bootedRef.current = true; startName(1400, 0); }
  }, [reduce, t.booted, startName]);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (bootedRef.current && !panel) startName(450, 0.5);
    }, 8000);
    return () => clearInterval(id);
  }, [reduce, panel, startName]);
  const nameProgress = reduce ? 1 : nameDp;

  // Panel decrypt: render dp=0 on the first frame a panel opens (no plain flash).
  const dpForRef = useRef<string | null>(null);
  useLayoutEffect(() => {
    if (reduce) return;
    if (panel && panel !== dpForRef.current) { dpForRef.current = panel; startDp(650, 0); }
    if (!panel) dpForRef.current = null;
  }, [reduce, panel, startDp]);
  const dp = reduce ? (panel ? 1 : 0) : (panel && panel === dpForRef.current ? dpVal : 0);

  // Focus the hidden input on mount so typing works immediately.
  useEffect(() => { inputRef.current?.focus({ preventScroll: true }); }, [inputRef]);

  const data = useMemo<PanelData>(() => decryptDeep({
    pName: PROFILE.name, pTitle: PROFILE.title, pLocation: PROFILE.location,
    pAbout: PROFILE.about.join(" "), skills: PROFILE.skills, experience: PROFILE.experience,
    contact: PROFILE.contact, repos: t.repos,
  }, dp), [dp, t.repos]);

  const heroA = scramble("NADA", nameProgress);
  const heroB = scramble("IBRAHIM", nameProgress);
  const shapeName = LABELS[pick.shape] || pick.shape;
  const time = new Date(now).toLocaleTimeString("en-US", { timeZone: "America/New_York", hour12: false });

  return (
    <div ref={rootRef} className="phos-root" data-screen-label="signal-orbit" onClick={t.focus} style={rootStyle}>
      <input
        ref={inputRef} value={t.input} onChange={t.onInput} onKeyDown={t.onKey}
        autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-label="terminal input"
        style={{ position: "absolute", opacity: 0, width: 1, height: 1, left: 0, top: 0, border: 0, padding: 0 }}
      />
      <pre ref={fieldPreRef} aria-hidden="true" style={fieldStyle} />

      <HudBar />

      <div style={mainRow}>
        <div style={leftCol}>
          <Hero wrapRef={wrapRef} heroRef={heroRef} heroA={heroA} heroB={heroB} />
          <TerminalWindow scrollRef={scrollRef} lines={t.lines} booted={t.booted} prompt={t.prompt} input={t.input} />
        </div>
        {!compact && <OrbitPanel objRef={objPreRef} shapeName={shapeName} reroll={reroll} time={time} />}
      </div>

      <FKeyBar run={t.run} />

      {t.panelOpen && panel && (
        <Panel panel={panel} dp={dp} data={data} reposLoading={t.reposLoading} repoCount={t.repoCount} close={t.close} />
      )}

      <Scanlines animate={!reduce} />
    </div>
  );
}
