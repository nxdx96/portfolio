// Shared terminal engine + profile data for all Terminal Portfolio designs.
export const PROFILE = {
  name: "Nada Ibrahim", first: "nada", title: "Software Engineer",
  tags: ["Full-Stack", "Backend", "Data Engineer"],
  location: "New York City Metro · open to remote",
  github: "nxdx96", resumeUrl: "/resume.pdf",
  about: [
    "Experienced Software Engineer with 5+ years specializing in designing",
    "and scaling high-performance data infrastructure and distributed systems,",
    "with a proven track record of architecting enterprise-grade platforms.",
  ],
  skills: [
    { h: "Big Data & Infrastructure", items: ["Airflow DAGs, Snowflake, PostgreSQL, MongoDB", "High-volume Data Processing, Data Pipeline Optimization", "Vector Search & Indexing"] },
    { h: "Programming Languages", items: ["Python, Java, JavaScript, C#, .NET", "Flask, Node.js, RESTful API Development"] },
    { h: "Cloud & DevOps", items: ["AWS (CloudFormation, ECS, S3, Step Functions, Lambda, SNS/SQS)", "Docker, CI/CD Pipelines"] },
    { h: "Data Science & Analytics", items: ["Pandas, Matplotlib, Sci-Kit Learn", "ML Pipeline Development, RAG patterns, LLM Integration"] },
    { h: "Tools & Platforms", items: ["Git, GitHub Actions, Tableau, Jupyter Notebook", "JIRA, Postman, XML Processing"] },
  ],
  experience: [
    { role: "Software Engineer III", co: "Komodo Health", years: "2022 – 2025", bullets: [
      "Architected AWS-based data infrastructure processing 350K+ documents quarterly with 99.5% uptime, cutting deployment times by 50%",
      "Built AI-powered data mapping platform handling 12M+ provider records in Snowflake with vector search, optimizing Airflow pipelines to reduce job failures by 70% and boost processing speeds by 40%",
      "Developed scalable Flask APIs and JavaScript dashboards serving thousands of daily requests, reducing manual intervention by 60% and achieving $2M+ quarterly operational savings" ] },
    { role: "Software Engineer", co: "Infosys / Comcast", years: "2021 – 2022", bullets: [
      "Engineered automation frameworks executing 80+ test cases weekly, maintaining 98%+ system reliability across distributed DEV environments",
      "Developed API validation scripts (CSV, XML, SIPp) integrated with CI workflows using Postman, GitHub, and JIRA to validate UDP response accuracy and accelerate releases",
      "Built microservices architecture from monolithic system, reducing deployment time by 60%" ] },
    { role: "Software Engineer", co: "HomeSlice", years: "2020 – 2021", bullets: [
      "Built full-stack data platform (Python, JavaScript, AWS, PostgreSQL) with 99%-accurate ML pipeline for real estate analytics, processing large-scale Zillow API and economic datasets",
      "Implemented scalable data storage and retrieval systems enabling seamless equity transactions via responsive web interfaces and real-time data processing" ] },
  ],
  contact: [
    { label: "email", value: "nadaibrhm96@gmail.com", href: "mailto:nadaibrhm96@gmail.com" },
    { label: "linkedin", value: "linkedin.com/in/nadaibrahim96", href: "https://linkedin.com/in/nadaibrahim96" },
    { label: "github", value: "github.com/nxdx96", href: "https://github.com/nxdx96" },
    { label: "phone", value: "201-626-8719", href: "tel:2016268719" },
  ],
  featured: [
    { name: "Face Findr", desc: "Interactive beauty discovery app mapping makeup products to facial features" },
    { name: "Policy Scraper Dashboard", desc: "Automated policy data scraping with searchable Flask dashboard" },
    { name: "Prompt2JSON Extractor", desc: "LLM-powered structured data extractor with JSON validation" },
    { name: "Snowflake Fuzzy Matcher Lite", desc: "Healthcare provider matching using fuzzy algorithms" },
    { name: "Bootcamp Wrapped", desc: "Music analytics project emulating Spotify Wrapped" },
  ],
};

