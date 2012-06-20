jotan = require('../')
var j = jotan()
// var j = jotan(null, 'jotan.jit.su')

var PER_TICK = 55

var interval;
var sent = 0
var toSend = 1e6


blast()

function blast () {
  interval = setInterval(send, 1);
}

function send () {
  if (sent >= toSend) {
    clearInterval(interval);
    console.log('sent', sent, 'toSend', toSend, 'PER_TICK', PER_TICK)
    process.exit(0)
  }

  var i = PER_TICK;
  while (i--) {
    j.send(i+'')
    sent++
  }
}

// sent 1000010 toSend 1000000 PER_TICK 55

// real  0m18.256s
// user  0m10.054s
// sys 0m4.110s
// numMessages: 1000010
// sent 1000010 toSend 1000000 PER_TICK 55

// real  0m18.251s
// user  0m10.456s
// sys 0m4.198s
// numMessages: 2000020
// sent 1000010 toSend 1000000 PER_TICK 55

// real  0m18.252s
// user  0m10.902s
// sys 0m4.528s
// numMessages: 3000030


//
//
//
// jotan = require('../')

// // var j = jotan(null, 'jotan.jit.su')
// var j = jotan()

// setTimeout(blast, 100)

// var pressureLevel = 0
// var maxPressure = 4

// var stopTheData = false;
// var dropped = 0

// function blast () {
//   j.socket.on('drain', function() {
//     if (stopTheData) {
//       stopTheData = false
//       pressureLevel = 0
//     }
//   })

//   var pressure;
//   for (var i = 0; i < 1e9; i++) {
//     if (pressureLevel >= maxPressure) {
//       dropped++
//       continue;
//     }

//     pressure = j.send(i+'')
//     if (pressure) pressureLevel++
//     else pressureLevel = 0
//   }
//   console.log('done sending')
//   j.socket.on('drain', function() {
//     process.exit(0)
//   })
// }