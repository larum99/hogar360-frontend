import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  quickLinks = [
    { icon: '', text: 'Buscar Propiedades' },
    { icon: '', text: 'Publica tu propiedad' },
    { icon: '', text: 'Property Management' }
  ];
  contactInfo = [
    { icon: '/assets/icons/PhoneVector.png', text: '1-800-HOGAR360' },
    { icon: 'assets/icons/EmailVector.png', text: 'info@hogar360.com' },
    { icon: 'assets/icons/LocationVector.png', text: '123 Real Estate Ave' }
  ];

  socialLinks = [
    { icon: 'assets/icons/FacebookVector.png', text: null },
    { icon: 'assets/icons/TwitterVector.png', text: null },
    { icon: 'assets/icons/InstagramVector.png', text: null },
    { icon: 'assets/icons/LinkedinVector.png', text: null }
  ];
}
