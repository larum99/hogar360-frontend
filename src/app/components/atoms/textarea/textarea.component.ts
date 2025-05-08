import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl<string | null>;

  textareaId: string = '';

  ngOnInit(): void {
    this.textareaId = this.generateUniqueId();
  }

  private generateUniqueId(): string {
    return 'textarea-' + Math.random().toString(36).substring(2, 9);
  }

  getErrorMessage():string {
    return this.control.errors?.['required'] ? 'Este campo es requerido' : 'Excediste el numero máximo de caracteres (Máximo 50 caracteres)'
  }
}
