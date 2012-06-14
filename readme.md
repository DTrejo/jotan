playing with sending framed data over tcp sockets. because udp in node is slow.

---

Work in progress

`jotan` — *j*&zwj;son *o*&zwj;ver *t*&zwj;cp *a*&zwj;nd *n*&zwj;etstrings
===

## install

```sh
$ npm install jotan --save
```

## client

### how to connect to a server

```js
var jotan = require('jotan')

var j = jotan(PORT, HOST)
j.send(new Buffer("c"))

setTimeout(function() {
  j.send({ life: 'rocks!' })

  // fails due to default 1000ms timeout on the server
  setTimeout(function() {
    j.send({ life: 'rocks!' })
    j.end()
  }, 1100)

}, 500)
```

## server
See `test.js` for an example.

## todos
- client
  - reconnect
  - emit errors
  - chainable
  - pipeable
- server
  - expose a server
  - what to do when client sends bad data
  - emit errors
  - chainable
- tests!
  - performance / stress
  - why isn't keepalive working as expected
  - good values for server timeout

## MIT License
