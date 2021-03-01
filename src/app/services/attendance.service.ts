import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, filter, map, switchMap, tap} from 'rxjs/operators';
import {ClassRoomService} from './class-room.service';
import {environment} from '../../environments/environment';


// const ATTENDANCE_API_URL = 'http://27.71.228.53:9002/SmartClass/student/timekeeping-room/roomId/';


@Injectable({
    providedIn: 'root'
})
export class AttendanceService implements OnInit {
    attendanceURL = environment.rootURL + 'student/timekeeping-room/roomId/';

    wholeClass: BehaviorSubject<[]> = new BehaviorSubject<[]>(null);
    attended: BehaviorSubject<[]> = new BehaviorSubject<[]>(null);
    absence: BehaviorSubject<[]> = new BehaviorSubject<[]>(null);
    left: BehaviorSubject<[]> = new BehaviorSubject<[]>(null);
    areaName: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    totalStudent: BehaviorSubject<number> = new BehaviorSubject<number>(null);

    constructor(
        private http: HttpClient,
    ) {}

    ngOnInit(): void {

    }

    async getClassAttendance(className) {
        this.attendanceURL = environment.rootURL + 'student/timekeeping-room/roomId/';
        const url = this.attendanceURL + className;
        console.log()
        const students = await this.http.get(url).toPromise();
        if (students) {
            console.log("AttendanceService Student");
            console.log(students);
            const studentList: [] = students['data'];
            console.log("AttendanceService ATTENDED LIST:");
            console.log(studentList);
            console.log(studentList !== null)

            if (studentList !== null) {
                this.wholeClass.next(studentList);
                const attendedStudent = studentList.filter(student => student['monitorState'] === 1);
                console.log("AttendanceService getClassAttendance:")
                console.log(attendedStudent);
                // @ts-ignore
                this.attended.next(attendedStudent);
                const absenceStudent = studentList.filter(student => student['monitorState'] === null);
                console.log("AttendanceService absence:");
                console.log(absenceStudent);
                console.log("LENGTH: ");
                console.log(absenceStudent.length);
                // @ts-ignore
                this.absence.next(absenceStudent);
                const leftStudent = studentList.filter(student => student['monitorState'] === 2);
                // @ts-ignore
                this.left.next(leftStudent);
                const totalStudent = studentList.length;
                this.totalStudent.next(totalStudent);
                // @ts-ignore
                const schoolName = studentList[0].areaName;
                this.areaName.next(schoolName);
                return true;
            } else { // khong co ca hoc, show thong bao khong co ca hoc src/app/pages/tabs/tabs.page.ts
                return false;
            }
        }
    }


    // getTotalStudent(className): Observable<any> {
    //     const url = ATTENDANCE_API_URL + className;
    //     return this.http.get(url).pipe(
    //         switchMap(data => {
    //             console.log('getTotalStudent DATA: ');
    //             console.log(data);
    //             if (data['data']) {
    //                 return of(data['total']);
    //             } else {
    //                 return of(0);
    //             }
    //         }),
    //         catchError(this.handleError('getTotalStudent'))
    //     );
    // }
    //
    // getCurrentArea(className): Observable<any> {
    //     const url = ATTENDANCE_API_URL + className;
    //     return this.http.get(url).pipe(
    //         switchMap(data => {
    //             if (data['data']) {
    //                 return of(data['data'][0].areaName);
    //             } else {
    //                 return of('Học viện chính trị Quốc gia HCM Khu vực 1');
    //             }
    //         }),
    //         catchError(this.handleError('getCurrentArea'))
    //     );
    // }
    //
    // getAttendedStudentList(className): Observable<any> {
    //     const url = ATTENDANCE_API_URL + className;
    //     return this.http.get(url).pipe(
    //         switchMap(data => {
    //             console.log('getAttendedStudentList DATA: ');
    //             console.log(data);
    //             if (data['data']) {
    //                 return of(data['data'].filter(student => student['monitorState'] === 1));
    //             } else {
    //                 return of(null);
    //             }
    //         }),
    //         catchError(this.handleError('getAttendedStudentList'))
    //     );
    // }
    //
    // getLeftStudentList(className): Observable<any> {
    //     const url = ATTENDANCE_API_URL + className;
    //     return this.http.get(url).pipe(
    //         switchMap(data => {
    //             if (data['data']) {
    //                 return of(data['data'].filter(student => student['monitorState'] === 2));
    //             } else {
    //                 return of(null);
    //             }
    //         }),
    //         catchError(this.handleError('getLeftStudentList'))
    //     );
    // }
    //
    // getAbsenceStudentList(className): Observable<any> {
    //     const url = ATTENDANCE_API_URL + className;
    //     return this.http.get(url).pipe(
    //         switchMap(data => {
    //             if (data['data']) {
    //                 return of(data['data'].filter(student => student['monitorState'] === null));
    //             } else {
    //                 return of(null);
    //             }
    //         }),
    //         catchError(this.handleError('getAbsenceStudentList'))
    //     );
    // }
    //
    // private handleError<T>(operation = 'operation', result?: T) {
    //     return (error: any): Observable<T> => {
    //         console.error(error);
    //         return of(result as T);
    //     };
    // }

}
