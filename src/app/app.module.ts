import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoginModule } from './components/login/login.module';
import { RegisterModule } from './components/register/register.module';
import { BannerModule } from './components/banner/banner.module';
import { Jwt } from './core/interceptors/jwt.interceptor';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    LoginModule,
    RegisterModule,
    BannerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: Jwt, multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
