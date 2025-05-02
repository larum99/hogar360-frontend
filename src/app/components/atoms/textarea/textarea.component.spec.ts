import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TextareaComponent } from './textarea.component';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextareaComponent],
      imports: [ReactiveFormsModule]
    });

    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;

    // Asignar valores de prueba
    component.label = 'Descripción';
    component.placeholder = 'Escribe algo aquí...';
    component.control = new FormControl('', [Validators.required, Validators.maxLength(90)]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and placeholder correctly', () => {
    const labelEl = fixture.debugElement.query(By.css('label')).nativeElement;
    const textareaEl = fixture.debugElement.query(By.css('textarea')).nativeElement;

    expect(labelEl.textContent).toContain('Descripción');
    expect(textareaEl.placeholder).toBe('Escribe algo aquí...');
  });

  it('should show character count correctly', () => {
    component.control.setValue('Hola mundo');
    fixture.detectChanges();

    const currentEl = fixture.debugElement.query(By.css('.textarea__current')).nativeElement;
    const maxEl = fixture.debugElement.query(By.css('.textarea__max')).nativeElement;

    expect(currentEl.textContent).toBe('10');
    expect(maxEl.textContent).toBe('/90');
  });

  it('should show error when required and touched', () => {
    component.control.markAsTouched();
    component.control.setValue('');
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.textarea__error')).nativeElement;
    expect(errorEl.textContent.trim()).toBe('Este campo es requerido');
    expect(errorEl.style.visibility).toBe('visible');
  });

  it('should show maxlength error when text exceeds 90 characters', () => {
    const longText = 'a'.repeat(91);
    component.control.setValue(longText);
    component.control.markAsTouched();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.textarea__error')).nativeElement;
    expect(errorEl.textContent.trim()).toBe('Excediste el número máximo de caracteres (Máximo 90).');
    expect(errorEl.style.visibility).toBe('visible');
  });

  it('should not show error when control is valid', () => {
    component.control.setValue('Texto válido');
    component.control.markAsTouched();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.textarea__error')).nativeElement;
    expect(errorEl.textContent.trim()).toBe('');
    expect(errorEl.style.visibility).toBe('hidden');
  });
});
