import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantRoutingModule } from './restaurant-routing.module';
import { RestaurantEditComponent } from './restaurant-edit/restaurant-edit.component';
import { TreeTableModule } from 'primeng/treetable';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { RestaurantProductComponent } from './restaurant-product/restaurant-product.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';


@NgModule({
  declarations: [RestaurantEditComponent, RestaurantProductComponent],
  imports: [
    CommonModule,
    TreeTableModule,
    DividerModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    FormsModule,
    InputTextModule,
    TableModule,
    DropdownModule,
    InputNumberModule,
    RestaurantRoutingModule
  ]
})
export class RestaurantModule { }
