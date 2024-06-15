import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChatSupportService } from 'src/app/services/chat-support.service';
import { ChatMessage } from 'src/app/interfaces/chatMessage'; 

@Component({
  selector: 'app-script-editor',
  templateUrl: './script-editor.component.html',
  styleUrls: ['./script-editor.component.css']
})
export class ScriptEditorComponent {
  constructor(private chatSupportService: ChatSupportService) { }

  @Input({required: true}) predecessorSteps!: string[];
  @Input({required: true}) data!: any;
  @Output() closeEvent = new EventEmitter();
  @Output() saveStepEvent = new EventEmitter<any>();

  userInput!: string
  showChat = false;
  messages: ChatMessage[] = [];

  closeModal(): void {
    this.closeEvent.emit();
  }

  saveAsCustomizedStep(): void {
    this.saveStepEvent.emit();
  }

  openChat(): void {
    this.showChat = true
  }

  closeChat(): void {
    this.showChat = false
  }

  renewScript(script: string): void {
    this.data.pythonCode = script;
  }

  sendMessage(): void {
    let userMessage: ChatMessage = {
      role: 'user',
      content: this.userInput
    };
    this.messages.push(userMessage);
    this.userInput = '';

    this.chatSupportService.sendMessages(this.predecessorSteps, this.messages)
      .subscribe(response => {
        //console.log(data)
        let assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.data.messagereply
        };
        this.messages.push(assistantMessage);
        this.renewScript(response.data.codereply);
      });
  }
}
