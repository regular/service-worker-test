self.addEventListener('activate', e=>e.waitUntil( (async ()=>{
  await clients.claim()
  setInterval(ping, 2000)
  return ping()
})()))

self.addEventListener('message', e=>{
  e.source.postMessage(`You said: ${e.data}`)
})

// -- util

let i = 0

async function ping() {
  const allClients = await clients.matchAll({
    includeUncontrolled: true,
  })
  return Promise.all(allClients.map(client => {
    return client.postMessage(`Hello from SW! ${i++}`)
  }))
}
