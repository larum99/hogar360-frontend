import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatePickerComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    component.control = new FormControl(null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getErrorMessage', () => {
    it('should return "Este campo es requerido." when control has a required error', () => {
      component.control = new FormControl('', Validators.required);
      component.control.markAsTouched();
      component.control.updateValueAndValidity();
      fixture.detectChanges();

      expect(component.getErrorMessage()).toBe('Este campo es requerido.');
    });

    it('should return "Campo inválido." for other types of errors', () => {
      component.control = new FormControl('invalid format');
      component.control.setErrors({ 'pattern': true });
      fixture.detectChanges();

      expect(component.getErrorMessage()).toBe('Campo inválido.');
    });

    it('should return "Campo inválido." when control has no specific errors matched', () => {
        component.control = new FormControl('some value');
        component.control.setErrors(null);
        fixture.detectChanges();
        expect(component.getErrorMessage()).toBe('Campo inválido.');
    });
  });

  it('should accept and display the label input', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    expect(component.label).toBe('Test Label');
  });

  it('should accept and display the placeholder input', () => {
    component.placeholder = 'Select a date';
    fixture.detectChanges();
    expect(component.placeholder).toBe('Select a date');
  });

  it('should accept and display the id input', () => {
    component.id = 'myDatePicker';
    fixture.detectChanges();
    expect(component.id).toBe('myDatePicker');
  });

  it('should accept and display the required input', () => {
    component.required = true;
    fixture.detectChanges();
    expect(component.required).toBe(true);
  });
});