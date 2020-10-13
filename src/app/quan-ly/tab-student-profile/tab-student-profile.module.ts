import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabStudentProfilePageRoutingModule } from './tab-student-profile-routing.module';

import { TabStudentProfilePage } from './tab-student-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabStudentProfilePageRoutingModule
  ],
  declarations: [TabStudentProfilePage]
})
export class TabStudentProfilePageModule {}
