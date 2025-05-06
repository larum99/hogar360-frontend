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

  pageNumbers: number[] = [];

  constructor(faLibrary: FaIconLibrary) {
    faLibrary.addIcons(faChevronLeft, faChevronRight);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalPages']) {
      this.generatePageNumbers();
    }
  }

  private generatePageNumbers(): void {
    if (this.totalPages > 0) {
      this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i);
    } else {
      this.pageNumbers = [];
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
