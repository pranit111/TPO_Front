import { TestBed } from '@angular/core/testing';

import { StudloginService } from './studlogin.service';

describe('StudloginService', () => {
  let service: StudloginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudloginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
