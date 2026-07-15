import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LocationService } from '../../../core/services/location.service';
import { Department } from 'src/app/shared/models/department.model';
import { City } from 'src/app/shared/models/city.model';
import { Location } from 'src/app/shared/models/location.model';
import { SelectOption } from 'src/app/shared/models/select-option.model';
import { VisitFiltersForm } from 'src/app/shared/models/visit-filters-form.model';

@Component({
  selector: 'app-visit-filter',
  templateUrl: './visit-filter.component.html',
  styleUrls: ['./visit-filter.component.scss'],
})
export class VisitFilterComponent implements OnInit {
  @Input() form!: FormGroup<{
    department: FormControl<number | null>;
    city: FormControl<number | null>;
    sector: FormControl<string | null>;
  }>;

  @Output() filtersChanged = new EventEmitter<VisitFiltersForm>();

  departments: Department[] = [];
  cities: City[] = [];
  sectors: Location[] = [];

  private locationService = inject(LocationService);

  ngOnInit(): void {
    this.loadDepartments();

    this.form.controls.department.valueChanges.subscribe((departmentId) => {
      this.form.controls.city.setValue(null);
      this.form.controls.sector.setValue(null);
      this.sectors = [];

      if (departmentId !== null) {
        this.loadCitiesByDepartment(departmentId);
      } else {
        this.cities = [];
      }

      this.emitFilters();
    });

    this.form.controls.city.valueChanges.subscribe((cityId) => {
      this.form.controls.sector.setValue(null);

      if (cityId !== null) {
        this.loadSectorsByCity(cityId);
      } else {
        this.sectors = [];
      }

      this.emitFilters();
    });

    this.form.controls.sector.valueChanges
      .subscribe(() => {
        this.emitFilters();
      });
  }

  get departmentOptions(): SelectOption[] {
    return this.departments.map((d) => ({
      value: d.id,
      label: d.name,
    }));
  }

  get cityOptions(): SelectOption[] {
    return this.cities.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  }

  get sectorOptions(): SelectOption[] {
    return this.sectors.map((s) => ({
      value: s.sector,
      label: s.sector,
    }));
  }

  private loadDepartments(): void {
    this.locationService.getDepartments().subscribe({
      next: (response) => (this.departments = response),
      error: () => console.error('Error al cargar departamentos'),
    });
  }

  private loadCitiesByDepartment(departmentId: number): void {
    this.locationService.getCitiesByDepartment(departmentId).subscribe({
      next: (response) => (this.cities = response),
      error: () => console.error('Error al cargar ciudades'),
    });
  }

  private loadSectorsByCity(cityId: number): void {
    this.locationService.getLocationsByCity(cityId).subscribe({
      next: (response) => (this.sectors = response),
      error: () => console.error('Error al cargar sectores'),
    });
  }

  private emitFilters(): void {
    const { department, city, sector } = this.form.getRawValue();

    this.filtersChanged.emit({
      departmentId: department,
      cityId: city,
      sector: (sector ?? '').trim(),
    });
  }
}
