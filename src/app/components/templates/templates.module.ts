import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthTemplateComponent } from './auth-template/auth-template.component';
import { MainTemplateComponent } from './main-template/main-template.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    AuthTemplateComponent,
    MainTemplateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [AuthTemplateComponent, MainTemplateComponent]
})
export class TemplatesModule { }
