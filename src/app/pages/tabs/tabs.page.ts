import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertController, Platform} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {AttendanceService} from '../../services/attendance.service';
import {ClassRoomService} from '../../services/class-room.service';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {LoadingService} from '../../services/loading.service';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
    webSocketEndPoint =  environment.rootURL + 'SmartClass/student-websocket';
    // webSocketEndPoint = 'http://27.71.228.53:9002/SmartClass/student-websocket';
    topicURL = '/topic/newMonitor/';
    // topic = '/topic/newMonitor/B6';
    stompClient: any;

    attendedList = [];
    absenceList = [];

    constructor(
        public alertController: AlertController,
        public route: ActivatedRoute,
        public router: Router,
        private attendanceService: AttendanceService,
        private classRoomService: ClassRoomService,
        private localNotification: LocalNotifications,
        private platform: Platform,
        private loadingService: LoadingService,
    ) {
    }

    ngOnInit(): void {
        this.topicURL = '/topic/newMonitor/';

        console.log('TAB PAGE INIT!!!!');
        this.classRoomService.loadChosenClassRoom().then(() => {
            this.classRoomService.chosenClassRoom.subscribe((className) => {
                console.log('TAB PAGE CLASS NAME: ');
                console.log(className);
                if (className) {
                    this.topicURL = this.topicURL + className;

                    console.log('TAB PAGE CHOSEN CLASS ROOM: ');
                    console.log(className);
                    console.log(this.topicURL);

                    this.attendanceService.attended.subscribe(students => {
                        this.attendedList = students;
                    });

                    this.attendanceService.absence.subscribe(students => {
                        this.absenceList = students;
                    });

                    const isDataExist = this.attendanceService.getClassAttendance(className);
                    if (isDataExist) {
                        this.connectToNotificationSocket();
                    } else {
                        this.loadingService.dismissLoading();
                        this.presentAlertConfirm(`Không có ca học cho lớp ${className} tại thời điểm hiện tại`);
                    }
                }
            });
        });
    }


    connectToNotificationSocket() {
        console.log('Initialize WebSocket Connection');
        const ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);

        this.stompClient.connect({}, (frame) => {
            this.stompClient.subscribe(this.topicURL, (sdkEvent) => {
                this.onNotiMessageReceived(sdkEvent);
            });
            // _this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    }

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
        this.loadingService.dismissLoading();
        console.log('Message Received from Server :: ' + message);
        console.log('NOTIFICATION MESSAGE: ');
        console.log(JSON.parse(message.body));
        const notiMessage = JSON.parse(message.body);
        this.showNotification(notiMessage);
        this.updateStudentList(notiMessage);
        console.log("ON NOTI IN OUT TIME: ");
        console.log(this.timestampToHourMinuteSecond(notiMessage.inOutTime));
    }


    updateStudentList(notiMessage) {
        let i = 0;
        while (i < this.absenceList.length) {
            let currentStudent = this.absenceList[i];
            if (currentStudent.studentId === notiMessage.studentId) {
                this.absenceList.splice(i, 1);
                currentStudent.timeInout = this.timestampToHourMinuteSecond(notiMessage.inOutTime);
                this.attendedList.push(currentStudent);
                // @ts-ignore
                this.attendanceService.attended.next(this.attendedList);
                // @ts-ignore
                this.attendanceService.absence.next(this.absenceList);
            } else {
                i++;
            }
        }
    }

    timestampToHourMinuteSecond(timestamp) {
        const inOutDate = new Date(timestamp);
        const hours = inOutDate.getHours();
        const minutes = "0" + inOutDate.getMinutes();
        const seconds = "0" + inOutDate.getSeconds();
        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
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
            // sound: this.setSound(),
            sound:  this.platform.is('android') ? 'file://assets/sound/quite-impressed-565.mp3' : 'file://assets/sound/slow-spring-board-570.m4r',
            vibrate: true,
            title: 'Thông Báo Điểm Danh',
            text: `Học viên ${message.name} đã có mặt tại lớp ${message.roomId} Học viện chính trị Quốc gia HCM Khu vực 1 vào lúc ${this.getCurrentTime()}`
        });
    }

    getCurrentTime() {
        const today = new Date();
        const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        const dateTime = time + ' ngày ' + date;
        return dateTime;
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
