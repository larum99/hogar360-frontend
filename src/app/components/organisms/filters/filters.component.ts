import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  sortControl = new FormControl<string>('category');
  cityControl = new FormControl<string>('');

  @Output() sortChanged = new EventEmitter<{ sortBy: string, sortDirection: string }>();
  @Output() cityChanged = new EventEmitter<string>();

  readonly sortOptions = [
    { label: 'Categoría', value: 'category' },
    { label: 'Precio', value: 'price' },
    { label: 'Habitaciones', value: 'bedrooms' },
    { label: 'Baños', value: 'bathrooms' },
  ];

  constructor() {
    this.sortControl.valueChanges.subscribe((value) => {
      if (value !== null) {
        this.sortChanged.emit({ sortBy: value, sortDirection: 'asc' });
      }
    });

    this.cityControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((city) => {
        if (city !== null) {
          this.cityChanged.emit(city);
        }
      });
  }
}
