import { Component,  Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notice-modal',
  templateUrl: './notice-modal.component.html',
  styleUrls: ['./notice-modal.component.css']
})
export class NoticeModalComponent {
  @Input() bodyText?: String;
  @Output() closeEvent = new EventEmitter();

  closeModel(): void {
    this.closeEvent.emit();
  }

}
