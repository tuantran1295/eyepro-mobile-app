import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabNguoiLaPage } from './tab-nguoi-la.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { TabNguoiLaPageRoutingModule } from './tab-nguoi-la-routing.module';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        TabNguoiLaPageRoutingModule,
        ComponentsModule
    ],
  declarations: [TabNguoiLaPage]
})
export class TabNguoiLaPageModule {}
