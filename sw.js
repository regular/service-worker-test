self.addEventListener('activate', e=>e.waitUntil( (async ()=>{
  await clients.claim()
  setInterval(ping, 2000)
  return ping()
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
