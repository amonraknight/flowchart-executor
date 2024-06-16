import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent, NgFlowchart } from '@joelwenzel/ng-flowchart';
import { StepEditorCommunicationService } from 'src/app/services/step-editor-communication.service';


@Component({
  selector: 'app-subworkflow-step',
  templateUrl: './subworkflow-step.component.html',
  styleUrls: ['./subworkflow-step.component.css']
})
export class SubworkflowStepComponent extends NgFlowchartStepComponent implements OnInit{

  
  showModal = false;
  showLog = false;

  constructor(private stepEditorCommunicationService: StepEditorCommunicationService) {
    super();
  }


  override ngOnInit(): void {
    
  }


  override canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    return true;
  }

  delete(): void {
    //recursively delete
    this.destroy(false);
  }

  setFocus(): void {
    if(this.data.focused) {
      this.data.focused = false;
    }
    else {
      this._removeAllFocus();
      this.data.focused = true;
    }
  }

  //Remove all focus before setting the focus
  _removeAllFocus(): void {
    //console.log(this.canvas);

    let currentStep = this.canvas.flow.rootStep;
    this._removeFocusCascade(currentStep);

  }

  
  _removeFocusCascade(currentStep: NgFlowchartStepComponent): void {
    currentStep.data.focused = false;
    if(currentStep.children) {
      currentStep.children.map(eachChild => {
        this._removeFocusCascade(eachChild);
      });
      
    }
  }

  openModal(): void {
    this.showModal = true
  }

  closeModal(): void {
    this.showModal = false
    //console.log(this.parent)
  }
  
  getStepClass(data: any): string {
    let classStr = "process-step";
    if(data.hasError == 0) {
      classStr = classStr + " success";
    }
    else if(data.hasError == 1) {
      classStr = classStr + " exception";
    }
    else {
      classStr = classStr + " before-run";
    }

    if(data.focused) {
      classStr = classStr + " focused"
    }

    return classStr;
  }
}
