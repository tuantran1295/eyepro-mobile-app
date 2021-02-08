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
import {LoginService} from '../../services/login.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
    webSocketEndPoint = environment.rootURL + 'student-websocket';
    // webSocketEndPoint = 'http://27.71.228.53:9002/SmartClass/student-websocket';
    topicURL = '/topic/newMonitor/';
    // topic = '/topic/newMonitor/B6';
    stompClient: any;

    attendedList = [];
    absenceList = [];

    updateTimer;
    isAdmin = false;
    loginUserName = null;

    constructor(
        public alertController: AlertController,
        public route: ActivatedRoute,
        public router: Router,
        private attendanceService: AttendanceService,
        private classRoomService: ClassRoomService,
        private localNotification: LocalNotifications,
        private platform: Platform,
        private loadingService: LoadingService,
        private loginService: LoginService,
    ) {
    }

    async ngOnInit() {
        this.topicURL = '/topic/newMonitor/';

        console.log('TAB PAGE INIT!!!!');
        this.classRoomService.loadChosenClassRoom().then(() => {
            this.classRoomService.chosenClassRoom.subscribe(async (className) => {
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

                    const isDataExist = await this.attendanceService.getClassAttendance(className);
                    console.log('IS DATA EXIST: ');
                    console.log(isDataExist);
                    if (isDataExist) {
                        this.checkUserRole(className);
                        this.connectToNotificationSocket();
                        this.setUpdateTimer(); // update student attendance status every 5 minutes
                    } else {
                        this.loadingService.dismissLoading();
                        this.presentAlertConfirm(`Không có ca học cho lớp ${className} tại thời điểm hiện tại`);
                    }
                }
            });
        });
    }


    setUpdateTimer() {
        // update student attendance status every 5 minutes
        // if currentStudent timeInout is past 5 minute from now, move to absence list.
        this.updateTimer = setInterval(() => {
            this.updateStudentStatus();
        }, 30000); //300000
    }

    updateStudentStatus() {
        for (let i = 0; i < this.attendedList.length; i++) {
            console.log('ATTENDANCE TIME: ' + i);
            console.log(this.attendedList[i].timeInout); // hh:mm:ss

            const rawInOutTime = this.attendedList[i].timeInout.split(':');
            const inOutDate = new Date();
            inOutDate.setHours(rawInOutTime[0], rawInOutTime[1], rawInOutTime[2]);

            const currentDate = new Date();
            // @ts-ignore
            const diffMs = (currentDate - inOutDate); // in milliseconds
            const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            console.log('DIFF MIN: ' + diffMins);

            if (diffMins >= 5) { //5
                const absencedOne = this.attendedList.splice(i, 1);
                this.absenceList.push(absencedOne[0]);
                console.log(this.absenceList);
                // @ts-ignore
                this.attendanceService.attended.next(this.attendedList);
                // @ts-ignore
                this.attendanceService.absence.next(this.absenceList);
            }
        }
    }


    connectToNotificationSocket() {
        console.log('Initialize WebSocket Connection');
        console.log('SOCKET ENDPOINT:');
        console.log(this.webSocketEndPoint);
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

    checkUserRole(chosenClassRoom) {
        console.log("CHECK USER ROLE LOGIN TOKEN::::: ");
        console.log(this.loginService.loginToken);
        this.loginUserName = this.loginService.loginToken;
        console.log(this.loginUserName.toUpperCase() === chosenClassRoom);
        if (this.loginUserName === 'admin' || this.loginUserName.toUpperCase() === chosenClassRoom) {
            this.isAdmin = true;
        }
    }

    onNotiMessageReceived(message) {
        this.loadingService.dismissLoading();
        console.log('Message Received from Server :: ' + message);
        console.log('NOTIFICATION MESSAGE: ');
        console.log(JSON.parse(message.body));

        const notiMessage = JSON.parse(message.body);
        // this.isAdmin is set in checkUserRole(chosenClassRoom)
        console.log("IS ADMIN:" + this.isAdmin);

        // *MARK: SHOW ALL NOTIFICATION TO ADMIN ONLY
        // Normal account only display his own notification
        this.filteredDisplayNotification(notiMessage);

        this.updateFullStudentLists(notiMessage);
        // this.updateStudentList(notiMessage);
    }

    filteredDisplayNotification(notiMessage) {
        if (this.isAdmin) {
            this.showNotification(notiMessage);
        } else { // ACCOUNT CO DANG 001_hung 005_hoa
            const loginUserID = this.loginUserName.split("_")[0];
            console.log("loginUserID: " + loginUserID);
            console.log(notiMessage.studentId);
            console.log(loginUserID === notiMessage.studentId);
            if (loginUserID && loginUserID === notiMessage.studentId) {
                this.showNotification(notiMessage);
            }
        }
    }

    updateFullStudentLists(notiMessage) {
        let attendedOne = null;
        let isUpdatingOnly = true;

        let i = 0;
        while (i < this.absenceList.length) {
            let currentStudent = this.absenceList[i];
            if (currentStudent.studentId === notiMessage.studentId) {
                isUpdatingOnly = false; // student hien tai co trong danh sach absence
                attendedOne = this.absenceList.splice(i, 1)[0];
                // update check-in time
                attendedOne.realtimeImage = notiMessage.image_path_temp;
                attendedOne.timeInout = this.timestampToHourMinuteSecond(notiMessage.inOutTime);

                this.attendedList.push(attendedOne);
                // lay thoi gian hien tai tru di timeInout neu ket qua lon hon 5 phut, chuyen ve vang mat.
                // @ts-ignore
                this.attendanceService.absence.next(this.absenceList);
                // @ts-ignore
                this.attendanceService.attended.next(this.attendedList);
            } else {
                i++;
            }
        }

        // neu attendedList co student dang diem danh roi thi cap nhat thong tin image va timeInout
        // neu chua co, push them attendedOne
        if (isUpdatingOnly) {
            for (let j = 0; j < this.attendedList.length; j++) {
                if (this.attendedList[j].studentId === notiMessage.studentId) {
                    this.attendedList[j].realtimeImage = notiMessage.image_path_temp;
                    this.attendedList[j].timeInout = this.timestampToHourMinuteSecond(notiMessage.inOutTime);
                    // @ts-ignore
                    this.attendanceService.attended.next(this.attendedList);
                }
            }
        }
    }


    // updateStudentList(notiMessage) {
    //     let i = 0;
    //     while (i < this.absenceList.length) {
    //         let currentStudent = this.absenceList[i];
    //         if (currentStudent.studentId === notiMessage.studentId) {
    //             this.absenceList.splice(i, 1);
    //             currentStudent.timeInout = this.timestampToHourMinuteSecond(notiMessage.inOutTime);
    //             this.attendedList.push(currentStudent);
    //             // @ts-ignore
    //             this.attendanceService.attended.next(this.attendedList);
    //             // @ts-ignore
    //             this.attendanceService.absence.next(this.absenceList);
    //         } else {
    //             i++;
    //         }
    //     }
    // }


    timestampToHourMinuteSecond(timestamp) {
        const inOutDate = new Date(timestamp);
        const hours = inOutDate.getHours();
        const minutes = '0' + inOutDate.getMinutes();
        const seconds = '0' + inOutDate.getSeconds();
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
        console.log('showNotification IMAGE: ');
        console.log(message.image_path_temp);
        this.localNotification.requestPermission().then(() => {
            // @ts-ignore
            // const uri = 'https://www.strictlyeducation4s.co.uk/strictly_education4s/AdobeStock_303989091.jpeg';
            this.localNotification.schedule({
                id: 1,
                // sound: this.setSound(),
                sound: this.platform.is('android') ? 'file://assets/sound/quite-impressed-565.mp3' : 'file://assets/sound/slow-spring-board-570.m4r',
                vibrate: true,
                title: 'Thông Báo Điểm Danh',
                text: `Học viên ${message.name} đã có mặt tại lớp ${message.roomId} vào lúc ${this.getCurrentTime()}`,
                // attachments: [uri]
            });
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
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
    }

}
