import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HouseCreation } from '../../shared/models/house-creation.model';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private readonly apiUrl = environment.housesApiUrl;
  private readonly http = inject(HttpClient);

  createHouse(data: HouseCreation): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/house/`, data);
  }
}
