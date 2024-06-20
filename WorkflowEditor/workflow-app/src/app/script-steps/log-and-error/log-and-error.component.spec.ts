import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogAndErrorComponent } from './log-and-error.component';

describe('LogAndErrorComponent', () => {
  let component: LogAndErrorComponent;
  let fixture: ComponentFixture<LogAndErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogAndErrorComponent]
    });
    fixture = TestBed.createComponent(LogAndErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
