import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonRequestService } from './common-request.service';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { StepInfo } from '../interfaces/step-info/stepInfo';
import { ResponseFromBack } from '../interfaces/responseFromBack';


@Injectable({
  providedIn: 'root'
})

//This service supports the reading and saving of customized steps and workflows.

export class CustomizationSupportService extends CommonRequestService {

  private getCustomizedStepUrl = environment.baseServerUrl + '/flowchartagent/getallsteps';
  private saveCustomizedStepUrl = environment.baseServerUrl + '/flowchartagent/savestep';
  private deleteStepUrl = environment.baseServerUrl + '/flowchartagent/deletestep/';

  requestForAllSteps(): Observable<ResponseFromBack> {
    return this.http.get<any>(this.getCustomizedStepUrl)
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


  requestDeleteStep(processorID: number): Observable<ResponseFromBack> {
    let url = this.deleteStepUrl + processorID;
    let subscribe = this.http.delete<ResponseFromBack>(url);
    return subscribe
    .pipe(
      tap(() => this.log('Received a reply.')),
      catchError(this.handleError<ResponseFromBack>('delete error'))
    );
  }
  

}
