import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitComponent } from './visit.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { VisitService } from 'src/app/core/services/visit.service';
import { UserService } from 'src/app/core/services/user.service';
import { HouseService } from 'src/app/core/services/house.service';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('VisitComponent (Jest)', () => {
  let component: VisitComponent;
  let fixture: ComponentFixture<VisitComponent>;

  const mockAuthService = {
    hasRole: jest.fn(),
  };

  const mockUserService = {
    getUserById: jest.fn(),
  };

  const mockHouseService = {
    getHouseById: jest.fn(),
  };

  const mockVisitService = {
    searchVisits: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: VisitService, useValue: mockVisitService },
        { provide: UserService, useValue: mockUserService },
        { provide: HouseService, useValue: mockHouseService },
        { provide: TranslateService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isSeller to true if user has VENDEDOR role', () => {
    mockAuthService.hasRole.mockReturnValue(true);
    component.ngOnInit();
    expect(component.isSeller).toBe(true);
  });

  it('should set isSeller to false if user does not have VENDEDOR role', () => {
    mockAuthService.hasRole.mockReturnValue(false);
    component.ngOnInit();
    expect(component.isSeller).toBe(false);
  });

  it('should define visitTableColumns on init', () => {
    component.ngOnInit();
    expect(component.visitTableColumns.length).toBeGreaterThan(0);
    expect(component.visitTableColumns[0].header).toBe('ID');
  });

  it('should update pageSubject when onPageChange is called', () => {
    const spy = jest.spyOn(component['pageSubject'], 'next');
    component.onPageChange(3);
    expect(spy).toHaveBeenCalledWith(3);
  });

  it('should update sortSubject when onSortChange is called', () => {
    const spy = jest.spyOn(component['sortSubject'], 'next');
    const sort = { sortBy: 'userId', sortDirection: 'asc' } as const;
    component.onSortChange(sort);
    expect(spy).toHaveBeenCalledWith(sort);
  });

  it('should refresh visits by triggering pageSubject next with current value', () => {
    component['pageSubject'].next(2);
    const spy = jest.spyOn(component['pageSubject'], 'next');
    component.refreshVisits();
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should emit visits$ with enriched user and house data', (done) => {
    const pageResultMock = {
      content: [
        { id: 1, userId: 100, houseId: 200, startDateTime: new Date(), endDateTime: new Date() },
      ],
      totalElements: 1,
      totalPages: 1,
      currentPage: 0,
      pageSize: 10,
      isFirst: true,
      isLast: true,
    };

    const userMock = { firstName: 'John', lastName: 'Doe' };
    const houseMock = { name: 'House A' };

    mockVisitService.searchVisits.mockReturnValue(of(pageResultMock));
    mockUserService.getUserById.mockReturnValue(of(userMock));
    mockHouseService.getHouseById.mockReturnValue(of(houseMock));

    component.ngOnInit();
    component.visits$.subscribe(result => {
      expect(result.content[0].user).toEqual(userMock);
      expect(result.content[0].house).toEqual(houseMock);
      done();
    });
  });

  it('should handle errors in visits$ stream gracefully', (done) => {
    mockVisitService.searchVisits.mockReturnValue(throwError(() => new Error('Test error')));
    component.ngOnInit();

    component.visits$.subscribe(result => {
      expect(result.content).toEqual([]);
      expect(result.totalElements).toBe(0);
      done();
    });
  });

  it('should return correct sortBy and sortDirection getters', () => {
    component['sortSubject'].next({ sortBy: 'id', sortDirection: 'asc' });
    expect(component.sortBy).toBe('id');
    expect(component.sortDirection).toBe('asc');
  });
});
