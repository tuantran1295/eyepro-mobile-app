import {Component, OnInit} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-tab-live-camera',
    templateUrl: 'tab-live-camera.page.html',
    styleUrls: ['tab-live-camera.page.scss']
})
export class TabLiveCameraPage implements OnInit{

    schoolName = '';
    className = '';
    totalStudent = 0;
    attendedNumber = 0;
    absenceNumber = 0;
    leftNumber = 0;
    currentDate = new Date();


    constructor(
        private attendanceService: AttendanceService,
        private loginService: LoginService,
        private router: Router,
        private loadingController: LoadingController,
    ) {
    }

    ngOnInit(): void {
        this.getSchoolName();
        this.getCurrentClassName();
        this.getTotalStudent();
        this.getAttendedNumber();
        this.getAbsenceNumber();
        this.getLeftNumber();
    }

    getSchoolName() {
        this.attendanceService.getCurrentArea().subscribe(schoolName => {
            this.schoolName += schoolName;
        });
    }

    getCurrentClassName() {
        if (this.attendanceService.currentClass) {
            this.className = this.attendanceService.currentClass;
        }
    }

    getTotalStudent() {
        this.attendanceService.getTotalStudent().subscribe(studentNo => {
            this.totalStudent = Number(studentNo);
        });
    }

    getAttendedNumber() {
        this.attendanceService.getAttendedStudentList().subscribe(students => {
            console.log("ATTENDED LENGTH: ");
            console.log(students);
            console.log(students.length);
            this.attendedNumber = students.length;
        })
    }

    getAbsenceNumber() {
        this.attendanceService.getAbsenceStudentList().subscribe((students) => {
            console.log("ABSENCE LENGTH: ");
            console.log(students);
            console.log(students.length);
            this.absenceNumber = students.length;
        });
    }

    getLeftNumber() {
        this.attendanceService.getLeftStudentList().subscribe((students) => {
            console.log("LEFT LENGTH: ");
            console.log(students);
            console.log(students.length);
            this.leftNumber = students.length;
        })
    }

    async logout() {
        const loading = await this.loadingController.create();
        await loading.present();
        this.loginService.logout().then(() => {
            loading.dismiss();
            this.router.navigateByUrl('/login', {replaceUrl: true});
        });
    }



}
