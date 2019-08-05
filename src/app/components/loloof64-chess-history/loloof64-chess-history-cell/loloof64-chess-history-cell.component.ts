import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loloof64-chess-history-cell',
  templateUrl: './loloof64-chess-history-cell.component.html',
  styleUrls: ['./loloof64-chess-history-cell.component.scss'],
})
export class Loloof64ChessHistoryCellComponent implements OnInit {

  @Input() value;
  @Input() classes;

  constructor() { }

  ngOnInit() {}

}
