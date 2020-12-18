import {Component, OnInit} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';
import {ClassRoomService} from '../../services/class-room.service';

@Component({
    selector: 'app-tab-co-mat',
    templateUrl: 'tab-co-mat.page.html',
    styleUrls: ['tab-co-mat.page.scss']
})
export class TabCoMatPage implements OnInit {
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
                this.getAttendedStudent(className);
            }
        });
    }

    getCurrentClassName(name) {
        this.className = name;
    }

    getAttendedStudent(className) {
        this.attendanceService.getAttendedStudentList(className).subscribe(students => {
            this.studentList = students;
        });
    }

}
