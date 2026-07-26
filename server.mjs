import { createServer } from 'node:http'
import { Readable } from 'node:stream'
import handler from './dist/server/server.js'

const port = Number(process.env.PORT || 3000)
const host = process.env.HOST || '0.0.0.0'

const server = createServer(async (incoming, outgoing) => {
  try {
    const request = new Request(`http://${incoming.headers.host || '127.0.0.1'}${incoming.url || '/'}`, {
      method: incoming.method || 'GET',
      headers: incoming.headers,
    })
    const response = await handler.fetch(request)
    outgoing.statusCode = response.status
    response.headers.forEach((value, key) => outgoing.setHeader(key, value))
    if (!response.body || incoming.method === 'HEAD') {
      outgoing.end()
      return
    }
    Readable.fromWeb(response.body).pipe(outgoing)
  } catch (error) {
    outgoing.statusCode = 500
    outgoing.setHeader('content-type', 'application/json; charset=utf-8')
    outgoing.end(JSON.stringify({ status: 'error', message: error instanceof Error ? error.message : 'request failed' }))
  }
})

server.listen(port, host, () => {
  console.log(`coolify-demo listening on ${host}:${port}`)
})
