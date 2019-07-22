//Autor: Carlos Briceño carjavi@hotmail.com
//robot publicitario / wheel control


var HCS04_left = 0;
var HCS04_center = 0;
var HCS04_right = 0;
var pos1 = 0;
var pos2 = 0;

//read Keyboard
var keypress = require('keypress');

// Serial setting
var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
var port = new SerialPort("/dev/ttyUSB0",{
    baudRate: 9600
});
var parser = new Readline();
port.pipe(parser);
parser.on('data', function(data) {

    str = data.toString();

    //console.log(str);
    pos1 = str.search("<");
    pos2 = str.search(">");
    // saca valor sensor izquierdo
    HCS04_left = parseFloat(str.slice(0, pos1)); 
    // saca valor sensor derecho
    HCS04_right = parseFloat(str.slice(pos2 + 1, str.length)); 
    // saca el valor sensor Central
    HCS04_center = parseFloat(str.slice(pos1 + 1, pos2));
    console.log(HCS04_left,"-",HCS04_center,"-", HCS04_right);
    
});



console.log("Control Ready!"); //

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
    if (key.ctrl && key.name == 'c') {
        port.write("red0@");
        port.write("gre0@");
        port.write("blu255@");
        port.write("sto@");
        setTimeout(Shoutdown, 1000);
        //process.exit();
    } else {
        if (key.name == "up") {
            port.write("fon@");
            console.log("Up");
        }
        if (key.name == "down") {
            port.write("bac@");
            console.log("down");
        }
        if (key.name == "right") {
            port.write("rig@");
            console.log("right");
        }
        if (key.name == "left") {
            port.write("lef@");
            console.log("left");
        }
        if (key.name == "space") {
            port.write("sto@");
            console.log("Stop");
        }
        if (key.name == "r") {
            port.write("red255@");
            port.write("gre0@");
            port.write("blu0@");
            console.log("red");
        }
        if (key.name == "g") {
            port.write("red0@");
            port.write("gre255@");
            port.write("blu0@");
            console.log("green");
        }
        if (key.name == "b") {
            port.write("red0@");
            port.write("gre0@");
            port.write("blu255@");
            console.log("blue");
        }
        if (key.name == "o") {
            port.write("red0@");
            port.write("gre0@");
            port.write("blu0@");
            console.log("off_ligth");
        }
    }
});

process.stdin.setRawMode(true);


function Shoutdown() {
    process.exit();
}