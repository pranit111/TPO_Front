import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Cookie-based auth: HttpOnly cookies cannot be checked from JS.
  // Authentication is handled server-side via the JWT cookie.
  // This method is no longer reliable for client-side auth checks.
  isAuthenticated(): boolean {
    return false;
  }
}
