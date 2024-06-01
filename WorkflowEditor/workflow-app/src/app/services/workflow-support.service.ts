import { Injectable } from '@angular/core';
import { CommonRequestService } from './common-request.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ResponseFromBack } from '../interfaces/responseFromBack';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkflowSupportService extends CommonRequestService {

  private getAllWorkflowInfoUrl = environment.baseServerUrl + '/flowchartagent/getallworkflows';
  private getWorkflowByIDUrl = environment.baseServerUrl + '/flowchartagent/getworkflowbyid/';
  private saveWorkflowUrl = environment.baseServerUrl + '/flowchartagent/saveworkflow';
  private deleteWorkflowUrl = environment.baseServerUrl + '/flowchartagent/deleteworkflow/';

  requestForAllWorkflows(): Observable<ResponseFromBack> {
    return this.http.get<any>(this.getAllWorkflowInfoUrl)
  }

  requestForWorkflowByID(workflowID: number): Observable<ResponseFromBack> {
    let url = this.getWorkflowByIDUrl + workflowID;
    return this.http.get<any>(url)
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

  
  requestDeleteWorkflowByID(workflowID: number): Observable<ResponseFromBack> {
    let url = this.deleteWorkflowUrl + workflowID;
    let subscribe = this.http.delete<ResponseFromBack>(url);
    return subscribe
    .pipe(
      tap(() => this.log('Received a reply.')),
      catchError(this.handleError<ResponseFromBack>('delete error'))
    );
  }

}
