import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ComponentsModule} from './components/components.module';
import {HttpClientModule} from '@angular/common/http';
import {LoginService} from './services/login.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        ComponentsModule,
        HttpClientModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        LoginService,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        LocalNotifications
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
