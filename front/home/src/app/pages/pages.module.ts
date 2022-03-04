import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AclCardModule } from 'angular-components-library/card';
import { AclCoreModule } from 'angular-components-library/core';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, AclCoreModule, AclCardModule],
  schemas: [],
})
export class PagesModule {}
