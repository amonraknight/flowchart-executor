export interface StepInfo {
    paletteName: string;
    step: {
        template: any;
        type: string,
        data: {
          name: string,
          prompt: string,
          pythonCode: string,
          subworkflowId: number,
          focused: boolean,
          id: number,
          log: string,
          error: string,
          hasError: number
        },
        icon: string
    }
}