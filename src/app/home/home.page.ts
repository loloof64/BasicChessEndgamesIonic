import { Component, OnInit, DoCheck, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PlayerType } from '../components/loloof64-chessboard/PlayerType';
import { CompleteHistoryCellContent } from '../components/loloof64-chessboard/loloof64-chessboard.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, DoCheck {

  @ViewChild('board') board: any;
  @ViewChild('history') history: any;
  
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
      this.platform.width() * 0.8 :
      this.platform.height() - 56;
  }

  setBoardReadyStatus = () => {
    this.boardBusy = false;
    if (this.needToStartGame) {
      this.startNewGame();
    }
  }

  startNewGame = () => {
    ////////////////////////////////////////
    console.log('starting a new game');
    /////////////////////////////////////////
    this.board.startNewGame(PlayerType.Computer, PlayerType.Computer, '8/8/8/8/4pk2/8/8/4K3 b - - 0 1');
    this.needToStartGame = false;
  }

  setBoardBusyStatus = () => {
    this.boardBusy = true;
  }

  addContentToHistory = (content: string) => {
    this.history.addContent(content);
  }

  requestPositionOnBoard = (positionData: CompleteHistoryCellContent) => {
    this.board.requestPositionIfPossible(positionData);
  }

  clearHistorySelection = () => {
    this.history.clearHighlightedPly();
  }

  updateSelectedHistoryPly = (plyIndex: number) => {
    this.history.highlightPly(plyIndex);
  }

}
