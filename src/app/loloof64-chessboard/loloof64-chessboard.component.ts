import { Component, OnInit, Renderer2, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'loloof64-chessboard',
  templateUrl: './loloof64-chessboard.component.html',
  styleUrls: ['./loloof64-chessboard.component.scss'],
})
export class Loloof64ChessboardComponent implements OnInit {

  @Input() size = '200px';
  @ViewChild('root') root: ElementRef;

  allFilesCoordinates: string = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  allRanksCoordinates: string = ['1', '2', '3', '4', '5', '6', '7', '8'];

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.root.nativeElement.style.width = this.size;
    this.root.nativeElement.style.height = this.size;
  }

  cellColorClass(file: number, rank: number): string {
    return (file + rank) % 2 === 0 ? 'white-cell' : 'black-cell';
  }

  fileCoordinate(file: number): string {
    return this.allFilesCoordinates[file];
  }

  rankCoordinate(rank: number): string {
    return this.allRanksCoordinates[7 - rank];
  }

}
