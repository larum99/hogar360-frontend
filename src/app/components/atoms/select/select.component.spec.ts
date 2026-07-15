import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectComponent],
      imports: [ReactiveFormsModule], // ¡Importante!
    });

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;

    component.label = 'Ubicación';
    component.options = [
      { value: '1', label: 'Cali' },
      { value: '2', label: 'Bogotá' },
    ];
    component.control = new FormControl('', Validators.required);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show required error message', () => {
    component.control.markAsTouched();
    component.control.updateValueAndValidity();
    fixture.detectChanges();

    expect(component.getErrorMessage()).toBe('Este campo es requerido');
  });
});
