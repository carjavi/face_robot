/**
 * face robot
 *
 * @author Carlos Briceño
 * @originalAuthor Patrik Melander (lotAballs).
 *
 * MIT License
 */
 
  const express      = require('express');
  const http         = require('http');
  const url          = require('url');
  const WebSocket    = require('ws');
  var wsocket = null;

  /**
  * Inicia servicio web para mostrar UI
  *
  * @method iniciarUI
  */
 iniciarUI = () => {
    log.info("Iniciando UI")

    var app = express();
    app.use(express.static('ui'));
    app.use('/static/css', express.static(config.sentidos.cara.directorioUI+'/build/static/css'));
    app.use('/static/js', express.static(config.sentidos.cara.directorioUI+'/build/static/js'));
    app.use('/static/media', express.static(config.sentidos.cara.directorioUI+'/build/static/media'));

    app.get('/', function (req, res) {
      res.sendFile("build/index.html", { root: config.sentidos.cara.directorioUI });
    });
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
      wsocket = ws;
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });

      //updateUI({"tipo":"estado","data":"conectado"})
    });
    server.listen(8080, function listening() {
      log.info('Escuchando en puerto '+server.address().port)
    });
  }