import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _Http: HttpClient, private _Router: Router) {
    this.userDate();
  }

  user: BehaviorSubject<any> = new BehaviorSubject(null);

  register(formData: object): Observable<any> {
    return this._Http.post(environment.baseUrl + 'signup', formData);
  }

  login(formData: object): Observable<any> {
    return this._Http.post(environment.baseUrl + 'signin', formData);
  }

  userDate(): void {
    const token = localStorage.getItem('_noteotken');

    if (token !== null) {
      const userData = jwtDecode(token);

      this.user.next(userData);

      this._Router.navigate(['/home']);
    }
  }
}
