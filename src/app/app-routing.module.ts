import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudLoginComponent } from './stud-login/stud-login.component';
import { TpoLoginComponent } from './tpo-login/tpo-login.component';
import { SignupStudComponent } from './signup-stud/signup-stud.component';
import { StudProfileComponent } from './stud-profile/stud-profile.component';
import { UserRegComponent } from './user-reg/user-reg.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  {path:"", component :StudLoginComponent},
  {path:"tpo_login", component :TpoLoginComponent},
  {path:"signup", component :SignupStudComponent},
  {path:"stud_profile", component :StudProfileComponent},
  {path:"user_registration", component :UserRegComponent},
  {path:"forgot_password", component :ForgotPasswordComponent},
  {path:"logout", component :LogoutComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
