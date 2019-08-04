import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Loloof64ChessHistoryCellComponent } from './loloof64-chess-history-cell.component';

describe('Loloof64ChessHistoryCellComponent', () => {
  let component: Loloof64ChessHistoryCellComponent;
  let fixture: ComponentFixture<Loloof64ChessHistoryCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Loloof64ChessHistoryCellComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Loloof64ChessHistoryCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
