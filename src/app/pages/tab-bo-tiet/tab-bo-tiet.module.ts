import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabBoTietPage } from './tab-bo-tiet.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import {TabBoTietPageRoutingModule} from './tab-bo-tiet-routing.module';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        TabBoTietPageRoutingModule,
        ComponentsModule,
    ],
  declarations: [TabBoTietPage]
})
export class TabBoTietPageModule {}
