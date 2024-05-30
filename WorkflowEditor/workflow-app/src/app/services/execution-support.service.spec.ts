import { TestBed } from '@angular/core/testing';

import { ExecutionSupportService } from './execution-support.service';

describe('ExecutionSupportService', () => {
  let service: ExecutionSupportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionSupportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
