import {Injectable, OnInit} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService implements OnInit {
    loading = null;

    constructor(
        private loadingController: LoadingController,
    ) {
    }

    async ngOnInit() {
        console.log("LOADING SERVICE INIT!!!!");
        console.log("||||||||||||||||||||||||||||||||||||");

    }

    async presentLoading() {
        if (!this.loading) {
            this.loading = await this.loadingController.create();
        }
        return await this.loading.present();

    }

    async dismissLoading() {
        if (this.loading) {
            return await this.loading.dismiss();
        }
    }
}
