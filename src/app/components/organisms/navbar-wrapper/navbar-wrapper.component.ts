import { Component, Input, HostListener, inject } from '@angular/core';
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
  isMobileMenuOpen = false;

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  toggleMobileMenu(): void {
    if (this.isLoggedIn) {
      this.closeMobileMenu();
      return;
    }
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.closeDropdown();
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }
    if (this.isDropdownOpen && !target.closest('.navbar__avatar-wrapper')) {
      this.closeDropdown();
    }
    if (this.isMobileMenuOpen && !target.closest('.navbar__wrapper')) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDropdown();
    this.closeMobileMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 768) {
      this.closeMobileMenu();
    }
  }

  logout(): void {
    this.authService.logout();
    this.closeDropdown();
    this.closeMobileMenu();
    this.router.navigate(['/home']);
  }
}
