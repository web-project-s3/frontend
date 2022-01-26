import { AfterContentChecked, ApplicationRef, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { Router } from '@angular/router';
import {MenuItem} from 'primeng/api';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable, of, Subject } from 'rxjs';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  restaurantId = 0;

  logoutItem: MenuItem = {
    label:'Utilisateur',
    icon:'pi pi-fw pi-user',
    style: {"margin-left": "auto"},
    items:[
      {
        label:'Édition du profil',
        icon:'pi pi-fw pi-pencil'
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
      },
      {
        label:'Commandes',
        icon:'pi pi-fw pi-tags'
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
      },
      {
        label:'Commandes',
        icon:'pi pi-fw pi-tags'
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
    routerLink: "/register"
  }]



  items: MenuItem[] = [];

  constructor(private auth: AuthService, private router: Router ) {
    this.auth.user$.subscribe({
      next: (value) => this.onUserChange(value)
    })
  }

    ngOnInit() {
      this.items = [
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
      // Orders
      this.beachItem.items![1].visible = this.auth.worksAtBeach();

      // Admin :
      this.adminItem.visible = this.auth.isAdmin();
    }

    onUserChange(user: User | null | undefined) {
      this.buildMenu(user);
      this.ngOnInit();
      if ( user && user.restaurantOwnerId) this.restaurantId = user.restaurantOwnerId;
    }

    goToRestaurantEditPage() {
      this.router.navigate(["/restaurant/" + this.restaurantId + "/edit"]);
    }
}
