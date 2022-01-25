import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RestaurantOwnerGuard } from './core/guards/restaurant-owner.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'login',  loadChildren: () => import ("./components/login/login.module").then(m => m.LoginModule)},
  { path: 'register',  loadChildren: () => import ("./components/register/register.module").then(m => m.RegisterModule)},
  { path: 'home',  loadChildren: () => import ("./components/home/home.module").then(m => m.HomeModule),
  canActivate: [AuthGuard]},
  { path: 'restaurant',  loadChildren: () => import ("./components/restaurant/restaurant.module").then(m => m.RestaurantModule),
  canActivate: [RestaurantOwnerGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
