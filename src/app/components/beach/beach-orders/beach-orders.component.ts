import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socketio } from "ngx-socketio2";
import { ConfirmationService } from 'primeng/api';
import { Beach } from 'src/app/core/models/beach';
import { Order } from 'src/app/core/models/order';
import { Product } from 'src/app/core/models/product';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-beach-orders',
  templateUrl: './beach-orders.component.html',
  styleUrls: ['./beach-orders.component.scss'],
  providers: [ConfirmationService]
})
export class BeachOrdersComponent implements OnInit {

  beach: Beach | null = null;
  orders: Order[];

  selectedProducts: (Product & { details: {quantity: number}})[] =  [];
  note = "";
  availableProducts: Product[] = [];

  selectedProduct: Product | null = null;
  quantity = 1;

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
          this.loadBeach(id);
        }
      }
    });

    this.orders = [];
    this.updateTimeElapsed();
  }

  resetSelectedProducts() {
    this.selectedProduct = null;
    this.quantity = 1;
    this.selectedProducts = [];
    this.note = "";
  }

  loadBeach(id: number) {
    this.api.getBeachId(id).subscribe(
      {
        next: this.onBeachLoad.bind(this),
        error:(error) => this.router.navigate(["/home"])
      });
  }

  onBeachLoad(beach: Beach) {
    this.socket.on<Order[]>("activeOrders").subscribe(this.activeOrdersHandler.bind(this));
    this.auth.registerSocket(this.socket, beach.id, null);
    this.beach = beach;

    this.api.getAllProductsOfBeach(beach.id).subscribe({
      next: this.onProductsLoad.bind(this),
      error: console.log
    })
  }

  onProductsLoad(products: Product[]) {
    this.availableProducts = products.map((product) => { return { ...product, price: product.BeachProduct!.price, } })
  }

  activeOrdersHandler(orders: Order[]) {
    this.orders.sort((order_one, order_two) => new Date(order_one.createdAt).getTime() - new Date(order_two.createdAt).getTime());
    this.orders = orders;
    this.orders.forEach(order =>
      order.contains.sort((product_one, product_two) => product_one.restaurantId - product_two.restaurantId))
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

  confirmOrderReceived(order: Order) {
    this.confirmation.confirm({
      message: 'Commande reçu ?',
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => {
        this.api.orderReceived(order.id).subscribe({
          error: console.log
        });
      }
   });
  }

  addProductToOrder() {
    this.selectedProducts.push({
      ...this.selectedProduct!,
      details: {
        quantity: this.quantity
      }
    });

    this.selectedProduct = null;
    this.quantity = 1;
  }

  deleteProductFromOrder(index: number) {
    this.selectedProducts.splice(index, 1);
  }

  order() {
    this.api.createOrder(this.selectedProducts, this.note, this.beach!.id).subscribe({
      next: this.resetSelectedProducts.bind(this),
      error: console.log
    })
  }

  ngOnInit(): void {
  }

}
