/**
 * speech cliente
 *
 * @author Carlos Briceño
 * 
 *     07/2019
 */

//----------------------------------------------

// faltan las salidas de luces
// funcion autonoma

/* ----------------- comandos ----------------
0 -- activa la busqueda de personas y cuando lo encuentra le dice una publicidad
8 -- mueve el robot hacia adelante
2 -- mueve el robot hacia atras
6 -- mueve el robot hacia la derecha
4 -- mueve el robot hacia la izquierda
? -- muestra estos comandos

lo demas que se escriba lo reproduce

expresion:
laughter
mouthsad
angryface
sadface
surpriseface
normalface

*/


var HCS04_left = 0;
var HCS04_center = 0;
var HCS04_right = 0;
var presence = 0;
var count = 0;
var pos1 = 0;
var pos2 = 0;
var pos3 = 0;
var pos4 = 0;
var autonomo = false;
var pub_spk = 0; // contador para cambiar  la publicidad que reproduce
const Time_Stop = 3000; // tiempo extra que el robot permanece detenido para re iniciar el modo automatico
var rnd  = true; // activa el random
var lista = [1,2,3,4,5]; // lista de los numero a los que lo va a odenar aleatoriamente para tener un random controlado
var lista2; // nueva lista de nuemros aleatorios
var m = 0; // para evitar que el random haga numeros duplicados 
var p = -1; // para evitar que el random haga numeros duplicados 
var TextToSpeech = ""; // donde ponemos el texto que va a decir
var h = 0; // para hacer un contador y decir publicidad en secuencia.

var timeoutspeak = null; // tiempo que dura el movimiento de la boca de la animacion 

// ..........................................  Serial setting ............................................................................
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
    pos3 = str.search("%");
    pos4 = str.search("&");
    // saca valor sensor izquierdo
    HCS04_left = parseFloat(str.slice(0, pos1)); 
    // saca valor sensor derecho
    HCS04_right = parseFloat(str.slice(pos2 + 1, pos3)); 
    // saca el valor sensor Central
    HCS04_center = parseFloat(str.slice(pos1 + 1, pos2));
    //console.log(HCS04_left,"-",HCS04_center,"-", HCS04_right); // str.length
    presence = parseFloat(str.slice(pos3 + 1, pos4));
    //console.log(presence);
    count = parseFloat(str.slice(pos4 + 1, str.length));

    // si encuentra a una persona autonomo
    if (presence==1){
        port.write("sto@"); // se detiene y reproduce publicidad
        // iluminacion en verde indicando presencia de personas
        port.write("red0@");
        port.write("gre255@");
        port.write("blu0@");

        var pub_spk = random_num();
        console.log(pub_spk);

        switch (pub_spk){
            case 0:
                TextToSpeech = "no deberia decir nada";
                TextoToVoz(TextToSpeech);
                break;
            case 1:
                cmd.exec('mplayer pub1.mp3', function(error, stdout, stderr){});
                timeoutspeak = 16000;
                setTimeout(sendtimeoutspeak, 1300); // envia el tiempo de movimiento de la boca
                setTimeout(AutoAgain, timeoutspeak + Time_Stop); // reinicia el modo automatico
                break;
            case 2:
                cmd.exec('mplayer pub2.mp3', function(error, stdout, stderr){});
                timeoutspeak = 16000;
                setTimeout(sendtimeoutspeak, 1300); // envia el tiempo de movimiento de la boca
                setTimeout(AutoAgain, timeoutspeak + Time_Stop); // reinicia el modo automatico                
                break;
            case 3:
                cmd.exec('mplayer pub3.mp3', function(error, stdout, stderr){});
                timeoutspeak = 15000;
                setTimeout(sendtimeoutspeak, 1300); // envia el tiempo de movimiento de la boca 
                setTimeout(AutoAgain, timeoutspeak + Time_Stop);  // reinicia el modo automatico    
                break;
            case 4:
                cmd.exec('mplayer pub4.mp3', function(error, stdout, stderr){});
                timeoutspeak = 17000;
                setTimeout(sendtimeoutspeak, 1300); // envia el tiempo de movimiento de la boca  
                setTimeout(AutoAgain, timeoutspeak + Time_Stop);    // reinicia el modo automatico  
                break;
            case 5:
                cmd.exec('mplayer pub5.mp3', function(error, stdout, stderr){});
                timeoutspeak = 22000;
                setTimeout(sendtimeoutspeak, 1300); // envia el tiempo de movimiento de la boca  
                setTimeout(AutoAgain, timeoutspeak + Time_Stop);   // reinicia el modo automatico
                
        }      


    }

    // si no encuentra a nadie
    if (presence==2){
        // color caracteristico
        port.write("red127@");
        port.write("gre127@");
        port.write("blu127@");

        var rnd_value = random_num();
        //console.log(rnd_value);

        switch (rnd_value){
            case 0:
                TextToSpeech = "no deberia decir nada";
                TextoToVoz(TextToSpeech);
                break;
            case 1:
                TextToSpeech = "Hoy de seguro será un día excelente. lo siento en mis circuitos";
                TextoToVoz(TextToSpeech);
                break;
            case 2:
                TextToSpeech = "Hoy amanecí con más ánimo que nunca. Haré lo que mejor se hacer. Ser Feliz";
                TextoToVoz(TextToSpeech);
                break;
            case 3:
                TextToSpeech = "Haré que mi jefe se sienta muy orgulloso de mi. Hoy venderé muchas cosas.";
                TextoToVoz(TextToSpeech);
                break;
            case 4:
                TextToSpeech = "Donde están las personas. Me voy aburrir";
                TextoToVoz(TextToSpeech);
                break;
            case 5:
                TextToSpeech = "Que bien es estar viva y estar enamorada de la vida";
                TextoToVoz(TextToSpeech);
                break;
        }
        

    }

    // si encuentra a alguien y le da problemas
    if (presence==3){

    }

    // indica que ya termino de moverse
    if (presence==100){
        // console.log("ya dejo de moverse");
        port.write("red0@");
        port.write("gre127@");
        port.write("blu255@");

    }

}); //........................................................... end Serial ................................................




