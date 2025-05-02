import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { CategoryService } from './category.service';
import { Category } from '../../components/models/category.model';
import { environment } from 'src/environments/environment.local';

describe('CategoryService (Jest)', () => {
  let service: CategoryService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    const mockHttpClient = {
      post: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    });

    service = TestBed.inject(CategoryService);
    httpClientMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize apiUrl from environment', () => {
    const apiUrl = (service as any).apiUrl;
    expect(apiUrl).toBe(environment.apiUrl);
  });

  it('should call HttpClient.post with correct URL and data', () => {
    const mockCategory: Category = { name: 'Test', description: 'Desc' };
    const mockResponse = { ...mockCategory };

    httpClientMock.post.mockReturnValue(of(mockResponse));

    service.createCategory(mockCategory).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientMock.post).toHaveBeenCalledWith(environment.apiUrl, mockCategory);
  });
});
