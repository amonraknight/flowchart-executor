import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';

export type MyForm = {
  input1: string;
};

@Component({
  selector: 'app-form-step',
  templateUrl: './form-step.component.html',
  styleUrls: ['./form-step.component.css']
})
export class FormStepComponent extends NgFlowchartStepComponent<MyForm> implements OnInit {

  constructor() {
    super();
  }

  override ngOnInit(): void {
    console.log(this.data);
  }

}
