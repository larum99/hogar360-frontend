import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss'],
})
export class VisitComponent implements OnInit {
  private readonly authService = inject(AuthService);
  isSeller = false;

  ngOnInit(): void {
    this.isSeller = this.authService.hasRole('VENDEDOR');
  }
}
