import { TestBed } from '@angular/core/testing';

import { PlacementServiceService } from './placement-service.service';

describe('PlacementServiceService', () => {
  let service: PlacementServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
