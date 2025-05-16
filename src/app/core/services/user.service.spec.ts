import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { UserService } from './user.service';
import { User } from '../../shared/models/user.model';
import { environment } from 'src/environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    const httpClientSpy = {
      post: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(UserService);
    httpClientMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call HttpClient.post with the correct URL and payload in createSeller()', () => {
    const mockUser: User = {
      firstName: 'Juan',
      lastName: 'Pérez',
      identityDocument: '123456789',
      phoneNumber: '3001234567',
      birthDate: '1990-01-01',
      email: 'juan.perez@example.com',
      password: 'SecurePass123'
    };

    const expectedUrl = `${environment.usersApiUrl}/users/`;

    httpClientMock.post.mockReturnValue(of(mockUser));

    service.createSeller(mockUser).subscribe(response => {
      expect(response).toEqual(mockUser);
    });

    expect(httpClientMock.post).toHaveBeenCalledWith(expectedUrl, mockUser);
  });
});
