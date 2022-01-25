import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeachOwnerGuard implements CanActivate
{
  constructor(private authService: AuthService, private router: Router) {}

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
    return this.authService.user$.pipe(map((user) => {
        if (user && user.beachOwnerId )
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
