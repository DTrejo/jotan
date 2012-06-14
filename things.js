// testing
var net = require('net')
var fork = require('child_process').fork
var PORT = 8989
var HOST = 'localhost'

if (process.argv[2] === 'client') {
  client()
} else {
  server()
  startClient()
  startClient()
}

function server() {
  var s = net.createServer(function(c) {
    c.on('data', function(data) {
      // data is a buffer :)
      console.log(data.toString('utf8'))
    })

    c.on('end', function() {

    })
  })
  s.listen(PORT)
  s.on('error', function(e) {
    console.log(e)
  })
  console.log('server listening on '+HOST+':'+PORT)
}

function client() {
  var s = net.connect(PORT, HOST)
  s.on('connect', function() {
    console.log('client connected to server')
    s.write('hi')
  })
}

function startClient() {
  fork(__filename, [ 'client' ])
}
