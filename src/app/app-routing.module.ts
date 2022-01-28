import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { RestaurantOwnerGuard } from './core/guards/restaurant-owner.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'login',  loadChildren: () => import ("./components/login/login.module").then(m => m.LoginModule)},
  { path: 'register',  loadChildren: () => import ("./components/register/register.module").then(m => m.RegisterModule)},
  { path: 'home',  loadChildren: () => import ("./components/home/home.module").then(m => m.HomeModule),
  canActivate: [AuthGuard]},
  { path: 'restaurant',  loadChildren: () => import ("./components/restaurant/restaurant.module").then(m => m.RestaurantModule),
  canActivate: [RestaurantOwnerGuard]},
  { path: 'beach',  loadChildren: () => import ("./components/beach/beach.module").then(m => m.BeachModule),
  canActivate: [RestaurantOwnerGuard]},
  { path: 'admin',  loadChildren: () => import ("./components/admin/admin.module").then(m => m.AdminModule),
  canActivate: [AdminGuard]},
  { path: 'user',  loadChildren: () => import ("./components/user/user.module").then(m => m.UserModule),
  canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
