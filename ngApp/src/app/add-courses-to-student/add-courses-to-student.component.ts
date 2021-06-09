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

  // add record(s) to db table stdstocourses
  stdsToCourses: Array<StdToCourse> = [];
  
  // view student's details
  studentModel = new Student();

  errorMessage = '';

  // display collection of course list coming from api
  courseListVM: Array<CourseListVM> = [];
  courseList: Array<CourseList> = [];

  form: FormGroup;
  submitted = false;
  
  constructor(private route: ActivatedRoute, public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, public router: Router) 
  {
    this.form = this.fb.group({
      checkArray: this.fb.array([], [Validators.required])
    })
  }
   
  // ok
  onCheckboxChange(e) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  // ok
  submitForm() {
    // console.log(this.form.value);

    this.submitted = true;
    if (this.form.valid) {
      for (var val of this.form.value.checkArray) {
        console.log('selected course id: ' + val);
        this.stdsToCourses.push({
          courseId: Number(val),
          studentId: this.studentModel.studentId
        });
      }

      // api call
      this.dataService.addCourseToStd(this.stdsToCourses)
        .subscribe(
          res => {
            console.log(res);

            setTimeout(() => {
              this.router.navigate(['/student']);
            }, 2000);
          },
          error => {
            console.log(error);
          }
        );
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
  
  // wip
  // this will load courses only assigned to respective student
  loadCoursesForStudent(stdId){
    this.dataService.loadCoursesForStudent(stdId)
      .subscribe(
        data => {
          /*
          for (const stdCrs of data) {
            let index = this.courseListVM.findIndex((obj => obj.courseId == stdCrs.courseId));
            this.courseListVM[index].checked = stdCrs.checked;            
          }
          */

          for (const stdCrs of data) {
            let index = this.courseList.findIndex((obj => obj.courseId == stdCrs.courseId));
            this.courseList[index].checked = stdCrs.checked;
          }
        },
        error => {
          console.log(error);
        }
      );
  }
}
