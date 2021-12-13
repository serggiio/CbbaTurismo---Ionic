/* eslint-disable arrow-body-style */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPlaces'
})
export class FilterPlacesPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {return [];}
    if (!searchText) {return items;}

    return items.filter(item => {
      return Object.keys(item).some(key => {
        const invalidFields = [
          'touristicPlaceId', 'latitude', 'longitude', 'mainVideo', 'mainImage', 'history', 'description', 'userId', 'provinceId',
          'placeStatusId', 'startDate', 'endDate', 'created_at', 'updated_at', 'gallery'
        ];
        if(!invalidFields.includes(key)) {
          return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
        }
      });
    });
   }
}
