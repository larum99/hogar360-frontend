import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateVisitFormComponent } from './create-visit-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { VisitService } from 'src/app/core/services/visit.service';
import { HouseService } from 'src/app/core/services/house.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('CreateVisitFormComponent', () => {
  let component: CreateVisitFormComponent;
  let fixture: ComponentFixture<CreateVisitFormComponent>;

  const mockToastrService = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  };

  const mockHouseService = {
    listHousesByPublisher: jest.fn().mockReturnValue(of([])),
  };

  const mockVisitService = {
    createVisit: jest.fn().mockReturnValue(of({})),
  };

  const mockAuthService = {
    getUserId: jest.fn().mockReturnValue(1),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CreateVisitFormComponent],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        { provide: HouseService, useValue: mockHouseService },
        { provide: VisitService, useValue: mockVisitService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateVisitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const formValue = component.visitForm.getRawValue();
    expect(formValue.houseId).toBeNull();
    expect(formValue.date).toBeNull();
    expect(formValue.startTime).toBeNull();
    expect(formValue.endTime).toBeNull();
  });

  it('should call loadHouses with publisherId on init', () => {
    expect(mockAuthService.getUserId).toHaveBeenCalled();
    expect(mockHouseService.listHousesByPublisher).toHaveBeenCalledWith(1);
  });

  it('should show warning if form is invalid on submit', () => {
    component.onSubmit();
    expect(mockToastrService.warning).toHaveBeenCalledWith(
      'Por favor completa todos los campos requeridos.',
      'Formulario inválido'
    );
  });

  it('should populate housesOptions on successful loadHouses', () => {
    const mockHouses = [
      { id: 10, name: 'House 1' },
      { id: 20, name: 'House 2' },
    ];
    mockHouseService.listHousesByPublisher.mockReturnValue(of(mockHouses));
    component.loadHouses(1);
    expect(component.housesOptions).toEqual([
      { value: 10, label: 'House 1' },
      { value: 20, label: 'House 2' },
    ]);
  });

  it('should show error toastr on loadHouses error', () => {
    mockHouseService.listHousesByPublisher.mockReturnValue(
      throwError(() => new Error('fail'))
    );
    component.loadHouses(1);
    expect(mockToastrService.error).toHaveBeenCalledWith(
      'No se pudieron cargar las casas.',
      'Error'
    );
  });

  it('should show error toastr if no userId on init', () => {
    mockAuthService.getUserId.mockReturnValue(null);
    component.ngOnInit();
    expect(mockToastrService.error).toHaveBeenCalledWith(
      'No se pudo obtener el usuario autenticado.',
      'Error'
    );
  });

  it('should remove invalidTimeRange error from endTime control when form error is cleared', () => {
    const endTimeControl = component.visitForm.get('endTime')!;
    endTimeControl.setErrors({ invalidTimeRange: true });
    component.visitForm.setErrors(null);
    component.visitForm.updateValueAndValidity();
    expect(endTimeControl.hasError('invalidTimeRange')).toBe(false);
  });
});
