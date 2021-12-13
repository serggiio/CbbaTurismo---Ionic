import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('formAdd', {static: false})
  form: FormControl;
  userData = {
    email: '',
    password: ''
  };

  languageData: any;
  constructor(private userService: UserService, public toastController: ToastController, private router: Router) {
    this.languageData = getLanguageData();
   }

  ngOnInit() {
    const session = localStorage.getItem('user');
    if(session && session !== null){
      this.router.navigate(['/home']);
    }
  }

  loginForm(){
    console.log('Submit click: ', this.form.valid);
    if(this.form.valid){
      console.log('Enviar formulario: ', this.userData);
      this.authenticateUser(this.userData);

    }
  }

  authenticateUser(user) {
    this.userService.authentication(user)
    .pipe(
      tap(userData => {
      }),
      catchError(async error => {
        console.log('Error_ ', error);
        await this.presentToast(this.languageData.login.errorToast);
        return EMPTY;
      })
    )
      .subscribe(async (userData: any) =>  {
        console.log('Login SUCCESS CALL service', userData);
        if(userData.code === 'OK' && userData.authenticate === true) {
          await this.presentToast(this.languageData.login.successToast + userData.data.name + ' ' + userData.data.lastName);
          this.setUserSession(userData.data);
          const userSession = localStorage.getItem('user');
          console.log('User after login', userSession);
          location.reload();
        }else {
          await this.presentToast(this.languageData.login.invalidToast);
        }
      });
  }

  setUserSession(userData){
    const session = {
      userId: userData.userId,
      name: userData.name,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      email: userData.email
    };
    localStorage.setItem('user', JSON.stringify(session));
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
