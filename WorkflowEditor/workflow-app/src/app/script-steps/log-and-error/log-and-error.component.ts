import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-log-and-error',
  templateUrl: './log-and-error.component.html',
  styleUrls: ['./log-and-error.component.css']
})
export class LogAndErrorComponent {

  @Input({required: true}) logStr!: string;
  @Input({required: true}) errorStr!: string;
  @Output() closeEvent = new EventEmitter();

  closeModal(): void {
    this.closeEvent.emit();
  }
}
