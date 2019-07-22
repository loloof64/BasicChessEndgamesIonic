import { Component, OnInit, DoCheck } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, DoCheck {

  boardSize: number;

  constructor(private platform: Platform) {}

  ngOnInit() {
    this.adjustBoardSize();
  }

  ngDoCheck() {
    this.adjustBoardSize();
  }

  private adjustBoardSize() {
    this.boardSize = this.platform.isPortrait() ?
      this.platform.width() :
      this.platform.height() - 56;
  }

}
