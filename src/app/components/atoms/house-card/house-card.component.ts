import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HouseList } from 'src/app/shared/models/house-list.model';

@Component({
  selector: 'app-house-card',
  templateUrl: './house-card.component.html',
  styleUrls: ['./house-card.component.scss']
})
export class HouseCardComponent {
  @Input() house!: HouseList;
  @Output() selectHouse = new EventEmitter<number>();

  onClick() {
  console.log('Card clicked. House ID:', this.house.id);
  this.selectHouse.emit(this.house.id);
}

}
