
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'dist')));

// Game Rooms State
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', ({ playerName, avatar }) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const player = {
      id: socket.id,
      name: playerName,
      avatar: avatar,
      points: 0,
      hand: [],
      isHost: true
    };
    
    rooms.set(roomId, {
      id: roomId,
      players: [player],
      status: 'lobby',
      deck: [],
      table: [],
      turn: 0,
      round: 1
    });

    socket.join(roomId);
    socket.emit('roomCreated', { roomId, room: rooms.get(roomId), player });
  });

  socket.on('joinRoom', ({ roomId, playerName, avatar }) => {
    const room = rooms.get(roomId);
    if (!room) {
      return socket.emit('error', 'Room not found');
    }
    if (room.status !== 'lobby') {
      return socket.emit('error', 'Game already started');
    }
    
    const player = {
      id: socket.id,
      name: playerName,
      avatar: avatar,
      points: 0,
      hand: [],
      isHost: false
    };

    room.players.push(player);
    socket.join(roomId);
    io.to(roomId).emit('playerJoined', { player, room });
    socket.emit('joinedRoom', { room, player, playerId: socket.id });
  });

  socket.on('startGame', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || socket.id !== room.players[0].id) return;

    room.status = 'playing';
    // Logic to initialize deck and deal cards would go here
    io.to(roomId).emit('gameStarted', { room });
  });

  socket.on('sendReaction', ({ roomId, emoji }) => {
    const room = rooms.get(roomId);
    const player = room?.players.find(p => p.id === socket.id);
    if (player) {
      io.to(roomId).emit('playerReaction', { playerId: socket.id, playerName: player.name, emoji });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Handle player removal from rooms
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
