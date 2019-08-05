import { Injectable } from '@angular/core';
import Chess from 'chess.js';

export interface ChessCell {
  file: number;
  rank: number;
}

@Injectable()
export class Loloof64ChessLogicService {

  private game = new Chess('8/8/8/8/8/8/8/8 w - - 0 1');

  constructor() { }

  newGame = (startPosition: string = '8/8/8/8/8/8/8/8 w - - 0 1') => {
    this.game.load(startPosition);
  }

  isStalemate = () => {
    return this.game.in_stalemate();
  }

  isThreeFoldRepetition = () => {
    return this.game.in_threefold_repetition();
  }

  isDrawByMissingMaterial = () => {
    return this.game.insufficient_material();
  }

  isDrawByFiftyMovesRule = () => {
    return this.game.in_draw() && (! this.game.insufficient_material());
  }

  isCheckmate = () => {
    return this.game.in_checkmate();
  }

  getCurrentPosition = () => {
    return this.game.fen();
  }

  checkAndDoMove = (start: ChessCell, end: ChessCell) => {
    return new Promise((resolve) => {
      const fromCell = this.cellToCoordsString(start);
      const toCell = this.cellToCoordsString(end);
      
      const moveResult = this.game.move({ from: fromCell, to: toCell });
      resolve(moveResult !== null);
    });
  }

  checkAndDoMoveWithPromotion = (start: ChessCell, end: ChessCell, promotion: string) => {
    return new Promise((resolve) => {
      const fromCell = this.cellToCoordsString(start);
      const toCell = this.cellToCoordsString(end);
      
      const moveResult = this.game.move({ from: fromCell, to: toCell, promotion, });
      resolve(moveResult !== null);
    });
  }

  private cellToCoordsString(cell: ChessCell): string {
    const fileStr = String.fromCharCode('a'.charCodeAt(0) + cell.file);
    const rankStr = String.fromCharCode('1'.charCodeAt(0) + cell.rank);

    return `${fileStr}${rankStr}`;
  }

  isWhiteTurn = () => {
    return this.game.turn() === 'w';
  }

  lastMoveFAN = (): string => {
    const history = this.game.history();
    const lastMoveSAN = history[history.length - 1];
    const lastMoveDoneByWhite = this.game.turn() === 'b';

    let lastMoveFAN = lastMoveSAN;
    lastMoveFAN = lastMoveFAN.replace(/N/, lastMoveDoneByWhite ? '\u2658' : '\u265E');
    lastMoveFAN = lastMoveFAN.replace(/B/, lastMoveDoneByWhite ? '\u2657' : '\u265D');
    lastMoveFAN = lastMoveFAN.replace(/R/, lastMoveDoneByWhite ? '\u2656' : '\u265C');
    lastMoveFAN = lastMoveFAN.replace(/Q/, lastMoveDoneByWhite ? '\u2655' : '\u265B');
    lastMoveFAN = lastMoveFAN.replace(/K/, lastMoveDoneByWhite ? '\u2654' : '\u265A');

    return lastMoveFAN;
  }
}
