import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './components/pages/category/category.component';
import { LocationComponent } from './components/pages/location/location.component';
import { SellerComponent } from './components/pages/seller/seller.component';
import { HouseComponent } from './components/pages/house/house.component';
import { MainTemplateComponent } from './components/templates/main-template/main-template.component';
import { LoginComponent } from './components/pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { VisitComponent } from './components/pages/visit/visit.component';
import { HomeComponent } from './components/pages/home/home.component';
import { roleGuard } from './core/guards/role.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: MainTemplateComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent,
        canActivate: [authGuard], },
      { path: 'categories', component: CategoryComponent,
        canActivate: [authGuard], },
      { path: 'locations', component: LocationComponent,
        canActivate: [authGuard], },
      { path: 'users', component: SellerComponent,
        canActivate: [authGuard, roleGuard], },
      { path: 'houses', component: HouseComponent,
        canActivate: [authGuard], },
      { path: 'visits', component: VisitComponent,
        canActivate: [authGuard] },
    ],
  },
  { path: 'login', component: LoginComponent,
    canActivate: [noAuthGuard],
  },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
