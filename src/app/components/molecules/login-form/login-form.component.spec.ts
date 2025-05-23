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

  it('should show 401 error for invalid credentials', () => {
    const errorResponse = { status: 401, error: { message: 'Credenciales inválidas.' } };
    component.loginForm.setValue({ email: 'test@fail.com', password: 'wrong' });

    authServiceMock.login.mockReturnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(toastrServiceMock.error).toHaveBeenCalledWith(
      'Credenciales inválidas.',
      'Error de autenticación'
    );
  });

  it('should show connection error when server is unreachable', () => {
    const errorResponse = { status: 0 };
    component.loginForm.setValue({ email: 'any@email.com', password: '123456' });

    authServiceMock.login.mockReturnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(toastrServiceMock.error).toHaveBeenCalledWith(
      'No se pudo conectar con el servidor. Intenta más tarde.',
      'Error de conexión'
    );
  });

  it('should show default error when unexpected error occurs', () => {
    const errorResponse = { status: 500, error: { message: 'Error interno del servidor' } };
    component.loginForm.setValue({ email: 'server@error.com', password: 'any' });

    authServiceMock.login.mockReturnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(toastrServiceMock.error).toHaveBeenCalledWith(
      'Error interno del servidor',
      'Error'
    );
  });

  it('should show fallback message if no error message is provided', () => {
    const errorResponse = { status: 500 };
    component.loginForm.setValue({ email: 'no@msg.com', password: 'pass' });

    authServiceMock.login.mockReturnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(toastrServiceMock.error).toHaveBeenCalledWith(
      'Ocurrió un error inesperado.',
      'Error'
    );
  });
});
