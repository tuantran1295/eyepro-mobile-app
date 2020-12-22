import {Component, OnInit} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';
import {ClassRoomService} from '../../services/class-room.service';
import {LoadingController} from '@ionic/angular';
import {LoadingService} from '../../services/loading.service';

@Component({
    selector: 'app-tab-bo-tiet',
    templateUrl: 'tab-bo-tiet.page.html',
    styleUrls: ['tab-bo-tiet.page.scss']
})
export class TabBoTietPage implements OnInit {
    studentList = [];
    className = '';
    currentDate = new Date();
    loading = null;

    constructor(
        private classRoomService: ClassRoomService,
        private attendanceService: AttendanceService,
        private loadingService: LoadingService,
    ) {
    }

    async ngOnInit() {
        this.resetPageData();
        this.loadingService.presentLoading();
        this.classRoomService.chosenClassRoom.subscribe((className) => {
            if (className) {
                this.getCurrentClassName(className);
                this.getLeftStudent();
            }
        });

    }

    getCurrentClassName(name) {
        this.className = name;
    }

    getLeftStudent() {
        this.attendanceService.left.subscribe(students =>  {
            this.loadingService.dismissLoading();
            if (students) {
                this.studentList = students;
            }
            this.loading.dismiss();
        });
    }

    resetPageData() {
        this.studentList = [];
        this.className = '';
        this.currentDate = new Date();
    }
}
