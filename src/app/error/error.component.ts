
import { Component } from '@angular/core';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-error',
  standalone: false,

  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent {
  error$;
  showError = false;
  duration = 5000;
  color = 'bg-red-600'; // Default color

  constructor(private errorService: ErrorService) {
    this.error$ = this.errorService.error$;
  }

  ngOnInit() {
    this.error$.subscribe(state => {
      if (state.message) {
        this.showError = true;
        this.color = state.color; // Set the color dynamically
        setTimeout(() => this.closeError(), this.duration);
      }
    });
  }

  closeError() {
    this.showError = false;
    this.errorService.clearError();
  }
}