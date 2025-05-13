import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { LocationService } from './location.service';
import { environment } from 'src/environments/environment';
import { Department } from '../../shared/models/department.model';
import { City } from '../../shared/models/city.model';
import { Location } from '../../shared/models/location.model';

import { PageResult } from '../../shared/models/page-result.model';
import { LocationSearch } from '../../shared/models/location-search.model';
import { HttpParams } from '@angular/common/http';

describe('LocationService', () => {
  let service: LocationService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = {
      post: jest.fn(),
      get: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        LocationService,
        { provide: HttpClient, useValue: httpClientMock },
      ],
    });

    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call HttpClient.post when creating a location', () => {
    const mockLocation: Location = {
      name: 'Test Location',
      departmentId: 1,
      cityId: 2,
      sector: 'Zona 1',
    } as Location;

    httpClientMock.post.mockReturnValue(of(undefined));

    service.createLocation(mockLocation).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    expect(httpClientMock.post).toHaveBeenCalledWith(
      `${environment.apiUrl}/location/`,
      mockLocation
    );
  });

  it('should call HttpClient.get when retrieving departments', () => {
    const mockDepartments: Department[] = [
      { id: 1, name: 'Department A' },
      { id: 2, name: 'Department B' },
    ];

    httpClientMock.get.mockReturnValue(of(mockDepartments));

    service.getDepartments().subscribe((response) => {
      expect(response).toEqual(mockDepartments);
    });

    expect(httpClientMock.get).toHaveBeenCalledWith(
      `${environment.apiUrl}/department`
    );
  });

  it('should call HttpClient.get when retrieving cities by department ID', () => {
    const departmentId = 1;
    const mockCities: City[] = [
      { id: 1, name: 'City A', departmentId },
      { id: 2, name: 'City B', departmentId },
    ];

    httpClientMock.get.mockReturnValue(of(mockCities));

    service.getCitiesByDepartment(departmentId).subscribe((response) => {
      expect(response).toEqual(mockCities);
    });

    expect(httpClientMock.get).toHaveBeenCalledWith(
      `${environment.apiUrl}/city/department/${departmentId}`
    );
  });

  it('should call HttpClient.get with correct params when searching locations', () => {
    const searchTerm = 'zona';
    const page = 1;
    const size = 5;
    const sortBy = 'department.name';
    const sortDirection = 'desc';

    const mockResult: PageResult<LocationSearch> = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 5,
      isFirst: true,
      isLast: true,
    };

    httpClientMock.get.mockReturnValue(of(mockResult));

    service
      .searchLocations(searchTerm, page, size, sortBy, sortDirection)
      .subscribe((response) => {
        expect(response).toEqual(mockResult);
      });

    expect(httpClientMock.get).toHaveBeenCalled();

    const callArgs = httpClientMock.get.mock.calls[0];
    expect(callArgs).toBeDefined();

    const options = callArgs[1];
    expect(options).toBeDefined();

    const actualParams = (options?.params ?? new HttpParams()) as HttpParams;

    expect(actualParams.get('searchTerm')).toBe(searchTerm);
    expect(actualParams.get('page')).toBe(page.toString());
    expect(actualParams.get('size')).toBe(size.toString());
    expect(actualParams.get('sortBy')).toBe(sortBy);
    expect(actualParams.get('sortDirection')).toBe(sortDirection);
  });

  it('should call HttpClient.get with default params when no arguments are provided to searchLocations', () => {
    const mockResult: PageResult<LocationSearch> = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: 10,
      isFirst: true,
      isLast: true,
    };

    httpClientMock.get.mockReturnValue(of(mockResult));

    service.searchLocations().subscribe((response) => {
      expect(response).toEqual(mockResult);
    });

    expect(httpClientMock.get).toHaveBeenCalled();

    const callArgs = httpClientMock.get.mock.calls[0];
    expect(callArgs).toBeDefined();

    const options = callArgs[1];
    expect(options).toBeDefined();

    const actualParams = (options?.params ?? new HttpParams()) as HttpParams;

    expect(actualParams.get('searchTerm')).toBe('');
    expect(actualParams.get('page')).toBe('0');
    expect(actualParams.get('size')).toBe('10');
    expect(actualParams.get('sortBy')).toBe('city.name');
    expect(actualParams.get('sortDirection')).toBe('asc');
  });
});
