import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SERVER_HOST, STORAGE_TOKEN_KEY } from './injection.tokens';
import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, PagesModule],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/authentication',
    },
    {
      provide: SERVER_HOST,
      useValue: environment.serverHost,
    },
    {
      provide: STORAGE_TOKEN_KEY,
      useValue: environment.storageTokenKey,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
