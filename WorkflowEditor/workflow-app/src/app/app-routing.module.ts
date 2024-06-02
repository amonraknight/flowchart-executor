import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorCanvasComponent } from './editor-canvas/editor-canvas.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';

const routes: Routes = [
  { path: 'canvas/:workflowID', component: EditorCanvasComponent },
  { path: 'canvas', component: EditorCanvasComponent },
  { path: '', component: WorkflowListComponent },
  { path: 'workflowlist', component: WorkflowListComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
