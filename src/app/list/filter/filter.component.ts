import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

  @Input() languageData: any;
  constructor(public modalController: ModalController) { }
  ngOnInit() {

  }
  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
