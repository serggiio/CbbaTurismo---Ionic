import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeneralPageRoutingModule } from './general-routing.module';

import { GeneralPage } from './general.page';
import { ExpandableHeaderComponent } from '../expandable-header/expandable-header.component';
import { ProductComponent } from './product/product.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneralPageRoutingModule
  ],
  declarations: [GeneralPage, ExpandableHeaderComponent, ProductComponent]
})
export class GeneralPageModule {}
