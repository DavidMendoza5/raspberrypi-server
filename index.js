'use strict'
/**
 * Module dependencies.
 */

const chalk = require('chalk')
var http = require('http');
var debug = require('debug')('raspberry-pi:server');
var os = require('os');
let cron = require('node-cron')


/**
 * Create HTTP server.
 */


var port = normalizePort(process.env.PORT || 3000);

var requestListener = function (req, res) {
  res.writeHead(200);
  res.end('Hello, World!\n');
}
let url
var server = http.createServer(requestListener);
var io = require('socket.io-client')
var leds
if (os.arch() == 'arm') {
  try {
    leds = require('./led')
    cron = require('node-cron')
  } catch (error) {
    console.log(error.stack)
  }

}
const exec = require('child_process').exec;


/*
require('dns').lookup(require('os').hostname(), async (err, add, fam) => {
  server.listen(port, add)
  url = add
  console.log(url)
})
*/

exec('hostname -I', async (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return
  }
  url = stdout.split(' ')[0]
  server.listen(port, url)
  server.on('listening', onListening)
});

var socket = io.connect('https://heroku-server-18.herokuapp.com');

socket.on('CONN', (io) => {
  console.log(`${chalk.green('[raspberrypi-hostname]')} ${url}:${port}`)

  socket.emit('IP', { url })
  var task = cron.schedule('* * * * *', () => {
    socket.emit('IP', { url })
    console.log(url)
    task.start()
  }, true)
  task.start()

  socket.on('FORWARD', (io) => {
    exec('sudo python /home/pi/Desktop/raspberrypi-flask-app/car/forward.py', async (error, stout, stderr) => {
      if (error) {
        console.log(error.stack, io)
        return
      }
      console.log(stout)
    })
  })

  socket.on('BACKWARD', (io) => {
    exec('sudo python /home/pi/Desktop/raspberrypi-flask-app/car/backward.py', async (error, stout, stderr) => {
      if (error) {
        console.log(error.stack, io)
        return
      }
      console.log(stout)
    })
  })

  socket.on('RIGHT', (io) => {
    exec('sudo python /home/pi/Desktop/raspberrypi-flask-app/car/right.py', async (error, stout, stderr) => {
      if (error) {
        console.log(error.stack, io)
        return
      }
      console.log(stout)
    })
  })

  socket.on('LEFT', (io) => {
    exec('sudo python /home/pi/Desktop/raspberrypi-flask-app/car/left.py', async (error, stout, stderr) => {
      if (error) {
        console.log(error.stack, io)
        return
      }
      console.log(stout)
    })
  })

  socket.on('STOP', (io) => {
    exec('sudo python /home/pi/Desktop/raspberrypi-flask-app/car/stop.py', async (error, stout, stderr) => {
      if (error) {
        console.log(error.stack, io)
        return
      }
      console.log(stout)
    })
  })
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

async function onListening() {
  console.log(`${chalk.green('[raspberry-pi]')} server listening on ${url}:${port}`)
}
