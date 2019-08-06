import { Component, OnInit, Output, EventEmitter } from '@angular/core';

interface ChessCell {
  file: number;
  rank: number;
}

interface ChessMove {
  from: ChessCell;
  to: ChessCell;
}

export interface HistoryCellContent {
  position: string; // related position in FEN notation
  lastMove: ChessMove; // move to highlight
  historyPly: number; // index of ply inside history (always 1 for first black move)
  fan: string; // Move in figurine notation (FAN)
}

@Component({
  selector: 'loloof64-chess-history',
  templateUrl: './loloof64-chess-history.component.html',
  styleUrls: ['./loloof64-chess-history.component.scss'],
})
export class Loloof64ChessHistoryComponent implements OnInit {
  
  cellsContent: HistoryCellContent[] = [];
  linesIndexes = [];
  private currentLineIndex = 0;
  private highlitedPly = undefined;

  @Output() positionRequestedEvent = new EventEmitter<HistoryCellContent>();

  constructor() { }

  ngOnInit() {
    this.clearContent();
  }

  realLinesIndexes = () => {
    const values = [...this.linesIndexes];
    const thereIsIncompleteLine = this.cellsContent.length % 3 > 0;
    if (thereIsIncompleteLine) { values.push(values.length); }
    return values;
  }

  notAMissingCell = (index: number) => {
    return index < this.cellsContent.length;
  }

  addContent = (value: HistoryCellContent) => {
    this.cellsContent.push(value);
    // Updating lines indexes
    if (this.cellsContent.length % 3 === 0) {
      this.linesIndexes.push(this.currentLineIndex);
      this.currentLineIndex++;
    }
  }

  sendPositionRequestedEvent = (cellIndex: number) => {
    this.positionRequestedEvent.emit(this.cellsContent[cellIndex]);
  }

  getCellClass = (cellIndex: number) => {
    let cellPly = Math.floor(cellIndex / 3) * 2;
    cellPly += (cellIndex - 1) % 3;

    return cellPly === this.highlitedPly ? 'history-cell move highlighted' : 'history-cell move';
  }

  highlightPly = (ply: number) => {
    this.highlitedPly = ply;
  }

  clearHighlightedPly = () => {
    this.highlitedPly = undefined;
  }

  private clearContent = () => {
    this.currentLineIndex = 0;
    this.linesIndexes = [];
    this.cellsContent = [];
  }

}
