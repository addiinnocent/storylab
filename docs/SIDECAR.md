# Fastify Server Sidecar

The Fastify server is a **Node.js process spawned by Tauri** on app startup. It runs independently and serves HTTP requests from the React frontend.

## Overview

| Property | Value |
|----------|-------|
| **Language** | TypeScript (compiled to JavaScript) |
| **Framework** | Fastify 5.x |
| **Port** | 3000 (localhost) |
| **Entry Point** | `server/dist/server.js` |
| **Spawned By** | `src-tauri/src/lib.rs` (Rust) |
| **Lifetime** | App startup → App shutdown |
| **Logging** | Pino (structured logging) |

## Architecture

### Fastify Setup

`server/src/server.ts` (entry point):
1. Initialize Pino logger with pretty-printing
2. Create Fastify instance
3. Register the main app plugin
4. Listen on port 3000 (all interfaces: 0.0.0.0)

### App Plugin

`server/src/app.ts` registers:
1. **CORS plugin** → Allow requests from any origin (development)
2. **Auto-load plugins** → Load middleware from `plugins/` directory
3. **Auto-load routes** → Load routes from `routes/` directory

### Routes (Auto-Loaded)

Routes in `server/src/routes/` are automatically loaded and registered:

- `root.ts` → `GET /` (root endpoint)
- `greet.ts` → `GET /greet?name=Alice` (greeting endpoint)
- `status.ts` → `GET /status` (server status)

Add new routes by creating files in this directory—no manual registration needed.

### Plugins/Middleware (Auto-Loaded)

Plugins in `server/src/plugins/` are automatically registered:

- `logger.ts` → Request/response logging
- `sensible.ts` → Security headers (auto-loaded by Fastify)
- `support.ts` → Utility functions (auto-loaded by Fastify)

## Development

### Start in Standalone Mode

```bash
cd server
npm run dev
```

Server starts on `http://localhost:3000` with file watching and auto-reload.

Test routes:
```bash
curl http://localhost:3000/
curl http://localhost:3000/greet?name=Alice
curl http://localhost:3000/status
```

### Build TypeScript

```bash
cd server
npm run build:ts
```

Outputs to `server/dist/`.

### Run Compiled Server

```bash
cd server
npm run start
```

Same as `node dist/server.js`.

## Adding Routes

### Example: New Route

Create `server/src/routes/hello.ts`:

```typescript
import { FastifyPluginAsync } from 'fastify'

const hello: FastifyPluginAsync = async (fastify) => {
  fastify.get('/hello/:name', async (request, reply) => {
    const { name } = request.params as { name: string }
    request.log.info({ name }, 'hello endpoint called')
    return { greeting: `Hello, ${name}!` }
  })
}

export default hello
```

Done! Route is auto-loaded and available at `GET /hello/Alice`.

### Example: POST with Body

```typescript
import { FastifyPluginAsync } from 'fastify'

interface GreetRequest {
  firstName: string
  lastName: string
}

const greetPost: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: GreetRequest }>('/greet-full', async (request, reply) => {
    const { firstName, lastName } = request.body
    request.log.info({ firstName, lastName }, 'greet-full endpoint called')
    return { message: `Hello, ${firstName} ${lastName}!` }
  })
}

export default greetPost
```

## Adding Middleware/Plugins

### Example: Authentication Middleware

Create `server/src/plugins/auth.ts`:

```typescript
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (request, reply) => {
    const token = request.headers.authorization?.split(' ')[1]

    if (!token) {
      request.log.warn('missing authorization token')
      reply.code(401).send({ error: 'Unauthorized' })
      return
    }

    // Validate token...
    request.log.debug('token validated')
  })
}

export default fp(authPlugin)
```

Done! Middleware is auto-loaded and will run for all requests.

## Data Types with TypeScript

Use TypeScript for type safety:

```typescript
interface QueryParams {
  name?: string
  limit?: number
}

interface ResponseData {
  success: boolean
  data: unknown
}

fastify.get<{
  Querystring: QueryParams
  Reply: ResponseData
}>('/api/search', async (request, reply) => {
  // request.query has type checking
  const { name, limit } = request.query
  return {
    success: true,
    data: []
  }
})
```

