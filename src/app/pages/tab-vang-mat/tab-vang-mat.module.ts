import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabVangMatPage } from './tab-vang-mat.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { TabVangMatPageRoutingModule } from './tab-vang-mat-routing.module'
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{path: '', component: TabVangMatPage}]),
    TabVangMatPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [TabVangMatPage]
})
export class TabVangMatPageModule {}
