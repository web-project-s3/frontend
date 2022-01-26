import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeachEditComponent } from './beach-edit/beach-edit.component';

const routes: Routes = [
  { path: ':id/edit', component: BeachEditComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeachRoutingModule { }
