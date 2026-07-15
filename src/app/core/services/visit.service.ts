import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { Visit } from 'src/app/shared/models/visit.model';
import { VisitList } from 'src/app/shared/models/visit-list.model';
import { VisitFilters } from 'src/app/shared/models/visit-filters.model';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { buildPaginationParams } from 'src/app/shared/utils/http-params.util';
import { DEFAULT_PAGINATION } from 'src/app/shared/constants/pagination.constants';
import { VisitReservation } from 'src/app/shared/models/visit-reservation.model';

@Injectable({
  providedIn: 'root',
})
export class VisitService {
  private readonly apiUrl = environment.visitsApiUrl;
  private readonly http = inject(HttpClient);

  createVisit(data: Visit): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/visits/`, data);
  }

  searchVisits(
    page: number = DEFAULT_PAGINATION.PAGE,
    size: number = DEFAULT_PAGINATION.SIZE,
    filters?: VisitFilters
  ): Observable<PageResult<VisitList>> {
    let params = buildPaginationParams(page, size);

    if (filters) {
      if (filters.cityId !== undefined) {
        params = params.set('cityId', filters.cityId);
      }
      if (filters.sector) {
        params = params.set('sector', filters.sector);
      }
      if (filters.startDateTime) {
        params = params.set('startDateTime', filters.startDateTime);
      }
      if (filters.endDateTime) {
        params = params.set('endDateTime', filters.endDateTime);
      }
      if (filters.sortBy) {
        params = params.set('sortBy', filters.sortBy);
      }
      if (filters.sortDirection) {
        params = params.set('sortDirection', filters.sortDirection);
      }
    }

    return this.http.get<PageResult<VisitList>>(
      `${this.apiUrl}/visits/search`,
      { params }
    );
  }

  getAvailableVisitsByHouseId(houseId: number): Observable<VisitList[]> {
    return this.http.get<VisitList[]>(
      `${this.apiUrl}/visits/available/${houseId}`
    );
  }

  reserveVisit(data: VisitReservation): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/visits/reservations/`,
      data
    );
  }
}
