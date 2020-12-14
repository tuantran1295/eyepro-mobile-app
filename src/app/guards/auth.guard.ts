import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from '../services/login.service';
import {filter, map, take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {

    constructor(
        private loginService: LoginService,
        private router: Router
    ) {
    }

    canLoad(): Observable<boolean> {
        return this.loginService.isAuthenticated.pipe(
            filter(value => value !== null), // filter out initial behaviour subject value
            take(1),
            map(isAuthenticated => {
                if (isAuthenticated) {
                    return true;
                } else {
                    this.router.navigateByUrl('/login');
                    return false;
                }
            })
        );
    }


}
