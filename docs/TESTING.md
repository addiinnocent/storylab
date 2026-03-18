# Testing Guide

This project uses a unified testing infrastructure with **three distinct test suites** covering all architectural layers:
- **Frontend**: Vitest + React Testing Library (jsdom)
- **Server**: node:test + Fastify testing utilities
- **Rust**: Cargo test framework (inline in lib.rs)

---

## Quick Start

### Run All Tests
```bash
npm test
```

### Run Layer-Specific Tests
```bash
npm run test:frontend          # Vitest (frontend only)
npm run test:frontend:watch    # Watch mode for development
npm run test:frontend:coverage # Generate coverage report
npm run test:server            # node:test (server only)
npm run test:rust              # Cargo tests (requires Rust)
npm run test:e2e               # WebDriver E2E tests (Linux only)
```

---

## Test Structure

```
test/
├── frontend/                   # React + Vitest tests
│   ├── setup.ts               # Global setup (Tauri mocks, jest-dom)
│   ├── logger.test.ts         # Logger class tests (7 tests)
│   └── App.test.tsx           # React component tests (10 tests)
│
├── server/                     # Fastify server tests
│   ├── helper.ts              # Test utilities (buildApp, setup)
│   ├── tsconfig.json          # TypeScript config for tests
│   ├── routes/
│   │   ├── root.test.ts       # GET / endpoint (1 test)
│   │   ├── example.test.ts    # GET /example endpoint (1 test)
│   │   ├── greet.test.ts      # GET /greet endpoint (2 tests)
│   │   └── status.test.ts     # GET /status endpoint (1 test)
│   └── plugins/
│       ├── support.test.ts    # Support decorator tests (1 test)
│       ├── sensible.test.ts   # HTTP error handling tests (1 test)
│       └── logger.test.ts     # Logging plugin tests (2 tests)
│
└── e2e/                        # E2E WebDriver tests
    └── wdio.conf.ts           # WebDriver config (Linux only)
```

---

## Frontend Tests

### Setup
Tests use **Vitest** with **jsdom** environment and **React Testing Library**.

**Configuration files:**
- `vitest.config.ts` — Main Vitest config with jsdom + React plugin
- `test/tsconfig.json` — Frontend test TypeScript config
- `test/frontend/setup.ts` — Global setup (clears Tauri mocks, imports jest-dom)

### Running Tests

```bash
# Single run
npm run test:frontend

# Watch mode (re-runs on file changes)
npm run test:frontend:watch

# With coverage report
npm run test:frontend:coverage
```

### Test Files

#### `test/frontend/logger.test.ts` (7 tests)
Tests the `Logger` class from `src/logger.ts`:
- ✅ Level filtering (only logs >= minLevel)
- ✅ Log entry formatting (timestamp, level, message)
- ✅ All four log methods: `debug()`, `info()`, `warn()`, `error()`

```typescript
const logger = new Logger('warn')
logger.debug('skipped')      // Won't log
logger.warn('logged!')       // Logs
logger.error('logged!')      // Logs
```

#### `test/frontend/App.test.tsx` (10 tests)
Tests the React `<App>` component:
- ✅ Renders main heading and Fastify server section
- ✅ Has input field for greeting
- ✅ Calls `/greet?name=<name>` endpoint
- ✅ Calls `/status` endpoint
- ✅ Calls `/` (root) endpoint
- ✅ Displays API responses
- ✅ Handles fetch errors gracefully

Uses mocked `fetch` global — no real API calls:
```typescript
const fetchMock = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'Hello, Alice!' })
  })
)
vi.stubGlobal('fetch', fetchMock)
```

### Coverage

Frontend tests achieve **high coverage** of:
- `src/logger.ts` — 100%
- `src/App.tsx` — Comprehensive coverage of all interaction paths

View coverage:
```bash
npm run test:frontend:coverage
# Open coverage report at: coverage/index.html
```

---

## Server Tests

