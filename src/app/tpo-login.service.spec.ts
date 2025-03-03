import { TestBed } from '@angular/core/testing';

import { TpoLoginService } from './tpo-login.service';

describe('TpoLoginService', () => {
  let service: TpoLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TpoLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
