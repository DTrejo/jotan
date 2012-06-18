jotan = require('../')

// var j = jotan(null, 'jotan.jit.su')
var j = jotan()

setTimeout(blast, 100)

function blast () {
  for (var i = 0; i < 100000; i++) {
    j.send(i+'')
  }
  j.socket.on('drain', function() {
    process.exit(0)
  })
}