export const HELP = [
  "  help          - Show this help message",
  "  about         - About the developer",
  "  skills        - Technical skills",
  "  experience    - Work experience",
  "  projects      - View projects (live from GitHub)",
  "  resume        - Open resume",
  "  contact       - Contact information",
  "  open <n>      - Open project n on GitHub",
  "  clear         - Clear terminal",
  "  cat           - try me!!!",
];

const CATS = [
  ["     /\\_/\\  ", "    ( o.o ) ", "     > ^ <  ", "    ♥ meow ♥", "      type 'pet' to interact"],
  ["     /\\_/\\  ", "    ( -.- ) ", "     > - <  ", "     zzz... ", "      (sleeping kitty)"],
  ["     /\\_/\\  ", "    ( >.< ) ", "     > w <  ", "     nyaa~ ", "      (excited cat!)"],
];
const PETS = [
  ["     /\\_/\\  ", "    ( ^.^ ) ", "     )   (  ", "    (  -  ) ", "   ^^^   ^^^", "    purr... purr...", "   you pet the cat. it seems happy!", "   pet it again?"],
  ["     /\\_/\\  ", "    ( ◕.◕ ) ", "     )   (  ", "    (  ∪  ) ", "   ^^^   ^^^", "    mrow mrow~", "   the cat nuzzles your hand affectionately!"],
  ["     /\\_/\\  ", "    ( =.= ) ", "     )   (  ", "    (  ︶  ) ", "   ^^^   ^^^", "    *content purring*", "   maximum happiness achieved! =^.^=", "   now try 'cat about.txt' or 'cat readme.md'"],
];
const FILES = {
  "about.txt": ["Nada Ibrahim - Software Engineer Portfolio", "==========================================", ...PROFILE.about.map(l => "• " + l)],
  "readme.md": ["# Nada Ibrahim - Software Engineer", "Welcome to my interactive terminal portfolio!", "## Quick Start", "Type 'help' to see all available commands.", "Try 'experience', 'projects', or 'skills' to learn more!"],
};

const LANG_COLORS = { JavaScript: "#F7DF1E", TypeScript: "#3178C6", Python: "#3776AB", "Jupyter Notebook": "#DA5B0B", Java: "#B07219", "C#": "#239120", HTML: "#E34C26", CSS: "#1572B6", Shell: "#89E051", Go: "#00ADD8", Rust: "#DEA584" };

function ago(d) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 864e5);
  if (days < 1) return "today"; if (days < 30) return days + "d ago"; if (days < 365) return Math.floor(days / 30) + "mo ago";
  return Math.floor(days / 365) + "y ago";
}

let repoPromise = null;
export function fetchRepos() {
  if (repoPromise) return repoPromise;
  repoPromise = fetch(`https://api.github.com/users/${PROFILE.github}/repos?type=owner&sort=updated&per_page=100`)
    .then(r => { if (!r.ok) throw new Error("GitHub API " + r.status); return r.json(); })
    .then(list => list.filter(r => !r.fork && !r.archived).map((r, i) => ({
      idx: i + 1, name: r.name, desc: r.description || "No description", lang: r.language || "—",
      langColor: LANG_COLORS[r.language] || "#888", stars: r.stargazers_count, forks: r.forks_count,
      updated: ago(r.updated_at), url: r.html_url, live: !!r.homepage, homepage: r.homepage,
    })))
    .catch(err => { repoPromise = null; throw err; });
  return repoPromise;
}
const FALLBACK = PROFILE.featured.map((p, i) => ({ idx: i + 1, name: p.name, desc: p.desc, lang: "Python", langColor: LANG_COLORS.Python, stars: 0, forks: 0, updated: "", url: `https://github.com/${PROFILE.github}`, offline: true }));

