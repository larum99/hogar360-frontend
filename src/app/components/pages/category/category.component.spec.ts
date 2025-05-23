import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryComponent } from './category.component';
import { CategoryService } from 'src/app/core/services/category.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Category } from 'src/app/shared/models/category.model';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { of, throwError } from 'rxjs';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let categoryServiceMock: jest.Mocked<CategoryService>;
  let authServiceMock: jest.Mocked<AuthService>;

  const mockCategories: PageResult<Category> = {
    content: [{ id: 1, name: 'Casa', description: 'Propiedad residencial' }],
    totalElements: 1,
    totalPages: 1,
    currentPage: 0,
    pageSize: 10,
    isFirst: true,
    isLast: true,
  };

  beforeEach(async () => {
    categoryServiceMock = {
      getCategories: jest.fn().mockReturnValue(of(mockCategories)),
    } as unknown as jest.Mocked<CategoryService>;

    authServiceMock = {
      hasRole: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<AuthService>;

    await TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      providers: [
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should define category table columns on init', () => {
    expect(component.categoryTableColumns.length).toBe(3);
    expect(component.categoryTableColumns[0].header).toBe('ID');
    expect(component.categoryTableColumns[1].header).toBe('Nombre');
    expect(component.categoryTableColumns[2].header).toBe('Descripción');

    const sampleCategory: Category = {
      id: 5,
      name: 'Apartamento',
      description: 'Propiedad urbana',
    };

    expect(component.categoryTableColumns[0].cell(sampleCategory)).toBe(5);
    expect(component.categoryTableColumns[1].cell(sampleCategory)).toBe(
      'Apartamento'
    );
    expect(component.categoryTableColumns[2].cell(sampleCategory)).toBe(
      'Propiedad urbana'
    );
  });

  it('should fetch categories on initialization', (done) => {
    component.categories$.subscribe((result) => {
      expect(result).toEqual(mockCategories);
      done();
    });
  });

  it('should emit new page number when onPageChange is called', (done) => {
    const newPage = 2;
    component.onPageChange(newPage);

    component.categories$.subscribe(() => {
      expect(categoryServiceMock.getCategories).toHaveBeenCalledWith(newPage);
      done();
    });
  });

  it('should refresh categories on refreshCategories call', (done) => {
    const spy = jest.spyOn(component['currentPageSubject'], 'next');
    component.refreshCategories();
    expect(spy).toHaveBeenCalledWith(0);
    done();
  });

  it('should detect isAdmin based on AuthService', () => {
    expect(authServiceMock.hasRole).toHaveBeenCalledWith('ADMIN');
    expect(component.isAdmin).toBe(true);
  });
});
