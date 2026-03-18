import { test } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../helper.ts'

test('GET /greet?name=Alice includes name in response', async (t) => {
  const app = await buildApp()

  const response = await app.inject({
    method: 'GET',
    url: '/greet?name=Alice',
  })

  assert.strictEqual(response.statusCode, 200)
  const data = JSON.parse(response.body)
  assert(data.message.includes('Alice'))
})

test('GET /greet defaults to World when no name provided', async (t) => {
  const app = await buildApp()

  const response = await app.inject({
    method: 'GET',
    url: '/greet',
  })

  assert.strictEqual(response.statusCode, 200)
  const data = JSON.parse(response.body)
  assert(data.message.includes('World'))
})
