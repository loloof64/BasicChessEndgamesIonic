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
    this.linesIndexes = [];
    this.cellsContent = [];

    for (let i = 0; i < 26; i++) {
      this.cellsContent.push(i);
      this.updateLinesCount();
    }

    console.log(this.cellsContent)
    console.log(this.linesIndexes)
  }

  private updateLinesCount() {
    if (this.cellsContent.length % 3 === 0) {
      this.linesIndexes.push(this.lineIndex);
      this.lineIndex++;
    }
  }

}
