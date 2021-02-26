import {Injectable} from '@angular/core';
import {ClassRoom} from '../models/ClassRoom';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Plugins} from '@capacitor/core';
import {LOGIN_TOKEN_KEY} from './login.service';
import {environment} from '../../environments/environment';

const {Storage} = Plugins;

export const CHOSEN_CLASSROOM_KEY = 'chosen-class-room';


// export const GET_CLASSROOM_URL = 'http://27.71.228.53:9002/SmartClass/room/list/1?textSearch';

@Injectable({
    providedIn: 'root'
})
export class ClassRoomService {
    getClassRoomURL = environment.rootURL + 'room/list/1?textSearch';
    chosenClassRoom: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    isAdmin = false;
    loginUserID = null;
    loginUserName = null;

    constructor(
        private http: HttpClient,
    ) {
    }

    getClassList(): Observable<any> {
        this.getClassRoomURL = environment.rootURL + 'room/list/1?textSearch';
        return this.http.get(this.getClassRoomURL).pipe(
            map(data => data['data'])
        );
    }

    chooseClass(className: string): Observable<any> {
        this.checkUserRole(className).then(() => {
            this.chosenClassRoom.next(className);
        })
        return from(Storage.set({key: CHOSEN_CLASSROOM_KEY, value: className}));
    }

    async loadChosenClassRoom() {
        const chosenClass = await Storage.get({key: CHOSEN_CLASSROOM_KEY});
        if (chosenClass && chosenClass.value) {
            console.log('LOADED Chosen class: ', chosenClass.value);
            this.checkUserRole(chosenClass.value).then(() => {
                this.chosenClassRoom.next(chosenClass.value);
            })
        } else {
            this.chosenClassRoom.next('');
        }
    }

    async checkUserRole(chosenClassRoom) {
        const token = await Storage.get({key: LOGIN_TOKEN_KEY}); // thuoc tinh loginToken duoc dung de luu username dang nhap
        if (token && token.value) {
             this.loginUserName = token.value;
            // Account admin co dang admin, ten lop, ten phong vd: P101 P102 P103
            if (this.loginUserName === 'admin' || this.loginUserName === 'vdsmart'
                || this.loginUserName.toUpperCase() === chosenClassRoom
                || this.isClassAccount(this.loginUserName)) {
                this.isAdmin = true;
                return of(null);
            } else { // Account nguoi dung co dang 20211002_hoa 20211000_hung
                this.loginUserID = this.loginUserName.split('_')[0];
                this.isAdmin = false;
                return of(this.loginUserID);
            }
        }
    }

    isClassAccount(username) { // Account nhan notification tu ca lop
        const classRegex = new RegExp('^P[0-9][0-9][0-9]$'); // account lop co dang P101 P102 PXXX
        return classRegex.test(username);
    }
}
