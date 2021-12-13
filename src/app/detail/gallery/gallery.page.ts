import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared/sharedDetail.service';
import { TourismService } from 'src/app/services/tourism.service';
import { configConstants } from 'src/app/constants/dataConstants';
import { ModalController } from '@ionic/angular';
import { DetailImageComponent } from './detail-image/detail-image.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {

  touristicPlaceId: any;
  detailData: any;
  galleriesData: any;
  urlImage = configConstants.api.baseUrl+configConstants.api.tourism.path+configConstants.api.tourism.image;
  coverImage: any;
  shownGroup = null;
  constructor(
    public sharedService: SharedService,
    private tourismService: TourismService, private router: Router, public modalController: ModalController
    ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    console.log('OBTENIDO SHARED SERVICE', this.sharedService.detailId);
    this.touristicPlaceId = this.sharedService.detailId;
    await this.getTouristicPlaceById();
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
        console.log('respuesta on page', place);
        if(place.code !== 'OK' || !place.get){
          this.router.navigate(['home']);
        }else {
          await this.setValues(this.detailData);
        }
      });
  }

  setValues(detail){
    this.galleriesData = detail.gallery;

    console.log('Gallery data: ', this.galleriesData);
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };

  async imageModal(url){
    console.log('Se abrira: ' + url);
    const modal = await this.modalController.create({
      component: DetailImageComponent,
      componentProps: {
        image: url
      }
    });
    return await modal.present();
  }

}
