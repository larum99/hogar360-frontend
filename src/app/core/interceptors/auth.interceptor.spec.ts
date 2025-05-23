import {
  HttpErrorResponse,
  HttpStatusCode,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let toastrServiceSpy: jest.Mocked<ToastrService>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    toastrServiceSpy = {
      error: jest.fn(),
    } as unknown as jest.Mocked<ToastrService>;

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
    consoleErrorSpy.mockRestore();
    localStorage.removeItem('token');
  });

  it('should be created', () => {
    const interceptor = TestBed.inject(HTTP_INTERCEPTORS);
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization and Content-Type headers to POST requests with matching URL', () => {
    const testUrl = `${environment.housesApiUrl}/some-endpoint`;
    const testBody = { data: 'test' };
    const mockToken = 'fake-auth-token-from-localStorage';

    localStorage.setItem('token', mockToken);

    httpClient.post(testUrl, testBody).subscribe();

    const req = httpMock.expectOne(testUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual(testBody);

    req.flush(null);
  });

  it('should add headers to GET requests if URL matches', () => {
    const testUrl = `${environment.housesApiUrl}/some-endpoint`;

    localStorage.setItem('token', 'some-token');

    httpClient.get(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer some-token`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(null);

    localStorage.removeItem('token');
  });

  it('should show a toastr error and log for InternalServerError (500)', (done) => {
    const testUrl = `${environment.housesApiUrl}/some-endpoint`;
    const mockErrorBody = { message: 'Something went wrong on the server' };
    const mockStatus = HttpStatusCode.InternalServerError;
    const mockStatusText = 'Internal Server Error';

    httpClient.get(testUrl).subscribe({
      next: () => done.fail('Should have errored'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(mockStatus);
        expect(error.statusText).toBe(mockStatusText);
        expect(error.error).toEqual(mockErrorBody);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'HTTP Error desde Interceptor:',
          error
        );
        expect(toastrServiceSpy.error).toHaveBeenCalledWith(
          'Ocurrió un error en el servidor. Intenta más tarde.',
          'Error del Servidor'
        );
        done();
      },
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(mockErrorBody, {
      status: mockStatus,
      statusText: mockStatusText,
    });
  });

  it('should log the error but NOT show a toastr for other HTTP errors (non-500)', (done) => {
    const testUrl = `${environment.housesApiUrl}/some-endpoint`;
    const mockErrorBody = 'Resource not found';
    const mockStatus = HttpStatusCode.NotFound;
    const mockStatusText = 'Not Found';

    httpClient.get(testUrl).subscribe({
      next: () => done.fail('Should have errored'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(mockStatus);
        expect(error.statusText).toBe(mockStatusText);
        expect(error.error).toEqual(mockErrorBody);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'HTTP Error desde Interceptor:',
          error
        );
        expect(toastrServiceSpy.error).not.toHaveBeenCalled();
        done();
      },
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(mockErrorBody, {
      status: mockStatus,
      statusText: mockStatusText,
    });
  });
});
