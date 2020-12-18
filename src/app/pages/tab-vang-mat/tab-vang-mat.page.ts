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

    constructor(
        private attendanceService: AttendanceService,
        private classRoomService: ClassRoomService,
        private loadingController: LoadingController,
        ) {
    }

    async ngOnInit() {
        const loading = await this.loadingController.create();
        await loading.present();
        this.classRoomService.chosenClassRoom.subscribe(() => {
            loading.dismiss();
            if (this.classRoomService.chosenClassName) {
                this.getCurrentClassName(this.classRoomService.chosenClassName);
                this.getAbsenceStudent(this.classRoomService.chosenClassName);
            }
        });

    }

    getCurrentClassName(name) {
        this.className = name;
    }

    getAbsenceStudent(className) {
        this.attendanceService.getAbsenceStudentList(className).subscribe(students => {
            this.studentList = students;
        });
    }
}
