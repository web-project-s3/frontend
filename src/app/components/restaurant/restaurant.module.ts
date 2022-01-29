import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketioModule } from "ngx-socketio2";
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { environment } from 'src/environments/environment';
import { RestaurantEditComponent } from './restaurant-edit/restaurant-edit.component';
import { RestaurantOrdersComponent } from './restaurant-orders/restaurant-orders.component';
import { RestaurantProductComponent } from './restaurant-product/restaurant-product.component';
import { RestaurantRoutingModule } from './restaurant-routing.module';




@NgModule({
  declarations: [RestaurantEditComponent, RestaurantProductComponent, RestaurantOrdersComponent],
  imports: [
    SocketioModule.forRoot({
      url: `${environment.apiUrl}orders`,
      options: {
        transports: ["websocket"]
      }
    }),
    CommonModule,
    TreeTableModule,
    DividerModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    FormsModule,
    InputTextModule,
    TableModule,
    CardModule,
    BadgeModule,
    DropdownModule,
    InputNumberModule,
    ConfirmDialogModule,
    RestaurantRoutingModule
  ]
})
export class RestaurantModule { }
