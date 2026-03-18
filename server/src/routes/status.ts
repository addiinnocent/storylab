import { FastifyPluginAsync } from 'fastify'

const status: FastifyPluginAsync = async (fastify) => {
  fastify.get('/status', async (request, reply) => {
    const uptime = process.uptime()
    request.log.info({ uptime }, 'status endpoint called')
    const statusData = {
      status: 'Server is running on port 3000',
      timestamp: new Date().toISOString(),
      uptime
    }
    request.log.debug(statusData, 'returning status')
    return statusData
  })
}

export default status
