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

    if (this.control.errors?.['maxOneMonth']) {
      return 'La fecha no puede exceder un mes desde hoy.';
    }

    if (this.control.errors?.['pastDate']) {
      return 'Debe seleccionar una fecha igual o posterior a la fecha actual.';
    }

    return 'Campo inválido.';
  }
}
