var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 9090 });
var connections = [];
var users = {};
var connectionsToSend

wss.on('connection', function (connection) {
    //connection.send('Start!!!');
    connections.push(connection);
    connection.on('message', messageData => {
        const message = JSON.parse(messageData);
        connectionsToSend = connections;

        if (message.type === 'enter') {
            if (!message.data.name || !message.data.nik) {
                message.type = 'error';    
            } else {
                users[message.data.nik] = message.data.name;
                connection.name = message.data.nik;
            }
        }

        message.users = users;
        messageData = JSON.stringify(message);
        connectionsToSend.forEach(connect => {
            connect.send(messageData, error => {
                if (error) {
                    connections = connections.filter(current => {
                        return current !== connect;
                    });
                }
            });
        });
        
    });
    connection.on('close', () => {
        delete users[connection.name];
        let message = {type: 'close'}
        message.users = users;
        messageData = JSON.stringify(message);
        connectionsToSend.forEach(connect => {
            connect.send(messageData, error => {
                if (error) {
                    connections = connections.filter(current => {
                        return current !== connect;
                    });
                }
            });
        });
        console.log(connection.name);
        connections = connections.filter((current, i) => {            
            return current !== connection;
        });

        console.log('close connection');
    });
    connection.on('error', function () {
        
    });
});