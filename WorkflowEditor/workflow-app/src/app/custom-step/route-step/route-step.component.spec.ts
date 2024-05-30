import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteStepComponent } from './route-step.component';

describe('RouteStepComponent', () => {
  let component: RouteStepComponent;
  let fixture: ComponentFixture<RouteStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouteStepComponent]
    });
    fixture = TestBed.createComponent(RouteStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
