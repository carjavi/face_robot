

const express      = require('express');
const http         = require('http');
const WebSocket    = require('ws');
var wsocket = null;

const app=express();

app.use(express.static(__dirname + '/build/'));
app.use(express.static(__dirname + '/build/static/css'));
app.use(express.static(__dirname + '/build/static/js'));
app.use(express.static(__dirname + '/build/static/media'));

app.get('/', function (req, res) {
    res.sendFile("/build/index.html", {});
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    wsocket = ws;
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
});

server.listen(8080, function listening() {
    console.log('Web server Active listening on '+server.address().port)
});
