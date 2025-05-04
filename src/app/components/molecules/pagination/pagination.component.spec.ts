import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginationComponent]
    });
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goToPage', () => {
    beforeEach(() => {
      jest.spyOn(component.pageChange, 'emit');
    });

    it('should emit pageChange if page is within valid range', () => {
      component.totalPages = 5;
      component.goToPage(2);
      expect(component.pageChange.emit).toHaveBeenCalledWith(2);
    });

    it('should NOT emit pageChange if page is negative', () => {
      component.totalPages = 5;
      component.goToPage(-1);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should NOT emit pageChange if page is equal to totalPages', () => {
      component.totalPages = 5;
      component.goToPage(5); // límite superior inválido
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should NOT emit pageChange if page is greater than totalPages', () => {
      component.totalPages = 5;
      component.goToPage(10);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
  });
});
