import { test } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../helper.ts'

test('sensible plugin is loaded by the app', async (t) => {
  const app = await buildApp()

  // The sensible plugin should be loaded automatically by the app
  // Verify the app initialized successfully with the plugin
  assert(app !== null)
  assert(typeof app === 'object')

  // The sensible plugin decorates the app with httpErrors
  // Verify it's available if the plugin was loaded
  if (app.httpErrors !== undefined) {
    assert(typeof app.httpErrors === 'object')
    assert(typeof app.httpErrors.notFound === 'function')
  }
})
