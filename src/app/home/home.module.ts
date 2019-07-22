import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { Loloof64ChessboardComponent } from '../components/loloof64-chessboard/loloof64-chessboard.component';
import { Loloof64ChessboardCellComponent } from '../components/loloof64-chessboard/loloof64-chessboard-cell/loloof64-chessboard-cell.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [
    HomePage,
    Loloof64ChessboardComponent,
    Loloof64ChessboardCellComponent
  ],
})
export class HomePageModule {}
