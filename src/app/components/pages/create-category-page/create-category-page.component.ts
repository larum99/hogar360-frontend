import { Component, inject } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { Category } from 'src/app/shared/models/category.model';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-category-page',
  templateUrl: './create-category-page.component.html',
  styleUrls: ['./create-category-page.component.scss']
})
export class CreateCategoryPageComponent {
  private readonly categoryService = inject(CategoryService);

  private readonly currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();

  categories$: Observable<PageResult<Category>> = this.currentPage$.pipe(
    switchMap((page) => this.categoryService.getCategories(page))
  );

  onPageChange(page: number): void {
    this.currentPageSubject.next(page);
  }

  onCategoryCreated(): void {
    this.currentPageSubject.next(this.currentPageSubject.getValue());
  }
}
