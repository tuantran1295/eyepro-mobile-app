import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertController, Platform} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {AttendanceService} from '../../services/attendance.service';
import {ClassRoomService} from '../../services/class-room.service';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
    webSocketEndPoint = 'http://27.71.228.53:9002/SmartClass/student-websocket';
    topicURL = '/topic/newMonitor/';
    // topic = '/topic/newMonitor/B6';
    stompClient: any;

    constructor(
        public alertController: AlertController,
        public route: ActivatedRoute,
        public router: Router,
        private attendanceService: AttendanceService,
        private classRoomService: ClassRoomService,
        private localNotification: LocalNotifications,
        private platform: Platform,
    ) {
    }

    ngOnInit(): void {
        this.topicURL = '/topic/newMonitor/';

        console.log('TAB PAGE INIT!!!!');
        this.classRoomService.chosenClassRoom.subscribe((className) => {
            console.log('TAB PAGE CLASS NAME: ');
            console.log(className);
            if (this.classRoomService.chosenClassName) {
                this.topicURL = this.topicURL + this.classRoomService.chosenClassName;

                console.log('TAB PAGE CHOSEN CLASS ROOM: ');
                console.log(this.classRoomService.chosenClassName);
                console.log(this.topicURL);

                this.attendanceService.getWholeClassAttendance(this.classRoomService.chosenClassName).subscribe((classData) => {
                    console.log('WHOLE CLASS DATA:');
                    console.log(classData);
                    if (classData.data) {
                        this.connectToNotificationSocket();
                    } else {
                        this.presentAlertConfirm(`Không có ca học cho lớp ${className} tại thời điểm hiện tại`);
                    }
                });
            }
        });
    }


    connectToNotificationSocket() {
        console.log('Initialize WebSocket Connection');
        const ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;

        _this.stompClient.connect({}, function(frame) {
            _this.stompClient.subscribe(_this.topicURL, function(sdkEvent) {
                _this.onNotiMessageReceived(sdkEvent);
            });
            // _this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    };

    disconnectNotificationSocket() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log('Disconnected');
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log('errorCallBack -> ' + error);
        setTimeout(() => {
            this.connectToNotificationSocket();
        }, 5000);
    }

    onNotiMessageReceived(message) {
        console.log('Message Recieved from Server :: ' + message);
        this.showNotification(message.body)
    }

    async presentAlertConfirm(msg: string) {
        const alert = await this.alertController.create({
            header: 'Thông báo',
            message: msg,
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.router.navigate(['/danh-sach-lop']);
                    }
                }
            ]
        });

        await alert.present();
    }


    showNotification(message) {
        // @ts-ignore
        this.localNotification.schedule({
            id: 1,
            sound: this.setSound(),
            title: 'Thông Báo Điểm Danh',
            text: `Học viên ${message.name} đã có mặt tại lớp ${message.roomId} vào lúc ${new Date()}`
        });
    }

    setSound() {
        if (this.platform.is('android')) {
            return 'file://assets/sound/quite-impressed-565.mp3';
        } else {
            return 'file://assets/sound/slow-spring-board-570.m4r';
        }
    }

    ngOnDestroy(): void {
        this.disconnectNotificationSocket();
    }

}
