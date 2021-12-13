import { Component, OnInit } from '@angular/core';
import { getLanguageData, availableLanguages, getLanguageCode, setLanguageByCode } from 'src/app/services/shared/sharedDetail.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  languageData: any;
  availableLanguages: any;
  languageCode: any;
  constructor(public toastController: ToastController) {
    this.languageData = getLanguageData();
    this.availableLanguages = availableLanguages;
    this.languageCode = getLanguageCode();
  }

  ngOnInit() {
  }

  async onChange(event){
    setLanguageByCode(event.detail.value);
    this.languageCode = getLanguageCode();
    this.languageData = getLanguageData();
    await this.presentToast(this.languageData.settings.message);
    location.reload();

  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
