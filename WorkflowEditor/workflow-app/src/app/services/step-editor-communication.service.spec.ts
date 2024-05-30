import { TestBed } from '@angular/core/testing';

import { StepEditorCommunicationService } from './step-editor-communication.service';

describe('StepEditorCommunicationService', () => {
  let service: StepEditorCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepEditorCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
