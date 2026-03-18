import { test } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../helper.ts'

test('GET /status returns correct response shape', async (t) => {
  const app = await buildApp()

  const response = await app.inject({
    method: 'GET',
    url: '/status',
  })

  assert.strictEqual(response.statusCode, 200)
  const data = JSON.parse(response.body)

  // Verify response has required fields
  assert(typeof data.status === 'string')
  assert(typeof data.timestamp === 'string')
  assert(typeof data.uptime === 'number')

  // Verify timestamp is valid ISO 8601
  assert(!isNaN(new Date(data.timestamp).getTime()))

  // Verify uptime is a positive number
  assert(data.uptime >= 0)
})
