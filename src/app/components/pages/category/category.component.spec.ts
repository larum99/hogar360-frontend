import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryComponent } from './category.component';
import { CategoryService } from 'src/app/core/services/category.service';
import { of } from 'rxjs';
import { Category } from 'src/app/shared/models/category.model';
import { PageResult } from 'src/app/shared/models/page-result.model';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let categoryServiceMock: jest.Mocked<CategoryService>;

  const mockCategories: PageResult<Category> = {
    content: [
      { id: 1, name: 'Casa', description: 'Propiedad residencial' }
    ],
    totalElements: 1,
    totalPages: 1,
    currentPage: 0,
    pageSize: 10,
    isFirst: true,
    isLast: true
  };

  beforeEach(async () => {
    categoryServiceMock = {
      getCategories: jest.fn().mockReturnValue(of(mockCategories))
    } as unknown as jest.Mocked<CategoryService>;

    await TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      providers: [
        { provide: CategoryService, useValue: categoryServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should define category table columns on init', () => {
    component.ngOnInit();
    expect(component.categoryTableColumns.length).toBe(3);
    expect(component.categoryTableColumns[0].header).toBe('ID');
    expect(component.categoryTableColumns[1].header).toBe('Nombre');
    expect(component.categoryTableColumns[2].header).toBe('Descripción');
  });

  it('should fetch categories on initialization', (done) => {
    component.categories$.subscribe(result => {
      expect(result).toEqual(mockCategories);
      done();
    });
  });

  it('should emit new page number when onPageChange is called', (done) => {
    const newPage = 2;
    component.onPageChange(newPage);

    component.categories$.subscribe(result => {
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
});
