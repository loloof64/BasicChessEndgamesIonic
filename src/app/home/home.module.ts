import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { Loloof64ChessboardComponent } from '../components/loloof64-chessboard/loloof64-chessboard.component';
import { Loloof64ChessboardCellComponent } from '../components/loloof64-chessboard/loloof64-chessboard-cell/loloof64-chessboard-cell.component';
import { Loloof64ChessHistoryComponent } from '../components/loloof64-chess-history/loloof64-chess-history.component';
import { Loloof64ChessHistoryCellComponent } from '../components/loloof64-chess-history/loloof64-chess-history-cell/loloof64-chess-history-cell.component';

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
    Loloof64ChessboardCellComponent,
    Loloof64ChessHistoryComponent,
    Loloof64ChessHistoryCellComponent,
  ],
})
export class HomePageModule {}
