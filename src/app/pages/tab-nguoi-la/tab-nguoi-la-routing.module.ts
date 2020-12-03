import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabNguoiLaPage } from './tab-nguoi-la.page';

const routes: Routes = [
  {
    path: '',
    component: TabNguoiLaPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabNguoiLaPageRoutingModule {}
