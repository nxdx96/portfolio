# Phosphor Orbit Portfolio

A full-viewport, dark-only terminal portfolio with a green phosphor display.

**Live Site:** [nadaibrahim.vercel.app](https://nadaibrahim.vercel.app/)

## Features

- Interactive terminal with command history, Tab completion, and commands including `help`, `about`, `skills`, `experience`, `projects`, `resume`, `contact`, `cat`, and `pet`.
- Keyboard shortcuts: F1 help, F2 about, F3 resume, F4 projects, F5 contact, F10 clear, Ctrl+L clear, and Escape to close panels.
- Animated ASCII backgrounds and a desktop orbit viewer with draggable cats and other objects; reroll selects a new object and background.
- About, resume, projects, and contact panels with text decryption effects.
- Live GitHub repositories with a fallback when the API is unavailable.
- Responsive layout, reduced-motion support, and a downloadable resume.

## Stack and source

React 18, TypeScript, Vite, Tailwind CSS, and React Router.

```text
src/
  components/phosphor/  # Portfolio layout, terminal, orbit viewer, and panels
  lib/phosphor/         # ASCII renderers, effects, and display constants
  lib/terminal/         # Command engine, profile, and repository fetching
  pages/                # Home and not-found routes
  App.tsx               # Routes for /, /home, and unmatched paths
  index.css             # Phosphor styles and responsive sizing
public/
  resume.pdf            # Downloadable resume
  favicon.svg
  robots.txt
design_handoff_phosphor_orbit/
  reference/            # Original mockup and rendering source for comparison
  screenshots/          # Object design references
```

The original mockup and handoff are retained as design references. The production app uses the React components and TypeScript modules in `src/`.

## Local development

Use Node.js 18+ and npm:

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:8080`. `package-lock.json` is the dependency lockfile.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run lint and build checks |
| `npx tsc --noEmit -p tsconfig.app.json` | Check application types |

Deploy `dist/` to a static host with SPA fallback routing enabled. The portfolio is hosted on Vercel.

## Development workflow

See [docs/ai-workflow.md](docs/ai-workflow.md) for the development and validation workflow.

## License

MIT
