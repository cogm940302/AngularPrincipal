import { TestBed } from '@angular/core/testing';

import { ShareMailService } from './share-mail.service';

describe('ShareMailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareMailService = TestBed.get(ShareMailService);
    expect(service).toBeTruthy();
  });
});
