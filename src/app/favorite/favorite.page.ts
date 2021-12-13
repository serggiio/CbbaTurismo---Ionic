import { Component, OnInit } from '@angular/core';
import { EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TourismService } from 'src/app/services/tourism.service';
import { Router } from '@angular/router';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {

  userData: any;
  tourismData: any = [];
  languageData: any;
  constructor(private tourismService: TourismService, private router: Router) {
    this.languageData = getLanguageData();
   }

  async ngOnInit() {
    this.setInitialData();
  }

  async ionViewWillEnter() {
    this.setInitialData();
  }

  async setInitialData(){
    this.userData = JSON.parse(localStorage.getItem('user'));
    console.log('user on Init', this.userData);
    if(this.userData){
      await this.getTouristicPlaceByUserId();
    }else {
      //redirect home
    }
  }

  getTouristicPlaceByUserId(){
    const postRequest = {
      userId: this.userData.userId
    };
    this.tourismService.getTouristicPlaceByUserId(postRequest)
    .pipe(
      tap(places => {
      }),
      catchError(error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe(async (places: any) =>  {
        console.log('respuesta on favList', places);
        if(places.code !== 'OK' || !places.get){
          //this.router.navigate(['home']);
        }else {
          this.tourismData = places.data;
          console.log('Mapeado', this.tourismData);
        }
      });
  }


  goToDetail(id){
    this.router.navigate(['detail/'+id]);
  }
}
