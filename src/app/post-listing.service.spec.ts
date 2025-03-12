import { TestBed } from '@angular/core/testing';

import { PostListingService } from './post-listing.service';

describe('PostListingService', () => {
  let service: PostListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
