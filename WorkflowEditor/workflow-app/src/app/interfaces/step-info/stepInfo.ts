import { StepInfoData } from "./stepInfoData";

export interface StepInfo {
    paletteName: string;
    step: {
      template: any,
      type: string,
      data: StepInfoData,
      icon: string
  };
}