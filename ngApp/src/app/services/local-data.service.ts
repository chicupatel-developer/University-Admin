import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {

  private UserName;
  private LoginError;
  private RegisterMessage;
  private AsmtUploadId;

  private DeptRemoveVM;
  private FacRemoveVM;


  constructor() { }

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

  // login
  setUserName(val) {
    this.UserName = val;
  }
  getUserName() {
    return this.UserName;
  }

  // login
  setLoginError(val) {
    this.LoginError = val;
  }
  getLoginError() {
    return this.LoginError;
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
}
