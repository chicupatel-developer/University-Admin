import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import Assignment from '../models/assignment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../services/local-data.service';
import FacultyList from '../models/facultyList';
import AssignmentCreate from '../models/assignmentCreate';
import AsmtFacDept from '../models/asmtFacDept';
import Department from '../models/department';


@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {

  departments: Array<Department>;
  faculties: Array<FacultyList>;
  assignments: Array<AsmtFacDept>;

  asmtForm: FormGroup;
  submitted = false;
  assignmentModel = new AssignmentCreate();
  newAsmtAddPanel = false;
  apiResponse = '';

  asmtDetailsPanel = false;
  
  constructor(public localDataService: LocalDataService, private fb: FormBuilder, public dataService: DataService, private router: Router) { }

  // ok
  ngOnInit() {

    this.asmtForm = this.fb.group({
      Title: ['', Validators.required],
      Details: ['', Validators.required],
      DepartmentId: ['', Validators.required],
      FacultyId: ['', Validators.required],
      AsmtLastDate: ['', Validators.required]
    })

    this.loadDept();
    this.loadAsmtFacDept();
  }
  


  // ok
  changeDepartment(e) {
    this.loadFacs(e.target.value);
  }

  // ok
  loadDept(){
    this.dataService.getDepartments()
      .subscribe(
        data => {
          this.departments = data;
        },
        error => {
          console.log(error);
        });
  }

  // ok
  loadAsmtFacDept(){
    this.dataService.getAssignments()
      .subscribe(
        data => {
          this.assignments = data;
        },
        error => {
          console.log(error);
        });
  }
  
  // ok
  loadFacs(selectedDeptId) {
    this.dataService.listOfFaculties(selectedDeptId)
      .subscribe(
        data => {
          if(data.length<=0){
            // reset facultyId select list control
            this.asmtForm.controls['FacultyId'].setValue('');
          }
          this.faculties = data;
        },
        error => {
          console.log(error);
        });
  }

  // ok
  addAsmt() {
    this.newAsmtAddPanel = true;
  }

  // ok
  get asmtFormControl() {
    return this.asmtForm.controls;
  }

  // ok
  onSubmit(): void {

    console.log(this.asmtForm.value["AsmtLastDate"].year);

    this.submitted = true;
    if (this.asmtForm.valid) {
      this.assignmentModel.title = this.asmtForm.value["Title"];
      this.assignmentModel.details = this.asmtForm.value["Details"];
      this.assignmentModel.facultyId = Number(this.asmtForm.value["FacultyId"]);
      this.assignmentModel.asmtLastDate = new Date( this.asmtForm.value["AsmtLastDate"].year + '/' + this.asmtForm.value["AsmtLastDate"].month + '/' + this.asmtForm.value["AsmtLastDate"].day);
      this.assignmentModel.asmtCreateDate = new Date();

      // retrive asmtUploadId from local-data service
      this.assignmentModel.asmtUploadId = this.localDataService.getAsmtUploadId();

      this.dataService.addAsmt(this.assignmentModel)
        .subscribe(
          res => {
            if (res.responseCode == 0) {
              // success
              this.loadAsmtFacDept();

              this.resetAsmt();
            }
            else {
              // fail
              // display error message
              this.apiResponse = res.responseCode + ' : ' + res.responseMessage;
            }
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  // ok
  resetAsmt() {
    this.newAsmtAddPanel = false;
    this.apiResponse = '';
    this.asmtForm.reset();
    this.submitted = false;
    this.localDataService.setAsmtUploadId(0);

    this.asmtDetailsPanel = false;
  }
  
  // ok
  public uploadFinished = (event) => {
    console.log('upload done...');
    // console.log('assignment upload id... '+ event.model.asmtUploadId);
    // console.log('file name... ' + event.model.fileName);

    // 2 different processes
    // 1. assignment file upload - AsmtUploads table
    // 2. other assignment details(title/details) add - Assignments table
    // store asmtUploadId to local-data service
    // so other assignment details(title/details) get consistent with 
    // assignment file upload,,,
    // which is the next process just right after assignment file upload
    this.localDataService.setAsmtUploadId(event.model.asmtUploadId);

    // make visible asmtDetailsPanel 
    this.asmtDetailsPanel = true;
  }
}
