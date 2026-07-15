import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitFilterComponent } from './visit-filter.component';

describe('VisitFilterComponent', () => {
  let component: VisitFilterComponent;
  let fixture: ComponentFixture<VisitFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitFilterComponent]
    });
    fixture = TestBed.createComponent(VisitFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
