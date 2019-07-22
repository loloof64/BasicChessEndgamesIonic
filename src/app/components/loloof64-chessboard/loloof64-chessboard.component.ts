import {
  Component, OnInit, Renderer2, ElementRef, Input, ViewChild,
  OnChanges, SimpleChanges,
} from '@angular/core';
import { ChessCell, Loloof64ChessLogicService } from '../../services/loloof64-chess-logic.service';

@Component({
  selector: 'loloof64-chessboard',
  templateUrl: './loloof64-chessboard.component.html',
  styleUrls: ['./loloof64-chessboard.component.scss'],
  providers: [Loloof64ChessLogicService],
})
export class Loloof64ChessboardComponent implements OnInit, OnChanges {

  @Input() size = 200.0;
  @Input() position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  @Input() reversed = false;

  @ViewChild('root') root: ElementRef;

  allFilesCoordinates: string [] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  allRanksCoordinates: string [] = ['1', '2', '3', '4', '5', '6', '7', '8'];

  imagesReferences: string [][];

  constructor(private renderer: Renderer2, private chessService: Loloof64ChessLogicService) { }

  ngOnInit() {
    this.position = this.chessService.getCurrentPosition();
    this.updateRenderSize();
    this.imagesReferences = this.imagesFromPosition();
  }

  ngOnChanges(changes: SimpleChanges) {
    const positionChange = changes.position;
    if (positionChange !== undefined) {
      this.position = changes.position.currentValue;
      this.imagesReferences = this.imagesFromPosition();
    }

    const sizeChange = changes.size;
    if (sizeChange !== undefined) {
      this.updateRenderSize();
    }
  }

  private updateRenderSize() {
    this.renderer.setStyle(this.root.nativeElement, 'width', this.size + 'px');
    this.renderer.setStyle(this.root.nativeElement, 'height', this.size + 'px');
  }

  cellColorClass(file: number, rank: number): string {
    return (file + rank) % 2 === 0 ? 'white-cell' : 'black-cell';
  }

  fileCoordinate(file: number): string {
    return this.allFilesCoordinates[this.reversed ? 7 - file : file];
  }

  rankCoordinate(rank: number): string {
    return this.allRanksCoordinates[this.reversed ? rank : 7 - rank];
  }

  imageDefinedFor(file: number, rank: number): boolean {
    return this.imagesReferences !== undefined && this.imagesReferences[rank][file] !== undefined;
  }

  pieceSize(): number {
    return this.size * 0.1;
  }

  coordinateFontSize(): number {
    return this.size * 0.04;
  }

  turnClass(): string {
    const blackToPlay = this.position.split(' ')[1].charAt(0) === 'b';
    return blackToPlay ? 'turn-black' : 'turn-white';
  }

  private imagesFromPosition(): string[][] {
    let boardValues = this.position.split(' ')[0].split('/').reverse();

    if (this.reversed) {
      boardValues = boardValues.reverse();
      for (let rank = 0; rank < 8; rank++) {
        // reverse the string
        boardValues[rank] = boardValues[rank].split('').reverse().join('');
      }
    }

    let result = [];

    for (let rank = 0; rank < 8; rank++) {
      let line = [];

      let file = 0;
      let charPosition = 0;

      while (file < 8) {
        let pieceRef: string;

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
          switch (currentValue) {
            case 'P': pieceRef = 'Chess_plt45.svg'; break;
            case 'N': pieceRef = 'Chess_nlt45.svg'; break;
            case 'B': pieceRef = 'Chess_blt45.svg'; break;
            case 'R': pieceRef = 'Chess_rlt45.svg'; break;
            case 'Q': pieceRef = 'Chess_qlt45.svg'; break;
            case 'K': pieceRef = 'Chess_klt45.svg'; break;

            case 'p': pieceRef = 'Chess_pdt45.svg'; break;
            case 'n': pieceRef = 'Chess_ndt45.svg'; break;
            case 'b': pieceRef = 'Chess_bdt45.svg'; break;
            case 'r': pieceRef = 'Chess_rdt45.svg'; break;
            case 'q': pieceRef = 'Chess_qdt45.svg'; break;
            case 'k': pieceRef = 'Chess_kdt45.svg'; break;
          }
          line.push(pieceRef);
          file++;
        }

        charPosition++;
      }

      result.push(line);
    }

    return result;
  }

  startDnd(row: number, col: number) {
    
  }

  endDnd(row: number, col: number) {

  }

}
