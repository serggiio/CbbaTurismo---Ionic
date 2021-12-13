/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ModalController } from '@ionic/angular';
import { configConstants } from '../constants/dataConstants';

@Component({
  selector: 'app-preview-detail',
  templateUrl: './preview-detail.component.html',
  styleUrls: ['./preview-detail.component.scss'],
})
export class PreviewDetailComponent implements OnInit {

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  @ViewChild('slideWithNav2', { static: false }) slideWithNav2: IonSlides;
  @ViewChild('slideWithNav3', { static: false }) slideWithNav3: IonSlides;

  @Input() data: any;

  touristicPlaceId: any;
  sliderOne: any;
  arraySize = 5;
  galleries: any;
  images: any = [];
  urlImage = configConstants.api.baseUrl+configConstants.api.tourism.path+configConstants.api.tourism.image;

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };

  constructor(public modalController: ModalController, private router: Router) {
    //Item object for Nature
    this.sliderOne =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: []
    };

  }

  ngOnInit() {
    console.log('Llego daa: ', this.data);
    this.galleries = this.data.gallery;
    this.touristicPlaceId = this.data.touristicPlaceId;
    this.setImages();
  }

  setImages(){
    this.galleries.forEach(element => {
      element.images.forEach(image => {
        if(this.images.length < 6){
          this.images.push(image);
        }
      });
    });
    this.sliderOne.slidesItems = this.images.slice(0, this.arraySize);
    console.log('total images: ', this.sliderOne.slidesItems);
  }

    //Move to Next slide
    slideNext(object, slideView) {
      slideView.slideNext(500).then(() => {
        this.checkIfNavDisabled(object, slideView);
      });
    }
    //Move to previous slide
    slidePrev(object, slideView) {
      slideView.slidePrev(500).then(() => {
        this.checkIfNavDisabled(object, slideView);
      });;
    }
    //Method called when slide is changed by drag or navigation
    SlideDidChange(object, slideView) {
      this.checkIfNavDisabled(object, slideView);
    }
    //Call methods to check if slide is first or last to enable disbale navigation
    checkIfNavDisabled(object, slideView) {
      this.checkisBeginning(object, slideView);
      this.checkisEnd(object, slideView);
    }
    checkisBeginning(object, slideView) {
      slideView.isBeginning().then((istrue) => {
        object.isBeginningSlide = istrue;
      });
    }
    checkisEnd(object, slideView) {
      slideView.isEnd().then((istrue) => {
        object.isEndSlide = istrue;
      });
    }

    closeModal(){
      this.modalController.dismiss({
        dismissed: true
      });
    }

    async nextView(id){
      this.router.navigate(['detail/'+id]);
      await this.closeModal();
    }

}
