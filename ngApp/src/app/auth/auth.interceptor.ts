import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { LocalDataService } from '../services/local-data.service';
import {HeaderComponent} from '../header/header.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public localDataService: LocalDataService, private router: Router, private userService: UserService)
    {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        /*
        const token = this.userService.getToken();        
        req = req.clone({
            setHeaders: {
                Authorization: "Bearer " + token
            }
        });
        console.log('interceptor...'+token);
        return next.handle(req);
        */

        
        if (localStorage.getItem('token') != null) {
            const clonedReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
            });
            return next.handle(clonedReq).pipe(
                tap(
                    succ => { 
                        // console.log('interceptor...' + localStorage.getItem('token')); 
                    },
                    err => {
                        if (err.status == 401) {
                            console.log('Auth Guard monitors...token expired...');
                            this.localDataService.setUserName('');
                            localStorage.removeItem('token');
                            localStorage.removeItem('userName');
                            this.userService.doLogout();                            
                            this.router.navigateByUrl('/signin');
                        }
                        //// role
                        else if (err.status == 403){
                            // not authorise
                            // redirect to home page
                            console.log('Auth Guard monitors...403-Un-Authorized...');
                            this.router.navigateByUrl('/home');
                        }
                    }
                )
            )
        }        
        else{            
            return next.handle(req.clone());
        }
    }
}