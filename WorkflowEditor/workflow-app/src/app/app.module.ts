import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorCanvasComponent } from './editor-canvas/editor-canvas.component';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';
import { CustomStepComponent } from './custom-step/custom-step.component';
import { FormStepComponent } from './form-step/form-step.component';
import { NestedFlowComponent } from './nested-flow/nested-flow.component';
import { RouteStepComponent } from './custom-step/route-step/route-step.component';
import { ProcessStepComponent } from './script-steps/process-step/process-step.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';

import 'node_modules/codemirror/mode/python/python.js';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { ConfirmModalComponent } from './util-components/confirm-modal/confirm-modal.component';
import { NoticeModalComponent } from './util-components/notice-modal/notice-modal.component';
import { ScriptEditorComponent } from './script-steps/script-editor/script-editor.component';
import { SubworkflowStepComponent } from './script-steps/subworkflow-step/subworkflow-step.component';
import { SubworkflowSelectorComponent } from './script-steps/subworkflow-selector/subworkflow-selector.component';


@NgModule({
  declarations: [
    AppComponent,
    EditorCanvasComponent,
    CustomStepComponent,
    FormStepComponent,
    NestedFlowComponent,
    RouteStepComponent,
    ProcessStepComponent,
    WorkflowListComponent,
    ConfirmModalComponent,
    NoticeModalComponent,
    ScriptEditorComponent,
    SubworkflowStepComponent,
    SubworkflowSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgFlowchartModule,
    FormsModule,
    CodemirrorModule,
    HttpClientModule,
    /*
    * Open it to enable mocking.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
    */
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
