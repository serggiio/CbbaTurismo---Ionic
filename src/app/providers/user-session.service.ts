import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  public userData: any;
  constructor() {
    const data = JSON.parse(localStorage.getItem('user'));
    this.userData = data;
  }
}
