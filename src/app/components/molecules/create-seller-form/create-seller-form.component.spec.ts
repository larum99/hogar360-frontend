import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

import { CreateSellerFormComponent } from './create-seller-form.component';
import { UserService } from 'src/app/core/services/user.service';

const mockUserService = {
  createSeller: jest.fn().mockReturnValue(of({})),
};

const mockToastrService = {
  warning: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
};

describe('CreateSellerFormComponent', () => {
  let component: CreateSellerFormComponent;
  let fixture: ComponentFixture<CreateSellerFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CreateSellerFormComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ToastrService, useValue: mockToastrService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSellerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the form as invalid and show warning if empty on submit', () => {
    component.sellerForm.reset();

    component.onSubmit();

    expect(component.sellerForm.invalid).toBe(true);
    expect(mockToastrService.warning).toHaveBeenCalledWith(
      'Por favor, completa todos los campos requeridos.',
      'Formulario Inválido'
    );
  });

  it('should be valid when all fields are correctly filled', () => {
    component.sellerForm.setValue({
      firstName: 'Juan',
      lastName: 'Pérez',
      identityDocument: '123456789',
      phoneNumber: '+573001112233',
      birthDate: '2000-01-01',
      email: 'juan.perez@example.com',
      password: 'securePass123',
      confirmPassword: 'securePass123',
    });

    expect(component.sellerForm.valid).toBe(true);
  });

  it('should call createSeller and show success message on valid form submit', () => {
    const formValue = {
      firstName: 'Juan',
      lastName: 'Pérez',
      identityDocument: '123456789',
      phoneNumber: '+573001112233',
      birthDate: '2000-01-01',
      email: 'juan.perez@example.com',
      password: 'securePass123',
      confirmPassword: 'securePass123',
    };

    component.sellerForm.setValue(formValue);

    const createSellerSpy = jest
      .spyOn(mockUserService, 'createSeller')
      .mockReturnValue(of({}));

    const createdSpy = jest.spyOn(component.created, 'emit');

    component.onSubmit();

    expect(createSellerSpy).toHaveBeenCalledWith({
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      identityDocument: formValue.identityDocument.trim(),
      phoneNumber: formValue.phoneNumber,
      birthDate: formValue.birthDate,
      email: formValue.email.trim(),
      password: formValue.password,
    });

    expect(mockToastrService.success).toHaveBeenCalledWith(
      'Vendedor creado exitosamente.',
      'Éxito'
    );

    expect(component.sellerForm.pristine).toBe(true);

    expect(createdSpy).toHaveBeenCalled();
  });

  it('should show duplicate user error message on 409 Conflict error', () => {
    const formValue = {
      firstName: 'Juan',
      lastName: 'Pérez',
      identityDocument: '123456789',
      phoneNumber: '+573001112233',
      birthDate: '2000-01-01',
      email: 'juan.perez@example.com',
      password: 'securePass123',
      confirmPassword: 'securePass123',
    };

    component.sellerForm.setValue(formValue);

    const errorResponse = {
      status: HttpStatusCode.Conflict,
      error: { message: 'User already exists' },
    };

    jest.spyOn(mockUserService, 'createSeller').mockReturnValueOnce(
      throwError(() => errorResponse)
    );

    component.onSubmit();

    expect(mockToastrService.error).toHaveBeenCalledWith(
      'El usuario ya existe.',
      'Error al crear'
    );
  });

  it('should show generic server error message on unexpected error', () => {
    const formValue = {
      firstName: 'Juan',
      lastName: 'Pérez',
      identityDocument: '123456789',
      phoneNumber: '+573001112233',
      birthDate: '2000-01-01',
      email: 'juan.perez@example.com',
      password: 'securePass123',
      confirmPassword: 'securePass123',
    };

    component.sellerForm.setValue(formValue);

    const errorResponse = {
      status: 500,
      error: { message: 'Internal server error' },
    };

    jest.spyOn(mockUserService, 'createSeller').mockReturnValueOnce(
      throwError(() => errorResponse)
    );

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    component.onSubmit();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error inesperado al crear vendedor:',
      errorResponse
    );

    expect(mockToastrService.error).toHaveBeenCalledWith(
      'Error inesperado del servidor.',
      'Error'
    );

    consoleErrorSpy.mockRestore();
  });
});
