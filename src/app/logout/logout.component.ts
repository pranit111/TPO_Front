import { Component } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: false,
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
constructor(private router:Router){}
  onLogout() {
localStorage.removeItem("authtoken")
localStorage.removeItem("username")
this.router.navigate(['login'])
}

}
