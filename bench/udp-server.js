var dgram = require('dgram')
var numMessages = 0

console.log('server> listening on udp4://localhost:9090')
dgram.createSocket("udp4", function (message, rinfo) {
    numMessages++
}).bind(9090, '127.0.0.1')

require('http').createServer(function(req, res) {
  res.end('numMessages: ' + numMessages)
}).listen(8000)
console.log('http server> listening on http://localhost:8000')
