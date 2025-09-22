import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";

import {
  startNewGame,
  listGamesFromDb,
  getGameById,
  joinNewGame,
  updateGame,
} from "./src/api/crud.js";
import { validateMove } from "./src/api/validators.js";
import { makeMove } from "./src/api/shortcuts.js";

dotenv.config();

const app = express();

// ===== CORS =====
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options("*", cors());

// ===== JSON parser =====
app.use(express.json());

// ===== HTTP + Socket.IO =====
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
  path: "/socket.io",
});

// ===== REST ENDPOINTS =====

// Start a new game
app.post("/games", async (req, res) => {
  const { player } = req.body;
  const game = await startNewGame(player);
  if (!game) return res.status(500).json({ detail: "Game cannot be started" });
  res.json(game);
});

// List all games
app.get("/games", async (req, res) => {
  const games = await listGamesFromDb();
  res.json(games);
});

// Get a single game by ID
app.get("/games/:gameId", async (req, res) => {
  const game = await getGameById(req.params.gameId);
  if (!game) return res.status(404).json({ detail: "Game not found" });
  res.json(game);
});

// Join a game
app.post("/games/:gameId/join", async (req, res) => {
  const game = await getGameById(req.params.gameId);
  if (!game) return res.status(404).json({ detail: "Game not found" });
  if (game.player2) return res.status(400).json({ detail: "Game already started" });

  const updatedGame = await joinNewGame(game, req.body.player);

  // Notify all players in this game that it has started
  io.to(req.params.gameId).emit("game_update", updatedGame);

  res.json(updatedGame);
});

// ===== Socket.IO =====
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join_game", ({ gameId }) => {
    socket.join(gameId);
    console.log(`Socket ${socket.id} joined game ${gameId}`);
  });

  socket.on("make_move", async ({ gameId, col }) => {
    const game = await getGameById(gameId);
    if (!game) return socket.emit("error", "Game not found");

    const moveError = validateMove(game, { col });
    if (moveError) return socket.emit("error", moveError);

    makeMove(game, col);
    const updatedGame = await updateGame(game.id, game);

    io.to(gameId).emit("game_update", updatedGame);
  });

  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

// ===== Start server =====
const PORT = process.env.PORT || 8000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
