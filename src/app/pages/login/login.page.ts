import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LOGIN_TOKEN_KEY, LoginService} from '../../services/login.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {HttpHeaders} from '@angular/common/http';
import {Plugins} from '@capacitor/core';
import {ClassRoomService} from '../../services/class-room.service';
import {environment} from '../../../environments/environment';
import {from} from 'rxjs';

const {Storage} = Plugins;

export const LAST_USERNAME_KEY = 'last-user';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    credentials: FormGroup;

    serverList = [
        'http://10.0.0.183:9003/',
        'http://192.168.196.183:9003/',
        'http://27.71.228.53:9002/SmartClass',
        'http://27.71.228.53:9003/',
        'http://10.0.0.180:9003/',
        'http://192.168.196.180:9003/'
    ];
    selectedServer = this.serverList[0];

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
        this.setEnvironmentServer();
        this.loadLastUserName() // remember username and password
        this.autoLogin();
        this.credentials = this.formBuilder.group({
            // userName: ['view_301', [Validators.required, Validators.minLength(3)]],
            // password: ['abcd1234', [Validators.required, Validators.minLength(5)]]
            // userName: ['admin6', [Validators.required, Validators.minLength(3)]],
            // password: ['123456aA@', [Validators.required, Validators.minLength(5)]]
            userName: ["vdsmart", [Validators.required, Validators.minLength(3)]],
            password: ["Vdsmart321", [Validators.required, Validators.minLength(5)]]
        });
    }

    setEnvironmentServer() {
        environment.rootURL = this.selectedServer;
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
        this.setEnvironmentServer();
        this.loginService.login(this.credentials.value).subscribe(
            async (res) => {
                await this.saveLastLogin();
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
                    this.router.navigateByUrl('/thong-tin-lop/' + chosenClass);
                } else {
                    this.router.navigateByUrl('/danh-sach-lop', {replaceUrl: true});
                }
            });
        });
    }

    async saveLastLogin() {
        const lastCredential = JSON.stringify(this.credentials.value);
        return from(Storage.set({key: LAST_USERNAME_KEY, value: lastCredential}));
    }

    async loadLastUserName() {
        const token = await Storage.get({key: LAST_USERNAME_KEY});
        if (token && token.value) {
            console.log(`LAST USER LOGIN: `);
            console.log(token);
            const lastLogin = JSON.parse(token.value);
            console.log(lastLogin);
            this.credentials.setValue({
                userName: lastLogin.userName,
                password: lastLogin.password
            })
        }
    }
}
