
var five = require("johnny-five");
var Raspi = require("raspi-io");
var led
const board = new five.Board({
    io: new Raspi()
});

board.on('ready', () => {
    led = new five.Led("P1-12");
});

function blink(time) {
    led.blink(time);
}
function on() {
    led.on();
}

function off() {
    led.stop();
    led.off();
}

module.exports = {
    blink,
    on,
    off
}