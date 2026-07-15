import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { HouseService } from './house.service';
import { HouseCreation } from '../../shared/models/house-creation.model';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { environment } from 'src/environments/environment';
import { PageResult } from '../../shared/models/page-result.model';
import { HouseList } from '../../shared/models/house-list.model';
import { HouseFilters } from 'src/app/shared/models/house-filters.models';

describe('HouseService', () => {
  let service: HouseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HouseService],
    });

    service = TestBed.inject(HouseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to create a house', () => {
    const mockHouse: HouseCreation = {
      name: 'Casa de prueba',
      description: 'Una casa para test unitario',
      categoryId: 1,
      bedrooms: 3,
      bathrooms: 2,
      price: 120000,
      locationId: 5,
      activePublicationDate: '2025-06-01',
    };

    const mockResponse: ApiResponse = {
      message: 'Casa creada exitosamente',
      timestamp: '2025-05-17T10:00:00Z',
    };

    service.createHouse(mockHouse).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.housesApiUrl}/house/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockHouse);
    req.flush(mockResponse);
  });

  it('should send a GET request to list houses with default pagination and sorting', () => {
    const mockResponse: PageResult<HouseList> = {
      content: [],
      totalPages: 1,
      currentPage: 0,
      totalElements: 0,
      pageSize: 10,
      isFirst: true,
      isLast: true,
    };

    service.listHouses().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === `${environment.housesApiUrl}/house/search` &&
        req.params.get('page') === '0' &&
        req.params.get('size') === '10' &&
        req.params.get('sortBy') === 'price' &&
        req.params.get('sortDirection') === 'asc'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should send a GET request to list houses with filters applied', () => {
    const filters: HouseFilters = {
      city: 'Cali',
      sector: 'Centro',
      bedrooms: 3,
      bathrooms: 2,
      minPrice: 100000,
      maxPrice: 200000,
    };

    const mockResponse: PageResult<HouseList> = {
      content: [],
      totalPages: 1,
      currentPage: 0,
      totalElements: 0,
      pageSize: 10,
      isFirst: true,
      isLast: true,
    };

    service.listHouses(0, 10, 'price', 'asc', filters).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((req) => {
      return (
        req.method === 'GET' &&
        req.url === `${environment.housesApiUrl}/house/search` &&
        req.params.get('page') === '0' &&
        req.params.get('size') === '10' &&
        req.params.get('sortBy') === 'price' &&
        req.params.get('sortDirection') === 'asc' &&
        req.params.get('city') === filters.city &&
        req.params.get('sector') === filters.sector &&
        req.params.get('bedrooms') === String(filters.bedrooms) &&
        req.params.get('bathrooms') === String(filters.bathrooms) &&
        req.params.get('minPrice') === String(filters.minPrice) &&
        req.params.get('maxPrice') === String(filters.maxPrice)
      );
    });

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
