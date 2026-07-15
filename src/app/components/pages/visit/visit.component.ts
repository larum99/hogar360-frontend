import { Component, OnInit, inject } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  catchError,
  switchMap,
  of,
  map,
  forkJoin,
} from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { VisitService } from 'src/app/core/services/visit.service';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { TableColumn } from 'src/app/shared/models/table-column.model';
import { UserService } from 'src/app/core/services/user.service';
import { HouseService } from 'src/app/core/services/house.service';
import { VisitListWithUser } from 'src/app/shared/models/visit-list-with-user.model';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss'],
})
export class VisitComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly visitService = inject(VisitService);
  private readonly userService = inject(UserService);
  private readonly houseService = inject(HouseService);
  private readonly fb = inject(FormBuilder);

  private readonly pageSubject = new BehaviorSubject<number>(0);
  private readonly sortSubject = new BehaviorSubject<{
    sortBy: string;
    sortDirection: 'asc' | 'desc';
  }>({
    sortBy: 'startDateTime',
    sortDirection: 'desc',
  });

  isSeller = false;

  visitTableColumns: TableColumn<VisitListWithUser>[] = [];

  filterForm: FormGroup = this.fb.group({
    department: [null],
    city: [null],
    sector: [null],
  });

  visits$: Observable<PageResult<VisitListWithUser>> = combineLatest([
    this.pageSubject,
    this.sortSubject,
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
  ]).pipe(
    switchMap(([page, sort, filters]) => {
      const cityId = filters.city;
      const sectorId = filters.sector;

      const criteria: any = {
        sortBy: sort.sortBy,
        sortDirection: sort.sortDirection,
      };

      if (filters.department) {
        criteria.departmentId = filters.department;
      }

      if (cityId && sectorId) {
        criteria.cityId = cityId;
        criteria.sector = sectorId;
      }


      return this.visitService.searchVisits(page, 10, criteria).pipe(
        switchMap((pageResult) => {
          if (pageResult.content.length === 0) {
            return of(pageResult);
          }

          const enriched$ = forkJoin(
            pageResult.content.map((visit) =>
              forkJoin({
                user: this.userService
                  .getUserById(visit.userId)
                  .pipe(catchError(() => of(null))),
                house: this.houseService
                  .getHouseById(visit.houseId)
                  .pipe(catchError(() => of(null))),
              }).pipe(map(({ user, house }) => ({ ...visit, user, house })))
            )
          );

          return enriched$.pipe(
            map((enrichedContent) => ({
              ...pageResult,
              content: enrichedContent,
            }))
          );
        }),
        catchError((error) => {
          console.error('Error cargando visitas:', error);
          return of({
            content: [],
            totalElements: 0,
            totalPages: 0,
            currentPage: page,
            pageSize: 10,
            isFirst: true,
            isLast: true,
          } as PageResult<VisitListWithUser>);
        })
      );
    })
  );

  ngOnInit(): void {
    this.defineVisitColumns();
    this.isSeller = this.authService.hasRole('VENDEDOR');
    this.filterForm.updateValueAndValidity();
  }

  private defineVisitColumns(): void {
    this.visitTableColumns = [
      {
        header: 'ID',
        cell: (v) => v.id,
        sortField: 'id',
        sortable: false,
        cellClass: 'list-table__cell--id',
        headerClass: 'list-table__header--id',
      },
      {
        header: 'Usuario',
        cell: (v) =>
          v.user
            ? `${v.user.firstName} ${v.user.lastName}`
            : `Usuario ID: ${v.userId}`,
        sortField: 'userId',
        sortable: true,
        cellClass: 'list-table__cell--user',
        headerClass: 'list-table__header--user',
      },
      {
        header: 'Propiedad',
        cell: (v) => (v.house ? v.house.name : `Casa ID: ${v.houseId}`),
        sortField: 'houseId',
        sortable: false,
        cellClass: 'list-table__cell--house',
        headerClass: 'list-table__header--house',
      },
      {
        header: 'Fecha Inicio',
        cell: (v) => formatDate(v.startDateTime, 'short', 'es-CO'),
        sortField: 'startDateTime',
        sortable: true,
        cellClass: 'list-table__cell--startDateTime',
        headerClass: 'list-table__header--startDateTime',
      },
      {
        header: 'Fecha Fin',
        cell: (v) => formatDate(v.endDateTime, 'short', 'es-CO'),
        sortField: 'endDateTime',
        sortable: true,
        cellClass: 'list-table__cell--endDateTime',
        headerClass: 'list-table__header--endDateTime',
      },
      {
        header: 'Ciudad',
        cell: (v) => v.house?.location?.cityName || 'N/A',
        sortField: '',
        sortable: false,
        cellClass: 'list-table__cell--city',
        headerClass: 'list-table__header--city',
      },
      {
        header: 'Sector',
        cell: (v) => v.house?.location?.sector || 'N/A',
        sortField: '',
        sortable: false,
        cellClass: 'list-table__cell--sector',
        headerClass: 'list-table__header--sector',
      },
    ];
  }

  onPageChange(page: number): void {
    this.pageSubject.next(page);
  }

  onSortChange(sort: { sortBy: string; sortDirection: 'asc' | 'desc' }): void {
    this.sortSubject.next(sort);
  }

  refreshVisits(): void {
    this.pageSubject.next(this.pageSubject.getValue());
  }

  get sortBy(): string {
    return this.sortSubject.value.sortBy;
  }

  get sortDirection(): 'asc' | 'desc' {
    return this.sortSubject.value.sortDirection;
  }

  onFiltersChanged(): void {
    this.pageSubject.next(0);
    this.filterForm.updateValueAndValidity();
  }
}
