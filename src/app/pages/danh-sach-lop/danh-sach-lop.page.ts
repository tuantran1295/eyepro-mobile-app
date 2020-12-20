import {Component, OnInit} from '@angular/core';
import {ClassRoom} from '../../models/ClassRoom';
import {ClassRoomService} from '../../services/class-room.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
@Component({
    selector: 'app-danh-sach-lop',
    templateUrl: './danh-sach-lop.page.html',
    styleUrls: ['./danh-sach-lop.page.scss'],
})
export class DanhSachLopPage implements OnInit {
    classRoomList = [];

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
        private router: Router,
        private classRoomService: ClassRoomService,
        private loadingController: LoadingController,
        private alertController: AlertController,
    ) {
    }

    ngOnInit() {
        // Tự động kết nối websocket
        this.webSocketAPI = new WebSocketAPI();
        this.connect();

        this.resetPageData();
        this.getClassRoomList();
    }

    async getClassRoomList() {
        const loading = await this.loadingController.create();
        await loading.present();

        this.classRoomService.getClassList().subscribe(
            async (classRoomData) => {
                classRoomData = classRoomData.map(classRoom => (
                    {
                        id: classRoom.id,
                        className: classRoom.name,
                        roomID: classRoom.roomId,
                        areaName: classRoom.areaName
                    }));
                this.classRoomList = this.classRoomList.concat(classRoomData);
                this.classRoomList.sort(this.compareClassRoomName)
                await loading.dismiss();
            },
            async error => {
                await loading.dismiss();
                const alert = await this.alertController.create({
                    header: 'Lỗi Đăng Nhập',
                    message: error.message.toString(),
                    buttons: ['OK'],
                });
                await alert.present();
            });
    }

    async onClassItemClicked(className: string) {
        const loading = await this.loadingController.create();
        await loading.present();

        this.classRoomService.chooseClass(className).subscribe(() => {
            this.classRoomService.chosenClassRoom.subscribe(chosenClass => {
                loading.dismiss();
                this.router.navigateByUrl('/thong-tin-lop/' + chosenClass, {replaceUrl: true});
            });
        });
    }

    compareClassRoomName(a, b) {
        if (a.className < b.className) {
            return -1;
        }
        if (a.className > b.className) {
            return 1;
        }
        return 0;
    }

    resetPageData() {
        this.classRoomList = [];
    }

}

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