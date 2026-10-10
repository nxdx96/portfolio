# Handoff: Phosphor Orbit terminal portfolio (nxdx96/portfolio)

## Overview
A full replacement for the home page of `nxdx96/portfolio` (Vite + React 18 + TypeScript + Tailwind). The site becomes a single full-viewport CRT "terminal" in green phosphor. It has:
- a BIOS boot sequence;
- a generative ASCII background that is random on each load;
- a large pixel-font name that decrypts in after boot;
- a docked interactive terminal;
- an F-key bar that also responds to the real keyboard F-keys;
- a 3D ASCII "orbit" object on desktop: Nada's cats, headphones, vinyl, etc., random per load and drag-to-spin;
- overlay panels (about / resume / projects / contact) whose text "decrypts" in.

Projects are live from the GitHub API.

## About the design files
The files in `reference/` are **design references built in HTML**: a working prototype of the intended look and behaviour, not production code to paste in. Recreate the design inside the existing Vite/React/TS app, following its patterns (function components, hooks, `@/` alias, Tailwind available).

The three plain-JS modules are framework-agnostic and close to production quality: `terminal-core.js` (minus its component adapter), `phosphor-fx.js` and `orbit-shapes.js`. **Port them to TypeScript almost verbatim** rather than rewriting the algorithms. Only the glue (state + rendering) needs to become React.

To view the reference: serve `reference/` with any static server (e.g. `npx serve reference`) and open `Phosphor Signal Orbit.dc.html`. It needs `support.js` beside it, which is runtime glue for the prototype only. Do **not** ship it.

## Fidelity
**High-fidelity.** Colours, type, spacing, copy, timings and interactions are final. Match them exactly.

## What to replace in the repo
- `src/pages/Index.tsx`: render only `<PhosphorPortfolio />` (full viewport, `100dvh`, no scroll on the page itself).
- Retire from the home route: `Navigation.tsx`, `Hero.tsx`, `WorkSection.tsx`, `TabBar.tsx`, `TerminalModal.tsx`, `InteractiveTerminal.tsx`, `ThemeToggle.tsx`, `TabContext`. The design is dark-only, so `ThemeProvider` can stay but should be forced dark (or removed).
- `index.html`:
  - fonts: swap JetBrains Mono / Pixelify Sans for `VT323` and `IBM Plex Mono` 400/500/600: `https://fonts.googleapis.com/css2?family=VT323&family=IBM+Plex+Mono:wght@400;500;600&display=swap`;
  - set `<html style="background:#020703">`;
  - keep the OG/Twitter meta.
- Add `public/resume.pdf`. The resume button links to `/resume.pdf` (`PROFILE.resumeUrl` in terminal-core). **The file does not exist yet.**
- Suggested new files:
  - `src/lib/terminal/profile.ts` (PROFILE, HELP, cat/pet art, FILES)
  - `src/lib/terminal/useTerminal.ts` (hook port of `attach()`)
  - `src/lib/phosphor/field.ts` (port of `startField`)
  - `src/lib/phosphor/decrypt.ts` (`scramble`, `decryptDeep`, `useRamp`)
  - `src/lib/phosphor/object.ts` (port of `startObject`, the parametric shapes)
  - `src/lib/phosphor/orbit.ts` (port of `orbit-shapes.js`)
  - `src/components/phosphor/*` (Portfolio, HudBar, Hero, TerminalWindow, OrbitPanel, FKeyBar, Panel, Scanlines)

## Layout (root = full viewport, `position:relative; overflow:hidden; display:flex; flex-direction:column`)
Root background: `radial-gradient(ellipse at 50% 40%, #071a0c 0%, #030a04 65%, #010301 100%)`. Base text: IBM Plex Mono 14px / 1.6, colour `#c4ffd2`, `text-shadow: 0 0 4px rgba(74,240,122,.3)`. Clicking anywhere that isn't a link, button or panel focuses the hidden terminal input.

Layers, back to front:
1. **ASCII field.** A `<pre>` with `position:absolute; inset:0; pointer-events:none`. Font: IBM Plex Mono 12px / 16px line-height. Colour `#4af07a`, `text-shadow: 0 0 6px rgba(74,240,122,.6)`. Opacity = field intensity (see Behaviour).
2. **HUD row.** `flex:none`. Padding `12px clamp(14px,3cqw,36px)`. VT323 19px / 1.2, `letter-spacing:.06em`, uppercase.
   - Left column: `◉ signal // nada-os v2.0` in `#4af07a`; `clearance: public` in `#3fb168`.
   - Right column, right-aligned:
     - an "open to work" row: an 8×8 square in `#4af07a` with `box-shadow 0 0 8px #4af07a`, blinking `pulse 1.2s steps(2) infinite`, then the label in `#e6ffec`;
     - `remote ok` in `#3fb168`.
