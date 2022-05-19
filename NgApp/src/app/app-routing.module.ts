import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { RegistrationComponent } from './registration/registration.component';
import { DepartmentComponent } from './department/department.component';
import { DepartmentEditComponent } from './department-edit/department-edit.component';
import { DepartmentRemoveComponent } from './department-remove/department-remove.component';
import { FacultyComponent } from './faculty/faculty.component';
import { FacultyEditComponent } from './faculty-edit/faculty-edit.component';
import { FacultyRemoveComponent } from './faculty-remove/faculty-remove.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'department', component: DepartmentComponent, canActivate: [AuthGuard] },
  { path: 'department-edit/:id', component: DepartmentEditComponent, canActivate: [AuthGuard] },
  { path: 'department-remove', component: DepartmentRemoveComponent, canActivate: [AuthGuard] },
  { path: 'faculty', component: FacultyComponent, canActivate: [AuthGuard] },
  { path: 'faculty-remove', component: FacultyRemoveComponent, canActivate: [AuthGuard] },
  { path: 'faculty-edit/:id', component: FacultyEditComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
