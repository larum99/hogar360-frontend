import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HouseCreation } from '../../shared/models/house-creation.model';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { HouseList } from 'src/app/shared/models/house-list.model';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { DEFAULT_PAGINATION } from 'src/app/shared/constants/pagination.constants';
import { buildPaginationParams } from 'src/app/shared/utils/http-params.util';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private readonly apiUrl = environment.housesApiUrl;
  private readonly http = inject(HttpClient);

  createHouse(data: HouseCreation): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/house/`, data);
  }

  listHouses(
    page: number = DEFAULT_PAGINATION.PAGE,
    size: number = DEFAULT_PAGINATION.SIZE,
    sortBy: string = 'price',
    sortDirection: string = 'asc'
  ): Observable<PageResult<HouseList>> {
    let params = buildPaginationParams(page, size);
    params = params
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<PageResult<HouseList>>(`${this.apiUrl}/house/search`, { params });
  }

  listHousesByPublisher(publisherId: number): Observable<HouseList[]> {
    return this.http.get<HouseList[]>(`${this.apiUrl}/house/publisher/${publisherId}`);
  }
}
