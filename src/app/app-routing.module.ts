import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyPageComponent } from './components/pages/empty-page/empty-page.component';
import { CategoryComponent } from './components/pages/category/category.component';
import { LocationComponent } from './components/pages/location/location.component';
import { SellerComponent } from './components/pages/seller/seller.component';
import { HouseComponent } from './components/pages/house/house.component';
import { MainTemplateComponent } from './components/templates/main-template/main-template.component';
import { AuthTemplateComponent } from './components/templates/auth-template/auth-template.component';
import { LoginComponent } from './components/pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { sellerGuard } from './core/guards/seller.guard';

const routes: Routes = [
  {
    path: '',
    component: MainTemplateComponent,
    children: [
      { path: 'dashboard', component: EmptyPageComponent,
        canActivate: [authGuard], },
      { path: 'categories', component: CategoryComponent,
        canActivate: [authGuard], },
      { path: 'locations', component: LocationComponent,
        canActivate: [authGuard], },
      { path: 'users', component: SellerComponent,
        canActivate: [authGuard], },
      { path: 'houses', component: HouseComponent,
        canActivate: [authGuard], },
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: AuthTemplateComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'dashboard', component: EmptyPageComponent,
        canActivate: [authGuard], },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
