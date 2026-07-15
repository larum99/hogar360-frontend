import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token on login', () => {
    const mockResponse = { token: 'fake-token' };
    const email = 'test@example.com';
    const password = '123456';

    service.login(email, password).subscribe((res) => {
      expect(res.token).toBe('fake-token');
      expect(localStorage.getItem('token')).toBe('fake-token');
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });

    req.flush(mockResponse);
  });

  it('should remove token on logout', () => {
    localStorage.setItem('token', 'dummy-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should return token from localStorage', () => {
    localStorage.setItem('token', 'dummy-token');
    expect(service.getToken()).toBe('dummy-token');
  });

  it('should return true if token exists', () => {
    localStorage.setItem('token', 'dummy-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should return false if token does not exist', () => {
    expect(service.isAuthenticated()).toBe(false)
  });

  it('should decode role from token', () => {
    const payload = { role: 'admin' };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem('token', token);
    expect(service.getRole()).toBe('admin');
  });

  it('should return true if user has expected role', () => {
    const payload = { role: 'admin' };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem('token', token);
    expect(service.hasRole('admin')).toBe(true);
  });

  it('should return false if user has different role', () => {
    const payload = { role: 'user' };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem('token', token);
    expect(service.hasRole('admin')).toBe(false);
  });

    it('should return user id from token', () => {
    const payload = { id: 123 };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem('token', token);
    expect(service.getUserId()).toBe(123);
  });

  it('should return null if user id is missing in token', () => {
    const payload = {};
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem('token', token);
    expect(service.getUserId()).toBeNull();
  });

  it('should return user email from token', () => {
    const payload = { email: 'test@example.com' };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem('token', token);
    expect(service.getUserEmail()).toBe('test@example.com');
  });

  it('should return null if user email is missing in token', () => {
    const payload = {};
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem('token', token);
    expect(service.getUserEmail()).toBeNull();
  });

});
