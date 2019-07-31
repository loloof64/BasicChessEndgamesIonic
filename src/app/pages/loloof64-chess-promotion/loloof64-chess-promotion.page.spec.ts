import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Loloof64ChessPromotionPage } from './loloof64-chess-promotion.page';

describe('Loloof64ChessPromotionPage', () => {
  let component: Loloof64ChessPromotionPage;
  let fixture: ComponentFixture<Loloof64ChessPromotionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Loloof64ChessPromotionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Loloof64ChessPromotionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
