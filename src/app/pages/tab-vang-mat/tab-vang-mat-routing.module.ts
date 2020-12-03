import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabVangMatPage } from './tab-vang-mat.page';

const routes: Routes = [
  {
    path: '',
    component: TabVangMatPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabVangMatPageRoutingModule {}
