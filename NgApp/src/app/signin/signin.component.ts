import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

import { LocalDataService } from '../services/local-data.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { ExternalAuthDto } from '../models/ExternalAuthDto';

import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Validation from '../services/validation';


@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {

  responseColor = '';
  errors: string[];

  form: FormGroup = new FormGroup({
    UserName: new FormControl(''),
    Password: new FormControl(''),
  });
  submitted = false;
  signinModel = {
    UserName: '',
    Password: ''
  };

  // ok
  constructor(
    private formBuilder: FormBuilder,
    public userService: UserService,
    public router: Router,
    public localDataService: LocalDataService,
    public socialAuthService: SocialAuthService
  ) { }

  // ok
  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        UserName: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ]
        ],
        Password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],      
      },     
    );

    if (this.userService.isLoggedIn) {
      // already logged in, so return to home page
      this.router.navigate(['/home']);
    }
    else {
      // not logged in yet
    }
    this.localDataService.setLoginMessage('');
  }
 
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // ok
  // local database sign in
  onSubmit(): void {
    this.responseColor = '';
    this.errors = [];  

    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    // console.log(JSON.stringify(this.form.value, null, 2));
      var userTokenData = {
        UserName: '',
        Token: '',
        LoginTime: '',
        ResponseCode: 0,
        ResponseMessage: '',       
        MyRole: ''
      }
      
      // check for ModelState @api
      // this.signinModel.UserName = null;
      this.signinModel.UserName = this.form.value["UserName"];
      this.signinModel.Password = this.form.value["Password"];

      this.userService.signin(this.signinModel).subscribe(
        (res: any) => { 
          console.log(res);
          // Success 
          // 200
          if (res.response.status === '200') {

            this.onReset();
            this.responseColor = 'green';
            this.localDataService.setLoginMessage(res.response.message);

            //// get role info
            console.log('my role : '+res.myRole);
            let jwtData = res.token.split('.')[1];
            let decodedJwtJsonData = window.atob(jwtData);
            let decodedJwtData = JSON.parse(decodedJwtJsonData);
            console.log('jwtData: ' + jwtData);
            console.log('decodedJwtJsonData: ' + decodedJwtJsonData);
            console.log('decodedJwtData: ' + decodedJwtData);
            //// get role info // end

            userTokenData.Token = res.token;
            userTokenData.ResponseMessage = res.response.message;
            userTokenData.UserName = res.userName;
            
            //// add role info
            userTokenData.MyRole = res.myRole;

            localStorage.setItem('token', userTokenData.Token);
            localStorage.setItem('userName', userTokenData.UserName);
            
            //// store role info
            localStorage.setItem('myRole', userTokenData.MyRole);           

            this.localDataService.setUserName(userTokenData.UserName);            
            
            //// store role info
            this.localDataService.setMyRole(userTokenData.MyRole);
            
            //// store Student - role login info
            if (userTokenData.MyRole == 'Student') {
              localStorage.setItem('studentId', res.studentId);
              localStorage.setItem('firstName', res.firstName);
              localStorage.setItem('lastName', res.lastName);
            }
            else {
              // do nothing
              // role - Admin
            }

            // redirect to home page
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 5000);
          }
          // 401,500
          else {
            this.responseColor = 'red';
            // fail
            this.localDataService.setLoginMessage(res.response.message);
            this.localDataService.setUserName('');
            
            //// reset role
            //// remove role
            this.localDataService.setMyRole('');
          }
        },
        error => { 
          this.responseColor = 'red';
          // 400
          // ModelState @api
          if (error.status === 400) {   
            this.errors = this.localDataService.display400andEx(error, 'Login');      
          }
          // 500
          else{
            console.log(error);
          }
        }
      );     
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
    this.responseColor = '';
    this.errors = [];    
    this.localDataService.setLoginMessage("");
  }


  //////////// google rework
  // ok
  public GoogleSignIn = () => {
    this.userService.signInWithGoogle()
      .then(res => {
        const user: SocialUser = { ...res };
        // console.log(user);
        const externalAuth: ExternalAuthDto = {
          provider: user.provider,
          idToken: user.idToken
        }
        this.validateExternalAuth(externalAuth);
      }, error => console.log(error))
  }
  // ok
  private validateExternalAuth(externalAuth: ExternalAuthDto) {

    this.responseColor = '';
    this.errors = []; 

    this.userService.ExternalLogin('/ExternalLogin', externalAuth)
      .subscribe(res => {

        if (res.token) {
          this.onReset();
          this.responseColor = 'green';
          
          // success
          localStorage.setItem("token", res.token);
          localStorage.setItem("userName", res.userName);
          this.localDataService.setUserName(res.userName);
          this.localDataService.setLoginMessage(res.errorMessage);
          //// get role info
          console.log('my role : ' + res.myRole);  
          //// store role info
          localStorage.setItem('myRole', res.myRole);
          //// store role info
          this.localDataService.setMyRole(res.myRole);

          // redirect to home page
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 5000);
        }
        else {
          this.responseColor = 'red';
          // error
          this.localDataService.setLoginMessage(res.errorMessage);
          this.localDataService.setUserName('');

          //// reset role
          //// remove role
          this.localDataService.setMyRole('');
        }    
      },
        error => {
          this.responseColor = 'red';
          this.userService.signOutExternal();
        });
  }
  /////////////// google rework end ///////////////
}