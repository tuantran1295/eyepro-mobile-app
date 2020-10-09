import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabBoTietPage } from './tab-bo-tiet.page';

const routes: Routes = [
  {
    path: '',
    component: TabBoTietPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
