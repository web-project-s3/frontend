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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TreeTableModule } from 'primeng/treetable';
import { environment } from 'src/environments/environment';
import { BeachEditComponent } from './beach-edit/beach-edit.component';
import { BeachOrdersComponent } from './beach-orders/beach-orders.component';
import { BeachProductComponent } from './beach-product/beach-product.component';
import { BeachRoutingModule } from './beach-routing.module';



@NgModule({
  declarations: [BeachEditComponent, BeachProductComponent, BeachOrdersComponent],
  imports: [
    SocketioModule.forRoot({
      url: `${environment.apiUrl}orders`,
      options: {
        transports: ["websocket"]
      }
    }),
    CommonModule,
    CardModule,
    TabViewModule,
    TreeTableModule,
    DividerModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    DropdownModule,
    InputNumberModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    TableModule,
    BeachRoutingModule,
    BadgeModule,
    ConfirmDialogModule
  ]
})
export class BeachModule { }
