// Overlay panel (about / resume / projects / contact). All copy is passed in
// pre-decrypted; hrefs/urls/colors/numbers are preserved by decryptDeep.
import { CSSProperties } from "react";
import { PROFILE, ContactItem, Job, Repo, SkillGroup } from "@/lib/terminal/profile";

export interface PanelData {
  pName: string;
  pTitle: string;
  pLocation: string;
  pAbout: string;
  skills: SkillGroup[];
  experience: Job[];
  contact: ContactItem[];
  repos: Repo[];
}
interface PanelProps {
  panel: string;
  dp: number;
  data: PanelData;
  reposLoading: boolean;
  repoCount: number;
  close: () => void;
}

const backdrop: CSSProperties = {
  position: "absolute", inset: 0, zIndex: 5, display: "flex", alignItems: "center",
  justifyContent: "center", padding: "clamp(8px,3cqw,48px)", background: "rgba(1,5,2,.86)", cursor: "default",
};
const card: CSSProperties = {
  position: "relative", width: "min(880px,100%)", maxHeight: "100%", display: "flex",
  flexDirection: "column", background: "#030a04", border: "1px solid #2f9a55",
  boxShadow: "0 0 48px rgba(74,240,122,.14)", animation: "decrypt .45s steps(9,end)",
};
const corner = (pos: CSSProperties): CSSProperties => ({ position: "absolute", width: 16, height: 16, ...pos });
const header: CSSProperties = {
  flex: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  padding: "8px clamp(14px,3cqw,24px)", fontFamily: "'VT323',ui-monospace,monospace", fontSize: 22,
  lineHeight: 1.1, letterSpacing: ".06em", textTransform: "uppercase", color: "#4af07a",
};
const body: CSSProperties = {
  flex: 1, minHeight: 0, overflowY: "auto", padding: "24px clamp(16px,3cqw,28px) 28px",
  display: "flex", flexDirection: "column", gap: 20, textShadow: "none",
};
const title: CSSProperties = {
  fontFamily: "'VT323',monospace", fontSize: "clamp(40px,7cqw,64px)", lineHeight: .85,
  textTransform: "uppercase", color: "#e6ffec", textShadow: "0 0 12px rgba(74,240,122,.45)",
};
const titleRow: CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 };

