// Large pixel-font name (font size fitted in JS by the parent) + tag line.
import { CSSProperties, RefObject } from "react";

const wrap: CSSProperties = {
  position: "relative", flex: 1, minHeight: 0, overflow: "hidden",
  display: "flex", alignItems: "flex-start", gap: "clamp(16px,3cqw,40px)",
};
const block: CSSProperties = { position: "relative", flex: 1, minWidth: 0, padding: "clamp(4px,1.5cqw,calc(24 * var(--phos-unit))) calc(2 * var(--phos-unit)) 0", userSelect: "none" };
const h1: CSSProperties = {
  margin: "0 0 calc(14 * var(--phos-unit))", fontFamily: "'VT323',ui-monospace,monospace", fontWeight: 400,
  letterSpacing: "normal",
  lineHeight: .78, color: "#e6ffec", textShadow: "0 0 calc(18 * var(--phos-unit)) rgba(74,240,122,.55),0 0 calc(2 * var(--phos-unit)) #fff",
  display: "flex", flexWrap: "wrap", columnGap: ".28em",
};
const tags: CSSProperties = {
  display: "flex", flexWrap: "wrap", gap: "calc(4 * var(--phos-unit)) calc(14 * var(--phos-unit))", fontFamily: "'VT323',ui-monospace,monospace",
  fontSize: "calc(var(--phos-tag-size, 22) * var(--phos-unit))", lineHeight: 1.1, letterSpacing: ".06em", textTransform: "uppercase", color: "#4af07a",
};
const sep: CSSProperties = { color: "#2f9a55" };

interface HeroProps {
  wrapRef: RefObject<HTMLDivElement>;
  heroRef: RefObject<HTMLHeadingElement>;
  heroA: string;
  heroB: string;
}

export default function Hero({ wrapRef, heroRef, heroA, heroB }: HeroProps) {
  return (
    <div ref={wrapRef} style={wrap}>
      <div style={block}>
        {/* font-size is set imperatively by the parent's fit(); keep it out of this style object. */}
        <h1 ref={heroRef} aria-label="Nada Ibrahim" style={h1}>
          <span>{heroA}</span>
          <span>{heroB}</span>
        </h1>
        <div style={tags}>
          <span>software engineer</span><span style={sep}>/</span>
          <span>full-stack</span><span style={sep}>/</span>
          <span>backend</span><span style={sep}>/</span>
          <span>data</span>
        </div>
      </div>
    </div>
  );
}
