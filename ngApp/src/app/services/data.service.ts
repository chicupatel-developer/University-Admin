import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Department from '../models/department';
import {LocalDataService} from '../services/local-data.service';
import Faculty from '../models/faculty';
import  Assignment  from '../models/assignment';
import FacultyList from '../models/facultyList';
import AsmtFacDept from '../models/asmtFacDept';
import CourseListVM from '../models/courseView';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public API = 'https://localhost:44354';
  public DEPARTMENT_API = `${this.API}/api/department`;
  public FACULTY_API = `${this.API}/api/faculty`;
  public ASSIGNMENT_API = `${this.API}/api/assignment`;
  public COURSE_API = `${this.API}/api/course`;

  constructor(private http: HttpClient, public localDataService: LocalDataService) { }

  ///////////////// university api
  // ok
  //////////// department
  // list department
  getDepartments(): Observable<Array<Department>> {
    return this.http.get<Array<Department>>(this.DEPARTMENT_API + '/allDepartments');
  }
  // add department
  addDept(departmentModel): Observable<any> {
    return this.http.post(this.DEPARTMENT_API + '/addDepartment', departmentModel)
  }

  //////////// faculty
  // list faculty
  getFaculties(): Observable<Array<Faculty>> {
    return this.http.get<Array<Faculty>>(this.FACULTY_API + '/allFaculties');
  }
  // add faculty
  addFac(facultyModel): Observable<any>  {
    return this.http.post(this.FACULTY_API + '/addFaculty', facultyModel)
  }

  //////////// assignment
  // list assignment
  getAssignments(): Observable<Array<AsmtFacDept>> {
    return this.http.get<Array<AsmtFacDept>>(this.ASSIGNMENT_API + '/allAsmtFacDept');
  }
  // list faculties for select list in assignment create form
  listOfFaculties(selectedDeptId: number): Observable<Array<FacultyList>> {
    return this.http.get<Array<FacultyList>>(this.ASSIGNMENT_API + '/listOfFaculties/'+selectedDeptId);
  }
  // add assignment
  addAsmt(assignmentModel): Observable<any> {
    return this.http.post(this.ASSIGNMENT_API + '/addAssignment', assignmentModel)
  }
  // file upload
  public upload(formData) {
    return this.http.post<any>(this.ASSIGNMENT_API + '/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  //////////// course
  // list course
  getCourses(): Observable<Array<CourseListVM>> {
    return this.http.get<Array<CourseListVM>>(this.COURSE_API + '/allCourses');
  }
  // add course
  addCourse(courseModel): Observable<any> {
    return this.http.post(this.COURSE_API + '/addCourse', courseModel)
  }
  
  //////////////// university api end


}