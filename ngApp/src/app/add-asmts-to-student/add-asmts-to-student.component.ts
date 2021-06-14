import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import AsmtFacDept from '../models/asmtFacDept';
import Student from '../models/student';
import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';

@Component({
  selector: 'app-add-asmts-to-student',
  templateUrl: './add-asmts-to-student.component.html',
  styleUrls: ['./add-asmts-to-student.component.css']
})
export class AddAsmtsToStudentComponent implements OnInit {

  // view / download assignments of student 
  stdToAsmts: Array<AsmtFacDept> = [];

  // view student's details
  studentModel = new Student();

  errorMessage = '';
  apiResponse = '';
  responseColor = '';

  // check if file exists or not
  downloadStatus: string;
  downloadClass: string;
  downloadFile: string;

  constructor(private route: ActivatedRoute, public localDataService: LocalDataService, public dataService: DataService, public router: Router) 
  {   
  }
  // ok
  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        try {
          this.studentModel = JSON.parse(params['student']);
          this.loadAsmtsForStudent(this.studentModel.studentId);
        }
        catch (error) {
          this.errorMessage = 'Error in Parsing in-coming student data!';
        }
      }
    )
  }

  // ok
  // this will load assignmets only assigned to courses to respective student 
  loadAsmtsForStudent(stdId) {
    this.dataService.loadAsmtsForStudent(stdId)
      .subscribe(
        data => {
          this.stdToAsmts=data;
        },
        error => {
          console.log(error);
        }
      );
  }


  // ok
  public downloadAsmt(assignment) {
    console.log(assignment.asmtFileName);
    this.dataService.download(assignment.asmtFileName)
      .subscribe(blob => {

        // file exists and downloading
        this.setFileDownload('Downloading!', 'green', assignment.asmtFileName);

        console.log(blob);

        // const myFile = new Blob([blob], { type: 'text/csv' });
        const myFile = new Blob([blob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(myFile);
        window.open(url);

        setTimeout(() => {
          this.resetAfterFileDownload();
        }, 5000);
      }, error => {
        if (error.status == 400) {
          this.setFileDownload('File Not Found!', 'red', assignment.asmtFileName);

          console.log('File Not Found on Server!');

          setTimeout(() => {
            this.resetAfterFileDownload();
          }, 2000);
        }
        else {
          this.setFileDownload('Error!', 'red', assignment.asmtFileName);

          console.log("Error while downloading assignment file!");

          setTimeout(() => {
            this.resetAfterFileDownload();
          }, 2000);
        }
      });
  }
  // ok
  setFileDownload(downloadStatus, downloadClass, downloadFile) {
    this.downloadStatus = downloadStatus;
    this.downloadClass = downloadClass;
    this.downloadFile = downloadFile;
  }
  // ok
  resetAfterFileDownload() {
    this.downloadStatus = '';
    this.downloadClass = '';
    this.downloadFile = '';
  }

}
