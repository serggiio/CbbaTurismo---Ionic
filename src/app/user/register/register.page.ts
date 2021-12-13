import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild('formAdd', {static: false})
  form: FormControl;
  userFormData = {
    name: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    repeatPassword: ''
  };
  languageData: any;
  constructor(private router: Router, private userService: UserService, public toastController: ToastController) {
    this.languageData = getLanguageData();
   }

  ngOnInit() {
  }

  async saveUserForm(){
    if(this.form.valid){
      if(this.userFormData.password !== this.userFormData.repeatPassword){
        await this.presentToast(this.languageData.register.passwordInvalidToast);
      }else{
        console.log('Enviar formulario: ', this.userFormData);
        const postRequest = {
          save: {
            statusId: 1,
            typeId: 1,
            name: this.userFormData.name,
            lastName: this.userFormData.lastName,
            phoneNumber: this.userFormData.phoneNumber,
            email: this.userFormData.email,
            password: this.userFormData.password
          }
        };
        this.registerAccount(postRequest);
      }
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  registerAccount(postRequest){
    this.userService.registerAccount(postRequest)
    .pipe(
      tap(userData => {
      }),
      catchError(async error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe(async (userData: any) =>  {
        console.log('register SUCCESS CALL service', userData);
        if(userData.code === 'OK' && userData.stored === true) {
          this.setUserSession(userData.data);
          await this.presentToast(this.languageData.register.successToast);
          //this.router.navigate(['/verification']);
        }else {
          await this.presentToast(this.languageData.errorToast);
        }
      });
  }

  setUserSession(userData){
    const session = {
      userId: userData.userId,
      name: userData.name,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      status: 1
    };
    localStorage.setItem('user', JSON.stringify(session));
    this.router.navigate(['/verification']);
  }

}
