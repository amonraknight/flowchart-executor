import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubworkflowSelectorComponent } from './subworkflow-selector.component';

describe('SubworkflowSelectorComponent', () => {
  let component: SubworkflowSelectorComponent;
  let fixture: ComponentFixture<SubworkflowSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubworkflowSelectorComponent]
    });
    fixture = TestBed.createComponent(SubworkflowSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
