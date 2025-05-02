import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CategoryService } from '../services/category.service';
import { Category } from '../../components/models/category.model';
import { environment } from 'src/environments/environment.local';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ CategoryService ]
    });
    service  = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have apiUrl initialized from environment', () => {
    // forzamos la lectura de la propiedad privada
    const apiUrlValue = (service as any).apiUrl;
    expect(apiUrlValue).toBe(environment.apiUrl);
  });

  it('should send POST request to create a category', () => {
    const mockCategory: Category = { name: 'Test', description: 'Desc' };

    service.createCategory(mockCategory).subscribe(resp => {
      expect(resp).toEqual(mockCategory);
    });

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCategory);
    req.flush(mockCategory);
  });
});