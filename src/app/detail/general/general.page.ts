/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared/sharedDetail.service';
import { TourismService } from 'src/app/services/tourism.service';
import { configConstants } from 'src/app/constants/dataConstants';
import { ModalController } from '@ionic/angular';
import { ProductComponent } from './product/product.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.page.html',
  styleUrls: ['./general.page.scss'],
})
export class GeneralPage implements OnInit {

  // eslint-disable-next-line max-len
  sharingUrl = 'https://fast-eyrie-03100.herokuapp.com/api/touristicPlace/mainImage/';
  shareMessage = 'Visita el lugar turístico! ';
  messageLocation = '. En la siguiente ubicación: ';

  userData: any;
  userActualRate: any = 'Selecciona';
  userFavorite = false;
  userRateColor: string;

  touristicPlaceId: any;
  detailData: any;
  serviceData: any;
  name: string;
  gallery: any = [];
  product: any = [];
  history: string;
  businessHours: string;
  webAddress: string;
  contactInfo: string;
  latitude: any;
  longitude: any;
  province: string;
  rate: number;
  streets: string;
  tags: any = [];
  type: string;
  urlImage = configConstants.api.baseUrl+configConstants.api.tourism.path+configConstants.api.tourism.mainImage;
  urlTagImage = configConstants.api.baseUrl+configConstants.api.tourism.path+configConstants.api.tourism.tagImage;
  mainImage = '';
  fullImage = this.urlImage + this.sharedService.detailId;
  languageData: any;
  @Input('header') header: any;
  constructor(
    public sharedService: SharedService,
    private tourismService: TourismService, private router: Router,
    private render: Renderer2, public modalController: ModalController,
    private socialSharing: SocialSharing) {
      this.languageData = getLanguageData();
      this.shareMessage = this.languageData.detail.general.shareMessage;
      this.messageLocation = this.languageData.detail.general.messageLocation;
     }

  async ngOnInit() {
    console.log('OBTENIDO SHARED SERVICE', this.sharedService.detailResponse);
    console.log(this.sharedService.detailId);
    this.touristicPlaceId = this.sharedService.detailId;
    await this.getTouristicPlaceById();
    console.log(this.sharedService.detailResponse);
    this.mainImage = this.urlImage+this.sharedService.detailId;

    this.userData = JSON.parse(localStorage.getItem('user'));
    console.log('user on Init', this.userData);

    if(this.userData){
      const postRequest = {
        userId: this.userData.userId,
        touristicPlaceId: this.sharedService.detailId
      };
      this.getSetActualUserRate(postRequest);
      this.getFavoriteStatus(postRequest);
    }
  }

