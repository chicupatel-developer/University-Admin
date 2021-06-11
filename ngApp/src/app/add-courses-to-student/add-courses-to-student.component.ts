import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import CourseList from '../models/courseList';
import CourseListVM from '../models/courseView';
import StdToCourse from '../models/stdToCourse';
import Student from '../models/student';
import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';

@Component({
  selector: 'app-add-courses-to-student',
  templateUrl: './add-courses-to-student.component.html',
  styleUrls: ['./add-courses-to-student.component.css']
})
export class AddCoursesToStudentComponent implements OnInit {

  // add-remove/edit record(s) to db table stdstocourses
  stdsToCourses: Array<StdToCourse> = [];
  
  // view student's details
  studentModel = new Student();

  errorMessage = '';
  apiResponse = '';
  responseColor = '';

  // display collection of course list coming from api
  courseListVM: Array<CourseListVM> = [];
  courseList: Array<CourseList> = [];

  // this collection manages runtime check-uncheck actions of courselist checkboxes
  runtimeChkUnChkCrs: Array<CourseList> = [];

  form: FormGroup;
  submitted = false;
  
  constructor(private route: ActivatedRoute, public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, public router: Router) 
  {
    this.form = this.fb.group({
      checkArray: this.fb.array([], [Validators.required])
    })
  }
   
  // ok
  onCheckboxChange(e, data) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;

    // if item is checked
    if (e.target.checked) {
      console.log('selected...'+data.courseId);
      if (this.runtimeChkUnChkCrs.findIndex((obj => obj.courseId == data.courseId))>-1){
        // don't add
      }
      else{
        // add
        this.runtimeChkUnChkCrs.push({
          courseId: data.courseId,
          courseName: data.courseName,
          checked: e.target.checked
        });
      }    
    } 
    // if item is un-checked
    else {
      console.log('un - selected...' + data.courseId);
      if (this.runtimeChkUnChkCrs.findIndex((obj => obj.courseId == data.courseId)) > -1) {
        // remove
        this.runtimeChkUnChkCrs.forEach((value, index) => {
          if (value.courseId == data.courseId) this.runtimeChkUnChkCrs.splice(index, 1);
        });
      }
      else {      
      }      
    }
    // console.log(this.runtimeChkUnChkCrs);
  }

  // ok
  submitForm() {

    this.submitted = true;
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (this.runtimeChkUnChkCrs.length>=1)
    {
      // if atleast 1 course is selected then later it will make 
      // form validation to true
      // form validation is based on form control this.form.controls['checkArray']
      // that's why, you have to push all selected courses back to this
      // form control this.form.controls['checkArray']
      for (var val of this.runtimeChkUnChkCrs) {
        checkArray.push(new FormControl(val.courseId));
      }

      // popup stdsToCourses[] 
      for (var _val of this.form.value.checkArray) {
        this.stdsToCourses.push({
          courseId: Number(_val),
          studentId: this.studentModel.studentId
        });
      }
      
      // if 0 course is selected then display validation error
      // if 1 or more courses selected then it will pass form validation 
      if (this.form.valid) {
        this.dataService.editCourseToStd(this.stdsToCourses)
          .subscribe(
            res => {
              if (res.responseCode == 0) {
                // success
                this.apiResponse = res.responseMessage;
                this.responseColor = 'green';
                this.submitted = false;

                // clear success message after 3 seconds
                setTimeout(() => {
                  this.apiResponse = '';
                  this.router.navigate(['/student']);
                }, 3000);
              }
              else{
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
      else{
        return;
      }
    }
    else{
      return;
    }  
  }  

  // ok
  ngOnInit(): void { 
    this.route.queryParams.subscribe(
      params => {
        try {
          this.studentModel = JSON.parse(params['student']);
          this.loadCourses();
        }
        catch (error) {
          this.errorMessage = 'Error in Parsing in-coming student data!';
        }
      }
    )
  }

  // ok
  // this will load all courses from db
  loadCourses() {
    this.dataService.getCourses()
      .subscribe(
        data => {
          this.courseListVM = data;
          for (const item of this.courseListVM) {
              this.courseList.push({
                courseId: item.courseId,
                courseName: item.courseName,
                checked: item.checked
              });
          }
          this.loadCoursesForStudent(this.studentModel.studentId);
        },
        error => {
          console.log(error);
        });
  }
  
  // ok
  // this will load courses only assigned to respective student
  loadCoursesForStudent(stdId){
    this.dataService.loadCoursesForStudent(stdId)
      .subscribe(
        data => {
          for (const stdCrs of data) {
            // this will update courseList[] as per api's data
            let index = this.courseList.findIndex((obj => obj.courseId == stdCrs.courseId));
            this.courseList[index].checked = stdCrs.checked;

            // this will popup runtimeChkUnChkCrs[] as per api's data
            // to keep track of already added courses to db for a respective studentid
            this.runtimeChkUnChkCrs.push({
              courseId: stdCrs.courseId,
              courseName: stdCrs.courseName,
              checked: stdCrs.checked
            });
          }
        },
        error => {
          console.log(error);
        }
      );
  }
}
