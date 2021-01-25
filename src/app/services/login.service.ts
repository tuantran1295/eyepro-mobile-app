import {Injectable} from '@angular/core';
import {Plugins} from '@capacitor/core';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';

const {Storage} = Plugins;

export const LOGIN_TOKEN_KEY = 'login-token';

// export const LOGIN_URL = 'http://27.71.228.53:9002/SmartClass/auth/signin';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    loginURL = environment.rootURL + 'auth/signin';
    isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    loginToken = '';

    constructor(private http: HttpClient) {
        this.loadLoginToken();
    }

    async loadLoginToken() {
        const token = await Storage.get({key: LOGIN_TOKEN_KEY});
        if (token && token.value) {
            console.log('Login Token: ', token.value);
            this.loginToken = token.value;
            this.isAuthenticated.next(true);
        } else {
            this.isAuthenticated.next(false);
        }
    }

    //: Observable<any>
    login(credentials: { username, password }): Observable<any> {
        this.loginURL = environment.rootURL + 'auth/signin';
        return this.http.post(this.loginURL, credentials).pipe(
            map((data: any) => data.data.token),
            switchMap((token) => {
                console.log('LOGIN TOKEN: ');
                console.log(token);
                return from(Storage.set({key: LOGIN_TOKEN_KEY, value: token}));
            }),
            tap(_ => {
                this.isAuthenticated.next(true);
            })
        );
    }

    logout(): Promise<void> {
        this.isAuthenticated.next(false);
        return Storage.remove({key: LOGIN_TOKEN_KEY});
    }
}
