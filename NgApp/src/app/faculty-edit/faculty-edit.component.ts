import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Department from '../models/department';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Faculty from '../models/faculty';

@Component({
  selector: 'app-faculty-edit',
  templateUrl: './faculty-edit.component.html',
  styleUrls: ['./faculty-edit.component.css']
})
export class FacultyEditComponent implements OnInit {

  // ui can change departmentId for a particular facultyId @Faculty db table
  // so run code @Course db table to change departmentId column value for
  // a respective facultyId
  // set DepartmentId = new value
  // where FacultyId = facultyId of currently changed faculty's facultyId

  // can't change
  facultyId: string;

  departments: Array<Department>;
  genderCollection: any = ['Male', 'Female', 'Other'];
  facForm: FormGroup;
  submitted = false;
  facultyModel = new Faculty();
   
  editFacPanel = true;

  apiResponse = '';
  responseColor = '';

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.facForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Gender: ['', Validators.required],
      DepartmentId: ['', Validators.required],
      PhoneNumber: ['', [Validators.required, Validators.pattern("^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]]
    });

    this.loadDepts();

    this.facultyId = this.route.snapshot.paramMap.get('id');
    if (isNaN(+this.facultyId)) {
      console.log('Not a Number!');
      this.router.navigate(['/faculty']);
    }
    else {
      // do api call to retrieve latest faculty information 
      this.dataService.getFaculty(Number(this.facultyId))
        .subscribe(
          data => {
            if (data == null) {
              console.log('faculty not found!');
              this.editFacPanel = false;
              // fail
              // display error message
              this.apiResponse = 'Faculty Not Found!';
              this.responseColor = 'red';
            }
            else {
              this.apiResponse = '';
              this.responseColor = 'green';
              this.editFacPanel = true;

              // console.log(data);
              // popup form data with incoming api data call  
              this.facForm.setValue({
                FirstName: data.firstName,
                LastName: data.lastName,
                Email: data.email,
                Gender: this.convertGenderToFormControl(data.gender),
                DepartmentId: data.departmentId,
                PhoneNumber: data.phoneNumber
              });
            }
          },
          error => {
            console.log(error);
          });
    }
  }

  // ok
  get facFormControl() {
    return this.facForm.controls;
  }

  onSubmit(): void {   
    this.submitted = true;
    if (this.facForm.valid) {
      this.facultyModel.phoneNumber = this.facForm.value["PhoneNumber"];
      this.facultyModel.firstName = this.facForm.value["FirstName"];
      this.facultyModel.lastName = this.facForm.value["LastName"];
      this.facultyModel.email = this.facForm.value["Email"];
      this.facultyModel.departmentId = Number(this.facForm.value["DepartmentId"]);
      this.facultyModel.gender = this.convertGenderToDB(this.facForm.value["Gender"]);
      this.facultyModel.facultyId = Number(this.facultyId);

      this.dataService.editFac(this.facultyModel)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success
              this.apiResponse = response.responseMessage;
              this.responseColor = 'green';
              this.editFacPanel = false;

              // redirect to faculty component
              setTimeout(() => {
                this.router.navigate(['/faculty']);
              }, 3000);
            }
            else {
              // fail
              // display error message
              this.apiResponse = response.responseCode + ' : ' + response.responseMessage;
              this.responseColor = 'red';
              this.editFacPanel = true;
            }
          },
          error => {
            this.apiResponse = error;
            this.responseColor = 'red';
            this.editFacPanel = true;
          }
        );
    }
  }

  resetFac() {  
    this.apiResponse = '';
    this.responseColor = '';
    this.facForm.reset();
    this.submitted = false;

    this.router.navigate(['/faculty']);
  }

  // this will convert gender selectlist value to gender db column
  convertGenderToDB(gender) {
    if (gender == 'Male')
      return 0;
    else if (gender == 'Female')
      return 1;
    else
      return 2;
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
  loadDepts() {
    this.dataService.getDepartments()
      .subscribe(
        data => {
          this.departments = data;
        },
        error => {
          console.log(error);
        });
  }

  // ok
  /* Gender error handling */
  public handleError = (controlName: string, errorName: string) => {
    return this.facForm.controls[controlName].hasError(errorName);
  }

  // ok
  onPhoneNumberChange(event) {
    var phoneNumber = event.target.value;
    
    if (phoneNumber.length == 3) {
      this.facForm.patchValue({
        PhoneNumber: phoneNumber + '-'
      });
    }
    else if (phoneNumber.length == 7) {
      this.facForm.patchValue({
        PhoneNumber: phoneNumber + '-'
      });
    }
    else {
      this.facForm.patchValue({
        PhoneNumber: phoneNumber
      });
    }
  }
}
