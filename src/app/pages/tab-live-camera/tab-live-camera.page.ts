import {Component, OnInit} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {ClassRoomService} from '../../services/class-room.service';

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


    constructor(
        private classRoomService: ClassRoomService,
        private attendanceService: AttendanceService,
        private loginService: LoginService,
        private router: Router,
        private loadingController: LoadingController,
    ) {
    }

    ngOnInit(): void {
        this.classRoomService.chosenClassRoom.subscribe((className) => {
            if (className) {
                console.log('Chosen CLASS NAME: ');
                console.log(className);
                this.getSchoolName(className);
                this.getCurrentClassName(className);
                this.getTotalStudent(className);
                this.getAttendedNumber(className);
                this.getAbsenceNumber(className);
                this.getLeftNumber(className);
            }
        });

    }

    getSchoolName(className) {
        this.attendanceService.getCurrentArea(className).subscribe(schoolName => {
            this.schoolName += schoolName;
        });
    }

    getCurrentClassName(name) {
        this.className = name;
    }

    getTotalStudent(className) {
        this.attendanceService.getTotalStudent(className).subscribe(studentNo => {
            this.totalStudent = Number(studentNo);
        });
    }

    getAttendedNumber(className) {
        this.attendanceService.getAttendedStudentList(className).subscribe(students => {
            console.log('ATTENDED LENGTH: ');
            console.log(students);
            console.log(students.length);
            this.attendedNumber = students.length;
        });
    }

    getAbsenceNumber(className) {
        this.attendanceService.getAbsenceStudentList(className).subscribe((students) => {
            console.log('ABSENCE LENGTH: ');
            console.log(students);
            console.log(students.length);
            this.absenceNumber = students.length;
        });
    }

    getLeftNumber(className) {
        this.attendanceService.getLeftStudentList(className).subscribe((students) => {
            console.log('LEFT LENGTH: ');
            console.log(students);
            console.log(students.length);
            this.leftNumber = students.length;
        });
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
