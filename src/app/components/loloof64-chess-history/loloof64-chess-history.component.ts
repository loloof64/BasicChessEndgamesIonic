import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loloof64-chess-history',
  templateUrl: './loloof64-chess-history.component.html',
  styleUrls: ['./loloof64-chess-history.component.scss'],
})
export class Loloof64ChessHistoryComponent implements OnInit {

  private lineIndex = 0;
  
  cellsContent = [];
  linesIndexes = [];

  constructor() { }

  ngOnInit() {
    this.clearContent();

    for (let i = 0; i < 15; i++) {
      this.cellsContent.push(i);
      this.updateLinesCount();
    }
  }

  realLinesIndexes() {
    const values = [...this.linesIndexes];
    const thereIsIncompleteLine = this.cellsContent.length % 3 > 0;
    if (thereIsIncompleteLine) { values.push(values.length); }
    return values;
  }

  notAMissingCell(index: number) {
    return index < this.cellsContent.length;
  }

  private clearContent() {
    this.linesIndexes = [];
    this.cellsContent = [];
  }

  private updateLinesCount() {
    if (this.cellsContent.length % 3 === 0) {
      this.linesIndexes.push(this.lineIndex);
      this.lineIndex++;
    }
  }

}
