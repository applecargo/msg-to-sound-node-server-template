//test server

//https WWW server @ port 5999
var http = require('http');
var express = require('express');
var app = express();
var httpWebServer = http.createServer(app).listen(5999, function () {
  console.log('[express] listening on *:5999');
});
//express configuration
app.use(express.static('public'));

//socket io server configuration
var io = require('socket.io')(httpWebServer, {'pingInterval': 1000, 'pingTimeout': 3000});
io.on('connection', function(socket){
  //
  console.log('an instrument user connected');
  
  //msg. for everybody (except sender) - oneshot sounds
  socket.on('sound', function(msg) {
    socket.broadcast.emit('sound', msg); // sending to all clients except sender
    console.log('sound :' + msg);
  });
  //msg. for everybody (except sender) - notes
  socket.on('sing-note', function(msg) {
    socket.broadcast.emit('sing-note', msg); // sending to all clients except sender
    console.log('sing-note :' + msg);
  });
  
  //
  socket.on('disconnect', function(){
    console.log('an instrument user disconnected');
  });
});


// //// propagate messages from mobmuplat singer app. to everyone in server io's main namespace '/'
// //// osc.js/udp service
// var osc = require("osc");

// var udp_sc = new osc.UDPPort({
//   localAddress: "0.0.0.0",
//   localPort: 59999,
//   metadata: true
// });

// //message handler
// udp_sc.on("message", function (oscmsg, timetag, info) {
//   console.log("[udp] got osc message:", oscmsg);

//   //EX)
//   // //method [1] : just relay as a whole
//   // io.emit('osc-msg', oscmsg); //broadcast
//   //EX)
//   // //method [2] : each fields
//   // io.emit('osc-address', oscmsg.address); //broadcast
//   // io.emit('osc-type', oscmsg.type); //broadcast
//   // io.emit('osc-args', oscmsg.args); //broadcast
//   // io.emit('osc-value0', oscmsg.args[0].value); //broadcast

//   //just grab i need.. note!
//   io.emit('sing-note', oscmsg.address); //broadcast to the main namespace '/'
  
//   //EX)
//   // const io = require('socket.io')();
//   // io.emit('an event sent to all connected clients'); // main namespace
//   //EX)
//   // const chat = io.of('/chat');
//   // chat.emit('an event sent to all connected clients in '/chat' namespace');

// });
// //open port
// udp_sc.open();
// udp_sc.on("ready", function() {
//   console.log("[udp] ready... - 0.0.0.0:", udp_sc.options.localPort);
// });
