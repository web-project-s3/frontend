import { Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { Restaurant } from 'src/app/core/models/restaurant';
import { ApiService } from 'src/app/core/services/api.service';
import { SortEvent } from 'primeng/api';
import { Router } from '@angular/router';
import { Beach } from 'src/app/core/models/beach';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [MessageService]
})
export class AdminComponent implements OnInit {

  restaurants: Restaurant[] = [];
  beaches: Beach[] = [];

  generalError = false;
  generalErrorValue = "";

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

  constructor(private api: ApiService, private message: MessageService, private router: Router) {
    this.fetchRestaurant();
    this.fetchBeaches();
  }

  ngOnInit(): void {
  }

  onSubmitNewRestaurant() {
    this.loadingNewRestaurant = true;
    this.api.createRestaurant(this.restaurantName, this.restaurantOwnerEmail).subscribe({
      next: (value) => {
        debugger;
        this.loadingNewRestaurant = false;
        this.restaurantCreateError = false;
        this.fetchRestaurant();
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
    return this.restaurantName.length > 3 && this.validateEmail(this.restaurantOwnerEmail);
  }

  onSubmitNewBeach() {
    this.loadingNewBeach = true;
    this.api.createBeach(this.beachName, this.beachOwnerEmail).subscribe({
      next: (value) => {
        this.loadingNewBeach = false;
        this.beachCreateError = false;
        this.fetchBeaches();
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
    this.api.getAllRestaurants().subscribe({
      next: (restaurants) => this.restaurants = restaurants,
      error: (error) => {
        if ( error.status == 500 )
          this.message.add({severity: "error", summary:"Erreur", detail: "Erreur lors de la récupération des restaurants"});
        else this.message.add({severity: "error", summary:"Erreur", detail: "Erreur de communication avec le serveur"});

      }
    })
  }

  fetchBeaches() {
    this.api.getAllBeaches().subscribe({
      next: (beaches) => this.beaches = beaches,
      error: (error) => {
        if ( error.status == 500 )
          this.message.add({severity: "error", summary:"Erreur", detail: "Erreur lors de la récupération des plages"});
        else this.message.add({severity: "error", summary:"Erreur", detail: "Erreur de communication avec le serveur"});

      }
    })
  }

  goToUserPage(id: number) {
    console.log("TODO")
  }

  editRestaurant(id: number) {
    this.router.navigate([`restaurant/${id}/edit`]);
  }

  deleteRestaurant(id: number) {
    this.api.deleteRestaurant(id).subscribe({
      next: (value) => {
        this.message.add({severity: "success", detail:"Le restaurant a bien été supprimé"});
        this.fetchRestaurant();
      },
      error: (error) => {
        if ( error.status == 404)
          this.message.add({severity: "error", summary:"Erreur", detail: "Le restaurant n'existe plus"});
        if ( error.status == 500 )
          this.message.add({severity: "error", summary:"Erreur", detail: "Erreur lors de la suppression du restaurant"});
        else this.message.add({severity: "error", summary:"Erreur", detail: "Erreur de communication avec le serveur"});
      }
    });
  }

  editBeach(id: number) {
    this.router.navigate([`beaches/${id}/edit`]);
  }

  deleteBeach(id: number) {
    this.api.deleteBeach(id).subscribe({
      next: (value) => {
        this.message.add({severity: "success", detail:"La plage a bien été supprimé"});
        this.fetchBeaches();
      },
      error: (error) => {
        if ( error.status == 404)
          this.message.add({severity: "error", summary:"Erreur", detail: "La plage n'existe plus"});
        if ( error.status == 500 )
          this.message.add({severity: "error", summary:"Erreur", detail: "Erreur lors de la suppression de la plage"});
        else this.message.add({severity: "error", summary:"Erreur", detail: "Erreur de communication avec le serveur"});
      }
    });
  }
}
