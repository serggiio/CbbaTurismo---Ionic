import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  @ViewChild('formAdd', {static: false})
  form: FormControl;
  userData: any;
  userFromDB: any;
  userFormData = {
    email: '',
    code: ''
  };
  constructor(private router: Router, private userService: UserService, public toastController: ToastController) { }

  async ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('user'));
    console.log('user on Init', this.userData);
    if(this.userData){
      await this.getUserProfile(this.userData.userId);
      //validate status and confirmation code
    }
  }

  validateUser(){
    if(this.form.valid){
      console.log('Validacion a enviar', this.userFormData);
      const postRequest = {
        email: this.userFormData.email,
        verificationCode: this.userFormData.code
      };
      this.verificateCode(postRequest);
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
          console.log('GETT,', userData.data);
          if(userData.data.statusId === 1 && userData.data.verificationCode){
            this.userFormData.email = this.userData.email;
          }
        }
      });
  }

  verificateCode(postRequest){
    this.userService.verificateCode(postRequest)
    .pipe(
      tap(userData => {
      }),
      catchError(async error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe(async (userData: any) =>  {
        console.log('validate SUCCESS CALL service', userData);
        if(userData.code === 'OK' && userData.data) {
          this.setUserSession(userData.data);
          await this.presentToast('Proceso de validación completo!');
          this.router.navigate(['/home']);
        }else{
          await this.presentToast('Los datos proporcionados no coinciden');
        }
      });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
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

}
