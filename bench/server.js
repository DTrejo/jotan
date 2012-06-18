//
// http
//
require('http').createServer(function(req, res) {
  res.end('numMessages: ' + numMessages)
}).listen(8000)
console.log('http server> listening on http://localhost:8000')

//
// tcp
//
require('../').createServer(onConnection, { timeout: 5000 })

var numMessages = 0;
function onConnection(_, messageStream) {
  messageStream.on('data', function(buf) {
    numMessages++
  })
}
