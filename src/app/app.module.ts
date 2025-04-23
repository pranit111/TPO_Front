import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudLoginComponent } from './stud-login/stud-login.component';
import { TpoLoginComponent } from './tpo-login/tpo-login.component';
import { SignupStudComponent } from './signup-stud/signup-stud.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';
import { ErrorComponent } from './error/error.component';
import { StudProfileComponent } from './stud-profile/stud-profile.component';

import { UserRegComponent } from './user-reg/user-reg.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogoutComponent } from './logout/logout.component';
import { PostListingComponent } from './post-listing/post-listing.component';
import { JobApplyComponent } from './job-apply/job-apply.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StudDashboardComponent } from './stud-dashboard/stud-dashboard.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ImageCropperModule } from 'ngx-img-cropper';
import { TpoSearchComponent } from './tpo-search/tpo-search.component';
import { TpoNavbarComponent } from './tpo-navbar/tpo-navbar.component';
import { PostJobComponent } from './post-job/post-job.component';
import { TpoadminComponent } from './tpoadmin/tpoadmin.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { DownloadResumeComponent } from './download-resume/download-resume.component';
@NgModule({
  declarations: [
    AppComponent,
    StudLoginComponent,
    TpoLoginComponent,
    SignupStudComponent,
    ErrorComponent,
    StudProfileComponent,

    UserRegComponent,
      ForgotPasswordComponent,
      LogoutComponent,
      PostListingComponent,
      JobApplyComponent,
      NavbarComponent,
      StudDashboardComponent,
      ProfileEditComponent,
      TpoSearchComponent,
      TpoNavbarComponent,
      PostJobComponent,
      TpoadminComponent,
      DownloadResumeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,FormsModule,
    HttpClientModule,
    ImageCropperModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