  getTouristicPlaceById(){
    const postRequest = {
      touristicPlace: {
        id: this.touristicPlaceId
      }
    };
    this.tourismService.getById(postRequest)
    .pipe(
      tap(place => {
      }),
      catchError(error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe(async (place: any) =>  {
        this.detailData = place.data;
        this.name = this.detailData.placeName;
        console.log('respuesta on page', place);
        if(place.code !== 'OK' || !place.get){
          this.router.navigate(['home']);
        }else {
          await this.setValues(this.detailData);
        }
      });
  }

  setValues(detail){
    this.name = detail.placeName.toUpperCase();
    this.gallery = detail.gallery;
    this.product = detail.product;
    this.history = detail.history;
    this.businessHours = detail.businessHours;
    this.webAddress = detail.web;
    this.contactInfo = detail.contact;
    this.latitude = detail.latitude;
    this.longitude = detail.longitude;
    this.province = detail.provinceName;
    this.rate = Math.floor(detail.rateAvg);
    //this.rate = Math.floor(5);
    this.streets = detail.streets;
    this.tags = detail.tagList;
    this.type = detail.type;
    this.sharedService.latitude = detail.latitude;
    this.sharedService.longitude = detail.longitude;
    this.sharedService.galleries = detail.gallery;

    this.messageLocation +=
    'https://www.google.com/maps/search/?api=1&query='+ this.latitude || -17.3862543 +','+this.longitude || -66.1680174;
    this.shareMessage += this.name;
    this.sharingUrl += this.sharedService.detailId;
  }

  lastX: any;
  scrollingAction(event){
    if(event.detail.scrollTop > Math.max(0, this.lastX)){
      this.render.setStyle(this.header, 'margin-top', `-${this.header.clientHeight}px`);
      this.render.setStyle(this.header, 'transition', 'margin-top 400ms');
    }else {
      this.render.setStyle(this.header, 'margin-top', '0');
    }
    this.lastX = event.detail.scrollTop;
  }

  scrollStart(header){
    this.header = header.el;
  }

  async showProducts(){
    console.log('Open modal product: ');
    const modal = await this.modalController.create({
      component: ProductComponent,
      componentProps: {
        products: this.product
      }
    });
    return await modal.present();
  }

  onChange(rate){
    console.log('rate to set');
    console.log(rate.detail.value);
    const postRequest = {
      userId: this.userData.userId,
      touristicPlaceId: this.sharedService.detailId,
      puntuacion: rate.detail.value
    };
    this.getSetActualUserRate(postRequest);
  }
//this.sharingUrl
  shareSocial(){
    console.log('On share');
    this.socialSharing.share(this.shareMessage + this.messageLocation , this.name,
      null, 'http://fast-eyrie-03100.herokuapp.com')
    .then(() => {
      console.log('success on share');
    }).catch((e) =>{
      console.log('Error on FB');
      console.log(e);
    });
  }

  getSetActualUserRate(postRequest){
    this.tourismService.userRate(postRequest)
    .pipe(
      tap(data => {
      }),
      catchError(error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe(async (data: any) =>  {
        console.log('respuesta on page rate', data);
        if(data.code !== 'OK' || !data.get){
          //this.router.navigate(['home']);
        }else {
          if(data.data) {
            await this.setRateValues(data.data);
          }
        }
      });
  }

  getFavoriteStatus(postRequest){
    this.tourismService.checkFavorite(postRequest)
    .pipe(
      tap(data => {
      }),
      catchError(error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe(async (data: any) =>  {
        console.log('respuesta on page fav', data);
        if(data.code !== 'OK' || !data.get){
          //this.router.navigate(['home']);
          this.userFavorite = false;
        }else {
          if(data.data) {
            await this.setFavValues(data.data);
          }
        }
      });
  }

  editFavoriteStatus(postRequest){
    this.tourismService.editFavorite(postRequest)
    .pipe(
      tap(data => {
      }),
      catchError(error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe(async (data: any) =>  {
        console.log('respuesta on edit fav', data);
        if(data.code !== 'OK' || !data.get){
          //this.router.navigate(['home']);
          this.userFavorite = false;
        }else {
          console.log('edit favorite response');
          console.log(data);
        }
      });
  }

  setFavValues(data){
    console.log('set rate', data);
    this.userFavorite = false;
    if(data){
      this.userFavorite = true;
    }else {
      this.userFavorite = false;
    }

  }

  setRateValues(data){
    if(data.puntuacion > 0){
      this.userActualRate = '';
      for (let index = 0; index < data.puntuacion; index++) {
        this.userActualRate += '⭐';
      }
    }else {
      this.userActualRate = 'Selecciona';
    }

  }

  setFavorite(action){
    if(this.userData){
      const favRequest = {
        action: '',
        data: {
          userId: this.userData.userId,
          touristicPlaceId: this.sharedService.detailId
        }
      };

      if(action === 'save' ) {
        console.log('Se establecera un favorito para el usuario', this.userData.userId, this.touristicPlaceId);
        this.userFavorite = true;
        favRequest.action = 'save';
      }else {
        console.log('Se eliminara un favorito para el usuario', this.userData.userId, this.touristicPlaceId);
        this.userFavorite = false;
        favRequest.action = 'delete';
      }
      this.editFavoriteStatus(favRequest);
    }
  }

}
