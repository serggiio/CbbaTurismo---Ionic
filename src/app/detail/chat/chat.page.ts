import { Component, OnInit } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared/sharedDetail.service';
import { TourismService } from 'src/app/services/tourism.service';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  touristicPlaceId: any;
  comentaryData: any;
  dataLength: any;
  userData: any;
  commentaryText: string;
  languageData: any;
  constructor(public sharedService: SharedService,
    private tourismService: TourismService) {
      this.languageData = getLanguageData();
    }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('user'));
    console.log('user on Init', this.userData);
  }

  async ionViewWillEnter() {
    console.log('OBTENIDO SHARED SERVICE', this.sharedService.detailId);
    this.touristicPlaceId = this.sharedService.detailId;
    await this.getCommentsById();
  }

  getCommentsById(){
    const postRequest = {
      touristicPlace: {
        id: this.touristicPlaceId
      }
    };
    this.tourismService.getCommentsById(postRequest)
    .pipe(
      tap(response => {
      }),
      catchError(error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe(async (response: any) =>  {
        this.comentaryData = response.data;
        console.log('respuesta on page', response);
        this.dataLength = this.comentaryData.length;
      });
  }

  async deleteCommentary(id){
    console.log('Id a eliminar', id);
    if(this.userData.userId){
      const deleteData = {
        action: 'delete',
        data: {
          userId: this.userData.userId,
          touristicPlaceId: this.touristicPlaceId,
          commentaryId: id
        }
      };
      await this.commentAction(deleteData);
    }
  }

  async saveCommentary(){
    if(this.commentaryText && this.commentaryText !== ''){
      console.log('A guardar', this.commentaryText);
      if(this.userData.userId){
        const saveData = {
          action: 'save',
          data: {
            userId: this.userData.userId,
            touristicPlaceId: this.touristicPlaceId,
            commentaryDesc: this.commentaryText
          }
        };
        console.log('Post BODY: ', saveData);
        await this.commentAction(saveData);
      }
    }
  }

  commentAction(request){
    this.tourismService.saveComment(request)
    .pipe(
      tap(response => {
      }),
      catchError(error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe(async (response: any) =>  {
        console.log('Commentary response', response);
        if(response.code === 'OK'){
          this.comentaryData = response.data;
        }
      });
  }


}
