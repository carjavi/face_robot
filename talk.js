

// Get process.stdin as the standard input object.
var standard_input = process.stdin;
// Set input character encoding.
standard_input.setEncoding('utf-8');
// Prompt user to input data in console.
console.log("Please input text to say");

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

    // User input exit.
    if(data.indexOf("pb1") > -1){ 
        cmd.exec('mplayer TalkEnglish.wav', function(error, stdout, stderr){});
        console.log("test otro comando");
        return;
    }
    if(data.indexOf("exit") > -1){ 
        // Program exit.
        console.log("program exit...");
        process.exit();
    }else
    { //**************************************** USA LA API ************************************************
        // Print user input in console.
        //console.log("dijo" + data);
        // Construct the request
        const request = {
            input: {text: data},
            // Select the language and SSML Voice Gender (optional)
            voice: {languageCode: "it-IT"}, //  voice: {languageCode: "es-ES", name: "es-ES-Standard-A"},
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
                    console.log('duration is ' + duration + 's');
                });
                cmd.exec('mplayer output.mp3', function(error, stdout, stderr){}); // reproduce el audio
                
            });
        });

    } //**********************************************************************************************
});






