import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChatSupportService } from '../services/chat-support.service';
import { ChatMessage } from '../interfaces/chatMessage';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent {
  constructor(private chatSupportService: ChatSupportService) { }

  userInput!: string

  messages: ChatMessage[] = [];
  //The python scripts from the predecessors, the lower the index, the closer to the current step.
  @Input({required: true}) predecessorSteps!: string[];
  @Output() renewScriptEvent = new EventEmitter<string>();

  renewScript(script: string): void {
    this.renewScriptEvent.emit(script);
  }

  sendMessage() {
    let userMessage: ChatMessage = {
      role: 'user',
      content: this.userInput
    };
    this.messages.push(userMessage);
    this.userInput = '';

    this.chatSupportService.sendMessages(this.predecessorSteps, this.messages)
      .subscribe(data => {
        //console.log(data)
        let assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.messagereply
        };
        this.messages.push(assistantMessage);
        this.renewScript(data.codereply);
      });
  }

  

  
}
