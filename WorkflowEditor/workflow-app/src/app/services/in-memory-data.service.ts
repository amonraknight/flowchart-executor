import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo, STATUS } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const ai = {
      
    };
    const result = {

    };
    return {ai, result};
  }

  post(reqInfo: RequestInfo) {
    // 获取请求的URL和body
    const collectionName = reqInfo.collectionName;
    let body = reqInfo.utils.getJsonBody(reqInfo.req) || {};
    console.log("Received post request. " + collectionName);
    console.log(body);

    if(collectionName=='ai') {
      return reqInfo.utils.createResponse$(() => {
        const res = this.createMockChatResponseAi(body);
        return this.addDelay(res, 2000);
      });
    }
    else if(collectionName=='result') {
      console.log('Called collectionName.');
      return reqInfo.utils.createResponse$(() => {
        const res = this.createExecutionResponseAi(body);
        return this.addDelay(res, 5000);
      });
    } else {
      return reqInfo.utils.createResponse$(() => {
        let res = {
          status: STATUS.OK
        }
        return this.addDelay(res, 0);
      });
    }
    
  }

  private createMockChatResponseAi(body: any) {
    body = {
      "codereply": "# Assuming the data is already loaded into the variable 'dataframe'\n\nclass_counts = dataframe['Class'].value_counts().to_dict()",
      "messagereply": "This is the message reply." 
    }
    return {
      status: STATUS.OK,
      body
    };
  }

  private createExecutionResponseAi(body: any) {
    body = {
      "message": "Scripts executed successfully.",
		  "log": "This is the log message."
    }
    return {
      status: STATUS.OK,
      body
    };
  }

  private addDelay(response: any, waitTime: number) {
    setTimeout(() => {
      
    }, waitTime);
    return response;
  }
}
