import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category/category.component';
import { LocationComponent } from './location/location.component';
import { SharedModule } from '../../shared/shared.module';
import { SellerComponent } from './seller/seller.component';
import { HouseComponent } from './house/house.component';
import { LoginComponent } from './login/login.component';
import { VisitComponent } from './visit/visit.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    CategoryComponent,
    LocationComponent,
    SellerComponent,
    HouseComponent,
    LoginComponent,
    VisitComponent,
    HomeComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PagesModule { }
