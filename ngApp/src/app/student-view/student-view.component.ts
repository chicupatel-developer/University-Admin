import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import AsmtCrsStd from '../models/asmtCrsStd';
import AsmtFacDept from '../models/asmtFacDept';
import StdToAsmtDownload from '../models/stdToAsmtDownload';
import Student from '../models/student';
import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.css']
})
export class StudentViewComponent implements OnInit {

  // view student's details
  studentModel = new Student();

  errorMessage = '';

  constructor(private route: ActivatedRoute, public localDataService: LocalDataService, public dataService: DataService, public router: Router) {
  }

  // ok
  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        try {
          this.studentModel = JSON.parse(params['student']);          
        }
        catch (error) {
          this.errorMessage = 'Error in Parsing in-coming student data!';
        }
      }
    )
  }

  // ok
  getMyDisplayColor(student){
    if(student.gender==0)
      return 'blue';
    else if(student.gender==1)
      return 'red';
    else
      return 'black';
  }

  // ok
  convertGender(gender) {
    if (gender == 0)
      return 'Male';
    else if (gender == 1)
      return 'Female';
    else
      return 'Others';
  }
}
