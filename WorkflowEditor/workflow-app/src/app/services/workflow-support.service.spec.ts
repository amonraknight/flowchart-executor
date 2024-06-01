import { TestBed } from '@angular/core/testing';

import { WorkflowSupportService } from './workflow-support.service';

describe('WorkflowSupportService', () => {
  let service: WorkflowSupportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowSupportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
