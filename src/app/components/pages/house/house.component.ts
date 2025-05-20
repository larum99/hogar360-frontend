import { Component, OnInit, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  switchMap,
  catchError,
  of,
} from 'rxjs';
import { HouseService } from 'src/app/core/services/house.service';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { TableColumn } from 'src/app/shared/models/table-column.model';
import { HouseList } from 'src/app/shared/models/house-list.model';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
})
export class HouseComponent implements OnInit {
  private readonly houseService = inject(HouseService);

  private readonly pageSubject = new BehaviorSubject<number>(0);
  private readonly sortSubject = new BehaviorSubject<{
    sortBy: string;
    sortDirection: 'asc' | 'desc';
  }>({
    sortBy: 'price',
    sortDirection: 'asc',
  });

  houses$: Observable<PageResult<HouseList>> = combineLatest([
    this.pageSubject.asObservable(),
    this.sortSubject.asObservable(),
  ]).pipe(
    switchMap(([page, sort]) =>
      this.houseService
        .listHouses(page, 10, sort.sortBy, sort.sortDirection)
        .pipe(
          catchError((error) => {
            console.error('Error loading houses:', error);
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

  houseTableColumns: TableColumn<HouseList>[] = [];

  ngOnInit(): void {
    this.defineHouseColumns();
  }

  defineHouseColumns(): void {
    this.houseTableColumns = [
      {
        header: 'ID',
        cell: (house) => house.id,
        sortField: 'id',
        sortable: false,
        cellClass: 'list-table__cell--id',
        headerClass: 'list-table__header--id',
      },
      {
        header: 'Nombre',
        cell: (house) => house.name,
        sortField: 'name',
        sortable: false,
        cellClass: 'list-table__cell--name',
      },
      {
        header: 'Categoría',
        cell: (house) => house.category.name,
        sortField: 'category',
        sortable: true,
        cellClass: 'list-table__cell--category',
      },
      {
        header: 'Ciudad',
        cell: (house) => house.location.cityName,
        sortField: 'location.cityName',
        sortable: true,
        cellClass: 'list-table__cell--city',
      },
      {
        header: 'Sector',
        cell: (house) => house.location.sector,
        sortField: 'location.sector',
        sortable: true,
        cellClass: 'list-table__cell--sector',
      },
      {
        header: 'Cuartos',
        cell: (house) => house.bedrooms,
        sortField: 'bedrooms',
        sortable: true,
        cellClass: 'list-table__cell--bedrooms',
        headerClass: 'list-table__header--bedrooms',
      },
      {
        header: 'Baños',
        cell: (house) => house.bathrooms,
        sortField: 'bathrooms',
        sortable: true,
        cellClass: 'list-table__cell--bathrooms',
        headerClass: 'list-table__header--bathrooms',
      },
      {
        header: 'Precio',
        cell: (house) => `$${house.price.toLocaleString()}`,
        sortField: 'price',
        sortable: true,
        cellClass: 'list-table__cell--price',
      },
      {
        header: 'Estado',
        cell: (house) => house.status,
        sortField: 'status',
        sortable: false,
        cellClass: 'list-table__cell--status',
      },
    ];
  }

  onPageChange(page: number): void {
    this.pageSubject.next(page);
  }

  onSortChange(sort: { sortBy: string; sortDirection: 'asc' | 'desc' }): void {
    this.sortSubject.next(sort);
  }

  refreshHouses(): void {
    this.pageSubject.next(this.pageSubject.getValue());
  }

  get sortBy() {
    return this.sortSubject.value.sortBy;
  }

  get sortDirection() {
    return this.sortSubject.value.sortDirection;
  }
}
