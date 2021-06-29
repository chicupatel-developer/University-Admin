import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Student from '../models/student';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {  

  // controls visibility of mail address/mail postal code
  showMailAddress = true;

  students: Array<Student>;

  stdForm: FormGroup;
  submitted = false;
  studentModel = new Student();
  newStdAddPanel = false;
  genderCollection: any = ['Male', 'Female', 'Other'];

  apiResponse = '';
  responseColor = '';

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router)
  { }

  // ok
  ngOnInit() {
    this.stdForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Gender: ['', Validators.required],
      PhoneNumber: ['', [Validators.required, Validators.pattern("^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]],
      HomeAddress: [''],
      MailAddress: [''],
      HomePostalCode: [''],
      MailPostalCode: [''],
      SameAddress: [false]
    })
    this.loadStds();
  }

  // ok
  loadStds() {
    this.dataService.getStudents()
      .subscribe(
        data => {
          this.students = data;
        },
        error => {
          console.log(error);
        });
  }

  // ok
  addStd() {
    this.newStdAddPanel = true;
    this.showMailAddress = true;
  }

  // ok
  get stdFormControl() {
    return this.stdForm.controls;
  }

  // ok
  /* Gender error handling */
  public handleError = (controlName: string, errorName: string) => {
    return this.stdForm.controls[controlName].hasError(errorName);
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
  // if SameAddress is checked
  // then hide mail address/mail postal code fields
  // and copy - paste from home to mail
  sameAddress(event){
    // console.log(event.target.checked);
    if (event.target.checked){
      // copy - paste
      this.showMailAddress = false;
      
      this.stdForm.patchValue({
        MailAddress: this.stdForm.value["HomeAddress"],
        MailPostalCode: this.stdForm.value["HomePostalCode"]
      });
    }
    else{
      this.showMailAddress = true;
      this.stdForm.patchValue({
        MailAddress: '',
        MailPostalCode: ' '
      });
    }
  }

  // ok
  onSubmit(): void {
    this.showMailAddress = true;
    this.stdForm.patchValue({
      SameAddress: false
    });

    this.submitted = true;
    if (this.stdForm.valid) {
      this.studentModel.firstName = this.stdForm.value["FirstName"];
      this.studentModel.lastName = this.stdForm.value["LastName"];
      this.studentModel.phoneNumber = this.stdForm.value["PhoneNumber"];
      this.studentModel.email = this.stdForm.value["Email"];      
      this.studentModel.gender = this.convertGender(this.stdForm.value["Gender"]);
      this.studentModel.homeAddress = this.stdForm.value["HomeAddress"];
      this.studentModel.homePostalCode = this.stdForm.value["HomePostalCode"];
      this.studentModel.mailAddress = this.stdForm.value["MailAddress"];
      this.studentModel.mailPostalCode = this.stdForm.value["MailPostalCode"];
      // console.log(this.studentModel);

      
      this.dataService.addStd(this.studentModel)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success    
              this.apiResponse = response.responseMessage;

              this.responseColor = 'green';
              this.stdForm.reset();
              this.submitted = false;

              setTimeout(() => {
                this.newStdAddPanel = false;
                this.apiResponse = '';
              }, 3000);

              this.loadStds();
            }
            else {
              // fail
              // display error message
              this.apiResponse = response.responseCode + ' : ' + response.responseMessage;
              this.responseColor = 'red';
            }
          },
          error => {
            this.apiResponse = error;
            this.responseColor = 'red';
          }
        );

      
    }
  }

  // ok
  resetStd() {
    this.newStdAddPanel = false;
    this.apiResponse = '';
    this.stdForm.reset();  
    this.submitted = false;
  }

  // ok
  addCrs(student){
    this.router.navigate(['/add-courses-to-student/'], { queryParams: { student: JSON.stringify(student) } });
  }

  // ok
  displayColumnValue(colValue, colWidth) {
    // if(colValue.includes("@")){
    if (colWidth == 2) {
      if (colValue.length > 13) {
        return (colValue.substring(0, 13) + '...');
      }
      else {
        return colValue;
      }
    }
    else {
      if (colValue.length > 6) {
        return (colValue.substring(0, 6) + '...');
      }
      else {
        return colValue;
      }
    }
  }

  // ok
  viewStudent(student) {
    this.router.navigate(['/student-view/'], { queryParams: { student: JSON.stringify(student) } });
  }

  // ok
  onPhoneNumberChange(phoneNumber){
    if (phoneNumber.length == 3){
      this.stdForm.patchValue({
        PhoneNumber: phoneNumber + '-'
      });
    }
    else if (phoneNumber.length == 7){
      this.stdForm.patchValue({
        PhoneNumber: phoneNumber + '-'
      });
    }
    else{
      this.stdForm.patchValue({
        PhoneNumber: phoneNumber
      });
    }
  }
}