// Attach engine to a DCLogic component. opts: {prompt, palette:{cmd,out,dim,err,link,h}, boot:[], delay}
export function attach(c, opts = {}) {
  const prompt = opts.prompt || "nada@portfolio:~$";
  const pal = Object.assign({ cmd: "#fff", out: "#ddd", dim: "#888", err: "#f66", link: "#8cf", h: "#fff" }, opts.palette);
  const delay = opts.delay ?? 14;
  const banner = opts.banner || ["Nada's Software Engineer Portfolio Terminal v2.0.0", "Type 'help' to see available commands.", ""];
  const inputRef = React.createRef(), scrollRef = React.createRef(), rootRef = React.createRef();
  let catI = 0, petI = 0, queue = [], timer = null, ro = null, fkHandler = null, lastLen = -1;
  const S = () => c.state;
  const set = p => c.setState(p);

  c.state = Object.assign({ lines: [], input: "", panel: null, repos: null, reposErr: null, hist: [], hi: -1, compact: false, booted: !opts.boot, mounted: false }, c.state);
  const mk = (t, text, extra) => Object.assign({ t, text, id: Math.random().toString(36).slice(2) }, extra);
  const push = (...ls) => set({ lines: [...S().lines, ...ls] });

  function enqueue(ls) {
    queue.push(...ls);
    if (!timer) tick();
  }
  function tick() {
    if (!queue.length) { timer = null; return; }
    const l = queue.shift(); push(l);
    timer = setTimeout(tick, l.t === "cmd" ? 0 : delay);
  }
  const out = (arr, t = "out") => arr.map(x => typeof x === "string" ? mk(t, x) : x);

  const openPanel = name => set({ panel: name });
  const close = () => set({ panel: null });

  function listRepos() {
    const r = S().repos;
    if (!r) return [mk("dim", "fetching github.com/" + PROFILE.github + " ...")];
    return [mk("h", `${r.length} public repositories (github.com/${PROFILE.github})`),
      ...r.map(p => mk("link", `  ${String(p.idx).padStart(2, " ")}. ${p.name}  —  ${p.desc}`, { href: p.url })),
      mk("dim", r[0]?.offline ? "  (GitHub API unavailable — showing featured list)" : "  type 'open <n>' to view a repo, or click a name")];
  }

  function exec(raw) {
    const cmd = raw.trim(); if (!cmd) { push(mk("cmd", prompt)); return; }
    const [name, ...args] = cmd.toLowerCase().split(/\s+/);
    set({ hist: [...S().hist, cmd], hi: -1, input: "" });
    const L = [mk("cmd", prompt + " " + cmd)];
    const done = (...ls) => enqueue([...L, ...ls, mk("out", "")]);
    switch (name) {
      case "help": return done(mk("h", "Available commands:"), ...out(HELP), ...out(opts.helpExtra || [], "dim"));
      case "about": openPanel("about"); return done(...out(PROFILE.about), mk("dim", "→ opened about panel"));
      case "skills": return done(...PROFILE.skills.flatMap(g => [mk("h", g.h + ":"), ...g.items.map(i => mk("out", "  • " + i))]));
      case "experience": return done(mk("h", "Professional Experience:"), ...PROFILE.experience.flatMap(j => [mk("h", `${j.role} - ${j.co} (${j.years})`), ...j.bullets.map(b => mk("out", "  • " + b))]));
      case "resume": openPanel("resume"); return done(mk("dim", "→ opened resume panel"), mk("link", "  download resume.pdf", { href: PROFILE.resumeUrl }));
      case "contact": openPanel("contact"); return done(mk("h", "Contact Information:"), ...PROFILE.contact.map(k => mk("link", `  ${k.label.padEnd(9)} ${k.value}`, { href: k.href })));
      case "projects": case "ls": if (args[0] === undefined && name === "ls") return done(...out(["about.txt   readme.md   resume.pdf   projects/"]));
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

  function ensureRepos() {
    if (S().repos) return Promise.resolve();
    return fetchRepos().then(r => set({ repos: r.length ? r : FALLBACK })).catch(e => set({ repos: FALLBACK, reposErr: String(e.message) }));
  }

  const focus = e => { if (e && e.target.closest && e.target.closest("a,button,input,[data-nofocus]")) return; if (window.getSelection().toString()) return; inputRef.current && inputRef.current.focus({ preventScroll: true }); };
  const onInput = e => set({ input: e.target.value });
  const onKey = e => {
    const h = S().hist;
    if (e.key === "Enter") { exec(S().input); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const i = Math.min(S().hi + 1, h.length - 1); if (i >= 0) set({ hi: i, input: h[h.length - 1 - i] }); }
    else if (e.key === "ArrowDown") { e.preventDefault(); const i = S().hi - 1; set(i < 0 ? { hi: -1, input: "" } : { hi: i, input: h[h.length - 1 - i] }); }
    else if (e.key === "Escape") close();
    else if (e.key === "Tab") { e.preventDefault(); const v = S().input.toLowerCase(); const m = ["help", "about", "skills", "experience", "projects", "resume", "contact", "clear", "cat", "pet"].find(k => k.startsWith(v) && v); if (m) set({ input: m }); }
    else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); exec("clear"); }
  };
  const run = cmd => () => { exec(cmd); };

  function mount() {
    set({ mounted: true });
    if (opts.boot) { enqueue(out(opts.boot, "dim")); const t = opts.boot.length * (opts.bootDelay || 60); setTimeout(() => { set({ booted: true, lines: out(banner) }); if (opts.autoHelp !== false) exec("help"); }, t); }
    else { set({ lines: out(banner) }); if (opts.autoHelp !== false) exec("help"); }
    ensureRepos();
    let tries = 0;
    const observe = () => {
      const el = rootRef.current || (inputRef.current && inputRef.current.parentElement) || (scrollRef.current && scrollRef.current.closest("[data-screen-label]"));
      if (!el) { if (tries++ < 20) setTimeout(observe, 50); return; }
      const apply = w => { const compact = w < 720; if (compact !== S().compact) set({ compact }); };
      apply(el.getBoundingClientRect().width);
      if (window.ResizeObserver) { ro = new ResizeObserver(en => apply(en[0].contentRect.width)); ro.observe(el); }
    };
    setTimeout(observe, 0);
    if (opts.fkeys) {
      // Real function keys. With several instances on one page, the last one hovered/clicked owns the keys.
      if (!window.__fkOwner) window.__fkOwner = c;
      const claim = () => { window.__fkOwner = c; };
      let t2 = 0; const hook = () => { const el = rootRef.current; if (!el) { if (t2++ < 40) setTimeout(hook, 50); return; } el.addEventListener("pointerenter", claim); el.addEventListener("pointerdown", claim); };
      hook();
      fkHandler = e => {
        if (window.__fkOwner && window.__fkOwner !== c) return;
        if (e.key === "Escape") { if (S().panel) close(); return; }
        const cmd = opts.fkeys[e.key]; if (!cmd) return;
        e.preventDefault(); if (!S().booted) return;
        exec(cmd); inputRef.current && inputRef.current.focus({ preventScroll: true });
      };
      window.addEventListener("keydown", fkHandler);
    }
  }
  function afterUpdate() { const n = S().lines.length; if (n === lastLen) return; lastLen = n; const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }
  function unmount() { clearTimeout(timer); ro && ro.disconnect(); if (fkHandler) window.removeEventListener("keydown", fkHandler); if (window.__fkOwner === c) window.__fkOwner = null; }

  function vals() {
    const s = S(), p = s.panel;
    return {
      ...PROFILE, help: HELP, prompt, compact: s.compact, wide: !s.compact, booted: s.booted,
      lines: s.lines.map(l => ({ ...l, color: pal[l.t] || pal.out, isLink: l.t === "link", isText: l.t !== "link" })),
      input: s.input, hasInput: !!s.input, inputRef, scrollRef, rootRef, focus, onInput, onKey,
      panelOpen: !!p, showAbout: p === "about", showResume: p === "resume", showContact: p === "contact", showProjects: p === "projects", panelName: p || "",
      close, runHelp: run("help"), runAbout: run("about"), runResume: run("resume"), runContact: run("contact"), runProjects: run("projects"), runClear: run("clear"), runSkills: run("skills"), runExperience: run("experience"), runCat: run("cat"),
      repos: s.repos || [], reposLoading: !s.repos, repoCount: (s.repos || []).length, reposErr: s.reposErr,
      navAbout: p === "about", navResume: p === "resume", navContact: p === "contact", navProjects: p === "projects",
    };
  }
  return { exec, vals, mount, afterUpdate, unmount, inputRef, scrollRef, rootRef };
}
