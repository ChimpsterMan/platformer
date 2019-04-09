var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var colors = ['#800000', '#808000', '#008000', '#000080', '#800080'],
    users = [], online = 0, colorChoice = 0;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('newconnection', function(username){
    if (username == null || username == undefined){
      
    } else {
      console.log(username + ' has connected');
      online += 1;
      colorChoice += 1;
      socket.username = username;
      users.push(username);
      socket.emit('setup', colors[(colorChoice-1)%colors.length]);
      socket.join('lobby');
      io.sockets.emit('updateOnline', online);
    }
  });
  
  socket.on('disconnect', function(){
    console.log(socket.username + ' has disconnected');
    delete users[socket.username];
    io.sockets.in('lobby').emit('disconnection', socket.username);
    
    online -= 1;
    io.sockets.emit('updateOnline', online);
  });
  
  socket.on('move', function(room, name, color, x, y){
    io.sockets.in(room).emit('newMove', name, color, x, y);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});



