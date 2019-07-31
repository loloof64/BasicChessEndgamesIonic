import { TestBed } from '@angular/core/testing';

import { Loloof64ChessEngineCommunicationService } from './loloof64-chess-engine-communication.service';

describe('Loloof64ChessEngineCommunicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Loloof64ChessEngineCommunicationService = TestBed.get(Loloof64ChessEngineCommunicationService);
    expect(service).toBeTruthy();
  });
});
