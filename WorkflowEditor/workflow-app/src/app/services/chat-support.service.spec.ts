import { TestBed } from '@angular/core/testing';

import { ChatSupportService } from './chat-support.service';

describe('ChatSupportService', () => {
  let service: ChatSupportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatSupportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
