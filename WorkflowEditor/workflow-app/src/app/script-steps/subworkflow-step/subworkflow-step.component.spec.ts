import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubworkflowStepComponent } from './subworkflow-step.component';

describe('SubworkflowStepComponent', () => {
  let component: SubworkflowStepComponent;
  let fixture: ComponentFixture<SubworkflowStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubworkflowStepComponent]
    });
    fixture = TestBed.createComponent(SubworkflowStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
