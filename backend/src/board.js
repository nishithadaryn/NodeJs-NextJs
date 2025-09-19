// backend/src/game/board.js
import { N, M, TARGET, PlayerEnum } from "./constants.js";

// Direction factory (similar to dataclass)
class Direction {
  constructor(name, condition, fn, moveCondition, moveRowCol) {
    this.name = name;
    this.condition = condition;
    this.fn = fn;
    this.moveCondition = moveCondition;
    this.moveRowCol = moveRowCol;
  }
}

export const DIRECTIONS = [
  new Direction(
    "down",
    (row, _) => row < 3,
    (board, row, col, i) => board[row + i][col],
    (row, col, i) => row + i < N,
    (row, col, i) => [row + i, col]
  ),
  new Direction(
    "right",
    (_, col) => col <= 3,
    (board, row, col, i) => board[row][col + i],
    (row, col, i) => col + i < M,
    (row, col, i) => [row, col + i]
  ),
  new Direction(
    "left down",
    (row, col) => row <= 2 && col >= 3,
    (board, row, col, i) => board[row + i][col - i],
    (row, col, i) => row + i < N && col - i >= 0,
    (row, col, i) => [row + i, col - i]
  ),
  new Direction(
    "right down",
    (row, col) => row <= 2 && col <= 3,
    (board, row, col, i) => board[row + i][col + i],
    (row, col, i) => row + i < N && col + i < M,
    (row, col, i) => [row + i, col + i]
  ),
];

// Init board
export function initBoard() {
  return Array.from({ length: N }, () =>
    Array.from({ length: M }, () => PlayerEnum.EMPTY)
  );
}

// Find row for a column
export function calculateRowByCol(board, col) {
  if (col < 0 || col >= M) return null;
  for (let row = N - 1; row >= 0; row--) {
    if (board[row][col] === PlayerEnum.EMPTY) {
      return row;
    }
  }
  return null;
}

// Validate a move
export function isValidMove(board, row, col) {
  if (row == null || col == null) return false;
  if (row < 0 || row >= N || col < 0 || col >= M) return false;
  if (board[row][col] !== PlayerEnum.EMPTY) return false;
  return row === N - 1 || board[row + 1][col] !== PlayerEnum.EMPTY;
}

// Detect winner
export function detectWinner(board) {
  function checkDirections(row, col) {
    const value = board[row][col];
    for (const direction of DIRECTIONS) {
      if (direction.condition(row, col)) {
        let found = true;
        for (let i = 1; i < TARGET; i++) {
          if (direction.fn(board, row, col, i) !== value) {
            found = false;
            break;
          }
        }
        if (found) return true;
      }
    }
    return false;
  }

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (board[i][j] !== PlayerEnum.EMPTY && checkDirections(i, j)) {
        return board[i][j];
      }
    }
  }
  return null;
}

// Mark winner cells
export function markWinner(board, winner) {
  const winnerCells = [];

  function findWinnerCells(row, col) {
    for (const direction of DIRECTIONS) {
      const line = [];
      let i = 0;
      while (
        direction.moveCondition(row, col, i) &&
        direction.fn(board, row, col, i) === winner
      ) {
        line.push(direction.moveRowCol(row, col, i));
        i++;
      }
      if (line.length >= TARGET) {
        winnerCells.push(...line);
      }
    }
  }

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (board[i][j] === winner) {
        findWinnerCells(i, j);
      }
    }
  }

  for (const [row, col] of new Set(winnerCells.map(JSON.stringify)).map(JSON.parse)) {
    board[row][col] = PlayerEnum.WINNER;
  }
}
