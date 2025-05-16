import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.usersApiUrl;

  constructor(private readonly http: HttpClient) {}

  createSeller(data: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/`, data);
  }
}
