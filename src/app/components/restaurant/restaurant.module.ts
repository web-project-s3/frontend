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


@NgModule({
  declarations: [RestaurantEditComponent],
  imports: [
    CommonModule,
    TreeTableModule,
    DividerModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    FormsModule,
    InputTextModule,
    RestaurantRoutingModule
  ]
})
export class RestaurantModule { }
