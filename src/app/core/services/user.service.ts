import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { UserSimple } from '../../shared/models/user-simple.model';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.usersApiUrl;
  private readonly http = inject(HttpClient);

  createSeller(data: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/users/`, data);
  }

  getUserById(id: number): Observable<UserSimple> {
    return this.http.get<UserSimple>(`${this.apiUrl}/users/${id}`);
  }
}
