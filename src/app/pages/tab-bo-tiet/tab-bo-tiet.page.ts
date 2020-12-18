import {Component, OnInit} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';
import {ClassRoomService} from '../../services/class-room.service';
import {LoadingController} from '@ionic/angular';

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
        private loadingController: LoadingController,
    ) {
    }

    async ngOnInit() {
        this.resetPageData();
        this.loading = await this.loadingController.create();
        await this.loading.present();
        this.classRoomService.chosenClassRoom.subscribe((className) => {
            if (this.classRoomService.chosenClassName) {
                this.getCurrentClassName(this.classRoomService.chosenClassName);
                this.getLeftStudent(this.classRoomService.chosenClassName);
            }
        });

    }

    getCurrentClassName(name) {
        this.className = name;
    }

    getLeftStudent(className) {
        this.attendanceService.getLeftStudentList(className).subscribe(students =>  {
            this.studentList = students;
            this.loading.dismiss();
        });
    }

    resetPageData() {
        this.studentList = [];
        this.className = '';
        this.currentDate = new Date();
    }
}
