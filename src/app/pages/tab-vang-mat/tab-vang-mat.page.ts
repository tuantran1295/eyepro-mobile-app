import {Component} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';
import {ClassRoomService} from '../../services/class-room.service';

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
        private classRoomService: ClassRoomService
        ) {
    }

    ngOnInit(): void {
        this.classRoomService.chosenClassRoom.subscribe((className) => {
            if (className) {
                this.getCurrentClassName(className);
                this.getAbsenceStudent(className);
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