3. **Main row.** `flex:1; min-height:0; display:flex; gap:clamp(10px,2cqw,20px)`. Padding `0 clamp(10px,3cqw,36px) clamp(10px,1.5cqw,16px)`.
   - **Left column.** `flex:1; min-width:0; flex column; gap:clamp(8px,1.2cqw,14px)`:
     - **Hero wrapper.** `flex:1; min-height:0; overflow:hidden`. Contains:
       - an `<h1 aria-label="Nada Ibrahim">` in VT323 400, `line-height:.78`, colour `#e6ffec`, `text-shadow: 0 0 18px rgba(74,240,122,.55), 0 0 2px #fff`. It is `display:flex; flex-wrap:wrap; column-gap:.28em` with two spans, "NADA" and "IBRAHIM". **The font size is fitted in JS** (binary search 28–230px): the hero block must fit the wrapper's height and the h1 must not overflow its own width (`scrollWidth <= clientWidth`). Re-fit on resize (ResizeObserver) and on `document.fonts.ready`. Bottom margin 14px.
       - a tags row: VT323 22px, `#4af07a`, uppercase, `gap 4px 14px`. Content: `software engineer / full-stack / backend / data`, with the `/` separators in `#2f9a55`.
     - **Terminal window.** `flex:none`. Background `rgba(2,7,3,.93)`, `border:1px solid #2f9a55`, `box-shadow:0 0 30px rgba(0,0,0,.6)`.
       - Title bar: VT323 18px, `#3fb168`, uppercase, `letter-spacing:.08em`, padding `3px 14px`, `border-bottom:1px solid #14401f`. Left `■ tty1 — C:\PORTFOLIO`, right `[tab] complete`.
       - Scroll area: height `clamp(190px,24cqw,300px)`, `overflow-y:auto`, padding `10px 14px`. It auto-scrolls to the bottom only when the number of lines changes.
   - **Orbit panel** (desktop only, hidden when the root is narrower than 720px). Width `clamp(300px,34cqw,480px)`, flex column, background `rgba(2,7,3,.72)`, `border:1px solid #1f6b3a`, VT323 18px uppercase.
     - Header: padding `4px 12px`, `border-bottom:1px solid #14401f`. Left `▓ orbit // {label}` in `#4af07a` (ellipsis). Right: a `[↻ reroll]` button in `#c4ffd2`, hover `#fff`.
     - Object `<pre>`: `flex:1`, IBM Plex Mono 9px / 10px, `#c4ffd2`, `text-shadow 0 0 5px rgba(74,240,122,.7)`, `cursor:grab`, `touch-action:none`.
     - Footer: a 2-column grid, padding `6px 12px 8px`, `border-top:1px solid #14401f`. Keys in `#3fb168`, values in `#e6ffec`: `base: new york · 40.71n 74.00w`, `local: {HH:MM:SS} est` (America/New_York, 24h, ticking every 1s), `range: remote ok`, `input: drag to spin`.
4. **F-key bar.** `flex:none`, full width, background `rgba(2,7,3,.94)`, `border-top:1px solid #1f6b3a`, padding `6px clamp(10px,2cqw,30px) 8px`, wraps with `gap 2px 6px`. VT323 20px.
   - Each button: `min-height:36px` (44px on touch is fine), padding `0 10px 0 4px`, text `#c4ffd2`, hover background `rgba(74,240,122,.12)` with text `#fff`. It has a key chip: background `#4af07a`, text `#020703`, padding `0 6px`, no text-shadow.
   - Keys: `F1 HELP`, `F2 ABOUT`, `F3 RESUME`, `F4 PROJECTS`, `F5 CONTACT`, `F10 CLEAR`.
5. **Panel overlay** (when a panel is open). See Panels below.
6. **CRT overlay.** `pointer-events:none`, z-index above everything:
   - scanlines: `repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 1px, transparent 1px 3px)` with `flicker 5s infinite`;
   - a rolling glow band: 140px tall, `linear-gradient(180deg, transparent, rgba(74,240,122,.05), transparent)`, `roll 8s linear infinite`;
   - vignette: `box-shadow: inset 0 0 140px 20px rgba(0,0,0,.7)`.

