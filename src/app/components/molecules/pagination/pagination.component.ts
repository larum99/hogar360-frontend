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
    const range: (number | null)[] = [];

    if (this.totalPages <= 1) {
      this.pageNumbers = [0];
      return;
    }

    const firstPage = 0;
    const lastPage = this.totalPages - 1;
    let left = this.currentPage - 1;
    let right = this.currentPage + 1;

    left = Math.max(left, 1);
    right = Math.min(right, lastPage - 1);

    if (this.currentPage <= 1) {
      right = Math.min(2, lastPage - 1);
    }
    if (this.currentPage >= lastPage - 1) {
      left = Math.max(lastPage - 2, 1);
    }

    range.push(firstPage);

    if (left > firstPage + 1) {
      range.push(null);
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < lastPage - 1) {
      range.push(null);
    }

    range.push(lastPage);

    this.pageNumbers = range;
  }

  goToPage(page: number): void {
    if (
      page !== null &&
      page >= 0 &&
      page < this.totalPages &&
      page !== this.currentPage
    ) {
      this.pageChange.emit(page);
    }
  }
}
