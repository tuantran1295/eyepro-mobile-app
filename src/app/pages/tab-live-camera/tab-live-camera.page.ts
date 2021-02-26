import {Component, OnInit} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {ClassRoomService} from '../../services/class-room.service';
import {LoadingService} from '../../services/loading.service';

@Component({
    selector: 'app-tab-live-camera',
    templateUrl: 'tab-live-camera.page.html',
    styleUrls: ['tab-live-camera.page.scss']
})
export class TabLiveCameraPage implements OnInit {

    schoolName = '';
    className = '';
    totalStudent = 0;
    attendedNumber = 0;
    absenceNumber = 0;
    leftNumber = 0;
    currentDate = new Date();
    loading = null;

    loginUserName = '';
    accountType = 'Thường';
    appVersion = 'v2.11'

    constructor(
        private classRoomService: ClassRoomService,
        private attendanceService: AttendanceService,
        private loginService: LoginService,
        private router: Router,
        private loadingService: LoadingService,
    ) {
    }

    async ngOnInit() {
        // this.loadingService.presentLoading();
        this.resetPageData();
        this.classRoomService.chosenClassRoom.subscribe((className) => {

            if (className) {
                // console.log('Chosen CLASS NAME: ');
                // console.log(className);
                this.getUserInfo();
                this.getSchoolName();
                this.getCurrentClassName(className);
                this.getTotalStudent();
                this.getAttendedNumber();
                this.getAbsenceNumber();
                this.getLeftNumber();
            }
        });

    }

    getSchoolName() {
        this.attendanceService.areaName.subscribe(schoolName => {
            // console.log('LIVE CAMERA AREA NAME: ');
            // console.log(schoolName);
            if (schoolName) {
                this.schoolName = schoolName;
            }
        });
    }

    getCurrentClassName(name) {
        this.className = name;
    }

    getTotalStudent() {
        this.attendanceService.totalStudent.subscribe(studentNo => {
            if (studentNo) {
                this.totalStudent = Number(studentNo);
            }
        });
    }

    getAttendedNumber() {
        this.attendanceService.attended.subscribe(students => {
            // console.log('ATTENDED LENGTH: ');
            // console.log(students);

            if (students) {
                // console.log(students.length);
                this.attendedNumber = students.length;
            }

        });
    }

    getAbsenceNumber() {
        this.attendanceService.absence.subscribe((students) => {
            // console.log('ABSENCE LENGTH: ');
            // console.log(students);

            if (students) {
                // console.log(students.length);
                this.absenceNumber = students.length;
            }

        });
    }

    getLeftNumber() {
        this.attendanceService.left.subscribe((students) => {
            // console.log('LEFT LENGTH: ');
            // console.log(students);

            this.loadingService.dismissLoading();
            if (students) {
                // console.log(students.length);
                this.leftNumber = students.length;
            }
        });
    }

    getUserInfo() {
        this.loginUserName = this.classRoomService.loginUserName;
        this.accountType = this.classRoomService.isAdmin ? 'Admin' : 'Thường';
    }

    async logout() {
        // this.loadingService.presentLoading();
        this.loginService.logout().then(() => {
            this.loadingService.dismissLoading();
            this.router.navigateByUrl('/login', {replaceUrl: true});
        });
    }

    resetPageData() {
        this.schoolName = '';
        this.className = '';
        this.totalStudent = 0;
        this.attendedNumber = 0;
        this.absenceNumber = 0;
        this.leftNumber = 0;
        this.currentDate = new Date();
    }
}
