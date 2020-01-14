import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FabricBuilderService } from '../services/fabric-builder.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authenticated = false;
  currentUser = '';

  constructor(private router: Router,
              private http: HttpClient,
              private fabricBuilder: FabricBuilderService) {

    // TESTING //
    // var token = localStorage.getItem('fabricToken');

    // if (token) {
    //   this.authenticated = true;
    //   this.currentUser = token;
    // }
    // TESTING //

    // PRODUCTION //
    localStorage.removeItem('fabricToken');
    // PRODUCTION //
  }

  public isAuthenticated(): Observable<boolean> {
    if (localStorage.getItem('fabricToken')) {
      // Logged In
      this.authenticated = true;
    } else {
      // Not Logged In
      this.authenticated = false;
    }

    return of(this.authenticated);
  }

  public getCurrentUser(): Observable<string> {
    return of(this.currentUser);
  }

  public login(email: string, token: string) {
    var loginUrl = environment.baseUrl + '/api/fabric/' + token;

    console.log("Sending GET...");
    return this.http.get<any>(loginUrl)
      .pipe(map(fabric => {
        console.log(fabric);
        if (fabric && fabric.nodes) {
            localStorage.setItem('fabricToken', token);
            this.authenticated = true;
            this.currentUser = fabric['token'];
            this.fabricBuilder.create(fabric.nodes);
        }

        return fabric;
      }));
  }

  public logout() {
    localStorage.removeItem('fabricToken');
    this.authenticated = false;
    this.currentUser = '';
    this.router.navigate(['/']);
  }
}
