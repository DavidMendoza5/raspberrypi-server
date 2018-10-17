var five = require('johnny-five');
var PiIO = require('pi-io');

var board = new five.Board({
  io: new PiIO()
});

board.on('ready', function() {
  var servo = new five.Servo({
    pin: 'GPIO27',
    type: "continuous"
  });

});

function on(degree) {
  servo.cw(0.8)
}

module.exports = {
    on
}