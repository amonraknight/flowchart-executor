export interface ExecuteRequestBody {
    //EXECUTE_ALL, EXECUTE_STEP, EXECUTE_ALL_SINCE
    executionType: string;
    flow: string;
    clientID: number;
}