import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import AsmtCrsStd from '../models/asmtCrsStd';
import AsmtFacDept from '../models/asmtFacDept';
import StdToAsmtDownload from '../models/stdToAsmtDownload';
import Student from '../models/student';
import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';

@Component({
  selector: 'app-student-my-assignments',
  templateUrl: './student-my-assignments.component.html',
  styleUrls: ['./student-my-assignments.component.css']
})
export class StudentMyAssignmentsComponent implements OnInit {

  // view student's details
  studentModel = new Student();

  errorMessage = '';

  // view / download assignments of student 
  stdToAsmts: Array<AsmtCrsStd> = [];

  // download assignment
  stdToAsmtDownload = new StdToAsmtDownload();

  // check if file exists or not
  downloadStatus: string;
  downloadClass: string;
  downloadFile: string;

  constructor(private route: ActivatedRoute, public localDataService: LocalDataService, public dataService: DataService, public router: Router) {
  }

  // ok
  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        try {
          this.studentModel = JSON.parse(params['student']);
          this.loadAsmtsForStudentCourse(this.studentModel.studentId, this.studentModel.courseId);
        }
        catch (error) {
          this.errorMessage = 'Error in Parsing in-coming student data!';
        }
      }
    )
  }
  // ok
  // this will load assignments of selected course to respective student 
  loadAsmtsForStudentCourse(stdId, crsId) {
    this.dataService.loadAsmtsForStudentCourse(stdId, crsId)
      .subscribe(
        data => {
          this.stdToAsmts = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  // ok
  convertAsmtStatus(statusCode) {
    if (statusCode == 0)
      return 'Assignment Linked';
    else if (statusCode == 1)
      return 'Assignment Not Linked';
    else
      return 'Assignment Submitted';
  }

  // ok
  public downloadAsmt(assignment) {
    console.log(assignment.asmtFileName);

    this.stdToAsmtDownload.studentId = this.studentModel.studentId;
    this.stdToAsmtDownload.assignmentId = assignment.assignmentId;
    this.stdToAsmtDownload.asmtFileName = assignment.asmtFileName;

    this.dataService.downloadAsmt(this.stdToAsmtDownload)
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

          // refresh assignments belong to selected course of student
          this.loadAsmtsForStudentCourse(this.studentModel.studentId, this.studentModel.courseId);
        }, 20000);
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

  // ok
  public uploadFinished = (event) => {
    console.log('Assignment Submit OK!');

    // refresh assignments belong to selected course of student
    this.loadAsmtsForStudentCourse(this.studentModel.studentId, this.studentModel.courseId);
  }

  // ok
  // true means download and submit options are enabled
  // false means already donloaded and submitted, so download and submit options are disabled
  checkAsmtLinkStatus(assignment) {
    if (assignment.asmtLinkStatus == 2) {
      return false;
    }
    else {
      return true;
    }
  }
}
