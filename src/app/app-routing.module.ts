import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyPageComponent } from './components/pages/empty-page/empty-page.component';
import { CategoryComponent } from './components/pages/category/category.component';
import { LocationComponent } from './components/pages/location/location.component';
import { SellerComponent } from './components/pages/seller/seller.component';
import { HouseComponent } from './components/pages/house/house.component';



const routes: Routes = [
  { path: 'categories', component: CategoryComponent },
  { path: 'locations', component: LocationComponent },
  { path: 'users', component: SellerComponent },
  { path: 'houses', component: HouseComponent },
  { path: '', redirectTo: '/categories', pathMatch: 'full' },
  { path: '**', component: EmptyPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
