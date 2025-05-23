import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HouseComponent } from './house.component';
import { HouseService } from 'src/app/core/services/house.service';
import { of, throwError } from 'rxjs';
import { PageResult } from 'src/app/shared/models/page-result.model';
import { HouseList } from 'src/app/shared/models/house-list.model';
import { CurrencyPipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';

describe('HouseComponent', () => {
  let component: HouseComponent;
  let fixture: ComponentFixture<HouseComponent>;
  let mockHouseService: jest.Mocked<HouseService>;
  let mockAuthService: jest.Mocked<AuthService>;

  const mockResponse: PageResult<HouseList> = {
    content: [
      {
        id: 1,
        name: 'Casa 1',
        description: 'Description casa 1',
        category: {
          id: 1,
          name: 'Residencial',
          description: 'Casa para familia',
        },
        location: {
          id: 1,
          cityName: 'Ciudad A',
          sector: 'Centro',
          departmentName: 'Departamento A',
        },
        bedrooms: 3,
        bathrooms: 2,
        price: 100000,
        status: 'Publicado',
        publicationDate: '2025-06-01',
        activePublicationDate: '2025-06-15',
        publisherId: 1,
      },
    ],
    totalElements: 1,
    totalPages: 1,
    currentPage: 0,
    pageSize: 10,
    isFirst: true,
    isLast: true,
  };

  beforeEach(() => {
    mockHouseService = {
      listHouses: jest.fn().mockReturnValue(of(mockResponse)),
    } as unknown as jest.Mocked<HouseService>;

    mockAuthService = {
      hasRole: jest.fn().mockReturnValue(false),
    } as unknown as jest.Mocked<AuthService>;

    const translateServiceMock = {
      instant: (key: string) => {
        const translations: Record<string, string> = {
          'house.status.Publicado': 'Publicado',
        };
        return translations[key] || key;
      },
    };

    TestBed.configureTestingModule({
      declarations: [HouseComponent],
      providers: [
        { provide: HouseService, useValue: mockHouseService },
        { provide: AuthService, useValue: mockAuthService },
        CurrencyPipe,
        { provide: TranslateService, useValue: translateServiceMock },
      ],
      imports: [TranslateModule.forRoot()],
    });

    fixture = TestBed.createComponent(HouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define columns on init', () => {
    expect(component.houseTableColumns.length).toBeGreaterThan(0);
    const column = component.houseTableColumns.find(
      (c) => c.header === 'Nombre'
    );
    expect(column).toBeDefined();
    expect(column?.sortField).toBe('name');
  });

  it('should call houseService.listHouses with default params', (done) => {
    component.houses$.subscribe((result) => {
      expect(mockHouseService.listHouses).toHaveBeenCalledWith(
        0,
        10,
        'price',
        'asc'
      );
      expect(result.content.length).toBe(1);
      done();
    });
  });

  it('should emit new page when onPageChange is called', () => {
    const nextSpy = jest.spyOn(component['pageSubject'], 'next');
    component.onPageChange(2);
    expect(nextSpy).toHaveBeenCalledWith(2);
  });

  it('should emit new sort when onSortChange is called', () => {
    const nextSpy = jest.spyOn(component['sortSubject'], 'next');
    const sort: { sortBy: string; sortDirection: 'asc' | 'desc' } = {
      sortBy: 'name',
      sortDirection: 'desc',
    };
    component.onSortChange(sort);
    expect(nextSpy).toHaveBeenCalledWith(sort);
  });

  it('should refresh houses by re-emitting current page', () => {
    const currentPage = component['pageSubject'].getValue();
    const nextSpy = jest.spyOn(component['pageSubject'], 'next');
    component.refreshHouses();
    expect(nextSpy).toHaveBeenCalledWith(currentPage);
  });

  it('should handle error and return empty result when service fails', (done) => {
    mockHouseService.listHouses.mockReturnValueOnce(
      throwError(() => new Error('Internal error'))
    );

    component.houses$.subscribe((result) => {
      expect(result.content).toEqual([]);
      expect(result.totalElements).toBe(0);
      expect(result.totalPages).toBe(0);
      done();
    });
  });

  it('should return correct sortBy and sortDirection values', () => {
    expect(component.sortBy).toBe('price');
    expect(component.sortDirection).toBe('asc');
  });

  it('should correctly evaluate all cell functions for a house', () => {
    const house = mockResponse.content[0];
    const columns = component.houseTableColumns;

    const expectedValues: Record<string, any> = {
      ID: 1,
      Nombre: 'Casa 1',
      Categoría: 'Residencial',
      Ciudad: 'Ciudad A',
      Sector: 'Centro',
      Cuartos: 3,
      Baños: 2,
      Precio: 'COP100,000',
      Estado: 'Publicado',
    };

    for (const column of columns) {
      const result = column.cell(house);
      const expected = expectedValues[column.header];
      expect(result).toEqual(expected);
    }
  });
});
