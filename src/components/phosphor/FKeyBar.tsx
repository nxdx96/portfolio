// Function-key bar. Buttons mirror the global F1-F5 / F10 keyboard shortcuts.
import { CSSProperties } from "react";

const bar: CSSProperties = {
  position: "relative", flex: "none", display: "flex", flexWrap: "wrap", gap: "calc(2 * var(--phos-unit)) calc(6 * var(--phos-unit))",
  padding: "calc(6 * var(--phos-unit)) clamp(10px,2cqw,calc(26 * var(--phos-unit))) calc(8 * var(--phos-unit))", borderTop: "1px solid #1f6b3a",
  background: "rgba(2,7,3,.94)", fontFamily: "'VT323',ui-monospace,monospace",
  fontSize: "calc(20 * var(--phos-unit))", lineHeight: 1.2, cursor: "default",
};
const chip: CSSProperties = { background: "#4af07a", color: "#020703", padding: "0 calc(6 * var(--phos-unit))", textShadow: "none" };

interface Runs {
  help: () => void; about: () => void; resume: () => void;
  projects: () => void; contact: () => void; clear: () => void;
}
const KEYS: [string, string, keyof Runs][] = [
  ["F1", "HELP", "help"], ["F2", "ABOUT", "about"], ["F3", "RESUME", "resume"],
  ["F4", "PROJECTS", "projects"], ["F5", "CONTACT", "contact"], ["F10", "CLEAR", "clear"],
];

export default function FKeyBar({ run }: { run: Runs }) {
  return (
    <div data-nofocus="1" style={bar}>
      {KEYS.map(([k, label, fn]) => (
        <button key={k} className="phos-fkey" onClick={run[fn]}>
          <span style={chip}>{k}</span>{label}
        </button>
      ))}
    </div>
  );
}
