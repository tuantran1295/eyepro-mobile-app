import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab-live-camera',
        loadChildren: () => import('../tab-live-camera/tab-live-camera.module').then(m => m.TabLiveCameraPageModule)
      },
      {
        path: 'tab-co-mat',
        loadChildren: () => import('../tab-co-mat/tab-co-mat.module').then(m => m.TabCoMatPageModule)
      },
      {
        path: 'tab-vang-mat',
        loadChildren: () => import('../tab-vang-mat/tab-vang-mat.module').then(m => m.TabVangMatPageModule)
      },
      {
        path: 'tab-bo-tiet',
        loadChildren: () => import('../tab-bo-tiet/tab-bo-tiet.module').then(m => m.TabBoTietPageModule)
      },
      {
        path: 'tab-nguoi-la',
        loadChildren: () => import('../tab-nguoi-la/tab-nguoi-la.module').then(m => m.TabNguoiLaPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab-live-camera',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab-live-camera',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