`cqw` units assume the root has `container-type:inline-size`. Keep that, or swap for `vw`.

### Mobile (< 720px root width)
The orbit panel is hidden. The layout is HUD, hero (fitted, so "IBRAHIM" never overflows), terminal, then the F-key bar (wraps to 2 rows). Everything else is identical.

## Terminal lines
Each line is a flex-wrap row with `white-space:pre-wrap; word-break:break-word; min-height:1.6em`. Line types and colours:
- `cmd` `#e6ffec`
- `out` `#c4ffd2`
- `dim` `#3fb168`
- `err` `#ffd36a`
- `h` (heading) `#4af07a`
- `link` `#9dffb0`, an underlined `<a target=_blank>` with `underline-offset:3px`

After boot, the prompt row shows `C:\PORTFOLIO>` in `#4af07a`, then the input in `#e6ffec`, then a 9px × 1.2em block cursor in `#4af07a` blinking `blink .9s steps(1) infinite`.

## Panels (about / resume / projects / contact)
- **Backdrop.** `position:absolute; inset:0`, background `rgba(1,5,2,.86)`. Clicking it closes the panel; clicks inside the card stop propagation. Padding `clamp(8px,3cqw,48px)`.
- **Card.**
  - Box: `width:min(880px,100%)`, `max-height:100%`, background `#030a04`, `border:1px solid #2f9a55`, `box-shadow:0 0 48px rgba(74,240,122,.14)`.
  - Entrance: `decrypt .45s steps(9,end)`, i.e. a clip-path wipe from `inset(0 0 100% 0)` to `inset(0)`.
  - Corners: four 16×16 brackets with 3px `#c4ffd2` borders at offset −2px.
- **Header.** VT323 22px uppercase, `#4af07a`, padding `8px clamp(14px,3cqw,24px)`. Left `▓▓ {NAME}.SYS · {decrypting NN% | decrypted}`, with the status in `#3fb168`. Right `[ESC] CLOSE`. Under the header, a 2px progress bar (track `#14401f`, fill `#4af07a` with glow, width = decrypt %).
- **Body.** Padding `24px clamp(16px,3cqw,28px) 28px`, flex column, `gap:20px`, no text-shadow, scrolls.
  - Panel titles: VT323 `clamp(40px,7cqw,64px)`, `line-height:.85`, uppercase, `#e6ffec`, glow `0 0 12px rgba(74,240,122,.45)`.
  - **About.**
    - Title: the name.
    - Meta line: `{title} · {location}`, 12px, `letter-spacing:.16em`, uppercase, `#4af07a`.
    - Paragraph: the about lines joined with spaces. 15px / 1.7, max 64ch, `#c4ffd2`.
    - Skills grid: `repeat(auto-fit,minmax(min(240px,100%),1fr))`, 1px `#14401f` gaps. Each cell has background `#030a04` and padding `14px 16px`, a VT323 21px uppercase heading in `#4af07a`, and items at 13px / 1.55.
  - **Resume.**
    - Title row: `Service record`, plus a `[ download pdf ]` link (VT323 20px, background `#4af07a`, text `#020703`, hover background `#e6ffec`) that points to `/resume.pdf`.
    - Each job: `border-top:1px solid #14401f; padding-top:14px`, flex-wrap.
    - Job column 1: years (VT323 21px, `#4af07a`, `flex:0 0 110px`).
    - Job column 2:
      - role line: role 15px/600 in `#e6ffec`, then `— company` in `#4af07a`;
      - bullets: a `▸` marker in `#3fb168` (16px column), text 13.5px / 1.6.
  - **Projects.**
    - Title row: `Repositories`, plus `{n} public · live from github` (VT323 19px, `#3fb168`).
    - While loading, show `reading github.com/nxdx96 …`.
    - Rows: grid `40px 1fr auto`, padding `12px 8px`, `border-top:1px solid #14401f`, hover background `rgba(74,240,122,.08)`.
    - Row cells:
      - index: VT323 22px, `#4af07a`;
      - name: 15px/600, uppercase, `#e6ffec`;
      - updated: 12px, `#3fb168`;
      - description: spans columns 2–3, 13.5px;
      - meta: an 8×8 language swatch, the language, and `★ stars`, at 12px in `#3fb168`.
  - **Contact.**
    - Title: `Open channels`.
    - Line: `{location}. Response within 24 hours.`
    - Card grid (`auto-fit minmax(min(240px,100%),1fr)`, gap 8px). Each card: border `#1f6b3a`, padding `12px 14px`, a VT323 20px label in `#4af07a`, a 14px value in `#e6ffec`; hover: background `rgba(74,240,122,.1)`, border `#4af07a`.
