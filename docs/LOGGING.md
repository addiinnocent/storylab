# Logging

Storylab implements comprehensive logging across all three layers: **Frontend** (React), **Server** (Node.js/Fastify), and **Rust Backend**.

## Overview

| Layer | Logger | Output | Levels |
|-------|--------|--------|--------|
| **Frontend** | Custom `logger.ts` | Browser console | debug, info, warn, error |
| **Server** | Pino with pretty printer | Stdout (terminal) | debug, info, warn, error |
| **Rust** | env_logger | Stderr (terminal) | debug, info, warn, error |

## Frontend Logging

### Setup

Logger is initialized in `src/logger.ts` and exported as a singleton.

```typescript
import { logger } from './logger'

// Usage
logger.info('User logged in', { userId: 123 })
logger.error('Failed to load data', { error })
logger.debug('Render complete')
logger.warn('Deprecated API used')
```

### Output Format

Logs appear in browser console with timestamps and colour-coded levels:

```
[INFO] 2026-03-18T12:30:45.123Z User clicked button
[DEBUG] 2026-03-18T12:30:45.456Z API request sent
[ERROR] 2026-03-18T12:30:46.789Z Network error
```

### Viewing Logs

1. Open Tauri window → **F12** (or **Cmd+Opt+I** on macOS)
2. Go to **Console** tab
3. Logs appear with timestamps and level colours

### Configuration

Change minimum log level in `src/logger.ts`:

```typescript
const logger = new Logger('debug')  // Show debug and above
const logger = new Logger('warn')   // Show only warnings and errors
```

## Server Logging

### Setup

Fastify and routes use **Pino** logger with pretty-printing for development.

Configured in `server/src/server.ts`:

```typescript
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})
```

### Usage in Routes

```typescript
// server/src/routes/greet.ts
fastify.get('/greet', async (request, reply) => {
  request.log.info({ name }, 'greet endpoint called')
  // ... do work
  request.log.debug({ message }, 'returning greeting')
  return { message }
})
```

### Output Format

Terminal output (colour-coded by level):

```
[12:30:45.123] INFO  greet endpoint called name=Alice
[12:30:45.124] DEBUG returning greeting message="Hello, Alice!"
[12:30:45.125] INFO  request completed method=GET url=/greet statusCode=200
```

### Environment Variables

```bash
# Change log level
LOG_LEVEL=debug npm run tauri dev

# Production (less verbose)
LOG_LEVEL=warn npm run build
```

### Request/Response Logging

Automatically logged via `server/src/plugins/logger.ts`:

```
[12:30:45.123] DEBUG incoming request method=GET url=/status
[12:30:45.124] DEBUG request completed method=GET url=/status statusCode=200
```

All requests are logged with method, URL, and status code.

## Rust Logging

### Setup

Configured in `src-tauri/src/lib.rs`:

```rust
env_logger::Builder::from_default_env()
    .format_timestamp_millis()
    .init();
```

### Usage

```rust
use log::{debug, info, error};

debug!("Starting process: {}", name);
info!("Server spawned successfully");
error!("Failed to spawn server: {}", error);
```

### Output Format

Terminal output (plain text, may be interspersed with server logs):

```
[12:30:45.123] INFO Starting Tauri application
[12:30:45.124] DEBUG spawn_server called
[12:30:45.125] INFO Spawning Node.js server at path: ../server/dist/server.js
[12:30:45.126] INFO Node.js server started on port 3000
```

### Enable Debug Logging

```bash
RUST_LOG=debug npm run tauri dev
```

Levels: `trace`, `debug`, `info`, `warn`, `error`

### Module-Specific Logging

```bash
# Log only Tauri internals
RUST_LOG=tauri=debug npm run tauri dev

# Log multiple modules
RUST_LOG=tauri=debug,storylab=debug npm run tauri dev
```

## Viewing All Logs Together

When running `npm run tauri dev`, logs from all three layers appear in the terminal:

```
[Tauri] Starting Tauri application
[Tauri] Spawning Node.js server...
[Server] INFO Server listening at http://127.0.0.1:3000
[Tauri] INFO Node.js server started on port 3000
[Vite] ready in 234 ms
[Server] DEBUG incoming request method=GET url=/status
[Browser] [INFO] App mounted
[Server] DEBUG request completed method=GET url=/status statusCode=200
```

**Tips:**
- Tauri logs are prefixed with `[INFO]`, `[DEBUG]`, etc.
- Fastify logs from the server show timestamps
- Browser logs won't appear in terminal; view in DevTools Console

## Best Practices

### 1. Use Appropriate Levels

- **`debug`** → Detailed information for developers (variable values, intermediate steps)
- **`info`** → General operational messages (startup, requests, state changes)
- **`warn`** → Warnings about non-critical issues (deprecated APIs, fallbacks)
- **`error`** → Errors that need attention (failures, exceptions)

### 2. Include Context

❌ **Bad:**
```typescript
logger.info('Request')
```

✅ **Good:**
```typescript
logger.info({ method, url, userId }, 'API request')
```

### 3. Log at Boundaries

- **Entry points** → Function start (input parameters)
- **Exit points** → Before returning (return values)
- **Error points** → When errors occur (error details)
- **State changes** → When important state changes

### 4. Structured Logging

Include relevant context as objects:

```typescript
logger.info({
  action: 'user_login',
  userId: 123,
  timestamp: Date.now(),
  ipAddress: request.ip
}, 'User logged in successfully')
```

### 5. No Sensitive Data

❌ **Bad:**
```typescript
logger.info({ password: 'secret123' }, 'Login attempt')
```

✅ **Good:**
```typescript
logger.info({ userId: 123 }, 'Login attempt')
```

## Production Logging

In production builds:

1. **Frontend** → Logs only shown if user opens DevTools
2. **Server** → Logs written to stdout (can be redirected to files)
3. **Rust** → Logs written to stderr

For production monitoring:
- Redirect stdout/stderr to logging service
- Or write logs to files and collect

Example (Linux/macOS):
```bash
./storylab > logs/app.log 2>&1 &
```

## Troubleshooting

### Not seeing server logs?

1. Check `LOG_LEVEL` env var: `LOG_LEVEL=debug npm run tauri dev`
2. Verify Fastify is starting: search for "listening at"
3. Check for errors in terminal (red text)

### Frontend logs not showing?

1. Open DevTools: **F12** or **Cmd+Opt+I**
2. Go to **Console** tab
3. Check console filter is set to "All levels" (not just warnings/errors)

### Too many logs?

Set environment variable to reduce verbosity:

```bash
LOG_LEVEL=warn RUST_LOG=warn npm run tauri dev
```

Or temporarily disable logging in code:

```typescript
// In src/logger.ts
const logger = new Logger('error')  // Only show errors
```
