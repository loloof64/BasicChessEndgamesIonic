import {
  Component, OnInit, Renderer2, ElementRef, Input, ViewChild,
  OnChanges, SimpleChanges,
} from '@angular/core';
import { Loloof64ChessLogicService } from '../../services/loloof64-chess-logic.service';

@Component({
  selector: 'loloof64-chessboard',
  templateUrl: './loloof64-chessboard.component.html',
  styleUrls: ['./loloof64-chessboard.component.scss'],
  providers: [Loloof64ChessLogicService],
})
export class Loloof64ChessboardComponent implements OnInit, OnChanges {

  @Input() size = 200.0;
  @Input() reversed = false;

  @ViewChild('root') root: ElementRef;

  allFilesCoordinates: string [] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  allRanksCoordinates: string [] = ['1', '2', '3', '4', '5', '6', '7', '8'];

  /**
   * 1st dimension => rank : always from 1 to 8
   * 2nd dimension => file : always from A to H
   */
  piecesValues: string [][];

  constructor(private renderer: Renderer2, private chessService: Loloof64ChessLogicService) { }

  ngOnInit() {
    this.chessService.newGame();
    this.updateRenderSize();
    this.piecesValues = this.piecesValuesFromPosition();
  }

  ngOnChanges(changes: SimpleChanges) {
    const sizeChange = changes.size;
    if (sizeChange !== undefined) {
      this.updateRenderSize();
    }
  }

  private updateRenderSize() {
    this.renderer.setStyle(this.root.nativeElement, 'width', this.size + 'px');
    this.renderer.setStyle(this.root.nativeElement, 'height', this.size + 'px');
  }

  fileCoordinate(file: number): string {
    return this.allFilesCoordinates[this.reversed ? 7 - file : file];
  }

  rankCoordinate(rank: number): string {
    return this.allRanksCoordinates[this.reversed ? rank : 7 - rank];
  }

  imageDefinedFor(file: number, rank: number): boolean {
    return this.piecesValues !== undefined && this.piecesValues[rank][file] !== undefined;
  }

  pieceSize(): number {
    return this.size * 0.1;
  }

  coordinateFontSize(): number {
    return this.size * 0.04;
  }

  turnClass(): string {
    const currentPosition = this.chessService.getCurrentPosition();
    const blackToPlay = currentPosition.split(' ')[1].charAt(0) === 'b';
    return blackToPlay ? 'turn-black' : 'turn-white';
  }

  private piecesValuesFromPosition(): string[][] {
    const currentPosition = this.chessService.getCurrentPosition();
    let boardValues = currentPosition.split(' ')[0].split('/').reverse();

    let result = [];

    for (let rank = 0; rank < 8; rank++) {
      let line = [];

      let file = 0;
      let charPosition = 0;

      while (file < 8) {
        const currentValue = boardValues[rank][charPosition];
        const valueAsDigit = currentValue.charCodeAt(0) - '0'.charCodeAt(0);
        const isCorrectDigitValue = valueAsDigit >= 0 && valueAsDigit <= 9;

        if (isCorrectDigitValue) {
          // clearing as many cells as valueAsDigit requires
          for (let i = 0; i < valueAsDigit; i++) {
            line.push(undefined);
            file++;
          }
        } else {
          line.push(currentValue);
          file++;
        }

        charPosition++;
      }

      result.push(line);
    }

    return result;
  }

  getFile(col: number) {
    return this.reversed ? 7 - col : col;
  }

  getRank(row: number) {
    return this.reversed ? row : 7 - row;
  }

  getPieceValue(col: number, row: number) {
    return this.piecesValues[this.getRank(row)][this.getFile(col)];
  }

  startDnd(col: number, row: number) {
    
  }

  endDnd(col: number, row: number) {

  }

}
