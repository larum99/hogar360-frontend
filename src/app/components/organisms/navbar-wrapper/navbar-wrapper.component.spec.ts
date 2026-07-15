import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarWrapperComponent } from './navbar-wrapper.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

describe('NavbarWrapperComponent', () => {
  let component: NavbarWrapperComponent;
  let fixture: ComponentFixture<NavbarWrapperComponent>;

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockAuthService = {
    logout: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarWrapperComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default userName as empty string', () => {
    expect(component.userName).toBe('');
  });

  it('should have default userAvatarUrl as empty string', () => {
    expect(component.userAvatarUrl).toBe('');
  });

  it('should navigate to /login when onLoginClick is called', () => {
    component.onLoginClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should toggle isDropdownOpen when toggleDropdown is called', () => {
    expect(component.isDropdownOpen).toBe(false);
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBe(true);
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBe(false);
  });

  it('should call authService.logout and navigate to /home when logout is called', () => {
    component.isDropdownOpen = true;
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(component.isDropdownOpen).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });
});
