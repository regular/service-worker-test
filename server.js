const http = require('http')
const {join} = require('path')
const {parse} = require('url')
const send = require('send')

const server = http.createServer( (req, res)=>{
  send(req, parse(req.url).pathname, {
    root: join(__dirname, '/public'),
    dotfiles: 'ignore'
  }).pipe(res)
})

server.listen(8080)
