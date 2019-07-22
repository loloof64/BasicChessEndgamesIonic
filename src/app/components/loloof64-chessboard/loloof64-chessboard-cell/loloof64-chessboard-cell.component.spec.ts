import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Loloof64ChessboardCellComponent } from './loloof64-chessboard-cell.component';

describe('Loloof64ChessboardCellComponent', () => {
  let component: Loloof64ChessboardCellComponent;
  let fixture: ComponentFixture<Loloof64ChessboardCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Loloof64ChessboardCellComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Loloof64ChessboardCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
