import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import StdRemoveVM from '../models/stdRemoveVM';
import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';

@Component({
  selector: 'app-student-remove',
  templateUrl: './student-remove.component.html',
  styleUrls: ['./student-remove.component.css']
})
export class StudentRemoveComponent implements OnInit {

  stdRemoveVM: StdRemoveVM;
  responseColor = '';

  apiResponse = '';

  constructor(public localDataService: LocalDataService, public dataService: DataService, private router: Router) { }

  ngOnInit(): void {

    this.stdRemoveVM = this.localDataService.getStdRemoveVM();
    if (this.stdRemoveVM == null) {
      this.router.navigate(['/student']);
    }
    else {
      // if safe to remove, means no dependancy then green
      if (this.stdRemoveVM.errorCode >= 0) {
        this.responseColor = 'green';
      }
      // else not safe to remove, means dependancy then red
      else {
        this.responseColor = 'red';
      }
      console.log(this.stdRemoveVM);
    }
  }

  removeStd(stdRemoveVM) {
    console.log(stdRemoveVM);

    this.dataService.removeStudent(this.stdRemoveVM)
      .subscribe(
        response => {
          if (response.responseCode == 0) {
            // success
            this.apiResponse = response.responseMessage;
            this.responseColor = 'green';
            this.stdRemoveVM = null;

            // redirect to student component
            setTimeout(() => {
              this.router.navigate(['/student']);
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
