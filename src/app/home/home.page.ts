import { Component, OnInit} from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  boardSize: number;

  constructor(private platform: Platform) {}

  ngOnInit() {
    this.boardSize = this.platform.width() < this.platform.height() ?
      this.platform.width() :
      this.platform.height() - 56;
  }

}
