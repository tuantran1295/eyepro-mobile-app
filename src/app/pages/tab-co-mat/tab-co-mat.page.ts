import {Component, OnInit} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';

@Component({
    selector: 'app-tab-co-mat',
    templateUrl: 'tab-co-mat.page.html',
    styleUrls: ['tab-co-mat.page.scss']
})
export class TabCoMatPage implements OnInit {
    studentList = [];
    className = '';
    currentDate = new Date();

    constructor(private attendanceService: AttendanceService) {
    }

    ngOnInit(): void {
        this.getCurrentClassName();
        this.getAttendedStudent();
    }

    getCurrentClassName() {
        if (this.attendanceService.currentClass) {
            this.className = this.attendanceService.currentClass;
        }
    }

    getAttendedStudent() {
        this.attendanceService.getAttendedStudentList().subscribe(students => {
            this.studentList = students;
        });
    }

}
