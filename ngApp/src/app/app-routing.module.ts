import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AuthGuard } from './auth/auth.guard';

import { SigninComponent } from './signin/signin.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { DepartmentComponent } from './department/department.component';
import { FacultyComponent } from './faculty/faculty.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { CourseComponent } from './course/course.component';
import { DepartmentEditComponent } from './department-edit/department-edit.component';
import { DepartmentRemoveComponent } from './department-remove/department-remove.component';
import { FacultyEditComponent } from './faculty-edit/faculty-edit.component';
import { FacultyRemoveComponent } from './faculty-remove/faculty-remove.component';
import { CourseRemoveComponent } from './course-remove/course-remove.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { StudentComponent } from './student/student.component';
import { AddCoursesToStudentComponent } from './add-courses-to-student/add-courses-to-student.component';
import { StudentCrsFacInfoComponent } from './student-crs-fac-info/student-crs-fac-info.component';
import { StudentMyAssignmentsComponent } from './student-my-assignments/student-my-assignments.component';
import { StudentViewComponent } from './student-view/student-view.component';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { StudentRemoveComponent } from './student-remove/student-remove.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'department', component: DepartmentComponent, canActivate: [AuthGuard] },
  { path: 'faculty', component: FacultyComponent, canActivate: [AuthGuard] },
  { path: 'assignment', component: AssignmentComponent, canActivate: [AuthGuard] },
  { path: 'course', component: CourseComponent, canActivate: [AuthGuard] },
  { path: 'department-remove', component: DepartmentRemoveComponent, canActivate: [AuthGuard] },
  { path: 'department-edit/:id', component: DepartmentEditComponent, canActivate: [AuthGuard] },
  { path: 'faculty-remove', component: FacultyRemoveComponent, canActivate: [AuthGuard] },
  { path: 'faculty-edit/:id', component: FacultyEditComponent, canActivate: [AuthGuard] },
  { path: 'course-edit/:id', component: CourseEditComponent, canActivate: [AuthGuard] },
  { path: 'add-courses-to-student', component: AddCoursesToStudentComponent, canActivate: [AuthGuard] },  
  { path: 'course-remove', component: CourseRemoveComponent, canActivate: [AuthGuard] },
  { path: 'student', component: StudentComponent, canActivate: [AuthGuard] },
  { path: 'student-view', component: StudentViewComponent, canActivate: [AuthGuard] },
  { path: 'student-mycourses', component: StudentCrsFacInfoComponent, canActivate: [AuthGuard] },
  { path: 'student-my-assignments', component: StudentMyAssignmentsComponent, canActivate: [AuthGuard] },
  { path: 'student-remove', component: StudentRemoveComponent, canActivate: [AuthGuard] },
  { path: 'student-edit/:id', component: StudentEditComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
