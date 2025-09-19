import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import {
  startNewGame,
  listGamesFromDb,
  getGameById,
  deleteGamesFromDb,
  joinNewGame,
  updateGame,
} from "./src/api/crud.js";
import { validateMove } from "./src/api/validators.js";
import { makeMove } from "./src/api/shortcuts.js";

const app = express();

// ======================== CORS MIDDLEWARE ======================== //
// Must match frontend exactly (no trailing slash)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json()); // JSON parser

// ======================== HTTP + SOCKET.IO ======================== //
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: "http://localhost:3000", // ✅ no trailing slash
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

// ======================== REST ENDPOINTS ======================== //

// Start a new game
app.post("/games", async (req, res) => {
  const { player } = req.body;
  const game = await startNewGame(player);

  if (!game) {
    return res.status(500).json({ detail: "Game cannot be started right now, please try again later" });
  }

  res.json(game);
});

// List all games
app.get("/games", async (req, res) => {
  const games = await listGamesFromDb();
  res.json(games);
});

// Get a game by ID
app.get("/games/:gameId", async (req, res) => {
  const game = await getGameById(req.params.gameId);
  if (!game) return res.status(404).json({ detail: "Game not found" });
  res.json(game);
});

// Delete all games
app.delete("/games", async (req, res) => {
  const deletedCount = await deleteGamesFromDb();
  res.json({ deleted_count: deletedCount });
});

// Join a game
app.post("/games/:gameId/join", async (req, res) => {
  const game = await getGameById(req.params.gameId);
  if (!game) return res.status(404).json({ detail: "Game not found" });
  if (game.player2) return res.status(400).json({ detail: "Game already started" });

  const updatedGame = await joinNewGame(game, req.body.player);
  if (!updatedGame) {
    return res.status(500).json({ detail: "Game cannot be joined right now, please try again later" });
  }

  // broadcast update
  io.to(req.params.gameId).emit("game_update", updatedGame);
  res.json(updatedGame);
});

// ======================== WEBSOCKET ======================== //
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join_game", async ({ gameId }) => {
    socket.join(gameId);
    console.log(`Socket ${socket.id} joined game ${gameId}`);
  });

  socket.on("make_move", async ({ gameId, col }) => {
    let game = await getGameById(gameId);
    if (!game) return socket.emit("error", "Game not found");

    const moveError = validateMove(game, { col });
    if (moveError) return socket.emit("error", moveError);

    makeMove(game, col);
    const updatedGame = await updateGame(game.id, game);

    io.to(gameId).emit("game_update", updatedGame);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ======================== START SERVER ======================== //
const PORT = process.env.PORT || 8000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
