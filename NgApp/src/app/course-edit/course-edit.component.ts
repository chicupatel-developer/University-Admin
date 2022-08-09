import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Department from '../models/department';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Faculty from '../models/faculty';
import Course from '../models/course';
import FacultyList from '../models/facultyList';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css']
})
export class CourseEditComponent implements OnInit {

  // ui can change facultyId for a particular courseId @Course db table
  // so run code @Assignment db table to change facultyId column value for
  // a respective courseId
  // set FacultyId = new value
  // where CourseId = courseId of currently changed course's courseId
  // ui can change faculty value only belong to same department where 
  // currently course is having department value

  // can't change
  couseId: string;
  departmentId: number;
  departmentName: string;
 
  // can change
  facultyId: number;
  departments: Array<Department>;
  faculties: Array<FacultyList>;

  crsForm: FormGroup;
  submitted = false;
  courseModel = new Course();

  editCrsPanel = true;

  apiResponse = '';
  responseColor = '';
  errors: string[];

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
   this.crsForm = this.fb.group({
     CourseName: ['', Validators.required],
     FacultyId: ['', Validators.required]
   });

   this.couseId = this.route.snapshot.paramMap.get('id');
    if (isNaN(+this.couseId)) {
      console.log('Not a Number!');
      this.router.navigate(['/course']);
    }
    else {
     // do api call to retrieve latest course information
     this.dataService.getCourse(Number(this.couseId))
       .subscribe(
         data => {
           if (data == null) {
              console.log('course not found!');
              this.editCrsPanel = false;
              // fail
              // display error message
              this.apiResponse = 'Course Not Found!';
              this.responseColor = 'red';
           }
           else {
             this.apiResponse = '';
             this.responseColor = 'green';
             this.editCrsPanel = true;

              // popup form data with incoming api data call  
              this.crsForm.setValue({
                CourseName: data.courseName,
                FacultyId: data.currentFacultyId
              });
              this.faculties = data.facultyList;
              this.departmentId = data.departmentId;
              this.departmentName = data.departmentName;
           }
         },
         error => {
           console.log('course not found!');
           this.editCrsPanel = false;
           // fail
           // display error message
           this.apiResponse = 'Course Not Found!';
           this.responseColor = 'red';
         });
   }
 }
  
  // ok  
  get crsFormControl() {
    return this.crsForm.controls;
  }

  onSubmit(): void {

    this.responseColor = '';
    this.errors = [];    
    this.apiResponse = ''; 

    this.submitted = true;
    if (this.crsForm.valid) {
      this.courseModel.couseName = this.crsForm.value["CourseName"];
      // this.courseModel.couseName = null;
      this.courseModel.departmentId = this.departmentId;
      this.courseModel.facultyId = Number(this.crsForm.value["FacultyId"]);
      this.courseModel.couseId = Number(this.couseId);
      // this.courseModel.couseId = 1111;

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
            this.apiResponse = '';
            this.responseColor = 'red';
            this.editCrsPanel = true;
            // 400
            // ModelState @api
            if (error.status === 400) {   
              this.errors = this.localDataService.display400andEx(error, 'Registration');      
            }
            else {
              console.log(error);
            }
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
