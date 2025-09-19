// exceptions.js

// Base class for custom errors
export class CustomError extends Error {
  constructor(message) {
    super(message || "Unhandled exception");
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific game errors
export class GameNotFoundError extends CustomError {
  constructor(message) {
    super(message || "Game not found");
  }
}

export class NotAllPlayersJoinedError extends CustomError {
  constructor(message) {
    super(message || "Not all players joined");
  }
}

export class GameFinishedError extends CustomError {
  constructor(message) {
    super(message || "Game finished");
  }
}

export class MoveNotValidError extends CustomError {
  constructor(message) {
    super(message || "Move not valid");
  }
}

export class WrongPlayerToMoveError extends CustomError {
  constructor(message) {
    super(message || "Wrong player to move");
  }
}
