import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputTextComponent } from './input-text.component';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('InputTextComponent', () => {
  let component: InputTextComponent;
  let fixture: ComponentFixture<InputTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputTextComponent],
      imports: [ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(InputTextComponent);
    component = fixture.componentInstance;

    component.label = 'Nombre';
    component.placeholder = 'Ingresa nombre';
    component.control = new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and placeholder correctly', () => {
    const labelEl = fixture.debugElement.query(By.css('label')).nativeElement;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(labelEl.textContent).toContain('Nombre');
    expect(inputEl.placeholder).toBe('Ingresa nombre');
  });

  it('should show error message when control is invalid and touched', () => {
    component.control.markAsTouched();
    component.control.setValue('');
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(
      By.css('.input-text__error')
    ).nativeElement;
    expect(errorEl.textContent.trim()).toBe('Este campo es requerido');
    expect(errorEl.style.visibility).toBe('visible');
  });

  it('should not show error message when control is valid', () => {
    component.control.setValue('Texto válido');
    component.control.markAsTouched();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(
      By.css('.input-text__error')
    ).nativeElement;
    expect(errorEl.textContent.trim()).toBe('');
    expect(errorEl.style.visibility).toBe('hidden');
  });

  it('should show maxlength error message when input exceeds limit', () => {
    const longText = 'a'.repeat(51);
    component.control.setValue(longText);
    component.control.markAsTouched();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(
      By.css('.input-text__error')
    ).nativeElement;
    expect(errorEl.textContent.trim()).toBe(
      'Excediste el número máximo de caracteres (Máximo 50 caracteres)'
    );
    expect(errorEl.style.visibility).toBe('visible');
  });
});
