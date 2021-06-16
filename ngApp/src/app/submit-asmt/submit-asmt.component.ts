import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DataService } from '../services/data.service';
import StdToAsmt from '../models/stdToAsmt';
import AsmtSubmitVM from '../models/asmtSubmitVM';


@Component({
  selector: 'app-submit-asmt',
  templateUrl: './submit-asmt.component.html',
  styleUrls: ['./submit-asmt.component.css']
})
export class SubmitAsmtComponent implements OnInit {
  public progress: number;
  public message: string;

  // stdToAsmt : StdToAsmt;
  asmtSubmitVM : AsmtSubmitVM;

  @Output() public onUploadFinished = new EventEmitter();

  @Input() studentId = 0;
  @Input() assignmentId = 0;

  constructor(private http: HttpClient, public dataService: DataService) { }
  ngOnInit() {
  }

  // wip
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    // formData.append('file', fileToUpload, fileToUpload.name);

    const stdToAsmt = JSON.stringify({
      studentId: this.studentId,
      assignmentId: this.assignmentId
    });

    formData.set('stdToAsmt', stdToAsmt);
    formData.set('file', fileToUpload, fileToUpload.name);

    this.dataService.asmtSubmit(formData).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {        
        this.message = 'Upload success.';
        this.onUploadFinished.emit(event.body);
      }
    },
      (error) => {
        if(error.statusCode==400){
          // wip
          // catch 400
          console.log(error.statusCode);
        }
        else{
          // 500 internal server error
          console.log(error.error + '.....' + error.statusCode);
        }        
      }
    );
  }

}
