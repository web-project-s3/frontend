import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantEditComponent } from './restaurant-edit/restaurant-edit.component';
import { RestaurantOrdersComponent } from './restaurant-orders/restaurant-orders.component';
import { RestaurantProductComponent } from './restaurant-product/restaurant-product.component';

const routes: Routes = [
  { path: ':id/edit', component: RestaurantEditComponent },
  { path: ':id/orders', component: RestaurantOrdersComponent },
  { path: ':id/product', component: RestaurantProductComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
