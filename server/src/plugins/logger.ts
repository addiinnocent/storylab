import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const loggerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('logger', fastify.log)

  fastify.addHook('onRequest', async (request, reply) => {
    request.log.debug(
      { method: request.method, url: request.url },
      'incoming request'
    )
  })

  fastify.addHook('onResponse', async (request, reply) => {
    request.log.debug(
      {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode
      },
      'request completed'
    )
  })
}

export default fp(loggerPlugin)
