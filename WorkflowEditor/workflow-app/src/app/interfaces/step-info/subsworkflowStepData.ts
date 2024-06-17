import { StepInfoData } from "./stepInfoData";

export interface SubworkflowStepData extends StepInfoData {
    subworkflowId: number;
    subWorkflowName: string;
}