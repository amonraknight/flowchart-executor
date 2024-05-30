import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonRequestService } from './common-request.service';
import { environment } from 'src/environments/environment';
import { ExecutionResult } from '../interfaces/executionResult';
import { catchError, tap } from 'rxjs/operators';
import { StepInfo } from '../interfaces/stepInfo';
import { ResponseFromBack } from '../interfaces/responseFromBack';


@Injectable({
  providedIn: 'root'
})

//This service supports the reading and saving of customized steps and workflows.

export class CustomizationSupportService extends CommonRequestService {

  private getCustomizedStepUrl = environment.baseServerUrl + '/flowchartagent/getallsteps';
  private getAllWorkflowsUrl = environment.baseServerUrl + '/flowchartagent/saveworkflow';
  private getWorkflowByID = environment.baseServerUrl + '/flowchartagent/getworkflowbyid/';
  private saveCustomizedStepUrl = environment.baseServerUrl + '/flowchartagent/savestep';
  private saveWorkflowUrl = environment.baseServerUrl + '/flowchartagent/saveworkflow';
  private deleteStepUrl = environment.baseServerUrl + '/flowchartagent/deletestep/';
  private deleteWorkflowUrl = environment.baseServerUrl + '/flowchartagent/deleteworkflow/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  requestForAllSteps(): Observable<any> {
    return this.http.get<any>(this.getCustomizedStepUrl)
  }

  requestForAllWorkflows(): Observable<any> {
    return this.http.get<any>(this.getAllWorkflowsUrl)
  }

  requestForWorkflowByID(workflowID: number): Observable<any> {
    let url = this.getWorkflowByID + workflowID;
    return this.http.get<any>(url)
  }

  requestSaveStep(stepInfo: StepInfo, createrID: number ): Observable<ResponseFromBack> {
    
    let saveStepRequest = {
      processorName: stepInfo.step.data.name,
	    createrID: createrID,
	    data: stepInfo.step.data,
      id: stepInfo.step.data.id
    }
    let subscribe = this.http.post<ResponseFromBack>(this.saveCustomizedStepUrl, saveStepRequest, this.httpOptions);
    return subscribe
    .pipe(
      tap(() => this.log('Received a reply.')),
      catchError(this.handleError<ResponseFromBack>('post error'))
    );
  }

  requestSaveWorkflow(workflowID: number, workflowName: string, description: string, workflowJson: string, createrID: number): Observable<ResponseFromBack> {

    let saveWorkflowRequest = {
      workflowID: workflowID, 
      workflowName: workflowName, 
      description: description, 
      workflowJson: workflowJson, 
      createrID: createrID
    }

    let subscribe = this.http.post<ResponseFromBack>(this.saveWorkflowUrl, saveWorkflowRequest, this.httpOptions);
    return subscribe
    .pipe(
      tap(() => this.log('Received a reply.')),
      catchError(this.handleError<ResponseFromBack>('post error'))
    );
  }

  requestDeleteStep(processorID: number): Observable<ResponseFromBack> {
    let url = this.deleteStepUrl + processorID;
    let subscribe = this.http.delete<ResponseFromBack>(url);
    return subscribe
    .pipe(
      tap(() => this.log('Received a reply.')),
      catchError(this.handleError<ResponseFromBack>('delete error'))
    );
  }
  
  requestWorkflowStep(processorID: number): Observable<ResponseFromBack> {
    let url = this.deleteWorkflowUrl + processorID;
    let subscribe = this.http.delete<ResponseFromBack>(url);
    return subscribe
    .pipe(
      tap(() => this.log('Received a reply.')),
      catchError(this.handleError<ResponseFromBack>('delete error'))
    );
  }

}
