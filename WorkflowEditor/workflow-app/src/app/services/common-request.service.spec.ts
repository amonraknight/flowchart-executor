import { TestBed } from '@angular/core/testing';

import { CommonRequestService } from './common-request.service';

describe('CommonRequestService', () => {
  let service: CommonRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
