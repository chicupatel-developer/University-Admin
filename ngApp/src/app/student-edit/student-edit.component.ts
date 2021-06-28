import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Student from '../models/student';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit {
  
  // can't change
  studentId: string;

  stdForm: FormGroup;
  submitted = false;
  studentModel = new Student();

  editStdPanel = true;
  genderCollection: any = ['Male', 'Female', 'Other'];

  apiResponse = '';
  responseColor = '';

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  // ok
  ngOnInit(): void {
    this.stdForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', Validators.required],
      Gender: ['', Validators.required],
      PhoneNumber: ['', [Validators.required, Validators.pattern("^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]],
      HomeAddress: [''],
      MailAddress: [''],
      HomePostalCode: [''],
      MailPostalCode: ['']
    });

    this.studentId = this.route.snapshot.paramMap.get('id');

    if (isNaN(+this.studentId)){
      console.log('Not a Number!');
      this.router.navigate(['/student']);
    }
    else{
      // do api call to retrieve latest student information 
      this.dataService.getStd(Number(this.studentId))
        .subscribe(
          data => {
            if (data == null) {
              console.log('student not found!');
              this.editStdPanel=false;
              // fail
              // display error message
              this.apiResponse = 'Student Not Found!';
              this.responseColor = 'red';
            }
            else {
              this.apiResponse = '';
              this.responseColor = 'green';
              this.editStdPanel = true;

              console.log(data);
              // popup form data with incoming api data call          
              this.stdForm.setValue({
                FirstName: data.firstName,
                LastName: data.lastName,
                Email: data.email,
                Gender: this.convertGenderToFormControl(data.gender),
                PhoneNumber: data.phoneNumber,
                HomeAddress: data.homeAddress,
                MailAddress: data.mailAddress,
                HomePostalCode: data.homePostalCode,
                MailPostalCode: data.mailPostalCode
              });
            }
          },
          error => {
            console.log(error);
          });
    }
  }

  // ok
  get stdFormControl() {
    return this.stdForm.controls;
  }

  // ok
  convertGender(gender) {
    if (gender == 'Male')
      return 0;
    else if (gender == 'Female')
      return 1;
    else
      return 2;
  }

  // ok
  /* Gender error handling */
  public handleError = (controlName: string, errorName: string) => {
    return this.stdForm.controls[controlName].hasError(errorName);
  }

  // this will convert gender db column to gender selectlist value
  convertGenderToFormControl(gender) {
    if (gender == 0)
      return 'Male';
    else if (gender == 1)
      return 'Female';
    else
      return 'Other';
  }

  // ok
  onSubmit(): void {
    this.submitted = true;
    if (this.stdForm.valid) {
      this.studentModel.studentId = Number(this.studentId);

      this.studentModel.firstName = this.stdForm.value["FirstName"];
      this.studentModel.lastName = this.stdForm.value["LastName"];
      this.studentModel.phoneNumber = this.stdForm.value["PhoneNumber"];
      this.studentModel.email = this.stdForm.value["Email"];
      this.studentModel.gender = this.convertGender(this.stdForm.value["Gender"]);
      this.studentModel.homeAddress = this.stdForm.value["HomeAddress"];
      this.studentModel.homePostalCode = this.stdForm.value["HomePostalCode"];
      this.studentModel.mailAddress = this.stdForm.value["MailAddress"];
      this.studentModel.mailPostalCode = this.stdForm.value["MailPostalCode"];

      this.dataService.editStd(this.studentModel)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success
              this.apiResponse = response.responseMessage;
              this.responseColor = 'green';
              this.editStdPanel = false;

              // redirect to student component
              setTimeout(() => {
                this.router.navigate(['/student']);
              }, 3000);
            }
            else {
              // fail
              // display error message
              this.apiResponse = response.responseCode + ' : ' + response.responseMessage;
              this.responseColor = 'red';
              this.editStdPanel = true;
            }
          },
          error => {
            this.apiResponse = error;
            this.responseColor = 'red';
            this.editStdPanel = true;
          }
        );
    }
  }

  // ok
  resetStd() {
    this.apiResponse = '';
    this.responseColor = '';
    this.stdForm.reset();
    this.submitted = false;

    this.router.navigate(['/student']);
  }
}
