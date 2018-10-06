
/**
 * Module dependencies.
 */

const chalk = require('chalk')
var http = require('http');

/**
 * Create HTTP server.
 */

const url = '192.168.0.107';
var port = normalizePort(process.env.PORT || 3000);

var requestListener = function (req, res) {
  res.writeHead(200);
  res.end('Hello, World!\n');
}

var server = http.createServer(requestListener);
const socket = require('socket.io')(server);

server.listen(port, url);
server.on('listening', onListening)

socket.on('connection', (socket) => {
  socket.emit('Conn', { hello: 'Hello World!' })
  console.log(socket.id);
  socket.on('COMMAND', (io) => {
    console.log(io)
  })
});

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
  console.log(`${chalk.green('[raspberry-pi]')} server listening on port ${port}`)
}