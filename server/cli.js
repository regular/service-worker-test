const http = require('http')
const conf = require('rc')('pwa-server', {
  port: 8080
})

const handler = require('.')(conf)

const server = http.createServer(handler)
server.listen(conf.port)
