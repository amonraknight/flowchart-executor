import { Injectable } from '@angular/core';
import { StepInfo } from '../interfaces/step-info/stepInfo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepEditorCommunicationService {
  // Observable source
  private customizeStepSource = new Subject<StepInfo>();
  customizeStep$ = this.customizeStepSource.asObservable();

  addCustomizedStep(stepInfo: StepInfo) {
    this.customizeStepSource.next(stepInfo);
  }

  // Going to subworkflow by ID.
  private workflowId = new Subject<number>();
  zoomToFlow$ = this.workflowId.asObservable();
  zoomToSubWorkflow(workflowId: number) {
    this.workflowId.next(workflowId);
  }

}
