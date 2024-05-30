import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatStepComponent } from './repeat-step.component';

describe('RepeatStepComponent', () => {
  let component: RepeatStepComponent;
  let fixture: ComponentFixture<RepeatStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepeatStepComponent]
    });
    fixture = TestBed.createComponent(RepeatStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
