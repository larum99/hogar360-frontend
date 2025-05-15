import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;

  @Output() pageChange = new EventEmitter<number>();

  pageNumbers: (number | null)[] = [];

  constructor(faLibrary: FaIconLibrary) {
    faLibrary.addIcons(faChevronLeft, faChevronRight);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalPages'] || changes['currentPage']) {
      this.generatePageNumbers();
    }
  }

  private generatePageNumbers(): void {
    const delta = 1;
    const range: (number | null)[] = [];

    const left = Math.max(this.currentPage - delta, 1);
    const right = Math.min(this.currentPage + delta, this.totalPages - 2);

    range.push(0);

    if (left > 1) {
      range.push(null);
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < this.totalPages - 2) {
      range.push(null);
    }

    if (this.totalPages > 1) {
      range.push(this.totalPages - 1);
    }

    this.pageNumbers = range;
  }

  goToPage(page: number): void {
    if (page !== null && page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
