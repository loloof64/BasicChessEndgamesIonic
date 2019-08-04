import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loloof64-chess-history',
  templateUrl: './loloof64-chess-history.component.html',
  styleUrls: ['./loloof64-chess-history.component.scss'],
})
export class Loloof64ChessHistoryComponent implements OnInit {

  @Input() columnsCount = 1;
  columns: number[];

  constructor() { }

  ngOnInit() {
    this.columns = [];
    for (let columnIndex = 0; columnIndex < this.columnsCount; columnIndex++) {
      this.columns.push(columnIndex);
    }
  }

}