// Get process.stdin as the standard input object.
var standard_input = process.stdin;
// Set input character encoding.
standard_input.setEncoding('utf-8');

//Uso de la API TextToSpeech
//credenciales
process.env.GOOGLE_APPLICATION_CREDENTIALS="/home/pi/TextToVoice/Credential_CloudTextVoz.json";
//export GOOGLE_APPLICATION_CREDENTIALS="/home/pi/TextToVoice/CloudTextVoz-3483e20502dd.json"
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech')
// Creates a client
const client = new textToSpeech.v1beta1.TextToSpeechClient( //const client = new textToSpeech.TextToSpeechClient();
    {
        projectId: 'cloudtextvoz',
        keyFilename: '/home/pi/TextToVoice/Credential_CloudTextVoz.json'
      }
); 
const fs = require('fs'); // para trabajar con archivos
var cmd = require('child_process'); // corre comando de consola
var mp3Duration = require('mp3-duration'); // mide la duracion del audio para el movimiento de la boca


// When user input data and click enter key.
standard_input.on('data', function (data) {

    //reprocuion de audio ya definidos.
    if(data.indexOf("presentacion") > -1){ 
        cmd.exec('mplayer presentacion.mp3', function(error, stdout, stderr){});
        timeoutspeak = 12624;
        // envia el tiempo de movimiento de la boca
        setTimeout(sendtimeoutspeak, 1300);
        return;
    }
    if(data.indexOf("publicidad") > -1){ 
        cmd.exec('mplayer publicidad.mp3', function(error, stdout, stderr){});
        timeoutspeak = 9672;
        // envia el tiempo de mobimiento de la boca
        setTimeout(sendtimeoutspeak, 1300);
        return;
    }
    if(data.indexOf("italiano") > -1){ 
        cmd.exec('mplayer italiano.mp3', function(error, stdout, stderr){});
        timeoutspeak = 8424;
        // envia el tiempo de movimiento de la boca
        setTimeout(sendtimeoutspeak, 1300);
        return;
    }
    if(data.indexOf("1") > -1){ 
        TextToSpeech = "epa";
        TextoToVoz(TextToSpeech);
        return;
    }
    if(data.indexOf("3") > -1){ 
        TextToSpeech = "chuta";
        TextoToVoz(TextToSpeech);
        return;
    }
    if(data.indexOf("7") > -1){ 

    }


    if(data.indexOf("8") > -1){ 
        port.write("fon@");
        return;
    }
    if(data.indexOf("6") > -1){ 
        port.write("rig@");
        return;
    }
    if(data.indexOf("4") > -1){ 
        port.write("lef@");
        return;
    }
    if(data.indexOf("2") > -1){ 
        port.write("bac@");
        return;
    }
    if(data.indexOf("5") > -1){ 
        port.write("red0@");
        port.write("gre0@");
        port.write("blu255@");
        port.write("sto@");
        autonomo = false;
        return;
    }
    if(data.indexOf("0") > -1){ 
        port.write("aut@");
        console.log("Modo-Autonomo");
        port.write("red0@");
        port.write("gre127@");
        port.write("blu255@");
        autonomo = true;
        return;
    }
    if(data.indexOf("normal") > -1){ 
        port.write("red0@");
        port.write("gre0@");
        port.write("blu255@");
        //expresion
        timeoutspeak = 100;
        if (clientWebsocket.readyState == 1) { // confirma que esta conectado
            clientWebsocket.send(JSON.stringify({
            action: "normalface",
            timeout: timeoutspeak 
           }));
        }
        return;
    }
    if(data.indexOf("sad") > -1){ 
        //port.write("sto@");
        return;
    }
    if(data.indexOf("happy") > -1){ 
        port.write("red0@");
        port.write("gre0@");
        port.write("blu255@");
        return;
    }
    if(data.indexOf("angry") > -1){ 
        port.write("red255@");
        port.write("gre0@");
        port.write("blu0@");
        timeoutspeak = 111;
        //expresion
        if (clientWebsocket.readyState == 1) { // confirma que esta conectado
            clientWebsocket.send(JSON.stringify({
            action: "angryface",
            timeout: timeoutspeak 
           }));
        }
        return;
    }
    if(data.indexOf("suprised") > -1){ 
        //port.write("sto@");
        return;
    }
    if(data.indexOf("?") > -1){ 
        console.log("***** commands *****");
        console.log("presentacion");
        console.log("publicidad");
        console.log("italiano");
        console.log("normal");
        console.log("sad");
        console.log("angly");
        console.log("happy");
        console.log("suprised");
        console.log("exit");
        //console.log("");
        console.log("***** move *********");
        console.log("8 --> fw");
        console.log("2 --> rw");
        console.log("6 --> r");
        console.log("4 --> l");
        console.log("5 --> stop");
        console.log("0 --> auto");
        return;
    }
    if(data.indexOf("exit") > -1){ 
        // Program exit.
        port.write("red0@");
        port.write("gre0@");
        port.write("blu255@");
        port.write("sto@");
        console.log("program exit...");
        process.exit();
    }else
    { 
        // llama la funcion para que reproduzca el texto
        TextToSpeech = data;
        TextoToVoz(TextToSpeech);

    } // end else
});


