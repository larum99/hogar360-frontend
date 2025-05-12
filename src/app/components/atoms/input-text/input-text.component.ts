import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent implements OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl<string | null>;
  @Input() required: boolean = true;

  inputId: string = '';

  ngOnInit(): void {
    this.inputId = this.generateUniqueId();
  }

  private generateUniqueId(): string {
    return 'input-text-' + Math.random().toString(36).substring(2, 9);
  }

  getErrorMessage():string {
    return this.control.errors?.['required'] ? 'Este campo es requerido' : 'Excediste el numero máximo de caracteres (Máximo 50 caracteres)'
  }
}
