import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavigationService } from 'src/app/core/services/naviguation.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  restaurantId = 0;
  beachId = 0;

  backItem: MenuItem = {
    label:'Retour',
    styleClass: 'ml-4 mr-6',
    icon:'pi pi-fw pi-chevron-left',
    command: this.goBack.bind(this)
  }

  logoutItem: MenuItem = {
    label:'Utilisateur',
    icon:'pi pi-fw pi-user',
    style: {"margin-left": "auto"},
    items:[
      {
        label:'Édition du profil',
        icon:'pi pi-fw pi-pencil',
        command: this.goToUserEditPage.bind(this)
      },
      {
        label:'Déconnexion',
        icon:'pi pi-fw pi-sign-out',
        command: this.auth.logout.bind(this.auth),
      }]
  }

  restaurantItem: MenuItem = {
    label:'Restaurant',
    visible: this.auth.worksAtRestaurant(),
    icon:'pi pi-fw pi-briefcase',
    items:[
      {
        label:'Édition du restaurant',
        icon:'pi pi-fw pi-pencil',
        command: this.goToRestaurantEditPage.bind(this)
      },
      {
        label:'Produits',
        icon:'pi pi-fw pi-tag',
        command: this.goToRestaurantProductPage.bind(this)
      },
      {
        label:'Commandes',
        icon:'pi pi-fw pi-tags',
        command: this.goToRestaurantOrderPage.bind(this)
      }]
  }

  beachItem: MenuItem = {
    label:'Plage',
    visible: this.auth.worksAtBeach(),
    icon:'pi pi-fw pi-briefcase',
    items:[
      {
        label:'Édition de la plage',
        icon:'pi pi-fw pi-pencil',
        command: this.goToBeachEditPage.bind(this)
      },
      {
        label:'Produits',
        icon:'pi pi-fw pi-tag',
        command: this.goToBeachProductPage.bind(this)
      },
      {
        label:'Commandes',
        icon:'pi pi-fw pi-tags',
        command: this.goToBeachOrderPage.bind(this)
      }]
  }

  adminItem: MenuItem = {
    label:'Admin',
    visible: this.auth.isAdmin(),
    icon:'pi pi-fw pi-server',
    routerLink: ["/admin"]
  }

  loggedOutItem: MenuItem[] = [{
    label:'Se connecter',
    visible: !this.auth.isLoggedIn(),
    icon:'pi pi-fw pi-sign-in',
    routerLink: ["/login"]
  },
  {
    label:'Créer un compte',
    visible: !this.auth.isLoggedIn(),
    icon:'pi pi-fw pi-user',
    routerLink: "/register",
  }]



  items: MenuItem[] = [];

  constructor(private auth: AuthService, private router: Router, private navigation: NavigationService ) {
    this.auth.user$.subscribe({
      next: (value) => this.onUserChange(value)
    })
  }

    ngOnInit() {
      this.items = [
        this.backItem,
        this.restaurantItem,
        this.beachItem,
        this.adminItem,
        ...this.loggedOutItem,
        this.logoutItem];
    }

    buildMenu(user: User | null | undefined) {

      if ( this.auth.isLoggedIn() )
      {
        this.logoutItem.visible = true;
        this.logoutItem.label = user != null ? user.firstname : "Utilisateur";
        this.loggedOutItem[1].visible = false;
        this.loggedOutItem[0].visible = false;
      }
      else
      {
        this.logoutItem.visible = false;
        this.loggedOutItem[1].visible = true;
        this.loggedOutItem[0].visible = true;
      }

      // Restaurant :
      this.restaurantItem.visible = this.auth.worksAtRestaurant();
      // Edit
      this.restaurantItem.items![0].visible = this.auth.ownsRestaurant();
      // Products
      this.restaurantItem.items![1].visible = this.auth.ownsRestaurant();
      // Orders
      this.restaurantItem.items![2].visible = this.auth.worksAtRestaurant();

      // Beach :
      this.beachItem.visible = this.auth.worksAtBeach();
      // Edit
      this.beachItem.items![0].visible = this.auth.ownsBeach();
      // Products
      this.beachItem.items![1].visible = this.auth.ownsBeach();
      // Orders
      this.beachItem.items![2].visible = this.auth.worksAtBeach();

      // Admin :
      this.adminItem.visible = this.auth.isAdmin();
    }

    onUserChange(user: User | null | undefined) {
      this.buildMenu(user);
      this.ngOnInit();
      if ( user && user.restaurantOwnerId) this.restaurantId = user.restaurantOwnerId;
      if ( user && user.beachOwnerId ) this.beachId = user.beachOwnerId
    }

    goToRestaurantEditPage() {
      this.router.navigate(["/restaurant/" + this.restaurantId + "/edit"]);
    }

    goToRestaurantProductPage() {
      this.router.navigate(["/restaurant/" + this.restaurantId + "/product"]);
    }

    goToRestaurantOrderPage() {
      this.router.navigate(["/restaurant/" + this.restaurantId + "/orders"]);
    }

    goToBeachEditPage()  {
      this.router.navigate(["/beach/" + this.beachId + "/edit"]);
    }

    goToBeachProductPage()  {
      this.router.navigate(["/beach/" + this.beachId + "/product"]);
    }

    goToBeachOrderPage()  {
      this.router.navigate(["/beach/" + this.beachId + "/orders"]);
    }

    goToUserEditPage() {
      this.router.navigate(["/user/" + this.auth._user.getValue()?.id + "/edit"]);
    }

    goBack() {
      this.navigation.back()
    }

    goHome() {
      this.router.navigate(["/home"]);
    }
}
