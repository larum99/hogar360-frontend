import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { environment } from 'src/environments/environment';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        { provide: 'environment', useValue: environment },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    const interceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization and Content-Type headers to POST requests', () => {
    const testUrl = '/api/some-endpoint';
    const testBody = { data: 'test' };
    const mockToken = 'fake-auth-token-from-env';

    environment.token = mockToken;

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

  it('should NOT add headers to GET requests', () => {
    const testUrl = '/api/some-endpoint';

    httpClient.get(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.headers.get('Content-Type')).toBeNull();

    req.flush(null);
  });
});
