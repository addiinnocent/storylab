import { test } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../helper.ts'

test('GET / returns { root: true }', async (t) => {
  const app = await buildApp()

  const response = await app.inject({
    method: 'GET',
    url: '/',
  })

  assert.strictEqual(response.statusCode, 200)
  const data = JSON.parse(response.body)
  assert.strictEqual(data.root, true)
})
