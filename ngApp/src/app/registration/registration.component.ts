import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidationService } from '../services/custom-validation.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { LocalDataService } from '../services/local-data.service';
import { DataService } from '../services/data.service';
import Student from '../models/student';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  students: Array<Student>;

  // controlls visibility of student select list
  showStudentList = false;

  registerModel = {
    UserName: '',
    FullName: '',
    Email: '',
    Password: '',
    StudentId: 0
  };

  constructor(
    private fb: FormBuilder,
    public customValidator: CustomValidationService,
    public userService: UserService,
    public router: Router,
    public localDataService: LocalDataService,
    public dataService: DataService
  ) { }

  // ok
  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required], this.customValidator.userNameValidator.bind(this.customValidator)],
      password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
      confirmPassword: ['', [Validators.required]],
      MyRole: ['', [Validators.required]],
      studentId: ['', [Validators.required]]
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

    // to ignore validation for studentId select list
    if(this.showStudentList==false){      
      this.registerForm.patchValue({
        studentId: 0
      });
    }

    this.submitted = true;

    if (this.registerForm.valid) {

      this.registerModel.FullName = this.registerForm.value["name"];
      this.registerModel.UserName = this.registerForm.value["username"];
      this.registerModel.Email = this.registerForm.value["email"];
      this.registerModel.Password = this.registerForm.value["password"];
      var MyRole = this.registerForm.value["MyRole"];
      this.registerModel.StudentId = Number(this.registerForm.value["studentId"]);
      
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

  // ok
  // when role is changed from select list
  changeRole(e) {
    // console.log(e.target.value);
    // if role is Student then load student select list
    // else return
    if(e.target.value=='Student'){
      // loading student select list
      console.log('loading student list...');
      this.showStudentList = true;
      this.loadStds();
    }
    else{
      this.showStudentList = false;
      return;
    }
  }
  // ok
  loadStds() {
    this.dataService.getStudentsNotLinkedToApplicationUser()
      .subscribe(
        data => {
          // console.log(data);
          this.students = data;
        },
        error => {
          console.log(error);
        });
  }
}

