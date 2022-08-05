import { Injectable } from '@angular/core';
import AsmtSubmitVM from '../models/asmtSubmitVM';
import Student from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {

  // role
  private MyRole;

  private UserName;
  private LoginMessage;
  private RegisterMessage;
  private AsmtUploadId;

  private DeptRemoveVM;
  private FacRemoveVM;
  private CrsRemoveVM;
  private StdRemoveVM;


  constructor() { }

  // role
  setMyRole(val) {
    this.MyRole = val;
  }
  getMyRole() {
    return this.MyRole;
  }

  // student-remove
  setStdRemoveVM(val) {
    this.StdRemoveVM = val;
  }
  getStdRemoveVM() {
    return this.StdRemoveVM;
  }

  // department-remove
  setDeptRemoveVM(val) {
    this.DeptRemoveVM = val;
  }
  getDeptRemoveVM() {
    return this.DeptRemoveVM;
  }

  // faculty-remove
  setFacRemoveVM(val) {
    this.FacRemoveVM = val;
  }
  getFacRemoveVM() {
    return this.FacRemoveVM;
  }


  // course-remove
  setCrsRemoveVM(val) {
    this.CrsRemoveVM = val;
  }
  getCrsRemoveVM() {
    return this.CrsRemoveVM;
  }

  // login
  setUserName(val) {
    this.UserName = val;
  }
  getUserName() {
    return this.UserName;
  }

  // login
  setLoginMessage(val) {
    this.LoginMessage = val;
  }
  getLoginMessage() {
    return this.LoginMessage;
  }

  // register
  setRegisterMessage(val) {
    this.RegisterMessage = val;
  }
  getRegisterMessage() {
    return this.RegisterMessage;
  }

  // assignment
  setAsmtUploadId(val) {
    this.AsmtUploadId = val;
  }
  getAsmtUploadId() {
    return this.AsmtUploadId;
  }

  // 400
  // error handler
  display400andEx(error, componentName): string[] {
    var errors = [];
    if (error.status === 400) {
      if (error.error.errors != null) {
        for (var key in error.error.errors) {
          errors.push(error.error.errors[key]);
        }
      } else {
        errors.push('[' + componentName + '] Data Not Found ! / Bad Request !');
      }
    }
    else {
      console.log(error);
    }
    return errors;
  }

}
