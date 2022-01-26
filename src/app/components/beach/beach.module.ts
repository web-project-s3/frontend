import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeachRoutingModule } from './beach-routing.module';
import { BeachEditComponent } from './beach-edit/beach-edit.component';
import { TreeTableModule } from 'primeng/treetable';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [BeachEditComponent],
  imports: [
    CommonModule,
    TreeTableModule,
    DividerModule,
    ButtonModule,
    MessageModule,
    MessagesModule,
    FormsModule,
    InputTextModule,
    BeachRoutingModule
  ]
})
export class BeachModule { }
