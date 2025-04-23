import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudLoginComponent } from './stud-login/stud-login.component';
import { TpoLoginComponent } from './tpo-login/tpo-login.component';
import { SignupStudComponent } from './signup-stud/signup-stud.component';
import { StudProfileComponent } from './stud-profile/stud-profile.component';
import { UserRegComponent } from './user-reg/user-reg.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogoutComponent } from './logout/logout.component';
import { PostListingComponent } from './post-listing/post-listing.component';
import { JobApplyComponent } from './job-apply/job-apply.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StudDashboardComponent } from './stud-dashboard/stud-dashboard.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { TpoSearchComponent } from './tpo-search/tpo-search.component';
import { TpoNavbarComponent } from './tpo-navbar/tpo-navbar.component';
import { PostJobComponent } from './post-job/post-job.component';
import { TpoadminComponent } from './tpoadmin/tpoadmin.component';
import { DownloadResumeComponent } from './download-resume/download-resume.component';
const routes: Routes = [
  {path:'',  redirectTo:'login', pathMatch:'full'},

  {

    path: '', component: NavbarComponent, children: [
      
      {path:"profile", component :StudProfileComponent},
      {path:"notification", component :PostListingComponent},
      {path:"job_details/:id", component :JobApplyComponent},
      {path:"dashboard", component :StudDashboardComponent}
    ]
  },
  {path:"login", component :StudLoginComponent},
  {path:"profile_edit", component :ProfileEditComponent},
  {path:"tpo_admin", component :TpoadminComponent},
  {path:"create_profile", component :SignupStudComponent},
  {path:"tpo_login", component :TpoLoginComponent},
  {path:"user_registration", component :UserRegComponent},
  {path:"forgot_password", component :ForgotPasswordComponent},
  {path:"logout", component :LogoutComponent},
  { path: "download/:type/:id/:course", component: DownloadResumeComponent }
,


  {
    path: 'tpo', component: TpoNavbarComponent, children: [
     
      {path:"search", component :TpoSearchComponent},
      {path:"post_job", component :PostJobComponent},
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
