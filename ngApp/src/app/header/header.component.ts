import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { LocalDataService } from '../services/local-data.service';

import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public isExternalAuth: boolean;
  public isUserAuthenticated: boolean;
 
  constructor(public localDataService: LocalDataService, public _authService: UserService, private _router: Router,
    private _socialAuthService: SocialAuthService) {
    this._authService.authChanged
      .subscribe(res => {
        this.isUserAuthenticated = res;
      })
  }

  // ok
  ngOnInit(): void {
    //////////// google rework
    this._authService.authChanged
      .subscribe(res => {
        this.isUserAuthenticated = res;
      })
    this._socialAuthService.authState.subscribe(user => {
      this.isExternalAuth = user != null;
    })
    //////////// google rework end //////////////

    this.localDataService.setUserName(localStorage.getItem('userName')); 
    this.localDataService.setMyRole(localStorage.getItem('myRole'));
  }

  // ok
  logout() {
    this._authService.doLogout();
    
    ///////////// google rework
    if (this.isExternalAuth)
      this._authService.signOutExternal();    
    ///////////// google rework end ///////////////
  }
}
