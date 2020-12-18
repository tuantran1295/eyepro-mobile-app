import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';
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
    ) {
    }

    ngOnInit(): void {
        console.log('TAB PAGE INIT!!!!');
        this.classRoomService.chosenClassRoom.subscribe((className) => {
            if (className) {
                console.log('TAB PAGE CHOSEN CLASS ROOM: ');
                console.log(className);

                this.attendanceService.getWholeClassAttendance(className).subscribe((classData) => {
                    console.log("WHOLE CLASS DATA:");
                    console.log(classData);
                    if (classData.data) {
                        this.attendanceService.getAttendedStudentList(className).subscribe(attended => {
                            if (!this.attendedList) {
                                this.attendedList = classData.data;
                            }

                            this.newAttendanceCheck = setInterval(
                                () => {
                                    const repeatedSubscribe = this.attendanceService.getAttendedStudentList(className).subscribe(attended => {
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
            } else {
                this.presentAlertConfirm('Tên lớp không hợp lệ, vui lòng thử lại!');
            }
        });
    }

    async getChosenClassName() {
        const className = this.route.snapshot.paramMap.get('className');
        if (!className) {
            this.presentAlertConfirm('Tên lớp không hợp lệ, vui lòng thử lại!');
        }
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
                title: 'Thông Báo Điểm Danh',
                text: `Học viên ${newStudents[i]['fullName']} đã có mặt tại lớp ${newStudents[i]['roomName']} ${newStudents[i]['areaName']} vào lúc ${new Date()}`
            });
        }

        // @ts-ignore
        this.localNotification.schedule(notiMessages);
    }

    ngOnDestroy(): void {
        if (this.newAttendanceCheck) {
            clearInterval(this.newAttendanceCheck);
        }
    }

}
