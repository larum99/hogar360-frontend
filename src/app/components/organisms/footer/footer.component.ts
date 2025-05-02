import { Component } from '@angular/core';
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  quickLinks: { icon: IconDefinition | null, text: string }[] = [
    { icon: null, text: 'Buscar Propiedades' },
    { icon: null, text: 'Publica tu propiedad' },
    { icon: null, text: 'Property Management' }
  ];

  contactInfo: { icon: IconDefinition, text: string }[] = [
    { icon: faPhone, text: '1-800-HOGAR360' },
    { icon: faEnvelope, text: 'info@hogar360.com' },
    { icon: faMapMarkerAlt, text: '123 Real Estate Ave' }
  ];

  socialLinks: { icon: IconDefinition, text: string | null }[] = [
    { icon: faFacebookF, text: null },
    { icon: faTwitter, text: null },
    { icon: faInstagram, text: null },
    { icon: faLinkedinIn, text: null }
  ];
}
