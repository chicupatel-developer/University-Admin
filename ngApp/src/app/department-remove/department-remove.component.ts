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
      }
      // else not safe to remove, means dependancy then red
      else{
        this.responseColor = 'red';
      }

      console.log(this.deptRemoveVM);
    }
  }

  removeDept(deptRemoveVM){
    console.log(deptRemoveVM);
  }
}
