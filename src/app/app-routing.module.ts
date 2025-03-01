import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudLoginComponent } from './stud-login/stud-login.component';
import { TpoLoginComponent } from './tpo-login/tpo-login.component';
import { SignupStudComponent } from './signup-stud/signup-stud.component';

const routes: Routes = [
  {path:"stud_login", component :StudLoginComponent},
  {path:"tpo_login", component :TpoLoginComponent},
  {path:"signup", component :SignupStudComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
