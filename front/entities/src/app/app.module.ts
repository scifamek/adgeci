import { APP_BASE_HREF } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SchemaListComponent } from './presentation/pages/schema-list/schema-list.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SERVER_HOST } from './injection.tokens';
import { EntityListComponent } from './presentation/pages/entity-list/entity-list.component';
import { CrudBuilderModule } from 'crud-builder';

@NgModule({
  declarations: [AppComponent, SchemaListComponent, EntityListComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CrudBuilderModule,
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/entities',
    },
    {
      provide: SERVER_HOST,
      useValue: environment.serverHost,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
