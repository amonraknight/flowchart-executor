import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  @Input() bodyText?: String;
  @Output() confirmEvent = new EventEmitter<boolean>();

  confirm(choice: boolean): void {
    this.confirmEvent.emit(choice)
  }
}
