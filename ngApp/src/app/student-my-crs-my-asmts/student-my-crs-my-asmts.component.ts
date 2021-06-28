import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import StdCrsFacVM from '../models/stdCrsFacVM';
import Student from '../models/student';

@Component({
  selector: 'app-student-my-crs-my-asmts',
  templateUrl: './student-my-crs-my-asmts.component.html',
  styleUrls: ['./student-my-crs-my-asmts.component.css']
})
export class StudentMyCrsMyAsmtsComponent implements OnInit {
  // Student
  student = new Student();

  myCourses = new StdCrsFacVM();

  firstName: string;
  lastName: string;

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router) { }

  // ok
  ngOnInit(): void {
    if (localStorage.getItem('studentId') == null) {
      this.router.navigate(['/home']);
    }
    else {
      this.myCourses.studentId = Number(localStorage.getItem('studentId'));
      this.firstName = localStorage.getItem('firstName');
      this.lastName = localStorage.getItem('lastName');
      this.getMyCourses();
    }
  }

  // ok
  getMyCourses() {
    this.dataService.getMyCourses(this.myCourses.studentId)
      .subscribe(
        data => {
          console.log(data);
          this.myCourses = data;
        },
        error => {
          console.log(error);
        });
  }

  // ok
  myAsmts(course) {
    this.student.studentId = Number(localStorage.getItem('studentId'));
    this.student.firstName = localStorage.getItem('firstName');
    this.student.lastName = localStorage.getItem('lastName');
    this.student.courseId = course.courseId;

    this.router.navigate(['/student-my-assignments/'], { queryParams: { student: JSON.stringify(this.student) } });
  }
}
