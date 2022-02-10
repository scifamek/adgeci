import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatCardModule} from '@angular/material/card';
import { SchemaListComponent } from './schema-list/schema-list.component';
import { EntityListComponent } from './entity-list/entity-list.component';


@NgModule({
  declarations: [
    SchemaListComponent,
    EntityListComponent
  ],
  imports: [
    CommonModule,
    MatCardModule
  ]
})
export class PagesModule { }
