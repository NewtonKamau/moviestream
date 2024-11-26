const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  const { roomId, userId } = socket.handshake.query;

  // Join room
  socket.join(roomId);
  
  // Add user to room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(userId);

  // Broadcast updated viewers list
  io.to(roomId).emit('viewersUpdate', Array.from(rooms.get(roomId)));

  // Handle chat messages
  socket.on('message', (message) => {
    io.to(roomId).emit('message', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const room = rooms.get(roomId);
    if (room) {
      room.delete(userId);
      if (room.size === 0) {
        rooms.delete(roomId);
      } else {
        io.to(roomId).emit('viewersUpdate', Array.from(room));
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
