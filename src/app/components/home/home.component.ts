import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  mustRegister = false;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe({
      next: this.onUserChange.bind(this)
    })
  }

  ngOnInit(): void {
    this.onUserChange(this.auth._user.getValue())
  }

  onUserChange(user: User | null | undefined) {
    if ( !this.auth ) return;
    if ( !this.auth.isAdmin() && !this.auth.worksAtRestaurant() && !this.auth.worksAtBeach())
      this.mustRegister = true;
    else
    {
      this.mustRegister = false;
      if ( this.auth.isAdmin() )
        this.router.navigate(["/admin"])
      else if ( this.auth.worksAtRestaurant() )
        this.router.navigate([user?.restaurantOwnerId != null ? `/restaurant/${user.restaurantOwnerId}/edit` : `/restaurant/${user?.restaurantEmployeeId}/orders` ])
      else if ( this.auth.worksAtBeach())
        this.router.navigate([user?.beachOwnerId != null ? `/beach/${user.beachOwnerId}/edit` : `/beach/${user?.beachEmployeeId}/orders` ])
    }
  }
}
