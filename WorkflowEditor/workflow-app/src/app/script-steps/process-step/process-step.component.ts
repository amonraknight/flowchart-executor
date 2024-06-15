import { Component, OnInit} from '@angular/core';
import { NgFlowchartStepComponent, NgFlowchart } from '@joelwenzel/ng-flowchart';
import { StepInfo } from 'src/app/interfaces/stepInfo';
import { StepEditorCommunicationService } from 'src/app/services/step-editor-communication.service';


@Component({
  selector: 'app-process-step',
  templateUrl: './process-step.component.html',
  styleUrls: ['./process-step.component.css']
})
export class ProcessStepComponent extends NgFlowchartStepComponent implements OnInit {


  showModal = false;
  showChat = false;
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

  

  openModal(): void {
    this.showModal = true
  }

  closeModal(): void {
    this.showModal = false
    //console.log(this.parent)
  }

  openChat(): void {
    this.showChat = true
  }

  closeChat(): void {
    this.showChat = false
  }

  renewScript(script: string): void {
    this.data.pythonCode = script;
  }

  //traverse the upstream parents to get the scripts
  getPredecessorScripts(step: number): string[] {
    let scripts: string[] = [];

    let eachParent = this.parent;
    for(let i=0; eachParent && i<step; i++) {
      scripts.push(eachParent.data.pythonCode);
      eachParent = eachParent.parent;
    } 
    return scripts;
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

saveAsCustomizedStep(): void {
  let thisStepInfo: StepInfo = {
    paletteName: this.data.name,
      step: {
        template: ProcessStepComponent,
        type: this.type,
        data: this.data,
        icon: 'bi bi-terminal'
      }
  }

  this.stepEditorCommunicationService.addCustomizedStep(thisStepInfo);
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
