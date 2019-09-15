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
  @Input() dndHovering: boolean;

  @ViewChild('root') root: ElementRef;
  @ViewChild('pieceImg') pieceImg: ElementRef;

  cellSize: number;

  constructor(private renderer: Renderer2) { }

  ngAfterViewChecked() {
      this.cellSize = this.root.nativeElement.getBoundingClientRect().width;
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
    if (this.dndHovering) {
      return 'dnd-end-cell';
    }

    if (this.dndHighlight) {
      return 'dnd-start-cell';
    }

    const whiteCell = (this.file + this.rank) % 2 !== 0;
    return whiteCell ? 'white-cell' : 'black-cell';
  }

  mustShowPiece = () => {
    const hasPiece = this.value !== undefined;
    return hasPiece;
  }

  getPiecePath = () => {
    return this.getPieceRawPath();
  }

  private getPieceRawPath = () => {
    let rawImageName;
    switch (this.value) {
      case 'P': rawImageName = 'Chess_plt45.svg'; break;
      case 'N': rawImageName = 'Chess_nlt45.svg'; break;
      case 'B': rawImageName = 'Chess_blt45.svg'; break;
      case 'R': rawImageName = 'Chess_rlt45.svg'; break;
      case 'Q': rawImageName = 'Chess_qlt45.svg'; break;
      case 'K': rawImageName = 'Chess_klt45.svg'; break;

      case 'p': rawImageName = 'Chess_pdt45.svg'; break;
      case 'n': rawImageName = 'Chess_ndt45.svg'; break;
      case 'b': rawImageName = 'Chess_bdt45.svg'; break;
      case 'r': rawImageName = 'Chess_rdt45.svg'; break;
      case 'q': rawImageName = 'Chess_qdt45.svg'; break;
      case 'k': rawImageName = 'Chess_kdt45.svg'; break;
      default: return undefined;
    }

    return `/assets/vectors/${rawImageName}`;
  }

}
