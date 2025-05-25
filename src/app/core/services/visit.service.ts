import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { Visit } from 'src/app/shared/models/visit.model';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private readonly apiUrl = environment.visitsApiUrl;
  private readonly http = inject(HttpClient);

  createVisit(data: Visit): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/visits/`, data);
  }
}
