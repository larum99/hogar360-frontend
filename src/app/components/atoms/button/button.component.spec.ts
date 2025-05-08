import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct label', () => {
    const testLabel = 'Click me';
    component.label = testLabel;
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.textContent?.trim()).toBe(testLabel);
  });

  it('should have the correct button type', () => {
    const testType = 'submit';
    component.type = testType;
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.getAttribute('type')).toBe(testType);
  });

  it('should emit click event when button is clicked', () => {
    const clickSpy = jest.spyOn(component.click, 'emit');

    const buttonElement: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    buttonElement.click();

    expect(clickSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});