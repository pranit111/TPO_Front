import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  handleError(err: any) {
    throw new Error('Method not implemented.');
  }
  private errorState = new BehaviorSubject<{ message: string | null, color: string }>({ message: null, color: 'bg-red-600' });
  error$ = this.errorState.asObservable();
  private timeoutId: any;

  setError(message: string, color: string = 'bg-red-600', duration: number = 5000) {
    this.errorState.next({ message, color });
    clearTimeout(this.timeoutId); // Clear previous timeout
    this.timeoutId = setTimeout(() => this.clearError(), duration);
  }

  clearError() {
    this.errorState.next({ message: null, color: 'bg-red-600' });
  }
}
