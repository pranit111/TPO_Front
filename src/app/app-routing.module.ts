import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudLoginComponent } from './stud-login/stud-login.component';

const routes: Routes = [
  {path:"stud_login", component :StudLoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
