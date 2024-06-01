import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorCanvasComponent } from './editor-canvas/editor-canvas.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';

const routes: Routes = [
  { path: 'canvas/:workflowID', component: EditorCanvasComponent },
  { path: 'workflowlist', component: WorkflowListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
