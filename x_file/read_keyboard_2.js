
const xevEmitter = require('xev-emitter')(process.stdin)

console.log("Control Ready!"); //

xevEmitter.on('KeyPress', (key) => {
    console.log(key, 'was pressed')
})

xevEmitter.on('KeyRelease', (key) => {
    console.log(key, 'was released')
})