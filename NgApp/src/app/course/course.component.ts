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
  responseColor = '';

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
          console.log(data);
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
          console.log(data);
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
              this.apiResponse = res.responseMessage;

              this.responseColor = 'green';
              this.courseForm.reset();              

              setTimeout(() => {
                this.newCourseAddPanel = false;
                this.apiResponse = '';
              }, 3000);

              this.submitted = false;
              this.loadCourses();         
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
  resetCourse() {
    this.newCourseAddPanel = false;
    this.apiResponse = '';
    this.courseForm.reset();
    this.submitted = false;
  }
  
  // ok
  editCrs(editCourse) {
    console.log(editCourse);
    // redirect to course-edit component
    this.router.navigate(['/course-edit/' + editCourse.courseId]);
  }

  // ok
  removeCrs(removeCourse) {
    this.dataService.initializeRemoveCourse(Number(removeCourse.courseId))
      .subscribe(
        data => {
          this.localDataService.setCrsRemoveVM(data);
          this.router.navigate(['/course-remove']);
        },
        error => {
          console.log(error);
        });
  }
}