import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeachEditComponent } from './beach-edit/beach-edit.component';
import { BeachProductComponent } from './beach-product/beach-product.component';

const routes: Routes = [
  { path: ':id/edit', component: BeachEditComponent },
  { path: ':id/product', component: BeachProductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeachRoutingModule { }
