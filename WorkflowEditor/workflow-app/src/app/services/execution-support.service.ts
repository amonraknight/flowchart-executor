import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExecutionResult } from '../interfaces/executionResult';
import { ExecuteRequestBody } from '../interfaces/executeRequestBody';
import { catchError, tap } from 'rxjs/operators';
import { CommonRequestService } from './common-request.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExecutionSupportService extends CommonRequestService {
  
  // For test
  // private executionUrl = 'api/result';
  private executionUrl = environment.baseServerUrl + '/flowchartagent/executescript';
  private saveWorkflowUrl = environment.baseServerUrl + '/flowchartagent/saveworkflow';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  requestExection(exeType: string, wholeFlow: string): Observable<ExecutionResult> {
    
    let executionRequest: ExecuteRequestBody = {
      executionType: exeType,
      flow: wholeFlow
    }
    let subscribe = this.http.post<ExecutionResult>(this.executionUrl, executionRequest, this.httpOptions);
    return subscribe
    .pipe(
      tap(() => this.log('Seceived a reply.')),
      catchError(this.handleError<ExecutionResult>('post error'))
    );
  }
  
  requestSaveWorkflow(workflowName: string, wholeFlow: string): Observable<ExecutionResult> {
    let saveRequest = {
      workflowName: workflowName,
      flow: wholeFlow
    }
    let subscribe = this.http.post<ExecutionResult>(this.saveWorkflowUrl, saveRequest, this.httpOptions);
    return subscribe
    .pipe(
      tap(() => this.log('Seceived a reply.')),
      catchError(this.handleError<ExecutionResult>('post error'))
    );
  }

}
