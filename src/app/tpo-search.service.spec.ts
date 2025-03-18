import { TestBed } from '@angular/core/testing';

import { TpoSearchService } from './tpo-search.service';

describe('TpoSearchService', () => {
  let service: TpoSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TpoSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
