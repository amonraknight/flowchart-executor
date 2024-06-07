import { Component } from '@angular/core';
import { WorkflowSupportService } from '../services/workflow-support.service';

@Component({
  selector: 'app-workflow-list',
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.css']
})
export class WorkflowListComponent {

  constructor(private workflowSupportService: WorkflowSupportService) {

  }

  workflows: any = [];
  confirmModalOn = false;
  workflowToDelete: any;

  noticeModalOn = false;
  noticeModalContent = "";

  ngAfterViewInit() {
    this.getAllWorkflowInfo();
  }


/*
Data structure of workflow base info:
workflowDict = {
  'workflow_id': eachWorkflow.workflow_id,
  'workflow_name': eachWorkflow.workflow_name,
  'description': eachWorkflow.description,
  'creater_id': eachWorkflow.creater_id,
  'create_date': eachWorkflow.create_date,
  'update_date': eachWorkflow.update_date
}
*/

  getAllWorkflowInfo(): void {
    this.workflowSupportService.requestForAllWorkflows().subscribe(response => {
      // Refresh all items from backend.
      this.workflows = response.data.workflows;
    })
  }

  deleteWorkflow(workflowID: number): void {
    this.workflowSupportService.requestDeleteWorkflowByID(workflowID).subscribe(response => {
      console.log(response);
      this.getAllWorkflowInfo();
      this.noticeModalContent = "Workflow deleted."
      this.noticeModalOn = true;
      
    })
  }

  confirmDeleteWorkflow(choice: boolean): void {
    if (choice) {
      this.deleteWorkflow(this.workflowToDelete.workflow_id);
    }

    this.confirmModalOn = false;
  }
}
