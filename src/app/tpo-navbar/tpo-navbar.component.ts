import { Component } from '@angular/core';

@Component({
  selector: 'app-tpo-navbar',
  standalone: false,
  templateUrl: './tpo-navbar.component.html',
  styleUrl: './tpo-navbar.component.css'
})
export class TpoNavbarComponent {
  isMenuOpen = false;
  username="";
  ngOnInit(){
    this.username= localStorage.getItem("username")|| "USER"
  
   }
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }
}
