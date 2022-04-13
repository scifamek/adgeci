import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { SchemaListComponent } from './schema-list/schema-list.component';
import { EntityListComponent } from './entity-list/entity-list.component';
import { CrudBuilderModule, ListComponent } from 'crud-builder';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SchemaDetailComponent } from './schema-detail/schema-detail.component';
import { EmptyRouteComponent } from 'src/app/empty-route/empty-route.component';
import { AclCardModule } from 'angular-components-library/card';
import { AclButtonModule } from 'angular-components-library/button';

@NgModule({
    declarations: [
        EmptyRouteComponent,
        SchemaListComponent,
        EntityListComponent,
        SchemaDetailComponent,
    ],
    imports: [
        CommonModule,
        CrudBuilderModule,
        AclCardModule,
        AclButtonModule,
        MatIconModule,
        RouterModule,
        MatCardModule,
    ]
})
export class PagesModule {}
