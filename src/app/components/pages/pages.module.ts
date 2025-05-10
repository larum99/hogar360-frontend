import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyPageComponent } from './empty-page/empty-page.component';
import { CategoryComponent } from './category/category.component';
import { LocationComponent } from './location/location.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    EmptyPageComponent,
    CategoryComponent,
    LocationComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PagesModule { }
