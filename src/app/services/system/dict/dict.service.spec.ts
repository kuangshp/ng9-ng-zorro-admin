import { TestBed } from '@angular/core/testing';

import { DictService } from './dict.service';

describe('DictService', () => {
  let service: DictService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DictService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
