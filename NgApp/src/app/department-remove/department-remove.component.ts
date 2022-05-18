import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import DeptRemoveVM from '../models/deptRemoveVM';
import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';

@Component({
  selector: 'app-department-remove',
  templateUrl: './department-remove.component.html',
  styleUrls: ['./department-remove.component.css']
})
export class DepartmentRemoveComponent implements OnInit {

  deptRemoveVM: DeptRemoveVM;
  responseColor = '';
  displayContentColor = '';

  apiResponse = '';

  constructor(public localDataService: LocalDataService, public dataService: DataService, private router: Router) { }

  ngOnInit(): void {

    this.deptRemoveVM = this.localDataService.getDeptRemoveVM();
    if(this.deptRemoveVM==null){
      this.router.navigate(['/department']);
    }
    else{
      // if safe to remove, means no dependancy then green
      if(this.deptRemoveVM.errorCode>=0){
        this.responseColor = 'green';
        this.displayContentColor = 'green';
      }
      // else not safe to remove, means dependancy then red
      else{
        this.responseColor = 'red';
        this.displayContentColor = 'red';
      }

      console.log(this.deptRemoveVM);
    }
  }

  removeDept(deptRemoveVM){
    console.log(deptRemoveVM);

    this.dataService.removeDepartment(this.deptRemoveVM)
      .subscribe(
        response => {
          if (response.responseCode == 0) {
            // success
            this.apiResponse = response.responseMessage;
            this.responseColor = 'green';
            this.deptRemoveVM = null;

            // redirect to department component
            setTimeout(() => {
              this.router.navigate(['/department']);
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
