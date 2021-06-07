import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidationService } from '../services/custom-validation.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { LocalDataService } from '../services/local-data.service';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  registerModel = {
    UserName: '',
    FullName: '',
    Email: '',
    Password: '',
  };

  constructor(
    private fb: FormBuilder,
    public customValidator: CustomValidationService,
    public userService: UserService,
    public router: Router,
    public localDataService: LocalDataService
  ) { }

  // ok
  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required], this.customValidator.userNameValidator.bind(this.customValidator)],
      password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
      confirmPassword: ['', [Validators.required]],
      MyRole: ['', [Validators.required]]
    },
      {
        validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
      }
    );

    
    if (this.userService.isLoggedIn) {
      // already logged in, so return to home page
      this.router.navigate(['/home']);
    }
    else {
      // not logged in yet
    }
    this.localDataService.setRegisterMessage('');
  }

  // ok
  get registerFormControl() {
    return this.registerForm.controls;
  }

  // ok
  // new user registration
  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.valid) {

      this.registerModel.FullName = this.registerForm.value["name"];
      this.registerModel.UserName = this.registerForm.value["username"];
      this.registerModel.Email = this.registerForm.value["email"];
      this.registerModel.Password = this.registerForm.value["password"];
      var MyRole = this.registerForm.value["MyRole"];
      
      this.userService.register(this.registerModel, MyRole).subscribe(
        res => {
          console.log(res);
          if (res.responseCode == 0) {
            // success
            this.localDataService.setRegisterMessage(res.responseMessage);

            this.resetRegistration();

            // redirect to login page
            setTimeout(() => {
              this.router.navigate(['/signin']);
            }, 5000); 
          }
          else {
            // fail
            this.localDataService.setRegisterMessage(res.responseMessage);
          }
        },
        error => {
          // fail
          // 500
          this.localDataService.setRegisterMessage(error.error.message);
        }
      );
    }
   
  }

  // ok
  resetRegistration() {
    this.registerForm.reset();
    this.submitted = false;
  }

  // ok
  public handleError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }
}

