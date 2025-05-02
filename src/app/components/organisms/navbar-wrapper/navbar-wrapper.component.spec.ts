import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarWrapperComponent } from './navbar-wrapper.component';

describe('NavbarWrapperComponent', () => {
  let component: NavbarWrapperComponent;
  let fixture: ComponentFixture<NavbarWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default userName as "Admin"', () => {
    expect(component.userName).toBe('Admin');
  });

  it('should have default userAvatarUrl pointing to Avatar.jpg', () => {
    expect(component.userAvatarUrl).toBe('assets/images/Avatar.jpg');
  });
});
