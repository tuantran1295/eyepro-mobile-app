import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabCoMatPage } from './tab-co-mat.page';

const routes: Routes = [
  {
    path: '',
    component: TabCoMatPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabCoMatPageRoutingModule {}
