import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../shared/models/category.model';
import { environment } from 'src/environments/environment';
import { PageResult } from '../../shared/models/page-result.model';
import { DEFAULT_PAGINATION } from '../../shared/constants/pagination.constants';
import { buildPaginationParams } from '../../shared/utils/http-params.util';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  createCategory(data: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, data);
  }

  getCategories(
    page: number = DEFAULT_PAGINATION.PAGE,
    size: number = DEFAULT_PAGINATION.SIZE
  ): Observable<PageResult<Category>> {
    const params = buildPaginationParams(page, size);
    return this.http.get<PageResult<Category>>(this.apiUrl, { params });
  }
}
