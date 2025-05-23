import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginFormComponent } from './login-form.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

describe('LoginFormComponent (Jest)', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  // Mocks
  let authServiceMock: jest.Mocked<AuthService>;
  let toastrServiceMock: jest.Mocked<ToastrService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
    } as unknown as jest.Mocked<ToastrService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show warning when form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(toastrServiceMock.warning).toHaveBeenCalledWith(
      'Por favor completa todos los campos.',
      'Formulario Inválido'
    );
  });

  it('should login successfully and navigate', () => {
    component.loginForm.setValue({ email: 'test@email.com', password: '123456' });
    authServiceMock.login.mockReturnValue(of({ token: 'fake-jwt-token' }));

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith('test@email.com', '123456');
    expect(toastrServiceMock.success).toHaveBeenCalledWith(
      'Inicio de sesión exitoso.',
      'Bienvenido'
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error when login fails', () => {
    const errorResponse = { error: { message: 'Credenciales inválidas.' } };
    component.loginForm.setValue({ email: 'test@fail.com', password: 'wrong' });

    authServiceMock.login.mockReturnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(toastrServiceMock.error).toHaveBeenCalledWith(
      'Credenciales inválidas.',
      'Error de autenticación'
    );
  });
});
