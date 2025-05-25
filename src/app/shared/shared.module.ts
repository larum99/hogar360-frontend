import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
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
import { SelectComponent } from '../components/atoms/select/select.component';
import { CreateLocationFormComponent } from '../components/molecules/create-location-form/create-location-form.component';
import { DatePickerComponent } from '../components/atoms/date-picker/date-picker.component';
import { CreateSellerFormComponent } from '../components/molecules/create-seller-form/create-seller-form.component';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CreateHouseFormComponent } from '../components/molecules/create-house-form/create-house-form.component';
import { LoginFormComponent } from '../components/molecules/login-form/login-form.component';
import { TimePickerComponent } from '../components/atoms/time-picker/time-picker.component';
import { CreateVisitFormComponent } from '../components/molecules/create-visit-form/create-visit-form.component';

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
    ListTableComponent,
    SelectComponent,
    CreateLocationFormComponent,
    DatePickerComponent,
    CreateSellerFormComponent,
    CreateHouseFormComponent,
    LoginFormComponent,
    TimePickerComponent,
    CreateVisitFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
  ],
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
    CreateLocationFormComponent,
    DatePickerComponent,
    CreateSellerFormComponent,
    CreateHouseFormComponent,
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    LoginFormComponent,
    TimePickerComponent,
    CreateVisitFormComponent,
    NgxMaterialTimepickerModule
  ],
})
export class SharedModule {}
