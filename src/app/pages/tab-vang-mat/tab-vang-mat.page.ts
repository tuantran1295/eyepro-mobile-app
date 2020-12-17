import { Component } from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';

@Component({
  selector: 'app-tab-vang-mat',
  templateUrl: 'tab-vang-mat.page.html',
  styleUrls: ['tab-vang-mat.page.scss']
})
export class TabVangMatPage {
  studentList = [];
  className = '';
  currentDate = new Date();

  constructor(private attendanceService: AttendanceService) {
  }

  ngOnInit(): void {
    this.getCurrentClassName();
    this.getAbsenceStudent();
  }

  getCurrentClassName() {
    if (this.attendanceService.currentClass) {
      this.className = this.attendanceService.currentClass;
    }
  }

  getAbsenceStudent() {
    this.attendanceService.getAbsenceStudentList().subscribe(students => {
      this.studentList = students;
    });
  }
}
