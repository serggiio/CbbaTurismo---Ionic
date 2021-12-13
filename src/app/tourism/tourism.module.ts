import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TourismPageRoutingModule } from './tourism-routing.module';

import { TourismPage } from './tourism.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TourismPageRoutingModule
  ],
  declarations: [TourismPage]
})
export class TourismPageModule {}
