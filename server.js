const fs = require('fs')
const http = require('http')
const {join} = require('path')
const {parse} = require('url')
const send = require('send')
const webpush = require('web-push')
const bl = require('bl')

const vapidKeys = getVapidKeys()

webpush.setVapidDetails(
  'mailto:jan@lagomorph.de',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const server = http.createServer( (req, res)=>{
  if (req.method == 'POST' && req.url == '/subscribe') {
    return req.pipe(bl( (err, data)=>{
      let suv
      try {
        if (err) throw err
        sub = JSON.parse(data)
        console.log(sub)
        res.statusCode = 201
        res.end('Created')
        setTimeout(()=>{
          webpush.sendNotification(
            sub, 'Your are subscribed')
        }, 2000)
      } catch(err) {
        console.error(err.message)
        res.statusCode = 400
        res.end(err.message)
      }
    }))
  }
  send(req, parse(req.url).pathname, {
    root: join(__dirname, '/public'),
    dotfiles: 'ignore'
  }).pipe(res)
})

server.listen(8080)

// -- utils

function getVapidKeys() {
  let vapidKeys
  const path = join(__dirname, '.vapid')
  try {
    vapidKeys = JSON.parse(fs.readFileSync(path))
  } catch(e) {
    console.error(e.message)
    vapidKeys = webpush.generateVAPIDKeys()
    fs.writeFileSync(path, JSON.stringify(vapidKeys), 'utf-8')
    fs.writeFileSync(join(__dirname, 'public', 'vapidPublicKey'), vapidKeys.publicKey, 'utf-8')
  }
  return vapidKeys
}

