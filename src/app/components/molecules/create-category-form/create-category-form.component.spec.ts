import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCategoryFormComponent } from './create-category-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from 'src/app/core/services/category.service';
import { of, throwError } from 'rxjs';
import { Category } from 'src/app/components/models/category.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CreateCategoryFormComponent', () => {
  let component: CreateCategoryFormComponent;
  let fixture: ComponentFixture<CreateCategoryFormComponent>;
  let categoryServiceSpy: jest.Mocked<CategoryService>;

  beforeEach(() => {
    categoryServiceSpy = {
      createCategory: jest.fn(),
    } as unknown as jest.Mocked<CategoryService>;

    TestBed.configureTestingModule({
      declarations: [CreateCategoryFormComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: CategoryService, useValue: categoryServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    fixture = TestBed.createComponent(CreateCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as touched if invalid', () => {
    component.categoryForm.controls.name.setValue('');
    component.categoryForm.controls.description.setValue('');
    component.onSubmit();
    expect(component.categoryForm.invalid).toBe(true);
    expect(component.categoryForm.controls.name.touched).toBe(true);
    expect(component.categoryForm.controls.description.touched).toBe(true);
  });

  it('should call createCategory and reset form on success', () => {
    const mockCategory: Category = { name: 'Test', description: 'Desc' };
    categoryServiceSpy.createCategory = jest
      .fn()
      .mockReturnValue(of({ id: 1, ...mockCategory }));
    component.categoryForm.setValue(mockCategory);

    const resetSpy = jest.spyOn(component.categoryForm, 'reset');

    component.onSubmit();

    expect(categoryServiceSpy.createCategory).toHaveBeenCalledWith(
      mockCategory
    );
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should handle 400 error - category exists', () => {
    const errorResponse = {
      status: 400,
      error: { message: 'Category already exists' },
    };

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    categoryServiceSpy.createCategory = jest
      .fn()
      .mockReturnValue(throwError(() => errorResponse));
    component.categoryForm.setValue({
      name: 'Existing',
      description: 'Already exists',
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('La categoría ya existe.');
  });

  it('should handle 400 error - invalid request', () => {
    const errorResponse = {
      status: 400,
      error: { message: 'Invalid data format' },
    };

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    categoryServiceSpy.createCategory = jest
      .fn()
      .mockReturnValue(throwError(() => errorResponse));
    component.categoryForm.setValue({
      name: 'Invalid',
      description: 'Bad format',
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith(
      'Solicitud inválida, por favor revisa los datos ingresados.'
    );
  });

  it('should handle 500 error', () => {
    const errorResponse = {
      status: 500,
      error: { message: 'Server error' },
    };

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    categoryServiceSpy.createCategory = jest
      .fn()
      .mockReturnValue(throwError(() => errorResponse));
    component.categoryForm.setValue({
      name: 'Test',
      description: 'Server error',
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith(
      'Ocurrió un error en el servidor. Intenta más tarde.'
    );
  });

  it('should handle unknown error', () => {
    const errorResponse = {
      status: 418,
      error: { message: 'Weird error' },
    };

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    categoryServiceSpy.createCategory = jest
      .fn()
      .mockReturnValue(throwError(() => errorResponse));
    component.categoryForm.setValue({
      name: 'Weird',
      description: 'Unexpected',
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Ocurrió un error inesperado.');
  });

  it('should handle error with mensaje field', () => {
    const errorResponse = {
      status: 400,
      error: { mensaje: 'Ya existe una categoría' },
    };

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    categoryServiceSpy.createCategory = jest
      .fn()
      .mockReturnValue(throwError(() => errorResponse));
    component.categoryForm.setValue({
      name: 'Duplicado',
      description: 'Intento duplicado',
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('La categoría ya existe.');
  });

  it('should show "Error desconocido" when no message or mensaje is provided', () => {
    const errorResponse = {
      status: 500,
      error: {},
    };

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    categoryServiceSpy.createCategory = jest
      .fn()
      .mockReturnValue(throwError(() => errorResponse));
    component.categoryForm.setValue({
      name: 'Error',
      description: 'Sin mensaje',
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith(
      'Ocurrió un error en el servidor. Intenta más tarde.'
    );
  });
});
