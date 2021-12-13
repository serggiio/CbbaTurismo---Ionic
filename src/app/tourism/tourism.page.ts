/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TourismService } from '../services/tourism.service';

@Component({
  selector: 'app-tourism',
  templateUrl: './tourism.page.html',
  styleUrls: ['./tourism.page.scss'],
})
export class TourismPage implements OnInit {
  detailData: any;
  touristicPlaceId: any;
  palceName = '';
  testImage = 'https://fast-eyrie-03100.herokuapp.com/api/touristicPlace/mainImage/';
  @Input('header') header: any;
  constructor(private route: ActivatedRoute, private render: Renderer2, private tourismService: TourismService, private router: Router) { }

  async ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    this.touristicPlaceId = Number(routeParams.get('id'));
    await this.getTouristicPlaceById();
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
        this.detailData = place.data;
        this.palceName = this.detailData.placeName;
        console.log('respuesta on page', place);
        if(place.code !== 'OK' || !place.get){
          this.router.navigate(['home']);
        }
        //this.detailData.data.rateAvg = 5;
      });
  }

}
