import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyPageComponent } from './components/pages/empty-page/empty-page.component';
import { CategoryComponent } from './components/pages/category/category.component';
import { LocationComponent } from './components/pages/location/location.component';


const routes: Routes = [
  { path: 'categories', component: CategoryComponent },
  { path: 'locations', component: LocationComponent },
  { path: '', redirectTo: '/categories', pathMatch: 'full' },
  { path: '**', component: EmptyPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
