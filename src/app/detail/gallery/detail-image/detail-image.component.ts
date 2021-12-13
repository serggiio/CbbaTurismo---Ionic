import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detail-image',
  templateUrl: './detail-image.component.html',
  styleUrls: ['./detail-image.component.scss'],
})
export class DetailImageComponent implements OnInit {

  @Input() image: string;
  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  dismiss(){
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
