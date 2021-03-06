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
  url = await stdout.split(' ')[0]
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

  setInterval(async () => {
    socket.emit('SYSTEM', {
      cpu: os.cpus(),
      memory: {
        free: os.freemem(),
        total: os.totalmem()
      }
    })
  }, 2000);


  var request = require('request')
  const endpoint = 'https://beta.soldai.com/bill-cipher/'
  const key = 'd581f48bf83560b991076417fcb61f9470e6e490'
  const id = 'WEB_8a5603b7-fd3d-4dca-81fc-2923eb691354'
  const CARPATH = '/home/pi/Desktop/raspberrypi-flask-app/car/'
  const CAMERAPATH = '/home/pi/Desktop/raspberrypi-flask-app/camera/'

  socket.on('MESSAGE', (io) => {
    var msg = io.msg
    console.log(io)
    request(`${endpoint}askquestion?key=${key}&num_intents=1&log=0&session_id=${id}&question=${msg}`, (error, response, body) => {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode)
      var obj = JSON.parse(body).current_response
      var answer = obj.message
      var key = obj.intent_name
      console.log('Question:', obj.resolvedQuery);
      console.log('Answer:', answer);
      console.log('Key:', key);
      socket.emit('ANSWER', { answer })
      exec(`sudo python ${CARPATH}${key}.py`, async (error, stout, stderr) => {
        if (error) {
          console.log(error.stack, io)
          return
        }
        console.log(stout)
      })
    });
  })

  socket.on('CAMERA', (io) => {
    console.log(io)
    exec(`sudo python ${CAMERAPATH}${io.msg.file}.py`, async (error, stout, stderr) => {
      if (error) {
        console.log(error.stack, io)
        return
      }
      console.log(stout)
    })
  })

  socket.on('PHOTO', (io) => {
    console.log(io)
    exec(`sudo raspistill -o foto.jpg`, async (error, stout, stderr) => {
      if (error) {
        console.log(error.stack, io)
        return
      }
      console.log(stout)
    })
  })

  socket.on('FORWARD', (io) => {
    exec(`sudo python ${CARPATH}forward.py`, async (error, stout, stderr) => {
      if (error) {
        console.log(error.stack, io)
        return
      }
      console.log(stout)
    })
  })

  socket.on('BACKWARD', (io) => {
    exec(`sudo python ${CARPATH}backward.py`, async (error, stout, stderr) => {
      if (error) {
        console.log(error.stack, io)
        return
      }
      console.log(stout)
    })
  })

  socket.on('RIGHT', (io) => {
    exec(`sudo python ${CARPATH}right.py`, async (error, stout, stderr) => {
      if (error) {
        console.log(error.stack, io)
        return
      }
      console.log(stout)
    })
  })

  socket.on('LEFT', (io) => {
    exec(`sudo python ${CARPATH}left.py`, async (error, stout, stderr) => {
      if (error) {
        console.log(error.stack, io)
        return
      }
      console.log(stout)
    })
  })

  socket.on('STOP', (io) => {
    exec(`sudo python ${CARPATH}stop.py`, async (error, stout, stderr) => {
      if (error) {
        console.log(error.stack, io)
        return
      }
      console.log(stout)
    })
  })
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

module.exports = socket