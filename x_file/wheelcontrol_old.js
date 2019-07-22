//Autor: Carlos Briceño carjavi@hotmail.com
//robot publicitario / wheel control

//read Keyboard
var keypress = require('keypress');
// GPIO

var Gpio = require("onoff").Gpio; //include onoff to interact with the GPIO
var IN1 = new Gpio(17, "out"); //uGPIO pin 11
var IN2 = new Gpio(27, "out"); //GPIO pin 13
var IN3 = new Gpio(22, "out"); //GPIO pin 15
var IN4 = new Gpio(23, "out"); //GPIO pin 19


IN1.writeSync(0);
IN2.writeSync(0);
IN3.writeSync(0);
IN4.writeSync(0);




console.log("Control Ready!"); //

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
    if (key.ctrl && key.name == 'c') {
        IN1.writeSync(0);
        IN2.writeSync(0);
        IN3.writeSync(0);
        IN4.writeSync(0);
        process.exit();
    } else {
        if (key.name == "up") {
            IN1.writeSync(0);
            IN2.writeSync(1);
            IN3.writeSync(0);
            IN4.writeSync(1);
            console.log("Up");
        }
        if (key.name == "down") {
            IN1.writeSync(1);
            IN2.writeSync(0);
            IN3.writeSync(1);
            IN4.writeSync(0);
            console.log("down");
        }
        if (key.name == "right") {
            IN1.writeSync(1);
            IN2.writeSync(0);
            IN3.writeSync(0);
            IN4.writeSync(1);
            console.log("right");
        }
        if (key.name == "left") {
            IN1.writeSync(0);
            IN2.writeSync(1);
            IN3.writeSync(1);
            IN4.writeSync(0);
            console.log("left");
        }
        if (key.name == "space") {
            IN1.writeSync(0);
            IN2.writeSync(0);
            IN3.writeSync(0);
            IN4.writeSync(0);
            console.log("Stop");
        }
    }
});

process.stdin.setRawMode(true);