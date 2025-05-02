import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../components/models/category.model';
import { environment } from 'src/environments/environment.local';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  createCategory(data: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, data);
  }
}
