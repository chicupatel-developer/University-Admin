import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import CrsRemoveVM from '../models/crsRemoveVM';
import DeptRemoveVM from '../models/deptRemoveVM';
import FacRemoveVM from '../models/facRemoveVM';
import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';

@Component({
  selector: 'app-course-remove',
  templateUrl: './course-remove.component.html',
  styleUrls: ['./course-remove.component.css']
})
export class CourseRemoveComponent implements OnInit {
  
  crsRemoveVM: CrsRemoveVM;
  responseColor = '';
  displayContentColor = '';

  apiResponse = '';

  constructor(public localDataService: LocalDataService, public dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.crsRemoveVM = this.localDataService.getCrsRemoveVM();
    if (this.crsRemoveVM == null) {
      this.router.navigate(['/course']);
    }
    else {
      // if safe to remove, means no dependancy then green
      if (this.crsRemoveVM.errorCode >= 0) {
        this.responseColor = 'green';
        this.displayContentColor = 'green';
      }
      // else not safe to remove, means dependancy then red
      else {
        this.responseColor = 'red';
        this.displayContentColor = 'red';
      }
      console.log(this.crsRemoveVM);
    }
  }

  removeCrs(crsRemoveVM) {
    console.log(crsRemoveVM);

    this.dataService.removeCourse(this.crsRemoveVM)
      .subscribe(
        response => {
          if (response.responseCode == 0) {
            // success
            this.apiResponse = response.responseMessage;
            this.responseColor = 'green';
            this.crsRemoveVM = null;

            // redirect to course component
            setTimeout(() => {
              this.router.navigate(['/course']);
            }, 3000);
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
