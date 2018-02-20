
var fs = require('fs')
  , express = require('express')
  , app = express()
  , http = require('http')
  , https = require('https')

var server = https.createServer({
    key: fs.readFileSync('./server-key.pem'),
    cert: fs.readFileSync('./server-cert.pem'),
    requestCert: false,
    rejectUnauthorized: false
},app);

var f='Chatlog.txt'; // for saving chat in text format  
var io = require('socket.io').listen(server);
var serverPort = 8080;
var localhost = 'localhost';

server.listen(serverPort,localhost, function(){
  console.log('listening on *:' + localhost + ' : '+ serverPort);
  console.log('Type at Google Chrome address bar: https://'+ localhost + ':'+ serverPort);
  console.log('To stop server type at terminal: $ Ctrl + c');
});

// routing
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/speech-to-text.html');
});

// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (socket) {

  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {
    // we tell the client to execute 'updatechat' with 2 parameters
    io.sockets.emit('updatechat', socket.username, data);
    var newDate = new Date().toLocaleString();
    var msg = 'USER: '+socket.username+ '\tTime: '+ newDate + '\tMSG: ' + data;
	fs.appendFile(f, msg+ "\n",function(err){
	  if(err)
	    console.error(err);
	});
    console.log(msg);
  });

  // when the client emits 'adduser', this listens and executes
  socket.on('adduser', function(username){
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    // echo to client they've connected
    socket.emit('updatechat', 'SERVER', 'you have connected');
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
    // update the list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});
