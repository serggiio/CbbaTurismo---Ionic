import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, Observer } from 'rxjs';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-detail-image',
  templateUrl: './detail-image.component.html',
  styleUrls: ['./detail-image.component.scss'],
})
export class DetailImageComponent implements OnInit {

  @Input() image: string;
  @Input() name: string;
  base64Image: string;
  constructor(public modalController: ModalController, private socialSharing: SocialSharing) { }

  ngOnInit() {}

  dismiss(){
    this.modalController.dismiss({
      dismissed: true
    });
  }

  shareImage(){
    console.log('Se compartira estito', this.image);
    this.base64Image = null;
    this.getBase64ImageFromURL(this.image).subscribe(base64data => {
      console.log(base64data);
      this.base64Image = 'data:image/jpg;base64,'+base64data;
      this.shareAction(this.base64Image);
    }, err => {
      //console.log('Error base64 image', err);
      this.base64Image = null;
      this.shareAction(this.base64Image);
    });
  }

  shareAction(imageBase64){
    const message = 'Visita el lugar turístico: ' + this.name + ' Obten la app: https://fast-eyrie-03100.herokuapp.com/';
    this.socialSharing.share(message , this.name, imageBase64, null)
    .then(() => {
      console.log('success on share');
    }).catch((e) =>{
      console.log('Error on FB');
      console.log(e);
    });
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

}
