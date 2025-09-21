// crud.js
import { MongoClient, ObjectId } from "mongodb";
import { Game } from "./models.js";
import { PyObjectId } from "./fields.js";

// -------------------- Initialize Board -------------------- //
// For example, a 3x3 tic-tac-toe board
function initBoard() {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
}

// -------------------- MongoDB Client -------------------- //
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "game_db";

let client;
async function getClient() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}

// -------------------- CRUD OPERATIONS -------------------- //

// Start a new game
export async function startNewGame(player1) {
  const db = await getClient();
  const gameData = new Game({ player1, board: initBoard() });
  const result = await db.collection(Game.collectionName).insertOne(gameData);
  return getGameById(result.insertedId);
}

// Get game by ID
export async function getGameById(id) {
  const db = await getClient();
  const objId = PyObjectId.validate(id);
  const gameData = await db.collection(Game.collectionName).findOne({ _id: objId });
  if (!gameData) return null;
  return new Game({ ...gameData, id: gameData._id });
}

// List all games
export async function listGamesFromDb() {
  const db = await getClient();
  const games = await db.collection(Game.collectionName).find({}).toArray();
  return games.map((g) => new Game({ ...g, id: g._id }));
}

// Delete all games
export async function deleteGamesFromDb() {
  const db = await getClient();
  const result = await db.collection(Game.collectionName).deleteMany({});
  return result.deletedCount;
}

// Join a game
export async function joinNewGame(game, player2) {
  const gameData = { ...game, player2 };
  return updateGame(game.id, gameData);
}

// Update a game
export async function updateGame(gameId, gameData) {
  const db = await getClient();
  const objId = PyObjectId.validate(gameId);
  await db.collection(Game.collectionName).updateOne(
    { _id: objId },
    { $set: gameData }
  );
  return getGameById(objId);
}
