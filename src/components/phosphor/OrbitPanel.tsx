// Desktop-only orbit panel: header + draggable ASCII object + stats footer.
import { CSSProperties, RefObject } from "react";

interface OrbitPanelProps {
  objRef: RefObject<HTMLPreElement>;
  shapeName: string;
  reroll: () => void;
  time: string;
}

const panel: CSSProperties = {
  flex: "none", width: "clamp(200px,18.82cqw,480px)", boxSizing: "content-box", display: "flex", flexDirection: "column",
  minHeight: 0, background: "rgba(2,7,3,.72)", border: "1px solid #1f6b3a",
  fontFamily: "'VT323',ui-monospace,monospace", fontSize: "calc(18 * var(--phos-unit))", lineHeight: 1.2,
  textTransform: "uppercase", cursor: "default",
};
const header: CSSProperties = {
  flex: "none", minWidth: 0, display: "flex", justifyContent: "space-between", gap: "calc(10 * var(--phos-unit))", padding: "calc(4 * var(--phos-unit)) calc(12 * var(--phos-unit))",
  borderBottom: "1px solid #14401f", color: "#3fb168",
};
const obj: CSSProperties = {
  flex: 1, minHeight: 0, margin: 0, overflow: "hidden", cursor: "grab", touchAction: "none",
  fontFamily: "'IBM Plex Mono',monospace", fontSize: "calc(9 * var(--phos-unit))", lineHeight: "calc(10 * var(--phos-unit))", color: "#c4ffd2",
  textShadow: "0 0 calc(5 * var(--phos-unit)) rgba(74,240,122,.7)", userSelect: "none", textTransform: "none",
};
const footer: CSSProperties = {
  flex: "none", display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "0 calc(14 * var(--phos-unit))",
  padding: "calc(6 * var(--phos-unit)) calc(12 * var(--phos-unit)) calc(8 * var(--phos-unit))", borderTop: "1px solid #14401f",
};
const k: CSSProperties = { color: "#3fb168" };
const v: CSSProperties = { color: "#e6ffec" };

export default function OrbitPanel({ objRef, shapeName, reroll, time }: OrbitPanelProps) {
  return (
    <div data-nofocus="1" style={panel}>
      <div style={header}>
        <span style={{ color: "#4af07a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>▓ orbit // {shapeName}</span>
        <span style={{ display: "flex", gap: 12, whiteSpace: "nowrap" }}>
          <button className="phos-reroll" onClick={reroll} title="New shape and background">[↻ reroll]</button>
        </span>
      </div>
      <pre ref={objRef} aria-hidden="true" style={obj} />
      <div style={footer}>
        <span style={k}>base</span><span style={v}>new york · 40.71n 74.00w</span>
        <span style={k}>local</span><span style={v}>{time} est</span>
        <span style={k}>range</span><span style={v}>remote ok</span>
        <span style={k}>input</span><span style={v}>drag to spin</span>
      </div>
    </div>
  );
}
