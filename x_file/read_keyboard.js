var keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
    console.log('got "keypress"', key);
    if (key.ctrl && key.name == 'c') {
        process.exit();
    } else {
        console.log(`You pressed the "${ch}" key`);
        console.log();
        console.log(key);
        console.log();
    }
});

process.stdin.setRawMode(true);

