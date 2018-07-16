var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({ port: 9090 });

wss.on('connection', function (connection) {
    connection.send('Start!!!');
});