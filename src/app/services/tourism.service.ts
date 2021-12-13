/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { configConstants } from '../constants/dataConstants';

@Injectable({
  providedIn: 'root'
})
export class TourismService {

  constructor(private http: HttpClient) { }

  path = configConstants.api.baseUrl+configConstants.api.tourism.path;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    })
  };

  getPlaces(): Observable<any> {
    return this.http.get<any>( this.path+configConstants.api.tourism.getAll, {} )
      .pipe();
  }

  getCategories(): Observable<any> {
    return this.http.post<any>( this.path+configConstants.api.tourism.getCategories, {} )
      .pipe();
  }

  searchByLocation(data): Observable<any> {
    console.log('body: ', data);
    return this.http.post<any>( this.path+configConstants.api.tourism.byLocation, data )
      .pipe();
  }

  getById(data): Observable<any> {
    console.log('body: ', data);
    return this.http.post<any>( this.path+configConstants.api.tourism.byId, data )
      .pipe();
  }

  getCommentsById(data): Observable<any> {
    console.log('body: ', data);
    return this.http.post<any>( this.path+configConstants.api.tourism.comments, data )
      .pipe();
  }

  saveComment(postData): Observable<any> {
    console.log('body', postData);
    return this.http.post<any>( this.path+configConstants.api.tourism.setComment, postData )
      .pipe();
  }

  getEvents(){
    return this.http.get<any>( this.path+configConstants.api.tourism.getEvents, {} )
    .pipe();
  }

  userRate(data): Observable<any> {
    console.log('body: ', data);
    return this.http.post<any>( this.path+configConstants.api.tourism.userRate, data )
      .pipe();
  }

  checkFavorite(data): Observable<any> {
    console.log('body: ', data);
    return this.http.post<any>( this.path+configConstants.api.tourism.checkFavorite, data )
      .pipe();
  }

  editFavorite(data): Observable<any> {
    console.log('body: ', data);
    return this.http.post<any>( this.path+configConstants.api.tourism.editFavorite, data )
      .pipe();
  }

  getTouristicPlaceByUserId(data): Observable<any> {
    console.log('body: ', data);
    return this.http.post<any>( this.path+configConstants.api.tourism.placesByFav, data )
      .pipe();
  }
}
