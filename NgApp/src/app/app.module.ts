import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';

import { NgxNavbarModule } from 'ngx-bootstrap-navbar';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxNavbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
