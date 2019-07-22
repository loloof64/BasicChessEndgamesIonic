import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loloof64-chessboard-cell',
  templateUrl: './loloof64-chessboard-cell.component.html',
  styleUrls: ['./loloof64-chessboard-cell.component.scss'],
})
export class Loloof64ChessboardCellComponent implements OnInit {

  @Input() file: number;
  @Input() rank: number;
  @Input() value: string;

  constructor() { }

  ngOnInit() {}

  getCellClass() {
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

  hasPiece(): boolean {
    return this.getPieceImage() !== undefined;
  }

}
