import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
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

  constructor(private route: ActivatedRoute, public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, public router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        try{
          this.studentModel = JSON.parse(params['student']);          
        }
        catch (error){
          this.errorMessage = 'Error in Parsing in-coming student data!';
        }
      }
    )
  }

}
