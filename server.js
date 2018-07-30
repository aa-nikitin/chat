var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 9090 });
const mongoClient = require("mongodb").MongoClient; 
var fs = require("fs");
const url = "mongodb://user:qqqq0000@ds113713.mlab.com:13713/chat";

mongoClient.connect(url, function(err, client){
    if(err) return console.log(err);

    

    startWebSocketServer(client);
});

function startWebSocketServer(client){
    const db = client.db("chat");
    const collectionUsers = db.collection("users");
    var connections = [];
    var users = {};
    var connectionsToSend;
    console.log(collectionUsers);

    wss.on('connection', function (connection) {
        //console.log(connection);

        connections.push(connection);
        connection.on('message', messageData => {
            const message = JSON.parse(messageData);
            connectionsToSend = connections;
            collectionUsers.findOne({nik: message.data.nik}, function(err, result){
                
                if (message.type === 'enter') {
                    for (let i in message.valid) {
                        let valueField = message.data[message.valid[i]];
                        if (message.valid[i] === 'nik' && users[valueField]) {
                            message.valid[i] = 'Такой пользователь авторизован'; 
                            message.type = 'error'; 
                        } else
                        if (!message.data[message.valid[i]]) {
                            message.valid[i] = 'Заполните поле'; 
                            message.type = 'error';   
                        } else {
                            message.valid[i] = 1;
                        }
                        //console.log(message.valid[i]);
                    }
                    if (message.type !== 'error') {
                        users[message.data.nik] = message.data.name;
                        connection.name = message.data.nik;
                        if (result) {
                            message.data.photo = result.photo;
                            console.log(result.photo);
                        } else {
                            collectionUsers.insertOne(message.data, function(err, result){
                                if(err){ 
                                    return console.log(err);
                                }
                            });
                        }                        
                    }
                }

                if (message.type === 'restoreEnter') {
                    users[message.data.nik] = message.data.name;
                    connection.name = message.data.nik;    
                }

                if (message.type === 'fileload') {
                    console.log(result);
                    if (message.f) {
                        var img = message.f.replace(/^data:image\/\w+;base64,/, "");
                        var buf = new Buffer(img, 'base64');
                        fs.writeFile(`./src/photo/${message.data.nik}.jpg`, buf);
                        message.photo = `./src/photo/${message.data.nik}.jpg`; 
                        collectionUsers.updateOne(
                            {nik: `${message.data.nik}`}, 
                            { $set: {photo: `/src/photo/${message.data.nik}.jpg`}},
                            function(err, result) {
                                   
                            }
                        );   
                    } else {
                        message.type = 'error'; 
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
            
        });
        connection.on('close', () => {
            delete users[connection.name];
            let message = {type: 'close'}
            message.users = users;
            messageData = JSON.stringify(message);
            console.log(connectionsToSend);
            if (connectionsToSend) {
                connectionsToSend.forEach(connect => {
                    connect.send(messageData, error => {
                        if (error) {
                            connections = connections.filter(current => {
                                return current !== connect;
                            });
                        }
                    });
                });
            }
            
            console.log(connection.name);
            connections = connections.filter((current, i) => {            
                return current !== connection;
            });

            console.log('close connection');
        });
        connection.on('error', function () {
            
        });
    });
}