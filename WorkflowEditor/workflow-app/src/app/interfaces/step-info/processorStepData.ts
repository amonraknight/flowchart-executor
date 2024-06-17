import { StepInfoData } from "./stepInfoData";

export interface ProcessorStepData extends StepInfoData {
    prompt: string;
    pythonCode: string;
}