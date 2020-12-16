import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, filter, map, switchMap, tap} from 'rxjs/operators';

export const ATTENDANCE_URL = 'http://27.71.228.53:9002/SmartClass/student/timekeeping-room/roomId/';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService implements OnInit {
    currentClass = 'B4';
    SAMPLE_CLASS_URL = ATTENDANCE_URL + this.currentClass;

    constructor(private http: HttpClient) {

    }

    ngOnInit(): void {

    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }

    public getSampleJSON(): Observable<any> {
        return this.http.get('/assets/json/b4-sample-response.json');
    }

    getTotalStudent(): Observable<any> {
        return this.getSampleJSON().pipe(
            switchMap(data => of(data.total)),
        );

    }

    getCurrentArea(): Observable<any> {
        return this.getSampleJSON().pipe(
            switchMap(data => of(data.data[0].areaName)),
        );
    }

    getAttendedStudentList(): Observable<any> {
        return this.getSampleJSON().pipe(
            switchMap(data => of(data.data.filter(student => student['monitorState'] === 1)))
        );

    }

    getLeftStudentList(): Observable<any> {
        return this.getSampleJSON().pipe(
            switchMap(data => of(data.data.filter(student => student['monitorState'] === 2)))
        );

    }

    getAbsenceStudentList(): Observable<any> {
        return this.getSampleJSON().pipe(
            switchMap(data => of(data.data.filter(student => student['monitorState'] === null)))
        );
    }

}
