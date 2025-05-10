import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '../../shared/models/location.model';
import { Department } from '../../shared/models/department.model';
import { City } from '../../shared/models/city.model';
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
}
