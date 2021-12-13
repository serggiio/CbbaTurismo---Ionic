/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { google } from 'google-maps';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TourismService } from '../services/tourism.service';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  map: google.maps.Map;
  tourismData: any = [];
  mapMarkers = [];
  markerData: any = null;

  languageData: any;

  @ViewChild('map') mapElement: ElementRef;
  constructor(private tourismService: TourismService, private router: Router) {
    this.languageData = getLanguageData();
   }

  /*click(event: google.maps.MouseEvent) {
    google.maps.event.addListener(this.mapMarkers[i], 'click', () => {
      infoWindows[i].open(map, markers[i]);
  });
  }*/

  async ngOnInit() {
    await this.getTouristicPlaces();
  }

  ionViewWillEnter() {
    this.loadMap();
  }

  loadMap() {
    const latLng = new google.maps.LatLng(-17.3709969, -66.1593763);

    const mapOptions = {
      center: latLng,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  getTouristicPlaces() {
    this.tourismService.getPlaces()
    .pipe(
      tap(places => {
        console.log('Lugares', places);
      }),
      catchError(error => {
        console.log('Error_ show message', error);
        //return of([]);
        //catch and replace
        return EMPTY;
      })
    )
      .subscribe(async (places: any) =>  {
        this.tourismData = places;
        console.log('Lugares 2', places);
        await this.addMarkersToMap();
      });
  }

  addMarkersToMap() {
    //console.log('Add to map number: ', this.tourismData.data);
    for (const element in this.tourismData.data) {
      this.addLocation(
        this.tourismData.data[element],
        null,
        '../../../assets/locationMarker.png',
        'place'
      );
    }
  }

  addLocation(data, animation?, icon?, type?) {
    type = type || 'place';
    const location = new google.maps.LatLng(data.latitude, data.longitude);
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: JSON.stringify(data),
      animation,
      icon: icon || null
    });
    //this.map.setCenter(location);
    this.mapMarkers.push(marker);
    this.map.setZoom(13);
  }

  mapListener(event){
    for(const n in this.mapMarkers){
      this.mapMarkers[n].addListener('click', () => {
        this.map.setZoom(16);
        this.map.setCenter(this.mapMarkers[n].getPosition());
        //console.log('Event data: ', this.mapMarkers[n].getTitle());
        this.markerData = JSON.parse(this.mapMarkers[n].getTitle());
      });
    }
  }

  goToDetail(id){
    console.log('IDD: ', id);
    this.router.navigate(['detail/'+id]);
  }

}
