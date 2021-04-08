import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Department from '../models/department';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import CourseListVM from '../models/courseView';
import FacultyList from '../models/facultyList';
import CourseCreate from '../models/courseCreate';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courses: Array<CourseListVM>;

  departments: Array<Department>;
  faculties: Array<FacultyList>;
  
  courseForm: FormGroup;
  submitted = false;
  courseModel = new CourseCreate();
  newCourseAddPanel = false;
  apiResponse = '';

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router) { }

  // ok
  ngOnInit() {

    this.courseForm = this.fb.group({
      CouseName: ['', Validators.required],
      DepartmentId: ['', Validators.required],
      FacultyId: ['', Validators.required]
    })

    this.loadDept();

    this.loadCourses();
  }

  // ok
  changeDepartment(e) {
    this.loadFacs(e.target.value);
  }

  // ok
  loadDept() {
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
  loadFacs(selectedDeptId) {
    this.dataService.listOfFaculties(selectedDeptId)
      .subscribe(
        data => {
          if (data.length <= 0) {
            // reset facultyId select list control
            this.courseForm.controls['FacultyId'].setValue('');
          }
          this.faculties = data;
        },
        error => {
          console.log(error);
        });
  }

  // ok
  loadCourses() {
    this.dataService.getCourses()
      .subscribe(
        data => {
          this.courses = data;
        },
        error => {
          console.log(error);
        });
  }  

  // ok
  addCourse() {
    this.newCourseAddPanel = true;
  }

  // ok
  get courseFormControl() {
    return this.courseForm.controls;
  }

  // ok
  onSubmit(): void {

    this.submitted = true;
    if (this.courseForm.valid) {
      this.courseModel.couseName = this.courseForm.value["CouseName"];
      this.courseModel.facultyId = Number(this.courseForm.value["FacultyId"]);
      this.courseModel.departmentId = Number(this.courseForm.value["DepartmentId"]);
       
      this.dataService.addCourse(this.courseModel)
        .subscribe(
          res => {
            if (res.responseCode == 0) {
              // success
              this.loadCourses();

              this.resetCourse();
            }
            else {
              // fail
              // display error message
              this.apiResponse = res.responseCode + ' : ' + res.responseMessage;

              this.courseForm.reset();
              this.submitted = false;
            }
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  // ok
  resetCourse() {
    this.newCourseAddPanel = false;
    this.apiResponse = '';
    this.courseForm.reset();
    this.submitted = false;
  }
}