import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../core/services/category.service';
import { LocationService } from '../../../core/services/location.service';
import { HouseService } from '../../../core/services/house.service';
import { Department } from 'src/app/shared/models/department.model';
import { City } from 'src/app/shared/models/city.model';
import { Location } from 'src/app/shared/models/location.model';
import { Category } from 'src/app/shared/models/category.model';
import { SelectOption } from 'src/app/shared/models/select-option.model';
import { HouseCreation } from 'src/app/shared/models/house-creation.model';
import { maxOneMonthFromTodayValidator, noOnlyWhitespaceValidator, pastDateValidator } from 'src/app/shared/utils/custom-validators';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-create-house-form',
  templateUrl: './create-house-form.component.html',
  styleUrls: ['./create-house-form.component.scss'],
})
export class CreateHouseFormComponent implements OnInit {
  @Output() created = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly categoryService = inject(CategoryService);
  private readonly locationService = inject(LocationService);
  private readonly houseService = inject(HouseService);

  departments: Department[] = [];
  cities: City[] = [];
  locations: Location[] = [];
  categories: SelectOption[] = [];

  houseForm: FormGroup<{
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    categoryId: FormControl<number | null>;
    bedrooms: FormControl<number | null>;
    bathrooms: FormControl<number | null>;
    price: FormControl<number | null>;
    department: FormControl<number | null>;
    city: FormControl<number | null>;
    locationId: FormControl<number | null>;
    activePublicationDate: FormControl<string | null>;
  }> = this.formBuilder.group({
    name: this.formBuilder.control('', [
      Validators.required,
      Validators.maxLength(50),
      noOnlyWhitespaceValidator,
    ]),
    description: this.formBuilder.control('', [
      Validators.required,
      Validators.maxLength(90),
      noOnlyWhitespaceValidator,
    ]),
    categoryId: this.formBuilder.control<number | null>(null, [
      Validators.required,
    ]),
    bedrooms: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    bathrooms: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    price: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    department: this.formBuilder.control<number | null>(null, [
      Validators.required,
    ]),
    city: this.formBuilder.control<number | null>(null, [Validators.required]),
    locationId: this.formBuilder.control<number | null>(null, [
      Validators.required,
    ]),
    activePublicationDate: this.formBuilder.control<string | null>(null, [
      Validators.required,
      maxOneMonthFromTodayValidator, pastDateValidator
    ]),
  });

  ngOnInit(): void {
    this.loadDepartments();
    this.loadCategories();

    this.houseForm.controls.department.valueChanges.subscribe(
      (departmentId) => {
        if (departmentId !== null) {
          this.loadCitiesByDepartment(departmentId);
          this.houseForm.controls.city.setValue(null);
          this.cities = [];
          this.locations = [];
          this.houseForm.controls.locationId.setValue(null);
        }
      }
    );

    this.houseForm.controls.city.valueChanges.subscribe((cityId) => {
      if (cityId !== null) {
        this.loadLocationsByCity(cityId);
        this.houseForm.controls.locationId.setValue(null);
      }
    });
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

  get locationOptions(): SelectOption[] {
    return this.locations
      .filter((location) => location.id !== undefined)
      .map((location) => ({
        value: location.id as number,
        label: location.sector,
      }));
  }

  get categoryOptions(): SelectOption[] {
    return this.categories;
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

  private loadLocationsByCity(cityId: number): void {
    this.locationService.getLocationsByCity(cityId).subscribe({
      next: (response) => (this.locations = response),
      error: () =>
        this.toastr.error('Error al cargar las ubicaciones', 'Error'),
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategories(0, 100).subscribe({
      next: (response) => {
        this.categories = response.content.map((category: Category) => ({
          value: category.id!,
          label: category.name,
        }));
      },
      error: () => this.toastr.error('Error al cargar las categorías', 'Error'),
    });
  }

  onSubmit(): void {
    if (this.houseForm.invalid) {
      this.houseForm.markAllAsTouched();
      this.toastr.warning(
        'Por favor, completa todos los campos requeridos.',
        'Formulario Inválido'
      );
      return;
    }

    const {
      name,
      description,
      categoryId,
      bedrooms,
      bathrooms,
      price,
      locationId,
      activePublicationDate,
    } = this.houseForm.getRawValue();

    const requestData: HouseCreation = {
      name: name!.trim(),
      description: description!.trim(),
      categoryId: categoryId!,
      bedrooms: bedrooms!,
      bathrooms: bathrooms!,
      price: price!,
      locationId: locationId!,
      activePublicationDate: activePublicationDate!,
    };

    this.houseService.createHouse(requestData).subscribe({
      next: () => {
        this.toastr.success('La casa fue publicada exitosamente.', 'Éxito');
        this.houseForm.reset();
        this.cities = [];
        this.locations = [];
        this.houseForm.controls.city.setValue(null);
        this.houseForm.controls.locationId.setValue(null);
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
              ? 'La casa ya fue registrada.'
              : serverMessage ?? 'Datos inválidos.',
            'Error al publicar'
          );
        } else {
          console.error('Error inesperado al publicar casa:', error);
          this.toastr.error('Error inesperado del servidor.', 'Error');
        }
      },
    });
  }
}
