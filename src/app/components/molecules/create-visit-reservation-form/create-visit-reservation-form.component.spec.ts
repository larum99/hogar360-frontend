import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { CreateVisitReservationFormComponent } from './create-visit-reservation-form.component';
import { VisitService } from 'src/app/core/services/visit.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VisitList } from 'src/app/shared/models/visit-list.model';

describe('CreateVisitReservationFormComponent', () => {
  let component: CreateVisitReservationFormComponent;
  let fixture: ComponentFixture<CreateVisitReservationFormComponent>;
  let visitServiceMock: Partial<jest.Mocked<VisitService>>;
  let toastrMock: Partial<jest.Mocked<ToastrService>>;

  beforeEach(async () => {
    visitServiceMock = {
      reserveVisit: jest.fn(),
    };

    toastrMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CreateVisitReservationFormComponent],
      providers: [
        { provide: VisitService, useValue: visitServiceMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateVisitReservationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update visitOptions, hasVisits and patch visitId when visits input changes with visits', () => {
    const visitsMock: VisitList[] = [
      {
        id: 1,
        userId: 10,
        houseId: 100,
        startDateTime: '2024-01-01T10:00:00Z',
        endDateTime: '2024-01-01T11:00:00Z',
      },
      {
        id: 2,
        userId: 20,
        houseId: 200,
        startDateTime: '2024-02-01T10:00:00Z',
        endDateTime: '2024-02-01T11:00:00Z',
      },
    ];

    component.visits = visitsMock;

    const changes: SimpleChanges = {
      visits: new SimpleChange(null, visitsMock, true),
    };

    component.ngOnChanges(changes);

    expect(component.visitOptions.length).toBe(2);
    expect(component.hasVisits).toBe(true);
    expect(component.reservationForm.get('visitId')?.value).toBe(1);

    expect(component.visitOptions[0]).toEqual({
      value: 1,
      label: expect.stringContaining('2024'),
    });
  });

  it('should clear visitOptions, set hasVisits false and patch visitId null when visits input changes with empty array', () => {
    component.visits = [];

    const changes: SimpleChanges = {
      visits: new SimpleChange(null, [], true),
    };

    component.ngOnChanges(changes);

    expect(component.visitOptions.length).toBe(0);
    expect(component.hasVisits).toBe(false);
    expect(component.reservationForm.get('visitId')?.value).toBeNull();
  });

  it('should handle visits input being null', () => {
    component.visits = null;

    const changes: SimpleChanges = {
      visits: new SimpleChange([], null, true),
    };

    component.ngOnChanges(changes);

    expect(component.visitOptions.length).toBe(0);
    expect(component.hasVisits).toBe(false);
    expect(component.reservationForm.get('visitId')?.value).toBeNull();
  });

  it('should show warning if form is invalid on submit', () => {
    component.reservationForm.setValue({ visitId: null, buyerEmail: '' });

    component.onSubmit();

    expect(toastrMock.warning).toHaveBeenCalledWith(
      'Completa todos los campos correctamente.',
      'Formulario inválido'
    );
  });

  it('should call reserveVisit and emit reserved event when form is valid', () => {
    const mockEmail = 'test@example.com';
    component.reservationForm.setValue({ visitId: 123, buyerEmail: mockEmail });

    (visitServiceMock.reserveVisit as jest.Mock).mockReturnValue(of({}));
    const emitSpy = jest.spyOn(component.reserved, 'emit');

    component.onSubmit();

    expect(visitServiceMock.reserveVisit).toHaveBeenCalledWith({
      visitId: 123,
      buyerEmail: mockEmail,
    });
    expect(toastrMock.success).toHaveBeenCalledWith(
      'Reserva realizada con éxito.',
      '¡Éxito!'
    );
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should show error toast if reserveVisit fails with message', () => {
    component.reservationForm.setValue({
      visitId: 123,
      buyerEmail: 'fail@example.com',
    });

    (visitServiceMock.reserveVisit as jest.Mock).mockReturnValue(
      throwError(() => ({ error: { message: 'Correo ya registrado' } }))
    );

    component.onSubmit();

    expect(toastrMock.error).toHaveBeenCalledWith(
      'Correo ya registrado',
      'Error'
    );
  });

  it('should show default error message if reserveVisit fails without message', () => {
    component.reservationForm.setValue({
      visitId: 123,
      buyerEmail: 'fail@example.com',
    });

    (visitServiceMock.reserveVisit as jest.Mock).mockReturnValue(
      throwError(() => ({}))
    );

    component.onSubmit();

    expect(toastrMock.error).toHaveBeenCalledWith(
      'Ocurrió un error al reservar.',
      'Error'
    );
  });
});
