import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer-section',
  templateUrl: './footer-section.component.html',
  styleUrls: ['./footer-section.component.scss']
})
export class FooterSectionComponent {
  @Input() title!: string;
  @Input() items!: { icon: string, text: string | null }[];
}
