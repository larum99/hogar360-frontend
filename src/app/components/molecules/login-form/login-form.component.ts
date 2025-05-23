import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required]),
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastr.warning('Por favor completa todos los campos.', 'Formulario Inválido');
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email!.trim(), password!).subscribe({
      next: () => {
        this.toastr.success('Inicio de sesión exitoso.', 'Bienvenido');
        this.loginForm.reset();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        const msg = err?.error?.message || 'Credenciales inválidas.';
        this.toastr.error(msg, 'Error de autenticación');
      },
    });
  }
}
