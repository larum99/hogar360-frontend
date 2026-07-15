import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss']
})
export class MainTemplateComponent {
  private readonly authService = inject(AuthService);

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get userName(): string {
    return this.authService.getUserEmail() ?? 'Usuario';
  }

  get userAvatarUrl(): string {
    return 'assets/images/Avatar.jpg';
  }
}
