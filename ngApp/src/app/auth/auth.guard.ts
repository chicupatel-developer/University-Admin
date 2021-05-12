import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {


    constructor(private router: Router) {
    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (localStorage.getItem('token') != null)
        {
            const expiry = (JSON.parse(atob(localStorage.getItem('token').split('.')[1]))).exp;
            if ((Math.floor((new Date).getTime() / 1000)) >= expiry) {                
                this.router.navigate(['/signin']);
                return false;
            }
            else {
                return true;
            }
        }            
        else {
            this.router.navigate(['/signin']);
            return false;
        }

    }
}
