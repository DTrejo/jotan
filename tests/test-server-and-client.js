//
// testing
//

var jotan = require('../')
var fork = require('child_process').fork
var as = assert = require('assert')
var PORT = 8989
var HOST = 'localhost'

if (process.argv[2] === 'client') {
  client()
} else {
  jotan.createServer(onConnection, { port: PORT })
  startClient()
  startClient()
  startClient()
}

function onConnection(rawSocket, messageStream) {
  var MSGS = [
    'abc',
    'hello world!',
    'café',
    'a',
    'b',
    'c',
    '{"life":"rocks!"}'
  ]

  var msgsReceived = 0
  messageStream.on('data', function(d) {
    as.equal('object', typeof d)
    if (Buffer.isBuffer(d)) d = d.toString()
    console.log('server>', d.toString(), '?', MSGS[msgsReceived])

    as.equal(d, MSGS[msgsReceived])
    msgsReceived++
    if (msgsReceived === MSGS.length) console.log('server> win!')
  })
}

//
// client that sends only netstrings to the server
//
// function client() {
//   var s = net.connect(PORT, HOST)
//   s.on('connect', function() {
//     console.log('client connected to server')
//     s.write(new Buffer('3:abc,'))
//     s.write(new Buffer('12:hello'))
//     s.write(new Buffer(' world!,'))
//     s.write(new Buffer('5:café,'))
//     s.write(new Buffer('1:a,1:b,1:c,'))
//     // s.write(new Buffer(','))
//     s.end()
//   })
// }

//
// client that sends strings and json to the server
//
function client() {
  var j = jotan(PORT, HOST)
  j.send('abc')
  j.send('hello world!')
  j.send('café')
  j.send('a')
  j.send('b')
  j.send('c')

  setTimeout(function() {
    j.send(JSON.stringify({ life: 'rocks!' }))

    // fails due to default 1000ms timeout on the server
    setTimeout(function() {
      j.send(JSON.stringify({ life: 'rocks!' }))
      j.end()
    }, 1100)

  }, 500)
}

function startClient() {
  fork(__filename, [ 'client' ])
}
