import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabStudentProfilePage } from './tab-student-profile.page';

const routes: Routes = [
  {
    path: '',
    component: TabStudentProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabStudentProfilePageRoutingModule {}
