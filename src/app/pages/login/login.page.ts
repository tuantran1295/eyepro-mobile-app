import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../services/login.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {HttpHeaders} from '@angular/common/http';
import {Plugins} from '@capacitor/core';
import {ClassRoomService} from '../../services/class-room.service';

const {Storage} = Plugins;

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
        private classRoomService: ClassRoomService,
    ) {
    }

    ngOnInit() {
        this.autoLogin();
        this.credentials = this.formBuilder.group({
            userName: ['view_301', [Validators.required, Validators.minLength(3)]],
            password: ['abcd1234', [Validators.required, Validators.minLength(5)]]
        });
    }

    autoLogin() {
        this.loginService.isAuthenticated.subscribe((isLoggedIn) => {
            if (isLoggedIn) {
                this.loadChosenClass();
            }
        });
    }

    async login() {
        const loading = await this.loadingController.create();
        await loading.present();

        this.loginService.login(this.credentials.value).subscribe(
            async (res) => {
                await loading.dismiss();
                this.loadChosenClass();
            },
            async (res) => {
                await loading.dismiss();
                const alert = await this.alertController.create({
                    header: 'Lỗi Đăng Nhập',
                    message: res.message.toString(),
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

    loadChosenClass() {
        this.classRoomService.loadChosenClassRoom().then(() => { // classRoomService.chosenClassRoom behaviour subject next value in this function
            this.classRoomService.chosenClassRoom.subscribe(chosenClass => {
                if (chosenClass) {
                    console.log('Login Page CHOSEN CLASS:');
                    console.log(chosenClass);
                    this.router.navigateByUrl('/thong-tin-lop/' + chosenClass, {replaceUrl: true});
                } else {
                    this.router.navigateByUrl('/danh-sach-lop', {replaceUrl: true});
                }
            });
        });

    }

}
