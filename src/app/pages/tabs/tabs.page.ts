import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertController, Platform} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {AttendanceService} from '../../services/attendance.service';
import {ClassRoomService} from '../../services/class-room.service';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
    attendedList = [];
    newAttendanceCheck = null;

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
        console.log('TAB PAGE INIT!!!!');
        this.classRoomService.chosenClassRoom.subscribe((className) => {
            console.log('TAB PAGE CLASS NAME: ');
            console.log(className);
            if (this.classRoomService.chosenClassName) {
                console.log('TAB PAGE CHOSEN CLASS ROOM: ');
                console.log(this.classRoomService.chosenClassName);

                this.attendanceService.getWholeClassAttendance(this.classRoomService.chosenClassName).subscribe((classData) => {
                    console.log('WHOLE CLASS DATA:');
                    console.log(classData);
                    if (classData.data) {
                        this.attendanceService.getAttendedStudentList(this.classRoomService.chosenClassName).subscribe(attended => {
                            if (!this.attendedList) {
                                this.attendedList = classData.data;
                            }

                            this.newAttendanceCheck = setInterval(
                                () => {
                                    const repeatedSubscribe = this.attendanceService.getAttendedStudentList(this.classRoomService.chosenClassName).subscribe(attended => {
                                        repeatedSubscribe.unsubscribe();
                                        if (attended.length > this.attendedList.length) {
                                            const onlyNews = attended.filter(this.compareStudentList(this.attendedList));
                                            if (onlyNews) {
                                                this.showNewAttendedNotifications(onlyNews);

                                            }
                                        }
                                    });
                                }, 20 * 10000);
                        });
                    } else {
                        this.presentAlertConfirm(`Không có ca học cho lớp ${className} tại thời điểm hiện tại`);
                    }
                });
            }
            // else {
            //     this.presentAlertConfirm('Tên lớp không hợp lệ, vui lòng thử lại!');
            // }
        });
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

    compareStudentList(otherArray) {
        return function(current) {
            return otherArray.filter(function(other) {
                return other.studentId == current.studentId && other.fullName == current.fullName;
            }).length == 0;
        };
    }

    showNewAttendedNotifications(newStudents) {
        let notiMessages = [];
        for (let i = 0; i < newStudents.length; i++) {
            notiMessages.push({
                id: i,
                sound: this.setSound(),
                title: 'Thông Báo Điểm Danh',
                text: `Học viên ${newStudents[i]['fullName']} đã có mặt tại lớp ${newStudents[i]['roomName']} ${newStudents[i]['areaName']} vào lúc ${new Date()}`
            });
        }

        // @ts-ignore
        this.localNotification.schedule(notiMessages);
    }

    setSound() {
        if (this.platform.is('android')) {
            return 'file://assets/sound/quite-impressed-565.mp3';
        } else {
            return 'file://assets/sound/slow-spring-board-570.m4r';
        }
    }

    ngOnDestroy(): void {
        if (this.newAttendanceCheck) {
            clearInterval(this.newAttendanceCheck);
        }
    }

}
