const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is running ✅');
});

io.on('connection', (socket) => {
  console.log(`✅ مستخدم متصل: ${socket.id}`);

  socket.on('joinRoom', (username) => {
    socket.username = username;
    io.emit('chatMessage', { user: "📢", message: `${username} انضم إلى الغرفة!` });
  });

  socket.on('sendMessage', (msg) => {
    io.emit('chatMessage', { user: socket.username, message: msg });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('chatMessage', { user: "📢", message: `${socket.username} غادر الغرفة.` });
    }
    console.log(`❌ مستخدم انفصل: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 السيرفر شغال على المنفذ ${PORT}`);
});
