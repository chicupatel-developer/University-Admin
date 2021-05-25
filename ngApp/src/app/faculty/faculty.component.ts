import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Faculty from '../models/faculty';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Department from '../models/department';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent implements OnInit {
  faculties: Array<Faculty>;
  departments: Array<Department>;
  genderCollection: any = ['Male', 'Female', 'Other'];

  facForm: FormGroup;
  submitted = false;
  facultyModel = new Faculty();
  newFacAddPanel = false;

  apiResponse = '';
  responseColor = '';

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router) { }


  // ok
  ngOnInit() {

    this.facForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', Validators.required],
      Gender: ['', Validators.required],
      DepartmentId: ['', Validators.required],
      PhoneNumber: ['', [Validators.required, Validators.pattern("^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]]
    })

    this.loadDepts();
  }

  // ok
  loadDepts() {
    this.dataService.getDepartments()
      .subscribe(
        data => {
          this.departments = data;
          this.loadFacs();
        },
        error => {
          console.log(error);
        });
  }

  // ok
  loadFacs() {
    this.dataService.getFaculties()
      .subscribe(
        data => {
          this.faculties = data;

          // assign departmentName property of department object to...
          // faculty object's property departmentName
          this.faculties.forEach((f) => {
            this.departments.forEach((d) => {
              if(d.departmentId==f.departmentId){
                f.departmentName = d.departmentName;
              }
            });
          });
        },
        error => {
          console.log(error);
        });
  }

  // ok
  addFac() {
    this.newFacAddPanel = true;
  }

  // ok
  get facFormControl() {
    return this.facForm.controls;
  }

  // ok
  /* Gender error handling */
  public handleError = (controlName: string, errorName: string) => {
    return this.facForm.controls[controlName].hasError(errorName);
  }

  // ok
  convertGender(gender){
    if(gender=='Male')
      return 0;
    else if(gender=='Female')
      return 1;
    else  
      return 2;
  }

  // ok
  onSubmit(): void {   
    this.submitted = true;
    if (this.facForm.valid) {
      this.facultyModel.phoneNumber = this.facForm.value["PhoneNumber"];
      this.facultyModel.firstName = this.facForm.value["FirstName"];
      this.facultyModel.lastName = this.facForm.value["LastName"];
      this.facultyModel.email = this.facForm.value["Email"];
      this.facultyModel.departmentId = Number(this.facForm.value["DepartmentId"]);
      this.facultyModel.gender =this.convertGender(this.facForm.value["Gender"]);
    
      this.dataService.addFac(this.facultyModel)
        .subscribe(
          res => {
            if (res.responseCode == 0) {
              // success
              this.apiResponse = res.responseMessage;
              this.responseColor = 'green';
              this.facForm.reset();
              this.submitted = false;
              setTimeout(() => {
                this.newFacAddPanel = false;
                this.apiResponse = '';
              }, 3000);

              this.loadFacs();
            }
            else {
              // fail
              // display error message
              this.apiResponse = res.responseCode + ' : ' + res.responseMessage;
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
  resetFac() {
    this.newFacAddPanel = false;
    this.apiResponse = '';
    this.facForm.reset();
    this.submitted = false;
  }

  // ok
  editFac(editFaculty) {
    console.log(editFaculty);
    // redirect to faculty-edit component
    // this.router.navigate(['/faculty-edit/' + editFaculty.facultyId]);
  }

  // ok
  removeFac(removeFaculty) {
    this.dataService.initializeRemoveFaculty(Number(removeFaculty.facultyId))
      .subscribe(
        data => {
          this.localDataService.setFacRemoveVM(data);
          this.router.navigate(['/faculty-remove']);
        },
        error => {
          console.log(error);
        });
  }
}