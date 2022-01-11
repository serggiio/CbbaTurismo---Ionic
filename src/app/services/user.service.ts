import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { configConstants } from '../constants/dataConstants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  path = configConstants.api.baseUrl+configConstants.api.user.path;
  constructor(private http: HttpClient) { }

  authentication(userData): Observable<any> {
    console.log('body', userData);
    return this.http.post<any>( this.path+configConstants.api.user.authentication, userData )
      .pipe();
  }

  getUserById(userData): Observable<any> {
    console.log('body', userData);
    return this.http.post<any>( this.path+configConstants.api.user.userById, userData )
      .pipe();
  }

  updateProfile(userData): Observable<any> {
    console.log('body', userData);
    return this.http.post<any>( this.path+configConstants.api.user.updateProfile, userData )
      .pipe();
  }

  registerAccount(userData): Observable<any> {
    console.log('body', userData);
    return this.http.post<any>( this.path+configConstants.api.user.registerAccount, userData )
      .pipe();
  }

  verificateCode(userData): Observable<any> {
    console.log('body', userData);
    return this.http.post<any>( this.path+configConstants.api.user.verificateCode, userData )
      .pipe();
  }

  resetPassword(userData): Observable<any> {
    console.log('body', userData);
    return this.http.post<any>( this.path+configConstants.api.user.resetPassword, userData )
      .pipe();
  }

}
