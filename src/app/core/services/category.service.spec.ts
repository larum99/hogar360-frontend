import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../../shared/models/category.model';
import { CategoryService } from './category.service';
import { PageResult } from '../../shared/models/page-result.model';

jest.mock('../../shared/utils/http-params.util', () => ({
  buildPaginationParams: jest.fn(() => ({ mockParam: 'value' }))
}));

describe('CategoryService (Jest)', () => {
  let service: CategoryService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = {
      post: jest.fn(),
      get: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(CategoryService);
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

    expect(httpClientMock.post).toHaveBeenCalledWith(
      `${environment.apiUrl}/category/`,
      mockCategory
    );
  });

  it('should call HttpClient.get with correct URL and params', () => {
    const mockResponse: PageResult<Category> = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: 10,
      isFirst: true,
      isLast: true
    };

    httpClientMock.get.mockReturnValue(of(mockResponse));

    service.getCategories().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientMock.get).toHaveBeenCalledWith(
      `${environment.apiUrl}/category/`,
      { params: { mockParam: 'value' } }
    );
  });
});
