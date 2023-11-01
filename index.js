const h = require('mutant/html-element')
const {Value} = require('mutant')

const message = Value()

document.body.append(h(message))

message('Hello World')
