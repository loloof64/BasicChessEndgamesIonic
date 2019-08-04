import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Loloof64ChessHistoryComponent } from './loloof64-chess-history.component';

describe('Loloof64ChessHistoryComponent', () => {
  let component: Loloof64ChessHistoryComponent;
  let fixture: ComponentFixture<Loloof64ChessHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Loloof64ChessHistoryComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Loloof64ChessHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
