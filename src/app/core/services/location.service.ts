import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '../../shared/models/location.model';
import { Department } from '../../shared/models/department.model';
import { City } from '../../shared/models/city.model';
import { LocationSearch } from '../../shared/models/location-search.model';
import { PageResult } from '../../shared/models/page-result.model';
import { environment } from 'src/environments/environment';
import { DEFAULT_PAGINATION } from '../../shared/constants/pagination.constants';
import { buildPaginationParams } from '../../shared/utils/http-params.util';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  createLocation(data: Location): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/location/`, data);
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
}
