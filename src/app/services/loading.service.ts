import {Injectable, OnInit} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService implements OnInit {
    loading;

    constructor(
        private loadingController: LoadingController,
    ) {
    }

    async ngOnInit() {
        this.loading = await this.loadingController.create();
    }

    async presentLoading() {
        return await this.loading.present();

    }

    async dismissLoading() {
        return await this.loading.dismiss();
    }
}
