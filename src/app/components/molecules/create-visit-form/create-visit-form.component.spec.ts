import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVisitFormComponent } from './create-visit-form.component';

describe('CreateVisitFormComponent', () => {
  let component: CreateVisitFormComponent;
  let fixture: ComponentFixture<CreateVisitFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateVisitFormComponent]
    });
    fixture = TestBed.createComponent(CreateVisitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
