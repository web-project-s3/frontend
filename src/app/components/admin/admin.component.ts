import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  restaurantCreateError = false;
  restaurantCreateErrorValue = "";

  beachCreateError = false;
  beachCreateErrorValue = "";

  restaurantName = "";
  restaurantOwnerEmail = "";

  beachName = "";
  beachOwnerEmail = "";

  loadingNewRestaurant = false;
  loadingNewBeach = false;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  onSubmitNewRestaurant() {
    this.loadingNewRestaurant = true;
    this.api.createRestaurant(this.restaurantName, this.restaurantOwnerEmail).subscribe({
      next: (value) => {
        this.loadingNewRestaurant = false;
        this.restaurantCreateError = false;
      },
      error: ( error ) => {
        this.loadingNewRestaurant = false;
        this.restaurantCreateError = true;
        if ( error.status == 409 )
          this.restaurantCreateErrorValue = "Cet utilisateur est déjà propriétaire !";
        else if ( error.status == 404 )
          this.restaurantCreateErrorValue = "L'adresse mail ne correspond à aucun utilisateur";
        else if ( error.status == 400 )
          this.restaurantCreateErrorValue = "Le restaurant doit avoir un nom";
        else if ( error.status == 500 )
          this.restaurantCreateErrorValue = "Erreur lors de la création du restaurant";
        else this.restaurantCreateErrorValue = "Erreur de communication avec le serveur.";
      }
    });
  }

  canSubmitNewRestaurant() {
    return this.restaurantName.length > 4 && this.validateEmail(this.restaurantOwnerEmail);
  }

  onSubmitNewBeach() {
    this.loadingNewBeach = true;
    this.api.createBeach(this.beachName, this.beachOwnerEmail).subscribe({
      next: (value) => {
        this.loadingNewBeach = false;
        this.beachCreateError = false;
      },
      error: ( error ) => {
        this.loadingNewBeach = false;
        this.beachCreateError = true;
        if ( error.status == 409 )
          this.beachCreateErrorValue = "Cet utilisateur est déjà propriétaire !";
        else if ( error.status == 404 )
          this.beachCreateErrorValue = "L'adresse mail ne correspond à aucun utilisateur";
        else if ( error.status == 400 )
          this.beachCreateErrorValue = "La plage doit avoir un nom";
        else if ( error.status == 500 )
          this.beachCreateErrorValue = "Erreur lors de la création de la plage";
        else this.beachCreateErrorValue = "Erreur de communication avec le serveur.";
      }
    });
  }

  canSubmitNewBeach () {
    return this.beachName.length > 4 && this.validateEmail(this.beachOwnerEmail);
  }

  validateEmail(email: string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  fetchRestaurant() {

  }

  fetchBeaches() {

  }
}
