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

  form: FormGroup = new FormGroup({
    UserName: new FormControl(''),
    Password: new FormControl(''),
  });
  submitted = false;

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
    this.localDataService.setLoginError('');
  }
 
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // ok
  // local database sign in
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    console.log(JSON.stringify(this.form.value, null, 2));

  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}