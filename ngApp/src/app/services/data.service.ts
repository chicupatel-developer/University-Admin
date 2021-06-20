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
import CourseList from '../models/courseList';
import Course from '../models/course';
import CourseEditVM from '../models/courseEditVM';
import Student from '../models/student';
import StdToAsmtDownload from '../models/stdToAsmtDownload';
import AsmtCrsStd from '../models/asmtCrsStd';
import StdCrsFacVM from '../models/stdCrsFacVM';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public API = 'https://localhost:44354';
  public DEPARTMENT_API = `${this.API}/api/department`;
  public FACULTY_API = `${this.API}/api/faculty`;
  public ASSIGNMENT_API = `${this.API}/api/assignment`;
  public COURSE_API = `${this.API}/api/course`;
  public STUDENT_API = `${this.API}/api/student`;

  constructor(private http: HttpClient, public localDataService: LocalDataService) { }

  ///////////////// university api
  // ok
  //////////// student
  // returns students those are yet not linked to ApplicationUser
  // means students with StudentUserId is null
  getStudentsNotLinkedToApplicationUser(): Observable<Array<Student>> {
    return this.http.get<Array<Student>>(this.STUDENT_API + '/allStudentsNotLinkedToApplicationUser');
  }
  // list student
  getStudents(): Observable<Array<Student>> {
    return this.http.get<Array<Student>>(this.STUDENT_API + '/allStudents');
  }
  // add student
  addStd(studentModel): Observable<any> {
    return this.http.post(this.STUDENT_API + '/addStudent', studentModel)
  }
  // get student data before edit-post
  getStd(selectedStdId: number): Observable<Student> {
    return this.http.get<Student>(this.STUDENT_API + '/getStudent/' + selectedStdId);
  }
  // edit student
  editStd(studentModel): Observable<any> {
    return this.http.post(this.STUDENT_API + '/editStudent', studentModel)
  }
  // add courses to student
  editCourseToStd(stdsToCourses): Observable<any> {
    return this.http.post(this.STUDENT_API + '/editCourseToStd', stdsToCourses)
  }
  // this will load courses only assigned to respective student
  loadCoursesForStudent(stdId: number): Observable<Array<CourseListVM>> {
    return this.http.get<Array<CourseListVM>>(this.STUDENT_API + '/loadCoursesForStudent/' + stdId);
  }
  // this will load assignments of selected course to respective student 
  loadAsmtsForStudentCourse(stdId: number, crsId: number): Observable<Array<AsmtCrsStd>> {
    var asmtStdCrsVM = {
      StudentId: stdId,
      CourseId: crsId
    };
    return this.http.post<Array<AsmtCrsStd>>(this.STUDENT_API + '/loadAsmtsForStudentCourse', asmtStdCrsVM);
  }
  // download - assignment (student - assignment)    
  public downloadAsmt(stdToAsmtDownload: StdToAsmtDownload): Observable<Blob> {
    return this.http.post<Blob>(this.STUDENT_API + '/downloadAsmt', stdToAsmtDownload,
      { responseType: 'blob' as 'json' });
  }
  public asmtSubmit(formData) {
    return this.http.post<any>(this.STUDENT_API + '/asmtSubmit', formData, {      
      reportProgress: true,
      observe: 'events'
    });
  }  
  // Student : user
  // this will load courses and faculty info only assigned to respective student
  getMyCourses(stdId: number): Observable<StdCrsFacVM> {
    return this.http.get <StdCrsFacVM> (this.STUDENT_API + '/getMyCourses/' + stdId);
  }

  //////////// department
  // list department
  getDepartments(): Observable<Array<Department>> {
    return this.http.get<Array<Department>>(this.DEPARTMENT_API + '/allDepartments');
  }
  // add department
  addDept(departmentModel): Observable<any> {
    return this.http.post(this.DEPARTMENT_API + '/addDepartment', departmentModel)
  }
  // edit department
  getDepartment(selectedDeptId: number): Observable<Department> {
    return this.http.get<Department>(this.DEPARTMENT_API + '/getDepartment/' + selectedDeptId);
  }
  // edit department in action
  editDept(data): Observable<any> {
    return this.http.post(this.DEPARTMENT_API + '/editDepartment' , data);
  }
  // initialise remove department
  initializeRemoveDepartment(selectedDeptId: number): Observable<any> {
    return this.http.get<any>(this.DEPARTMENT_API + '/initializeRemoveDepartment/' + selectedDeptId);
  }
  // remove department in action
  removeDepartment(data): Observable<any> {
    return this.http.post(this.DEPARTMENT_API + '/removeDepartment', data);
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
  // initialise remove faculty
  initializeRemoveFaculty(selectedFacId: number): Observable<any> {
    return this.http.get<any>(this.FACULTY_API + '/initializeRemoveFaculty/' + selectedFacId);
  }
  // remove faculty in action
  removeFaculty(data): Observable<any> {
    return this.http.post(this.FACULTY_API + '/removeFaculty', data);
  }
  // edit faculty
  getFaculty(selectedFacId: number): Observable<Faculty> {
    return this.http.get<Faculty>(this.FACULTY_API + '/getFaculty/' + selectedFacId);
  }
  // edit faculty in action
  editFac(data): Observable<any> {
    return this.http.post(this.FACULTY_API + '/editFaculty', data);
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
  // list courses for select list in assignment create form
  listOfCourses(selectedFacId: number): Observable<Array<CourseList>> {
    return this.http.get<Array<CourseList>>(this.ASSIGNMENT_API + '/listOfCourses/' + selectedFacId);
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
  // file download    
  public download(fileName: string): Observable<Blob> {    
    return this.http.get<Blob>(this.ASSIGNMENT_API + '/download?fileName=' + fileName,
      { responseType: 'blob' as 'json' });      
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
  // edit course  
  getCourse(selectedCrsId: number): Observable<CourseEditVM> {
    return this.http.get<CourseEditVM>(this.COURSE_API + '/getCourse/' + selectedCrsId);
  }
  // edit course in action
  editCrs(data): Observable<any> {
    return this.http.post(this.COURSE_API + '/editCourse', data);
  }
  // initialise remove course
  initializeRemoveCourse(selectedCrsId: number): Observable<any> {
    return this.http.get<any>(this.COURSE_API + '/initializeRemoveCourse/' + selectedCrsId);
  }
  // remove course in action
  removeCourse(data): Observable<any> {
    return this.http.post(this.COURSE_API + '/removeCourse', data);
  }
  
  //////////////// university api end


}