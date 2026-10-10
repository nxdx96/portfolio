// CRT overlay: scanlines + rolling glow band + vignette.
import { CSSProperties } from "react";

const layer: CSSProperties = { position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none" };

export default function Scanlines({ animate = true }: { animate?: boolean }) {
  return (
    <>
      {animate && (
        <>
          <div aria-hidden="true" style={{ ...layer, background: "repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 var(--phos-unit),transparent var(--phos-unit) calc(3 * var(--phos-unit)))", animation: "flicker 5s infinite" }} />
          <div aria-hidden="true" style={{ ...layer, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: "calc(140 * var(--phos-unit))", background: "linear-gradient(180deg,transparent,rgba(74,240,122,.05),transparent)", animation: "roll 8s linear infinite" }} />
          </div>
        </>
      )}
      {!animate && (
        <div aria-hidden="true" style={{ ...layer, background: "repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 var(--phos-unit),transparent var(--phos-unit) calc(3 * var(--phos-unit)))" }} />
      )}
      <div aria-hidden="true" style={{ ...layer, boxShadow: "inset 0 0 calc(140 * var(--phos-unit)) calc(20 * var(--phos-unit)) rgba(0,0,0,.7)" }} />
    </>
  );
}
