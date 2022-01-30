import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socketio } from "ngx-socketio2";
import { ConfirmationService } from 'primeng/api';
import { Order } from 'src/app/core/models/order';
import { Product } from 'src/app/core/models/product';
import { Restaurant } from 'src/app/core/models/restaurant';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-restaurant-orders',
  templateUrl: './restaurant-orders.component.html',
  styleUrls: ['./restaurant-orders.component.scss'],
  providers: [ConfirmationService]
})
export class RestaurantOrdersComponent implements OnInit {

  restaurant: Restaurant | null = null;
  orders: Order[];

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private api: ApiService, private socket: Socketio, private confirmation: ConfirmationService) {
    route.paramMap.subscribe({
      next: (value) =>
      {
        const idString = value.get("id");
        if ( !idString || isNaN(parseInt(idString)))
          router.navigate(["/home"]);

        else
        {
          const id = parseInt(idString);
          this.loadRestaurant(id);
        }
      }
    });

    this.orders = [];
    this.updateTimeElapsed();
  }

  loadRestaurant(id: number) {
    this.api.getRestaurantId(id).subscribe(
      {
        next: this.onRestaurantLoad.bind(this),
        error:(error) => this.router.navigate(["/home"])
      });
  }

  onRestaurantLoad(restaurant: Restaurant) {
    this.socket.on<Order[]>("activeOrders").subscribe(this.activeOrdersHandler.bind(this));
    this.auth.registerSocket(this.socket, null, restaurant.id);
    this.restaurant = restaurant;
  }

  activeOrdersHandler(orders: Order[]) {
    this.orders = orders;
    this.orders.sort((order_one, order_two) => new Date(order_one.createdAt).getTime() - new Date(order_two.createdAt).getTime());
    this.updateTimeElapsedNoTimeout();
  }

  updateTimeElapsed() {
    this.orders.forEach(order => {
      let seconds = (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000;
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      order.timeElapsed = minutes == 0 ? `${seconds.toFixed(0)}s` : `${minutes}m ${seconds.toFixed(0)}s`;
    })

    setTimeout(this.updateTimeElapsed.bind(this), 1000);
  }

  updateTimeElapsedNoTimeout() {
    this.orders.forEach(order => {
      let seconds = (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000;
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      order.timeElapsed = minutes == 0 ? `${seconds.toFixed(0)}s` : `${minutes}m ${seconds.toFixed(0)}s`;
    })
  }

  validateProduct(order: Order, product: Product) {
    this.api.validateProduct(order.id, product.id).subscribe({
      error: console.log
    });
  }

  confirmValidateAll(order: Order) {
    this.confirmation.confirm({
      message: 'Tout valider ?',
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => {
        order.contains.forEach(product => {
          if ( !product.details.ready)
            this.validateProduct(order, product);
        })

      }
    });
  }

  confirmOrderSent(order: Order) {
    this.confirmation.confirm({
      message: 'Commande envoyée ?',
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => {
        this.api.sendOrder(order.id, this.restaurant!.id).subscribe({
          error: console.log
        });
      }
   });
  }

  ngOnInit(): void {
  }
}
