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

function onConnection(c, messageStream) {
  var MSGS = [
    'abc',
    'hello world!',
    'café',
    'a',
    'b',
    'c',
    {'life':'rocks!'}
  ]

  var msgsReceived = 0
  messageStream.on('data', function(d) {
    as.equal('object', typeof d)
    d = d.toString('utf8')
    d = JSON.parse(d)
    // console.log('server>', d.toString(), '?', MSGS[msgsReceived])
    as.deepEqual(d, MSGS[msgsReceived])
    msgsReceived++
    if (msgsReceived === MSGS.length) console.log('server> win!')
  })
}

//
// client that sends json to the server
//
function client() {
  var j = jotan(PORT, HOST)
  send('abc')
  send('hello world!')
  send('café')
  send('a')
  send('b')
  send('c')

  setTimeout(function() {
    send({ life: 'rocks!' })

    // fails due to default 1000ms timeout on the server
    setTimeout(function() {
      send({ life: 'rocks!' })
      j.end()
    }, 1100)

  }, 500)
  function send(data) {
    j.send(JSON.stringify(data))
  }
}

function startClient() {
  fork(__filename, [ 'client' ])
}
