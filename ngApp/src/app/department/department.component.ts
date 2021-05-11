import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Department from '../models/department';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LocalDataService} from '../services/local-data.service';
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departments: Array<Department>;

  deptForm: FormGroup;
  submitted = false;
  departmentModel = new Department();
  newDeptAddPanel = false;
  apiResponse = '';

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router) { }

  editDept(editDepartment){
    // redirect to department-edit component
    this.router.navigate(['/department-edit/'+ editDepartment.departmentId]);
  }
  removeDept(removeDepartment){

  }


  // ok
  ngOnInit() {
    this.deptForm = this.fb.group({
      DepartmentName: ['', Validators.required]
    })
    this.loadDepts();  
  }

  // ok
  loadDepts(){
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
  addDept(){
    this.newDeptAddPanel = true;
  }

  // ok
  get deptFormControl() {
    return this.deptForm.controls;
  }

  // ok
  onSubmit(): void {
    this.submitted = true;
    if (this.deptForm.valid) {
      this.departmentModel.departmentName = this.deptForm.value["DepartmentName"];
      this.dataService.addDept(this.departmentModel)
        .subscribe(
          response => {
            if(response.responseCode==0){
              // success
              this.loadDepts();

              this.resetDept();
            }
            else{
              // fail
              // display error message
              this.apiResponse = response.responseCode + ' : ' + response.responseMessage;
            }
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  // ok
  resetDept() {
    this.newDeptAddPanel = false;
    this.apiResponse = '';
    this.deptForm.reset();
    this.submitted = false;
  }
}
