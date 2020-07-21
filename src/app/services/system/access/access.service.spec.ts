import { TestBed } from '@angular/core/testing';

import { AccessService } from './access.service';

describe('AccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccessService = TestBed.get(AccessService);
    expect(service).toBeTruthy();
  });
});
