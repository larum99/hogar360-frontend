import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import { TimePickerComponent } from './time-picker.component';

describe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TimePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimePickerComponent);
    component = fixture.componentInstance;

    component.control = new FormControl(null, Validators.required);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a unique inputId on init', () => {
    expect(component.inputId).toMatch(/^time-picker-/);
  });

  it('should return error message if control is required and invalid', () => {
    expect(component.getErrorMessage()).toBe('Este campo es requerido');

    component.control.setValue('10:00');
    expect(component.getErrorMessage()).toBe('');
  });
});
