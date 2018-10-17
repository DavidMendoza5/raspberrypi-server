'use strict'
/**
 * Module dependencies.
 */

const chalk = require('chalk')
var http = require('http');
/**
 * Create HTTP server.
 */
var { IP_LOCAL } = require('./config')
const url = IP_LOCAL
var port = normalizePort(process.env.PORT || 3000);

var requestListener = function (req, res) {
  res.writeHead(200);
  res.end('Hello, World!\n');
}

var server = http.createServer(requestListener);
var io = require('socket.io-client')
var socket = io('')
var leds = require('./led')

server.listen(port, url)
server.on('listening', onListening)

var socket = io.connect('https://heroku-server-18.herokuapp.com');
  socket.on('blink_led', function (data) {
    console.log(data);
    leds.blink(data.time);
  });


socket.on('blink_led', (io) => {
  console.log(io);
  leds.blink(io.time);
})

socket.on('OFF_LED', (io) => {
  console.log(io)
  leds.off()
})
socket.on('ON_LED', (io) => {
  console.log(io)
  leds.on();
})

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log(`${chalk.green('[raspberry-pi]')} server listening on ${url}:${port}`)
}