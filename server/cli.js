const fs = require('fs')
const {join} = require('path')
const Routes = require('../../barberini/query-server/routes')
const http = require('http')
const conf = require('rc')('pwa-server', {
  port: 8080
})

const cap = fs.readFileSync(join(__dirname, '..', '.pwa-url-capability'), 'utf8')
const routes = Routes()
const handle = require('.')(conf)
routes.add('/' + cap, handle)

const server = http.createServer(routes.handle)
server.listen(conf.port)
