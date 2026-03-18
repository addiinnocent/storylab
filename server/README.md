# Fastify Sidecar Server

This is the backend server for the Storylab Tauri application. It runs as a **sidecar process** alongside the desktop app, providing a REST API on port 3000.

## Architecture

- **Port**: 3000 (localhost)
- **Entry Point**: `dist/server.js` (compiled TypeScript)
- **Lifecycle**: Started automatically by Tauri when the app launches
- **Routes**: Auto-loaded from `src/routes/`
- **Plugins/Middleware**: Auto-loaded from `src/plugins/`

## Development

### `npm run dev`

Starts the server in development mode with TypeScript watching and hot reload.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build:ts`

Compiles TypeScript to `dist/`.

### `npm run start`

Runs the compiled server (used by Tauri sidecar).

### `npm run test`

Run the test suite.

## Communication

**From Frontend (React)**:
```javascript
const response = await fetch("http://localhost:3000/");
const data = await response.json();
```

**From Rust Backend**:
The Tauri app spawns this server via `spawn_server()` in `src-tauri/src/lib.rs`.

## Adding Routes

Create a new file in `src/routes/` and export a Fastify plugin:

```typescript
import { FastifyPluginAsync } from 'fastify'

const myRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/my-endpoint', async (request, reply) => {
    return { message: 'Hello from my endpoint' }
  })
}

export default myRoute
```

Routes are auto-loaded, so they'll be available immediately.

## Bundling

During production builds, the compiled server is bundled into the app resources, ensuring it's available on end-user machines.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).
