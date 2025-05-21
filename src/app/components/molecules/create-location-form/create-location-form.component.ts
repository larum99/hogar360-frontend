import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../../../core/services/location.service';
import { Department } from 'src/app/shared/models/department.model';
import { City } from 'src/app/shared/models/city.model';
import { Location } from 'src/app/shared/models/location.model';
import { HttpStatusCode } from '@angular/common/http';
import { SelectOption } from 'src/app/shared/models/select-option.model';
import { noOnlyWhitespaceValidator } from 'src/app/shared/utils/custom-validators';
import { ApiResponse } from 'src/app/shared/models/api-response.model';

@Component({
  selector: 'app-create-location-form',
  templateUrl: './create-location-form.component.html',
  styleUrls: ['./create-location-form.component.scss'],
})
export class CreateLocationFormComponent implements OnInit {
  @Output() created = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly locationService = inject(LocationService);

  departments: Department[] = [];
  cities: City[] = [];

  locationForm: FormGroup<{
    sector: FormControl<string | null>;
    department: FormControl<number | null>;
    city: FormControl<number | null>;
  }> = this.formBuilder.group({
    sector: this.formBuilder.control<string | null>('', [
      Validators.required,
      Validators.maxLength(50),
      noOnlyWhitespaceValidator,
    ]),
    department: this.formBuilder.control<number | null>(null, [
      Validators.required,
    ]),
    city: this.formBuilder.control<number | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    this.loadDepartments();

    this.locationForm.controls.department.valueChanges.subscribe(
      (departmentId) => {
        if (departmentId !== null) {
          this.locationForm.controls.city.setValue(null);
          this.loadCitiesByDepartment(departmentId);
        } else {
          this.cities = [];
          this.locationForm.controls.city.setValue(null);
        }
      }
    );
  }

  get departmentOptions(): SelectOption[] {
    return this.departments.map((department) => ({
      value: department.id,
      label: department.name,
    }));
  }

  get cityOptions(): SelectOption[] {
    return this.cities.map((city) => ({ value: city.id, label: city.name }));
  }

  private loadDepartments(): void {
    this.locationService.getDepartments().subscribe({
      next: (response) => (this.departments = response),
      error: () =>
        this.toastr.error('Error al cargar los departamentos', 'Error'),
    });
  }

  private loadCitiesByDepartment(departmentId: number): void {
    this.locationService.getCitiesByDepartment(departmentId).subscribe({
      next: (response) => (this.cities = response),
      error: () => this.toastr.error('Error al cargar las ciudades', 'Error'),
    });
  }

  onSubmit(): void {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      this.toastr.warning(
        'Por favor, completa todos los campos requeridos.',
        'Formulario Inválido'
      );
      return;
    }

    const { sector, city } = this.locationForm.getRawValue();

    const requestData: Location = {
      sector: sector!.trim(),
      cityId: city!,
    };

    this.locationService.createLocation(requestData).subscribe({
      next: (response: ApiResponse) => {
        this.toastr.success('La ubicación fue creada exitosamente.', 'Éxito');
        this.locationForm.reset();
        this.locationForm.controls.city.setValue(null);
        this.cities = [];
        this.created.emit();
      },
      error: (error) => {
        const serverMessage = error?.error?.message ?? error?.error?.mensaje;

        if (error.status === HttpStatusCode.BadRequest) {
          const isDuplicate =
            serverMessage &&
            (serverMessage.toLowerCase().includes('exists') ||
              serverMessage.toLowerCase().includes('existe'));

          this.toastr.error(
            isDuplicate
              ? 'La ubicación ya existe.'
              : serverMessage ?? 'Datos inválidos.',
            'Error al crear'
          );
        } else {
          console.error('Error inesperado al crear ubicación:', error);
          this.toastr.error('Error inesperado del servidor.', 'Error');
        }
      },
    });
  }
}
