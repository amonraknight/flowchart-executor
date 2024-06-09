export interface StepInfo {
    paletteName: string;
    step: {
        template: any;
        type: string,
        data: {
          name: string,
          prompt: string,
          pythonCode: string,
          focused: boolean,
          id: number,
          log: string,
          error: string,
          hasError: number
        },
        icon: string
    }
}