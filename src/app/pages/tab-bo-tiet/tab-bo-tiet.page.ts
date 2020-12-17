import {Component, OnInit} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';

@Component({
  selector: 'app-tab-bo-tiet',
  templateUrl: 'tab-bo-tiet.page.html',
  styleUrls: ['tab-bo-tiet.page.scss']
})
export class TabBoTietPage implements OnInit{
  studentList = [];
  className = '';
  currentDate = new Date();

  constructor(private attendanceService: AttendanceService) {
  }

  ngOnInit(): void {
    this.getCurrentClassName();
    this.getLeftStudent();
  }

  getCurrentClassName() {
    if (this.attendanceService.currentClass) {
      this.className = this.attendanceService.currentClass;
    }
  }

  getLeftStudent() {
    this.attendanceService.getLeftStudentList().subscribe(students => {
      this.studentList = students;
    });
  }
}
