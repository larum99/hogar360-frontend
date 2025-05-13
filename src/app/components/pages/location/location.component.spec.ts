import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationComponent } from './location.component';
import { LocationService } from '../../../core/services/location.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationSearch } from 'src/app/shared/models/location-search.model';
import { PageResult } from 'src/app/shared/models/page-result.model';

type Sort = { sortBy: string; sortDirection: 'asc' | 'desc' };

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;
  let locationServiceMock: jest.Mocked<LocationService>;

  const mockLocations: PageResult<LocationSearch> = {
    content: [
      {
        id: 1,
        departmentName: 'Depto 1',
        cityName: 'Ciudad 1',
        sector: 'Sector A',
      },
    ],
    totalElements: 1,
    totalPages: 1,
    currentPage: 0,
    pageSize: 10,
    isFirst: true,
    isLast: true,
  };

  beforeEach(async () => {
    locationServiceMock = {
      searchLocations: jest.fn().mockReturnValue(of(mockLocations)),
    } as unknown as jest.Mocked<LocationService>;

    await TestBed.configureTestingModule({
      declarations: [LocationComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: LocationService, useValue: locationServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define columns on init', () => {
    expect(component.locationTableColumns.length).toBe(4);
    expect(component.locationTableColumns.map((c) => c.header)).toEqual([
      'ID',
      'Departamento',
      'Ciudad',
      'Sector',
    ]);
  });

  it('should call service on init and update locations$', (done) => {
    component.locations$.subscribe((result) => {
      expect(locationServiceMock.searchLocations).toHaveBeenCalledWith(
        '',
        0,
        10,
        'city.name',
        'asc'
      );
      expect(result.content.length).toBe(1);
      expect(result.content[0].cityName).toBe('Ciudad 1');
      done();
    });
  });

  it('should update page on onPageChange', () => {
    const nextPage = 2;
    component.onPageChange(nextPage);
    expect(component['pageSubject'].value).toBe(nextPage);
  });

  it('should update sort on onSortChange', () => {
    const sort: Sort = {
      sortBy: 'city.department.name',
      sortDirection: 'desc',
    };
    component.onSortChange(sort);
    expect(component.sortBy).toBe(sort.sortBy);
    expect(component.sortDirection).toBe(sort.sortDirection);
  });

  it('should handle service error and return fallback empty result', (done) => {
    locationServiceMock.searchLocations.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;

    component['pageSubject'].next(1);

    component.locations$.subscribe((result) => {
      expect(result.content).toEqual([]);
      expect(result.totalElements).toBe(0);
      done();
    });

    fixture.detectChanges();
  });

  it('should use the value from searchControl when it is not empty', (done) => {
    const searchTerm = 'Sector A';
    const sort: Sort = {
      sortBy: 'city.name',
      sortDirection: 'asc',
    };

    component.searchControl.setValue(searchTerm);
    component.onSortChange(sort);

    component.locations$.subscribe((result) => {
      expect(locationServiceMock.searchLocations).toHaveBeenCalledWith(
        searchTerm,
        0,
        10,
        'city.name',
        'asc'
      );
      done();
    });

    fixture.detectChanges();
  });

  it('should fallback to empty string if searchControl emits null', (done) => {
    component.searchControl.setValue(null);

    component.locations$.subscribe(() => {
      expect(locationServiceMock.searchLocations).toHaveBeenCalledWith(
        '',
        0,
        10,
        'city.name',
        'asc'
      );
      done();
    });

    fixture.detectChanges();
  });

  it('should define location table columns', () => {
    component.defineLocationColumns();
    expect(component.locationTableColumns.length).toBeGreaterThan(0);
    expect(component.locationTableColumns[0].header).toBe('ID');
  });

  it('should correctly map data in table columns', () => {
    component.defineLocationColumns();

    const mockElement: LocationSearch = {
      id: 1,
      departmentName: 'Antioquia',
      cityName: 'Medellín',
      sector: 'Centro',
    };

    const idCell = component.locationTableColumns[0].cell(mockElement);
    const departmentCell = component.locationTableColumns[1].cell(mockElement);
    const cityCell = component.locationTableColumns[2].cell(mockElement);
    const sectorCell = component.locationTableColumns[3].cell(mockElement);

    expect(idCell).toBe(1);
    expect(departmentCell).toBe('Antioquia');
    expect(cityCell).toBe('Medellín');
    expect(sectorCell).toBe('Centro');
  });

  it('should emit new page number when page changes', () => {
    const spy = jest.spyOn(component['pageSubject'], 'next');
    component.onPageChange(3);
    expect(spy).toHaveBeenCalledWith(3);
  });

  it('should emit sort event when sort changes', () => {
    const spy = jest.spyOn(component['sortSubject'], 'next');
    component.onSortChange({ sortBy: 'city.name', sortDirection: 'desc' });
    expect(spy).toHaveBeenCalledWith({ sortBy: 'city.name', sortDirection: 'desc' });
  });

  it('should refresh locations using current page', () => {
    const spy = jest.spyOn(component['pageSubject'], 'next');
    component.refreshLocations();
    expect(spy).toHaveBeenCalledWith(component['pageSubject'].getValue());
  });
});
