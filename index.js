const h = require('mutant/html-element')
const {Value} = require('mutant')
const convertKey = require('./b64url-to-unit8array')

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
    console.log('Already subscribed', sub.endpoint)
    postSub(sub)
    //setUnsubscribeButton();
  } else {
    //setSubscribeButton();
    subscribe(reg)
  }
})

async function subscribe(reg) {
  console.log('subscribing ...')
  const res = await fetch('./vapidPublicKey')
  const vapidPublicKey = await res.text()
  const applicationServerKey = convertKey(vapidPublicKey)

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey
  })
  console.log('Subscribed', sub.endpoint)
  await postSub(sub)
}

async function postSub(sub) {
  //const {endpoint, keys} = sub
  await fetch('subscribe', {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(sub)
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

