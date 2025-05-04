import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CreateCategoryPageComponent } from './create-category-page.component';
import { CategoryService } from 'src/app/core/services/category.service';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { Category } from 'src/app/shared/models/category.model';

describe('CreateCategoryPageComponent', () => {
  let component: CreateCategoryPageComponent;
  let fixture: ComponentFixture<CreateCategoryPageComponent>;

  const mockCategoryService = {
    getCategories: jest.fn().mockReturnValue(of({
      content: [],
      totalElements: 0,
      pageSize: 10,
      currentPage: 0,
      totalPages: 0,
      isFirst: true,
      isLast: true
    } as PageResult<Category>))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCategoryPageComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService }
      ]
    });

    fixture = TestBed.createComponent(CreateCategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCategories on page change', () => {
    component.onPageChange(1);
    expect(mockCategoryService.getCategories).toHaveBeenCalledWith(1);
  });

  it('should refresh categories on category created', () => {
    component.onCategoryCreated();
    expect(mockCategoryService.getCategories).toHaveBeenCalledWith(0);
  });
});
