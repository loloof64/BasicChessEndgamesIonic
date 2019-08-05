import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loloof64-chess-history',
  templateUrl: './loloof64-chess-history.component.html',
  styleUrls: ['./loloof64-chess-history.component.scss'],
})
export class Loloof64ChessHistoryComponent implements OnInit {
  
  cellsContent = [];
  linesIndexes = [];
  private currentLineIndex = 0;

  constructor() { }

  ngOnInit() {
    this.clearContent();
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

  addContent(value: string) {
    this.cellsContent.push(value);
    // Updating lines indexes
    if (this.cellsContent.length % 3 === 0) {
      this.linesIndexes.push(this.currentLineIndex);
      this.currentLineIndex++;
    }
  }

  private clearContent() {
    this.currentLineIndex = 0;
    this.linesIndexes = [];
    this.cellsContent = [];
  }

}
