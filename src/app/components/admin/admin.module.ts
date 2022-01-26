import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TreeTableModule } from 'primeng/treetable';
import { ToastModule } from 'primeng/toast';
import {TableModule} from 'primeng/table';



@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    TabViewModule,
    MessageModule,
    MessagesModule,
    DividerModule,
    AdminRoutingModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    TreeTableModule,
    TableModule
  ]
})
export class AdminModule { }
