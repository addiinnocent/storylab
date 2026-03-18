# Storylab

A desktop book editor built with Tauri, React, TypeScript, and Fastify. Write novels with a beautiful, distraction-free interface.

## Quick Start

```bash
# Install dependencies
npm install && npm install --prefix server

# Start development
npm run tauri dev
```

The app opens with:
- React frontend on port 1420 (Tauri webview)
- Fastify server on port 3000
- Tauri window managing everything

## Features

- **Book Editor Landing Page** — Clean, minimalist interface for writing
  - 200px sidebar with chapter navigation
  - Mock text editor (textarea) styled as a page
  - Formatting toolbar (Bold, Italic, Underline, Strikethrough, Headings)
  - Live word count tracker
  - Responsive desktop layout

## Architecture

**Three-layer desktop application:**

1. **React Frontend** (`src/`) → Runs in Tauri webview
2. **Fastify Server** (`server/`) → Node.js sidecar, HTTP API on port 3000
3. **Tauri/Rust** (`src-tauri/`) → Desktop app shell, spawns and manages sidecar

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture.

## Development

### Common Commands

| Command | Purpose |
|---------|---------|
| `npm run tauri dev` | Start full dev environment |
| `npm run build` | Build production binary |
| `npm test` | Run all tests (frontend + server + Rust) |
| `npm run test:frontend` | Run React tests with Vitest |

### Key Ports

- **1420** → Vite dev server (frontend)
- **3000** → Fastify server (backend)
- **1421** → Vite HMR (hot reload)

## Component Structure

```
src/components/
├── layout/
│   └── EditorLayout.tsx     # Root layout (sidebar + editor)
├── sidebar/
│   ├── Sidebar.tsx
│   ├── SidebarHeader.tsx
│   └── ChapterList.tsx      # Mock chapters
└── editor/
    ├── EditorArea.tsx
    ├── EditorToolbar.tsx
    └── EditorMock.tsx       # Mock textarea (will be replaced with Lexical)
```

## Testing

- **Frontend**: Vitest + React Testing Library
  - `npm run test:frontend` — Run all frontend tests
  - Tests verify: chapter navigation, editor UI, word count, toolbar buttons

- **Server**: node:test + Fastify
  - `npm run test:server`

- **Rust**: Cargo tests
  - `npm run test:rust`

## IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — System design and data flow
- [DEVELOPMENT.md](docs/DEVELOPMENT.md) — Development workflow and debugging
- [TESTING.md](docs/TESTING.md) — Testing guide for all three layers
- [SIDECAR.md](docs/SIDECAR.md) — Fastify server setup and routes
- [BUILDING.md](docs/BUILDING.md) — Building for production
