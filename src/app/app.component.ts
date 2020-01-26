import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { FabricBuilderService } from './services/fabric-builder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(public authService: AuthService,
              private router: Router,
              private fb: FabricBuilderService) { }

  title = 'brahma';
  vlanOpen = false;
  testOpen = false;
  modalOpen = false;
  numAlerts = 3;

  ngOnInit() {
    if(this.authService.isAuthenticated()) {
      this.router.navigate(['/topology']);
    }
  }

  toggleVlan() {
    this.vlanOpen = this.vlanOpen == true ? false : true;
  }

  toggleTest() {
    this.testOpen = this.testOpen == true ? false : true;
  }

  toggleModal() {
    this.modalOpen = this.modalOpen == true ? false : true;
  }

  showProfile() {
    // this.toggleMenu()
    this.router.navigate(['/profile']);
  }

  saveConfig() {
    console.log("Saving Config...");
    this.toggleModal();
    this.fb.saveData();
  }

  logout() {
    // this.toggleMenu();
    this.authService.logout();
  }
}
