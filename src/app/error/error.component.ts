
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
duration=5000;
  constructor(private errorService: ErrorService) {
    this.error$ = this.errorService.error$; // ✅ Works fine
  }
  ngOnInit() {
    this.error$.subscribe(message => {
      if (message) {
        this.showError = true;
        setTimeout(() => this.closeError(), this.duration);
      }
    });
  }

  closeError() {
    this.showError = false;
    this.errorService.clearError();
  }
}