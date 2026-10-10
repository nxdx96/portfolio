// React port of the terminal engine `attach()` from `terminal-core.js`.
// The mutable engine state lives in a ref (mirroring the prototype's class
// state); `force()` triggers React re-renders, so `exec()` and friends stay a
// near-verbatim port.
import { useEffect, useReducer, useRef } from "react";
import { CATS, FALLBACK, FILES, HELP, PETS, PROFILE, Repo, fetchRepos } from "./profile";
import { BANNER, BOOT, FKEYS, HELP_EXTRA, PALETTE } from "@/lib/phosphor/constants";

export type LineType = "cmd" | "out" | "dim" | "err" | "h" | "link";
export interface Line {
  t: LineType;
  text: string;
  id: string;
  href?: string;
}
interface EngineState {
  lines: Line[];
  input: string;
  panel: string | null;
  repos: Repo[] | null;
  reposErr: string | null;
  hist: string[];
  hi: number;
  compact: boolean;
  booted: boolean;
}

type Refs = {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  rootRef: React.MutableRefObject<HTMLDivElement | null>;
};

function createEngine(stateRef: React.MutableRefObject<EngineState>, force: () => void, refs: Refs) {
  const { inputRef, scrollRef, rootRef } = refs;
  const prompt = "C:\\PORTFOLIO>";
  const pal = PALETTE;
  const delay = 16;
  const banner = BANNER;
  let catI = 0, petI = 0, queue: Line[] = [], qTimer: ReturnType<typeof setTimeout> | null = null, bootTimer: ReturnType<typeof setTimeout> | null = null;
  let ro: ResizeObserver | null = null, fkHandler: ((e: KeyboardEvent) => void) | null = null, lastLen = -1;
  const reduce = typeof window !== "undefined" && window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const S = () => stateRef.current;
  const set = (p: Partial<EngineState>) => { Object.assign(stateRef.current, p); force(); };
  const mk = (t: LineType, text: string, extra?: Partial<Line>): Line => Object.assign({ t, text, id: Math.random().toString(36).slice(2) }, extra);
  const push = (...ls: Line[]) => set({ lines: [...S().lines, ...ls] });

  function enqueue(ls: Line[]) { queue.push(...ls); if (!qTimer) tick(); }
  function tick() {
    if (!queue.length) { qTimer = null; return; }
    const l = queue.shift() as Line; push(l);
    qTimer = setTimeout(tick, l.t === "cmd" ? 0 : delay);
  }
  const out = (arr: (string | Line)[], t: LineType = "out"): Line[] => arr.map(x => typeof x === "string" ? mk(t, x) : x);

  const openPanel = (name: string) => set({ panel: name });
  const close = () => set({ panel: null });

  function listRepos(): Line[] {
    const r = S().repos;
    if (!r) return [mk("dim", "fetching github.com/" + PROFILE.github + " ...")];
    return [mk("h", `${r.length} public repositories (github.com/${PROFILE.github})`),
      ...r.map(p => mk("link", `  ${String(p.idx).padStart(2, " ")}. ${p.name}  —  ${p.desc}`, { href: p.url })),
      mk("dim", r[0]?.offline ? "  (GitHub API unavailable — showing featured list)" : "  type 'open <n>' to view a repo, or click a name")];
  }

  function ensureRepos() {
    if (S().repos) return Promise.resolve();
    return fetchRepos().then(r => set({ repos: r.length ? r : FALLBACK })).catch(e => set({ repos: FALLBACK, reposErr: String(e.message) }));
  }

  function exec(raw: string) {
    const cmd = raw.trim(); if (!cmd) { push(mk("cmd", prompt)); return; }
    const [name, ...args] = cmd.toLowerCase().split(/\s+/);
    set({ hist: [...S().hist, cmd], hi: -1, input: "" });
    const L = [mk("cmd", prompt + " " + cmd)];
    const done = (...ls: Line[]) => enqueue([...L, ...ls, mk("out", "")]);
    switch (name) {
      case "help": return done(mk("h", "Available commands:"), ...out(HELP), ...out(HELP_EXTRA, "dim"));
      case "about": openPanel("about"); return done(...out(PROFILE.about), mk("dim", "→ opened about panel"));
      case "skills": return done(...PROFILE.skills.flatMap(g => [mk("h", g.h + ":"), ...g.items.map(i => mk("out", "  • " + i))]));
      case "experience": return done(mk("h", "Professional Experience:"), ...PROFILE.experience.flatMap(j => [mk("h", `${j.role} - ${j.co} (${j.years})`), ...j.bullets.map(b => mk("out", "  • " + b))]));
      case "resume": openPanel("resume"); return done(mk("dim", "→ opened resume panel"), mk("link", "  download resume.pdf", { href: PROFILE.resumeUrl }));
      case "contact": openPanel("contact"); return done(mk("h", "Contact Information:"), ...PROFILE.contact.map(k => mk("link", `  ${k.label.padEnd(9)} ${k.value}`, { href: k.href })));
      case "projects": case "ls":
        if (args[0] === undefined && name === "ls") return done(...out(["about.txt   readme.md   resume.pdf   projects/"]));
        openPanel("projects"); ensureRepos().then(() => enqueue([...listRepos(), mk("out", "")])); return enqueue(L);
      case "open": { const n = parseInt(args[0]); const r = (S().repos || [])[n - 1];
        if (r) { window.open(r.url, "_blank", "noopener"); return done(mk("dim", "→ opening " + r.url)); }
        return done(mk("err", "open: no project #" + (args[0] || "?") + " — run 'projects' first")); }
      case "clear": queue = []; set({ lines: out(banner) }); return;
      case "cat": if (args[0]) { const f = FILES[args[0]]; return f ? done(...out(f)) : done(mk("err", `cat: ${args[0]}: No such file or directory`)); }
        { const v = CATS[catI]; catI = (catI + 1) % CATS.length; return done(...out(v)); }
      case "pet": { const v = PETS[petI]; petI = (petI + 1) % PETS.length; return done(...out(v)); }
      case "echo": return done(mk("out", cmd.slice(5)));
      case "whoami": return done(mk("out", `${PROFILE.name} — ${PROFILE.title} (${PROFILE.tags.join(" · ")})`));
      case "pwd": return done(mk("out", "/home/nada/portfolio"));
      case "sudo": return done(mk("err", "nada is not in the sudoers file. This incident will be reported."));
      case "exit": case "q": close(); return done(mk("dim", "there is no exit. try 'projects'."));
      default: return done(mk("err", `bash: ${name}: command not found`), mk("dim", "type 'help' for commands"));
    }
  }

  const focus = (e?: React.MouseEvent) => {
    const target = e?.target as HTMLElement | undefined;
    if (target && target.closest && target.closest("a,button,input,[data-nofocus]")) return;
    if (window.getSelection()?.toString()) return;
    if (inputRef.current) inputRef.current.focus({ preventScroll: true });
  };
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => set({ input: e.target.value });
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const h = S().hist;
    if (e.key === "Enter") { exec(S().input); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const i = Math.min(S().hi + 1, h.length - 1); if (i >= 0) set({ hi: i, input: h[h.length - 1 - i] }); }
    else if (e.key === "ArrowDown") { e.preventDefault(); const i = S().hi - 1; set(i < 0 ? { hi: -1, input: "" } : { hi: i, input: h[h.length - 1 - i] }); }
    else if (e.key === "Escape") close();
    else if (e.key === "Tab") { e.preventDefault(); const v = S().input.toLowerCase(); const m = ["help", "about", "skills", "experience", "projects", "resume", "contact", "clear", "cat", "pet"].find(k => k.startsWith(v) && v); if (m) set({ input: m }); }
    else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); exec("clear"); }
  };
  const run = (cmd: string) => () => { exec(cmd); };

  function mount() {
    if (reduce) { set({ booted: true, lines: out(banner) }); }
    else {
      let i = 0;
      const bt = () => {
        if (i < BOOT.length) { push(mk("dim", BOOT[i])); i++; bootTimer = setTimeout(bt, 190); }
        else { set({ booted: true, lines: out(banner) }); bootTimer = null; }
      };
      bt();
    }
    ensureRepos();
    const el = rootRef.current;
    const apply = (w: number) => { const compact = w < 720; if (compact !== S().compact) set({ compact }); };
    if (el) {
      apply(el.getBoundingClientRect().width);
      if (window.ResizeObserver) { ro = new ResizeObserver(en => apply(en[0].contentRect.width)); ro.observe(el); }
    }
    fkHandler = e => {
      if (e.key === "Escape") { if (S().panel) close(); return; }
      const cmd = FKEYS[e.key]; if (!cmd) return;
      e.preventDefault(); if (!S().booted) return;
      exec(cmd); if (inputRef.current) inputRef.current.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", fkHandler);
  }
  function afterUpdate() { const n = S().lines.length; if (n === lastLen) return; lastLen = n; const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }
  function unmount() {
    if (qTimer) clearTimeout(qTimer);
    if (bootTimer) clearTimeout(bootTimer);
    if (ro) ro.disconnect();
    if (fkHandler) window.removeEventListener("keydown", fkHandler);
  }

  function vals() {
    const s = S(), p = s.panel;
    return {
      prompt,
      lines: s.lines.map(l => ({ ...l, color: pal[l.t] || pal.out, isLink: l.t === "link" })),
      input: s.input, booted: s.booted, compact: s.compact, wide: !s.compact,
      panel: p, panelOpen: !!p,
      repos: s.repos || [], reposLoading: !s.repos, repoCount: (s.repos || []).length, reposErr: s.reposErr,
      close, onInput, onKey, focus,
      run: { help: run("help"), about: run("about"), resume: run("resume"), projects: run("projects"), contact: run("contact"), clear: run("clear") },
    };
  }
  return { mount, unmount, afterUpdate, exec, vals };
}

export function useTerminal() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<EngineState>({
    lines: [], input: "", panel: null, repos: null, reposErr: null, hist: [], hi: -1, compact: false, booted: false,
  });
  const [, force] = useReducer((c: number) => c + 1, 0);
  const engineRef = useRef<ReturnType<typeof createEngine> | null>(null);
  if (!engineRef.current) engineRef.current = createEngine(stateRef, force, { inputRef, scrollRef, rootRef });
  const engine = engineRef.current;

  useEffect(() => {
    engine.mount();
    return () => engine.unmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Auto-scroll after every render where the line count changed.
  useEffect(() => { engine.afterUpdate(); });

  return { ...engine.vals(), exec: engine.exec, inputRef, scrollRef, rootRef };
}
