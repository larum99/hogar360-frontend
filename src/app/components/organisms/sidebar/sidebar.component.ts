import { Component, inject } from '@angular/core';
import {
  faGauge,
  faTags,
  faHouse,
  faUsers,
  faMapLocationDot,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  isAdmin = this.authService.hasRole('ADMIN');

  dashboardIcon: IconDefinition = faGauge;
  categoriesIcon: IconDefinition = faTags;
  locationsIcon: IconDefinition = faMapLocationDot;
  housesIcon: IconDefinition = faHouse;
  usersIcon: IconDefinition = faUsers;
  visitsIcon: IconDefinition = faCalendarCheck;
}
