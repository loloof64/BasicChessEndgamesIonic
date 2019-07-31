import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loloof64-chess-promotion',
  templateUrl: './loloof64-chess-promotion.page.html',
  styleUrls: ['./loloof64-chess-promotion.page.scss'],
})
export class Loloof64ChessPromotionPage implements OnInit {

  @Input() callback: (value: string) => void;
  @Input() whiteTurn: boolean;

  message = 'Please, select the promotion piece';

  constructor() { }

  ngOnInit() {
  }

  sendKnight = () => {
    this.callback('n');
  }

  sendBishop = () => {
    this.callback('b');
  }

  sendRook = () => {
    this.callback('r');
  }

  sendQueen = () => {
    this.callback('q');
  }

  getKnightImage = () => {
    return this.whiteTurn ?
      '/assets/vectors/Chess_nlt45.svg' :
      '/assets/vectors/Chess_ndt45.svg';
  }

  getBishopImage = () => {
    return this.whiteTurn ?
      '/assets/vectors/Chess_blt45.svg' :
      '/assets/vectors/Chess_bdt45.svg';
  }

  getRookImage = () => {
    return this.whiteTurn ?
      '/assets/vectors/Chess_rlt45.svg' :
      '/assets/vectors/Chess_rdt45.svg';
  }

  getQueenImage = () => {
    return this.whiteTurn ?
      '/assets/vectors/Chess_qlt45.svg' :
      '/assets/vectors/Chess_qdt45.svg';
  }

}
