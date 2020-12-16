import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseClassPageRoutingModule } from './choose-class-routing.module';

import { ChooseClassPage } from './choose-class.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseClassPageRoutingModule
  ],
  declarations: [ChooseClassPage]
})
export class ChooseClassPageModule {}
