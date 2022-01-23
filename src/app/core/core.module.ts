import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Jwt } from './interceptors/jwt.interceptor';
import { AuthService } from './services/auth.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
  { provide: HTTP_INTERCEPTORS, useClass: Jwt, multi: true }
],
})
export class CoreModule { }
