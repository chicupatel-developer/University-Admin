import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import StdCrsFacVM from '../models/stdCrsFacVM';

@Component({
  selector: 'app-student-crs-fac-info',
  templateUrl: './student-crs-fac-info.component.html',
  styleUrls: ['./student-crs-fac-info.component.css']
})
export class StudentCrsFacInfoComponent implements OnInit {

  myCourses = new StdCrsFacVM();

  firstName : string;
  lastName : string;
  
  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router) 
  { }

  // ok
  ngOnInit(): void {
    if (localStorage.getItem('studentId')==null){
      this.router.navigate(['/home']);
    }
    else{
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

}
