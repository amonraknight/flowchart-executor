import { Injectable } from '@angular/core';
import { StepInfo } from '../interfaces/stepInfo';
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
}
