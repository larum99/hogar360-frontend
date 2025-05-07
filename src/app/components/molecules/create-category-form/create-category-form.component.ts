import { HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/shared/models/category.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-category-form',
  templateUrl: './create-category-form.component.html',
  styleUrls: ['./create-category-form.component.scss'],
})
export class CreateCategoryFormComponent {
  @Output() created = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly toastr = inject(ToastrService);

  categoryForm: FormGroup<{
    name: FormControl<string | null>;
    description: FormControl<string | null>;
  }> = this.formBuilder.group({
    name: this.formBuilder.control<string | null>('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    description: this.formBuilder.control<string | null>('', [
      Validators.required,
      Validators.maxLength(90),
    ]),
  });

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      this.toastr.warning(
        'Por favor, completa todos los campos requeridos.',
        'Formulario Inválido'
      );
      return;
    }

    const { name, description } = this.categoryForm.getRawValue();

    const categoryData: Category = {
      name: name!,
      description: description!,
    };

    this.categoryService.createCategory(categoryData).subscribe({
      next: () => {
        this.toastr.success(
          'La categoría ha sido creada exitosamente.',
          'Éxito!'
        );
        this.categoryForm.reset();
        this.created.emit();
      },
      error: (error) => {
        console.log('Error completo:', error);

        const serverErrorMessage =
          error?.error?.message ?? error?.error?.mensaje;
        let displayMessage = 'Ocurrió un error inesperado.';
        let toastrTitle = 'Error';

        if (error.status === HttpStatusCode.BadRequest) {
          toastrTitle = 'Error al crear';

          if (
            serverErrorMessage &&
            (serverErrorMessage.toLowerCase().includes('exists') ||
              serverErrorMessage.toLowerCase().includes('existe'))
          ) {
            displayMessage = 'La categoría ya existe.';
            this.toastr.error(displayMessage, toastrTitle);
          } else {
            displayMessage =
              serverErrorMessage ??
              'Solicitud inválida, por favor revisa los datos ingresados.';
            this.toastr.error(displayMessage, toastrTitle);
          }
        } else if (error.status === HttpStatusCode.InternalServerError) {
          toastrTitle = 'Error del servidor';
          displayMessage =
            'Ocurrió un error en el servidor. Intenta más tarde.';
          this.toastr.error(displayMessage, toastrTitle);
        } else {
          this.toastr.error(displayMessage, toastrTitle);
        }
      },
    });
  }
}
