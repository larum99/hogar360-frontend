import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TableColumn } from 'src/app/shared/models/table-column.model';

@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.scss']
})
export class ListTableComponent<T extends object> {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() noDataMessage: string = 'No hay datos disponibles.';

  @Output() action = new EventEmitter<{ actionType: string, element: T }>();

  onAction(actionType: string, element: T): void {
    this.action.emit({ actionType, element });
  }
}
