// backend/api/connectionManager.js
import { Server } from "socket.io";

class ConnectionManager {
  constructor() {
    // game_id -> { players: [socket, ...] }
    this.games = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(",") || ["*"],
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log("⚡ New client connected:", socket.id);

      socket.on("join_game", (gameId) => {
        this.connect(socket, gameId);
      });

      socket.on("disconnect", () => {
        this.disconnect(socket);
      });
    });
  }

  connect(socket, gameId) {
    if (!this.games.has(gameId)) {
      this.games.set(gameId, { players: [] });
    }

    const game = this.games.get(gameId);
    game.players.push(socket);

    socket.join(gameId);
    console.log(`✅ Player ${socket.id} joined game ${gameId}`);
  }

  disconnect(socket) {
    for (const [gameId, game] of this.games.entries()) {
      game.players = game.players.filter((s) => s.id !== socket.id);
      if (game.players.length === 0) {
        this.games.delete(gameId);
      }
    }
    console.log(`❌ Player ${socket.id} disconnected`);
  }

  broadcastGame(game) {
    const gameId = game.id.toString();
    const jsonData = JSON.stringify(game);

    this.io.to(gameId).emit("game_update", jsonData);
    console.log(`📢 Broadcast to game ${gameId}`);
  }
}

export const connectionManager = new ConnectionManager();
