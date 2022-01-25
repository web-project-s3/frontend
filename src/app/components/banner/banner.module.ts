import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner.component';
import { MenubarModule } from 'primeng/menubar';
import { TabViewModule } from "primeng/tabview"
import { SlideMenuModule } from "primeng/slidemenu"
import { MatIconModule } from "@angular/material/icon"


@NgModule({
  declarations: [BannerComponent],
  imports: [
    CommonModule,
    MenubarModule,
    TabViewModule,
    SlideMenuModule,
    MatIconModule
  ],
  exports: [
    BannerComponent
  ]
})
export class BannerModule { }
