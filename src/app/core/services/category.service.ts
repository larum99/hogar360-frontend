import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../shared/models/category.model';
import { environment } from 'src/environments/environment';
import { PageResult } from '../../shared/models/page-result.model';
import { DEFAULT_PAGINATION } from '../../shared/constants/pagination.constants';
import { buildPaginationParams } from '../../shared/utils/http-params.util';
import { ApiResponse } from 'src/app/shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = environment.housesApiUrl;
  private readonly http = inject(HttpClient);

  createCategory(data: Category): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/category/`, data);
  }

  getCategories(
    page: number = DEFAULT_PAGINATION.PAGE,
    size: number = DEFAULT_PAGINATION.SIZE
  ): Observable<PageResult<Category>> {
    const params = buildPaginationParams(page, size);
    return this.http.get<PageResult<Category>>(`${this.apiUrl}/category/`, { params });
  }
}
