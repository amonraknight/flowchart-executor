import { AfterViewInit, Component, TemplateRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NgFlowchart, NgFlowchartStepRegistry, NgFlowchartCanvasDirective } from '@joelwenzel/ng-flowchart';
import { ActivatedRoute } from '@angular/router';
import { NestedFlowComponent } from '../nested-flow/nested-flow.component';
import { ProcessStepComponent } from '../script-steps/process-step/process-step.component';
import { SubworkflowStepComponent } from '../script-steps/subworkflow-step/subworkflow-step.component';
import { StepInfo } from '../interfaces/step-info/stepInfo'
import { ExecutionSupportService } from '../services/execution-support.service';
import { StepEditorCommunicationService } from '../services/step-editor-communication.service';
import { CustomizationSupportService } from '../services/customization-support.service';
import { WorkflowSupportService } from '../services/workflow-support.service';
import { ProcessorStepData } from '../interfaces/step-info/processorStepData';
import { SubworkflowStepData } from '../interfaces/step-info/subsworkflowStepData';
import { StepInfoData } from '../interfaces/step-info/stepInfoData';

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

  // sampleJson = '{"root":{"id":"s1674421266194","type":"log","data":{"name":"Log","icon":{"name":"log-icon","color":"blue"},"config":{"message":null,"severity":null}},"children":[{"id":"s1674421267975","type":"log","data":{"name":"Log","icon":{"name":"log-icon","color":"blue"},"config":{"message":null,"severity":null}},"children":[{"id":"s1674421269738","type":"log","data":{"name":"Log","icon":{"name":"log-icon","color":"blue"},"config":{"message":null,"severity":null}},"children":[]}]},{"id":"s1674421268826","type":"log","data":{"name":"Log","icon":{"name":"log-icon","color":"blue"},"config":{"message":null,"severity":null}},"children":[]}]},"connectors":[{"startStepId":"s1674421269738","endStepId":"s1674421268826"}]}';
  // sampleJson = '{"root": {"id": "s1715319429481","type": "process-step","data": {"name": "Read CSV file","prompt": "","pythonCode": "\\n\\nimport pandas as pd\\n\\n# Define the path to your CSV file\\nfile_path = r\\"E:\\\\testfield\\\\python\\\\iristest\\\\data\\\\iris.csv\\"  # Replace \'your_file.csv\' with the actual file name\\n\\n# Read the CSV file into a Pandas DataFrame\\ndf = pd.read_csv(file_path)\\n\\n# Display the DataFrame to verify the content\\nprint(df)\\n","loopOver": "", "focused": false, "id": 26 }, "children": [ { "id": "s1717202813288", "type": "process-step", "data": { "name": "Count df rows", "prompt": "", "pythonCode": "\\n# Using the shape attribute\\nnum_rows_shape = df.shape[0]\\nprint(f\\"Number of rows using shape: {num_rows_shape}\\")\\n\\n# Using the len() method\\nnum_rows_len = len(df)\\nprint(f\\"Number of rows using len: {num_rows_len}\\")\\n","loopOver": "","focused": true,"id": 27},"children": []}]},"connectors": []}'
  defaultJson = '{"connectors": []}'
  
  processStepData: ProcessorStepData = {
    name: 'Process Step',
    prompt: '',
    pythonCode: '',
    focused: false,
    id: 0,
    log: '',
    error: '',
    hasError: -1
  }

  processStepOp: StepInfo = {
    paletteName: 'Process Step',
      step: {
        template: ProcessStepComponent,
        type: 'process-step',
        data: this.processStepData,
        icon: 'bi bi-terminal'
      }
  }

  subWorkflowStepData: SubworkflowStepData = {
    name: 'Subworkflow Step',
    subworkflowId: -1,
    subWorkflowName: 'select a workflow...',
    focused: false,
    id: 0,
    log: '',
    error: '',
    hasError: -1,
    
  }

  subWorkflowStepOp: StepInfo = {
    paletteName: 'Subworkflow Step',
      step: {
        template: SubworkflowStepComponent,
        type: 'subworkflow-step',
        data: this.subWorkflowStepData,
        icon: 'bi bi-share'
      }
  }

  // The step lists.
  nativeOps: StepInfo[] = [
    this.processStepOp,
    this.subWorkflowStepOp
  ];
  customOps: StepInfo[] = [];

  @ViewChild(NgFlowchartCanvasDirective)
  canvas: NgFlowchartCanvasDirective | undefined;

  disabled = false;
  workflowNameInEdit = false;
  workflowID = 0
  workflowName = 'My Workflow';
  workflowDescription = 'This is the description.';
  // The flag controlling the visibility of the confirm modal.
  confirmModalOnDeleteStep = false;
  confirmModalOnClearCanvas = false;
  // The choosen processor to delete
  stepToDelete: StepInfo = this.processStepOp;

  noticeModalOn = false;
  noticeModalContent = '';

  ngAfterViewInit() {
    this.stepRegistry.registerStep('process-step', ProcessStepComponent);
    this.stepRegistry.registerStep('subworkflow-step', SubworkflowStepComponent);
    this.loadWorkflow();
    this.loadCustomizedSteps();
  }

  constructor(private stepRegistry: NgFlowchartStepRegistry, 
    private executionSupportService: ExecutionSupportService,
    private customizationSupportService: CustomizationSupportService, 
    private eleRef: ElementRef, 
    private stepEditorCommunicationService: StepEditorCommunicationService,
//   private appRef: ApplicationRef,
    private workflowSupportService: WorkflowSupportService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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

    if (workflowID) {
      
      //load workflow Json
      this.workflowSupportService.requestForWorkflowByID(workflowID).subscribe(response => {
        workflowJson = response.data.workflow.workflow_json;
        this.workflowDescription = response.data.workflow.description;
        this.workflowName = response.data.workflow.workflow_name;
        this.workflowID = response.data.workflow.workflow_id;
        this.canvas?.getFlow().upload(workflowJson);
      })
  
      
    }

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
      this.executionSupportService.requestExection('EXECUTE_ALL', this.canvas?.getFlow().toJSON(4)).subscribe(response => {
        console.log(response);
        
        // Load workflow
        this.canvas?.getFlow().upload(response.data);
        //Render
        this.cdr.detectChanges();
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
      this.workflowSupportService.requestSaveWorkflow(this.workflowID, this.workflowName, this.workflowDescription, this.canvas?.getFlow().toJSON(4), 1)
      .subscribe(response => {
        // console.log(response)
        this.noticeModalContent = "Workflow saved.";
        this.noticeModalOn = true;

        this.cdr.detectChanges();
      });
      
    }
  }

  loadCustomizedSteps(): void {
    this.customizationSupportService.requestForAllSteps().subscribe(response => {
      
      for (let eachProcessor of response.data.processors) {
        let ngFlowchartStepComponent: any;
        let stepInfoData: StepInfoData = {
          name: eachProcessor.name,
            focused: false,
            id: eachProcessor.id,
            log: '',
            error: '',
            hasError: -1
        };
        let iconStr: string = '';
        

        // Judge the step type.
        // console.log(eachProcessor);
        if (!eachProcessor.type || eachProcessor.type == 'process-step') {
          // console.log('Type is process-step.');
          eachProcessor.type = 'process-step'
          ngFlowchartStepComponent = ProcessStepComponent;
          let processorStepData: ProcessorStepData = {
            name: eachProcessor.name,
            focused: false,
            id: eachProcessor.id,
            log: '',
            error: '',
            hasError: -1,
            prompt: eachProcessor.prompt,
            pythonCode: eachProcessor.pythonCode
          }
          stepInfoData = processorStepData;
          iconStr = 'bi bi-terminal';
        }
        else if (eachProcessor.type == 'subworkflow-step') {
          /*
          * It is not allowed to save a customize a subworkflow step yet.
          */
          // console.log('Type is subworkflow-step.');
          ngFlowchartStepComponent = SubworkflowStepComponent;
          let subworkflowStepData: SubworkflowStepData = {
            name: eachProcessor.name,
            focused: false,
            id: eachProcessor.id,
            log: '',
            error: '',
            hasError: -1,
            subworkflowId: -1,
            subWorkflowName: ''
          }
          stepInfoData = subworkflowStepData;
          iconStr = 'bi bi-share';
        }

        let currentStep: StepInfo = {
          paletteName: eachProcessor.name,
            step: {
              template: ngFlowchartStepComponent,
              type: eachProcessor.type ?? 'process-step',
              data: stepInfoData,
              icon: iconStr
            }
        }
        // console.log(currentStep);

        this.customOps.push(currentStep);
      }
      // Force a render after subscribe.
      this.cdr.detectChanges();
    })
  }

  addCustomizedStep(stepInfo: StepInfo): void {
     
    this.customizationSupportService.requestSaveStep(stepInfo, 1).subscribe(response => {

      if(response.data.processorID) {
        stepInfo.step.data.id = response.data.processorID;

        this.customOps.push(stepInfo);
        this.noticeModalContent = "Customized step saved.";
        this.noticeModalOn = true;
      }
      
      this.cdr.detectChanges();
    })
  }
  
  deleteCustomizedStep(customizedStepId: number) {
    this.customizationSupportService.requestDeleteStep(customizedStepId).subscribe(response => {
      this.noticeModalContent = "Customized step deleted.";
      this.noticeModalOn = true;
      //Refresh the processor list
      this.customOps = [];
      this.loadCustomizedSteps();
      
    })
  }

  // Receive the output from the modal
  confirmDeleteCustomizedStep(choice: boolean) {
    if (choice) {
      // Confirm to delete.
      this.deleteCustomizedStep(this.stepToDelete.step.data.id);
      
    }
   
    this.confirmModalOnDeleteStep = false;
    
  }

  confirmClearFlow(choice: boolean) {
    if (choice) {
      // Confirm to delete.
      this.clearData();
      
    }
   
    this.confirmModalOnClearCanvas = false;
    
  }
}