- **Decrypt effect.** When a panel opens, `dp` ramps 0→1 over 650ms (rAF). Every string in the panel data except hrefs, URLs, colours and numbers is passed through `scramble(str, dp)`. Characters reveal left to right with jitter; unrevealed characters are random glyphs. The panel must render with `dp=0` on its very first frame, so there's no flash of plain text.

## Behaviour
- **Boot.**
  - These lines print in `dim`, one every 190ms:
    - `NADA-OS BIOS v2.0.0  (C) 2026 N. IBRAHIM`
    - `CPU: Brain @ 3.4 GHz ............ OK`
    - `Memory test: 640K ................ OK`
    - `Phosphor field generator ......... OK`
    - `Mounting /home/nada/portfolio .... OK`
    - `Detecting repositories: github.com/nxdx96`
    - `Function keys F1-F10 ............. MAPPED`
    - `Loading PORTFOLIO.SYS ............ OK`
    - (blank line)
  - Then the screen clears to the banner: `NADA-OS TERMINAL v2.0.0`, `Type HELP, or press F1-F5 on your keyboard.`, blank.
  - **Help is NOT auto-printed.** It prints only on F1 or `help`.
  - The prompt appears once boot finishes. Respect `prefers-reduced-motion` by shortening or skipping the boot.
- **Hero name.** It is scrambled during boot, then decrypts over 1400ms when boot ends. Every 8s, if no panel is open, it re-scrambles from 0.5 back to 1 over 450ms (a "glitch").
- **Commands:**
  - help, about, skills, experience, projects (alias ls), resume, contact, clear;
  - `open <n>`, which opens repo n in a new tab;
  - cat, which cycles 3 ASCII cats; `cat about.txt` and `cat readme.md`, which print files;
  - pet, which cycles 3 responses;
  - echo, whoami, pwd;
  - sudo (joke error);
  - exit / q.
  - Unknown commands print `bash: X: command not found` followed by `type 'help' for commands`.
  - The exact copy is in `reference/terminal-core.js` (`PROFILE`, `HELP`, `CATS`, `PETS`, `FILES`) and should be moved to `profile.ts` as-is.
  - `about`, `resume`, `projects` and `contact` also open their panel.
  - Lines print one at a time, 16ms apart.
- **Keys.**
  - Enter runs the command.
  - ↑/↓ step through history.
  - Tab completes command names.
  - Ctrl+L clears.
  - Esc closes the panel.
  - **Global F-keys:** a `window` keydown listener maps F1 help, F2 about, F3 resume, F4 projects, F5 contact, F10 clear. It calls `preventDefault()` (F5 must not reload; F1 must not open browser help), ignores keys during boot, runs the command and refocuses the input.
  - Esc closes the panel globally too.
- **GitHub.**
  - Request: `GET https://api.github.com/users/nxdx96/repos?type=owner&sort=updated&per_page=100`. Filter out forks and archived repos.
  - Map each repo to `{idx, name, desc ("No description"), lang ("—"), langColor, stars, updated (relative: today / Nd ago / Nmo ago / Ny ago), url}`.
  - Fetch once and cache the promise.
  - On error, fall back to `PROFILE.featured`.
- **ASCII field.**
  - Type: random on load from `plasma | topo | flow | life`, never the same as the last visit (stored in localStorage key `phosphor-orbit-last` as `field|shape`).
  - Intensity (`pre` opacity) is auto per type: plasma .5, topo .55, flow .5, life .35.
  - It renders every 50ms (life every 100ms) and responds to the pointer position over the root.
  - It measures the character cell from a hidden 10×"M" probe and re-measures on resize and `fonts.ready`.
  - The full algorithm is in `phosphor-fx.js` `startField`. Port it directly.
