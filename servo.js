var jf = require('johnny-five')
var board = new jf.Board()
var bombillo
var motor

board.on('ready', onReady)

function onReady() {
    var config = {
        pin: 'A0',
        freq: 50
    }
    celda = new jf.Sensor(config)
    bombillo = new jf.Led(13)
    bombillo.on() // encerder el led
    motor = new motor.Servo(9)
    motor.to(0) // mover el servo de 0-180° 
    ondear()
}

function ondear() {
    console.log('Luz:', celda.value) 
    setTimeout(ondear, 1000);
}