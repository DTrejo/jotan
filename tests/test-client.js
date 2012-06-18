//
// testing
//

var fork = require('child_process').fork
var as = assert = require('assert')
var PORT = 8989
var HOST = 'localhost'

if (process.argv[2] === 'client') {
  client()
} else {
  server()
  startClient()
  startClient()
  startClient()
}

function server() {
  var s = net.createServer(onConnection)
  s.listen(PORT)
  s.on('error', function(e) {
    console.log('server>', e)
  })
  console.log('server> listening on '+HOST+':'+PORT)
}
function onConnection(c) {
  c.setTimeout(1000)
  var ins = new ns.Stream(c)

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
  ins.on('data', function(d) {
    as.equal('object', typeof d)
    d = JSON.parse(d)
    // console.log('server>', d.toString(), '?', MSGS[msgsReceived])
    as.deepEqual(d, MSGS[msgsReceived])
    msgsReceived++
    if (msgsReceived === MSGS.length) console.log('server> win!')
  })

  c.on('timeout', function() {
    console.log('server> connection timeout')
    c.end();
  })
  c.on('end', function() {
    console.log('server> client disconnected')
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
// client that sends buffers and json to the server
//
function client() {
  var j = jotan(PORT, HOST)
  j.send(new Buffer('abc'))
  j.send(new Buffer('hello world!'))
  j.send(new Buffer('café'))
  j.send(new Buffer('a'))
  j.send(new Buffer('b'))
  j.send(new Buffer('c'))

  setTimeout(function() {
    j.send({ life: 'rocks!' })

    // fails due to default 1000ms timeout on the server
    setTimeout(function() {
      j.send({ life: 'rocks!' })
      j.end()
    }, 1100)

  }, 500)
}

function startClient() {
  fork(__filename, [ 'client' ])
}
