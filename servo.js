var jf = require('johnny-five')
var Raspi = require("raspi-io");
var board = new jf.Board({
    io: new Raspi()
})
var motor

board.on('ready', onReady)

function onReady() {
    motor = new jf.Servo('P1-12')
}

function on(degree) {
    motor.to(degree) // mover el servo de 0-180°
}

module.exports = {
    on
}