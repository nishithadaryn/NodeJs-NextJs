// models.js
import Joi from "joi";

// -------------------- ENUMS -------------------- //
export const PlayerEnum = {
  PLAYER1: 1,
  PLAYER2: 2,
};

// -------------------- MODELS -------------------- //

// Game move
export class Move {
  constructor({ row, col, val }) {
    this.row = row;
    this.col = col;
    this.val = val;
  }
}

// Input for making a move
export class MoveInput {
  constructor({ player, col }) {
    this.player = player;
    this.col = col;
  }

  static schema = Joi.object({
    player: Joi.string().required(),
    col: Joi.number().integer().min(0).required(),
  });

  static validate(data) {
    const { error, value } = this.schema.validate(data);
    if (error) return { error: error.message, value: null };
    return { error: null, value: new MoveInput(value) };
  }
}

// Input to start a game
export class StartGame {
  constructor({ player }) {
    this.player = player;
  }

  static schema = Joi.object({
    player: Joi.string().max(20).required(),
  });

  static validate(data) {
    const { error, value } = this.schema.validate(data);
    if (error) return { error: error.message, value: null };
    return { error: null, value: new StartGame(value) };
  }
}

// Main Game model
export class Game {
  constructor({ id, player1, player2 = null, board, moves = [], moveNumber = 1, winner = null, finishedAt = null, createdAt = new Date(), updatedAt = new Date() }) {
    this.id = id; // string (MongoDB ObjectId)
    this.player1 = player1;
    this.player2 = player2;
    this.board = board; // 2D array
    this.moves = moves;
    this.moveNumber = moveNumber;
    this.winner = winner;
    this.finishedAt = finishedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get nextPlayerToMoveUsername() {
    return this.moveNumber % 2 ? this.player1 : this.player2;
  }

  get nextPlayerToMoveSign() {
    return this.moveNumber % 2 ? PlayerEnum.PLAYER1 : PlayerEnum.PLAYER2;
  }

  static collectionName = "games";
}
