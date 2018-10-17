var five = require('johnny-five');
var PiIO = require('pi-io');
var servo 
var board = new five.Board({
  io: new PiIO()
});

board.on('ready', function() {
  servo = new five.Servo(11);
});

function on(degree) {
  servo.to(180);
}

module.exports = {
    on
}