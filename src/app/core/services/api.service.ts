import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private auth: AuthService) { }

  employUser(code: string) {
    const request = this.http.post<User>(`${this.apiUrl}users/worksAt`, { code });
    request.subscribe({
      next: (value) => {
        this.auth.pushNewValue({
          beachOwnerId: value.beachOwnerId,
          beachEmployeeId: value.beachEmployeeId,
          restaurantOwnerId: value.restaurantOwnerId,
          restaurantEmployeeId: value.restaurantEmployeeId
        })
      }
    });

    return request;
  }

}
