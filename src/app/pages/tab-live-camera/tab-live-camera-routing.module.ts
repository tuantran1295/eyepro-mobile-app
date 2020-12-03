import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabLiveCameraPage } from './tab-live-camera.page';

const routes: Routes = [
  {
    path: '',
    component: TabLiveCameraPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabLiveCameraPageRoutingModule {}
