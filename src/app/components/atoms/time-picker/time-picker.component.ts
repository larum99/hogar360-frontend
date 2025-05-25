import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimePickerComponent implements OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl<string | null>;

  inputId: string = '';

  ngOnInit(): void {
    this.inputId = this.generateUniqueId();
  }

  private generateUniqueId(): string {
    return 'time-picker-' + Math.random().toString(36).substring(2, 9);
  }

  getErrorMessage(): string {
    if (this.control.errors?.['required']) {
      return 'Este campo es requerido';
    }
    return '';
  }
}
