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
        path: 'tabs',
        loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    },
  {
    path: 'choose-class',
    loadChildren: () => import('./pages/choose-class/choose-class.module').then( m => m.ChooseClassPageModule)
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
