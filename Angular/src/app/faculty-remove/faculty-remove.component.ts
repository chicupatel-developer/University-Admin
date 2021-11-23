import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import DeptRemoveVM from '../models/deptRemoveVM';
import FacRemoveVM from '../models/facRemoveVM';
import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';

@Component({
  selector: 'app-faculty-remove',
  templateUrl: './faculty-remove.component.html',
  styleUrls: ['./faculty-remove.component.css']
})
export class FacultyRemoveComponent implements OnInit {
  facRemoveVM: FacRemoveVM;
  responseColor = '';

  apiResponse = '';

  constructor(public localDataService: LocalDataService, public dataService: DataService, private router: Router) { }

  ngOnInit(): void {  
    this.facRemoveVM = this.localDataService.getFacRemoveVM();
    if (this.facRemoveVM == null) {
      this.router.navigate(['/faculty']);
    }
    else {
      // if safe to remove, means no dependancy then green
      if (this.facRemoveVM.errorCode >= 0) {
        this.responseColor = 'green';
      }
      // else not safe to remove, means dependancy then red
      else {
        this.responseColor = 'red';
      }
      console.log(this.facRemoveVM);
    }
  }

  removeFac(facRemoveVM) {
    console.log(facRemoveVM);  

    this.dataService.removeFaculty(this.facRemoveVM)
      .subscribe(
        response => {
          if (response.responseCode == 0) {
            // success
            this.apiResponse = response.responseMessage;
            this.responseColor = 'green';
            this.facRemoveVM = null;

            // redirect to faculty component
            setTimeout(() => {
              this.router.navigate(['/faculty']);
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
