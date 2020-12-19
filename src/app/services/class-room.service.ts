import {Injectable} from '@angular/core';
import {ClassRoom} from '../models/ClassRoom';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Plugins} from '@capacitor/core';
import {LOGIN_TOKEN_KEY} from './login.service';

const {Storage} = Plugins;

export const CHOSEN_CLASSROOM_KEY = 'chosen-class-room';
export const GET_CLASSROOM_URL = '';

@Injectable({
    providedIn: 'root'
})
export class ClassRoomService {
    chosenClassRoom: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    chosenClassName: string = '';

    constructor(
        private http: HttpClient,
    ) {
    }

    getClassList(): Observable<any> {
        return this.http.get(GET_CLASSROOM_URL).pipe(
            map(data => data['data'])
        );
    }

    chooseClass(className: string): Observable<any> {
        this.chosenClassName = className;
        this.chosenClassRoom.next(className);
        return from(Storage.set({key: CHOSEN_CLASSROOM_KEY, value: className}));
    }

    async loadChosenClassRoom() {
        const chosenClass = await Storage.get({key: CHOSEN_CLASSROOM_KEY});
        if (chosenClass && chosenClass.value) {
            console.log('LOADED Chosen class: ', chosenClass.value);
            this.chosenClassName = chosenClass.value;
            this.chosenClassRoom.next(chosenClass.value);
        } else {
            this.chosenClassRoom.next('');
        }
    }
}