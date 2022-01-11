import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  @ViewChild('formAdd', {static: false})
  form: FormControl;
  languageData: any;
  resetStatus: boolean;

  userData = {
    email: ''
  };
  constructor(private userService: UserService, public toastController: ToastController, private router: Router) {
    this.languageData = getLanguageData();
    this.resetStatus = false;
   }

  ngOnInit() {
  }

  resetForm(){
    console.log('Submit click: ', this.form.valid);
    if(this.form.valid){
      console.log('Enviar formulario: ', this.userData);
      this.resetPassword(this.userData);

    }
  }

  resetPassword(user){
    this.userService.resetPassword(user)
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
        console.log('reset password SUCCESS CALL service', userData);
        if(userData.code === 'OK' && userData.sendMail === true) {
          await this.presentToast(this.languageData.resetPassword.successEmail);
          this.resetStatus = true;
        } else {
          await this.presentToast(this.languageData.resetPassword.errorEmail);
        }
      });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
