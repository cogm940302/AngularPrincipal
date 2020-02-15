import { TestBed } from '@angular/core/testing';

import { ShareFaceService } from './share-face.service';

describe('ShareFaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareFaceService = TestBed.get(ShareFaceService);
    expect(service).toBeTruthy();
  });
});
