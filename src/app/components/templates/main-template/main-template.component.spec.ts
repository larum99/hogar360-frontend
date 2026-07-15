import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainTemplateComponent } from './main-template.component';
import { AuthService } from 'src/app/core/services/auth.service';

const mockAuthService = {
  isAuthenticated: jest.fn().mockReturnValue(true),
  getUserEmail: jest.fn().mockReturnValue('test@example.com')
};

describe('MainTemplateComponent (Jest)', () => {
  let component: MainTemplateComponent;
  let fixture: ComponentFixture<MainTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainTemplateComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    fixture = TestBed.createComponent(MainTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true for isLoggedIn if authenticated', () => {
    expect(component.isLoggedIn).toBe(true);
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
  });

  it('should return the user email from AuthService', () => {
    expect(component.userName).toBe('test@example.com');
    expect(mockAuthService.getUserEmail).toHaveBeenCalled();
  });

  it('should return default avatar URL', () => {
    expect(component.userAvatarUrl).toBe('assets/images/Avatar.jpg');
  });
});
