playing with sending framed data over tcp sockets. because udp in node is slow.

Work in progress.

---

`sotan` — *s*&zwj;trings *o*&zwj;ver *t*&zwj;cp *a*&zwj;nd *n*&zwj;etstrings
===

This is a thin wrapper around the netstrings module which makes it easy to send
strings & buffers over tcp.

If you feel like sending json you can do that, all you need to do is add a line
to stringify and a line to parse, as you can see in `tests/json.js`.

## install

```sh
$ npm install jotan --save
# yes, spell it with a "j"
```

## client

### how to connect to a server

```js
  var j = jotan(PORT, HOST)
  j.send(new Buffer('café'))
  j.send('c')

  setTimeout(function() {
    j.send('life rocks!')

    // fails due to default 1000ms timeout on the server
    setTimeout(function() {
      j.send('life rocks!')
      j.end()
    }, 1100)

  }, 500)
```

## server
One `.send` from the client results in one `data` event on the server's
`messageStream`.

Where possible the API mimics that of the `net` module.

See `tests/strings-and-buffers.js` for a working example.

```js
  jotan.createServer(onConnection, { port: PORT })

  function onConnection(rawSocket, messageStream) {
    messageStream.on('data', function(buf) {
      as.equal('object', typeof buf)
      var str = buf.toString('utf8')
      console.log('server>', str, '?', MSGS[msgsReceived])
    })
  }
```

## todos
- client
  - reconnect
  - emit errors
  - chainable
  - pipeable
  - socket.setKeepAlive
- server
  - what to do when client sends bad data
  - if payload is too big, as dictated by the prepended length, drop it to
    prevent ddos
  - emit errors
  - chainable
  - drop data instead of backpressure
- tests!
  - performance / stress
  - good values for server timeout

## MIT License
