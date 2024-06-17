import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { WorkflowSupportService } from 'src/app/services/workflow-support.service';

@Component({
  selector: 'app-subworkflow-selector',
  templateUrl: './subworkflow-selector.component.html',
  styleUrls: ['./subworkflow-selector.component.css']
})
export class SubworkflowSelectorComponent implements OnInit {

  @Input({required: true}) data!: any;
  @Output() closeEvent = new EventEmitter();

  showChat = false;
  workflows: any[] = [];
  choosenWorkflow: any;
  
  constructor(
    private workflowSupportService: WorkflowSupportService,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.workflowSupportService.requestForAllWorkflows().subscribe(response => {
      // Refresh all items from backend.
      this.workflows = response.data.workflows;

      this.cdr.detectChanges();
    })
  }

  closeModal(): void {
    this.closeEvent.emit();
  }

}
