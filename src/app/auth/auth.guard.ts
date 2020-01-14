import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  authenticated = false;

  constructor(
    private router: Router,
    private authService: AuthService
    ) {
      this.authService.isAuthenticated().subscribe(valid => this.authenticated = valid);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      console.log("Checking CANACTIVATE...");
      if (this.authenticated) {
          // Logged In
          return true;
      }

      // Not Logged In
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
      return false;
  }
}
