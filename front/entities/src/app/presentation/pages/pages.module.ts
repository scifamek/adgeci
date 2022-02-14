import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatCardModule} from '@angular/material/card';
import { SchemaListComponent } from './schema-list/schema-list.component';
import { EntityListComponent } from './entity-list/entity-list.component';
import { CrudBuilderModule } from 'crud-builder';
import { RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { SchemaDetailComponent } from './schema-detail/schema-detail.component';


@NgModule({
  declarations: [
    SchemaListComponent,
    EntityListComponent,
    SchemaDetailComponent
  ],
  imports: [
    CommonModule,
    CrudBuilderModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatCardModule
  ]
})
export class PagesModule { }
