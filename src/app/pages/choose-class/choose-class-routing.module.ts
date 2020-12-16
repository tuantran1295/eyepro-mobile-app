import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseClassPage } from './choose-class.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseClassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseClassPageRoutingModule {}
