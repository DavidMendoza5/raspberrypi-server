var jf = require('johnny-five')
var board = new jf.Board()
var motor

board.on('ready', onReady)

function onReady() {
    motor = new motor.Servo("P1-12")
    
}

function on(degree) {
    motor.to(degree) // mover el servo de 0-180°
}

module.exports = {
    on
}