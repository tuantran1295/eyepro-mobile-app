import {Component, OnInit} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';
import {ClassRoomService} from '../../services/class-room.service';
import {LoadingController} from '@ionic/angular';
import {LoadingService} from '../../services/loading.service';

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

    isAdmin = false;
    loginUserID = "";

    constructor(
        private attendanceService: AttendanceService,
        private classRoomService: ClassRoomService,
        private loadingService: LoadingService,
    ) {
    }

    async ngOnInit() {
        this.resetPageData();
        // this.loadingService.presentLoading();
        this.classRoomService.chosenClassRoom.subscribe((className) => {
            console.log("CO MAT CLASS NAME: ");
            console.log(className);
            console.log("LOGIN USER ID: " + this.classRoomService.loginUserID);
            if (className) {
                this.isAdmin = this.classRoomService.isAdmin;
                this.loginUserID = this.classRoomService.loginUserID;
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
            this.loadingService.dismissLoading();
            this.studentList = students;
        });
    }

    resetPageData() {
        this.studentList = [];
        this.className = '';
        this.currentDate = new Date();
    }

}
