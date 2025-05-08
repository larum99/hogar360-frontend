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

});
