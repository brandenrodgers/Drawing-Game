
module.exports = function(socket){

  socket.emit('init', {
    message: "Socket Connection is Working"
  });

  socket.on('player:joined', function(data) {
    socket.broadcast.emit('new:player', {
      username: data.username,
    });
  });

  socket.on('game:startclick', function(data) {
    socket.broadcast.emit('game:started', {
      gamePlayers: data.gamePlayers,
    });
  });

  socket.on('game:nextclick', function(data) {
    socket.broadcast.emit('game:next', {
      username: data.username,
      round: data.round
    });
  });

};