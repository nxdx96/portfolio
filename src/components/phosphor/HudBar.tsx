// Top HUD row: identity + "open to work" status.
import { CSSProperties } from "react";

const row: CSSProperties = {
  position: "relative", flex: "none", display: "flex", justifyContent: "space-between",
  alignItems: "flex-start", gap: "calc(16 * var(--phos-unit))", padding: "calc(12 * var(--phos-unit)) clamp(14px,3cqw,calc(32 * var(--phos-unit)))",
  fontFamily: "'VT323',ui-monospace,monospace", fontSize: "calc(var(--phos-hud-size, 19) * var(--phos-unit))", lineHeight: 1.2,
  letterSpacing: ".06em", textTransform: "uppercase",
};

export default function HudBar() {
  return (
    <div style={row}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ color: "#4af07a" }}>◉ signal // nada-os v2.0</span>
        <span style={{ color: "#3fb168" }}>clearance: public</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
        <span style={{ display: "flex", gap: "calc(8 * var(--phos-unit))", alignItems: "center", color: "#e6ffec" }}>
          <span style={{ width: "calc(8 * var(--phos-unit))", height: "calc(8 * var(--phos-unit))", background: "#4af07a", boxShadow: "0 0 calc(8 * var(--phos-unit)) #4af07a", animation: "pulse 1.2s steps(2) infinite" }} />
          open to work
        </span>
        <span style={{ color: "#3fb168" }}>remote ok</span>
      </div>
    </div>
  );
}
