import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCategoryPageComponent } from './components/pages/create-category-page/create-category-page.component';
import { EmptyPageComponent } from './components/pages/empty-page/empty-page.component';


const routes: Routes = [
  { path: 'categories', component: CreateCategoryPageComponent },
  { path: '', redirectTo: '/categories', pathMatch: 'full' },
  { path: '**', component: EmptyPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
