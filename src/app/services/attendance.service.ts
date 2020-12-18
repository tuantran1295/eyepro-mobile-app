import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, filter, map, switchMap, tap} from 'rxjs/operators';
import {ClassRoomService} from './class-room.service';

const ATTENDANCE_API_URL = 'http://27.71.228.53:9002/SmartClass/student/timekeeping-room/roomId/';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService implements OnInit {

    constructor(private http: HttpClient,
                private classRoomService: ClassRoomService) {

    }

    ngOnInit(): void {

    }


    public getSampleJSON(): Observable<any> {
        return this.http.get('/assets/json/b4-sample-response.json');
    }

    getClassAttendance(className): Observable<any> {
        const url = ATTENDANCE_API_URL + className;
        return this.http.get(url);
    }


    getTotalStudent(className): Observable<any> {
        const url = ATTENDANCE_API_URL + className;
        return this.http.get(url).pipe(
            switchMap(data => of(data['total'])),
            catchError(this.handleError('getTotalStudent'))
        );
    }

    getCurrentArea(className): Observable<any> {
        const url = ATTENDANCE_API_URL + className;
        return this.http.get(url).pipe(
            switchMap(data => of(data['data'][0].areaName)),
            catchError(this.handleError('getCurrentArea'))
        );
    }

    getAttendedStudentList(className): Observable<any> {
        const url = ATTENDANCE_API_URL + className;
        return this.http.get(url).pipe(
            switchMap(data => of(data['data'].filter(student => student['monitorState'] === 1))),
            catchError(this.handleError('getAttendedStudentList'))
        );
    }

    getLeftStudentList(className): Observable<any> {
        const url = ATTENDANCE_API_URL + className;
        return this.http.get(url).pipe(
            switchMap(data => of(data['data'].filter(student => student['monitorState'] === 2))),
            catchError(this.handleError('getLeftStudentList'))
        );
    }

    getAbsenceStudentList(className): Observable<any> {
        const url = ATTENDANCE_API_URL + className;
        return this.http.get(url).pipe(
            switchMap(data => of(data['data'].filter(student => student['monitorState'] === null))),
            catchError(this.handleError('getAbsenceStudentList'))
        );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }

}
