import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalDataService } from './local-data.service';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { ExternalAuthDto } from '../models/ExternalAuthDto';
import { AuthResponseDto } from '../models/AuthResponseDto';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public API = 'https://localhost:44354/api';
  public AUTHENTICATE_API = `${this.API}/Authenticate`;

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router,
    private localDataService: LocalDataService,
    private _externalAuthService: SocialAuthService
  ) {
  }

  // ok
  // Sign-in
  signin(signinModel): Observable<any> {
    return this.http.post(this.AUTHENTICATE_API + '/login', signinModel)
  } 

  // ok
  getToken() {
    return localStorage.getItem('token');
  }

  // ok
  getMyRole() {
    return localStorage.getItem('myRole');
  }

  // ok
  get isLoggedIn(): boolean {   
    let authToken = localStorage.getItem('token');
    return (authToken !== null) ? true : false;
  }

  // ok
  get isAdmin(): boolean {
    let myRole = localStorage.getItem('myRole');
    return (myRole == 'Admin') ? true : false;
  }

  // ok
  doLogout() {
    let removeToken = localStorage.removeItem('token');
    let removeUserName = localStorage.removeItem('userName');
    let removeLoginError = localStorage.removeItem('loginError');
    let removeMyRole = localStorage.removeItem('myRole');

    let removeStudentId = localStorage.removeItem('studentId');
    let removeFirstName = localStorage.removeItem('firstName');
    let removeLastName = localStorage.removeItem('lastName');

    this.localDataService.setLoginError('');
    this.localDataService.setUserName('');
    this.localDataService.setMyRole('');

    if (removeToken == null) {
      this.router.navigate(['/home']);
    }
  }

  // ok
  // register
  register(registerModel, MyRole): Observable<any> {
    return this.http.post(this.AUTHENTICATE_API + '/register/'+MyRole, registerModel)
  }

  // ok
  /////////////// google rework 
  private _authChangeSub = new Subject<boolean>()
  public authChanged = this._authChangeSub.asObservable();
  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this._authChangeSub.next(isAuthenticated);
  }
  public signInWithGoogle = () => {
    return this._externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  public signOutExternal = () => {
    this._externalAuthService.signOut();
  }
  public ExternalLogin = (route: string, body: ExternalAuthDto) => {
    return this.http.post<AuthResponseDto>(this.AUTHENTICATE_API + route, body);
  } 
  /////////////// google rework end ///////////////

  
}
