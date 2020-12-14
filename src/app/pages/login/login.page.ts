import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../services/login.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {HttpHeaders} from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    credentials: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private alertController: AlertController,
        private router: Router,
        private loadingController: LoadingController,
    ) {
    }

    ngOnInit() {
        this.credentials = this.formBuilder.group({
            userName: ['view_301', [Validators.required, Validators.minLength(3)]],
            password: ['abcd1234', [Validators.required, Validators.minLength(5)]]
        });
    }

    async login() {
        const loading = await this.loadingController.create();
        await loading.present();

        this.loginService.login(this.credentials.value).subscribe(
            async (res) => {
                await loading.dismiss();
                this.router.navigateByUrl('/tabs', {replaceUrl: true});
            },
            async (res) => {
                await loading.dismiss();
                const alert = await this.alertController.create({
                    header: 'Lỗi Đăng Nhâp',
                    message: res,
                    buttons: ['OK'],
                });
                await alert.present();
            }
        );
    }

    // Form input modal getter
    // Easy to access for form fields
    get userName() {
        return this.credentials.get('userName');
    }

    get password() {
        return this.credentials.get('password');
    }

}
