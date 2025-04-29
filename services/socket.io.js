import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

const userSocketMap = new Map(); // Stores userId => Set of socketIds

//====================================================================================================================//
// Get a user's socket IDs
export function getReceiverSocketIds(userId) {
  return userSocketMap.get(userId) || new Set();
}

//====================================================================================================================//
// Socket.IO Connection Handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId) {
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId).add(socket.id);
    console.log(`Mapped user ${userId} to socket ${socket.id}`);
  }

  // Handle joining rooms
  socket.on("join", (roomID) => {
    socket.join(roomID);
    console.log(`User ${socket.id} joined room: ${roomID}`);
  });
  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    for (const [userId, socketIds] of userSocketMap.entries()) {
      if (socketIds.has(socket.id)) {
        socketIds.delete(socket.id);
        console.log(`Removed socket ${socket.id} for user ${userId}`);
        if (socketIds.size === 0) {
          userSocketMap.delete(userId);
        }
        break;
      }
    }
  });

  // Handle errors
  socket.on("error", (err) => {
    console.error(`Socket.IO Error: ${err.message}`);
  });
});

export { io, app, server };
