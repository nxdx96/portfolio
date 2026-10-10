// Docked terminal: title bar + scrolling line area + live prompt.
import { CSSProperties, RefObject } from "react";

interface RenderLine {
  id: string;
  text: string;
  color: string;
  isLink: boolean;
  href?: string;
}
interface TerminalWindowProps {
  scrollRef: RefObject<HTMLDivElement>;
  lines: RenderLine[];
  booted: boolean;
  prompt: string;
  input: string;
}

const frame: CSSProperties = {
  flex: "none", minWidth: 0, display: "flex", flexDirection: "column",
  background: "rgba(2,7,3,.93)", border: "1px solid #2f9a55", boxShadow: "0 0 calc(30 * var(--phos-unit)) rgba(0,0,0,.6)",
};
const titleBar: CSSProperties = {
  flex: "none", display: "flex", justifyContent: "space-between", gap: "calc(12 * var(--phos-unit))", padding: "calc(3 * var(--phos-unit)) calc(14 * var(--phos-unit))",
  borderBottom: "1px solid #14401f", fontFamily: "'VT323',ui-monospace,monospace", fontSize: "calc(var(--phos-title-size, 18) * var(--phos-unit))",
  letterSpacing: ".08em", textTransform: "uppercase", color: "#3fb168",
};
const scroll: CSSProperties = { boxSizing: "content-box", height: "clamp(calc(190 * var(--phos-unit)),24cqw,calc(300 * var(--phos-unit)))", maxHeight: "max(80px,min(40dvh,calc(100dvh - 400px)))", overflowY: "auto", overflowX: "hidden", padding: "calc(10 * var(--phos-unit)) calc(14 * var(--phos-unit))" };
const lineRow: CSSProperties = { display: "flex", flexWrap: "wrap", whiteSpace: "pre-wrap", wordBreak: "break-word", minHeight: "1.6em" };

export default function TerminalWindow({ scrollRef, lines, booted, prompt, input }: TerminalWindowProps) {
  return (
    <div style={frame}>
      <div style={titleBar}>
        <span>■ tty1 — C:\PORTFOLIO</span>
        <span>[tab] complete</span>
      </div>
      <div ref={scrollRef} style={scroll}>
        {lines.map(l => (
          <div key={l.id} style={lineRow}>
            {l.isLink
              ? <a href={l.href} target="_blank" rel="noopener noreferrer" style={{ color: l.color, textDecoration: "underline", textUnderlineOffset: 3 }}>{l.text}</a>
              : <span style={{ color: l.color }}>{l.text}</span>}
          </div>
        ))}
        {booted && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "calc(10 * var(--phos-unit))", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            <span style={{ flex: "none", color: "#4af07a" }}>{prompt}</span>
            <span style={{ color: "#e6ffec" }}>{input}</span>
            <span style={{ display: "inline-block", width: "calc(9 * var(--phos-unit))", height: "1.2em", background: "#4af07a", verticalAlign: "text-bottom", animation: "blink .9s steps(1) infinite" }} />
          </div>
        )}
      </div>
    </div>
  );
}