### Setup
Tests use **node:test** (Node.js built-in test runner) with Fastify's `inject()` for HTTP testing.

**Configuration files:**
- `test/server/tsconfig.json` — TypeScript config for server tests
- `test/server/helper.ts` — Test helper function `buildApp()` that creates a Fastify instance

### Running Tests

```bash
# Single run
npm run test:server

# The test script runs:
# 1. npm run build:ts (compile TypeScript)
# 2. tsc -p ../test/server/tsconfig.json (type-check tests)
# 3. c8 node --test -r ts-node/register "../test/server/**/*.ts" (run with coverage)
```

### Test Files

#### `test/server/routes/root.test.ts` (1 test)
- ✅ `GET /` returns `{ root: true }` with status 200

#### `test/server/routes/example.test.ts` (1 test)
- ✅ `GET /example` returns `'this is an example'`

#### `test/server/routes/greet.test.ts` (2 tests)
- ✅ `GET /greet?name=Alice` includes "Alice" in response
- ✅ `GET /greet` (no name) defaults to "World"

#### `test/server/routes/status.test.ts` (1 test)
- ✅ `GET /status` returns object with:
  - `status` (string)
  - `timestamp` (valid ISO 8601)
  - `uptime` (positive number)

#### `test/server/plugins/support.test.ts` (1 test)
- ✅ `app.someSupport()` decorator returns `'hugs'`

#### `test/server/plugins/sensible.test.ts` (1 test)
- ✅ HTTP error utilities are loaded (sensible plugin)

#### `test/server/plugins/logger.test.ts` (2 tests)
- ✅ Logger hooks execute without error on requests
- ✅ Pino logger is available on `app.log`

### Helper Function

`test/server/helper.ts` provides `buildApp()`:

```typescript
import { buildApp } from '../helper'

test('example', async (t) => {
  const app = await buildApp()

  const response = await app.inject({
    method: 'GET',
    url: '/example'
  })

  assert.strictEqual(response.statusCode, 200)
})
```

`buildApp()` returns a Fastify instance with:
- All plugins auto-loaded (AutoLoad from `server/src/plugins/`)
- All routes auto-loaded (AutoLoad from `server/src/routes/`)
- Logging disabled for cleaner test output

### Coverage

Server tests achieve **99%+ coverage**:
- All routes tested
- All plugins tested
- Error paths verified

View detailed coverage:
```bash
npm run test:server
# Coverage table printed at end of test run
```

---

## Rust Tests

### Setup
Rust tests are defined **inline** in `src-tauri/src/lib.rs` using the `#[cfg(test)]` module.

### Running Tests

```bash
npm run test:rust
```

Or directly:
```bash
cd src-tauri
cargo test
```

### Test Module

Located in `src-tauri/src/lib.rs`:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn greet_with_name() {
        let result = greet("Alice");
        assert!(result.contains("Alice"));
    }

    #[test]
    fn compute_server_status_with_handle() {
        let status = compute_server_status(true);
        assert_eq!(status, "Server is running on port 3000");
    }
}
```

### Tests Included

- ✅ `greet()` returns greeting with name
- ✅ `greet()` handles empty string
- ✅ `compute_server_status(true)` returns "Server is running on port 3000"
- ✅ `compute_server_status(false)` returns "Server is not running"

---

## E2E Tests (WebDriver)

### Setup
E2E tests use **WebdriverIO** with Tauri driver for browser automation.

**⚠️ macOS Limitation:** WebDriver testing is NOT supported on macOS (WKWebView has no driver).

Configuration:
- `test/e2e/wdio.conf.ts` — Scaffold for Linux CI
- Exits gracefully on macOS with helpful error message

### Running Tests (Linux Only)

```bash
# First, install tauri-driver (one-time)
cargo install tauri-driver

