import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { getLanguageData } from 'src/app/services/shared/sharedDetail.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  @Input() products: any;
  urlImage = 'https://fast-eyrie-03100.herokuapp.com/api/touristicPlace/productImg/';
  languageData: any;
  constructor(public modalController: ModalController) {
    this.languageData = getLanguageData();
  }

  ngOnInit() {
    console.log('Productos', this.products);
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
