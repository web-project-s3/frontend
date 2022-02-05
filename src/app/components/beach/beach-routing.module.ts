import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeachOwnerGuard } from 'src/app/core/guards/beach-owner.guard';
import { BeachEditComponent } from './beach-edit/beach-edit.component';
import { BeachOrdersComponent } from './beach-orders/beach-orders.component';
import { BeachProductComponent } from './beach-product/beach-product.component';

const routes: Routes = [
  { path: ':id/edit', component: BeachEditComponent,
    canActivate: [BeachOwnerGuard] },
  { path: ':id/product', component: BeachProductComponent,
  canActivate: [BeachOwnerGuard] },
  { path: ':id/orders', component: BeachOrdersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeachRoutingModule { }
