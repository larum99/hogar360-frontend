import { HttpStatusCode } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/shared/models/category.model';
import { CreateCategoryFormComponent } from './create-category-form.component';
import { ToastrService } from 'ngx-toastr';

describe('CreateCategoryFormComponent', () => {
  let component: CreateCategoryFormComponent;
  let fixture: ComponentFixture<CreateCategoryFormComponent>;
  let categoryServiceSpy: jest.Mocked<CategoryService>;
  let toastrServiceSpy: jest.Mocked<ToastrService>;

  beforeEach(() => {
    categoryServiceSpy = {
      createCategory: jest.fn(),
    } as unknown as jest.Mocked<CategoryService>;

    toastrServiceSpy = {
      warning: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<ToastrService>;

    TestBed.configureTestingModule({
      declarations: [CreateCategoryFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    fixture = TestBed.createComponent(CreateCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as touched and show warning toast if invalid', () => {
    component.categoryForm.controls.name.setValue('');
    component.categoryForm.controls.description.setValue('');
    component.onSubmit();

    expect(component.categoryForm.invalid).toBe(true);
    expect(component.categoryForm.controls.name.touched).toBe(true);
    expect(component.categoryForm.controls.description.touched).toBe(true);
    expect(toastrServiceSpy.warning).toHaveBeenCalledWith(
      'Por favor, completa todos los campos requeridos.',
      'Formulario Inválido'
    );
  });

  it('should call createCategory, reset form, and show success toast on success', () => {
    const mockCategory: Category = { name: 'Test', description: 'Desc' };
    categoryServiceSpy.createCategory = jest
      .fn()
      .mockReturnValue(of({ id: 1, ...mockCategory }));

    component.categoryForm.setValue(mockCategory);

    const resetSpy = jest.spyOn(component.categoryForm, 'reset');
    const createdEmitSpy = jest.spyOn(component.created, 'emit');

    component.onSubmit();

    expect(categoryServiceSpy.createCategory).toHaveBeenCalledWith(
      mockCategory
    );
    expect(resetSpy).toHaveBeenCalled();
    expect(createdEmitSpy).toHaveBeenCalled();
    expect(toastrServiceSpy.success).toHaveBeenCalledWith(
      'La categoría ha sido creada exitosamente.',
      'Éxito!'
    );
  });

  it('should handle 400 error - category exists (message field) and show error toast', () => {
    const errorResponse = {
      status: HttpStatusCode.BadRequest,
      error: { message: 'Category already exists' },
    };

    categoryServiceSpy.createCategory = jest
      .fn()
      .mockReturnValue(throwError(() => errorResponse));

    component.categoryForm.setValue({
      name: 'Existing',
      description: 'Already exists',
    });

    component.onSubmit();

    expect(toastrServiceSpy.error).toHaveBeenCalledWith(
      'La categoría ya existe.',
      'Error al crear'
    );
  });

  it('should handle 400 error - category exists (mensaje field) and show error toast', () => {
    const errorResponse = {
      status: HttpStatusCode.BadRequest,
      error: { mensaje: 'Ya existe una categoría' },
    };

    categoryServiceSpy.createCategory = jest
      .fn()
      .mockReturnValue(throwError(() => errorResponse));

    component.categoryForm.setValue({
      name: 'Duplicado',
      description: 'Intento duplicado',
    });

    component.onSubmit();

    expect(toastrServiceSpy.error).toHaveBeenCalledWith(
      'La categoría ya existe.',
      'Error al crear'
    );
  });

    it('should handle 400 error - invalid request (mensaje field) and show error toast', () => {
      const errorResponse = {
        status: HttpStatusCode.BadRequest,
        error: { mensaje: 'Formato de datos inválido' },
      };

      categoryServiceSpy.createCategory = jest
        .fn()
        .mockReturnValue(throwError(() => errorResponse));

      component.categoryForm.setValue({
        name: 'Invalid',
        description: 'Bad format',
      });

      component.onSubmit();

      expect(toastrServiceSpy.error).toHaveBeenCalledWith(
        'Formato de datos inválido',
        'Error al crear'
      );
    });


  it('should handle other errors (non-400) and log the error', () => {
    const errorResponse = {
      status: HttpStatusCode.InternalServerError,
      error: { message: 'Server error' },
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    categoryServiceSpy.createCategory = jest
      .fn()
      .mockReturnValue(throwError(() => errorResponse));

    component.categoryForm.setValue({
      name: 'Test',
      description: 'Server error',
    });

    component.onSubmit();

    expect(toastrServiceSpy.error).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error no manejado específicamente en el componente:',
      errorResponse
    );

    consoleSpy.mockRestore();
  });

  it('should handle error with no error body or message and log', () => {
    const errorResponse = {
      status: HttpStatusCode.InternalServerError,
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    categoryServiceSpy.createCategory = jest
      .fn()
      .mockReturnValue(throwError(() => errorResponse));

    component.categoryForm.setValue({
      name: 'Test',
      description: 'No error body',
    });

    component.onSubmit();

    expect(toastrServiceSpy.error).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error no manejado específicamente en el componente:',
      errorResponse
    );

    consoleSpy.mockRestore();
  });

    it('should handle 400 error with no message or mensaje field and show default 400 error toast', () => {
      const errorResponse = {
        status: HttpStatusCode.BadRequest,
        error: {},
      };

      categoryServiceSpy.createCategory = jest
        .fn()
        .mockReturnValue(throwError(() => errorResponse));

      component.categoryForm.setValue({
        name: 'Error',
        description: 'Sin mensaje',
      });

      component.onSubmit();

      expect(toastrServiceSpy.error).toHaveBeenCalledWith(
        'Solicitud inválida, por favor revisa los datos ingresados.',
        'Error al crear'
      );
    });

});