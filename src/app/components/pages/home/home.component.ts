import { Component, OnInit, inject } from '@angular/core';
import { Observable, map, switchMap, of } from 'rxjs';
import { HouseList } from 'src/app/shared/models/house-list.model';
import { HouseService } from 'src/app/core/services/house.service';
import { HouseFilters } from 'src/app/shared/models/house-filters.models';
import { VisitList } from 'src/app/shared/models/visit-list.model';
import { VisitService } from 'src/app/core/services/visit.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private readonly houseService = inject(HouseService);
  private readonly visitService = inject(VisitService);

  sortBy = 'category';
  sortDirection = 'asc';
  city: string = '';

  houses$!: Observable<HouseList[]>;
  selectedHouseId: number | null = null;
  availableVisits$: Observable<VisitList[]> = of([]);

  ngOnInit(): void {
    this.loadHouses();
  }

  onSortChanged(sort: { sortBy: string; sortDirection: string }): void {
    this.sortBy = sort.sortBy;
    this.sortDirection = sort.sortDirection;
    this.loadHouses();
  }

  onCityChanged(city: string): void {
    this.city = city;
    this.loadHouses();
  }

  loadHouses(): void {
    const filters: HouseFilters = {};
    if (this.city) filters.city = this.city;

    this.houses$ = this.houseService
      .listHouses(0, 10, this.sortBy, this.sortDirection, filters)
      .pipe(map((result) => result.content));
  }

  onHouseSelected(houseId: number): void {
    this.selectedHouseId = houseId;
    this.availableVisits$ = this.visitService.getAvailableVisitsByHouseId(houseId);
  }

  closeModal(): void {
    this.selectedHouseId = null;
    this.availableVisits$ = of([]);
  }
}
