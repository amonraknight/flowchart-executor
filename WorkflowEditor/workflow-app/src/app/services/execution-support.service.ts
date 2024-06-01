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

}
