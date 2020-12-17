import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DanhSachLopPageRoutingModule } from './danh-sach-lop-routing.module';

import { DanhSachLopPage } from './danh-sach-lop.page';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DanhSachLopPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DanhSachLopPage]
})
export class DanhSachLopPageModule {}