export default function Panel({ panel, dp, data, reposLoading, repoCount, close }: PanelProps) {
  const pct = Math.round(dp * 100);
  const panelFile = panel.toUpperCase() + ".SYS";
  const decryptLabel = dp < 1 ? "decrypting " + pct + "%" : "decrypted";

  return (
    <div data-nofocus="1" onClick={close} style={backdrop}>
      <div onClick={e => e.stopPropagation()} style={card}>
        <div style={corner({ top: -2, left: -2, borderTop: "3px solid #c4ffd2", borderLeft: "3px solid #c4ffd2" })} />
        <div style={corner({ top: -2, right: -2, borderTop: "3px solid #c4ffd2", borderRight: "3px solid #c4ffd2" })} />
        <div style={corner({ bottom: -2, left: -2, borderBottom: "3px solid #c4ffd2", borderLeft: "3px solid #c4ffd2" })} />
        <div style={corner({ bottom: -2, right: -2, borderBottom: "3px solid #c4ffd2", borderRight: "3px solid #c4ffd2" })} />

        <div style={header}>
          <span>▓▓ {panelFile} <span style={{ color: "#3fb168" }}>· {decryptLabel}</span></span>
          <button className="phos-close" onClick={close} style={{ whiteSpace: "nowrap" }}>[ESC] CLOSE</button>
        </div>
        <div style={{ flex: "none", height: 2, background: "#14401f" }}>
          <div style={{ height: "100%", width: pct + "%", background: "#4af07a", boxShadow: "0 0 8px #4af07a" }} />
        </div>

        <div style={body}>
          {panel === "about" && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={title}>{data.pName}</div>
                <div style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "#4af07a" }}>{data.pTitle} · {data.pLocation}</div>
              </div>
              <p style={{ margin: 0, maxWidth: "64ch", fontSize: 15, lineHeight: 1.7, color: "#c4ffd2" }}>{data.pAbout}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: 1, background: "#14401f", border: "1px solid #14401f" }}>
                {data.skills.map((g, gi) => (
                  <div key={gi} style={{ background: "#030a04", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontFamily: "'VT323',ui-monospace,monospace", fontSize: 21, lineHeight: 1.1, textTransform: "uppercase", color: "#4af07a" }}>{g.h}</div>
                    {g.items.map((it, ii) => <div key={ii} style={{ fontSize: 13, lineHeight: 1.55, color: "#c4ffd2" }}>{it}</div>)}
                  </div>
                ))}
              </div>
            </>
          )}

          {panel === "resume" && (
            <>
              <div style={titleRow}>
                <div style={title}>Service record</div>
                <a className="phos-dl" href={PROFILE.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'VT323',ui-monospace,monospace", fontSize: 20, textTransform: "uppercase", textDecoration: "none", color: "#020703", background: "#4af07a", padding: "4px 12px" }}>[ download pdf ]</a>
              </div>
              {data.experience.map((j, ji) => (
                <div key={ji} style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", borderTop: "1px solid #14401f", paddingTop: 14 }}>
                  <div style={{ flex: "0 0 110px", fontFamily: "'VT323',ui-monospace,monospace", fontSize: 21, lineHeight: 1.2, color: "#4af07a" }}>{j.years}</div>
                  <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#e6ffec" }}>{j.role} <span style={{ fontWeight: 400, color: "#4af07a" }}>— {j.co}</span></div>
                    {j.bullets.map((b, bi) => (
                      <div key={bi} style={{ display: "grid", gridTemplateColumns: "16px minmax(0,1fr)", fontSize: 13.5, lineHeight: 1.6, color: "#c4ffd2" }}>
                        <span style={{ color: "#3fb168" }}>▸</span><span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {panel === "contact" && (
            <>
              <div style={title}>Open channels</div>
              <p style={{ margin: 0, fontSize: 15, color: "#c4ffd2" }}>{data.pLocation}. Response within 24 hours.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: 8 }}>
                {data.contact.map((kk, ci) => (
                  <a key={ci} className="phos-contact" href={kk.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", flexDirection: "column", gap: 2, padding: "12px 14px", border: "1px solid #1f6b3a", textDecoration: "none", color: "#e6ffec" }}>
                    <span style={{ fontFamily: "'VT323',ui-monospace,monospace", fontSize: 20, textTransform: "uppercase", color: "#4af07a" }}>{kk.label}</span>
                    <span style={{ fontSize: 14, wordBreak: "break-all" }}>{kk.value}</span>
                  </a>
                ))}
              </div>
            </>
          )}

          {panel === "projects" && (
            <>
              <div style={titleRow}>
                <div style={title}>Repositories</div>
                <span style={{ fontFamily: "'VT323',ui-monospace,monospace", fontSize: 19, textTransform: "uppercase", color: "#3fb168" }}>{repoCount} public · live from github</span>
              </div>
              {reposLoading && <div style={{ color: "#3fb168" }}>reading github.com/nxdx96 …</div>}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {data.repos.map((r, ri) => (
                  <a key={ri} className="phos-repo" href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: "grid", gridTemplateColumns: "40px minmax(0,1fr) auto", gap: "2px 12px", padding: "12px 8px", borderTop: "1px solid #14401f", textDecoration: "none", color: "#c4ffd2" }}>
                    <span style={{ fontFamily: "'VT323',ui-monospace,monospace", fontSize: 22, lineHeight: 1.1, color: "#4af07a" }}>{r.idx}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", color: "#e6ffec", wordBreak: "break-word" }}>{r.name}</span>
                    <span style={{ fontSize: 12, color: "#3fb168" }}>{r.updated}</span>
                    <span />
                    <span style={{ gridColumn: "2/4", fontSize: 13.5, lineHeight: 1.55 }}>{r.desc}</span>
                    <span />
                    <span style={{ gridColumn: "2/4", display: "flex", gap: 14, fontSize: 12, color: "#3fb168" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, background: r.langColor }} />{r.lang}</span>
                      <span>★ {r.stars}</span>
                    </span>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
