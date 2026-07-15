import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @Input() label: string = '';
  @Input() options: { value: string | number, label: string }[] = [];
  @Input() control: FormControl = new FormControl();
  @Input() required: boolean = true;
  @Input() showErrorSpace: boolean = true;
  @Input() showLabelSpace: boolean = true;

  selectId: string = '';

  ngOnInit(): void {
    this.selectId = this.generateUniqueId();
  }

  private generateUniqueId(): string {
    return 'select-' + Math.random().toString(36).substring(2, 9);
  }

  getErrorMessage(): string {
    if (this.control.errors?.['required']) {
      return 'Este campo es requerido';
    }

    return '';
  }
}
