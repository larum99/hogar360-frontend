import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { Category } from 'src/app/shared/models/category.model';
import { Observable, BehaviorSubject, switchMap, catchError, of } from 'rxjs';
import { TableColumn } from 'src/app/shared/models/table-column.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);

  private readonly currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();

  categories$: Observable<PageResult<Category>> = this.currentPage$.pipe(
    switchMap((page) => this.categoryService.getCategories(page).pipe(
      catchError(error => {
        console.error('Error loading categories:', error);
        return of({
          content: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: page,
          pageSize: 0,
          isFirst: true,
          isLast: true
        });
      })
    ))
  );

  categoryTableColumns: TableColumn<Category>[] = [];

  ngOnInit(): void {
    this.defineCategoryColumns();
  }

  defineCategoryColumns(): void {
    this.categoryTableColumns = [
      { header: 'ID', cell: (element: Category) => element.id, cellClass: 'list-table__cell--id' },
      { header: 'Nombre', cell: (element: Category) => element.name, cellClass: 'list-table__cell--name' },
      { header: 'Descripción', cell: (element: Category) => element.description, cellClass: 'list-table__cell--description' },
    ];
  }

  onPageChange(page: number): void {
    this.currentPageSubject.next(page);
  }

  refreshCategories(): void {
    this.currentPageSubject.next(this.currentPageSubject.getValue());
  }
}
