import { Component, AfterViewChecked, Input, Renderer2, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'loloof64-chessboard-cell',
  templateUrl: './loloof64-chessboard-cell.component.html',
  styleUrls: ['./loloof64-chessboard-cell.component.scss'],
})
export class Loloof64ChessboardCellComponent implements AfterViewChecked, OnChanges {

  @Input() file: number;
  @Input() rank: number;
  @Input() value: string;
  @Input() dndHighlight: boolean;

  @ViewChild('root') root: ElementRef;
  @ViewChild('pieceImg') pieceImg: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngAfterViewChecked() {
    if (this.pieceImg !== undefined) {
      const cellSize = this.root.nativeElement.getBoundingClientRect().width;
      this.renderer.setStyle(this.pieceImg.nativeElement, 'width', cellSize + 'px');
      this.renderer.setStyle(this.pieceImg.nativeElement, 'height', cellSize + 'px');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const dndHighlightChanges = changes.dndHighlight;
    if (dndHighlightChanges !== undefined && this.pieceImg !== undefined) {
      if (dndHighlightChanges.currentValue) {
        this.renderer.setStyle(this.pieceImg.nativeElement, 'opacity', '0.0');
      } else {
        this.renderer.setStyle(this.pieceImg.nativeElement, 'opacity', '1.0');
      }
    }
  }

  getCellClass() {
    if (this.dndHighlight) {
      return 'dnd-start-cell';
    }

    const whiteCell = (this.file + this.rank) % 2 !== 0;
    return whiteCell ? 'white-cell' : 'black-cell';
  }

  getPieceImage(): string {
    switch (this.value) {
      case 'P': return 'Chess_plt45.svg'; break;
      case 'N': return 'Chess_nlt45.svg'; break;
      case 'B': return 'Chess_blt45.svg'; break;
      case 'R': return 'Chess_rlt45.svg'; break;
      case 'Q': return 'Chess_qlt45.svg'; break;
      case 'K': return 'Chess_klt45.svg'; break;

      case 'p': return 'Chess_pdt45.svg'; break;
      case 'n': return 'Chess_ndt45.svg'; break;
      case 'b': return 'Chess_bdt45.svg'; break;
      case 'r': return 'Chess_rdt45.svg'; break;
      case 'q': return 'Chess_qdt45.svg'; break;
      case 'k': return 'Chess_kdt45.svg'; break;
      default: return undefined;
    }
  }

  mustShowPiece(): boolean {
    return this.getPieceImage() !== undefined;
  }

  getPiecePath(): string {
    return `/assets/vectors/${this.getPieceImage()}`;
  }

}
