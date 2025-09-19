import { describe, test, expect } from "@jest/globals";
import { calculateRowByCol, detectWinner, isValidMove, markWinner } from "../core/core.js";

describe("Core game logic tests", () => {
  test.each([
    [5, 0, true],
    [4, 0, false],
    [1, 1, false],
    [1, 4, true],
    [0, 3, false],
    [3, 2, true]
  ])("isValidMove row %i col %i => %s", (row, col, expected) => {
    const board = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0],
      [0,0,0,1,2,0,0],
      [0,0,2,2,1,0,0],
      [0,0,1,1,2,0,0],
    ];
    expect(isValidMove(board, row, col)).toBe(expected);
  });

  test("calculateRowByCol", () => {
    const board = [
      [0,0,0,0,1,0,0],
      [0,0,0,0,2,0,0],
      [0,0,0,0,1,0,2],
      [0,0,1,0,1,1,2],
      [0,2,2,0,2,2,1],
      [0,1,1,0,1,1,1],
    ];
    expect(calculateRowByCol(board, 0)).toBe(5);
    expect(calculateRowByCol(board, 1)).toBe(3);
    expect(calculateRowByCol(board, 2)).toBe(2);
    expect(calculateRowByCol(board, 3)).toBe(5);
    expect(calculateRowByCol(board, 4)).toBe(null);
  });

  test("detectWinner", () => {
    const board = [
      [1,1,1,1],
      [0,0,0,0],
      [2,2,2,0],
      [0,0,0,0]
    ];
    expect(detectWinner(board)).toBe(1);
  });

  test("markWinner", () => {
    const board = [
      [1,0,0],
      [1,0,0],
      [1,0,0],
      [1,0,0]
    ];
    markWinner(board, 1);
    for (let r = 0; r < board.length; r++) {
      expect(board[r][0]).toBe(3);
    }
  });
});
