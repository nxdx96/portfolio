// Phosphor terminal constants, ported from `phosphor-fx.js`.

export const FKEYS: Record<string, string> = { F1: "help", F2: "about", F3: "resume", F4: "projects", F5: "contact", F10: "clear" };
export const PALETTE: Record<string, string> = { cmd: "#e6ffec", out: "#c4ffd2", dim: "#3fb168", err: "#ffd36a", link: "#9dffb0", h: "#4af07a" };
export const BOOT = [
  "NADA-OS BIOS v2.0.0  (C) 2026 N. IBRAHIM",
  "CPU: Brain @ 3.4 GHz ............ OK",
  "Memory test: 640K ................ OK",
  "Phosphor field generator ......... OK",
  "Mounting /home/nada/portfolio .... OK",
  "Detecting repositories: github.com/nxdx96",
  "Function keys F1-F10 ............. MAPPED",
  "Loading PORTFOLIO.SYS ............ OK",
  "",
];
export const BANNER = ["NADA-OS TERMINAL v2.0.0", "Type HELP, or press F1-F5 on your keyboard.", ""];
export const HELP_EXTRA = ["", "  keys: F1 help · F2 about · F3 resume · F4 projects · F5 contact · F10 clear · ESC close"];
