self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('sw-cache').then( cache => {
      return cache.addAll([
        'index.html',
        'icon2.png',
        'icon2_depth.jpg'
      ])
    })
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then( res => {
      return res || fetch(e.request)
    })
  )
})

self.addEventListener('activate', e=>e.waitUntil( (async ()=>{
  await clients.claim()
  setInterval(ping, 6000)
  await ping()
})()))

self.addEventListener('message', e=>{
  const {type, url, id} = e.source
  e.source.postMessage(`${type} #${id} @${url}, you said: ${e.data}`)
})

self.addEventListener( "push", e => {
  const message = e.data.text()
  sendAll(message)
})

// -- util

async function sendAll(text) {
  const allClients = await clients.matchAll({
    includeUncontrolled: true,
  })
  return Promise.all(allClients.map(client => {
    return client.postMessage(text)
  }))
}

let i = 0

async function ping() {
  await sendAll(`Ping from SW! ${i++}`)
}
