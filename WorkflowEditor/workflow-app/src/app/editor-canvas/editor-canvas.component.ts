import { AfterViewInit, Component, TemplateRef, ViewChild, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { NgFlowchart, NgFlowchartStepRegistry, NgFlowchartCanvasDirective } from '@joelwenzel/ng-flowchart';
/*
import { CustomStepComponent } from '../custom-step/custom-step.component';
import { RouteStepComponent } from '../custom-step/route-step/route-step.component';
import { FormStepComponent } from '../form-step/form-step.component';
import { ConditionalRedirectStepComponent } from '../script-steps/conditional-redirect-step/conditional-redirect-step.component';
import { RepeatStepComponent } from '../script-steps/repeat-step/repeat-step.component';
*/
import { ActivatedRoute } from '@angular/router';
import { NestedFlowComponent } from '../nested-flow/nested-flow.component';
import { ProcessStepComponent } from '../script-steps/process-step/process-step.component';
import { StepInfo } from '../interfaces/stepInfo'
import { ExecutionSupportService } from '../services/execution-support.service';
import { StepEditorCommunicationService } from '../services/step-editor-communication.service';
import { CustomizationSupportService } from '../services/customization-support.service';
import { ApplicationRef } from '@angular/core';
import { WorkflowSupportService } from '../services/workflow-support.service';

@Component({
  selector: 'app-editor-canvas',
  templateUrl: './editor-canvas.component.html',
  styleUrls: ['./editor-canvas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StepEditorCommunicationService]
})

export class EditorCanvasComponent implements AfterViewInit {
  
  callbacks: NgFlowchart.Callbacks = {};
  options: NgFlowchart.Options = {
    stepGap: 40,
    rootPosition: 'TOP_CENTER',
    zoom: {
      mode: 'WHEEL',
      skipRender: true,
    },
    dragScroll: ['RIGHT', 'MIDDLE'],
    orientation: 'VERTICAL',
    manualConnectors: true,
  };

  @ViewChild('normalStep')
  normalStepTemplate!: TemplateRef<any>;

  //sampleJson = '{"root":{"id":"s1674421266194","type":"log","data":{"name":"Log","icon":{"name":"log-icon","color":"blue"},"config":{"message":null,"severity":null}},"children":[{"id":"s1674421267975","type":"log","data":{"name":"Log","icon":{"name":"log-icon","color":"blue"},"config":{"message":null,"severity":null}},"children":[{"id":"s1674421269738","type":"log","data":{"name":"Log","icon":{"name":"log-icon","color":"blue"},"config":{"message":null,"severity":null}},"children":[]}]},{"id":"s1674421268826","type":"log","data":{"name":"Log","icon":{"name":"log-icon","color":"blue"},"config":{"message":null,"severity":null}},"children":[]}]},"connectors":[{"startStepId":"s1674421269738","endStepId":"s1674421268826"}]}';
  sampleJson = '{"root": {"id": "s1715319429481","type": "process-step","data": {"name": "Read CSV file","prompt": "","pythonCode": "\\n\\nimport pandas as pd\\n\\n# Define the path to your CSV file\\nfile_path = r\\"E:\\\\testfield\\\\python\\\\iristest\\\\data\\\\iris.csv\\"  # Replace \'your_file.csv\' with the actual file name\\n\\n# Read the CSV file into a Pandas DataFrame\\ndf = pd.read_csv(file_path)\\n\\n# Display the DataFrame to verify the content\\nprint(df)\\n","loopOver": "", "focused": false, "id": 26 }, "children": [ { "id": "s1717202813288", "type": "process-step", "data": { "name": "Count df rows", "prompt": "", "pythonCode": "\\n# Using the shape attribute\\nnum_rows_shape = df.shape[0]\\nprint(f\\"Number of rows using shape: {num_rows_shape}\\")\\n\\n# Using the len() method\\nnum_rows_len = len(df)\\nprint(f\\"Number of rows using len: {num_rows_len}\\")\\n","loopOver": "","focused": true,"id": 27},"children": []}]},"connectors": []}'
  defaultJson = '{"connectors": []}'
  
  processStepOp: StepInfo = {
    paletteName: 'Process Step',
      step: {
        template: ProcessStepComponent,
        type: 'process-step',
        data: {
          name: 'Process Step',
          prompt: '',
          pythonCode: '',
          loopOver: '',
          focused: false,
          id: 0
        },
        icon: 'bi bi-terminal'
      }
  }
/*
  conditionalStepOp: StepInfo = {
    paletteName: 'Conditional Step',
      step: {
        template: ProcessStepComponent,
        type: 'conditional-step',
        data: {
          name: 'Conditional Step',
          prompt: '',
          pythonCode: '',
          loopOver: '',
          focused: false
        },
        icon: 'bi bi-list-check'
      }
  }

  repetaticeStepOp: StepInfo = {
    paletteName: 'Repetative Step',
      step: {
        template: ProcessStepComponent,
        type: 'repetative-step',
        data: {
          name: 'Repetative Step',
          prompt: '',
          pythonCode: '',
          loopOver: '',
          focused: false
        },
        
        icon: 'bi bi-repeat'
      }
  }
*/
  customOps = [
    this.processStepOp
    /*
    this.conditionalStepOp,
    this.repetaticeStepOp
    */
  ];

  @ViewChild(NgFlowchartCanvasDirective)
  canvas: NgFlowchartCanvasDirective | undefined;

  disabled = false;
  workflowNameInEdit = false;
  workflowName = 'My Workflow';
  workflowDescription = 'This is the description.';

  // The choosen processor to delete
  stepToDelete: StepInfo = this.processStepOp;

  ngAfterViewInit() {
    // this.stepRegistry.registerStep('rest-get', this.normalStepTemplate);
    //this.stepRegistry.registerStep('log', this.normalStepTemplate);
    //this.stepRegistry.registerStep('router', CustomStepComponent);
    //this.stepRegistry.registerStep('nested-flow', NestedFlowComponent);
    //this.stepRegistry.registerStep('form-step', FormStepComponent);
    //this.stepRegistry.registerStep('route-step', RouteStepComponent);
    this.stepRegistry.registerStep('process-step', ProcessStepComponent);
    this.loadWorkflow();
    this.loadCustomizedSteps();
  }

  constructor(private stepRegistry: NgFlowchartStepRegistry, 
    private executionSupportService: ExecutionSupportService,
    private customizationSupportService: CustomizationSupportService, 
    private eleRef: ElementRef, 
    private stepEditorCommunicationService: StepEditorCommunicationService,
    private appRef: ApplicationRef,
    private workflowSupportService: WorkflowSupportService,
    private route: ActivatedRoute,
  ) {
    this.callbacks.onDropError = this.onDropError;
    this.callbacks.onMoveError = this.onMoveError;
    this.callbacks.afterDeleteStep = this.afterDeleteStep;
    this.callbacks.beforeDeleteStep = this.beforeDeleteStep;
    this.callbacks.onLinkConnector = this.onLinkConnector;
    this.callbacks.afterDeleteConnector = this.afterDeleteConnector;
    this.callbacks.afterScale = this.afterScale.bind(this);

    //Inter-component communication
    stepEditorCommunicationService.customizeStep$.subscribe(
      stepInfo => {
        
        this.addCustomizedStep(stepInfo);
      }
    )
  }

  onDropError(error: NgFlowchart.DropError): void {
    console.log(error);
  }

  onMoveError(error: NgFlowchart.MoveError): void {
    console.log(error);
  }

  beforeDeleteStep(step: any): void {
    console.log(JSON.stringify(step.children));
  }

  afterDeleteStep(step: any): void {
    console.log(JSON.stringify(step.children));
  }

  onLinkConnector(conn: any): void {
    console.log(conn);
  }

  afterDeleteConnector(conn: any): void {
    console.log(conn);
  }

  afterScale(scale: number): void {
    if (this.canvas) {
      //realistically you want to recursively get all steps in canvas
      const firstSetOfChildren = this.canvas.getFlow().getRoot().children;
      firstSetOfChildren.forEach(step => {
        if (step instanceof NestedFlowComponent) {
          step.nestedCanvas?.setNestedScale(scale);
        }
      });
    }
    
  }

  loadWorkflow(): void {
    const workflowID = Number(this.route.snapshot.paramMap.get('workflowID'));
    let workflowJson;
    //load workflow Json
    this.workflowSupportService.requestForWorkflowByID(workflowID).subscribe(response => {
      workflowJson = response.data.workflow.workflow_json;
      this.workflowDescription = response.data.workflow.description;
      this.workflowName = response.data.workflow.workflow_name;
      this.canvas?.getFlow().upload(workflowJson);
    })

    if(!workflowJson) {
      this.canvas?.getFlow().upload(this.defaultJson);
    }

    
  }

  showFlowData(): void {
    let json = this.canvas?.getFlow().toJSON(4);

    var x = window.open();
    x?.document.open();
    x?.document.write(
      '<html><head><title>Flowchart Json</title></head><body><pre>' +
        json +
        '</pre></body></html>'
    );
    x?.document.close();
  }

  clearData(): void {
    this.canvas?.getFlow().clear();
  }

  onGapChanged(selectValue: string): void {
    this.options = {
      ...this.canvas?.options,
      stepGap: parseInt(selectValue),
    };
  }

  onSequentialChange(inputValue: boolean): void {
    this.options = {
      ...this.canvas?.options,
      isSequential: inputValue
    };
  }

  onOrientationChange(inputValue: boolean): void{
    this.canvas?.setOrientation(
      inputValue ? 'HORIZONTAL' : 'VERTICAL'
    );
  }

  onDelete(id: any) {
    this.canvas?.getFlow().getStep(id).destroy(true);
  }
  onGrow(): void {
    this.canvas?.scaleUp();
  }
  onShrink(): void  {
    this.canvas?.scaleDown();
  }
  onReset(): void {
    this.canvas?.setScale(1);
  }

  executeAll():void {
    if(this.canvas) {
      //EXECUTE_ALL, EXECUTE_STEP, EXECUTE_ALL_SINCE
      this.executionSupportService.requestExection('EXECUTE_ALL', this.canvas?.getFlow().toJSON(4)).subscribe(data => {
        console.log(data)
      });
    }
  }

  executeStep():void {
    if(this.canvas) {
      //EXECUTE_ALL, EXECUTE_STEP, EXECUTE_ALL_SINCE
      this.executionSupportService.requestExection('EXECUTE_STEP', this.canvas?.getFlow().toJSON(4)).subscribe(data => {
        console.log(data)
      });
    }
  }

  executeAllSince():void {
    if(this.canvas) {
      //EXECUTE_ALL, EXECUTE_STEP, EXECUTE_ALL_SINCE
      this.executionSupportService.requestExection('EXECUTE_ALL_SINCE', this.canvas?.getFlow().toJSON(4)).subscribe(data => {
        console.log(data)
      });
    }
  }

  editWorkflowName(): void {
    this.workflowNameInEdit = !this.workflowNameInEdit;
    if(this.workflowNameInEdit) {
      setTimeout(() => {
        this.eleRef.nativeElement.querySelector('#workflowNameInput').focus();
      }, 100)
    }

  }

  saveWorkflow():void {
    if(this.canvas) {
      this.workflowSupportService.requestSaveWorkflow(0, this.workflowName, this.workflowDescription, this.canvas?.getFlow().toJSON(4), 1)
      .subscribe(response => {
        console.log(response)
      });
    
    }
  }

  loadCustomizedSteps(): void {
    this.customizationSupportService.requestForAllSteps().subscribe(response => {
      for (let eachProcessor of response.data.processors) {
        let currentStep: StepInfo = {
          paletteName: eachProcessor.name,
            step: {
              template: ProcessStepComponent,
              type: 'process-step',
              data: {
                name: eachProcessor.name,
                prompt: eachProcessor.prompt,
                pythonCode: eachProcessor.pythonCode,
                loopOver: eachProcessor.loopOver,
                focused: false,
                id: eachProcessor.id
              },
              icon: 'bi bi-terminal'
            }
        }

        this.customOps.push(currentStep)
      }
    })
  }

  addCustomizedStep(stepInfo: StepInfo): void {
     
    this.customizationSupportService.requestSaveStep(stepInfo, 1).subscribe(response => {

      if(response.data.processorID) {
        stepInfo.step.data.id = response.data.processorID;

        
        this.customOps.push(stepInfo);
      }
      this.appRef.tick();
    })
  }
  
  deleteCustomizedStep(customizedStepId: number) {
    this.customizationSupportService.requestDeleteStep(customizedStepId).subscribe(response => {
      console.log(response);
      //Refresh the processor list
      this.customOps = [
        this.processStepOp
      ];
      this.loadCustomizedSteps();
      this.appRef.tick();
    })
  }
}


