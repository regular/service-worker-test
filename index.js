const h = require('mutant/html-element')
const {Value} = require('mutant')

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
