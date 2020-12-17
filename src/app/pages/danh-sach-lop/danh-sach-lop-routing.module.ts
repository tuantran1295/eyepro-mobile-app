import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DanhSachLopPage } from './danh-sach-lop.page';

const routes: Routes = [
  {
    path: '',
    component: DanhSachLopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachLopPageRoutingModule {}
