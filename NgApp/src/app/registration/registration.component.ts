import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Student from '../models/student';
import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';
import { UserService } from '../services/user.service';
import Validation from '../services/validation';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  responseColor = '';
  errors: string[];
  
   form: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    acceptTerms: new FormControl(false),
  });
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
    private formBuilder: FormBuilder,
    public userService: UserService,
    public router: Router,
    public localDataService: LocalDataService,
    public dataService: DataService) { }

   ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required],
        MyRole: ['', [Validators.required]],
        studentId: ['', [Validators.required]]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
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

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    
    this.responseColor = '';
    this.errors = [];    

    // to ignore validation for studentId select list
    // when Admin - role is selected
    if(this.showStudentList==false){      
      this.form.patchValue({
        studentId: 0
      });
    }

    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

      // console.log(JSON.stringify(this.form.value, null, 2));
      this.registerModel.FullName = this.form.value["name"];
      
      this.registerModel.UserName = this.form.value["username"];
      
      // check for ModelState @api
      // this.registerModel.UserName = null;
      this.registerModel.Email = this.form.value["email"];
      this.registerModel.Password = this.form.value["password"];
      var MyRole = this.form.value["MyRole"];
      this.registerModel.StudentId = Number(this.form.value["studentId"]);
      
      this.userService.register(this.registerModel, MyRole).subscribe(
        res => {
          console.log(res);
          if (res.responseCode === 0) {
            // success
            this.onReset();
            this.responseColor = 'green';
            this.localDataService.setRegisterMessage(res.responseMessage);

            // redirect to login page
            setTimeout(() => {
              this.router.navigate(['/signin']);
            }, 3000); 
          }
          // -1
          else {
            this.responseColor = 'red';
            // fail
            this.localDataService.setRegisterMessage(res.responseMessage);
          }
        },
        error => {    
          this.responseColor = 'red';
          // 400
          // ModelState @api
          if (error.status === 400) {   
            this.errors = this.localDataService.display400andEx(error, 'Bank');      
          }
          // 500
          else{
            this.localDataService.setRegisterMessage(error.error.message);
          }
        }
      );
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
    this.responseColor = '';
    this.errors = [];    
    this.localDataService.setRegisterMessage("");
  }

  // ok
  // when role is changed from select list
  changeRole(e) {
    // console.log(e.target.value);
    // if role is Student then load student select list
    // else return
    if(e.target.value=='Student'){
      // loading student select list
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
          this.students = data;
          console.log(this.students);
        },
        error => {
          console.log(error);
        });
  }
}