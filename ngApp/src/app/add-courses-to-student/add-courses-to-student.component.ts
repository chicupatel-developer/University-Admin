import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn
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

  stdToCourseModel = new StdToCourse();
  studentModel = new Student();
  errorMessage = '';

  courseListVM: Array<CourseListVM> = [];
  courseList: Array<CourseList> = [];
  form: FormGroup;
  
  constructor(private route: ActivatedRoute, public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, public router: Router) 
  {
    this.form = this.fb.group({
      checkArray: this.fb.array([])
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

  // wip
  submitForm() {
    console.log(this.form.value);
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
  loadCourses() {
    this.dataService.getCourses()
      .subscribe(
        data => {
          this.courseListVM = data;
          for (const item of this.courseListVM) {
              this.courseList.push({
                courseId: item.courseId,
                courseName: item.courseName
              });
          }
        },
        error => {
          console.log(error);
        });
  }

}
