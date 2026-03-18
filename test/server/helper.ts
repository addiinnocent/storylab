import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fastify from 'fastify'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function buildApp() {
  const instance = fastify({
    logger: false // Disable logging in tests
  })

  // Import the compiled app from dist directory
  const { default: app } = await import('../../server/dist/app.js')

  // Register the app plugin - this should load all plugins via AutoLoad
  await instance.register(app)

  // Wait a small amount for plugins to fully register
  await instance.ready()

  return instance
}
