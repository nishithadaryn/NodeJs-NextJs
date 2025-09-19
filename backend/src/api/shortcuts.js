// shortcuts.js
import { calculateRowByCol, detectWinner, markWinner } from "../board.js";
import { PlayerEnum } from "../constants.js";

/**
 * Apply a move to the game board, handle winner or draw.
 * @param {Object} game - The game object
 * @param {number} col - The column to place the move
 */
export function makeMove(game, col) {
  // Calculate the row for the move
  const row = calculateRowByCol(game.board, col);
  const moveValue = game.nextPlayerToMoveSign;

  // Apply the move
  game.board[row][col] = moveValue;

  // Record the move
  const move = { row, col, val: moveValue };
  game.moves.push(move);
  game.moveNumber += 1;

  // Check for winner
  const winner = detectWinner(game.board);
  if (winner) {
    markWinner(game.board, winner);
    game.winner = PlayerEnum[winner]; // assumes PlayerEnum is an object like { X: 'X', O: 'O' }
    game.finishedAt = new Date().toISOString();
  } else if (game.moveNumber === game.board.length * game.board[0].length) {
    // Draw
    game.winner = null;
    game.finishedAt = new Date().toISOString();
  }
}
