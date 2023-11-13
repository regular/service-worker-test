const Routes = require('../../barberini/query-server/routes')
const http = require('http')
const conf = require('rc')('pwa-server', {
  port: 8080
})

const routes = Routes()
const handle = require('.')(conf)
routes.add('/pwa', handle)

const server = http.createServer(routes.handle)
server.listen(conf.port)
