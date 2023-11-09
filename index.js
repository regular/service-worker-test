const h = require('mutant/html-element')
const {Value} = require('mutant')
const convertKey = require('./b64url-to-unit8array')

require('./3d')

const message = Value()
const buttonText = Value()
const disabled = Value(true)
let buttonAction = ()=>{}

document.body.appendChild(h('div', [
  h('.message', message),
  h('button', {
    disabled,
    'ev-click': ()=>{
      disabled.set(true)
      setTimeout( ()=> buttonAction(), 500)
    },
  }, buttonText)
]))

function setButton(text, action) {
  buttonText.set(text)
  buttonAction = action
  disabled.set(false)
}

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
    setButton('Unsubscribe', ()=>unsubscribe(reg))
    postSub(sub)
    //setUnsubscribeButton();
  } else {
    setButton('Subscribe', ()=>subscribe(reg))
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
  setButton('Unsubscribe', ()=>unsubscribe(reg))
  console.log('Subscribed', sub.endpoint)
  await postSub(sub)
}

async function postSub(sub, unsub) {
  //const {endpoint, keys} = sub
  await fetch((unsub ? 'un' : '') +  'subscribe', {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(sub)
  })
}

async function unsubscribe(reg) {
  const sub = await reg.pushManager.getSubscription()
  await sub.unsubscribe()
  setButton('Subscribe', ()=>subscribe(reg))
  console.log('Unsubscribed', sub.endpoint);
  await postSub(sub, true)
}

