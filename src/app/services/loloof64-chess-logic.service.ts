import { Injectable } from '@angular/core';
import Chess from 'chess.js';

export interface ChessCell {
  file: number;
  rank: number;
}

@Injectable()
export class Loloof64ChessLogicService {

  private game = new Chess();

  constructor() { }

  newGame(startPosition: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
    this.game = new Chess(startPosition);
  }

  isStalemate() {
    return this.game.in_stalemate();
  }

  isThreeFoldRepetition() {
    return this.game.in_threefold_repetition();
  }

  isDrawByMissingMaterial() {
    return this.game.insufficient_material();
  }

  isDrawByFiftyMovesRule() {
    return this.game.in_draw() && (! this.game.insufficient_material());
  }

  isCheckmate() {
    return this.game.in_checkmate();
  }

  getCurrentPosition() {
    return this.game.fen();
  }

  checkAndDoMove(start: ChessCell, end: ChessCell): boolean {
    const fromCell = this.cellToCoordsString(start);
    const toCell = this.cellToCoordsString(end);
    
    const moveResult = this.game.move({ from: fromCell, to: toCell });
    return moveResult !== null;
  }

  private cellToCoordsString(cell: ChessCell): string {
    const fileStr = String.fromCharCode('a'.charCodeAt(0) + cell.file);
    const rankStr = String.fromCharCode('1'.charCodeAt(0) + cell.rank);

    return `${fileStr}${rankStr}`;
  }
}
