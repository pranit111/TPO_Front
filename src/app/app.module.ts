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
      LogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,FormsModule,
    HttpClientModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
