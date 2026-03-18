import { FastifyPluginAsync } from 'fastify'

const greet: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: { name?: string } }>('/greet', async (request, reply) => {
    const name = request.query.name || 'World'
    request.log.info({ name }, 'greet endpoint called')
    const message = `Hello, ${name}! You've been greeted from the Fastify server!`
    request.log.debug({ message }, 'returning greeting')
    return { message }
  })
}

export default greet
