const h = require('mutant/html-element')
const {Value} = require('mutant')
const {urlBase64ToUint8Array} = require('./util')

const message = Value()

document.body.append(h('div', message))

message.set('Loading sw.js')

navigator.serviceWorker.addEventListener('message', e => {
  console.log('got msg', e.data)
  message.set(String(e.data))
})

navigator.serviceWorker.register('sw.js').then(()=>{
  message.set('service worker loaded')
}).catch(err=>{
  message.set(err.message)
})

navigator.serviceWorker.ready.then( async reg => {
  reg.active.postMessage("Hi service worker")

  const sub = await reg.pushManager.getSubscription()
  if (sub) {
    console.log('Already subscribed', subscription.endpoint)
    //setUnsubscribeButton();
  } else {
    //setSubscribeButton();
    subscribe(reg)
  }
})

async function subscribere() {
  const res = await fetch('./vapidPublicKey')
  const vapidPublicKey = await res.text()
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

  const sub = await reg.pushManager.subscribe({
    //userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
  })
  console.log('Subscribed', sub.endpoint)
  await fetch('subscribe', {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: sub.toJSON()
  })
}

async function unsubscribe(reg) {
  const sub = await reg.pushManager.getSubscription()
  await sub.unsubscribe()
  console.log('Unsubscribed', sub.endpoint);
  await fetch('unsubscribe', {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: sub.toJSON()
  })
}

