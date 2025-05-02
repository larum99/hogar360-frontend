import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/components/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-create-category-form',
  templateUrl: './create-category-form.component.html',
  styleUrls: ['./create-category-form.component.scss']
})
export class CreateCategoryFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);

  categoryForm: FormGroup<{
    name: FormControl<string | null>;
    description: FormControl<string | null>;
  }> = this.fb.group({
    name: this.fb.control<string | null>('', [Validators.required, Validators.maxLength(50)]),
    description: this.fb.control<string | null>('', [Validators.required, Validators.maxLength(90)])
  });

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const { name, description } = this.categoryForm.getRawValue();

    const categoryData: Category = {
      name: name!,
      description: description!
    };

    console.log('Datos que se enviarán:', categoryData);

    this.categoryService.createCategory(categoryData).subscribe({
      next: (response) => {
        console.log('Categoría creada exitosamente', response);
        this.categoryForm.reset();
      },
      error: (error) => {
        console.log('Error completo:', error);
        let errorMessage = '';
        if (error?.error) {
          errorMessage = error?.error?.message ?? error?.error?.mensaje ?? 'Error desconocido';
        }

        if (error.status === 400) {
          if (errorMessage.toLowerCase().includes('exists') || errorMessage.toLowerCase().includes('already')) {
            console.error('La categoría ya existe');
            alert('La categoría ya existe.');
          } else {
            console.error('Solicitud inválida', error);
            alert('Solicitud inválida, por favor revisa los datos ingresados.');
          }
        } else if (error.status === 500) {
          console.error('Error interno del servidor', error);
          alert('Ocurrió un error en el servidor. Intenta más tarde.');
        } else {
          console.error('Error al crear la categoría', error);
          alert('Ocurrió un error inesperado.');
        }
      }
    });
  }
}
