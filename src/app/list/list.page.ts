import { Component, OnInit } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TourismService } from '../services/tourism.service';
import { FilterComponent } from './filter/filter.component';
import { ModalController } from '@ionic/angular';
import { PreviewDetailComponent } from '../preview-detail/preview-detail.component';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  tourismData: any = [];
  filterText: string;
  languageData: any;

  constructor(private tourismService: TourismService, public modalController: ModalController) {
    this.languageData = getLanguageData();
  }

  async ngOnInit() {
    await this.getTouristicPlaces();
  }

  getTouristicPlaces() {
    this.tourismService.getPlaces()
    .pipe(
      tap(places => {
      }),
      catchError(error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe((places: any) =>  {
        this.tourismData = this.mapData(places);
        console.log('Mapeado', this.tourismData.data);
      });
  }

  mapData(places){
    places.data.forEach(place => {
      place.type = place.type === 'place'? this.languageData.list.placeType : this.languageData.list.eventType;
      //place.rateAvg = 5;
    });
    return places;
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: FilterComponent,
      componentProps: {
        languageData: this.languageData
      }
    });
    return await modal.present();
  }

  async goToDetail(data){
    const modal = await this.modalController.create({
      component: PreviewDetailComponent,
      componentProps: {
        data
      }
    });
    return await modal.present();
  }


}
