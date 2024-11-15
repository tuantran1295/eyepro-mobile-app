import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    },
    {
        path: 'danh-sach-lop',
        loadChildren: () => import('./pages/danh-sach-lop/danh-sach-lop.module').then(m => m.DanhSachLopPageModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'thong-tin-lop/:className',
        loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'tabs',
        loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
        canLoad: [AuthGuard]
    },
  {
    path: 'user-profile',
    loadChildren: () => import('./pages/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
