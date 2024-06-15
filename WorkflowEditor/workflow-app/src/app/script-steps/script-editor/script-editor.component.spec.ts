import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptEditorComponent } from './script-editor.component';

describe('ScriptEditorComponent', () => {
  let component: ScriptEditorComponent;
  let fixture: ComponentFixture<ScriptEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScriptEditorComponent]
    });
    fixture = TestBed.createComponent(ScriptEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
