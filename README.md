# Software Engineer Portfolio

A terminal-inspired portfolio website showcasing software engineering projects and professional experience.

**Live Site:** [nadaibrahim.vercel.app](https://nadaibrahim.vercel.app/)

## Features

- **Interactive Terminal** - Command-line interface with working commands (`help`, `about`, `skills`, `experience`, `projects`, `contact`, `cat`, `pet`)
- **ASCII Cat Playground** - Click anywhere to spawn animated ASCII cats
- **Dynamic GitHub Integration** - Automatically fetches and displays public repositories
- **Draggable Modal Windows** - macOS-style windows for about, resume, and contact sections
- **Dark/Light Theme** - Dracula color scheme with system preference detection
- **Responsive Design** - Mobile-first layout with adaptive components

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix primitives)
- **Routing:** React Router DOM
- **Deployment:** Vercel

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── Hero.tsx         # Landing section with terminal + cat playground
│   ├── InteractiveTerminal.tsx  # Terminal emulator
│   ├── Navigation.tsx   # Top navbar with modal triggers
│   ├── TerminalModal.tsx # Draggable window system
│   ├── WorkSection.tsx  # GitHub projects gallery
│   ├── RepositoryCard.tsx # Project card component
│   ├── TabBar.tsx       # Minimized windows taskbar
│   └── Theme*.tsx       # Theme provider and toggle
├── contexts/
│   └── TabContext.tsx   # Global state for minimized windows
├── hooks/               # Custom React hooks
├── lib/                 # Utilities
├── pages/               # Route components
└── index.css            # Global styles and design tokens
```

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/nxdx96/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:8080`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run lint and build checks |

## Deployment

The site deploys automatically to Vercel on push to `main`. For manual deployment:

```bash
npm run build
```

The build output in `dist/` can be deployed to any static hosting service.

## Architecture Notes

- **Terminal State:** Managed via React useState with command history and typing animations
- **Theme System:** Uses `next-themes` with CSS variables for seamless dark/light switching
- **GitHub API:** Client-side fetching with graceful fallback for rate limits
- **Window Management:** Custom draggable/resizable implementation using mouse events
- **Animations:** CSS keyframes with `prefers-reduced-motion` support

## AI-Assisted Development

This project demonstrates effective AI-assisted development workflows. See [docs/ai-workflow.md](docs/ai-workflow.md) for details on:

- How AI tools were integrated into the development process
- Prompt engineering patterns used
- Output validation strategies
- Maintaining code quality with AI assistance

## License

MIT
