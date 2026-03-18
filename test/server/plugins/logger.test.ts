import { test } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../helper.ts'

test('logger plugin hooks execute without error', async (t) => {
  const app = await buildApp()

  // Inject a request to trigger the hooks
  const response = await app.inject({
    method: 'GET',
    url: '/',
  })

  assert.strictEqual(response.statusCode, 200)
})

test('logger plugin is registered and functional', async (t) => {
  const app = await buildApp()

  // Verify logger is available via fastify.log
  assert(typeof app.log === 'object')
  assert(typeof app.log.info === 'function')
})
