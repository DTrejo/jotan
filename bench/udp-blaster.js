var dgram = require('dgram')
var d = dgram.createSocket('udp4')
var PORT = 9090
var IP = '127.0.0.1'

var buf;

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
    buf = new Buffer(i+'')
    d.send(buf, 0, buf.length, PORT, IP)
    sent++
  }
}

// sent 1000010 toSend 1000000 PER_TICK 55

// real  0m18.238s
// user  0m6.437s
// sys 0m3.846s
// numMessages: 1000010
// sent 1000010 toSend 1000000 PER_TICK 55

// real  0m18.235s
// user  0m6.426s
// sys 0m3.795s
// numMessages: 2000020
// sent 1000010 toSend 1000000 PER_TICK 55

// real  0m18.235s
// user  0m6.379s
// sys 0m3.879s
// numMessages: 3000030