var net = require('net')
var ms = require('ms')
var ns = require('netstring')
var nsWrite = ns.nsWrite

//
// jotan client
//
module.exports = jotan

function jotan(port, host, options) {
  port = port || 8989
  host = host || 'localhost'
  options = options || {}
  // TODO: figure out how this works.
  // options.initialDelay = options.initialDelay || 500 //ms('500ms')

  var connected = false
  var q = [] // FIFO list of strings to be written

  var socket = net.connect(port, host)
  // s.setKeepAlive(true, options.initialDelay)
  socket.on('connect', function() {
    connected = true
    while (q.length) {
      socket.write(q.shift())
    }
  })

  socket.on('error', console.error) // TODO reconnection and error handling

  var self = {
    send: function(payload) {
      if (typeof payload !== 'string' && !Buffer.isBuffer(payload)) {
        throw new Error('payload must be a Buffer or string.')
      }
      // no need to convert to utf8, b/c netstrings lib does this for you
      var str = nsWrite(payload)

      if (!connected) q.push(str)
      else socket.write(str)

      return self
    }
    , end: function(data, encoding) {
      socket.end(data, encoding)
      return self
    }
    , socket: socket
  }
  return self
}

//
// jotan server
//
// mimics a tcp server, except that it calls back with a ns.Stream, and sets the
// timeout on each connection for your convenience.
//
jotan.createServer = function(onConnectionCallback, options) {
  onConnectionCallback = onConnectionCallback || function() {}
  options.timeout = options.timeout || 1000
  options.port = options.port || 8989

  var server = net.createServer(handleConnection)
  server.on('error', function(e) {
    console.log('server>\n', e.stack)
  })
  server.listen(options.port)
  console.log('server> listening on tcp://localhost:'+options.port)
  return server

  function handleConnection(c) {
    c.setTimeout(options.timeout)
    var messageStream = new ns.Stream(c)

    c.on('timeout', function() {
      console.log('server> connection timeout. Ending connection.')
      c.end();
    })
    c.on('end', function() {
      console.log('server> client disconnected')
    })

    onConnectionCallback(c, messageStream)
  }
}
