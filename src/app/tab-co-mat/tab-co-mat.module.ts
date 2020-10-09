import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabCoMatPage } from './tab-co-mat.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabCoMatPageRoutingModule } from './tab-co-mat-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TabCoMatPageRoutingModule
  ],
  declarations: [TabCoMatPage]
})
export class TabCoMatPageModule {}