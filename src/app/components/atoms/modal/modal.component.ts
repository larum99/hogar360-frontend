import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() visible = false;
  @Input() visitId!: number;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
