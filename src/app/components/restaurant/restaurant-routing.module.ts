import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantOwnerGuard } from 'src/app/core/guards/restaurant-owner.guard';
import { RestaurantEditComponent } from './restaurant-edit/restaurant-edit.component';
import { RestaurantOrdersComponent } from './restaurant-orders/restaurant-orders.component';
import { RestaurantProductComponent } from './restaurant-product/restaurant-product.component';

const routes: Routes = [
  { path: ':id/edit', component: RestaurantEditComponent,
    canActivate:[RestaurantOwnerGuard] },
  { path: ':id/product', component: RestaurantProductComponent,
    canActivate: [RestaurantOwnerGuard] },
  { path: ':id/orders', component: RestaurantOrdersComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
