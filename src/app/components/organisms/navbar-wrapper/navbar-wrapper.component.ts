import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-wrapper',
  templateUrl: './navbar-wrapper.component.html',
  styleUrls: ['./navbar-wrapper.component.scss']
})
export class NavbarWrapperComponent {
  userName = 'Admin';
  userAvatarUrl = 'assets/images/Avatar.jpg';
}
