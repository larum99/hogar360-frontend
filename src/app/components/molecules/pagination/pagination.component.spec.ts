import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { SimpleChanges, SimpleChange } from '@angular/core';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginationComponent],
    });
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    let changes: SimpleChanges;

    beforeEach(() => {
      jest.spyOn(component as any, 'generatePageNumbers');
    });

    it('should call generatePageNumbers when totalPages input changes', () => {
      changes = {
        totalPages: new SimpleChange(0, 5, false),
      };
      component.ngOnChanges(changes);
      expect(component['generatePageNumbers']).toHaveBeenCalled();
    });

    it('should NOT call generatePageNumbers when other inputs change', () => {
      changes = {
        currentPage: new SimpleChange(0, 1, false),
      };
      component.ngOnChanges(changes);
      expect(component['generatePageNumbers']).not.toHaveBeenCalled();
    });

    it('should call generatePageNumbers if totalPages change is the first change', () => {
      changes = {
        totalPages: new SimpleChange(undefined, 5, true),
      };
      component.ngOnChanges(changes);
      expect(component['generatePageNumbers']).toHaveBeenCalled();
    });
  });

  describe('generatePageNumbers', () => {
    it('should populate pageNumbers array when totalPages is greater than 0', () => {
      component.totalPages = 5;
      (component as any)['generatePageNumbers']();
      expect(component.pageNumbers).toEqual([0, 1, 2, 3, 4]);
    });

    it('should set pageNumbers to an empty array when totalPages is 0', () => {
      component.totalPages = 0;
      (component as any)['generatePageNumbers']();
      expect(component.pageNumbers).toEqual([]);
    });

    it('should set pageNumbers to an empty array when totalPages is less than 0', () => {
      component.totalPages = -1;
      (component as any)['generatePageNumbers']();
      expect(component.pageNumbers).toEqual([]);
    });
  });

  describe('goToPage', () => {
    beforeEach(() => {
      jest.spyOn(component.pageChange, 'emit');
      component.totalPages = 5;
    });

    it('should emit pageChange if page is within valid range and not the current page', () => {
      component.currentPage = 1;
      component.goToPage(2);
      expect(component.pageChange.emit).toHaveBeenCalledWith(2);
    });

    it('should NOT emit pageChange if page is the current page', () => {
      component.currentPage = 2;
      component.goToPage(2);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should NOT emit pageChange if page is negative', () => {
      component.goToPage(-1);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should NOT emit pageChange if page is equal to totalPages', () => {
      component.goToPage(component.totalPages);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should NOT emit pageChange if page is greater than totalPages', () => {
      component.goToPage(component.totalPages + 1);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
  });
});
