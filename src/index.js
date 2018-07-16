const socket = new WebSocket("ws://localhost:9090");
console.log(socket);

socket.addEventListener('message', function(event) {
    //const message = JSON.parse(event.data);
    console.log(event.data);
});
