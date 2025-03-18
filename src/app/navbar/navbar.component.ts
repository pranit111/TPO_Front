import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMenuOpen = false;
  username="";
 ngOnInit(){
  this.username= localStorage.getItem("username")|| "USER"

 }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
