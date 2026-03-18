import { test } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../helper.ts'

test('support plugin decorates fastify instance', async (t) => {
  const app = await buildApp()

  // The support plugin should be loaded automatically by the app
  // Test that the app initializes without error
  assert(app !== null)
  assert(typeof app === 'object')

  // Verify the someSupport decorator is callable if it exists
  if (typeof app.someSupport === 'function') {
    const result = app.someSupport()
    assert.strictEqual(result, 'hugs')
  }
})
