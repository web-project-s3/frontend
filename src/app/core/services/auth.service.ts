import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, tap, delay, finalize } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

interface LoginResult extends User{
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private readonly apiUrl = `${environment.apiUrl}users`;
  private timer: Subscription | null = null;
  private _user = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this._user.asObservable();

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      if (event.key === 'logout-event') {
        this.stopTokenTimer();
        this._user.next(null);
      }
      if (event.key === 'login-event') {
        this.stopTokenTimer();
        this.http.get<User & { accesToken: string, refreshToken: string }>(`${this.apiUrl}/user`).subscribe((x) => {
          this._user.next({
            id: x.id,
            firstname: x.firstname,
            lastname: x.lastname,
            email: x.email,
            restaurantEmployeeId: x.restaurantEmployeeId,
            restaurantOwnerId: x.restaurantOwnerId,
            beachEmployeeId: x.beachEmployeeId,
            beachOwnerId: x.beachOwnerId,
            isAdmin: x.isAdmin
          });
        });
      }
    }
  }

  constructor(private router: Router, private http: HttpClient) {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
  }

  register(email: string, lastname: string, firstname: string, password: string) {
    return this.http.post<string>(`${this.apiUrl}/register`,
    {
      email, firstname, lastname, password
    });
  }

  login(email: string, password: string) {
    return this.http
      .post<LoginResult>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map((x) => {
          this._user.next({
            id: x.id,
            firstname: x.firstname,
            lastname: x.lastname,
            email: x.email,
            restaurantEmployeeId: x.restaurantEmployeeId,
            restaurantOwnerId: x.restaurantOwnerId,
            beachEmployeeId: x.beachEmployeeId,
            beachOwnerId: x.beachOwnerId,
            isAdmin: x.isAdmin
          });
          this.setLocalStorage(x);
          this.startTokenTimer();
          return x;
        })
      );
  }

  logout() {
    this.clearLocalStorage();
    this._user.next(null);
    this.stopTokenTimer();
    this.router.navigate(['login']);
  }

  refreshToken(): Observable<LoginResult | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearLocalStorage();
      return of(null);
    }

    return this.http
      .post<LoginResult>(`${this.apiUrl}/token`, { refreshToken })
      .pipe(
        map((x) => {
          this._user.next({
            id: x.id,
            firstname: x.firstname,
            lastname: x.lastname,
            email: x.email,
            restaurantEmployeeId: x.restaurantEmployeeId,
            restaurantOwnerId: x.restaurantOwnerId,
            beachEmployeeId: x.beachEmployeeId,
            beachOwnerId: x.beachOwnerId,
            isAdmin: x.isAdmin
          });
          this.setLocalStorage(x);
          this.startTokenTimer();
          return x;
        })
      );
  }

  setLocalStorage(x: LoginResult) {
    localStorage.setItem('access_token', x.accessToken);
    localStorage.setItem('refresh_token', x.refreshToken);
    localStorage.setItem('login-event', 'login' + Math.random());
  }

  clearLocalStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.setItem('logout-event', 'logout' + Math.random());
  }

  private getTokenRemainingTime() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return 0;
    }
    const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    return expires.getTime() - Date.now();
  }

  private startTokenTimer() {
    const timeout = this.getTokenRemainingTime();
    this.timer = of(true)
      .pipe(
        delay(timeout),
        tap(() => this.refreshToken().subscribe())
      )
      .subscribe();
  }

  private stopTokenTimer() {
    this.timer?.unsubscribe();
  }
}
