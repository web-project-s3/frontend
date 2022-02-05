import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorksAtRestaurantGuard implements CanActivate
  {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ):
      Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
      {
      return this.authService.user$.pipe(
        filter(user => user !== undefined),
        map((user) => {
          if (user && ( user.restaurantOwnerId != null || user.restaurantEmployeeId || user.isAdmin ))
            return true;
          else
          {
            this.router.navigate(['home'], {
              queryParams: { returnUrl: state.url },
            });

            return false;
          }
        }))
      }
  }
