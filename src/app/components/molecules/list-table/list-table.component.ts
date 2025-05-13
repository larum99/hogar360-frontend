import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TableColumn } from 'src/app/shared/models/table-column.model';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.scss']
})
export class ListTableComponent<T extends object> {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() noDataMessage: string = 'No hay datos disponibles.';

  @Input() sortBy: string = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  @Output() sortChange = new EventEmitter<{ sortBy: string, sortDirection: 'asc' | 'desc' }>();

  faArrowUp: IconDefinition = faArrowUp;
  faArrowDown: IconDefinition = faArrowDown;

  onSort(column: TableColumn<T>): void {
    if (!column.sortable || !column.sortField) return;

    const isSameField = this.sortBy === column.sortField;
    const newDirection = isSameField && this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.sortChange.emit({
      sortBy: column.sortField,
      sortDirection: newDirection
    });
  }
}
