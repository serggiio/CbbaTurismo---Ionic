/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/services/shared/sharedDetail.service';
import { Geolocation } from '@capacitor/geolocation';
import { TourismService } from '../../services/tourism.service';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { google } from 'google-maps';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: google.maps.Map;
  touristicPlaceId: any;
  detailData: any;
  watchLocation = null;
  currentLocation: any;
  userMarker: any;
  mapMarkers = [];
  latitude: any;
  longitude: any;
  distanceAprox: string;
  directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  routeServiceResponse: any;
  constructor(
    public sharedService: SharedService, private tourismService: TourismService, private router: Router) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.touristicPlaceId = this.sharedService.detailId;
    await this.getTouristicPlaceById();
    this.loadMap();
    await this.startTracking();
    console.log('OBTENIDO SHARED SERVICE', this.sharedService.longitude);
  }

  async ionViewWillLeave() {
    //await this.stopTraking();
    location.reload();
  }

  loadMap() {
    const latLng = new google.maps.LatLng(-17.3709969, -66.1593763);

    const mapOptions = {
      center: latLng,
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  startTracking() {
    console.log('watch position start');
    this.watchLocation = Geolocation.watchPosition({timeout: 20000, enableHighAccuracy: true, maximumAge: 3600}, async (position, err) => {
      console.log('new position: ', position);
      console.log('new position: err  ', err);
      if(position) {
        //this.currentLocation = position.coords;
        this.currentLocation = {
          latitude: -17.3709969,
          longitude: -66.1593763
        };
        //before add a marker delete all old user markers
        if(this.userMarker !== undefined) {
          this.userMarker.setMap(null);
        }
        this.addLocation(
          -17.3709969, //position.coords.latitude, TODO
          -66.1593763, //position.coords.longitude, TODO
          null,// google.maps.Animation.BOUNCE,
          '../../../assets/userMarker.png',
          'user'
        );
        if(this.latitude && this.longitude){
          await this.displayRoute(this.latitude, this.longitude);
          this.getDistance(this.latitude, this.longitude);
        }
      }
    });
  }

  getDistance(lat, lon){
    try {
      const distanceRes = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(this.currentLocation.latitude, this.currentLocation.longitude),
        new google.maps.LatLng(lat, lon));

        if(distanceRes && distanceRes > 0) {
          const fixedNumber = distanceRes * 0.001;
          this.distanceAprox = 'Aprox. ' + fixedNumber.toFixed(2) + ' Km.';
        }else {
          this.distanceAprox = '';
        }
    } catch (error) {
      this.distanceAprox = '';
    }
  }

  async stopTraking() {
    console.log('Watch position stop');
    await Geolocation.clearWatch({ id: this.watchLocation });
  }

  addLocation(lat, lng, animation?, icon?, type?) {
    type = type || 'place';
    const location = new google.maps.LatLng(lat, lng);
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: 'User actual position!',
      animation,
      icon: icon || null
    });
    type === 'user' ? this.userMarker = marker : this.mapMarkers.push(marker);
    this.map.setCenter(location);
    this.map.setZoom(15);
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
    this.latitude = detail.latitude;
    this.longitude = detail.longitude;
    this.addLocation(
      this.latitude, //position.coords.latitude, TODO
      this.longitude, //position.coords.longitude, TODO
      null,// google.maps.Animation.BOUNCE,
      '../../../assets/locationMarker.png',
      null
    );
  }

  displayRoute(originLat, originLng) {
    const waypts: google.maps.DirectionsWaypoint[] = [];
    this.directionsService
      .route({
        origin: new google.maps.LatLng(this.currentLocation.latitude, this.currentLocation.longitude),
        destination: new google.maps.LatLng(originLat, originLng),
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        this.routeServiceResponse = response;
        this.directionsRenderer.setMap(null);
        this.directionsRenderer.setMap(this.map);
        this.directionsRenderer.setOptions({suppressMarkers: true});
        this.directionsRenderer.setDirections(this.routeServiceResponse);
      })
      .catch((e) => window.alert('Directions request failed  ' + status));

  }

}
