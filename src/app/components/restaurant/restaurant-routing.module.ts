import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantEditComponent } from './restaurant-edit/restaurant-edit.component';

const routes: Routes = [
  { path: ':id/edit', component: RestaurantEditComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
