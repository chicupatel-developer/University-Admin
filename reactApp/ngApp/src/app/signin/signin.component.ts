import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { ExternalAuthDto } from '../models/ExternalAuthDto';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  submitted = false;

  signinModel = {
    UserName: '',
    Password: ''
  };

  // ok
  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    public router: Router,
    public localDataService: LocalDataService,
    public socialAuthService: SocialAuthService
  ) { }

  // ok
  ngOnInit() {

    this.signinForm = this.fb.group({
      UserName: ['', Validators.required],
      Password: ['', Validators.required]
    })


    if (this.userService.isLoggedIn) {
      // already logged in, so return to home page
      this.router.navigate(['/home']);
    }
    else {
      // not logged in yet
    }

    this.localDataService.setLoginError('');
  }
 
  // ok
  get signinFormControl() {
    return this.signinForm.controls;
  }

  // ok
  // local database sign in
  onSubmit(): void {
    this.submitted = true;
    if (this.signinForm.valid) {

      var userTokenData = {
        UserName: '',
        Token: '',
        LoginTime: '',
        ResponseCode: 0,
        ResponseMessage: ''
      }
      
      this.signinModel.UserName = this.signinForm.value["UserName"];
      this.signinModel.Password = this.signinForm.value["Password"];

      this.userService.signin(this.signinModel).subscribe(
        (res: any) => { 
          // Success     
          if (res.response.status == '200') {
            userTokenData.Token = res.token;
            userTokenData.ResponseMessage = res.response.message;
            userTokenData.UserName = res.userName;

            localStorage.setItem('token', userTokenData.Token);
            localStorage.setItem('userName', userTokenData.UserName);

            this.localDataService.setUserName(userTokenData.UserName);
            this.localDataService.setLoginError(res.response.message);

            // redirect to home page
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 5000);
          }
          else {
            this.localDataService.setLoginError(res.response.message);
            this.localDataService.setUserName('');
          }
        },
        msg => {
          
        }
      );      
    }
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
    this.userService.ExternalLogin('/ExternalLogin', externalAuth)
      .subscribe(res => {

        if(res.token){
          // success
          localStorage.setItem("token", res.token);
          localStorage.setItem("userName", res.userName);
          this.localDataService.setUserName(res.userName);

          this.localDataService.setLoginError(res.errorMessage);

          // redirect to home page
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 5000);
        }
        else{
          // error
          this.localDataService.setLoginError(res.errorMessage);
          this.localDataService.setUserName('');
        }
    
      },
        error => {
          this.userService.signOutExternal();
        });
  }
  /////////////// google rework end ///////////////


}

