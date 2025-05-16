import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let faIconLibraryMock: jest.Mocked<FaIconLibrary>;

  beforeEach(() => {
    faIconLibraryMock = {
      addIcons: jest.fn(),
    } as unknown as jest.Mocked<FaIconLibrary>;

    TestBed.configureTestingModule({
      declarations: [PaginationComponent],
      providers: [{ provide: FaIconLibrary, useValue: faIconLibraryMock }],
    });

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should call generatePageNumbers when totalPages changes', () => {
      const spy = jest.spyOn(component as any, 'generatePageNumbers');
      const changes: SimpleChanges = {
        totalPages: new SimpleChange(3, 5, false),
      };
      component.ngOnChanges(changes);
      expect(spy).toHaveBeenCalled();
    });

    it('should call generatePageNumbers when currentPage changes', () => {
      const spy = jest.spyOn(component as any, 'generatePageNumbers');
      const changes: SimpleChanges = {
        currentPage: new SimpleChange(1, 2, false),
      };
      component.ngOnChanges(changes);
      expect(spy).toHaveBeenCalled();
    });

    it('should NOT call generatePageNumbers if unrelated inputs change', () => {
      const spy = jest.spyOn(component as any, 'generatePageNumbers');
      const changes: SimpleChanges = {
        someOtherInput: new SimpleChange('a', 'b', false),
      };
      component.ngOnChanges(changes);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('generatePageNumbers', () => {
    it('should generate correct range when currentPage is in the middle', () => {
      component.totalPages = 7;
      component.currentPage = 3;
      (component as any)['generatePageNumbers']();
      expect(component.pageNumbers).toEqual([0, null, 2, 3, 4, null, 6]);
    });

    it('should generate correct range when currentPage is at the start', () => {
      component.totalPages = 5;
      component.currentPage = 0;
      (component as any)['generatePageNumbers']();
      expect(component.pageNumbers).toEqual([0, 1, 2, null, 4]);
    });

    it('should generate correct range when totalPages is 1', () => {
      component.totalPages = 1;
      component.currentPage = 0;
      (component as any)['generatePageNumbers']();
      expect(component.pageNumbers).toEqual([0]);
    });

    it('should generate correct range when totalPages is 0', () => {
      component.totalPages = 0;
      component.currentPage = 0;
      (component as any)['generatePageNumbers']();
      expect(component.pageNumbers).toEqual([0]);
    });
  });

  describe('goToPage', () => {
    beforeEach(() => {
      jest.spyOn(component.pageChange, 'emit');
      component.totalPages = 5;
    });

    it('should emit pageChange when valid and different page', () => {
      component.currentPage = 2;
      component.goToPage(3);
      expect(component.pageChange.emit).toHaveBeenCalledWith(3);
    });

    it('should NOT emit when page is current', () => {
      component.currentPage = 2;
      component.goToPage(2);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should NOT emit when page is negative', () => {
      component.goToPage(-1);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should NOT emit when page equals totalPages', () => {
      component.goToPage(component.totalPages);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should NOT emit when page > totalPages', () => {
      component.goToPage(component.totalPages + 1);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should NOT emit when page is null', () => {
      component.goToPage(null as unknown as number);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
  });
});
