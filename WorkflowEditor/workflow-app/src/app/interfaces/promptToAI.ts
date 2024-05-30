import { ChatMessage } from "./chatMessage";

export interface PromptToAI {
    predecessorScripts: string[];
    messages: ChatMessage[];
}