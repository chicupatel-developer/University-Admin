import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Department from '../models/department';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.css']
})
export class DepartmentEditComponent implements OnInit {

  departmentId: string;

  constructor(
    public dataService: DataService,
    private route: ActivatedRoute,
    private router: Router) 
  { 

  }

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.paramMap.get('id');
    if(this.departmentId=='')
    {
    }
    else{
      // do api call to retrieve latest department information 
      this.dataService.getDepartment(Number(this.departmentId))
        .subscribe(
          data => {
            if(data==null){
              // department not found...
              console.log('department not found!');
            }
            else{
              console.log(data);
            }
          },
          error => {
            console.log(error);
          });
    }
  }

}
