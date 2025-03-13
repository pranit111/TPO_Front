import { TestBed } from '@angular/core/testing';

import { ApplicationserviceService } from './applicationservice.service';

describe('ApplicationserviceService', () => {
  let service: ApplicationserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
