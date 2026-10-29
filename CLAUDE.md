# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

Single-page React app with a section-based layout. `App.jsx` composes global elements (Navbar, CursorTrail) with page sections (Hero → About → Skills → Works → Footer).

**Key split:**
- `src/components/` — Reusable/complex interactive pieces (3D scenes, cursor)
- `src/sections/` — Page sections that own their layout and content

**3D scenes** (React Three Fiber + Three.js) are wrapped in `<Suspense>` inside their sections. `FrogScene.jsx` uses custom GLSL shaders for water ripples and rain particles. `WorksScene.jsx` renders the project carousel backed by a 3D background of rotating octahedra.

**Works data** lives as a `works` array inside `src/sections/Works.jsx`. Each entry has optional `hackathon` metadata (name, role, date, award, team size). `WorksScene.jsx` reads this data to render tilt-effect cards with an AnimatePresence modal.

**Custom cursor** (`CursorTrail.jsx`) hides the native cursor globally and renders a raindrop shape + ripple trail via absolute-positioned divs.

## Styling

- Tailwind CSS with a custom color palette defined in `tailwind.config.js` — use semantic names like `bg-bg`, `text-accent`, `bg-sub`, `text-muted` rather than raw hex values.
- Custom utility classes in `index.css`: `.pond-card`, `.leaf-btn`, `.pink-btn`, `.glow-green`, `.glow-pink`, `.glow-rain`.
- Fonts: Fredoka One (display headings), Nunito (body), M PLUS Rounded 1c — loaded via Google Fonts in `index.html`.

## Design Theme

Frog + rain-soaked pond. Dark forest green (`#071e13`) background with neon green (`accent`), pink/magenta (`sub`), and rain-blue (`rain`) accents. All new UI should follow this palette and the soft, rounded, nature-inspired aesthetic.