## Error Handling

### Built-in Error Handling

Fastify automatically catches errors and returns 500:

```typescript
fastify.get('/error', async () => {
  throw new Error('Something went wrong!')
  // Returns: { statusCode: 500, error: 'Internal Server Error', message: '...' }
})
```

### Custom Error Response

```typescript
fastify.get('/custom-error', async (request, reply) => {
  request.log.error({ reason: 'validation failed' }, 'custom error')
  reply.code(400).send({
    error: 'Bad Request',
    message: 'Invalid input'
  })
})
```

## Lifecycle

### Startup Sequence

1. **Tauri starts** (`npm run tauri dev`)
2. **Rust spawns Node.js** (`spawn_server()` in lib.rs)
3. **Node.js starts Fastify** (`server/src/server.ts`)
4. **Routes and plugins loaded** (auto-load from directories)
5. **Server listening** on port 3000
6. **Frontend requests** are served

### Shutdown Sequence

1. **User closes Tauri app window**
2. **Tauri kills Node.js process**
3. **Server stops** listening
4. **Connections closed**

### Environment Variables

Pass environment variables when spawning:

```rust
// src-tauri/src/lib.rs
let child = std::process::Command::new("node")
    .arg(server_path)
    .env("PORT", "3000")
    .env("LOG_LEVEL", "info")
    .spawn()?;
```

Access in server:

```typescript
const port = process.env.PORT || '3000'
const logLevel = process.env.LOG_LEVEL || 'info'
```

## Production Bundling

### Build for Production

```bash
npm run build
```

This runs:
1. `npm run build:ts --prefix server` → Compile server TypeScript
2. TypeScript type-checking
3. Vite build for frontend
4. Cargo build for Rust

### Bundle Resources

In `src-tauri/tauri.conf.json`:

```json
"bundle": {
  "resources": ["../server/dist/**/*"]
}
```

Server files are copied into the app bundle so they're available on user machines.

### Accessing Bundled Server

In production (lib.rs):

```rust
let server_path = if cfg!(debug_assertions) {
    "../server/dist/server.js"  // Development: use source
} else {
    "./server/dist/server.js"   // Production: bundled path
};
```

## Debugging

### Enable Debug Logs

```bash
LOG_LEVEL=debug npm run tauri dev
```

### Check Server Health

```bash
curl http://localhost:3000/status
```

### Common Issues

| Issue | Fix |
|-------|-----|
| "Server not listening" | Check port 3000 is available: `lsof -i:3000` |
| "Cannot find module" | Run `npm install && npm run build:ts` in server dir |
| "Routes not loading" | Verify files in `server/src/routes/` are valid exports |
| "CORS errors" | Check `@fastify/cors` is registered in app.ts |

## Testing

### Unit Tests

```bash
cd server
npm run test
```

### Manual Testing

Start server standalone and test routes:

```bash
cd server
npm run dev

# In another terminal
curl http://localhost:3000/greet?name=Test
curl -X POST http://localhost:3000/greet-full \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe"}'
```

## Performance

### Monitoring

Check server logs for request times:
```
[12:30:45.123] DEBUG request completed method=GET url=/status statusCode=200
```

### Optimization Tips

1. **Add caching** → Use `@fastify/caching` for repeated requests
2. **Connection pooling** → If accessing databases
3. **Compression** → Use `@fastify/compress` for large responses
4. **Logging level** → Reduce to `warn` in production

## Security

### CORS Configuration

Currently allows all origins (development):

```typescript
await fastify.register(cors, { origin: true })
```

For production, restrict to your domain:

```typescript
await fastify.register(cors, {
  origin: 'https://yourdomain.com'
})
```

### Input Validation

Always validate user input:

```typescript
interface CreateUserRequest {
  name: string
  email: string
}

fastify.post<{ Body: CreateUserRequest }>('/users', async (request, reply) => {
  const { name, email } = request.body

  if (!name || !email) {
    return reply.code(400).send({ error: 'Missing fields' })
  }

  // Validate email format...
})
```

### Sensitive Data

Never log passwords, tokens, or secrets:

```typescript
❌ request.log.info({ token: authToken }, 'login')
✅ request.log.info({ userId }, 'login')
```
