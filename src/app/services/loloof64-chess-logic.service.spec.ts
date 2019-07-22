import { TestBed } from '@angular/core/testing';

import { Loloof64ChessLogicService } from './loloof64-chess-logic.service';

describe('Loloof64ChessLogicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Loloof64ChessLogicService = TestBed.get(Loloof64ChessLogicService);
    expect(service).toBeTruthy();
  });
});
