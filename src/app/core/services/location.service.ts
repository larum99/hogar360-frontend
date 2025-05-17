import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '../../shared/models/location.model';
import { Department } from '../../shared/models/department.model';
import { City } from '../../shared/models/city.model';
import { LocationSearch } from '../../shared/models/location-search.model';
import { PageResult } from '../../shared/models/page-result.model';
import { environment } from 'src/environments/environment';
import { DEFAULT_PAGINATION } from '../../shared/constants/pagination.constants';
import { buildPaginationParams } from '../../shared/utils/http-params.util';
import { ApiResponse } from 'src/app/shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly apiUrl = environment.housesApiUrl;
  private readonly http = inject(HttpClient);

  createLocation(data: Location): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/location/`, data);
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/department`);
  }

  getCitiesByDepartment(departmentId: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/city/department/${departmentId}`);
  }

  searchLocations(
    searchTerm: string = '',
    page: number = DEFAULT_PAGINATION.PAGE,
    size: number = DEFAULT_PAGINATION.SIZE,
    sortBy: string = 'city.name',
    sortDirection: string = 'asc'
  ): Observable<PageResult<LocationSearch>> {
    let params = buildPaginationParams(page, size);
    params = params
      .set('searchTerm', searchTerm)
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<PageResult<LocationSearch>>(`${this.apiUrl}/location/search`, { params });
  }

  getLocationsByCity(cityId: number): Observable<Location[]> {
  return this.http.get<Location[]>(`${this.apiUrl}/location/city/${cityId}`);
}
}
