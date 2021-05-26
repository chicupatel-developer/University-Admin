import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Department from '../models/department';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Faculty from '../models/faculty';
import Course from '../models/course';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css']
})
export class CourseEditComponent implements OnInit {

  // can't change
  couseId: string;
  facultyId: number;
  departmentId: number;
 
  crsForm: FormGroup;
  submitted = false;
  courseModel = new Course();

  editCrsPanel = true;

  apiResponse = '';
  responseColor = '';

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.crsForm = this.fb.group({
      CourseName: ['', Validators.required]
    });

    this.couseId = this.route.snapshot.paramMap.get('id');
    if (this.couseId == '') {
      return;
    }
    else {
      // do api call to retrieve latest course information 
      this.dataService.getCourse(Number(this.couseId))
        .subscribe(
          data => {
            if (data == null) {
              console.log('course not found!');
            }
            else {
              // console.log(data);
              // popup form data with incoming api data call  
              this.crsForm.setValue({
                CourseName: data.couseName
              });
              this.facultyId = data.facultyId;
              this.departmentId = data.departmentId;
            }
          },
          error => {
            console.log(error);
          });
    }
  }
  // ok  
  get crsFormControl() {
    return this.crsForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.crsForm.valid) {
      this.courseModel.couseName = this.crsForm.value["CourseName"];
      this.courseModel.departmentId = this.departmentId;
      this.courseModel.facultyId = this.facultyId;
      this.courseModel.couseId = Number(this.couseId);

      this.dataService.editCrs(this.courseModel)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success
              this.apiResponse = response.responseMessage;
              this.responseColor = 'green';
              this.editCrsPanel = false;

              // redirect to course component
              setTimeout(() => {
                this.router.navigate(['/course']);
              }, 3000);
            }
            else {
              // fail
              // display error message
              this.apiResponse = response.responseCode + ' : ' + response.responseMessage;
              this.responseColor = 'red';
              this.editCrsPanel = true;
            }
          },
          error => {
            this.apiResponse = error;
            this.responseColor = 'red';
            this.editCrsPanel = true;
          }
        );
    }
  }

  resetCrs() {
    this.apiResponse = '';
    this.responseColor = '';
    this.crsForm.reset();
    this.submitted = false;

    this.router.navigate(['/course']);
  }

}