const WebSocketClient= require('ws')
const url = 'ws://localhost:8080' 
const clientWebsocket = new WebSocketClient(url)

clientWebsocket.on('close', function() {
    console.log('The client has disconnected!');
});



clientWebsocket.on('open', function() {
    console.log('Client has connected to the server!');
    // Prompt user to input data in console.
    console.log("Please input text to say");
    
});

function sendtimeoutspeak() {
    if (clientWebsocket.readyState == 1) { // confirma que esta conectado
       
        clientWebsocket.send(JSON.stringify({
        id: "2",
        action: "hablar",
        timeout: timeoutspeak 
       }));
       
    }
}

function AutoAgain() {
    // retoma el modo automatico para buscar personas
    port.write("aut@");
    // ilumina en Azul modo stanby
    port.write("red0@");
    port.write("gre127@");
    port.write("blu255@");
    return;
}

function random_num(){
    if(rnd == true){
        p = -1;  // para que cuando incremente inicie en 0
        rnd = false;   
        lista2 = lista.sort(function() {return Math.random() - 0.5});
        //console.log(lista2); 
    }
    //console.log(lista2[p]);
    p++;
    if(p==lista2.length-1){
        rnd = true;
    }
    return lista2[p]; // regresa un numero del 1 al 5 sin que se repita
}



function TextoToVoz(data) {
     //**************************************** USA LA API ************************************************
        //console.log("dijo" + data);
       // TextToSpeech = data;
        // Construct the request
        const request = {
            input: {text: data}, // data --> TextToSpeech
            // Select the language and SSML Voice Gender (optional)
            voice: {languageCode: "es-ES", name: "es-ES-Standard-A"}, //"es-ES"  "it-IT"
            // Select the type of audio encoding
            audioConfig: {audioEncoding: 'MP3'},
        };
        
        // Performs the Text-to-Speech request
        client.synthesizeSpeech(request, (err, response) => {
            if (err) {
            console.error('ERROR:', err);
            return;
            }
        
            // Write the binary audio content to a local file
            //if you don’t rename this file it will be overwritten by the next API call.
            fs.writeFile('output.mp3', response.audioContent, 'binary', err => {
                if (err) {
                    console.error('ERROR:', err);
                    return;
                }
                //console.log('ready: output.mp3');
                mp3Duration('output.mp3', function (err, duration) {// indica el tiempo del MP3
                    if (err) return console.log(err.message);
                    console.log(duration);
                    var timeSpk = duration.toFixed(2); // solo usamos 2 decimales
                    var str = timeSpk.toString(); // le quita el punto al valor en segundos
                    var quitar = ".";
                    var poner = "";
                    var n = str.replace(quitar,poner);
                    var timeSpkInt = parseInt(n); // lo convierte en un numero entero 
                    timeoutspeak = timeSpkInt*10; // lo multiplica por x porque necesito milisegundos
                    
                    console.log('duration is ' + timeoutspeak + 's');
                });
                
                if (timeoutspeak > 500){ // habla solo si el tiempo del audio es mamyor a 500ms, para evitar errores
                    // envia el tiempo de movimiento de la boca
                    setTimeout(sendtimeoutspeak, 1300); // tiene un retardo para darle tiempo de generar el archivo de audio
                    //sendtimeoutspeak();
                    cmd.exec('mplayer output.mp3', function(error, stdout, stderr){}); // reproduce el audio
                }
            });
        }); //**********************************************************************************************
}




