import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { VisitService } from './visit.service';
import { environment } from 'src/environments/environment';
import { Visit } from 'src/app/shared/models/visit.model';
import { VisitReservation } from 'src/app/shared/models/visit-reservation.model';
import { VisitFilters } from 'src/app/shared/models/visit-filters.model';
import { VisitList } from 'src/app/shared/models/visit-list.model';
import { PageResult } from 'src/app/shared/models/page-result.model';

describe('VisitService', () => {
  let service: VisitService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.visitsApiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VisitService],
    });

    service = TestBed.inject(VisitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a visit', () => {
    const mockVisit: Visit = {
      houseId: 1,
      startDateTime: '2025-06-01T10:00:00',
      endDateTime: '2025-06-01T11:00:00',
    };

    const mockResponse = { message: 'Visit created' };

    service.createVisit(mockVisit).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/visits/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockVisit);
    req.flush(mockResponse);
  });

  it('should search visits with filters', () => {
    const filters: VisitFilters = {
      cityId: 5,
      sector: 'Downtown',
      startDateTime: '2025-06-01T10:00:00',
      endDateTime: '2025-06-01T12:00:00',
      sortBy: 'startDateTime',
      sortDirection: 'asc',
    };

    const mockResponse: PageResult<VisitList> = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10,
      isFirst: true,
      isLast: true,
    };

    service.searchVisits(1, 10, filters).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${apiUrl}/visits/search` &&
        request.params.get('cityId') === '5' &&
        request.params.get('sector') === 'Downtown' &&
        request.params.get('startDateTime') === '2025-06-01T10:00:00' &&
        request.params.get('endDateTime') === '2025-06-01T12:00:00' &&
        request.params.get('sortBy') === 'startDateTime' &&
        request.params.get('sortDirection') === 'asc'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get available visits by house ID', () => {
    const houseId = 10;

    const mockVisits: VisitList[] = [
      {
        id: 1,
        userId: 100,
        houseId: 10,
        startDateTime: '2025-06-01T09:00:00',
        endDateTime: '2025-06-01T10:00:00',
      },
      {
        id: 2,
        userId: 101,
        houseId: 10,
        startDateTime: '2025-06-01T11:00:00',
        endDateTime: '2025-06-01T12:00:00',
      },
    ];

    service.getAvailableVisitsByHouseId(houseId).subscribe((res) => {
      expect(res).toEqual(mockVisits);
    });

    const req = httpMock.expectOne(`${apiUrl}/visits/available/${houseId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockVisits);
  });

  it('should reserve a visit', () => {
    const reservation: VisitReservation = {
      visitId: 1,
      buyerEmail: 'testbuyer@example.com',
    };

    const mockResponse = { message: 'Visit reserved' };

    service.reserveVisit(reservation).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/visits/reservations/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reservation);
    req.flush(mockResponse);
  });
});
