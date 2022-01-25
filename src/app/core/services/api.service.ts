import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Restaurant } from '../models/restaurant';
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

  getRestaurantId(id: number) {
    return this.http.get<Restaurant>(`${this.apiUrl}restaurants/${id}`);
  }

  patchRestaurant(name: string) {
    return this.http.patch<Restaurant>(`${this.apiUrl}restaurants`, { name });
  }

  addBeach(restaurantId: number, codeBeach: string) {
    return this.http.post<any>(`${this.apiUrl}restaurants/${restaurantId}/beach`, { code: codeBeach });
  }

}
