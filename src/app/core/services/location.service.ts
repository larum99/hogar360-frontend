import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '../../shared/models/location.model';
import { Department } from '../../shared/models/department.model';
import { City } from '../../shared/models/city.model';
import { LocationSearch } from '../../shared/models/location-search.model';
import { PageResult } from '../../shared/models/page-result.model';
import { environment } from 'src/environments/environment';

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
    page: number = 0,
    size: number = 10,
    sortBy: string = 'city.name',
    sortDirection: string = 'asc'
  ): Observable<PageResult<LocationSearch>> {

    let params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    const searchEndpoint = `${this.apiUrl}/location/search`;

    return this.http.get<PageResult<LocationSearch>>(searchEndpoint, { params });
  }
}
