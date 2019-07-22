
const WebSocketClient= require('ws')
const url = 'ws://localhost:8080' // ws://xxxxxxx:9000/userID/<<deviceId>>
const client = new WebSocketClient(url)

client.on('close', function() {
    console.log('The client has disconnected!');
});

/*
client.on('message', function incoming(data) {
    console.log('msg server:', data);
    var event = JSON.parse(data);
    console.log("accion:",event.accion);
});

client.onmessage = (e) => {
    var event = JSON.parse(e.data)
    console.log (event);
    console.log("accion:",event.accion);
}
*/
var timeoutspeak = 1000;

client.on('open', function() {
    console.log('Client has connected to the server!');

    function sendNumber() {
        if (client.readyState == 1) { // confirma que esta conectado
            /*
            var number = Math.round(Math.random() * 0xFFFFFF);
            client.send(number.toString());
            setTimeout(sendNumber, 1000);
            */
           //client.send("123");
           
           client.send(JSON.stringify({
            id: "2",
            action: "hablar",
            timeout: timeoutspeak 
           }));
           

        }
    }
    sendNumber();
});
 





