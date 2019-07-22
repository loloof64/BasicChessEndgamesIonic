import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Loloof64ChessboardComponent } from './loloof64-chessboard.component';

describe('Loloof64ChessboardComponent', () => {
  let component: Loloof64ChessboardComponent;
  let fixture: ComponentFixture<Loloof64ChessboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Loloof64ChessboardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Loloof64ChessboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
