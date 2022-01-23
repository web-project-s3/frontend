import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: RegisterComponent }
        ])],
    exports: [RouterModule]
})
export class RegisterRoutingModule { }
