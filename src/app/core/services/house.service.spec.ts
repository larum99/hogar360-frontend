import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HouseService } from './house.service';
import { HouseCreation } from '../../shared/models/house-creation.model';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { environment } from 'src/environments/environment';

describe('HouseService', () => {
  let service: HouseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HouseService]
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
      activePublicationDate: '2025-06-01'
    };

    const mockResponse: ApiResponse = {
      message: 'Casa creada exitosamente',
      timestamp: '2025-05-17T10:00:00Z'
    };

    service.createHouse(mockHouse).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.housesApiUrl}/house/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockHouse);
    req.flush(mockResponse);
  });
});
