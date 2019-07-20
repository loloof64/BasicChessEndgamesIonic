import { Component, OnInit, Renderer2, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'loloof64-chessboard',
  templateUrl: './loloof64-chessboard.component.html',
  styleUrls: ['./loloof64-chessboard.component.scss'],
})
export class Loloof64ChessboardComponent implements OnInit {

  @Input() size = '200px';
  @ViewChild('root') root: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.root.nativeElement.style.width = this.size;
    this.root.nativeElement.style.height = this.size;
  }

  cellColorClass(file: number, rank: number): string {
    return (file + rank) % 2 === 0 ? 'white-cell' : 'black-cell';
  }

}
