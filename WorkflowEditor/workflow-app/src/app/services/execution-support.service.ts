import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExecuteRequestBody } from '../interfaces/executeRequestBody';
import { catchError, tap } from 'rxjs/operators';
import { CommonRequestService } from './common-request.service';
import { environment } from 'src/environments/environment';
import { ResponseFromBack } from '../interfaces/responseFromBack';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class ExecutionSupportService extends CommonRequestService {
  
  // For test
  // private executionUrl = 'api/result';
  private executionUrl = environment.baseServerUrl + '/flowchartagent/executescript';
  private getCustomizedStepUrl = environment.wsServiceUrl + '/ws/socketservice/1';

  private chatSocket: WebSocketSubject<any> = new WebSocketSubject(this.getCustomizedStepUrl);

  requestExection(exeType: string, wholeFlow: string): Observable<ResponseFromBack> {
    
    let executionRequest: ExecuteRequestBody = {
      executionType: exeType,
      flow: wholeFlow,
      clientID: 1   // Hard code the client ID.
    }
    let subscribe = this.http.post<ResponseFromBack>(this.executionUrl, executionRequest, this.httpOptions);
    return subscribe
    .pipe(
      tap(() => this.log('Received a reply.')),
      catchError(this.handleError<ResponseFromBack>('post error'))
    );
  }

  receiveMessage(): Observable<any> {
    return this.chatSocket.asObservable();
  }

}
