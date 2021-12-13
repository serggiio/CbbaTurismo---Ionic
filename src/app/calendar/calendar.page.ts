import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import { EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TourismService } from '../services/tourism.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  calendar = {
    step: 30 as Step,
    mode: 'month' as CalendarMode,
    currentDate: new Date(),
  };
  eventSource = [];
  eventData: any;
  viewTitle;
  isToday: boolean;
  serviceCalled = false;

  constructor(private tourismService: TourismService, private router: Router) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getEvents();
  }

  onEventSelected(event){
    console.log('Evento ', event);
    this.router.navigate(['detail/'+event.id]);
  }

  loadEvents(events) {
    events.forEach(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      this.eventSource.push({
        title: event.placeName,
        startTime: startDate,
        endTime: endDate,
        allDay: true,
        id: event.touristicPlaceId
      });
    });
    console.log('Events loaded: ', this.eventSource);
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  getEvents() {
    this.tourismService.getEvents()
    .pipe(
      tap(events => {
      }),
      catchError(error => {
        console.log('Error_ ', error);
        return EMPTY;
      })
    )
      .subscribe((events: any) =>  {
        this.serviceCalled = true;
        this.eventData = events.data;
        console.log('Resp', this.eventData);
        if(this.eventData.length > 0){
          this.loadEvents(this.eventData);
        }
      });
  }

}
