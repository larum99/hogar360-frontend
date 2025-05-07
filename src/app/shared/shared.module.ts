import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from '../components/atoms/button/button.component';
import { InputTextComponent } from '../components/atoms/input-text/input-text.component';
import { TextareaComponent } from '../components/atoms/textarea/textarea.component';
import { CreateCategoryFormComponent } from '../components/molecules/create-category-form/create-category-form.component';
import { FooterSectionComponent } from '../components/molecules/footer-section/footer-section.component';
import { ListTableComponent } from '../components/molecules/list-table/list-table.component';
import { PaginationComponent } from '../components/molecules/pagination/pagination.component';
import { FooterComponent } from '../components/organisms/footer/footer.component';
import { NavbarWrapperComponent } from '../components/organisms/navbar-wrapper/navbar-wrapper.component';
import { SidebarComponent } from '../components/organisms/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NavbarWrapperComponent,
    InputTextComponent,
    TextareaComponent,
    ButtonComponent,
    CreateCategoryFormComponent,
    SidebarComponent,
    FooterComponent,
    FooterSectionComponent,
    PaginationComponent,
    ListTableComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterModule ],
  exports: [
    NavbarWrapperComponent,
    InputTextComponent,
    TextareaComponent,
    ButtonComponent,
    CreateCategoryFormComponent,
    SidebarComponent,
    FooterComponent,
    FooterSectionComponent,
    PaginationComponent,
    ListTableComponent,

    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule
  ],
})
export class SharedModule {}
