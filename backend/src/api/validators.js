// validators.js
import { calculateRowByCol, isValidMove } from "../board.js";
import {
  CustomError,
  GameFinishedError,
  GameNotFoundError,
  MoveNotValidError,
  NotAllPlayersJoinedError,
  WrongPlayerToMoveError,
} from "./exceptions.js";

/**
 * Validate both the game state and the move.
 * Returns an error string if invalid, otherwise null.
 */
export function validate(game, move) {
  try {
    validateGame(game);
    validateMove(game, move);
  } catch (err) {
    if (err instanceof CustomError) {
      return err.message;
    }
    throw err; // rethrow unexpected errors
  }
  return null;
}

/**
 * Check if the game itself is valid for moves.
 */
export function validateGame(game) {
  if (!game) {
    throw new GameNotFoundError();
  }

  if (!game.player2) {
    throw new NotAllPlayersJoinedError();
  }

  if (game.finishedAt) {
    throw new GameFinishedError();
  }
}

/**
 * Check if a move is valid.
 */
export function validateMove(game, move) {
  if (!move) {
    throw new MoveNotValidError();
  }

  if (move.player !== game.nextPlayerToMoveUsername) {
    throw new WrongPlayerToMoveError();
  }

  const row = calculateRowByCol(game.board, move.col);
  if (!isValidMove(game.board, row, move.col)) {
    throw new MoveNotValidError();
  }
}
