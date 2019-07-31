import { Component, OnInit, DoCheck, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PlayerType } from '../components/loloof64-chessboard/PlayerType';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, DoCheck {

  @ViewChild('board') board: any;
  
  boardSize: number;
  boardBusy = true;
  needToStartGame = true;

  constructor(private platform: Platform) {}

  ngOnInit() {
    this.adjustBoardSize();
  }

  ngDoCheck() {
    this.adjustBoardSize();
  }

  private adjustBoardSize = () => {
    this.boardSize = this.platform.isPortrait() ?
      this.platform.width() :
      this.platform.height() - 56;
  }

  setBoardReadyStatus = () => {
    this.boardBusy = false;
    if (this.needToStartGame) {
      this.board.startNewGame(PlayerType.Computer, PlayerType.Human);
      this.needToStartGame = false;
    }
  }

  setBoardBusyStatus = () => {
    this.boardBusy = true;
  }

}
