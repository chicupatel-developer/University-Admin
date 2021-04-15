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

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'department', component: DepartmentComponent, canActivate: [AuthGuard] },
  { path: 'faculty', component: FacultyComponent, canActivate: [AuthGuard] },
  { path: 'assignment', component: AssignmentComponent, canActivate: [AuthGuard] },
  { path: 'course', component: CourseComponent, canActivate: [AuthGuard] },
  { path: 'department-edit/:id', component: DepartmentEditComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
