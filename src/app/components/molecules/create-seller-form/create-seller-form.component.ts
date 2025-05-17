import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpStatusCode } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/shared/models/user.model';
import {
  isAdultValidator,
  noOnlyWhitespaceValidator,
} from 'src/app/shared/utils/custom-validators';
import { ApiResponse } from 'src/app/shared/models/api-response.model';

@Component({
  selector: 'app-create-seller-form',
  templateUrl: './create-seller-form.component.html',
  styleUrls: ['./create-seller-form.component.scss'],
})
export class CreateSellerFormComponent {
  @Output() created = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly toastr = inject(ToastrService);

  sellerForm: FormGroup<{
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    identityDocument: FormControl<string | null>;
    phoneNumber: FormControl<string | null>;
    birthDate: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = this.formBuilder.group({
    firstName: this.formBuilder.control('', [
      Validators.required,
      noOnlyWhitespaceValidator,
    ]),
    lastName: this.formBuilder.control('', [
      Validators.required,
      noOnlyWhitespaceValidator,
    ]),
    identityDocument: this.formBuilder.control('', [
      Validators.required,
      Validators.pattern(/^\d+$/),
      noOnlyWhitespaceValidator,
    ]),
    phoneNumber: this.formBuilder.control('', [
      Validators.required,
      Validators.pattern(/^\+?\d*$/),
      noOnlyWhitespaceValidator,
    ]),
    birthDate: this.formBuilder.control('', [
      Validators.required,
      isAdultValidator,
    ]),
    email: this.formBuilder.control('', [
      Validators.required,
      Validators.email,
      noOnlyWhitespaceValidator,
    ]),
    password: this.formBuilder.control('', [
      Validators.required,
      noOnlyWhitespaceValidator,
    ]),
  });

  onSubmit(): void {
    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();
      this.toastr.warning(
        'Por favor, completa todos los campos requeridos.',
        'Formulario Inválido'
      );
      return;
    }

    const {
      firstName,
      lastName,
      identityDocument,
      phoneNumber,
      birthDate,
      email,
      password,
    } = this.sellerForm.getRawValue();

    const seller: User = {
      firstName: firstName!.trim(),
      lastName: lastName!.trim(),
      identityDocument: identityDocument!.trim(),
      phoneNumber: phoneNumber!,
      birthDate: birthDate!,
      email: email!.trim(),
      password: password!,
    };

    this.userService.createSeller(seller).subscribe({
      next: (response: ApiResponse) => {
        this.toastr.success('Vendedor creado exitosamente.', 'Éxito');
        this.sellerForm.reset();
        this.created.emit();
      },
      error: (error) => {
        const serverMessage = error?.error?.message ?? error?.error?.mensaje;

        if (error.status === HttpStatusCode.Conflict) {
          const isDuplicate =
            serverMessage &&
            (serverMessage.toLowerCase().includes('exists') ||
              serverMessage.toLowerCase().includes('existe'));

          this.toastr.error(
            isDuplicate
              ? 'El usuario ya existe.'
              : serverMessage ?? 'Datos inválidos.',
            'Error al crear'
          );
        } else {
          console.error('Error inesperado al crear vendedor:', error);
          this.toastr.error('Error inesperado del servidor.', 'Error');
        }
      },
    });
  }
}
