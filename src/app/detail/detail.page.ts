import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SharedService } from '../services/shared/sharedDetail.service';
import { TourismService } from '../services/tourism.service';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  detailData: any;
  touristicPlaceId: any;
  languageData: any;
  constructor(
    private route: ActivatedRoute, private sharedService: SharedService, private tourismService: TourismService) {
      this.languageData = getLanguageData();
    }

  async ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    this.touristicPlaceId = Number(routeParams.get('id'));
    console.log('DETAIL ID: ', routeParams.get('id'));
    this.sharedService.detailId = this.touristicPlaceId;
    //await this.getTouristicPlaceById();
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
      .subscribe((place: any) =>  {
        console.log('service1 respo ', place);
        this.sharedService.detailResponse = place;
        if(place.code === 'OK' && place.get){
        }
        //this.detailData.data.rateAvg = 5;
      });
  }


}
