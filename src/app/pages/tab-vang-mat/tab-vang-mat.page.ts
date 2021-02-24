import {Component} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';
import {ClassRoomService} from '../../services/class-room.service';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-tab-vang-mat',
    templateUrl: 'tab-vang-mat.page.html',
    styleUrls: ['tab-vang-mat.page.scss']
})
export class TabVangMatPage {
    studentList = [];
    className = '';
    currentDate = new Date();

    isAdmin = false;
    loginUserID = "";

    constructor(
        private attendanceService: AttendanceService,
        private classRoomService: ClassRoomService,
        private loadingController: LoadingController,
        ) {
    }

    async ngOnInit() {
        // const loading = await this.loadingController.create();
        // await loading.present();
        this.classRoomService.chosenClassRoom.subscribe((className) => {
            // loading.dismiss();
            if (className) {
                this.isAdmin = this.classRoomService.isAdmin;
                this.loginUserID = this.classRoomService.loginUserID;
                this.getCurrentClassName(className);
                this.getAbsenceStudent();
            }
        });

    }

    getCurrentClassName(name) {
        this.className = name;
    }

    getAbsenceStudent() {
        this.attendanceService.absence.subscribe(students => {
            console.log('TabVangMatPage');
            console.log(students);
            if (students) {
                this.studentList = students;
            }
        });
    }
}
