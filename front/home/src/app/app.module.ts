import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SERVER_HOST } from './injection.tokens';
import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    PagesModule,
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/home',
    },
    {
      provide: SERVER_HOST,
      useValue: environment.serverHost,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
