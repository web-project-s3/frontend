import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from "primeng/divider"
import { ButtonModule } from "primeng/button"
import { ReactiveFormsModule } from "@angular/forms"
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';


@NgModule({
    imports: [
        LoginRoutingModule,
        FormsModule,
        InputTextModule,
        CardModule,
        PasswordModule,
        DividerModule,
        ButtonModule,
        ReactiveFormsModule,
        MessageModule,
        MessagesModule
    ],
    declarations: [LoginComponent],
    exports: [LoginComponent]
})
export class LoginModule { }
