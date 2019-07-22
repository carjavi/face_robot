

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

const wss = new WebSocket.Server({ server }),users = [];

wss.on('connection', function connection(ws,req) {

        //users.push(ws);
        //console.log(ws.upgradeReq.connection.remoteAddress);
        //var userID = parseInt(ws.upgradeReq.userID);
        //console.log(userID);
        //ws.send('user connect'); // send msg to client
        console.log("Conectados: ", wss.clients.size);
        const ip = req.connection.remoteAddress;
        console.log("ip",ip);
        //console.log("req:",req.url);
        //const url = req.url;
        //var userID = parseInt(clientes.upgradeReq.url.substr(1), 10);
        //console.log("User:", users.upgradeReq);
        // const key = req.headers;
        //console.log("headers:",ws.upgradeReq.headers);
        //ws.id = req.headers['sec-websocket-key'];
        //console.log("ws_id", ws.id );
        


        ws.on('message', function incoming(message) {
            //console.log('received:', message);
            var event = JSON.parse(message);
            console.log("accion --->", event.action);

            if (message == "123"){
                //client.send("escuchando");
                    console.log("mande el JSON");
                   /*
                    ws.send(JSON.stringify({
                        id: "client2",
                        accion:"escuchando",
                        timeout: "20"
                    }));
                    */

                    //ws.send(JSON.stringify({accion:"robotHablando",parametros:null}));
               // ws.broadcast("escuchando");
               // ({"accion":"robotHablando","parametros":{"estado":true}});
                
                wss.clients.forEach(function each(client) {
                    if (client !== ws) { // client !== ws && client.readyState === WebSocket.OPEN
                        console.log("mando a cada cliente");
                        //client.send("epa");
                        client.send(JSON.stringify({accion:"test",timeoutSpeak: "1000"}));
                      }
                });
                
            }

        });
});

server.listen(8080, function listening() {
    console.log('Web server Active listening on '+server.address().port)
});
