import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalRedirectStepComponent } from './conditional-redirect-step.component';

describe('ConditionalRedirectStepComponent', () => {
  let component: ConditionalRedirectStepComponent;
  let fixture: ComponentFixture<ConditionalRedirectStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConditionalRedirectStepComponent]
    });
    fixture = TestBed.createComponent(ConditionalRedirectStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
