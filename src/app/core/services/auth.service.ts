import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Socketio } from "ngx-socketio2";
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

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

  // Undefined = not fetched yet, null = not logged in
  _user = new BehaviorSubject<User | null | undefined>(undefined);
  user$: Observable<User | null | undefined> = this._user.asObservable();

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
            isAdmin: x.isAdmin,
            restaurantOwner: x.restaurantOwner === undefined ? null : x.restaurantOwner,
            restaurantEmployee: x.restaurantEmployee === undefined ? null : x.restaurantEmployee,
            beachOwner: x.beachOwner === undefined ? null : x.beachOwner,
            beachEmployee: x.beachEmployee === undefined ? null : x.beachEmployee
          });
        });
      }
    }
  }

  constructor(private router: Router, private http: HttpClient) {
    window.addEventListener('storage', this.storageEventListener.bind(this));
    this.refreshToken().subscribe();
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

  registerSocket(socket: Socketio, beachId: number | null, restaurantId: number | null) {
    const accessToken = localStorage.getItem("access_token");
    if ( accessToken )
      socket.emit("register", { accessToken, beachId, restaurantId });
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
            isAdmin: x.isAdmin,
            restaurantOwner: x.restaurantOwner === undefined ? null : x.restaurantOwner,
            restaurantEmployee: x.restaurantEmployee === undefined ? null : x.restaurantEmployee,
            beachOwner: x.beachOwner === undefined ? null : x.beachOwner,
            beachEmployee: x.beachEmployee === undefined ? null : x.beachEmployee
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

  reloadUser() {
    this.refreshToken();
  }

  refreshToken(): Observable<LoginResult | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearLocalStorage();
      this._user.next(null);
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
            isAdmin: x.isAdmin,
            restaurantOwner: x.restaurantOwner === undefined ? null : x.restaurantOwner,
            restaurantEmployee: x.restaurantEmployee === undefined ? null : x.restaurantEmployee,
            beachOwner: x.beachOwner === undefined ? null : x.beachOwner,
            beachEmployee: x.beachEmployee === undefined ? null : x.beachEmployee
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

  pushNewValue(user: any) {
    const currentUser = this._user.getValue();
    if ( currentUser )
    {
      Object.assign(currentUser, user);
      this._user.next(currentUser);
    }
  }

  isLoggedIn() {
    return this._user.getValue() != null;
  }

  worksAtRestaurant() {
    const user = this._user.getValue();

    return user != null && ( user.restaurantEmployeeId != null || user.restaurantOwnerId != null );
  }

  worksAtBeach() {
    const user = this._user.getValue();

    return user != null && ( user.beachOwnerId != null || user.beachEmployeeId != null );
  }

  ownsRestaurant() {
    const user = this._user.getValue();

    return user != null && user.restaurantOwnerId != null;
  }

  ownsBeach() {
    const user = this._user.getValue();

    return user != null && user.beachOwnerId != null;
  }

  isAdmin() {
    const user = this._user.getValue();

    return user != null && user.isAdmin;
  }
}
