import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatePickerComponent],
      imports: [ReactiveFormsModule],
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
      component.control.setValidators(Validators.required);
      component.control.setValue('');
      component.control.markAsTouched();
      component.control.updateValueAndValidity();
      fixture.detectChanges();

      expect(component.getErrorMessage()).toBe('Este campo es requerido.');
    });

    it('should return "Debes ser mayor de edad." when control has a notAdult error', () => {
      component.control.setErrors({ notAdult: true });
      fixture.detectChanges();

      expect(component.getErrorMessage()).toBe('Debes ser mayor de edad.');
    });

    it('should return "La fecha no puede exceder un mes desde hoy." when control has a maxOneMonth error', () => {
      component.control.setErrors({ maxOneMonth: true });
      fixture.detectChanges();

      expect(component.getErrorMessage()).toBe('La fecha no puede exceder un mes desde hoy.');
    });

    it('should return "Debe seleccionar una fecha igual o posterior a la fecha actual." when control has a pastDate error', () => {
      component.control.setErrors({ pastDate: true });
      fixture.detectChanges();

      expect(component.getErrorMessage()).toBe('Debe seleccionar una fecha igual o posterior a la fecha actual.');
    });

    it('should return "La fecha debe estar dentro de las próximas tres semanas." when control has an outOfRange error', () => {
      component.control.setErrors({ outOfRange: true });
      fixture.detectChanges();

      expect(component.getErrorMessage()).toBe('La fecha debe estar dentro de las próximas tres semanas.');
    });

    it('should return "Campo inválido." for other types of errors', () => {
      component.control.setErrors({ pattern: true });
      fixture.detectChanges();

      expect(component.getErrorMessage()).toBe('Campo inválido.');
    });

    it('should return "Campo inválido." when control has no errors', () => {
      component.control.setErrors(null);
      fixture.detectChanges();

      expect(component.getErrorMessage()).toBe('Campo inválido.');
    });
  });

  it('should accept and set the label input', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    expect(component.label).toBe('Test Label');
  });

  it('should accept and set the placeholder input', () => {
    component.placeholder = 'Select a date';
    fixture.detectChanges();
    expect(component.placeholder).toBe('Select a date');
  });

  it('should use the provided id input', () => {
    component.id = 'myDatePicker';
    component.ngOnInit();
    expect(component.generatedId).toBe('myDatePicker');
  });

  it('should generate an id if no id input is provided', () => {
    component.id = undefined;
    component.ngOnInit();
    expect(component.generatedId).toMatch(/^date-picker-/);
  });
});
