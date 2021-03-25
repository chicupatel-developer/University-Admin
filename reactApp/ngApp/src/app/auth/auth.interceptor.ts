import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private userService: UserService) 
    {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        const token = this.userService.getToken();
        
        req = req.clone({
            setHeaders: {
                Authorization: "Bearer " + token
            }
        });
        console.log('interceptor...'+token);
        return next.handle(req);



        /*
        if (localStorage.getItem('token') != null) {
            const clonedReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token.Token'))
            });
            return next.handle(clonedReq).pipe(
                tap(
                    succ => { },
                    err => {
                        if (err.status == 401) {
                            localStorage.removeItem('token');
                            this.router.navigateByUrl('/signin');
                        }
                    }
                )
            )
        }
        
        else
            return next.handle(req.clone());
        */
    }
}