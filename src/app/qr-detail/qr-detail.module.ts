import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrDetailPageRoutingModule } from './qr-detail-routing.module';

import { QrDetailPage } from './qr-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrDetailPageRoutingModule
  ],
  declarations: [QrDetailPage]
})
export class QrDetailPageModule {}
