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
  @Input() required: boolean = true;
  @Input() control: FormControl = new FormControl();

  selectId: string = '';

  ngOnInit(): void {
    this.selectId = this.generateUniqueId();
  }

  private generateUniqueId(): string {
    return 'select-' + Math.random().toString(36).substring(2, 9);
  }
}
