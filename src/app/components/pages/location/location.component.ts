import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  startWith,
  switchMap,
  catchError,
  of,
} from 'rxjs';
import { LocationService } from '../../../core/services/location.service';
import { LocationSearch } from 'src/app/shared/models/location-search.model';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { TableColumn } from 'src/app/shared/models/table-column.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  private readonly locationService = inject(LocationService);
  private readonly authService = inject(AuthService);

  searchControl = new FormControl<string>('');
  private readonly pageSubject = new BehaviorSubject<number>(0);
  private readonly sortSubject = new BehaviorSubject<{
    sortBy: string;
    sortDirection: 'asc' | 'desc';
  }>({
    sortBy: 'city.name',
    sortDirection: 'asc',
  });

  locations$: Observable<PageResult<LocationSearch>> = combineLatest([
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
    this.pageSubject.asObservable(),
    this.sortSubject.asObservable(),
  ]).pipe(
    switchMap(([search, page, sort]) =>
      this.locationService
        .searchLocations(
          search ?? '',
          page,
          10,
          sort.sortBy,
          sort.sortDirection
        )
        .pipe(
          catchError((error) => {
            console.error('Error loading locations:', error);
            return of({
              content: [],
              totalElements: 0,
              totalPages: 0,
              currentPage: page,
              pageSize: 10,
              isFirst: true,
              isLast: true,
            });
          })
        )
    )
  );

  locationTableColumns: TableColumn<LocationSearch>[] = [];

  isAdmin = false;

  ngOnInit(): void {
    this.defineLocationColumns();
    this.isAdmin = this.authService.hasRole('ADMIN');

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageSubject.next(0);
    });
  }

  defineLocationColumns(): void {
    this.locationTableColumns = [
      {
        header: 'ID',
        cell: (element: LocationSearch) => element.id,
        sortField: 'id',
        sortable: false,
        cellClass: 'list-table__cell--id',
      },
      {
        header: 'Departamento',
        cell: (element: LocationSearch) => element.departmentName,
        sortField: 'city.department.name',
        sortable: true,
        cellClass: 'list-table__cell--department',
      },
      {
        header: 'Ciudad',
        cell: (element: LocationSearch) => element.cityName,
        sortField: 'city.name',
        sortable: true,
        cellClass: 'list-table__cell--city',
      },
      {
        header: 'Sector',
        cell: (element: LocationSearch) => element.sector,
        sortField: 'sector',
        sortable: false,
        cellClass: 'list-table__cell--sector',
      },
    ];
  }

  onPageChange(page: number): void {
    this.pageSubject.next(page);
  }

  onSortChange(sort: { sortBy: string; sortDirection: 'asc' | 'desc' }): void {
    this.sortSubject.next(sort);
  }

  refreshLocations(): void {
    this.pageSubject.next(this.pageSubject.getValue());
  }

  get sortBy() {
    return this.sortSubject.value.sortBy;
  }

  get sortDirection() {
    return this.sortSubject.value.sortDirection;
  }
}
