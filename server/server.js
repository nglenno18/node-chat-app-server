//set up this server to set up the PUBLIC DIRECTORY
const path = require('path');   //built in mod, no need to install
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
console.log(`__dirname, ../public \n\t ${publicPath}`);

var app = express();
var server = http.createServer(app);  //now using the http server INSTEAD of express
var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', function(socket){ //reps indiv socket rather than all users connected to the server
  console.log(`\n\nNew User Connected:    ${socket.id}\n`);

  socket.emit('newMessage',
              generateMessage(`ADMIN: ${port}\n`,
                              `\tHello, USER(${socket.id})! \tWelcome to the Message App! `));
  //   from:`ADMIN: ${port}`,
  //   text: `Hello, USER(${socket.id})! \tWelcome to the Message App! `,
  //   createdAt: new Date().getTime()
  // });
  socket.broadcast.emit('newMessage', generateMessage(`ADMIN: ${port}`,`Attention all USERS! \tNew User: ${socket.id}`));
  //   from:`ADMIN: ${port}`,
  //   text: `Attention all USERS! \tNew User: ${socket.id}`,
  //   createdAt: new Date().getTime()
  // });

  socket.on('createMessage', function(createdMessage, callback){
    console.log('createMessage', createdMessage);

    io.emit('newMessage', generateMessage(createdMessage.from, createdMessage.text));
    callback('This is from the server, firing a callback after emitting the created message from a user');
    // io.emit('newMessage', { //createdMessage
    //   from: createdMessage.from,
    //   text: createdMessage.text,
    //   createdAt: new Date().getTime() //generated by server to prevent spoofing
    // });
  });

  socket.on('disconnect', function(){ //'disconnect' is the event to listen to
    console.log(`CLIENT: ${socket.id} was DISCONNECTED from server`);
  });
});

server.listen(port, function(){
  console.log(`Connected to Server on PORT ${port}`);
});
