import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { ClassRoomService } from '../../services/class-room.service';


import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
export class WebSocketAPI {
    webSocketEndPoint: string = 'http://27.71.228.53:9002/SmartClass/student-websocket';
    topic: string = "/topic/newMonitor/B6";
    stompClient: any;

    _connect() {
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

    /**
     * Send message to sever via web socket
     * @param {*} message 
     */
    _send(message) {
        console.log("calling logout api via web socket");
        this.stompClient.send("/app/hello", {}, JSON.stringify(message));
    }

    onMessageReceived(message) {
        console.log("Message Recieved from Server :: " + message);
    }
}

const { Storage } = Plugins;

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    credentials: FormGroup;

    webSocketAPI: WebSocketAPI;
    greeting: any;
    name: string;

    connect() {
        this.webSocketAPI._connect();
    }

    disconnect() {
        this.webSocketAPI._disconnect();
    }

    sendMessage() {
        this.webSocketAPI._send(this.name);
    }

    handleMessage(message) {
        this.greeting = message;
    }

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
        this.webSocketAPI = new WebSocketAPI();
        this.connect();
        this.autoLogin();
        this.credentials = this.formBuilder.group({
            userName: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(5)]]
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
                    console.log("Login Page CHOSEN CLASS:");
                    console.log(chosenClass);
                    this.router.navigateByUrl('/thong-tin-lop/' + chosenClass, { replaceUrl: true });
                } else {
                    this.router.navigateByUrl('/danh-sach-lop', { replaceUrl: true });
                }
            });
        });

    }

}