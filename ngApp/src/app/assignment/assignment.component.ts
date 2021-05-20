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
  responseColor = '';

  asmtDetailsPanel = false;

  // search form
  searchForm: FormGroup;
  filteredAssignments: Array<AsmtFacDept>;
  searchEnabled = false;
  facs: Array<FacultyList> = [];
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


    this.searchForm = this.fb.group({    
      SDepartmentId: [''],
      SFacultyId: ['']
    })
  }  

  // wip
  // search by department
  searchBy(){
    var selectedDepartmentId = Number(this.searchForm.value["SDepartmentId"]);      
    var selectedFacultyId = Number(this.searchForm.value["SFacultyId"]);
    if(selectedDepartmentId<=0 && selectedFacultyId<=0){
      return;
    }
    else{
      console.log('department : ' + selectedDepartmentId);
      console.log('faculty : ' + selectedFacultyId);
      var filterByDepartment = this.assignments.filter(xx => xx.departmentId == selectedDepartmentId);
      this.filteredAssignments = this.assignments.filter(xx => xx.departmentId == selectedDepartmentId);
      console.log(this.filteredAssignments);
      // OR condition between department and faculty filter
      var filterByFaculty = this.assignments.filter(xx => xx.facultyId == selectedFacultyId);
      this.filteredAssignments = this.assignments.filter(xx => xx.facultyId == selectedFacultyId);
      console.log(this.filteredAssignments);

      this.searchEnabled = true;
    }
    
  }
  // displays faculties belong to all assignments in db
  // no api call
  // displays unique list of faculties from current list of assignments
  displayFacs() {
    const map = new Map();
    for (const item of this.assignments) {
      if (!map.has(item.facultyId)) {
        map.set(item.facultyId, true);
        this.facs.push({
          facultyId: item.facultyId,
          facultyName: item.facultyName
        });
      }
    }
  }
  // reset filter
  clearAllFilter(){
    this.searchEnabled = false;
    this.searchForm.reset();
  }





  // ok
  // format fac. / dept. column
  formatingFacDeptName(a){
    var editedFacName = '';
    var editedDeptName = '';

    // faculty name
    if(a.facultyName.length>=8){
      editedFacName = a.facultyName.substring(0, 7) +'...';
    }
    else{
      editedFacName = a.facultyName;
    }

    // department name
    if (a.departmentName.length >= 6) {
      editedDeptName = a.departmentName.substring(0, 5) + '...';
    }
    else {
      editedDeptName = a.departmentName;
    }

    return editedFacName + ' / ' + editedDeptName;
  }

  // ok
  // format details column
  formatingDetails(a) {
    var editedDetails = '';

    if (a.details.length >= 21) {
      editedDetails = a.details.substring(0, 20) + '...';
    }
    else {
      editedDetails = a.details;
    }

    return editedDetails;
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


          this.displayFacs();
        },
        error => {
          console.log(error);
        });
  }
  
  // ok
  // displays faculties belong to selected department
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
              this.apiResponse = res.responseMessage;
              this.responseColor = 'green';
              this.newAsmtAddPanel = false;
              this.asmtDetailsPanel = false;
              this.submitted = false;
              this.asmtForm.reset();
              this.localDataService.setAsmtUploadId(0);

              // clear success message after 3 seconds
              setTimeout(() => {
                this.apiResponse = '';
              }, 3000);

              this.loadAsmtFacDept();
            }
            else {
              // fail
              // display error message
              this.apiResponse = res.responseCode + ' : ' + res.responseMessage;
              this.responseColor = 'red';
              this.newAsmtAddPanel = true;
              this.asmtDetailsPanel = true;
            }
          },
          error => {
            this.apiResponse = error;
            this.responseColor = 'red'; 
            this.newAsmtAddPanel = true;
            this.asmtDetailsPanel = true;
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

  // ok
  public downloadAsmt(assignment){
    console.log(assignment.asmtFileName);
    this.dataService.download(assignment.asmtFileName)
      .subscribe(blob => {
        console.log(blob);

        // const myFile = new Blob([blob], { type: 'text/csv' });
        const myFile = new Blob([blob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(myFile);
        window.open(url);
      }, error => {
        console.log("Error while downloading assignment file!");
      });
  }

  // ok
  cancel(){
    this.newAsmtAddPanel = false;
    this.asmtDetailsPanel = false;
  }  
}
