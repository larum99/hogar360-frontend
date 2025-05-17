import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateHouseFormComponent } from './create-house-form.component';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../core/services/category.service';
import { LocationService } from '../../../core/services/location.service';
import { HouseService } from '../../../core/services/house.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

describe('CreateHouseFormComponent', () => {
  let component: CreateHouseFormComponent;
  let fixture: ComponentFixture<CreateHouseFormComponent>;

  const mockToastrService = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  };

  const mockCategoryService = {
    getCategories: jest.fn().mockReturnValue(of({ content: [] })),
  };

  const mockLocationService = {
    getDepartments: jest.fn().mockReturnValue(of([])),
    getCitiesByDepartment: jest.fn().mockReturnValue(of([])),
    getLocationsByCity: jest.fn().mockReturnValue(of([])),
  };

  const mockHouseService = {
    createHouse: jest
      .fn()
      .mockReturnValue(of({ message: 'ok', timestamp: 'now' })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateHouseFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: LocationService, useValue: mockLocationService },
        { provide: HouseService, useValue: mockHouseService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateHouseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const form = component.houseForm;
    expect(form).toBeTruthy();
    expect(form.get('name')?.value).toBe('');
    expect(form.valid).toBe(false);
  });

  it('should call createHouse on submit if form is valid', () => {
    component.houseForm.setValue({
      name: 'Casa test',
      description: 'Descripción de prueba',
      categoryId: 1,
      bedrooms: 2,
      bathrooms: 1,
      price: 100000,
      department: 1,
      city: 1,
      locationId: 1,
      activePublicationDate: '2025-06-01',
    });

    component.onSubmit();

    expect(mockHouseService.createHouse).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalledWith(
      'La casa fue publicada exitosamente.',
      'Éxito'
    );
  });

  it('should show warning if form is invalid on submit', () => {
    component.houseForm.patchValue({ name: '' });

    component.onSubmit();

    expect(mockToastrService.warning).toHaveBeenCalledWith(
      'Por favor, completa todos los campos requeridos.',
      'Formulario Inválido'
    );
  });

  describe('CreateHouseFormComponent - error handling', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should show duplicate error message if 400 error contains "exists"', () => {
      const errorResponse = new HttpErrorResponse({
        status: HttpStatusCode.BadRequest,
        error: { message: 'A house with this name already exists' },
      });

      mockHouseService.createHouse = jest
        .fn()
        .mockReturnValue(throwError(() => errorResponse));

      component.houseForm.setValue({
        name: 'Casa duplicada',
        description: 'Descripción',
        categoryId: 1,
        bedrooms: 2,
        bathrooms: 1,
        price: 100000,
        department: 1,
        city: 1,
        locationId: 1,
        activePublicationDate: '2025-06-01',
      });

      component.onSubmit();

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'La casa ya fue registrada.',
        'Error al publicar'
      );
    });

    it('should show duplicate error message if 400 error contains "existe"', () => {
      const errorResponse = new HttpErrorResponse({
        status: HttpStatusCode.BadRequest,
        error: { message: 'Ya existe una casa con ese nombre' },
      });

      mockHouseService.createHouse = jest
        .fn()
        .mockReturnValue(throwError(() => errorResponse));

      component.houseForm.setValue({
        name: 'Casa duplicada',
        description: 'Descripción',
        categoryId: 1,
        bedrooms: 2,
        bathrooms: 1,
        price: 100000,
        department: 1,
        city: 1,
        locationId: 1,
        activePublicationDate: '2025-06-01',
      });

      component.onSubmit();

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'La casa ya fue registrada.',
        'Error al publicar'
      );
    });

    it('should show server message if 400 error does not indicate duplicate', () => {
      const errorResponse = new HttpErrorResponse({
        status: HttpStatusCode.BadRequest,
        error: { message: 'Faltan campos requeridos' },
      });

      mockHouseService.createHouse = jest
        .fn()
        .mockReturnValue(throwError(() => errorResponse));

      component.houseForm.setValue({
        name: 'Casa sin campos',
        description: 'Descripción',
        categoryId: 1,
        bedrooms: 2,
        bathrooms: 1,
        price: 100000,
        department: 1,
        city: 1,
        locationId: 1,
        activePublicationDate: '2025-06-01',
      });

      component.onSubmit();

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Faltan campos requeridos',
        'Error al publicar'
      );
    });

    it('should show generic server error for non-400 errors', () => {
      const errorResponse = new HttpErrorResponse({
        status: 500,
        error: { message: 'Internal Server Error' },
      });

      mockHouseService.createHouse = jest
        .fn()
        .mockReturnValue(throwError(() => errorResponse));

      component.houseForm.setValue({
        name: 'Casa error',
        description: 'Error grave',
        categoryId: 1,
        bedrooms: 2,
        bathrooms: 1,
        price: 100000,
        department: 1,
        city: 1,
        locationId: 1,
        activePublicationDate: '2025-06-01',
      });

      component.onSubmit();

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Error inesperado del servidor.',
        'Error'
      );
    });
  });
});
