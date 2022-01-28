import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Beach } from '../models/beach';
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

  getBeachId(id: number) {
    return this.http.get<Beach>(`${this.apiUrl}beaches/${id}`);
  }

  getUserId(id: number) {
    return this.http.get<User>(`${this.apiUrl}users/${id}`);
  }

  getAllRestaurants() {
    return this.http.get<Restaurant[]>(`${this.apiUrl}restaurants`)
  }

  getAllBeaches() {
    return this.http.get<Beach[]>(`${this.apiUrl}beaches`)
  }

  getAllUsers() {
    return this.http.get<User[]>(`${this.apiUrl}users`)
  }

  patchRestaurant(name: string) {
    return this.http.patch<Restaurant>(`${this.apiUrl}restaurants`, { name });
  }

  patchBeach(name: string) {
    return this.http.patch<Beach>(`${this.apiUrl}beaches`, { name });
  }

  patchUser(id: number, firstname: string, lastname: string ) {
    return this.http.patch<User>(`${this.apiUrl}users/${id}`, { firstname, lastname, password: null });
  }

  putRestaurant(name: string, code: string, id: number) {
    return this.http.put<Restaurant>(`${this.apiUrl}restaurants/${id}`, { name, code });
  }

  putBeach(name: string, code: string, id: number) {
    return this.http.put<Beach>(`${this.apiUrl}beaches/${id}`, { name, code });
  }

  putUser(id: number, firstname: string, lastname: string, email: string, isAdmin: boolean ) {
    return this.http.put<User>(`${this.apiUrl}users/${id}`, { firstname, lastname, email, isAdmin});
  }

  deleteRestaurant(id: number) {
    return this.http.delete(`${this.apiUrl}restaurants/${id}`);
  }

  deleteBeach(id: number) {
    return this.http.delete(`${this.apiUrl}beaches/${id}`);
  }

  addBeach(restaurantId: number, codeBeach: string) {
    return this.http.post<any>(`${this.apiUrl}restaurants/${restaurantId}/beach`, { code: codeBeach });
  }

  addRestaurant(beachId: number, codeRestaurant: string) {
    return this.http.post<any>(`${this.apiUrl}beaches/${beachId}/restaurant`, { code: codeRestaurant });
  }

  deletePartnerRestaurant(restaurantId: number, beachId:number) {
    return this.http.delete(`${this.apiUrl + "restaurants/" + restaurantId}/beach/${beachId}`);
  }

  deletePartnerBeach(restaurantId: number, beachId:number) {
    return this.http.delete(`${this.apiUrl + "beaches/" + beachId}/restaurant/${restaurantId}`);
  }

  createRestaurant(name: string, ownerEmail: string) {
    return this.http.post<Restaurant>(`${this.apiUrl}restaurants/`, { restaurantName: name, ownerEmail });
  }

  createBeach(name: string, ownerEmail: string) {
    return this.http.post<Beach>(`${this.apiUrl}beaches/`, { beachName: name, ownerEmail });
  }

  removeEmployer(userId: number) {
    return this.http.delete<User>(`${this.apiUrl}users/${userId}/removeEmployer`);
  }
}
