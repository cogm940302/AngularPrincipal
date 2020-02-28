import { TestBed } from '@angular/core/testing';

import { MiddleDaonService } from './middle-daon.service';

describe('MiddleDaonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MiddleDaonService = TestBed.get(MiddleDaonService);
    expect(service).toBeTruthy();
  });
});
