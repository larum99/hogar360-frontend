import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../../../core/services/location.service';

import { CreateLocationFormComponent } from './create-location-form.component';
import { Department } from 'src/app/shared/models/department.model';
import { City } from 'src/app/shared/models/city.model';
import { HttpStatusCode } from '@angular/common/http';

const mockDepartments: Department[] = [
  { id: 1, name: 'Department A' },
  { id: 2, name: 'Department B' },
];

const mockCities: City[] = [
  { id: 101, name: 'City A1', departmentId: 1 },
  { id: 102, name: 'City A2', departmentId: 1 },
];

const mockLocation = {
  sector: 'Test Sector',
  cityId: 101,
};

class MockLocationService {
  getDepartments = jest.fn(() => of(mockDepartments));
  getCitiesByDepartment = jest.fn((departmentId: number) => of(mockCities.filter(city => city.departmentId === departmentId)));
  createLocation = jest.fn(() => of(null));
}

class MockToastrService {
  success = jest.fn();
  error = jest.fn();
  warning = jest.fn();
}

describe('CreateLocationFormComponent', () => {
  let component: CreateLocationFormComponent;
  let fixture: ComponentFixture<CreateLocationFormComponent>;
  let mockLocationService: MockLocationService;
  let mockToastrService: MockToastrService;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateLocationFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: LocationService, useClass: MockLocationService },
        { provide: ToastrService, useClass: MockToastrService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLocationFormComponent);
    component = fixture.componentInstance;

    mockLocationService = TestBed.inject(LocationService) as any;
    mockToastrService = TestBed.inject(ToastrService) as any;
    formBuilder = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load departments on ngOnInit', () => {
    expect(mockLocationService.getDepartments).toHaveBeenCalled();
    expect(component.departments).toEqual(mockDepartments);
  });

  it('should show error toast if loading departments fails', () => {
    mockLocationService.getDepartments.mockReturnValueOnce(throwError(() => new Error('Failed to load departments')));

    fixture = TestBed.createComponent(CreateLocationFormComponent);
    component = fixture.componentInstance;
    mockLocationService = TestBed.inject(LocationService) as any;
    mockToastrService = TestBed.inject(ToastrService) as any;
    mockLocationService.getDepartments = jest.fn(() => throwError(() => new Error('Failed to load departments')));

    fixture.detectChanges();

    expect(mockLocationService.getDepartments).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalledWith('Error al cargar los departamentos', 'Error');
    expect(component.departments).toEqual([]);
  });


  it('should load cities when a department is selected', fakeAsync(() => {
    const departmentId = 1;
    component.departments = mockDepartments;

    component.locationForm.controls.department.setValue(departmentId);
    tick();

    expect(mockLocationService.getCitiesByDepartment).toHaveBeenCalledWith(departmentId);
    expect(component.cities).toEqual(mockCities.filter(c => c.departmentId === departmentId));
  }));

  it('should show error toast if loading cities fails', fakeAsync(() => {
    const departmentId = 1;
    component.departments = mockDepartments;
    mockLocationService.getCitiesByDepartment.mockReturnValueOnce(throwError(() => new Error('Failed to load cities')));


    component.locationForm.controls.department.setValue(departmentId);
    tick();

    expect(mockLocationService.getCitiesByDepartment).toHaveBeenCalledWith(departmentId);
    expect(mockToastrService.error).toHaveBeenCalledWith('Error al cargar las ciudades', 'Error');
    expect(component.cities).toEqual([]);
  }));


  it('should clear cities and city control when department is set to null', fakeAsync(() => {
    component.cities = mockCities;
    component.locationForm.controls.city.setValue(101);
    component.locationForm.controls.department.setValue(1);
    tick();
    expect(component.cities).toEqual(mockCities);

    component.locationForm.controls.department.setValue(null);
    tick();

    expect(component.cities).toEqual([]);
    expect(component.locationForm.controls.city.value).toBeNull();
  }));

  it('should return correct department options', () => {
    component.departments = mockDepartments;
    const options = component.departmentOptions;
    expect(options).toEqual([
      { value: 1, label: 'Department A' },
      { value: 2, label: 'Department B' },
    ]);
  });

  it('should return correct city options', () => {
    component.cities = mockCities;
    const options = component.cityOptions;
    expect(options).toEqual([
      { value: 101, label: 'City A1' },
      { value: 102, label: 'City A2' },
    ]);
  });

  describe('onSubmit', () => {
    it('should not submit if the form is invalid', () => {
      component.onSubmit();

      expect(component.locationForm.invalid).toBe(true);
      expect(component.locationForm.controls.sector.touched).toBe(true);
      expect(component.locationForm.controls.department.touched).toBe(true);
      expect(component.locationForm.controls.city.touched).toBe(true);
      expect(mockToastrService.warning).toHaveBeenCalledWith('Por favor, completa todos los campos requeridos.', 'Formulario Inválido');
      expect(mockLocationService.createLocation).not.toHaveBeenCalled();
    });

    it('should handle BadRequest error (duplicate)', () => {
      component.locationForm.controls.sector.setValue(mockLocation.sector);
      component.locationForm.controls.department.setValue(1);
      component.locationForm.controls.city.setValue(mockLocation.cityId);

      const errorResponse = {
        status: HttpStatusCode.BadRequest,
        error: { message: 'Location already exists.' },
      };
      mockLocationService.createLocation.mockReturnValueOnce(throwError(() => errorResponse));

      component.onSubmit();

      expect(mockLocationService.createLocation).toHaveBeenCalled();
      expect(mockToastrService.error).toHaveBeenCalledWith('La ubicación ya existe.', 'Error al crear');
    });

    it('should handle BadRequest error (other)', () => {
      component.locationForm.controls.sector.setValue(mockLocation.sector);
      component.locationForm.controls.department.setValue(1);
      component.locationForm.controls.city.setValue(mockLocation.cityId);

      const errorResponse = {
        status: HttpStatusCode.BadRequest,
        error: { message: 'Some other validation error.' },
      };
      mockLocationService.createLocation.mockReturnValueOnce(throwError(() => errorResponse));

      component.onSubmit();

      expect(mockLocationService.createLocation).toHaveBeenCalled();
      expect(mockToastrService.error).toHaveBeenCalledWith('Some other validation error.', 'Error al crear');
    });

    it('should handle BadRequest error (other, no message)', () => {
      component.locationForm.controls.sector.setValue(mockLocation.sector);
      component.locationForm.controls.department.setValue(1);
      component.locationForm.controls.city.setValue(mockLocation.cityId);

      const errorResponse = {
        status: HttpStatusCode.BadRequest,
      };
      mockLocationService.createLocation.mockReturnValueOnce(throwError(() => errorResponse));

      component.onSubmit();

      expect(mockLocationService.createLocation).toHaveBeenCalled();
      expect(mockToastrService.error).toHaveBeenCalledWith('Datos inválidos.', 'Error al crear');
    });


    it('should handle generic server error', () => {
      component.locationForm.controls.sector.setValue(mockLocation.sector);
      component.locationForm.controls.department.setValue(1);
      component.locationForm.controls.city.setValue(mockLocation.cityId);

      const errorResponse = {
        status: HttpStatusCode.InternalServerError,
        error: { message: 'Something went wrong on the server.' },
      };
      mockLocationService.createLocation.mockReturnValueOnce(throwError(() => errorResponse));

      const consoleErrorSpy = jest.spyOn(console, 'error');

      component.onSubmit();

      expect(mockLocationService.createLocation).toHaveBeenCalled();
      expect(mockToastrService.error).toHaveBeenCalledWith('Error inesperado del servidor.', 'Error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error inesperado al crear ubicación:', expect.any(Object));

      consoleErrorSpy.mockRestore();
    });
  });
});