import {Component, OnInit} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';
import {ClassRoomService} from '../../services/class-room.service';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-tab-co-mat',
    templateUrl: 'tab-co-mat.page.html',
    styleUrls: ['tab-co-mat.page.scss']
})
export class TabCoMatPage implements OnInit {
    studentList = [];
    className = '';
    currentDate = new Date();
    loading = null;

    constructor(
        private attendanceService: AttendanceService,
        private classRoomService: ClassRoomService,
        private loadingController: LoadingController,
    ) {
    }

    async ngOnInit() {
        this.resetPageData();
        this.loading = await this.loadingController.create();
        await this.loading.present();
        this.classRoomService.chosenClassRoom.subscribe((className) => {
            this.loading.dismiss();
            console.log("CO MAT CLASS NAME: ");
            console.log(className);
            if (className) {
                console.log("CO MAT CLASS ROOM: ");
                console.log(className);
                this.getCurrentClassName(className);
                this.getAttendedStudent();
            }
        });
    }

    getCurrentClassName(name) {
        this.className = name;
    }

    getAttendedStudent() {
        this.attendanceService.attended.subscribe(students => {
            this.studentList = students;

        });
    }

    resetPageData() {
        this.studentList = [];
        this.className = '';
        this.currentDate = new Date();
    }

}
