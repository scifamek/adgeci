import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { EntityListComponent } from './presentation/pages/entity-list/entity-list.component';
import { SchemaListComponent } from './presentation/pages/schema-list/schema-list.component';

const routes: Routes = [
  {
    path: '',
    component: SchemaListComponent,
  },
  {
    path: EntityListComponent.route,
    component: EntityListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
