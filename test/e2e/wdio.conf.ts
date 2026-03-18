/**
 * E2E Test Configuration for Storylab
 *
 * ⚠️ MACOS LIMITATION:
 * tauri-driver E2E testing is NOT supported on macOS due to WKWebView limitations.
 * This configuration is provided for Linux CI environments only.
 *
 * Supported: Linux (with tauri-driver)
 * Unsupported: macOS (WKWebView), Windows (limited driver support)
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Check if running on macOS
if (process.platform === 'darwin') {
  console.error('\n❌ E2E Testing Limitation on macOS\n')
  console.error('WebDriver E2E testing with tauri-driver is not supported on macOS.')
  console.error('WKWebView (used on macOS) does not provide a WebDriver interface.\n')
  console.error('To run E2E tests, use a Linux environment with tauri-driver installed:')
  console.error('  cargo install tauri-driver\n')
  process.exit(1)
}

export const config = {
  runner: 'local',
  port: 4444,
  specs: [path.join(__dirname, '**/*.e2e.ts')],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  services: ['tauri'],
  tauri: {
    appPath: path.join(__dirname, '..', '..'),
  },
  capabilities: [
    {
      platformName: 'linux',
      'tauri:options': {
        application: path.join(
          __dirname,
          '..',
          '..',
          'src-tauri',
          'target',
          'release',
          'storylab'
        ),
      },
    },
  ],
}