# Then run tests
npm run test:e2e
```

### Creating E2E Tests

Create files matching `test/e2e/**/*.e2e.ts`:

```typescript
// test/e2e/example.e2e.ts
describe('App UI', () => {
  it('should display heading', async () => {
    const heading = await $('h1')
    await expect(heading).toBeDisplayed()
  })
})
```

---

## Writing Tests

### Frontend Tests (Vitest + React Testing Library)

**Pattern:**
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('should do something', async () => {
    render(<MyComponent />)

    // Query by accessibility role/text (preferred)
    const button = screen.getByRole('button', { name: /click/i })

    // Simulate user interaction
    await userEvent.click(button)

    // Assert outcome
    expect(screen.getByText('clicked!')).toBeInTheDocument()
  })
})
```

**Best practices:**
- ✅ Query by accessibility (role, label, text) — not by ID/class
- ✅ Use `userEvent` for realistic interaction (not `fireEvent`)
- ✅ Test user-facing behavior, not implementation details
- ✅ Mock external APIs with `vi.stub` or `vi.fn()`

### Server Tests (node:test + Fastify)

**Pattern:**
```typescript
import { test } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../helper'

test('GET /api/endpoint returns 200', async (t) => {
  const app = await buildApp()

  const response = await app.inject({
    method: 'GET',
    url: '/api/endpoint'
  })

  assert.strictEqual(response.statusCode, 200)
  const data = JSON.parse(response.body)
  assert.deepStrictEqual(data, { expected: 'value' })
})
```

**Best practices:**
- ✅ Use `app.inject()` for HTTP testing (no real network)
- ✅ Test all HTTP methods (GET, POST, PUT, DELETE)
- ✅ Test error cases (404, 400, 500)
- ✅ Validate response shape, not just status code

### Rust Tests

**Pattern:**
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn function_behaves_correctly() {
        let result = my_function(42);
        assert_eq!(result, 43);
    }
}
```

**Best practices:**
- ✅ Use `assert_eq!` for exact matches
- ✅ Use `assert!` for boolean conditions
- ✅ Test edge cases (empty inputs, negative numbers, etc.)
- ✅ Write descriptive test names

---

## CI/CD Integration

The test scripts are ready for CI/CD:

```bash
# GitHub Actions / similar
npm run test:frontend
npm run test:server

# Rust testing requires cargo (add to CI environment)
npm run test:rust

# E2E tests on Linux runners only
npm run test:e2e
```

Example `.github/workflows/test.yml`:
```yaml
name: Tests
on: [push, pull_request]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run test:frontend

  server:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run test:server

  rust:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - run: npm install --prefix server
      - run: npm run test:rust
```

---

## Troubleshooting Tests

### Frontend tests fail with "fetch is not defined"
**Solution:** Ensure `vitest.config.ts` has `environment: 'jsdom'` and `globals: true`.

### Server tests fail with "Cannot find module"
**Solution:** Run `npm run build:ts` first to compile TypeScript.

### Tests hang or timeout
**Solution:**
- Check that ports 1420 and 3000 aren't in use
- Ensure `buildApp()` is being awaited properly
- Add explicit timeout: `npm run test:server -- --timeout 10000`

### Coverage reports are missing
**Solution:** Generate explicitly:
```bash
npm run test:frontend:coverage  # Frontend
npm run test:server             # Server (shows table in output)
```

### Rust tests fail with "cargo not found"
**Solution:** Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

---

## Best Practices

1. **Write tests as you code** — not after
2. **Test behaviour, not implementation** — what matters to users
3. **Keep tests focused** — one assertion per test when possible
4. **Use descriptive names** — `should_handle_empty_input` not `test1`
5. **Mock external dependencies** — APIs, timers, file system
6. **Avoid brittle tests** — don't test exact text or styling details
7. **Run tests frequently** — use watch mode during development
8. **Check coverage** — aim for 80%+ on critical paths

---

## Related Documentation

- **[DEVELOPMENT.md](DEVELOPMENT.md)** — Development workflow and debugging
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — System design and component responsibilities
- **[LOGGING.md](LOGGING.md)** — Logging setup across all three layers
