import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-submit-asmt',
  templateUrl: './submit-asmt.component.html',
  styleUrls: ['./submit-asmt.component.css']
})
export class SubmitAsmtComponent implements OnInit {
  public progress: number;
  public message: string;
  public messageColor: string;
  public progressFlag = false;

  @Output() public onUploadFinished = new EventEmitter();

  @Input() studentId = 0;
  @Input() assignmentId = 0;

  constructor(private http: HttpClient, public dataService: DataService) { }
  ngOnInit() {
  }

  // ok
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();

    const stdToAsmt = JSON.stringify({
      studentId: this.studentId,
      assignmentId: this.assignmentId
    });

    formData.set('stdToAsmt', stdToAsmt);
    formData.set('file', fileToUpload, fileToUpload.name);

    this.dataService.asmtSubmit(formData).subscribe(event => {

      this.progressFlag = true;

      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {        
        this.message = 'Assignment Submit OK!';
        this.messageColor = 'green';
        setTimeout(() => {
          this.message = '';
          this.onUploadFinished.emit(event.body);
        }, 20000);
      }
    },
      (error) => {
        this.message = error.error.message;
        this.messageColor = 'red';

        this.progressFlag = false;

        setTimeout(() => {
          this.message = '';
        }, 3000);
      }
    );
  }

}
