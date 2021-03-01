import {Component, OnInit} from '@angular/core';
import {AttendanceService} from '../../services/attendance.service';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {LoadingController, ModalController} from '@ionic/angular';
import {ClassRoomService} from '../../services/class-room.service';
import {LoadingService} from '../../services/loading.service';
import {UserProfilePage} from '../user-profile/user-profile.page';


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

    DEFAULT_PROFILE_PICTURE = "/assets/image/dummy-avatar.png";

    loginUserID = null;
    loginUserName = '';
    profilePicture = null;
    accountType = 'Thường';
    appVersion = 'v2.11';

    userProfileModal = null;

    constructor(
        private classRoomService: ClassRoomService,
        private attendanceService: AttendanceService,
        private loginService: LoginService,
        private router: Router,
        private loadingService: LoadingService,
        private modalController: ModalController,
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
        this.getLoginProfilePicture()
        // this.profilePicture = this.classRoomService.isAdmin ?
        this.loginUserName = this.classRoomService.loginUserName;
        this.accountType = this.classRoomService.isAdmin ? 'Admin' : 'Thường';
    }

    getLoginProfilePicture() {
        if (!this.classRoomService.isAdmin) {
            this.attendanceService.wholeClass.subscribe(studentArr => {

                if (studentArr && studentArr.length > 0) {
                    for (let i = 0; i < studentArr.length; i++) {
                        if (studentArr[i]['studentId'] === this.classRoomService.loginUserID) {
                            this.profilePicture = studentArr[i]['profileImage'];
                            return;
                        }
                    }
                }

            })
        } else {
            this.profilePicture = this.DEFAULT_PROFILE_PICTURE;
            return;
        }

    }

    async presentProfileModal() {
        this.userProfileModal = await this.modalController.create({
            component: UserProfilePage,
            componentProps: {
                userName: this.loginUserName,
                accountType: this.accountType,
                profilePic: this.profilePicture,
            }
        });

        return await this.userProfileModal.present();
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
