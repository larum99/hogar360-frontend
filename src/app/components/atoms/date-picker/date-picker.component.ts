import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent {
  @Input() label!: string;
  @Input() control!: FormControl<string | null>;
  @Input() id: string = '';
  @Input() required: boolean = false;
  @Input() placeholder: string = '';

  getErrorMessage(): string {
  if (this.control.errors?.['required']) {
    return 'Este campo es requerido.';
  }

  if (this.control.errors?.['notAdult']) {
    return 'Debes ser mayor de edad.';
  }

  return 'Campo inválido.';
}

}
