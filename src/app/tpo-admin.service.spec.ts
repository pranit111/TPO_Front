import { TestBed } from '@angular/core/testing';

import { TpoAdminService } from './tpo-admin.service';

describe('TpoAdminService', () => {
  let service: TpoAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TpoAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
