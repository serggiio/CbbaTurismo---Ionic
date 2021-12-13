import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { UserSessionService } from './providers/user-session.service';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: any ;
  languageData: any;
  constructor(
    private androidPermissions: AndroidPermissions, public userSession: UserSessionService) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
    );

    this.languageData = getLanguageData();
    //console.log('Language result', this.languageData);

      this.appPages = [
        { title: this.languageData.mainMenu.home, url: '/home', icon: 'home' },
        { title: this.languageData.mainMenu.location, url: '/location', icon: 'navigate' },
        { title: this.languageData.mainMenu.map, url: '/map', icon: 'map' },
        { title: this.languageData.mainMenu.list, url: '/list', icon: 'list-circle' },
        { title: this.languageData.mainMenu.calendar, url: '/calendar', icon: 'calendar' },
        { title: this.languageData.mainMenu.settings, url: '/settings', icon: 'language' }
      ];

  }

  logOutUser(){
    localStorage.clear();
    location.reload();
  }
}
