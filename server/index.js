const fs = require('fs')

const {join} = require('path')
const {parse} = require('url')
const send = require('send')
const webpush = require('web-push')
const bl = require('bl')

module.exports = function(opts) {
  opts = opts || {}
  let {data_dir, html_root} = opts
  data_dir = data_dir ||__dirname
  html_root = html_root || join(__dirname, '..', 'public')
  const vapidKeys = getVapidKeys(data_dir, html_root)

  webpush.setVapidDetails(
    'mailto:jan@lagomorph.de',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  )

  return handler

  function handler(req, res) {
    if (req.method == 'POST' && ['/subscribe', '/unsubscribe'].includes(req.url) ) {
      return req.pipe(bl( (err, data)=>{
        let suv
        try {
          if (err) throw err
          sub = JSON.parse(data)
          console.log(sub)
          res.statusCode = 201
          res.end('Created')

          if (req.url =- '/unsubscribe') {
            console.log('Unsubscribed')
          }
          
          setTimeout(()=>{
            webpush.sendNotification(
              sub, 'Your are subscribed'
            ).catch(err => {
              console.dir(err)
            })
          }, 2000)
        } catch(err) {
          console.error(err.message)
          res.statusCode = 400
          res.end(err.message)
        }
      }))
    }
    send(req, parse(req.url).pathname, {
      root: html_root,
      dotfiles: 'ignore'
    }).pipe(res)
  }
}

function getVapidKeys(data_dir, html_root) {
  let vapidKeys
  const path = join(data_dir, '.vapid')
  try {
    vapidKeys = JSON.parse(fs.readFileSync(path))
  } catch(e) {
    console.error(e.message)
    vapidKeys = webpush.generateVAPIDKeys()
    fs.writeFileSync(path, JSON.stringify(vapidKeys), 'utf-8')
    fs.writeFileSync(join(html_root, 'vapidPublicKey'), vapidKeys.publicKey, 'utf-8')
  }
  return vapidKeys
}

