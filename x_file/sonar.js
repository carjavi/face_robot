/*var Sonar = require('raspi-sonar').Sonar;
var sonarPin1 = new Sonar(24);

sonarPin1.read(function(duration) {
  var distance = 343.0 * duration / 1000000 * .5;
  console.log('duration: ' + duration + ' distance: ' + distance + 'm');
});


var five = require("johnny-five");
var Raspi = require("raspi-io");

var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
  // Use an Expander to create a Virtual board:
  var virtual = new five.Board.Virtual(new five.Expander("GROVEPI"));

  var proximity = new five.Proximity({
    board: virtual,
    controller: "HCSR04",
    pin: "D7"
  });

  proximity.on("change", function() {
    console.log("%dcm", Math.round(this.cm));
  });
});

*/

var rpio = require('rpio');

var GPIO_TRIGGER = 18; // GPIO24
var GPIO_ECHO = 22; // GPIO25

rpio.open(GPIO_TRIGGER, rpio.OUTPUT, rpio.LOW);
rpio.open(GPIO_ECHO, rpio.INPUT);

rpio.msleep(500);

var k=0;

while( k==0) {
rpio.msleep(500);

rpio.write(GPIO_TRIGGER, rpio.HIGH);
rpio.usleep(10);
rpio.write(GPIO_TRIGGER, rpio.LOW);

while (rpio.read(GPIO_ECHO) == 0) {
    var hrTime = process.hrtime();
    StartTime = ((hrTime[0] * 1000000 + hrTime[1] / 1000)/1000000);
}

while (rpio.read(GPIO_ECHO) == 1) {
    var hrTime = process.hrtime();
    StopTime = ((hrTime[0] * 1000000 + hrTime[1] / 1000)/1000000);
}

var TimeElapsed = StopTime - StartTime;
var distance1 = (TimeElapsed * 17150); 
console.log("distancia = " + distance1+ "cm");
}