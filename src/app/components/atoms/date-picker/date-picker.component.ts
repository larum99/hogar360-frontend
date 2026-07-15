import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  @Input() label!: string;
  @Input() control!: FormControl<string | null>;
  @Input() id?: string;
  @Input() placeholder: string = '';

  generatedId: string = '';

  ngOnInit(): void {
    this.generatedId = this.id || this.generateUniqueId();
  }

  private generateUniqueId(): string {
    return 'date-picker-' + Math.random().toString(36).substring(2, 9);
  }

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
    if (this.control.errors?.['outOfRange']) {
      return 'La fecha debe estar dentro de las próximas tres semanas.';
    }
    if (this.control.errors?.['tooEarly']) {
      return 'Debe seleccionar una fecha posterior.';
    }

    return 'Campo inválido.';
  }
}
