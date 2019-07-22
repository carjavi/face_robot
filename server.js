/**
 * SIRO Server
 *
 * @author Carlos Briceño
 * 
 *http: // <ip>:8080 //cara 
 *http: // <ip>:8000 //camara 
 */
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

//corre server para la camara--------------------------
const { spawn } = require('child_process');
const pyProg = spawn('python3', ['webcam_rpi.py']);
//------------------------------------------------------

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws,req) {
    console.log("Conected: ", wss.clients.size);

        ws.on('message', function incoming(message) {
            var event = JSON.parse(message);

            console.log("accion: " + event.action +" tiempo -->",event.timeout);
                
                wss.clients.forEach(function each(client) {
                    if (client !== ws) { // client !== ws && client.readyState === WebSocket.OPEN
                        client.send(JSON.stringify({accion:event.action,timeoutSpeak:event.timeout}));
                      }
                });
        });
});

server.listen(8080, function listening() {
    console.log("Web server Active listening on " + server.address().port + " : Face");
    console.log("Web server Active listening on IP:8000 : WebCam");
});
