import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabLiveCameraPage } from './tab-live-camera.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { TabLiveCameraPageRoutingModule } from './tab-live-camera-routing.module';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        TabLiveCameraPageRoutingModule,
        ComponentsModule,
    ],
  declarations: [TabLiveCameraPage]
})
export class TabLiveCameraPageModule {}
