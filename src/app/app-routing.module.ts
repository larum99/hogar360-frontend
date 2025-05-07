import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyPageComponent } from './components/pages/empty-page/empty-page.component';
import { CategoryComponent } from './components/pages/category/category.component';


const routes: Routes = [
  { path: 'categories', component: CategoryComponent },
  { path: '', redirectTo: '/categories', pathMatch: 'full' },
  { path: 'category', loadChildren: () => import('./category/category.module').then(m => m.CategoryModule) },
  { path: '**', component: EmptyPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
