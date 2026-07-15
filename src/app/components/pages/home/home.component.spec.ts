import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { HouseService } from 'src/app/core/services/house.service';
import { VisitService } from 'src/app/core/services/visit.service';
import { HouseList } from 'src/app/shared/models/house-list.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent (Jest)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const mockHouses: HouseList[] = [
    {
      id: 1,
      name: 'Casa 1',
      description: 'Bonita casa',
      category: {
        id: 1,
        name: 'Residencial',
        description: 'Casas familiares'
      },
      bedrooms: 3,
      bathrooms: 2,
      price: 1000,
      location: {
        id: 1,
        sector: 'San Isidro',
        cityName: 'Lima',
        departmentName: 'Lima'
      },
      publicationDate: '2024-06-01T00:00:00Z',
      activePublicationDate: '2024-06-01T00:00:00Z',
      status: 'PUBLICADA',
      publisherId: 1
    },
    {
      id: 2,
      name: 'Casa 2',
      description: 'Otra casa',
      category: {
        id: 2,
        name: 'Comercial',
        description: 'Locales comerciales'
      },
      bedrooms: 2,
      bathrooms: 1,
      price: 2000,
      location: {
        id: 2,
        sector: 'Centro',
        cityName: 'Cusco',
        departmentName: 'Cusco'
      },
      publicationDate: '2024-06-02T00:00:00Z',
      activePublicationDate: '2024-06-02T00:00:00Z',
      status: 'PUBLICADA',
      publisherId: 2
    }
  ];

  const mockHouseService = {
    listHouses: jest.fn()
  };

  const mockVisitService = {
    getAvailableVisitsByHouseId: jest.fn().mockReturnValue(of([]))
  };

  beforeEach(() => {
    mockHouseService.listHouses.mockReturnValue(of({ content: mockHouses }));

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: HouseService, useValue: mockHouseService },
        { provide: VisitService, useValue: mockVisitService }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call houseService.listHouses on init', () => {
    expect(mockHouseService.listHouses).toHaveBeenCalledWith(
      0,
      10,
      'category',
      'asc',
      {}
    );
  });

  it('should call houseService.listHouses with city filter when onCityChanged is called', () => {
    component.onCityChanged('Lima');

    expect(mockHouseService.listHouses).toHaveBeenCalledWith(
      0,
      10,
      'category',
      'asc',
      { city: 'Lima' }
    );
  });

  it('should call houseService.listHouses with new sorting when onSortChanged is called', () => {
    component.onSortChanged({ sortBy: 'name', sortDirection: 'desc' });

    expect(mockHouseService.listHouses).toHaveBeenCalledWith(
      0,
      10,
      'name',
      'desc',
      {}
    );
  });

  it('should populate houses$ observable correctly on init', (done) => {
    component.houses$.subscribe(houses => {
      expect(houses).toEqual(mockHouses);
      done();
    });
  });
});
