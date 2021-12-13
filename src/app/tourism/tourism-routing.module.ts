import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TourismPage } from './tourism.page';

const routes: Routes = [
  {
    path: '',
    component: TourismPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TourismPageRoutingModule {}
