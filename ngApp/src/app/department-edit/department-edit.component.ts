import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Department from '../models/department';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';



@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.css']
})
export class DepartmentEditComponent implements OnInit {

  // can't change
  // only departmentname can be edited
  departmentId: string;

  deptForm: FormGroup;
  submitted = false;
  departmentModel = new Department();

  editDeptPanel = true;

  apiResponse = '';
  responseColor='';

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router, private route: ActivatedRoute)
  { }

  // ok
  ngOnInit(): void {
    this.deptForm = this.fb.group({
      DepartmentName: ['', Validators.required]
    })

    
    this.departmentId = this.route.snapshot.paramMap.get('id');
    if (isNaN(+this.departmentId)) {
      console.log('Not a Number!');
      this.router.navigate(['/department']);
    }
    else {
      // do api call to retrieve latest department information 
      this.dataService.getDepartment(Number(this.departmentId))
        .subscribe(
          data => {
            if(data==null){
              console.log('department not found!');
              this.editDeptPanel = false;
              // fail
              // display error message
              this.apiResponse = 'Department Not Found!';
              this.responseColor = 'red';
            }
            else{
              this.apiResponse = '';
              this.responseColor = 'green';
              this.editDeptPanel = true;

              console.log(data);
              // popup form data with incoming api data call          
              this.deptForm.setValue({
                DepartmentName: data.departmentName
              });
            }
          },
          error => {
            console.log(error);
          });
    }
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
      this.departmentModel.departmentId = Number(this.departmentId);

      this.dataService.editDept(this.departmentModel)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success
              this.apiResponse = response.responseMessage;
              this.responseColor = 'green';
              this.editDeptPanel = false;  
              
              // redirect to department component
              setTimeout(() => {
                this.router.navigate(['/department']);
              }, 3000);
            }
            else {
              // fail
              // display error message
              this.apiResponse = response.responseCode + ' : ' + response.responseMessage;
              this.responseColor = 'red';
              this.editDeptPanel = true;
            }
          },
          error => {
            this.apiResponse = error;
            this.responseColor = 'red';
            this.editDeptPanel = true;
          }
        );
    }
  }

  // ok
  resetDept(){
    this.apiResponse = '';
    this.responseColor = '';
    this.deptForm.reset();
    this.submitted = false;

    this.router.navigate(['/department']);
  }
}
