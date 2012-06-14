//
// TODO: look into socket.setKeepAlive at some point
//
var net = require('net')
var ms = require('ms')
var ns = require('netstring')
var nsWrite = ns.nsWrite

// jotan client
module.exports = jotan
function jotan(port, host, options) {
  options = options || {}
  // TODO: figure out how this works.
  // options.initialDelay = options.initialDelay || 500 //ms('500ms')

  var connected = false
  var q = [] // FIFO list of strings to be written

  var s = net.connect(port, host)
  // s.setKeepAlive(true, options.initialDelay)
  s.on('connect', function() {
    connected = true
    while (q.length) {
      s.write(q.shift())
    }
  })

  s.on('error', console.error) // TODO reconnection and error handling

  var self = {
    send: function(data) {
      if (Buffer.isBuffer(data)) data = data.toString('utf8') // TODO: reconsider
      var pay = JSON.stringify(data)
      var str = nsWrite(pay)

      if (!connected) q.push(str)
      else s.write(str)

      return self
    }
    , end: function(data, encoding) {
      s.end(data, encoding)
    }
  }
  return self
}
