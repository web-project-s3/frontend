import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { MatCardModule } from "@angular/material/card"

@NgModule({
    imports: [
        LoginRoutingModule,
        MatCardModule
    ],
    declarations: [LoginComponent],
    exports: [LoginComponent]
})
export class LoginModule { }
