import {Component, OnInit} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';
import {ClassRoomService} from '../../services/class-room.service';

@Component({
    selector: 'app-tab-bo-tiet',
    templateUrl: 'tab-bo-tiet.page.html',
    styleUrls: ['tab-bo-tiet.page.scss']
})
export class TabBoTietPage implements OnInit {
    studentList = [];
    className = '';
    currentDate = new Date();

    constructor(
        private classRoomService: ClassRoomService,
        private attendanceService: AttendanceService) {
    }

    ngOnInit(): void {
        this.classRoomService.chosenClassRoom.subscribe((className) => {
            if (className) {
                this.getCurrentClassName(className);
                this.getLeftStudent(className);
            }
        });

    }

    getCurrentClassName(name) {
        this.className = name;
    }

    getLeftStudent(className) {
        this.attendanceService.getLeftStudentList(className).subscribe(students => {
            this.studentList = students;
        });
    }
}
