import { TestBed } from '@angular/core/testing';

import { UserSharedService } from './user-shared-service';

describe('UserSharedServiceService', () => {
  let service: UserSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
