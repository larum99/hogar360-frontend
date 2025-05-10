import { Component } from '@angular/core';
import { faGauge, faTags, faHouse, faUsers, faCog, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  dashboardIcon: IconDefinition = faGauge;
  categoriesIcon: IconDefinition = faTags;
  locationsIcon: IconDefinition = faMapLocationDot;
  housesIcon: IconDefinition = faHouse;
  usersIcon: IconDefinition = faUsers;
  settingsIcon: IconDefinition = faCog;

  isActive: string = '';

  setActive(section: string) {
    this.isActive = section;
  }
}
