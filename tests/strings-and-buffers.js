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
    'life rocks!'
  ]

  var msgsReceived = 0
  messageStream.on('data', function(buf) {
    as.equal('object', typeof buf)
    var str = buf.toString('utf8')
    console.log('server>', str, '?', MSGS[msgsReceived])

    as.equal(str, MSGS[msgsReceived])
    msgsReceived++
    if (msgsReceived === MSGS.length) console.log('server> win!')
  })
}

//
// client that sends strings and buffers to the server
//
function client() {
  var j = jotan(PORT, HOST)
  j.send(new Buffer('abc'))
  j.send(new Buffer('hello world!'))
  j.send(new Buffer('café'))
  j.send('a')
  j.send('b')
  j.send('c')

  setTimeout(function() {
    j.send('life rocks!')

    // fails due to default 1000ms timeout on the server
    setTimeout(function() {
      j.send('life rocks!')
      j.end()
    }, 1100)

  }, 500)
}

function startClient() {
  fork(__filename, [ 'client' ])
}
