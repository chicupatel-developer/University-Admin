import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

////////components
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SigninComponent } from './signin/signin.component';
import { RegistrationComponent } from './registration/registration.component';
import { UploadComponent } from './upload/upload.component';
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
import { SubmitAsmtComponent } from './submit-asmt/submit-asmt.component';
import { StudentMyCrsMyAsmtsComponent } from './student-my-crs-my-asmts/student-my-crs-my-asmts.component';
import { StudentMyAssignmentsComponent } from './student-my-assignments/student-my-assignments.component';
import { StudentViewComponent } from './student-view/student-view.component';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { StudentRemoveComponent } from './student-remove/student-remove.component';

////////auth guard
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';

////////services
import { DataService } from './services/data.service';
import { UserService } from './services/user.service';
import { LocalDataService } from './services/local-data.service';
import { CustomValidationService } from './services/custom-validation.service';

/////////google
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

////////bootstrap
///////date-picker ngbDatepicker
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    SigninComponent,
    RegistrationComponent,
    UploadComponent,
    DepartmentComponent,
    FacultyComponent,
    AssignmentComponent,
    CourseComponent,
    DepartmentEditComponent,
    DepartmentRemoveComponent,
    FacultyEditComponent,
    FacultyRemoveComponent,
    CourseRemoveComponent,
    CourseEditComponent,
    StudentComponent,
    AddCoursesToStudentComponent,
    SubmitAsmtComponent,
    StudentMyAssignmentsComponent,
    StudentViewComponent,
    StudentEditComponent,
    StudentRemoveComponent,
    StudentMyCrsMyAsmtsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    SocialLoginModule,
    NgbModule
  ],
  providers: [HttpClientModule, LocalDataService, DataService, UserService, CustomValidationService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '540442470157-4o0u4lr88bicssg4e9rtjikanuckq73t.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