- **Orbit object.**
  - Picked on load: weighted random, with a 1-in-12 chance of a rare shape. Never the same shape as the last visit.
  - `[↻ reroll]` picks a new field and shape without reloading.
  - Common shapes, with their header labels:
    - `arya` ("arya · tuxedo")
    - `yuki` ("yuki · tabby cardigan")
    - `miso` ("miso · chonky loaf")
    - `misa` ("misa · calico, asleep")
    - `headphones`
    - `vinyl` ("vinyl · 33⅓ rpm")
    - `planet` ("ringed planet")
    - `heart` ("<3")
    - `buddy` ("glow buddy")
    - `globe` (with a blinking NYC marker)
    - `torus` ("donut")
    - `knot` ("trefoil knot")
    - `mobius` ("möbius strip")
    - `helix` ("double helix")
  - Rare shapes: `allcats` ("★ rare · all four cats") and `license` ("★ rare · hunter license").
  - Rendering:
    - The SDF shapes (`orbit-shapes.js` `SCENES`) are raymarched per character cell: bounding sphere R≈1.2, up to 64 steps, tetrahedral normals.
    - Character ramp: ` .,-~:;=!*#$@`.
    - Lighting: ambient .22 + Lambert + rim² × .25.
    - The parametric shapes (globe/torus/knot/mobius/helix) use `phosphor-fx.js` `startObject`.
  - Motion: it auto-spins and eases back to its tilt. Pointer drag rotates it with inertia (use pointer capture). The frame interval adapts: `max(55ms, lastRenderCost × 1.8)`.
  - Mount it only on desktop, and stop its rAF loop on unmount or when hidden.
- **Reduced motion.** Render a single static frame of the field and object, with no loops; skip the glitch and the flicker.

## State (React)
- `useTerminal()`: `lines[]`, `input`, `history[]`, `histIndex`, `panel: null|'about'|'resume'|'projects'|'contact'`, `booted`, `repos|null`, `reposErr`, `compact` (root width < 720).
- `dp` (panel decrypt progress, 0–1), `nameDp` (hero decrypt progress), `now` (1s tick), `pick: {field, shape}`.
- Refs: hidden input, terminal scroll element, root, field `<pre>`, object `<pre>`, hero wrapper, h1.

## Design tokens
- `#020703`: ink on bright fills / page background
- `#030a04`: panel card background
- `#14401f`: hairlines inside panels
- `#1f6b3a`: borders
- `#2f9a55`: strong border / separators
- `#3fb168`: dim text
- `#4af07a`: accent / phosphor
- `#9dffb0`: links
- `#c4ffd2`: body text
- `#e6ffec`: headings / high emphasis
- `#ffd36a`: errors
- Fonts: VT323 (display, labels, keys, HUD) and IBM Plex Mono 400/500/600 (body, terminal, ASCII art).
- Keyframes:
  - `blink{50%{opacity:0}}`
  - `pulse{50%{opacity:.25}}`
  - `flicker{0%,100%{opacity:1}8%{opacity:.8}10%{opacity:1}55%{opacity:.92}}`
  - `roll{from{translateY(-100%)}to{translateY(100%)}}`
  - `decrypt{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0)}}`
- Selection: background `#4af07a`, text `#020703`.
- No border radius anywhere.

## Assets
None. All art is generated as ASCII at runtime. `public/resume.pdf` must be added by Nada.

## Files
- `reference/Phosphor Signal Orbit.dc.html`: the full prototype (template markup with inline styles, plus a logic class at the bottom).
- `reference/terminal-core.js`: profile data, commands, GitHub fetch, F-key handling.
- `reference/phosphor-fx.js`: ASCII fields, scramble/decrypt, HUD stats, parametric 3D objects.
- `reference/orbit-shapes.js`: SDF scenes (cats, headphones, vinyl, planet, heart, buddy, license, all-cats) and the shape picker.
- `reference/support.js`: prototype runtime only. Do not port.
- `screenshots/shapes-1-cats-and-rare.png`: Arya, Yuki, Miso, Misa, all four cats (rare), hunter license (rare).
- `screenshots/shapes-2-objects.png`: headphones, vinyl, ringed planet, heart, glow buddy, globe.
- `screenshots/shapes-3-parametric.png`: donut, trefoil knot, möbius strip, double helix.
Each screenshot is a single frame; every shape spins in the real thing, so use the reference prototype for motion.

## Acceptance checks
- `npm run test` passes (lint + build).
- Pressing F1–F5 and F10 on a real keyboard works; F5 does not reload.
- At 390×800 the name fits on screen and the F-key bar wraps.
- At 1280×800 and 1920×1080 nothing clips; the orbit panel shows.
- With the GitHub API blocked, the projects panel shows the featured fallback.
- Ten reloads show varied field + shape combinations with no immediate repeats.
