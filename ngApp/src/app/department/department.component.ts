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
  responseColor = '';

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router) { }

  // ok
  editDept(editDepartment){
    // redirect to department-edit component
    this.router.navigate(['/department-edit/'+ editDepartment.departmentId]);
  }

  // ok
  removeDept(removeDepartment){
    this.dataService.initializeRemoveDepartment(Number(removeDepartment.departmentId))
      .subscribe(
        data => {       
          this.localDataService.setDeptRemoveVM(data);
          this.router.navigate(['/department-remove']);
        },
        error => {
          console.log(error);
        });
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

          console.log('token expires...');
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
              this.apiResponse = response.responseMessage;

              this.responseColor = 'green';
              this.deptForm.reset();
              this.submitted = false;

              setTimeout(() => {
                this.newDeptAddPanel = false;
                this.apiResponse = ''; 
              }, 3000);

              this.loadDepts();
            }
            else{
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
  resetDept() {
    this.newDeptAddPanel = false;
    this.apiResponse = '';
    this.deptForm.reset();
    this.submitted = false;
  }
}
