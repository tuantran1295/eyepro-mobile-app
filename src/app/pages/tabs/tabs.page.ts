import {Component, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {AttendanceService} from '../../services/attendance.service';
import {ClassRoomService} from '../../services/class-room.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

    constructor(
        public alertController: AlertController,
        public route: ActivatedRoute,
        public router: Router,
        private attendanceService: AttendanceService,
        private classRoomService: ClassRoomService,
    ) {
    }

    ngOnInit(): void {
        console.log('TAB PAGE INIT!!!!');
        this.classRoomService.chosenClassRoom.subscribe((className) => {
            if (className) {
                console.log("TAB PAGE CHOSEN CLASS ROOM: ");
                console.log(className);

                this.attendanceService.getClassAttendance(className).subscribe((classData) => {
                    if(!classData.data) {
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

}
