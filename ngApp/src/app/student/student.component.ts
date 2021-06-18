import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import Student from '../models/student';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  students: Array<Student>;

  stdForm: FormGroup;
  submitted = false;
  studentModel = new Student();
  newStdAddPanel = false;

  apiResponse = '';
  responseColor = '';

  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router)
  { }

  // ok
  ngOnInit() {
    this.stdForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required]
    })
    this.loadStds();
  }

  // ok
  loadStds() {
    this.dataService.getStudents()
      .subscribe(
        data => {
          this.students = data;
        },
        error => {
          console.log(error);
        });
  }

  // ok
  addStd() {
    this.newStdAddPanel = true;
  }

  // ok
  get stdFormControl() {
    return this.stdForm.controls;
  }

  // ok
  onSubmit(): void {
    this.submitted = true;
    if (this.stdForm.valid) {
      this.studentModel.firstName = this.stdForm.value["FirstName"];
      this.studentModel.lastName = this.stdForm.value["LastName"];
      this.dataService.addStd(this.studentModel)
        .subscribe(
          response => {
            if (response.responseCode == 0) {
              // success    
              this.apiResponse = response.responseMessage;

              this.responseColor = 'green';
              this.stdForm.reset();
              this.submitted = false;

              setTimeout(() => {
                this.newStdAddPanel = false;
                this.apiResponse = '';
              }, 3000);

              this.loadStds();
            }
            else {
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
  resetStd() {
    this.newStdAddPanel = false;
    this.apiResponse = '';
    this.stdForm.reset();
    this.submitted = false;
  }

  // ok
  addCrs(student){
    this.router.navigate(['/add-courses-to-student/'], { queryParams: { student: JSON.stringify(student) } });
  }
}
