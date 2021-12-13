/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { TourismService } from './../services/tourism.service';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { google } from 'google-maps';
import { Router } from '@angular/router';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  languageData: any;

  map: google.maps.Map;
  directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  routeServiceResponse: any;
  watchLocation = null;
  currentLocation: any;
  userMarker: any;
  mapMarkers = [];
  status = null;
  tourismData: any = [];
  categories: any = [];
  categoryPlaceHolder = 'Categoría';
  errorMessage: any = '';
  selectedCategory = '';
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('distanceElem') distanceElem: ElementRef;

  constructor(private tourismService: TourismService, private router: Router) {
    this.languageData = getLanguageData();
    this.categoryPlaceHolder = this.languageData.location.categoryHeader;
   }

  async ngOnInit() {
    await this.startTracking();
    await this.getTouristicPlaces();
    await this.getCategories();
  }

  ionViewWillEnter() {
    this.loadMap();
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

  async stopTraking() {
    console.log('Watch position stop');
    await Geolocation.clearWatch({ id: this.watchLocation });
  }

  startTracking() {
    this.watchLocation = Geolocation.watchPosition({}, (position, err) => {
      console.log('new position: ', position);
      console.log('new position: err  ', err);
      if(position) {
        this.currentLocation = position.coords;
        /*this.currentLocation = {
          latitude: -17.3709969,
          longitude: -66.1593763
        };*/
        //before add a marker delete all old user markers
        if(this.userMarker !== undefined) {
          this.userMarker.setMap(null);
        }

        this.addLocation(
          position.coords.latitude,//-17.3709969, //,  TODO
          position.coords.longitude,//-66.1593763, //, TODO
          null,// google.maps.Animation.BOUNCE,
          '../../../assets/userMarker.png',
          'user'
        );
      }

    });
  }

  addLocation(lat, lng, animation?, icon?, type?) {
    console.log('before add', lat, lng);
    type = type || 'place';
    const location = new google.maps.LatLng(lat, lng);
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: 'User actual position!',
      animation,
      icon: icon || null
    });
    type == 'user' ? this.userMarker = marker : this.mapMarkers.push(marker);
    this.map.setCenter(location);
    this.map.setZoom(15);
  }

  getTouristicPlaces() {
    this.tourismService.getPlaces()
    .pipe(
      tap(places => {
        console.log('Lugares', places);
      }),
      catchError(error => {
        console.log('Error_ ', error);
        this.errorMessage = error;
        //return of([]);
        //catch and replace
        return EMPTY;
      })
    )
      .subscribe((places: any) =>  {
        this.tourismData = places;
      });
  }

  routeService(data) {
    this.deleteOldMarkers();
    this.addLocation(data.latitude, data.longitude, google.maps.Animation.BOUNCE, '../../../assets/locationMarker.png', 'place');
    this.displayRoute(data.latitude, data.longitude);
  }

  deleteOldMarkers() {
    // eslint-disable-next-line guard-for-in
    for(const n in this.mapMarkers){
      this.mapMarkers[n].setMap(null);
    }
  }

  displayRoute(originLat, originLng) {
    const waypts: google.maps.DirectionsWaypoint[] = [];
    this.directionsService
      .route({
        origin: new google.maps.LatLng(this.currentLocation.latitude, this.currentLocation.longitude),
        destination: new google.maps.LatLng(originLat, originLng),
        travelMode: google.maps.TravelMode.WALKING,
      })
      .then((response) => {
        console.log('respuesta de servicio::::');
        console.log(response);
        this.routeServiceResponse = response;
        this.directionsRenderer.setMap(null);
        this.directionsRenderer.setMap(this.map);
        this.directionsRenderer.setOptions({suppressMarkers: true});
        this.directionsRenderer.setDirections(this.routeServiceResponse);
      })
      .catch((e) => window.alert('Directions request failed due to ' + status));

  }

  getCategories() {
    this.tourismService.getCategories()
    .pipe(
      tap(categories => {
        console.log('Categorias', categories);
      }),
      catchError(error => {
        console.log('Error_ ', error);
        //return of([]);
        //catch and replace
        return EMPTY;
      })
    )
      .subscribe((categories: any) =>  {
        this.categories = categories;
      });
  }

  onCategoryChange($event){
    this.selectedCategory = $event.target.value;
    console.log($event.target.value);
  }

  goToDetail(id){
    this.router.navigate(['detail/'+id]);
  }

  serviceByLocation(){
    const postRequest = {
      data: {
        latitude: this.currentLocation.latitude,
        longitude: this.currentLocation.longitude,
        category: this.selectedCategory,
        distance: this.distanceElem.nativeElement.value
      }
    };
    if(!this.selectedCategory){
      delete postRequest.data.category;
    }
    if(!this.distanceElem.nativeElement.value){
      return;
    }

    console.log('Service post request: ', postRequest);

    this.tourismService.searchByLocation(postRequest)
    .pipe(
      tap(places => {
        console.log('Retorno: ', places);
      }),
      catchError(error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe((places: any) =>  {
        console.log(places.data.length);
        this.tourismData = places;
        this.tourismData.data.forEach(element => {
          element.rateAvg = 5;
        });
      });


  }

}
