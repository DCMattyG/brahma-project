import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router) { }

  title = 'brahma';
  vlanOpen = false;
  numAlerts = 3;

  ngOnInit() {
    if(this.authService.isAuthenticated()) {
      this.router.navigate(['/topology']);
    }
  }

  toggleVlan() {
    this.vlanOpen = this.vlanOpen == true ? false : true;
  }

  showProfile() {
    // this.toggleMenu()
    this.router.navigate(['/profile']);
  }

  logout() {
    // this.toggleMenu();
    this.authService.logout();
  }
}
