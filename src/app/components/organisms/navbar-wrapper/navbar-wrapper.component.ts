import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar-wrapper',
  templateUrl: './navbar-wrapper.component.html',
  styleUrls: ['./navbar-wrapper.component.scss']
})
export class NavbarWrapperComponent {
  @Input() isLoggedIn = false;
  @Input() userName = '';
  @Input() userAvatarUrl = '';

  isDropdownOpen = false;

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isDropdownOpen = false;
    this.router.navigate(['/home']);
  }
}
