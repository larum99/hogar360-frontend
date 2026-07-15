import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputTextComponent } from './input-text.component';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { fakeAsync, tick } from '@angular/core/testing';

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
    component.control.setValue('');
    component.control.markAsTouched();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(
      By.css('.input-text__error')
    ).nativeElement;

    expect(errorEl.textContent.trim()).toBe('Este campo es requerido');
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
  });

  it('should show whitespace error message when onlyWhitespace error is present', () => {
    component.control.setErrors({ onlyWhitespace: true });
    component.control.markAsTouched();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(
      By.css('.input-text__error')
    ).nativeElement;

    expect(errorEl.textContent.trim()).toBe(
      'No se permiten solo espacios en blanco'
    );
  });

  it('should show email error message when email error is present', () => {
    component.control = new FormControl('invalid-email', [Validators.email]);
    component.control.markAsTouched();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(
      By.css('.input-text__error')
    ).nativeElement;

    expect(errorEl.textContent.trim()).toBe('Correo electrónico inválido');
  });

  it('should show pattern error message when pattern error is present', () => {
    component.control = new FormControl('', [Validators.pattern(/^\d+$/)]);
    component.control.setValue('abc');
    component.control.markAsTouched();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(
      By.css('.input-text__error')
    ).nativeElement;

    expect(errorEl.textContent.trim()).toBe('Formato inválido.');
  });

  it('should show min value error when min error is present', fakeAsync(() => {
    component.control.setErrors({ min: { min: 10, actual: 5 } });
    component.control.markAsTouched();

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(
      By.css('.input-text__error')
    ).nativeElement;
    expect(errorEl.textContent.trim()).toBe('El valor debe ser mayor o igual a 10');
  }));

  it('should show mismatch error when mismatch error is present', fakeAsync(() => {
    component.control.setErrors({ mismatch: true });
    component.control.markAsTouched();

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(
      By.css('.input-text__error')
    ).nativeElement;
    expect(errorEl.textContent.trim()).toBe('Las contraseñas no coinciden.');
  }));
});
