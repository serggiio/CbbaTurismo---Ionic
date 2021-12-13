import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('formAdd', {static: false})
  form: FormControl;
  userData: any;
  userFormData = {
    name: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  };
  languageData: any;
  constructor(private router: Router, private userService: UserService, public toastController: ToastController) {
    this.languageData = getLanguageData();
   }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('user'));
    console.log('user on Init', this.userData);
    if(!this.userData){
      this.router.navigate(['/home']);
    }else{
      this.getUserProfile(this.userData.userId);
    }
  }

  getUserProfile(id){
    this.userService.getUserById({get: {userId: id}})
    .pipe(
      tap(userData => {
      }),
      catchError(async error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe(async (userData: any) =>  {
        console.log('Profile SUCCESS CALL service', userData);
        if(userData.code === 'Ok' && userData.get === true) {
          if(userData.data.statusId !== 2){
            await this.presentToast(this.languageData.profile.errorStatusToast);
            this.router.navigate(['/verification']);
          }else{
            this.setUserSession(userData.data);
          }
        }else {
          await this.presentToast(this.languageData.profile.errorToast);
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
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.userFormData.name = session.name;
    this.userFormData.lastName = session.lastName;
    this.userFormData.email = session.email;
    this.userFormData.phoneNumber = session.phoneNumber;
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  updateUserForm(){
    if(this.form.valid && this.form.dirty){
      const postRequest = {
        id: this.userData.userId,
        data: this.userFormData
      };
      console.log('Enviar formulario: ', this.userFormData);
      console.log('Post request: ', postRequest);
      this.updateProfile(postRequest);
    }
  }

  updateProfile(postRequest){
    this.userService.updateProfile(postRequest)
    .pipe(
      tap(userData => {
      }),
      catchError(async error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe(async (userData: any) =>  {
        console.log('Profile update SUCCESS CALL service', userData);
        if(userData.code === 'OK' && userData.update === true) {
          this.setUserSession(userData.data);
          await this.presentToast(this.languageData.profile.successToast);
        }else {
          await this.presentToast(this.languageData.profile.errorToast);
        }
      });
  }

}
