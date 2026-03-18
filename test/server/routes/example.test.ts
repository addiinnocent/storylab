import { test } from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../helper.ts'

test('GET /example returns example message', async (t) => {
  const app = await buildApp()

  const response = await app.inject({
    method: 'GET',
    url: '/example',
  })

  assert.strictEqual(response.statusCode, 200)
  assert.strictEqual(response.body, 'this is an example')
})
