import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyPageComponent } from './empty-page/empty-page.component';
import { CategoryComponent } from './category/category.component';
import { LocationComponent } from './location/location.component';
import { SharedModule } from '../../shared/shared.module';
import { SellerComponent } from './seller/seller.component';
import { HouseComponent } from './house/house.component';


@NgModule({
  declarations: [
    EmptyPageComponent,
    CategoryComponent,
    LocationComponent,
    SellerComponent,
    HouseComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PagesModule { }
