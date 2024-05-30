import { TestBed } from '@angular/core/testing';

import { CustomizationSupportService } from './customization-support.service';

describe('CustomizationSupportService', () => {
  let service: CustomizationSupportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomizationSupportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
